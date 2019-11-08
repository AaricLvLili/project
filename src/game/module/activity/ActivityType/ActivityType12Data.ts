class ActivityType12Data extends ActivityBaseData {
	update(e) {
		EggBroken.ins().awards = e.eggBrokenAwards;
		EggBroken.ins().count = e.eggBrokenCount;
		EggBroken.ins().endTime = this.endTime;
		EggBroken.ins().diffDay = e.diffDay;
	}

	isOpenActivity() {
		return this.isOpenTime()
	}

	canReward() {
		return EggBroken.ins().HasAward(false);
	}
}
window["ActivityType12Data"]=ActivityType12Data