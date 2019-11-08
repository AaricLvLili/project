class ActivityType7Panel extends ActivityPanel {

	list: eui.List
	btn: eui.Button
	label: eui.Label
	eff: eui.Group
	getImg: eui.Group

	public constructor() {
		super()
		this.skinName = "ActivityType7Skin"

		this.list.itemRenderer = ItemBase

		let mc = new MovieClip
		mc.loadUrl(ResDataPath.GetUIEffePath("eff_kfui"), true, -1)
		UIHelper.SetIconMovie(mc)
		this.eff.addChild(mc)
	}

	open() {
		let config = ActivityType7Data.GetConfig(this.activityID)
		this.list.dataProvider = new eui.ArrayCollection(RewardData.ToRewardDatas(config.rewards))
		this.list.validateNow()
		for (let i = 0; i < this.list.numChildren; ++i) {
			(this.list.getChildAt(i) as ItemBase).showItemEffect()
		}

		this.btn.addEventListener(egret.TouchEvent.TOUCH_TAP, this._OnClick, this)
		GameGlobal.MessageCenter.addListener(MessageDef.UPDATE_RECHARGE, this.updateData, this);

		this.updateData()
	}

	close() {
		this.btn.removeEventListener(egret.TouchEvent.TOUCH_TAP, this._OnClick, this)
		GameGlobal.MessageCenter.removeListener(MessageDef.UPDATE_RECHARGE, this.updateData, this);
	}

	updateData() {
		let config = ActivityType7Data.GetConfig(this.activityID)
		let activityData = GameGlobal.activityData[this.activityID] as ActivityType7Data
		// this.label.text = `已累计充值${activityData.count}/${config.recharge}钻石`
		var color = (activityData.count >= config.recharge) ? Color.Green : Color.Red;
		this.label.textFlow = TextFlowMaker.generateTextFlow(`已累计充值` + StringUtils.addColor(activityData.count.toString(), color)
			+ `/${config.recharge}钻石`);

		let state = activityData.GetRewardState()
		this.getImg.visible = false

		UIHelper.SetBtnNormalEffe(this.btn, state == RewardState.CanGet)
		this.getImg.visible = state == RewardState.Gotten
		this.btn.visible = state != RewardState.Gotten
	}

	private _OnClick() {
		let activityData = GameGlobal.activityData[this.activityID] as ActivityType7Data
		if (activityData) {
			if (activityData.canReward()) {
				ActivityModel.ins().sendReward(this.activityID, 0)
			} else {
				UserTips.ins().showTips("不满足条件")
			}
		}
	}
}
window["ActivityType7Panel"]=ActivityType7Panel