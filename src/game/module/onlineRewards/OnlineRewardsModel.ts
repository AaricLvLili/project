class OnlineRewardsModel extends BaseSystem {
	public constructor() {
		super();
		this.regNetMsg(S2cProtocol.sc_online_res, this.doOnlineRewardsList);
		this.regNetMsg(S2cProtocol.sc_online_reward_res, this.doGetOnlineRewardsResult);
		this.regNetMsg(S2cProtocol.sc_fieldexp_buff_res, this.getExpWelExpInit);
	}

	/**VIP经验奖励id*/
	public static VIPREWARD_ID = 1;
	/**今日累计在线时间S*/
	private _totalTime: number = 0;
	/**奖励领取状态列表*/
	public rewardDataList = [];
	public static ins(): OnlineRewardsModel {
		return super.ins();
	}

	/**请求在线奖励信息列表*/
	public sendOnlineRewardsList(): void {
		this.Rpc(C2sProtocol.cs_online_req, new Sproto.cs_online_req_request);
	}

	/**在线奖励信息列表返回*/
	private doOnlineRewardsList(bytes: Sproto.sc_online_res_request): void {
		this._totalTime = GameServer.serverTime - bytes.online;
		this.rewardDataList = bytes.data;
		GameGlobal.MessageCenter.dispatch(MessageDef.ONLINE_REWARDS_STATE)
	}

	public get totalTime() {
		return GameServer.serverTime - this._totalTime;
	}




	/**请求领取在线奖励*/
	public sendGetOnlineRewards(id: number): void {
		let req = new Sproto.cs_online_reward_req_request();
		req.id = id;
		this.Rpc(C2sProtocol.cs_online_reward_req, req);
	}

	/**领取在线奖励结果*/
	private doGetOnlineRewardsResult(bytes: Sproto.sc_online_reward_res_request): void {
		if (bytes.ret > 0) {
			this.rewardDataList[bytes.ret - 1] = onlineRewardState.ONLINETYPE1;
			GameGlobal.MessageCenter.dispatch(MessageDef.ONLINE_REWARDS_STATE)
			// if (this.onlineRewardComplete())
			// 	TimerManager.ins().remove(this._DoTimer, this);
		}
	}

	/**在线奖励是否全部领完*/
	public onlineRewardComplete() {
		if (this.rewardDataList.indexOf(onlineRewardState.ONLINETYPE0) > -1)
			return false;
		if (this.rewardDataList.indexOf(onlineRewardState.ONLINETYPE2) > -1)
			return false;
		return true;
	}

	/**在线奖励是否可以领取*/
	public canOnlineReward() {
		return this.rewardDataList.indexOf(onlineRewardState.ONLINETYPE0) > -1;
	}

	/**获取距离最近的领取时间*/
	public getOnlineNearlyTime() {
		var index = this.rewardDataList.indexOf(onlineRewardState.ONLINETYPE2);
		var times = "";
		if (index > -1) {
			let config = GlobalConfig.ins("OnLineRewardConfig")[index + 1];
			times = DateUtils.GetFormatSecond(config.time * 60 - OnlineRewardsModel.ins().totalTime, DateUtils.TIME_FORMAT_1);
		}
		return times;
	}
	/*************野外双烧******** */
	public expSelectIndex: number = 1;
	public expDic: Dictionary<{ id: number, time: number }> = new Dictionary<{ id: number, time: number }>();
	public isHave: boolean = false;
	/**获取野外烧双初始化 */
	private getExpWelExpInit(bytes: Sproto.sc_fieldexp_buff_res_request) {
		this.expDic.clear();
		this.isHave = false;
		for (var i = 0; i < bytes.data.length; i++) {
			let newData = { id: i + 1, time: bytes.data[i] }
			this.expDic.set(newData.id, newData);
		}
		let expDatas = this.expDic.values;
		for (var f = 0; f < expDatas.length; f++) {
			if (expDatas[f].time > 0) {
				this.expSelectIndex = expDatas[f].id;
				this.isHave = true;
				break;
			}
		}
		GameGlobal.MessageCenter.dispatch(MessageDef.EXPWEL_INIT_MSG);
	}
	/**野外烧双初始化*/
	public sendExpWelExpInitMsg() {
		let rsp = new Sproto.cs_fieldexp_buff_req_request;
		this.Rpc(C2sProtocol.cs_fieldexp_buff_req, rsp);
	}
	/**野外烧双领取buff返回初始化*/
	public sendExpWelExpApplyMsg(id: number) {
		let rsp = new Sproto.cs_fieldexp_buff_apply_req_request;
		rsp.id = id;
		this.Rpc(C2sProtocol.cs_fieldexp_buff_apply_req, rsp);
	}
	/**野外烧双一键完成返回初始化*/
	public sendExpWelExpFinishMsg() {
		let rsp = new Sproto.cs_fieldexp_buff_finish_req_request;
		this.Rpc(C2sProtocol.cs_fieldexp_buff_finish_req, rsp);
	}

	public checkRedPoint() {
		if (this.isHave == false) {
			let data = this.expDic.values;
			for (var i = 0; i < data.length; i++) {
				if (data[i].time == 0) {
					return true;
				}
			}
		}
		return false;
	}
	/********************** */
}
MessageCenter.compile(OnlineRewardsModel);
window["OnlineRewardsModel"] = OnlineRewardsModel