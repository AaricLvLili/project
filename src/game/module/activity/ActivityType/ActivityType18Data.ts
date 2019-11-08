class ActivityType18Data extends ActivityBaseData {
	// public constructor(t: Sproto.activity_type18) {
	// 	super()

	// 	this.lastTime = t.lastTime
	// }

	lastTime


	update (e) {
		ViewManager.ins().isShow(ActivityWin) && ViewManager.ins().close(ActivityWin)
	}
	canReward () {
		return !1
	}
	isOpenActivity () {
		return this.isOpenTime()
	}
	updateMessage (e: Sproto.activity_type18) {
		this.lastTime = e.lastTime
	}
}
window["ActivityType18Data"]=ActivityType18Data