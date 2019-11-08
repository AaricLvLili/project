class FbModel {

	fbID: number;
	useCount: number;
	vipBuyCount: number;
	vipHoldCount: number;
	private dailyFubenConfig;
	public parser(data: Sproto.raid_data) {
		this.fbID = data.fbId
		this.useCount = data.useCount
		this.vipBuyCount = data.vipBuyCount
		this.vipHoldCount = data.vipHoldCount
	}
	//获取剩余扫荡次数
	public getSaoDangCount(): number {
		if(this.dailyFubenConfig == null)
			this.dailyFubenConfig = GlobalConfig.dailyFubenConfig;
		var config = this.dailyFubenConfig[this.fbID];
		let vipCount = config.vipBuyCount[UserVip.ins().lv]
		let leftCount = vipCount + config.freeCount - this.useCount
		return leftCount
	}
	// 挑战次数
	public getCount(): number {
		if(this.dailyFubenConfig == null)
			this.dailyFubenConfig = GlobalConfig.dailyFubenConfig;
		var config = this.dailyFubenConfig[this.fbID];
		if (config.zsLevel > 0) {
			if (UserZs.ins().lv < config.zsLevel)
				return 0;
		}
		else {
			if (GameLogic.ins().actorModel.level < config.levelLimit)
				return 0; 
		}
		// return GlobalConfig.dailyFubenConfig[this.fbID].freeCount + this.vipBuyCount + this.vipHoldCount - this.useCount;
		// return this.dailyFubenConfig[this.fbID].freeCount + this.vipBuyCount  - this.useCount;
		return this.dailyFubenConfig[this.fbID].freeCount - this.useCount;
		
		// return GlobalConfig.dailyFubenConfig[this.fbID].freeCount - this.useCount;
	};
	//下次挑战获得的额外奖励
	public getNextReward():number
	{
		if(this.dailyFubenConfig == null)
			this.dailyFubenConfig = GlobalConfig.dailyFubenConfig;
		var tempCount =  this.dailyFubenConfig[this.fbID].freeCount + this.vipBuyCount;
		let desParam1 = this.dailyFubenConfig[this.fbID].desParam1;
		return desParam1;
		// return this.useCount < tempCount ? (this.useCount+1)*desParam1 : tempCount*desParam1;
	}
     /**
     * 获取下次vip显示
     * return -1表示已全部用完
     */
	public getNextVip  () {
		if(this.dailyFubenConfig == null)
			this.dailyFubenConfig = GlobalConfig.dailyFubenConfig;
		var config = this.dailyFubenConfig[this.fbID];
		for (var i in config.vipBuyCount) {
			// if (this.useCount - config.freeCount - config.vipBuyCount[i] < 0)
			// 	return parseInt(i);
			if(this.vipBuyCount  - config.vipBuyCount[i] < 0)
				return parseInt(i);
		}
		return -1;
	};
    /**
     * 获取当前剩余的重置次数
     */
	public getResetCount  () {
		var vip = UserVip.ins().lv;
		if(this.dailyFubenConfig == null)
			this.dailyFubenConfig = GlobalConfig.dailyFubenConfig;
		var config = this.dailyFubenConfig[this.fbID];
		return config.vipBuyCount[vip] - (this.useCount - config.freeCount);
	};
	/**
     * 获取对应VIP等级当日剩余的重置次数
     */
	public getVipResetCount  (vip) {
		if(this.dailyFubenConfig == null)
			this.dailyFubenConfig = GlobalConfig.dailyFubenConfig;
		var config = this.dailyFubenConfig[this.fbID];
		return config.vipBuyCount[vip] - (this.useCount - config.freeCount);
	};
}
window["FbModel"]=FbModel