class WarOrderRule extends RuleIconBase {
	public constructor(t) {
		super(t)

	}
	checkShowIcon() {
		return WarOrderModel.getInstance.isShow;
	}

	checkShowRedPoint() {
		return WarOrderModel.getInstance.checkAllRedPoint();
	}
	getEffName(e) {
		return this.firstTap || e ? this.DefEffe(e) : void 0
	}

	tapExecute() {
		ViewManager.ins().open(WarOrderWin);
	}
}
window["WarOrderRule"] = WarOrderRule