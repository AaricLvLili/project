class VIP5IconRule extends RuleIconBase {
	public constructor(t) {
		super(t)
		this.firstTap = true
		this.updateMessage = [MessageDef.VIP_LEVEL_CHANGE, MessageDef.SUB_ROLE_CHANGE]
	}

	checkShowIcon() {
		if(WxSdk.ins().isHidePay())
		{
			return false;
		}
		// return !PartnerIconRule.CheckShow() && UserVip.ins().lv == 4
		return false;
	}

	checkShowRedPoint() {
		return 0
	}
	getEffName (e) {
		return this.DefEffe(e)
	}
	tapExecute () {
		this.firstTap = false
		GameGlobal.ViewManager.open(VipWin, 5)
	}
}
window["VIP5IconRule"]=VIP5IconRule