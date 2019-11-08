class ActivityType2001Panel  extends ActivityPanel 
{
    private list: eui.List
    private timeLabel: eui.Label
    private totalLabel: eui.Label
	public constructor() {
		super()
		this.skinName = "ActivityType2001Skin"
		this.list.itemRenderer = ActivityType2001Item
	}

	public open() {
		this.updateData()
	}

	public close() {
	}

	public updateData() { 
		let actData = this.GetActData<ActivityType2001Data>()
		this.timeLabel.text = `${actData.getRemindTimeString()}`
		this.totalLabel.textFlow = TextFlowMaker.generateTextFlow(`已累计消费|C:0x008f22&T:${actData.mPay}|钻石`) 
		this._UpdateList()
	}

	private _UpdateList() {
		let actData = this.GetActData<ActivityType2001Data>()
		let config = actData.GetConfig()
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

class ActivityType2001Item extends eui.ItemRenderer {
    private list: eui.List
    private priceIcon: PriceIcon
    private btn: eui.Button
    private getImg: eui.Image
	childrenCreated() {
		this.list.itemRenderer = ItemBaseEffe
		this.btn.addEventListener(egret.TouchEvent.TOUCH_TAP, this._OnClick, this)
	}

	private _OnClick() {
		let data = this.data as {configData: any, actData: ActivityType2001Data}
		if (!data) {
			return
		}
		ActivityModel.ins().sendReward(data.actData.id, data.configData.index)
	}

	dataChanged() {
		let data = this.data as {configData: any, actData: ActivityType2001Data}
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
window["ActivityType2001Panel"]=ActivityType2001Panel
window["ActivityType2001Item"]=ActivityType2001Item