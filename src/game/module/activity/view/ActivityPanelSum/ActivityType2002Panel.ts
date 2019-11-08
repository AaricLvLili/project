class ActivityType2002Panel extends ActivityPanel {

	////////////////////////////////////////////////////////////////////////////////////////////////////
    // ActivityType2002Skin.exml
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    private timeLabel: eui.Label
    private pointLabel: eui.Label
    private list: eui.List
	private activityDec:eui.Label;
    ////////////////////////////////////////////////////////////////////////////////////////////////////

	public constructor() {
		super()
		this.skinName = "ActivityType2002Skin"
		this.list.itemRenderer = ActivityType2002Item
	}

	open() {
		// this.list.addEventListener(eui.ItemTapEvent.ITEM_TAP, this._ItemTap, this)
		this.updateData()
	}

	close() {
		// this.list.removeEventListener(eui.ItemTapEvent.ITEM_TAP, this._ItemTap, this)
	}

	// private _ItemTap(e: eui.ItemTapEvent) {
	// 	let data = e.data
	// 	if (data) {
	// 		let rewardState = data.actData.GetRewardState(data.configData.index)
	// 		if (rewardState == RewardState.NotReached) {
	// 			ViewManager.Guide(ViewIndexDef.PUBLIC_BOSS, null)
	// 		} else if (rewardState == RewardState.CanGet) {
	// 			ActivityModel.ins().sendReward(this.activityID, data.configData.index)
	// 		}
	// 	}
	// }

	public updateData() { 
		let actData = this.GetActData<ActivityType2002Data>()
		this.pointLabel.text = `我的积分：${actData.mPoint}`;
		this.timeLabel.text = `活动时间：${actData.GetSurplusTimeStr()}`;	
		this.activityDec.text = `活动说明：${ActivityModel.GetActivityConfig(this.activityID).desc}`;

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

	GetActivityTimeAndDes() {
		return [false]
	}
}

class ActivityType2002Item extends eui.ItemRenderer {

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    // ActivityType2002ItemSkin.exml
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    private list: eui.List
    private getwayLabel: eui.Label
    private btn: eui.Button
    private getImg: eui.Image
    private scoreLabel: eui.BitmapLabel
    ////////////////////////////////////////////////////////////////////////////////////////////////////


	childrenCreated() {
		this.list.itemRenderer = ItemBaseEffe
		this.btn.addEventListener(egret.TouchEvent.TOUCH_TAP, this._OnClick, this)
		this.getwayLabel.addEventListener(egret.TouchEvent.TOUCH_TAP, this._OnClick, this)
		UIHelper.SetLinkStyleLabel(this.getwayLabel)
	}

	private _OnClick(e: egret.TouchEvent) {
		let data = this.data as {configData: any, actData: ActivityType2002Data}
		if (!data) {
			return
		}
		switch (e.target) {
			case this.btn:
				ActivityModel.ins().sendReward(data.actData.id, data.configData.index)
			break
			case this.getwayLabel:
				ViewManager.Guide(ViewIndexDef.PUBLIC_BOSS, null)
				ViewManager.ins().close(ActivityWinSummer)
			break
		}
	}

	dataChanged() {
		let data = this.data as { configData: any, actData: ActivityType2002Data }
		if (data.configData == null || data.actData == null) {
			return
		}
		this.scoreLabel.text = data.configData.play + ""
		this.list.dataProvider = new eui.ArrayCollection(RewardData.ToRewardDatas(data.configData.rewards))
		let rewardState = data.actData.GetRewardState(data.configData.index)
		this.btn.visible = rewardState == RewardState.CanGet
		this.getwayLabel.visible = rewardState == RewardState.NotReached
		this.getImg.visible = rewardState == RewardState.Gotten
	}
}
window["ActivityType2002Panel"]=ActivityType2002Panel
window["ActivityType2002Item"]=ActivityType2002Item