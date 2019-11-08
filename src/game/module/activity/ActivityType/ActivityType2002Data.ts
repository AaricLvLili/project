/**
 * 盛夏庆典-全民BOSS
 */
class ActivityType2002Data  extends ActivityBaseData {

	public mPoint = 0	

	public constructor() {
		super()
	}

	update(rsp: {count: number, status: number}) { 
		this.record = rsp.status
		this.mPoint = rsp.count
	}

	isOpenActivity(): boolean {
		return this.isOpenTime()
	}

	canReward() {
		let config = this.GetConfig()
		if (!config) {
			return false
		}
		for (let key in config) {
			if (this.GetRewardState(config[key].index) == RewardState.CanGet) {
				return true
			}
		}
		return false
	}

	public GetRewardState(index: number): RewardState {
		if (this.GetRecord(index)) {
			return RewardState.Gotten
		}
		let config = this.GetConfig()
		if (!config) {
			return RewardState.NotReached
		}
		if (this.mPoint >= config[index - 1].play) {
			return RewardState.CanGet
		}
		return RewardState.NotReached
	}

	public GetConfig() {
		return GlobalConfig.ins("ActivityType2002Config")[this.id]
	}
}
window["ActivityType2002Data"]=ActivityType2002Data