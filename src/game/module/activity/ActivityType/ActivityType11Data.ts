class ActivityType11Data extends ActivityBaseData {

	/**已经领取的奖励index*/
	cfgids:Array<any> = [];
	/**累计充值*/
	recharge:number = 0;
	/**活动开启天数，当天开启就是0*/
	static diffDay:number = 0;
	update(e) {
		this.cfgids = e.cfgids;
		this.recharge = e.recharge;
		ActivityType11Data.diffDay = e.diffDay;
	}

	GetRewardState(index: number): RewardState {
		var config = ActivityType11Data.getConfig(this.id);
		let data
		for (let key in config) {
			var info = config[key];
			if (info.index == index) {
				data = info;
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
		
		if (this.recharge >= data.pay) {
			return RewardState.CanGet
		}
		return RewardState.NotReached
	}

	canReward() {
		var config = ActivityType11Data.getConfig(this.id);
		if (!config) {
			return false
		}

		for (let key of config) {
			var info = config[key];
			let state = this.GetRewardState(info["index"]);
			if(state == RewardState.CanGet)
				return true;
		}
		return false
	}

	isOpenActivity() {
		return this.isOpenTime()
	}

	public static getConfig(id: number) {
		return GlobalConfig.ins("ChongZhi2AConfig")[id][ActivityType11Data.diffDay]
	}
}
window["ActivityType11Data"]=ActivityType11Data