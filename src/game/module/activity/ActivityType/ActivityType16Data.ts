class ActivityType16Data extends ActivityBaseData {
	// public constructor(t: Sproto.activity_type16) {
	// 	super()

	// 	this.records = t.records, this.recharge = t.recharge
	// }

	records
	recharge


	update(e: Sproto.activity_type16) {
		this.records = e.records
	}

	canReward() {
		var e = GlobalConfig.ins("ActivityType16Config")[this.id];
		for (var t in e) {
			var i = this.records >> e[t].index & 1;
			if (0 == i && this.recharge >= e[t].recharegeyuanbao) return !0
		}
		return !1
	}

	isOpenActivity() {
		return this.isOpenTime()
	}

	updateMessage(e: Sproto.activity_type16) {
		this.recharge = e.recharge
	}
}
window["ActivityType16Data"]=ActivityType16Data