class DayOneActivityIconRule extends RuleIconBase{
	public constructor(t) {
		super(t)
		this.firstTap = true
		this.updateMessage = [
			MessageDef.DAYONE_ACTIVITY
		]
	}

	checkShowIcon () {
		// if(StartGetUserInfo.isOne) return false;//如果为单机，屏蔽处理
		// return DayOneActivityController.ins().rewardState != 3;
		return false //屏蔽
	}
	
	getEffName (e) {
		return this.DefEffe(e)
	}
	
	tapExecute () {
		this.firstTap = false
		ViewManager.ins().open(DayOneActivityPanel)
	}
}
window["DayOneActivityIconRule"]=DayOneActivityIconRule