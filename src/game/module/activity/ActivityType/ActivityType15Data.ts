class ActivityType15Data extends ActivityBaseData {

	/**已经购买的index*/
	buyids:Array<any> = [];
	update(e) { 
		this.buyids = e.buyids;
	}

	canReward() {
		return !1
	}

	isOpenActivity() {
		return this.isOpenTime()
	}

	updateMessage(e) { }
}
window["ActivityType15Data"]=ActivityType15Data