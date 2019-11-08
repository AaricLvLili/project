class ActivityType5Data extends ActivityBaseData {

	logTime = 1
	private ActivityType5Config: any;
	update(e: Sproto.activity_type05) {
		this.record = e.record
		this.logTime = e.logTime
	}

	isOpenActivity() {
		// var e = Math.floor((DateUtils.formatMiniDateTime(this.startTime) - GameServer.serverTime) / 1e3),
		// 	t = Math.floor((DateUtils.formatMiniDateTime(this.endTime) - GameServer.serverTime) / 1e3);
		// return 0 > e && t > 0 ? !0 : !1
		return this.isOpenTime()
	}

	canReward(): boolean {
		if (this.ActivityType5Config == null)
			this.ActivityType5Config = GlobalConfig.ins("ActivityType5Config");
		var config = this.ActivityType5Config[this.id];
		for (var i in config) {
			var n = this.record >> config[i].index & 1;
			if (0 == n && config[i].day <= this.logTime) return !0
		}
		return !1
	}

	public GetConfigByIndex(index: number) {
		if (this.ActivityType5Config == null)
			this.ActivityType5Config = GlobalConfig.ins("ActivityType5Config");
		var config = this.ActivityType5Config[this.id]
		for (let key in config) {
			if (config[key].index == index) {
				return config[key]
			}
		}
		return null

	}

	checkOneDayStatu(index = 0): RewardState {
		index = Math.max(index, 1)
		let configData = this.GetConfigByIndex(index)
		if (!configData) {
			return RewardState.NotReached
		}
		if (this.logTime >= configData.day) {
			if (BitUtil.Has(this.record, index)) {
				return RewardState.Gotten
			}
			return RewardState.CanGet
		}
		return RewardState.NotReached
	}

	public IsShow(): boolean {
		if (this.ActivityType5Config == null)
			this.ActivityType5Config = GlobalConfig.ins("ActivityType5Config");
		var config = this.ActivityType5Config[this.id];
		for (var i in config) {
			var n = this.record >> config[i].index & 1;
			if (n == 0) {
				return true
			}
		}
		return false
	}

	// RewardFinish(): boolean {
	// 	var config = GlobalConfig.ins("ActivityType5Config")[this.id];
	// 	for (var i in config) {


	// 		var n = this.record >> config[i].index & 1;
	// 		if (0 == n && config[i].day <= this.logTime) return !0
	// 	}

	// 	return true
	// }
}
window["ActivityType5Data"]=ActivityType5Data