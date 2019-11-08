class DaliyTaskIconRule extends RuleIconBase {
	public constructor(t) {
		super(t)
		this.updateMessage = []
	}
	checkShowIcon() {
		return StartGetUserInfo.isOne == false;
	}
	checkShowRedPoint() {
		return UserTask.ins().CheckAllVitalityReward() 
		//  || OnlineRewardsModel.ins().checkRedPoint();
	}

	tapExecute() {
		ViewManager.ins().open(LiLianWin);
	}
}
window["DaliyTaskIconRule"] = DaliyTaskIconRule