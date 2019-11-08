class OmGifBagRule extends RuleIconBase {
	public constructor(t) {
		super(t)
	}

	checkShowIcon() {
		if(WxSdk.ins().isHidePay())
			return false;
		return OmGifBagModel.getInstance.isShow(1);
	}

	checkShowRedPoint() {
		return true;
	}

	getEffName(e) {
		return this.firstTap || e ? this.DefEffe(e) : void 0
	}

	tapExecute() {
		ViewManager.ins().open(OmGifBagWin);
	}
}
window["OmGifBagRule"] = OmGifBagRule