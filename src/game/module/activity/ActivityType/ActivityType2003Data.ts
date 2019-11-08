/**
 * 盛夏庆典-时装寻宝
 */
class ActivityType2003Data extends ActivityBaseData {
	public constructor() {
		super()
	}

	update(e) { }

	isOpenActivity(): boolean {
		return this.isOpenTime()
	}

	canReward() {
		return false
	}

	public GetRewardState(index: number): RewardState {
		return RewardState.NotReached
	}

	public GetConfig() {
		return GlobalConfig.ins("ActivityType2003Config")[this.id]
	}
}
window["ActivityType2003Data"]=ActivityType2003Data