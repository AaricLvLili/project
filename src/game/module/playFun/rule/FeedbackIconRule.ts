class FeedbackIconRule extends RuleIconBase {
	public constructor(t) {
		super(t)
		this.firstTap = true
		this.updateMessage = [
			MessageDef.OPEN_SERVER
		]
	}

	checkShowIcon () {
		if (GameGlobal.actorModel.level < 10) {
			return false
		}

		var activityData = <ActivityType15Data>GameGlobal.activityData[200];
		return ActivityModel.ins().IsOpen(activityData);
	}
	
	getEffName (e) {
		return this.DefEffe(e)
	}
	
	tapExecute () {
		this.firstTap = false
		ViewManager.ins().open(FeedbackWin)
	}
}
window["FeedbackIconRule"]=FeedbackIconRule