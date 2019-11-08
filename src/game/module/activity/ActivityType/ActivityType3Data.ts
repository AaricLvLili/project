class ActivityType3Data extends ActivityBaseData {

	dabiao: number = 0
	chongzhiTotal = 0
	btn1 = false
	btn2 = false
	image1 = false
	image2 = false
	recrod = 0

	rewards1
	_day7text = "累计7天，每日充值88888钻石可领取"
	rewards2
	maxTotal
	_totaltext = "活动期间累计充值8888888钻石可领取"

	update(t: Sproto.activity_type03) {
		this.record = t.record
		this.dabiao = t.day
		this.chongzhiTotal = t.rechargeCount
	}

	openDay() {
		var config = ActivityType3Data.getConfig(this.id);
		return config && config[0] ? config[0].day : 7
	}

	GetRewardState(index: number): RewardState {
		var config = ActivityType3Data.getConfig(this.id);
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
		
		if (BitUtil.Has(this.record, data.day)) {
			return RewardState.Gotten
		}
		if (this.dabiao >= data.day) {
			return RewardState.CanGet
		}
		/*
		if (this.chongzhiTotal < data.yuanbao) {
			return  RewardState.NotReached
		}
		*/
		if (this.dabiao == (data.day - 1)) {
			// if (this.chongzhiTotal < data.yuanbao) {
			if (this.chongzhiTotal < data.yuanbao) {
				return  RewardState.NotReached
			}
		}
		return RewardState.Undo
	}

	canReward() {
		var config = ActivityType3Data.getConfig(this.id);
		if (!config) {
			return false
		}

		for (let configData of config) {
			if (this.dabiao >= configData.day) {
				if (!BitUtil.Has(this.record, configData.index)) {
					return true
				}
			}
		}
		return false
	}

	isOpenActivity() {
		return this.isOpenTime()
	}

	get day7text() {
		var e = ActivityType3Data.getConfig(this.id);
		for (var t in e) 
			1 == e[t].type && (this.rewards1 = e[t].rewards, this._day7text = "累计" + ("<font color='#bf7d00'>" + e[t].day + "</font>") + "天，每日充值" + ("<font color='#bf7d00'>" + e[t].val + "</font>") + "钻石可领取");
		return this._day7text
	}

	get totaltext() {
		var e = ActivityType3Data.getConfig(this.id);
		for (var t in e) 2 == e[t].type && (this.maxTotal = e[t].val, this.rewards2 = e[t].rewards, this._totaltext = "活动期间累计充值" + ("<font color='#bf7d00'>" + e[t].val + "</font>") + "钻石可领取");
		return this._totaltext
	}

	canOnlyReward() {
		var e = ActivityType3Data.getConfig(this.id),
			t = this.recrod;
		this.btn1 = !1, this.btn2 = !1, this.image1 = !1, this.image2 = !1;
		for (var i in e) {
			var n = Math.floor(t / Math.pow(2, e[i].index)) % 2;
			// 1 == e[i].type && this.dabiao >= e[i].day && (0 == n && (this.btn1 = !0), 1 == n && (this.image1 = !0)), 2 == e[i].type && e[i].val <= this.chongzhiTotal && (0 == n && (this.btn2 = !0), 1 == n && (this.image2 = !0))
			1 == e[i].type && this.dabiao >= e[i].day && (0 == n && (this.btn1 = !0), 1 == n && (this.image1 = !0)), 2 == e[i].type && e[i].val <= this.chongzhiTotal && (0 == n && (this.btn2 = !0), 1 == n && (this.image2 = !0))
		}
	}

	public static getConfig(id: number) {
		var config = GlobalConfig.ins("ActivityType3Config")[id]
		if (!config) {
			config = GlobalConfig.ins("ActivityType3AConfig")[id]
		}
		return config
	}
}
window["ActivityType3Data"]=ActivityType3Data