class ActivityType1Data extends ActivityBaseData {
	// 1 名额已满 2 名额未满未达成 3 已达成可领取未领取 4 已领取
	private m_DrawBin: number[] = []
	public mNums: number[] = []
	update(e: Sproto.activity_type01) {
		this.m_DrawBin = e.record
		this.mNums = e.nums
	}

	canReward() {
		// var config = GlobalConfig.ins("ActivityType1Config")[this.id],
		// 	t = this.record;
		// for (var i in config) {
		// 	var n = Math.floor(t / Math.pow(2, config[i].index)) % 2;
		// 	if (GameGlobal.actorModel.level >= config[i].level && GameGlobal.zsModel.lv >= config[i].zslevel && 0 == n) return !0
		// }
		// return !1
		for (let type of this.m_DrawBin) {
			if (type == 3) {
				return true
			}
		}
		return false
	}

	isOpenActivity() {
		return this.isOpenTime()
	}

	getRewardStateById(index: number) {
		let type = this.m_DrawBin[index]
		if (type == 1) {
			return 3
		}
		if (type == 2) {
			return RewardState.NotReached
		}
		if (type == 3) {
			return RewardState.CanGet
		}
		if (type == 4) {
			return RewardState.Gotten
		}
		return RewardState.NotReached
		// var config = GlobalConfig.ins("ActivityType1Config")[this.id][index];
		// if (GameGlobal.actorModel.level >= config.level && GameGlobal.zsModel.lv >= config.zslevel) {
		// 	var i = Math.floor(this.record / Math.pow(2, config.index)) % 2;
		// 	return i ? ActivityRewardState.Geted : ActivityRewardState.CanGet
		// }
		// return ActivityRewardState.NotReached
	}

	public static RewardWeight(type: number): number {
		switch (type) {
			case RewardState.NotReached: return 1
			case RewardState.CanGet: return 0
			case RewardState.Gotten: return 2
			case 4: return 4
		}
		return 4
	}
}
window["ActivityType1Data"]=ActivityType1Data