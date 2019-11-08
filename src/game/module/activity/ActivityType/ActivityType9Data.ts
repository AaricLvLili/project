class ActivityType9Data extends ActivityType2Data {

	private m_Day: number = 1
	
	update(t: any) {
		super.update(t)
		let data = t as Sproto.activity_type09
		this.m_Day = data.day
	}

	public GetConfigData() {
		return ActivityType2Data.GetConfig(this.id)[this.m_Day - 1]
	}
}
window["ActivityType9Data"]=ActivityType9Data