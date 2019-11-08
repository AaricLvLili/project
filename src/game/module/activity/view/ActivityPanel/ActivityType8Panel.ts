class ActivityType8Panel extends ActivityPanel {

	private list: eui.List
	private listData: eui.ArrayCollection
	public m_Lan1: eui.Label;
	public m_Lan2: eui.Label;
	public m_Lan3: eui.Label;

	public constructor() {
		super()
		this.skinName = "ActivityType8Skin"
		this.list.itemRenderer = ActivityType8Item
		this.listData = new eui.ArrayCollection()
		this.list.dataProvider = this.listData

		this.m_Lan1.text = GlobalConfig.jifengTiaoyueLg.st101285;
		this.m_Lan2.text = GlobalConfig.jifengTiaoyueLg.st101286;
		this.m_Lan3.text = GlobalConfig.jifengTiaoyueLg.st101287;
	}

	open() {
		this.updateData()
	}

	close() {
	}

	updateData() {
		let data = ActivityModel.ins().GetActivityDataById(this.activityID) as ActivityType8Data
		if (data) {
			let config = data.GetConfigData().slice()
			config.sort(function (lhs, rhs) {
				let lhsData = data.GetItemDataByID(lhs.index)
				let rhsData = data.GetItemDataByID(rhs.index)
				let v1 = lhs.index + (lhsData.mRewardState == RewardState.Gotten && lhsData.mDay == lhs.day ? 100 : 0)
				let v2 = rhs.index + (rhsData.mRewardState == RewardState.Gotten && rhsData.mDay == rhs.day ? 100 : 0)
				return v1 - v2
			})
			this.listData.replaceAll(config)
		}
	}
}

class ActivityType8Item extends eui.ItemRenderer {

	private titleImg: eui.Label
	private dataGroup: eui.DataGroup
	private item: ItemBase
	private label: eui.Label
	private btn: eui.Button
	private getImg: eui.Image
	private toDayImg: eui.Label
	private bitmapLabel: eui.Label
	private finishLabel: eui.Label

	public m_Lan1: eui.Label;

	protected childrenCreated() {
		this.dataGroup.itemRenderer = ItemBaseEffe
		this.btn.addEventListener(egret.TouchEvent.TOUCH_TAP, this._OnClick, this)
		this.m_Lan1.text = GlobalConfig.jifengTiaoyueLg.st101288;
		this.finishLabel.text = GlobalConfig.jifengTiaoyueLg.st101289;
		this.toDayImg.text = GlobalConfig.jifengTiaoyueLg.st101290;
	}

	private _OnClick() {
		let actItemData = this.GetActData()
		if (!actItemData) {
			return
		}
		if (actItemData.mRewardState == RewardState.CanGet) {
			ActivityModel.ins().sendReward(this.data.Id, actItemData.mIndex)
		} else if (actItemData.mRewardState == RewardState.NotReached) {
			Recharge.ins().TestInvest(this.data.Id, actItemData.mIndex)
		}
	}

	private GetActData(): ActivityType8ItemData {
		let data = ActivityModel.ins().GetActivityDataById(this.data.Id) as ActivityType8Data
		if (data == null) {
			return null
		}
		return data.GetItemDataByID(this.data.index)
	}

	protected dataChanged() {
		let config = this.data
		let actItemData = this.GetActData()
		if (!actItemData) {
			return
		}
		let tyepData = ActivityModel.ins().GetActivityDataById(this.data.Id) as ActivityType8Data
		this.bitmapLabel.text = config.multiple
		this.titleImg.text = config.orderName
		this.dataGroup.dataProvider = new eui.ArrayCollection(RewardData.ToRewardDatas(config.awardList))
		this.item.data = RewardData.ToRewardData(config.dayAwardList[0])
		this._SetBtnStyle(actItemData.mRewardState)

		this.label.visible = true
		if (actItemData.mRewardState == RewardState.NotReached) {
			if (tyepData.CanInvest()) {
				this.label.text = LanguageString.jifengTiaoyueCh(GlobalConfig.jifengTiaoyueLg.st101291, [config.day])
			} else {
				this._HideGoBtn()
			}
		} else {
			if (actItemData.mRewardState == RewardState.Gotten && actItemData.mDay == config.day) {
				if (!tyepData.CanInvest()) {
					this._HideGoBtn()
				}
			} else {
				let day = actItemData.mRewardState == RewardState.Gotten ? actItemData.mDay : (actItemData.mDay - 1)
				this.label.text = LanguageString.jifengTiaoyueCh(GlobalConfig.jifengTiaoyueLg.st101292, [day, config.day]);
			}
		}
		//this.getImg.visible = actItemData.mRewardState != RewardState.NotReached
	}

	private _HideGoBtn() {
		this.toDayImg.visible = false
		this.btn.visible = false
		this.label.visible = false
		this.getImg.visible = false;
		this.finishLabel.visible = true
	}

	private _SetBtnStyle(state: RewardState): void {
		// this.btn.icon = state == RewardState.NotReached ? "ui_tzjh_zi_28" : ""
		this.btn.visible = state != RewardState.Gotten
		this.btn.label = state == RewardState.CanGet ? GlobalConfig.jifengTiaoyueLg.st101293 : GlobalConfig.jifengTiaoyueLg.st101294
		this.toDayImg.visible = state == RewardState.Gotten;
		this.getImg.visible = state == RewardState.Gotten;
		this.finishLabel.visible = false
	}
}
window["ActivityType8Panel"] = ActivityType8Panel
window["ActivityType8Item"] = ActivityType8Item