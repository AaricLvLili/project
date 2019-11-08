class CouponTreIconRule extends RuleIconBase {
	public constructor(t) {
		super(t)
		this.firstTap = true
		this.updateMessage = [
			UserBag.postHuntStore,
			MessageDef.CHECK_HAVE_CAN
		]
	}

	checkShowIcon() {
		if (WxSdk.ins().isHidePay()) {
			return false;
		}
		return true;
	}
	checkShowRedPoint() {
		return CouponModel.getInstance.checkAllRedPoint();
	}

	getEffName(e) {
		return this.DefEffe(e)
	}

	tapExecute() {
		this.firstTap = false
		ViewManager.ins().open(CouponWin, 1);
	}
}
window["CouponTreIconRule"] = CouponTreIconRule