class ActivityType2000Panel extends ActivityPanel {

	private group: eui.Group
	private descLabel: eui.Label//合服活动时间描述
	private m_List: {
		list: eui.List
		btn: eui.Button
		getIcon: eui.Image
		labelGo: eui.Label
	}[]

	public constructor() {
		super()
		if (ActivityWinSummer.onPlace == ActivityModel.BTN_TYPE_04)
			this.skinName = "HfActivityType2000Skin"
		else
			this.skinName = "ActivityType2000Skin"

		this.m_List = []
		for (let i = 0; i < this.group.numChildren; ++i) {
			let child = this.group.getChildAt(i) as eui.Component
			let list = child.getChildByName("list") as eui.List
			let btn = child.getChildByName("btn") as eui.Button
			btn.addEventListener(egret.TouchEvent.TOUCH_TAP, this._OnClick, this)
			let labelGo = child.getChildByName("labelGo") as eui.Label
			if (labelGo) {
				UIHelper.SetLinkStyleLabel(labelGo)
				labelGo.addEventListener(egret.TouchEvent.TOUCH_TAP, this._OnClickGo, this)
			}
			list.itemRenderer = ItemBaseEffe
			this.m_List.push({
				list: list,
				btn: btn,
				getIcon: child.getChildByName("getIcon"),
				labelGo: labelGo,
			} as any)
		}
	}

	public open() {
		GameGlobal.MessageCenter.addListener(MessageDef.RECHARGE_UPDATE_MONTH_DAY, this.updateData, this)
		this.updateData()
	}

	public close() {
		GameGlobal.MessageCenter.removeListener(MessageDef.RECHARGE_UPDATE_MONTH_DAY, this.updateData, this)
		for (let item of this.m_List) {
			item.btn.removeEventListener(egret.TouchEvent.TOUCH_TAP, this._OnClick, this)
			if (item.labelGo) {
				item.labelGo.removeEventListener(egret.TouchEvent.TOUCH_TAP, this._OnClickGo, this)
			}
		}
	}

	public updateData() {
		let actData = ActivityModel.ins().GetActivityDataById(this.activityID) as ActivityType2000Data
		if (this.descLabel)
			this.descLabel.text = actData.GetSurplusTimeStr()
		let config = actData.GetConfig();
		if (config == null) return;
		for (let i = 0; i < this.m_List.length; ++i) {
			let index = i + 1
			let configData = config[i]
			if (configData) {
				let itemData = this.m_List[i]
				itemData.list.dataProvider = new eui.ArrayCollection(RewardData.ToRewardDatas(configData.rewards))
				let rewardState = actData.GetRewardState(index)
				itemData.getIcon.visible = rewardState == RewardState.Gotten
				itemData.btn.visible = rewardState == RewardState.CanGet
				if (itemData.labelGo) {
					itemData.labelGo.visible = rewardState == RewardState.NotReached
				}
			}
		}
	}

	private _OnClickGo(): void {
		ViewManager.ins().open(FuliWin, 1, 4)
	}

	private _OnClick(e: egret.TouchEvent): void {
		let index = -1
		for (let i = 0; i < this.m_List.length; ++i) {
			if (this.m_List[i].btn == e.currentTarget) {
				index = i + 1
				break
			}
		}
		if (index != -1) {
			switch (index) {
				case 1:
					if (this.activityID == 2010 && GameLogic.ins().actorModel.level < 80) {
						UserTips.InfoTip(GlobalConfig.jifengTiaoyueLg.st101961)
					} else
						ActivityModel.ins().sendReward(this.activityID, index)
					break
				case 2:
					if (Recharge.ins().IsMonthCard()) {
						ActivityModel.ins().sendReward(this.activityID, index)
					} else {
						UserTips.ErrorTip("尚未激活月卡")
					}
					break
				case 3:
					if (Recharge.ins().IsZunCard()) {
						ActivityModel.ins().sendReward(this.activityID, index)
					} else {
						UserTips.ErrorTip("尚未激活豪华至尊卡")
					}
					break
			}
		}
	}
}
window["ActivityType2000Panel"] = ActivityType2000Panel