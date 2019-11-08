class ActivityType4Data extends ActivityBaseData {

	canReward() {
		return this.isOpenActivity() && GameGlobal.activityModel.getisCangetDabiao(this.id)
	}

	isOpenActivity() {
		return this.isOpenTime()
	}
}
window["ActivityType4Data"]=ActivityType4Data