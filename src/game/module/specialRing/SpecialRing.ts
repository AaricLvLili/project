class SpecialRing extends BaseSystem {

	private m_Rings : {[key: number]: Sproto.ring_data} = {}

	public static ins(): SpecialRing {
		return super.ins()
	}

	public constructor() {
		super();
		this.regNetMsg(S2cProtocol.sc_ring_datas, this._DoInitData)
		this.regNetMsg(S2cProtocol.sc_ring_uplevel_result, this._DoUpLevelData)
		this.regNetMsg(S2cProtocol.sc_ring_open, this._DoRingOpen)
		this.regNetMsg(S2cProtocol.sc_ring_taskinfo, this._DoRingTask)
		this.regNetMsg(S2cProtocol.sc_ring_onetask, this._DoRingOneTask)
	}

	public Init() {
		let config = GlobalConfig.ins("PublicSpecialringConfig")
		for (let key in config) {
			let data = config[key]
			this.m_Rings[data.id] = {
				id: data.id,
				level: 0,
			} as any
		}
	}

	/** PROTO */

	private m_OpenData: Sproto.sc_ring_open_request
	/**特戒指开启通知5705*/
	protected _DoRingOpen(rsp: Sproto.sc_ring_open_request): void {
		this.m_OpenData = rsp
		GameGlobal.MessageCenter.dispatch(MessageDef.RING_UPDATE_OPEN_DATA)
	}

	private m_TaskData: Sproto.sc_ring_taskinfo_request

	protected _DoRingTask(rsp: Sproto.sc_ring_taskinfo_request): void {
		this.m_TaskData = rsp
		GameGlobal.MessageCenter.dispatch(MessageDef.RING_UPDATE_TASK_DATA)
	}

	public _DoRingOneTask(rsp: Sproto.sc_ring_onetask_request): void {
		let add = false
		if (this.m_TaskData) {
			for (let data of this.m_TaskData.task) {
				if (data.id == rsp.task.id) {
					data.state = rsp.task.state
					data.value = rsp.task.value
					add = true
					break
				}
			}
		} 
		if (!add) {
			if (this.m_TaskData == null) {
				this.m_TaskData = {task: []} as any
			}
			this.m_TaskData.task.push(rsp.task)
			this.m_TaskData.task.sort(function(lhs, rhs) {
				return lhs.id - rhs.id
			})
		}
		GameGlobal.MessageCenter.dispatch(MessageDef.RING_UPDATE_TASK_DATA)
	}

	/**特戒数据5701*/
	protected _DoInitData(rsp: Sproto.sc_ring_datas_request): void {
		for (let data of rsp.datas) {
			this.m_Rings[data.id] = data
		}
		GameGlobal.MessageCenter.dispatch(MessageDef.RING_INIT_DATA)
	}

	protected _DoUpLevelData(rsp: Sproto.sc_ring_uplevel_result_request): void {
		if (rsp.result) {
			this.m_Rings[rsp.data.id] = rsp.data
		} else {
			if (this.m_Rings[rsp.data.id]) {
				UserTips.ins().showTips(GlobalConfig.jifengTiaoyueLg.st101670)
			} else {
				UserTips.ins().showTips(GlobalConfig.jifengTiaoyueLg.st101671)
			}
		}
		GameGlobal.MessageCenter.dispatch(MessageDef.RING_UPDATE_DATA)
	}

	public SendUplevel(id: number): void {
		let req = new Sproto.cs_ring_uplevel_request
		req.id = id
		this.Rpc(C2sProtocol.cs_ring_uplevel, req)
	}

	public SendActiveRing(): void {
		let id = this.GetCurActId()
		if (id) {
			let req = new Sproto.cs_ring_active_request
			req.id = id
			this.Rpc(C2sProtocol.cs_ring_active, req)
		}
	}

	/** END PROTO */

	/** 当前的活动的戒指id */
	public GetCurActId(): number {
		if (this.m_OpenData) {
			return this.m_OpenData.ringid
		}
		return 0
	}

	public GetCurActState(index: number): RewardState {
		if (!this.m_TaskData) {
			return RewardState.NotReached
		}
		let id = this.GetCurActId()
		let config = GlobalConfig.ins("PublicSpecialringConfig")[id]
		if (config) {
			let taskId = config.condition[index]
			if (taskId) {
				let info = this.GetTaskInfo(taskId)
				if (info) {
					return info.state
				}
			}
		}
		return RewardState.NotReached
	}

	/** 当前活动的剩余时间 */
	public GetCurActSurplusTime(): number {
		if (this.m_OpenData) {
			return Math.max(this.m_OpenData.endTime - GameServer.serverTime, 0)
		}
		return 0
	}

	public CanActiveRing(): boolean {
		if (!this.m_TaskData) {
			return false
		}
		let id = this.GetCurActId()
		let config = GlobalConfig.ins("PublicSpecialringConfig")[id]
		if (!config) {
			return false
		}
		for (let taskId of config.condition) {
			let info = this.GetTaskInfo(taskId)
			if (!info || info.state == RewardState.NotReached) {
				return false
			}
		}
		return true
	}

	public GetTaskInfo(id: number): Sproto.ring_task {
		if (this.m_TaskData) {
			for (let taskData of this.m_TaskData.task) {
				if (taskData.id == id) {
					return taskData
				}
			}
		}
		return null
	}

	public GetRingData(id: number): Sproto.ring_data {
		let data = this.m_Rings[id]
		if (data) {
			return data
		}
		return null
	}

	public HasRing(ringId: number): boolean {
		let info = this.GetRingData(ringId)
		if (info && info.level > 0) {
			return true
		}
		return false
	}

	private _CanUp(ringId: number, lv: number): boolean {
		// 满级
		if (!GlobalConfig.publicSpeRRConfig[ringId][lv]) {
			return false
		}
		let config = GlobalConfig.publicSpeRRConfig[ringId][lv - 1]
		if (config) {
			let itemData = UserBag.ins().getBagItemById(config.rankUpItem.id)
			if (itemData && itemData.count >= config.rankUpItem.count) {
				return true
			}
		}
		return false
	}

	public IsRedPoint(): boolean {
		for (let key in this.m_Rings) {
			let data = this.m_Rings[key]
			if (data.level > 0) {
				if (this.IsRedPointById(data.id)) {
					return true
				}
			}
		}
		return false
	}

	public IsRedPointById(ringId: number): boolean {
		let ringInfo = this.GetRingData(ringId)
		if (ringInfo && ringInfo.level > 0) {
			return this._CanUp(ringId, ringInfo.level)
		}
		return false
	}

	public static HasNextLvId(ringData: Sproto.ring_data): boolean {
		if (!ringData) {
			return false
		}
		if (GlobalConfig.publicSpeRRConfig[ringData.id][ringData.level + 1]) {
			return true
		}
		return false
	}

	public static GetRingConfig(id: number, lv: number): any {
		return GlobalConfig.publicSpeRRConfig[id][lv - 1]
	}

	public static IsDeblocking(): boolean {
		// return GameServer.serverOpenDay >= 5
		return Deblocking.Check(DeblockingType.TYPE_17, true)
	}
}
window["SpecialRing"]=SpecialRing