/**
 * 盛夏庆典-限时兑换
 */
class ActivityType2004Data extends ActivityBaseData {

	private m_Data: {
		[key: number]: {
			mIndex: number,
			mExchange: number,
			mLimit: number,
		}
	} = {}

	// private m_Point: number = 0

	public constructor() {
		super()
	}

	update(rsp: { personCounts: number[], globalCounts: number[] }) {
		// this.m_Point = rsp.count
		for (let i = 0; i < rsp.personCounts.length; ++i) {
			this.m_Data[i + 1] = {
				mIndex: i + 1,
				mExchange: rsp.personCounts[i],
				mLimit: rsp.globalCounts[i],
			}
		}
	}

	isOpenActivity(): boolean {
		return this.isOpenTime()
	}

	canReward() {
		let config = this.GetConfig()
		if (config) {
			for (let key in config) {
				if (config[key].personLimit != 0 && this.GetRewardState(config[key].index) == RewardState.CanGet) {
					return true
				}
			}
		}
		return false
	}

	public GetPoint(itemId): number {
		let itemData = UserBag.ins().getBagItemById(itemId)
		if (itemData) {
			return itemData.count
		}
		return 0
	}

	public GetRewardState(index: number): RewardState {
		let config = this.GetConfig()
		if (!config) {
			return RewardState.NotReached
		}
		let configData = config[index - 1]
		if (!configData) {
			return RewardState.NotReached
		}
		if (configData.serverLimit != 0 && this.GetLimit(index) >= configData.serverLimit) {
			return RewardState.NotReached
		}
		if (configData.personLimit != 0 && this.GetExchange(index) >= configData.personLimit) {
			return RewardState.NotReached
		}
		let itemData = UserBag.ins().getBagItemById(configData.itemId)
		if (itemData && itemData.count >= configData.itemCount) {
			return RewardState.CanGet
		}
		return RewardState.NotReached
	}

	public GetLimit(index: number): number {
		let data = this.m_Data[index]
		if (data) {
			return data.mLimit
		}
		return 0
	}

	public GetExchange(index: number): number {
		let data = this.m_Data[index]
		if (data) {
			return data.mExchange
		}
		return 0
	}

	public GetConfig() {
		return GlobalConfig.ins("ActivityType2004Config")[this.id]
	}
}
window["ActivityType2004Data"] = ActivityType2004Data