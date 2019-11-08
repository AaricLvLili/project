class GamePlayIconRule extends RuleIconBase {
	public constructor(t) {
		super(t)
		this.updateMessage = []
	}
	checkShowRedPoint() {
		return false
	}

	tapExecute() {
		ViewManager.ins().open(GamePlay);
	}
}
window["GamePlayIconRule"]=GamePlayIconRule