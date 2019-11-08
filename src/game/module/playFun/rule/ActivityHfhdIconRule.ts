//合服活动Icon
class ActivityHfhdIconRule extends RuleIconBase{
public constructor(t) {
		super(t)
		this.firstTap = true
		this.updateMessage = [
			MessageDef.UPDATE_ACTIVITY_PANEL,
		]
	}

	checkShowIcon() {
		if (WxSdk.ins().isHidePay()) {
			return false;
		}
		return GameGlobal.activityModel.getbtnListByType(ActivityModel.BTN_TYPE_04).length > 0
	}

	checkShowRedPoint() {
		var activityDatas = GameGlobal.activityData
		let btnList = GameGlobal.activityModel.getbtnListByType(ActivityModel.BTN_TYPE_04);
		for (var key in btnList) {
			var actId = btnList[key].id;
			if (activityDatas[actId] && activityDatas[actId].canReward()) {
				return 1
			}
		}
		return 0
	}

	getEffName(e) {
		return this.DefEffe(e)
	}

	tapExecute() {
		ActivityWinSummer.onPlace = ActivityModel.BTN_TYPE_04;
		ViewManager.ins().open(ActivityWinSummer)
		this.firstTap = false
		this.update()
	}
}
window["ActivityHfhdIconRule"]=ActivityHfhdIconRule