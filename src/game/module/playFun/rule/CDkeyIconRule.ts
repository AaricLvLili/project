class CDkeyIconRule extends RuleIconBase {

	firstTap

	public constructor(t) {
		super(t)

		this.firstTap = !0
		this.updateMessage = [MessageDef.MONEY_INFO_CHANGE, MessageDef.GAME_NOTICE_OPEN, MessageDef.UPDATA_TASK, MessageDef.MONEY_RECHARGE_GIFT_CHANGE]
	}

	checkShowIcon () {
		if(StartGetUserInfo.isOne || StartGetUserInfo.isUsa) 
			return false;
		return !0
	}
	checkShowRedPoint  () {
		return MoneyTreeModel.ins().isHaveReward() 
				|| FindAssetsModel.ins().HasFindAssets() 
				// || MoneyTreeModel.HasRechargeGift() 
				// || GameGlobal.activityModel.checkOtherCharge2CanGet() 
				|| DayLoginIconRule.ShowRedPoint()
	}

	getEffName (e) {}
	
	tapExecute () {
		ViewManager.ins().open(FuliWin, 1)
		this.update()
	}
}
window["CDkeyIconRule"]=CDkeyIconRule