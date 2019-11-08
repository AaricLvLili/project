class MoneyTreeModel extends BaseSystem {

	public isOpen: boolean[] = []
	playNum = 0
	boxOn = 0
	addCoefficient = 1
	exp = 0
	boxInfo = 0
	baoji

	public mRechargeDay: number = 0
	public mAwardBits: number[] = []
	private cashCowBoxConfig: any;
	// public mAwards: {[key:number]: boolean} = {}

	public constructor() {
		super()

		this.regNetMsg(S2cProtocol.sc_money_tree_info, this.doMoneyTreeInfo)
		this.regNetMsg(S2cProtocol.sc_money_tree_play_info, this.doPalyBack)
		this.regNetMsg(S2cProtocol.sc_money_tree_reward_info, this.doGetRewardBack)

		this.regNetMsg(S2cProtocol.sc_recharge_gift_reward, this.DoRechargeInfo)

	}

	sendPlayYaoYao() {
		// var e = this.getBytes();
		// e.writeCmd(this.protoSysID, 2), this.sendToServer(e)

		this.Rpc(C2sProtocol.cs_money_tree_play)
	}

	public GetRechargeGift(index: number): void {
		let req = new Sproto.cs_recharge_gift_reward_request
		req.index = index
		this.Rpc(C2sProtocol.cs_recharge_gift_reward, req)
	}

	sendGetCaseReward(e) {
		let req = new Sproto.cs_money_tree_reward_request
		req.id = e
		this.Rpc(C2sProtocol.cs_money_tree_reward, req)
	}

	private DoRechargeInfo(rsp: Sproto.sc_recharge_gift_reward_request) {
		this.mRechargeDay = rsp.dayNum
		// this.mAwards = {}
		// for (let data of rsp.awards) {
		// 	this.mAwards[data] = true
		// }
		this.mAwardBits = rsp.drawBinList
		GameGlobal.MessageCenter.dispatch(MessageDef.MONEY_RECHARGE_GIFT_CHANGE)
	}

	doMoneyTreeInfo(e: Sproto.sc_money_tree_info_request) {
		this.playNum = e.playNum
		this.boxOn = e.boxOn
		this.addCoefficient = e.addCoefficient
		this.exp = e.exp
		this.boxInfo = e.boxInfo

		GameGlobal.MessageCenter.dispatch(MessageDef.MONEY_INFO_CHANGE)
	}

	doPalyBack(e: Sproto.sc_money_tree_play_info_request) {
		this.playNum = e.playNum
		this.boxOn = e.boxOn
		this.addCoefficient = e.addCoefficient
		this.exp = e.exp
		this.baoji = e.baoji

		GameGlobal.MessageCenter.dispatch(MessageDef.MONEY_INFO_CHANGE, !1, this.baoji)
	}

	doGetRewardBack(e: Sproto.sc_money_tree_reward_info_request) {
		this.boxInfo = e.boxInfo
		GameGlobal.MessageCenter.dispatch(MessageDef.MONEY_INFO_CHANGE)
	}


	public static ins(): MoneyTreeModel {
		return super.ins()
	}

	getOrderByIndex(e = 0) {

		var t = this.boxInfo >> e & 1;
		return t
	}

	getNowCoefficientinfo(e = 0) {

		var t = GlobalConfig.ins("CashCowAmplitudeConfig");
		for (var i in t)
			if (t[i].level == this.addCoefficient + e) return t[i];
		return null
	}
	private _maxNum = 0;

	get maxNum() {
		if (this._maxNum == 0) {
			var t = GlobalConfig.ins("CashCowLimitConfig");
			let maxNum = 0;
			for (var i in t) {
				maxNum = t[i].maxTime;
			}
			this._maxNum=maxNum;
		}
		return this._maxNum;
	}

	get cruMaxNum() {
		return this.checkCashCowBasicLenght()
	}

	getIndexCost() {
		var e = GlobalConfig.ins("CashCowBasicConfig");
		for (var t in e)
			if (e[t].time == this.boxOn + 1) return e[t];
		return null
	}

	getBoxInfoByIndex(e) {
		if (this.cashCowBoxConfig == null)
			this.cashCowBoxConfig = GlobalConfig.ins("CashCowBoxConfig");
		var t = this.cashCowBoxConfig;
		for (var i in t)
			if (t[i].index == e) return t[i];
		return null
	}

	checkCashCowBasicLenght(e = 0) {
		0 == e && (e = GameGlobal.actorModel.vipLv);
		var t = GlobalConfig.ins("CashCowLimitConfig");
		for (var i in t)
			if (t[i].vip == e) return t[i].maxTime;
		return 0
	}

	checkBoxIsCanget(e) {
		var t = this.getBoxInfoByIndex(e);
		return t.time <= this.playNum && this.getOrderByIndex(e - 1) <= 0 ? !0 : !1
	}

	isHaveReward() {
		if (GameGlobal.serverOpenDay < 2) return !1;
		for (var e = 1; 4 > e; e++)
			if (this.checkBoxIsCanget(e)) return !0;
		return !1
	}

	public static GetTodayRecharge(): number {
		if (GameGlobal.rechargeData[1]) {
			return GameGlobal.rechargeData[1].num
		}
		return
	}

	public GetRechargeGiftState(index: number): RewardState {
		let chongjiToday = GameGlobal.rechargeData[1].num
		let bitIndex = Math.ceil(index / 30) - 1
		let bitValue = this.mAwardBits[bitIndex]
		if (BitUtil.Has(bitValue || 0, index - bitIndex * 30)) {
			return RewardState.Gotten
		}
		if (this.mRechargeDay >= index) {
			return RewardState.CanGet
		}
		if (this.mRechargeDay == (index - 1)) {
			if (chongjiToday == null || chongjiToday <= 0) {
				return RewardState.NotReached
			}
		}
		return RewardState.Undo;
	}

	public static HasRechargeGift() {
		let config = GlobalConfig.ins("RechargeGiftConfig")
		let model = MoneyTreeModel.ins()
		for (let key in config) {
			let configData = config[key]
			if (model.GetRechargeGiftState(configData.index) == RewardState.CanGet) {
				return true
			}
		}
		return false

	}

	public static CheckOpen(showTip: boolean = false): boolean {
		// if (GameServer.serverOpenDay < 2) {
		// 	if (showTip) {
		// 		UserTips.ins().showTips("|C:0xf87372&T:开服第三天开启摇钱树|");
		// 	}
		// 	return false
		// }
		return true
	}
}
window["MoneyTreeModel"] = MoneyTreeModel