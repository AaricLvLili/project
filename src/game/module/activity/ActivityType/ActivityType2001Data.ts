/**
 * 盛夏庆典-累计消费
 */
class ActivityType2001Data extends ActivityBaseData {

	public mPay = 0	

	public constructor() {
		super()
	}

	update(rsp: {count: number, status: number}) {
		this.record = rsp.status
		this.mPay = rsp.count
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
		if (this.mPay >= config[index - 1].play) {
			return RewardState.CanGet
		}
		return RewardState.NotReached
	}

	public GetConfig() {
		return GlobalConfig.ins("ActivityType2001Config")[this.id]
	}
}
window["ActivityType2001Data"]=ActivityType2001Data