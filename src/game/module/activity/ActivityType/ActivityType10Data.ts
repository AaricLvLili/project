class ActivityType10Data extends ActivityBaseData {

	/**已经领取的奖励index*/
	cfgids:Array<any> = [];
	/**累计充值*/
	recharge:number = 0;
	update(e) {
		this.cfgids = e.cfgids;
		this.recharge = e.recharge;
	}

	GetRewardState(index: number): RewardState {
		var config = ActivityType10Data.getConfig(this.id);
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
		
		if (this.recharge >= data.yuanbao) {
			return RewardState.CanGet
		}
		return RewardState.NotReached
	}

	canReward() {
		var config = ActivityType10Data.getConfig(this.id);
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
		var config = GlobalConfig.ins("ActivityType10Config")[id]
		if (!config) {
			config = GlobalConfig.ins("ActivityType10AConfig")[id]
		}
		return config
	}
}
window["ActivityType10Data"]=ActivityType10Data