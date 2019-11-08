class ActivityType17Data extends ActivityBaseData {
	// public constructor(t: Sproto.activity_type17) {
	// 	super()
	// 	this.parse(t)
	// }

	dayIndex
	isGet
	canGet

	update(e) { }

	updateMessage(e: Sproto.activity_type17) {
		this.parse(e)
	}

	parse(e: Sproto.activity_type17) {
		this.dayIndex = e.dayIndex, this.isGet = e.isGet, this.canGet = e.canGet
	}

	isOpenActivity() {
		return this.isOpenTime()
	}

	canReward() {
		return this.canGet
	}
}
window["ActivityType17Data"]=ActivityType17Data