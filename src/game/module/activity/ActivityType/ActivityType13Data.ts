class ActivityType13Data extends ActivityBaseData {


	update (e) {}
	
	canReward () {
		return !1
	}
	
	isOpenActivity () {
		return this.isOpenTime()
	}
	
	updateMessage (e) {}
}
window["ActivityType13Data"]=ActivityType13Data