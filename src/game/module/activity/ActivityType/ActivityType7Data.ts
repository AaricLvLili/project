class ActivityType7Data extends ActivityBaseData {

	count: number

	update(e: Sproto.activity_type07) {
		this.record = e.status ? 1 : 0
		this.count = e.recharge
	}
    
	canReward() {
		return this.GetRewardState() == RewardState.CanGet
	}

	isOpenActivity() {
		return this.isOpenTime()
	}

	public GetRewardState(): RewardState {
		let e = ActivityType7Data.GetConfig(this.id)
		if (this.record) {
			return RewardState.Gotten
		}
		if (this.count >= e.recharge) {
			return RewardState.CanGet
		}
		return RewardState.NotReached
	}

	public static GetConfig(id) {
		let config = GlobalConfig.ins("ActivityType7Config")[id]
		return config
		// if (config) {
		// 	for (let key in config) {
		// 		return config[key]
		// 	}
		// }
		// return null
	}
}
window["ActivityType7Data"]=ActivityType7Data