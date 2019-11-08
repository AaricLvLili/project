class Activity3PanelItem extends RechargeGiftPanelItem {

	private dayLabel: eui.BitmapLabel
	private valueLabel: eui.BitmapLabel
	private valueLabel0: eui.BitmapLabel

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
		// MoneyTreeModel.ins().GetRechargeGift(i.index)
	}

	dataChanged() {
		var data = this.data.config
		let activityData = this.data.actData
		// if (!ErrorLog.Assert(data, "AchievementTaskConfig no such id:" + data.index)) {
		// 	var n = data.desc
		let array = null
		if (!data || !data.rewards) {
			array = []
		} else {
			array = data.rewards
		}
		this.m_Award = array
		this.list.dataProvider = new eui.ArrayCollection(array)

		// let activityData = ActivityModel.ins().GetActivityDataByType(3) as ActivityType3Data
		let str = LanguageString.jifengTiaoyueCh(GlobalConfig.jifengTiaoyueLg.st101284, [data.day])

		this.labelInfo.textFlow = TextFlowMaker.generateTextFlow(str + this.GetStr(activityData, data));

		let state = activityData.GetRewardState(data.index)
		this.currentState = "" + state

		if (this.dayLabel != null) {
			this.dayLabel.text = data.day + ""
		}
		if (this.valueLabel != null) {
			let [str, color] = this.GetStrContent(activityData, data)
			if (str == "") {
				this.valueLabel.text = ""
				this.valueLabel0.text = ""
			} else {
				this.valueLabel.visible = color != Color.Red
				this.valueLabel0.visible = color == Color.Red
				this.valueLabel.text = str + ""
				this.valueLabel0.text = str + ""
			}
		}
	}

	private GetStr(activityData: ActivityType3Data, data) {
		if (activityData.dabiao > data.day) {
			return ""
		}
		if (activityData.dabiao == data.day) {
			return `|C:0x00ff00&T:(${activityData.chongzhiTotal}/${data.yuanbao})|`
		}
		if (activityData.dabiao == data.day - 1) {
			if (activityData.chongzhiTotal < data.yuanbao) {
				return `|C:0xf87372&T:(${activityData.chongzhiTotal}/${data.yuanbao})|`
			}
		}
		return `|C:0xf87372&T:(0/${data.yuanbao})|`
	}

	private GetStrContent(activityData: ActivityType3Data, data) {
		if (activityData.dabiao > data.day) {
			return ["", 0]
		}
		if (activityData.dabiao == data.day) {
			// return `|C:0x00ff00&T:(${MoneyTreeModel.GetTodayRecharge()}/${data.yuanbao})|`
			return [`(${activityData.chongzhiTotal}/${data.yuanbao})`, Color.Green]
		}
		if (activityData.dabiao == data.day - 1) {
			if (activityData.chongzhiTotal < data.yuanbao) {
				return [`(${activityData.chongzhiTotal}/${data.yuanbao})`, Color.Red]
			}
		}
		// return `|C:0xf87372&T:(0/${data.yuanbao})|`
		return [`(0/${data.yuanbao})`, Color.Red]
	}
}

class ActivityType3Panel extends ActivityPanel {
	public constructor() {
		super()
	}

	listTop: eui.List
	// date
	recharge: eui.Button

	initUI() {
		// if (this.activityID == 15 || this.activityID == 16) {
		// 	this.skinName = "Activity3PanelSkin_2"
		// } else {
		// 	this.skinName = "Activity3PanelSkin"
		// }
		this.skinName = "Activity3PanelSkin_2"
		this.listTop.itemRenderer = Activity3PanelItem
		this.listTop.dataProvider = new eui.ArrayCollection([])
	}

	open(e) {
		this.updateView()
		this.recharge.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTabTouch, this)
		GameGlobal.MessageCenter.addListener(MessageDef.UPDATE_ACTIVITY_PANEL, this.updateView, this)
	}

	close() {
		this.recharge.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onTabTouch, this)
		GameGlobal.MessageCenter.removeListener(MessageDef.UPDATE_ACTIVITY_PANEL, this.updateView, this)
	}

	onChange() {
		this.updateTopList()
	}

	updateView() {
		this.updateTopList()
	}

	updateTopList() {
		var activityData = <ActivityType3Data>GameGlobal.activityData[this.activityID]
		let config = ActivityType3Data.getConfig(this.activityID);
		//重新做排序
		let datas = []
		for (let key in config) {
			let index = config[key]["index"];
			let state = activityData.GetRewardState(index)
			let weight = 3;
			if (state == RewardState.NotReached)
				weight = 1;
			else if (state == RewardState.CanGet)
				weight = 0;
			else if (state == RewardState.Gotten)
				weight = 3;
			else if (state == RewardState.Undo)
				weight = 2;

			config[key]["sortweight"] = weight
			datas.push({ config: config[key], actData: activityData })
		}
		datas.sort((lhs, rhs) => {
			return lhs.config.sortweight - rhs.config.sortweight
		})
		this.listTop.dataProvider = new eui.ArrayCollection(datas)

		// this.date.text = "剩余时间：" + activityData.getRemindTimeString()

	}

	onTabTouch(e) {
		switch (e.currentTarget) {
			case this.recharge:
				ViewManager.ins().close(this)
				ViewManager.ins().open(ChargeFirstWin)
		}
	}
}
window["Activity3PanelItem"] = Activity3PanelItem
window["ActivityType3Panel"] = ActivityType3Panel