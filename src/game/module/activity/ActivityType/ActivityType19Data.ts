class Activity19ItemData {
	count
	id
	numBuy
	state
	index
	icon
}

class ActivityType19Data extends ActivityBaseData {
	// public constructor(t) {
	// 	super()
	// 	this.list = [], this.listInfo = [], this.count = 0
	// }

	list
	listInfo
	count

	update(e: Sproto.activity_type19) {
		this.count = e.count, this.list = [];
		for (var len = e.itemState.length, config = GlobalConfig.ins("ActivityType19Config")[this.id], i = 0; len > i; i++) {
			var r = new Activity19ItemData;
			r.count = config.awardLimit[i]
			r.id = config.rewards[i].id
			r.numBuy = this.count
			r.state = e.itemState[i].state
			r.index = i + 1
			r.icon = config.icon[i]
			this.list.push(r)
		}
		this.list.sort(ActivityBaseData.sort)
	}

	init() {
		var e = GlobalConfig.ins("ActivityType19Config")[this.id];
		this.list = [];
		for (var t = 0; t < e.rewards.length; t++) {
			var i = new Activity19ItemData;
			i.count = e.awardLimit[t], i.id = e.rewards[t].id, i.numBuy = this.count, i.state = RewardState.NotReached, i.index = t + 1, i.icon = e.icon[t], this.list.push(i)
		}
	}

	updateInfo(e) {
		var t = e.readShort();
		this.listInfo = [];
		for (var i = 0; t > i; i++) {
			var n = "|C:0x12b2ff&T:",
				r = e.readString();
			n += r + "|在福袋中获得";
			var o = GlobalConfig.itemConfig[e.readInt()];
			n += "|C:" + ItemBase.QUALITY_COLOR[o.quality] + "&T:" + o.name + "|", this.listInfo.push(n)
		}
		this.listInfo.reverse()
	}

	canReward() {
		for (var e = 0; e < this.list.length; e++)
			if (this.list[e].state == RewardState.CanGet) return !0;
		return !1
	}

	isOpenActivity() {
		return this.isOpenTime()
	}

	updateMessage(e) { }
}
window["Activity19ItemData"]=Activity19ItemData
window["ActivityType19Data"]=ActivityType19Data