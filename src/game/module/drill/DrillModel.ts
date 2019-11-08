class DrillModel extends BaseSystem {
	public sc_tryroad_datas: Sproto.sc_tryroad_datas_request;
	public tryroad_rank: Sproto.sc_get_tryroad_rank_request;
	public constructor() {
		super();
		this.initData();
		this.regNetMsg(S2cProtocol.sc_tryroad_datas, this.tryroadData);
		this.regNetMsg(S2cProtocol.sc_enter_tryroad_raid, this.tryroodRaid);
		this.regNetMsg(S2cProtocol.sc_get_caiquan_result, this.fingerGuessResult);
		this.regNetMsg(S2cProtocol.sc_get_tryroad_award, this.tryroadAward);
		this.regNetMsg(S2cProtocol.sc_get_tryroad_rank, this.tryroadRank);

	}
	private initData(): void {
		this.sc_tryroad_datas = new Sproto.sc_tryroad_datas_request();
		this.sc_tryroad_datas.id = 0;
		this.sc_tryroad_datas.status = 0;
		this.sc_tryroad_datas.rewards = [];
		this.tryroad_rank = new Sproto.sc_get_tryroad_rank_request();
		let rank_data = new Sproto.tryroad_rank_data();
		rank_data.lvl = 1;
		rank_data.name = "";
		rank_data.rank = 1;
		rank_data.vip = 0;
		this.tryroad_rank.lvl = 1;
		this.tryroad_rank.rank = 0;
		this.tryroad_rank.data = [rank_data];
	}
	static ins(): DrillModel {
		return super.ins();
	}

	//获取副本数据
	private tryroadData(data: Sproto.sc_tryroad_datas_request): void {
		if(data) this.sc_tryroad_datas = data;
		GameGlobal.MessageCenter.dispatch(MessageDef.TRYROAD_DATAS);

	}
	//进入副本状态
	private tryroodRaid(data: Sproto.sc_enter_tryroad_raid_request): void {
		if (data.status == 1) {
			ViewManager.ins().close(FbWin);
		}

	}
	//获取猜拳数据
	private fingerGuessResult(data: Sproto.sc_get_caiquan_result_request): void {

	}
	//领取奖励状态
	private tryroadAward(data: Sproto.sc_get_tryroad_award_request) {
		this.sc_tryroad_datas.rewards[data.id - 1].status = data.status;
		GameGlobal.MessageCenter.dispatch(MessageDef.TRYROAD_DATAS);
	}
	//获取排行榜数据
	private tryroadRank(data: Sproto.sc_get_tryroad_rank_request) {
		if(data) this.tryroad_rank = data;
		GameGlobal.MessageCenter.dispatch(MessageDef.TRYROAD_RANK);
	}



	//进入副本
	public enterCopy(vaule: number): void {
		let cdata = new Sproto.cs_enter_tryroad_raid_request();
		cdata.handle = vaule;
		GameSocket.ins().Rpc(C2sProtocol.cs_enter_tryroad_raid, cdata);

	}
	//请求猜拳数据
	private fingerGuess(): void {
		let cdata = new Sproto.cs_get_caiquan_result_request();
		GameSocket.ins().Rpc(C2sProtocol.cs_get_caiquan_result, cdata);

	}
	//请求领取奖励
	public drillAward(level: number): void {
		let cdata = new Sproto.cs_get_tryroad_award_request();
		cdata.id = level;
		GameSocket.ins().Rpc(C2sProtocol.cs_get_tryroad_award, cdata);
	}
	//获取排行榜
	public drillRank(): void {
		let cdata = new Sproto.cs_get_tryroad_rank_request();
		GameSocket.ins().Rpc(C2sProtocol.cs_get_tryroad_rank, cdata);
	}

	public isRed(): boolean {
		let len = this.sc_tryroad_datas.rewards.length;
		if (this.sc_tryroad_datas.rewards.length == 0) {
			return false;
		} else {
			for (let i = 0; i < len; i++) {
				if (this.sc_tryroad_datas.rewards[i].status == 0)
					return true;
			}
		}
		return false;
	}


}
MessageCenter.compile(DrillModel);
window["DrillModel"]=DrillModel