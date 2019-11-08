class ActivityType8Data extends ActivityBaseData {

	m_ItemData: {[key: number]: ActivityType8ItemData} = {}
	private m_State: number = 0
	private ActivityType8Config:any;
	update(t: Sproto.activity_type08) {
		if (t) {
			this.m_State = t.status
			for (let key in t.datas) {
				let data = t.datas[key]
				let typeData = new ActivityType8ItemData(data)
				this.m_ItemData[typeData.mIndex] = typeData
			}
		}
		// 初始化数据
		if(this.ActivityType8Config == null)
			this.ActivityType8Config = GlobalConfig.ins("ActivityType8Config");
		let config = this.ActivityType8Config[this.id]
		for (let key in config) {
			let data = config[key]
			if (!this.m_ItemData[data.index]) {
				let typeData = new ActivityType8ItemData(null)
				typeData.mIndex = data.index
				typeData.mRewardState = RewardState.NotReached
				typeData.mDay = 0
				this.m_ItemData[data.index] = typeData
			}
		}
	}

	public CanInvest(): boolean {
		return this.m_State == 1
	}

	canReward() {
		for (let key in this.m_ItemData) {
			if (this.m_ItemData[key].mRewardState == RewardState.CanGet) {
				return true
			}
		}
	}

	isOpenActivity() {
		// for (let key in this.m_ItemData) {
		// 	let data = this.m_ItemData[key]
		// 	if (data.mRewardState)
		// }
		if(this.ActivityType8Config == null)
			this.ActivityType8Config = GlobalConfig.ins("ActivityType8Config");
		let config = this.ActivityType8Config[this.id]
		for (let key in config) {
			let configData = config[key]
			let itemData = this.m_ItemData[configData.index]
			if (itemData.mRewardState == RewardState.CanGet) {
				return true
			}
			if (itemData.mRewardState == RewardState.Gotten && itemData.mDay < configData.day) {
				return true
			}
		}
		return this.CanInvest()
		// return this.isOpenTime()
	}

	GetItemDataByID(index: number) {
		return this.m_ItemData[index]
	}

	public GetConfigData() {
		if(this.ActivityType8Config == null)
			this.ActivityType8Config = GlobalConfig.ins("ActivityType8Config");
		return this.ActivityType8Config[this.id];
	}

	public GetConfigItemData(index: number) {
		let config = this.GetConfigData()
		for (let key in config) {
			if (config[key].index == index) {
				return config[key]
			}
		}
		return null
	}
}

class ActivityType8ItemData {
	public mIndex: number
	public mRewardState: RewardState
	public mDay: number
	public constructor(data: Sproto.activity_type08_item) {
		if (!data) {
			return
		}
		this.mIndex = data.index
		this.mRewardState = data.status
		this.mDay = data.day
	}
}
window["ActivityType8Data"]=ActivityType8Data
window["ActivityType8ItemData"]=ActivityType8ItemData