/**
 * 盛夏庆典-登录好礼
 */
class ActivityType2000Data extends ActivityBaseData {

	private m_Day = 1

	public constructor() {
		super()
	}

	update(rsp: {today: number, status: number}) {
		this.record = rsp.status
		this.m_Day = rsp.today
	}

	isOpenActivity(): boolean {
		return this.isOpenTime()
	}

	canReward() {
		if (!this.GetRecord(1)) {
			return true
		}
		if (!this.GetRecord(2) && Recharge.ins().IsMonthCard()) {
			return true
		}
		if (!this.GetRecord(3) && Recharge.ins().IsZunCard()) {
			return true
		}
		return false
	}

	public GetRewardState(index: number): RewardState {
		if (this.GetRecord(index)) {
			return RewardState.Gotten
		}
		if (index == 1) {
			return RewardState.CanGet
		}
		if (index == 2 && Recharge.ins().IsMonthCard()) {
			return RewardState.CanGet
		}
		if (index == 3 && Recharge.ins().IsZunCard()) {
			return RewardState.CanGet
		}
		return RewardState.NotReached
	}

	public GetConfig() {
		let config = null
		try {
			let obj = GlobalConfig.ins("ActivityType2000Config")[this.id]; 
			config = GlobalConfig.ins("ActivityType2000Config")[this.id][this.m_Day - 1]
		} catch (e) { }
		return config
	}

	public GetConfigByIndex(index: number) {
		let config = this.GetConfig()
		if (config) {
			return config[index]
		}
		return null
	}
}
window["ActivityType2000Data"]=ActivityType2000Data