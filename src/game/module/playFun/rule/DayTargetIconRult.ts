class DayTargetIconRult extends RuleIconBase {
	private btn: eui.Button
	private lab: eui.Label
	public constructor(t) {
		super(t)
		this.firstTap = true
		this.updateMessage = [
			MessageDef.OPEN_SERVER,
			MessageDef.ACTIVITY_IS_AWARDS,
			MessageDef.UPDATE_ACTIVITY_PANEL,
		]
		this.btn = t.getChildByName("btn")
		this.lab = t.getChildByName("lab")
		t['redPoint'] = t.getChildByName("redPoint")
	}
	private _curActivityId: number
	//是否显示
	checkShowIcon() {
		if (GameGlobal.actorModel.level < 10) {
			return false
		}

		let list = ActivityModel.ins().getbtnListByType(ActivityModel.BTN_TYPE_01)
		let isShow = list.length > 0
		for (let i = 0, len = list.length; i < len; i++) {
			let item = list[i]
			if (item.actType == ActivityModel.TYPE_04) {
				this.btn.icon = ActivityModel.GetActivityConfig(item.id)["source1"]
				this._curActivityId = item.id
				break
			}
		}
		return isShow
	}
	public onTimer(): void {
		// let list = ActivityModel.ins().getTargetKFActivity()
		let data = GameGlobal.activityData[this._curActivityId]
		if (data == null) {
			// console.error(`activity ${this._curActivityId} data not found`)
			return
		}
		this.lab.text = DateUtils.GetFormatSecond(data.endTime - GameServer.serverTime, DateUtils.TIME_FORMAT_1)
	}
	//红点逻辑
	checkShowRedPoint() {
		var activityDatas = GameGlobal.activityData
		let btnList = ActivityModel.ins().getbtnListByType(ActivityModel.BTN_TYPE_01);
		for (var key in btnList) {
			var data = btnList[key].id;
			let cusData = ActivityModel.GetCusActData(data)
			if (cusData != null) {
				if (cusData.canReward()) {
					return true
				}
			} else {
				if (activityDatas[data].canReward()) {
					return true
				}
			}
		}
		return false;
	}

	getEffName(e) {
		// return this.DefEffe(e)
	}

	tapExecute() {

		ActivityWinSummer.onPlace = ActivityModel.BTN_TYPE_01;
		ViewManager.ins().open(ActivityWinSummer, ActivityWinSummer.onPlace);
		this.firstTap = false
		this.update()
	}
}
window["DayTargetIconRult"] = DayTargetIconRult