class ActivityType14Panel  extends ActivityPanel 
{
    private list: eui.List
    private timeLabel: eui.Label
    private totalLabel: eui.Label
	public constructor() {
		super()
		this.skinName = "ActivityType2001Skin"
		this.list.itemRenderer = ActivityType14Item
	}

	public open() {
		this.updateData()
	}

	public close() {
	}

	public updateData() { 
		let actData = this.GetActData<ActivityType14Data>()
		this.timeLabel.text = `剩余时间：${actData.getRemindTimeString()}`
		this.totalLabel.textFlow = TextFlowMaker.generateTextFlow(`已累计消费|C:0x00ff00&T:${actData.accumulativeConsumption}|钻石`) 
		this._UpdateList()
	}

	private _UpdateList() {
		let actData = this.GetActData<ActivityType14Data>()
		let config = ActivityType14Data.getConfig(this.activityID)
		let list = []
		for (let key in config) {
			let configData = config[key]
			list[configData.index - 1] = {
				configData: configData,
				actData: actData
			}
		}
		list.sort(function(lhs, rhs) {
			let lhsState = actData.GetRewardState(lhs.configData.index)
			let rhsState = actData.GetRewardState(rhs.configData.index)
			let lhsWeight = lhsState == RewardState.CanGet ? 10 : lhsState == RewardState.NotReached ? 5 : 0
			let rhsWeight = rhsState == RewardState.CanGet ? 10 : rhsState == RewardState.NotReached ? 5 : 0
			return rhsWeight - lhsWeight
		})
		this.list.dataProvider = new eui.ArrayCollection(list)
	}

	private _OnClick(e: egret.TouchEvent): void {

	}

	GetActivityTimeAndDes() {
		return [false]
	}
}

class ActivityType14Item extends eui.ItemRenderer {
    private list: eui.List
    private priceIcon: PriceIcon
    private btn: eui.Button
    private getImg: eui.Image
	childrenCreated() {
		this.list.itemRenderer = ItemBaseEffe
		this.btn.addEventListener(egret.TouchEvent.TOUCH_TAP, this._OnClick, this)
	}

	private _OnClick() {
		let data = this.data as {configData: any, actData: ActivityType14Data}
		if (!data) {
			return
		}
		ActivityModel.ins().sendReward(data.actData.id, data.configData.index)
	}

	dataChanged() {
		let data = this.data as {configData: any, actData: ActivityType14Data}
		if (!data) {
			return
		}
		this.list.dataProvider = new eui.ArrayCollection(RewardData.ToRewardDatas(data.configData.rewards))
		this.priceIcon.price = data.configData.play
		let rewardState = data.actData.GetRewardState(data.configData.index)
		this.btn.visible = rewardState == RewardState.CanGet
		this.getImg.visible = rewardState == RewardState.Gotten
	}
}
window["ActivityType14Panel"]=ActivityType14Panel
window["ActivityType14Item"]=ActivityType14Item