class ActivityType1ItemRenderer extends eui.ItemRenderer {
	public constructor() {
		super()

		this.skinName = "ActLevelSonSkin"
		this.list.itemRenderer = ActivityItemShow
		this.rewardBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.reward, this)
		this.rewardBtn.label = GlobalConfig.jifengTiaoyueLg.st101076;
		this.noReach.text = GlobalConfig.jifengTiaoyueLg.st100680;
	}

	// level
	public list: eui.List;
	public level: eui.Image;
	public rewardBtn: eui.Button;
	public rewardedTip: eui.Image;
	public rewardedTip2: eui.Image;
	public noReach: eui.Label;
	public labelInfo: eui.Label;

	dataChanged() {
		var configData = this.data
		let data: ActivityType1Data = <ActivityType1Data>GameGlobal.activityData[configData.Id];
		let limitStr = ""
		if (configData.limit > 0) {
			limitStr = LanguageString.jifengTiaoyueCh(GlobalConfig.jifengTiaoyueLg.st101275, [data.mNums[configData.index - 1], configData.limit])
		}
		if (configData.zslevel > 0) {
			// this.level.source = "level_" + (8 + configData.zslevel)
			this.labelInfo.textFlow = TextFlowMaker.generateTextFlow(LanguageString.jifengTiaoyueCh(GlobalConfig.jifengTiaoyueLg.st101276, [configData.zslevel]) + limitStr)
		} else {
			this.labelInfo.textFlow = TextFlowMaker.generateTextFlow(LanguageString.jifengTiaoyueCh(GlobalConfig.jifengTiaoyueLg.st101277, [configData.level]) + limitStr)
			// this.level.source = "level_" + configData.level / 10
		}
		this.currentState = data.getRewardStateById(configData.index - 1) + ""
		this.list.dataProvider = new eui.ArrayCollection(configData.rewards)
	}

	reward(e) {
		if (UserBag.ins().getSurplusCount() >= 1) {
			var t = this.data;
			ActivityModel.ins().sendReward(t.Id, t.index)
		} else UserTips.ins().showTips(GlobalConfig.jifengTiaoyueLg.st100051)
	}
}

class ActivityType1Panel extends ActivityPanel {
	public constructor() {
		super()
		this.skinName = "ActLevelSkin"
		this.list.itemRenderer = ActivityType1ItemRenderer
	}
	listData
	list
	// date
	// desc

	initUI() {
		super.initUI();
		this.listData = new eui.ArrayCollection(), this.list.dataProvider = this.listData
	}

	open() {
		for (var e = [], t = 0; t < arguments.length; t++) e[t] = arguments[t];
		this.updateData()
		ActivityModel.ins().SendLevelInfo(this.activityID)
	}

	close() {
		for (var e = [], t = 0; t < arguments.length; t++) e[t] = arguments[t];
		// console.log("close")
	}

	updateData() {
		var e = GameGlobal.activityData[this.activityID];
		// this.date.text = e.getRemindTimeString(), this.desc.text = GlobalConfig.ins("ActivityConfig")[this.activityID].desc;
		var t = GlobalConfig.ins("ActivityType1Config")[e.id].slice();
		t.sort(this.sortFunc), this.listData.replaceAll(t)
	}

	sortFunc(lhs, rhs) {
		var activityData = <ActivityType1Data>GameGlobal.activityData[lhs.Id]
		let v = ActivityType1Data.RewardWeight(activityData.getRewardStateById(lhs.index - 1)) - ActivityType1Data.RewardWeight(activityData.getRewardStateById(rhs.index - 1))
		if (v == 0) {
			v = lhs.zslevel - rhs.zslevel
			if (v == 0) {
				v = lhs.level - rhs.level
			}
		}
		return v
	}
}
window["ActivityType1ItemRenderer"] = ActivityType1ItemRenderer
window["ActivityType1Panel"] = ActivityType1Panel