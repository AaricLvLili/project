class SetingIconRule extends RuleIconBase {
	public constructor(t) {
		super(t)
		this.updateMessage = []
	}
	checkShowIcon() {
		return false
	}
	checkShowRedPoint() {
		return false
	}

	tapExecute() {
		ViewManager.ins().open(SoundSetPanel);
	}
}
window["SetingIconRule"]=SetingIconRule