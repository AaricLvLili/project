class MonthCardIconRule extends RuleIconBase {

	public constructor(t) {
		super(t)

		this.firstTap = !0
		this.updateMessage = [
			MessageDef.LEVEL_CHANGE,
			MessageDef.RECHARGE_UPDATE_MONTH_REWARD,
		] // , ExpGoldModel.EXPINDEX_CHANGE
	}

	checkShowIcon () {
		if (WxSdk.ins().isHidePay()) {
			return false;
		}
		if(StartGetUserInfo.isUsa)//针对渠道过审核屏蔽
			return false;
		return (!Recharge.ins().zunCard || Recharge.ins().monthDay <= 0) && GameGlobal.actorModel.level >= 10
	}
	
	checkShowRedPoint () {
		if (Recharge.ins().HasMonthCardReward()) {
			return 1
		}
		return 0
	}
	
	getEffName (e) {
		return this.firstTap ? this.DefEffe(e) : void 0
	}
	
	tapExecute () {
		ViewManager.ins().open(FuliWin, 1, 4), this.firstTap = !1, this.update()
	}
}
window["MonthCardIconRule"]=MonthCardIconRule