class FuncOpenModel extends BaseSystem {
	public static MAX = 10

	public static get INDEX_TO_NAME() {
		let list = [
			"",
			GlobalConfig.jifengTiaoyueLg.st101302,
			GlobalConfig.jifengTiaoyueLg.st100339,
			GlobalConfig.jifengTiaoyueLg.st101246,
			"PK",
			GlobalConfig.jifengTiaoyueLg.st101427,
			GlobalConfig.jifengTiaoyueLg.st101428,
			GlobalConfig.jifengTiaoyueLg.st101429,
			GlobalConfig.jifengTiaoyueLg.st100362,
			GlobalConfig.jifengTiaoyueLg.st101430,
			GlobalConfig.jifengTiaoyueLg.st101431
		]
		return list;
	}

	private funcNoticeConfig: any;

	public static ins(): FuncOpenModel {
		return super.ins()
	}

	public constructor() {
		super()
		// GameGlobal.MessageCenter.addListener(MessageDef.LEVEL_CHANGE, this._ConditionChange, this)
		// GameGlobal.MessageCenter.addListener(MessageDef.GUANQIA_CHANGE, this._ConditionChange, this)
	}
	/**
	 * index：每个奖励档次对应的下标
	 * @param return 返回值，该档次的奖励是否领取（false 未领取==》开放入口 true 已经领取）
	 */
	public bReceiveState(index: number): boolean {
		let gongnengYugao = GameGlobal.actorModel.mFuncOpen;
		let pos = 1 << index;
		let bState = gongnengYugao & pos;//0.未领取，!0已经领取
		if (bState == 0) {
			return false;
		} else {
			return true;
		}

	}

	public sendPacket(curIdx: number) {
		let req = new Sproto.cs_get_gongnengyugao_reward_request();
		req.index = curIdx;
		this.Rpc(C2sProtocol.cs_get_gongnengyugao_reward, req, this.getRewardresponse)
	}
	private getRewardresponse(rsp) {
		let rspData: Sproto.cs_get_gongnengyugao_reward_response = rsp;
		if (rspData.index == 0) {
			UserTips.ins().showTips(GlobalConfig.jifengTiaoyueLg.st101432)
		} else {
			GameGlobal.actorModel.mFuncOpen = rspData.gongnengYugao;
			GameGlobal.MessageCenter.dispatch(MessageDef.FUNC_OPEN_UPDATE, true)
		}

	}

	public SendGetFuncOpen(index: number): void {

		let req = new Sproto.cs_get_gongnengyugao_reward_request
		req.index = index
		this.Rpc(C2sProtocol.cs_get_gongnengyugao_reward, req, (rsp) => {
			let rspData: Sproto.cs_get_gongnengyugao_reward_response = rsp
			if (rspData.index == 0) {
				UserTips.ins().showTips(GlobalConfig.jifengTiaoyueLg.st101432)
			} else {
				GameGlobal.actorModel.mFuncOpen = BitUtil.Set(GameGlobal.actorModel.mFuncOpen, rspData.index, true)
				GameGlobal.MessageCenter.dispatch(MessageDef.FUNC_OPEN_UPDATE)
			}
		})
	}

	private get m_Reward(): number {
		return GameGlobal.actorModel.mFuncOpen
	}

	public GetNextIndex(): number {
		if (this.funcNoticeConfig == null)
			this.funcNoticeConfig = GlobalConfig.ins("FuncNoticeConfig");
		let config = this.funcNoticeConfig;
		// for (let i = 1; i <= FuncOpenModel.MAX; ++i) {
		// 	let configData = config[i]
		// 	if (FuncOpenModel.CheckByData(configData.openLv) == false) {
		// 		return i
		// 	}
		// }
		for (let i in GlobalConfig.funcNoticeConfig) {
			let item = GlobalConfig.funcNoticeConfig[i]
			if (FuncOpenModel.CheckByData(item.openLv) == false) {
				return item.index
			}
		}
		return -1
	}

	public GetNextConfigData(): any {
		if (this.funcNoticeConfig == null)
			this.funcNoticeConfig = GlobalConfig.ins("FuncNoticeConfig");
		let index = this.GetNextIndex()
		if (index != -1) {
			return this.funcNoticeConfig[index]
		}
		return null
	}

