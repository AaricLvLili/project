class DayLoginIconRule extends RuleIconBase {
	public constructor(t) {
		super(t)
	}

	checkShowIcon() {
		return DayLoginIconRule.CheckShow()
	}

	checkShowRedPoint() {
		return DayLoginIconRule.ShowRedPoint() ? 1 : 0
	}

	getEffName(e) {
		return this.DefEffe(e)
	}

	tapExecute() {
		ViewManager.ins().open(DayLoginPanel), this.firstTap = !1, this.update()
	}

	public static ShowRedPoint() {
		let data: ActivityType5Data = ActivityModel.ins().GetActivityDataByType(5) as ActivityType5Data
		if (!data) {
			return false
		}
		return data.canReward()
	}

	public static CheckShow() {
		let data: ActivityType5Data = ActivityModel.ins().GetActivityDataByType(5) as ActivityType5Data
		if (!data) {
			return false
		}
		if (!data.isOpenTime()) {
			return false
		}
		return data.IsShow()
	}
}
window["DayLoginIconRule"]=DayLoginIconRule