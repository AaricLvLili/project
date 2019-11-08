class ActivityType14Data extends ActivityBaseData {

	/**已经领取的奖励index*/
	cfgids:Array<any> = [];
	/**累计消费*/
	accumulativeConsumption:number = 0;
	update(e) {
		this.cfgids = e.cfgids;
		this.accumulativeConsumption = e.accumulativeConsumption;
	}

	GetRewardState(index: number): RewardState {
		var config = ActivityType14Data.getConfig(this.id);
		let data
		for (let configData of config) {
			if (configData.index == index) {
				data = configData
				break
			}
		}
		if (!data) {
			return RewardState.NotReached
		}

		for(var info of this.cfgids) 
		{
			if(info.state == index)
				return RewardState.Gotten;
		}
		
		if (this.accumulativeConsumption >= data.play) {
			return RewardState.CanGet
		}
		return RewardState.NotReached
	}

	canReward() {
		var config = ActivityType14Data.getConfig(this.id);
		if (!config) {
			return false
		}

		for (let configData of config) {
			let state = this.GetRewardState(configData["index"]);
			if(state == RewardState.CanGet)
				return true;
		}
		return false
	}

	isOpenActivity() {
		return this.isOpenTime()
	}

	public static getConfig(id: number) {
		return GlobalConfig.ins("ActivityType2001AConfig")[id]
	}
}
window["ActivityType14Data"]=ActivityType14Data