	public GetCurCanRewardIndex(): number {
		// for (let i = 1; i <= FuncOpenModel.MAX; ++i) {
		// 	if (this.CanReward(i)) {
		// 		return i
		// 	}
		// }
		for (let i in GlobalConfig.funcNoticeConfig) {
			let item = GlobalConfig.funcNoticeConfig[i]
			if (this.CanReward(item.index)) {
				return item.index
			}
		}
		return -1
	}

	public CanReward(index: number): boolean {
		return this.GetRewardState(index) == RewardState.CanGet
	}
	//全部奖励是否领取
	public AllRewardIsGet(): boolean {
		for (let i in GlobalConfig.funcNoticeConfig) {
			let item = GlobalConfig.funcNoticeConfig[i]
			if (this.GetRewardState(item.index) != RewardState.Gotten) {
				return false
			}
		}
		return true
	}

	public GetRewardState(index: number): RewardState {
		if (this.funcNoticeConfig == null)
			this.funcNoticeConfig = GlobalConfig.ins("FuncNoticeConfig");

		let configData = this.funcNoticeConfig[index]
		if (configData && FuncOpenModel.CheckByData(configData.openLv)) {
			if (BitUtil.Has(this.m_Reward, index)) {
				return RewardState.Gotten
			}
			return RewardState.CanGet
		}
		return RewardState.NotReached
	}

	public HasReward(): boolean {
		for (let i = 1; i <= FuncOpenModel.MAX; ++i) {
			if (this.CanReward(i)) {
				return true
			}
		}
		return false
	}

	public static Check(type: number, value: number): boolean {
		switch (type) {
			case 1:
				return UserFb.ins().guanqiaID >= value
			case 2:
				if (value >= 1000) {
					return GameGlobal.actorModel.zsLv >= value * 0.001
				}
				return GameGlobal.actorModel.level >= value
			case 3:
				return GameServer.serverOpenDay >= value;
			case 4:
				return GameServer.loginDay >= value;
		}
		return false
	}

	public static CheckByData(data): boolean {
		return this.Check(data[0], data[1])
	}

	private static FuncNoticeConfig: any;
	public static GetTipStrByIndex(index: number): string {
		if (this.FuncNoticeConfig == null)
			this.FuncNoticeConfig = GlobalConfig.ins("FuncNoticeConfig");
		let data = this.FuncNoticeConfig[index]
		let prefix = FuncOpenModel.GetTipStr(data.openLv[0], data.openLv[1])
		return prefix// + "开启" + FuncOpenModel.INDEX_TO_NAME[index]
	}

	private static GetTipStr(type: number, value: number): string {
		switch (type) {
			case 1:
				return LanguageString.jifengTiaoyueCh(GlobalConfig.jifengTiaoyueLg.st101433, [value]);
			case 2:
				return LanguageString.jifengTiaoyueCh(GlobalConfig.jifengTiaoyueLg.st101434, [value]);
		}
		return ""
	}

	public static GetTipStr3(type: number, value: number, name: string): string {
		switch (type) {
			case 1:
				return LanguageString.jifengTiaoyueCh(GlobalConfig.jifengTiaoyueLg.st101436, [value, name])
			case 2:
				if (value >= 1000) {
					let zslv = value * 0.001;
					return LanguageString.jifengTiaoyueCh(GlobalConfig.jifengTiaoyueLg.st102115, [zslv, name])
				} else {
					return LanguageString.jifengTiaoyueCh(GlobalConfig.jifengTiaoyueLg.st101437, [value, name])
				}
			case 3:
				return LanguageString.jifengTiaoyueCh(GlobalConfig.jifengTiaoyueLg.st102117, [value, name])
			case 4:
				return LanguageString.jifengTiaoyueCh(GlobalConfig.jifengTiaoyueLg.st102116, [value, name])
		}
		return ""
	}

	// 客户端保存数据

	public static SAVE_DATA_BOSS01 = 1
	public static SAVE_DATA_BOSS02 = 2

	public static SAVE_DATA_FALG = false

	public static HasSaveData(value: number): boolean {
		let saveData = GameGlobal.actorModel.mSaveData
		return BitUtil.Has(saveData, value)
	}

	public static SetSaveData(value: number): void {
		GameGlobal.actorModel.mSaveData = BitUtil.Set(GameGlobal.actorModel.mSaveData, value, true)
		let req = new Sproto.cs_set_clientvalue_request
		req.value = GameGlobal.actorModel.mSaveData
		GameSocket.ins().Rpc(C2sProtocol.cs_set_clientvalue, req)
	}
}
window["FuncOpenModel"] = FuncOpenModel