class Activity10PanelItem extends RechargeGiftPanelItem {
	public constructor() {
		super()
	}
	protected _SetSkin() {
		// empty
	}

	protected createChildren() {
		super.createChildren();
		this.labelGo.text = GlobalConfig.jifengTiaoyueLg.st101077;
		this.labelUndo.text = GlobalConfig.jifengTiaoyueLg.st100680;
		this.btnGet.label = GlobalConfig.jifengTiaoyueLg.st101076;
	}

	protected OnClickClose() {
		ViewManager.ins().close(ActivityWin)
	}

	protected OnGetAward(e) {
		var config = e.target.parent.data.config;
		ActivityModel.ins().sendReward(config.Id, config.index)
	}

	dataChanged() {
		var data = this.data.config
		let activityData: ActivityType10Data = this.data.actData
		let array = null
		if (!data || !data.rewards) {
			array = []
		} else {
			array = data.rewards
		}
		this.m_Award = array
		this.list.dataProvider = new eui.ArrayCollection(array)
		this.labelInfo.textFlow = TextFlowMaker.generateTextFlow(LanguageString.jifengTiaoyueCh(GlobalConfig.jifengTiaoyueLg.st101283, [this.GetStr(activityData, data)]));
		let state = activityData.GetRewardState(data.index)
		this.currentState = "" + state
	}

	private GetStr(activityData: ActivityType10Data, data) {
		if (activityData.recharge >= data.yuanbao)
			return `|C:0x00ff00&T:(${activityData.recharge}/${data.yuanbao})|`
		else
			return `|C:0xf87372&T:(${activityData.recharge}/${data.yuanbao})|`
	}
}

class ActivityType10Panel extends ActivityPanel {
	public constructor() {
		super()
	}

	listTop: eui.List
	initUI() {
		this.skinName = "Activity3PanelSkin"
		this.listTop.itemRenderer = Activity10PanelItem
		this.listTop.dataProvider = new eui.ArrayCollection([])
	}

	open(e) {
		this.updateView()
		GameGlobal.MessageCenter.addListener(MessageDef.UPDATE_ACTIVITY_PANEL, this.updateView, this)
	}

	close() {
		GameGlobal.MessageCenter.removeListener(MessageDef.UPDATE_ACTIVITY_PANEL, this.updateView, this)
	}

	onChange() {
		this.updateTopList()
	}

	updateView() {
		this.updateTopList()
	}

	updateTopList() {
		var activityData = <ActivityType10Data>GameGlobal.activityData[this.activityID]
		let config = ActivityType10Data.getConfig(this.activityID);
		// //重新做排序
		let datas = []
		for (let key in config) {
			let index = config[key]["index"];
			let state = activityData.GetRewardState(index)
			let weight = 2;
			if (state == RewardState.CanGet)
				weight = 0;
			else if (state == RewardState.NotReached)
				weight = 1;
			else if (state == RewardState.Gotten)
				weight = 2;

			config[key]["sortweight"] = weight
			datas.push({ config: config[key], actData: activityData })
		}
		datas.sort((lhs, rhs) => {
			return lhs.config.sortweight - rhs.config.sortweight
		})
		this.listTop.dataProvider = new eui.ArrayCollection(datas);
	}
}
window["Activity10PanelItem"] = Activity10PanelItem
window["ActivityType10Panel"] = ActivityType10Panel