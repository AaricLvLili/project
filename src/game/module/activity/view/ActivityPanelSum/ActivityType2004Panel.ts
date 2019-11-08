class ActivityType2004Panel extends ActivityPanel {
	private list: eui.List
	private timeLabel: eui.Label
	private totalLabel: eui.Label
	public activityDec: eui.Label;
	public icon: eui.Image;

	public constructor() {
		super()
		this.skinName = "ActivityType2004Skin"
		this.list.itemRenderer = ActivityType2004Item
		this.list.dataProvider = new eui.ArrayCollection([])
	}

	public open() {
		this.updateData()
	}

	public close() {
	}

	public updateData() {
		let actData = this.GetActData<ActivityType2004Data>()
		if (!actData) {
			return
		}
		this.timeLabel.text = "剩余时间：" + actData.GetSurplusTimeStr()
		this.activityDec.text = `活动说明：${ActivityModel.GetActivityConfig(this.activityID).desc}`;

		let config = actData.GetConfig()
		let list = []
		let itemId = -1;
		for (let key in config) {
			let configData = config[key]
			list[configData.index - 1] = {
				configData: configData,
				actData: actData
			}
			if (itemId < 0) {
				itemId = configData.itemId;
			}
		}
		(this.list.dataProvider as eui.ArrayCollection).replaceAll(list)
		this.icon.source = `${itemId}_png`;
		this.totalLabel.text = actData.GetPoint(itemId) + ""
	}

	private _OnClick(e: egret.TouchEvent) {

	}

	GetActivityTimeAndDes() {
		return [false]
	}
}

class ActivityType2004Item extends eui.ItemRenderer {
	private noLimit: eui.Label
	private btn: eui.Button
	private limitLabel: eui.Label
	private limitGroup: eui.Group
	private item: ItemBase
	private timeLabel: eui.Label
	private nameTxt: eui.Label
	private comsumeLabel: eui.Label
	public icon: eui.Image;

	public childrenCreated() {
		this.item.nameTxt.visible = false
		this.item.nameTxt = this.nameTxt
		this.btn.addEventListener(egret.TouchEvent.TOUCH_TAP, this._OnClick, this)
	}

	private _OnClick() {
		let data = this.data as { configData: any, actData: ActivityType2004Data }
		if (data.configData.serverLimit != 0) {
			if (data.actData.GetLimit(data.configData.index) >= data.configData.serverLimit) {
				UserTips.ErrorTip("达到本服兑换上限")
				return
			}
		}
		if (data.configData.personLimit != 0) {
			if (data.actData.GetExchange(data.configData.index) >= data.configData.personLimit) {
				UserTips.ErrorTip("达到个人兑换上限")
				return
			}
		}
		let itemData = UserBag.ins().getBagItemById(data.configData.itemId)
		if (!itemData || itemData.count < data.configData.itemCount) {
			UserTips.ErrorTip("材料不足")
			return
		}
		ActivityModel.ins().sendReward(data.actData.id, data.configData.index)
	}

	public dataChanged() {
		let data = this.data as { configData: any, actData: ActivityType2004Data }
		this.limitGroup.visible = data.configData.serverLimit != 0
		this.noLimit.visible = !this.limitGroup.visible
		this.limitLabel.text = data.actData.GetLimit(data.configData.index) + "/" + data.configData.serverLimit
		this.timeLabel.visible = data.configData.personLimit != 0
		this.timeLabel.text = `已兑换：${data.actData.GetExchange(data.configData.index)}/${data.configData.personLimit}`
		this.comsumeLabel.text = data.configData.itemCount
		this.item.data = data.configData.rewards[0]
		if (this.item) {
			this.item.showItemEffect()
		}
		this.icon.source = `${data.configData.itemId}_png`;
		UIHelper.ShowRedPoint(this.btn, data.actData.GetRewardState(data.configData.index) == RewardState.CanGet)
	}
}
window["ActivityType2004Panel"] = ActivityType2004Panel
window["ActivityType2004Item"] = ActivityType2004Item