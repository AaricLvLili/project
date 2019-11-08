class ActivityType302Data extends ActivityBaseData {

	/**已经购买的index*/
	records:number;
	update(e) { 
		this.records = e.records;
	}

	canReward() {
		return !1
	}
	public get openDay(): number {
		if (!this.isOpenActivity())
			return -1
		let time = GameServer.serverTime - this.startTime
		return Math.ceil(time / 24 / 60 / 60)
	}

	isOpenActivity() {
		return this.isOpenTime()
	}

	updateMessage(e) { }
}
window["ActivityType302Data"]=ActivityType302Data