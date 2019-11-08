class ActivityHlqdIconRule extends RuleIconBase{
public constructor(t) {
		super(t)
		this.firstTap = true
		this.updateMessage = [
			MessageDef.UPDATE_ACTIVITY_PANEL,
		]
	}

	checkShowIcon() {
		// //测试放出来
		// if(GameGlobal.actorModel)
		// 	return true;

		if (WxSdk.ins().isHidePay()) {
			return false;
		}
		
		if (GameGlobal.actorModel.level < 10) {
			return false
		}
		return GameGlobal.activityModel.getbtnListByType(ActivityModel.BTN_TYPE_03).length > 0
	}

	checkShowRedPoint() {
		var activityDatas = GameGlobal.activityData
		let btnList = GameGlobal.activityModel.getbtnListByType(ActivityModel.BTN_TYPE_03);
		for (var key in btnList) {
			var actId = btnList[key].id;
			if (activityDatas[actId].canReward()) {
				return 1
			}
		}
		return 0
	}

	getEffName(e) {
		return this.DefEffe(e)
	}

	tapExecute() {
		ActivityWinSummer.onPlace = ActivityModel.BTN_TYPE_03;
		ViewManager.ins().open(ActivityWinSummer)
		this.firstTap = false
		this.update()
	}
}
window["ActivityHlqdIconRule"]=ActivityHlqdIconRule