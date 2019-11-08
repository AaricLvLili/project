class StrongIconRule extends RuleIconBase {
	public constructor(t) {
		super(t)
		this.updateMessage = [MessageDef.ACTIVITY_IS_AWARDS,
		]
	}
	checkShowIcon() {
		return false;
	}

	checkShowRedPoint() {
		return true;
	}

	getEffName(e) {
		return this.DefEffe(e)
	}

	tapExecute() {
		ViewManager.ins().open(StrongWin);
	}
}
window["StrongIconRule"] = StrongIconRule