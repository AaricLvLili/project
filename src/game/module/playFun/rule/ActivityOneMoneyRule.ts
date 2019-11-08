class ActivityOneMoneyRule extends RuleIconBase {
	public constructor(t) {
		super(t)
		this.updateMessage = [MessageDef.ACTIVITY_IS_AWARDS,
		]
		this.lab = t.getChildByName("lab")
	}
	private lab: eui.Label

	checkShowIcon() {
		if (WxSdk.ins().isHidePay()) {
			return false;
		}
		var activityData = <ActivityType10Data>GameGlobal.activityData[301];
		if (activityData && activityData.isOpenTime()) {
			return true;
		}
		return false;
	}
	public onTimer(): void {
		let data = GameGlobal.activityData[301]
		if (data) {
			this.lab.text = DateUtils.GetFormatSecond(data.endTime - GameServer.serverTime, DateUtils.TIME_FORMAT_1)
		}
	}

	checkShowRedPoint() {
		var activityData = <ActivityType10Data>GameGlobal.activityData[301];
		return activityData.canReward();
	}

	getEffName(e) {
		return this.firstTap || e ? this.DefEffe(e) : void 0
	}

	tapExecute() {
		ViewManager.ins().open(Activity301Win);
	}
}
window["ActivityOneMoneyRule"] = ActivityOneMoneyRule