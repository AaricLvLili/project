class SpecialRingActivityPanel extends BaseEuiPanel {

    //public static LAYER_LEVEL = LayerManager.UI_Main_2
	public static LAYER_LEVEL = LayerManager.UI_Main

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    // SpecialRingActivityPanelSkin.exml
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    private commonWindowBg: CommonWindowBg
    // private titleImg: eui.Image
    private ringEffeGroup: eui.Group
    private list: eui.List
    private goBtn: eui.Button
    private ringTipImg: eui.Label//eui.Image
    private powerLabel: PowerLabel//eui.BitmapLabel
    private descBtn: eui.Button

    private activeGroup: eui.Image
    private deactiveGroup: eui.Group
    ////////////////////////////////////////////////////////////////////////////////////////////////////

	private m_RingConfig = null
	private m_Mc: MovieClip

	public constructor() {
		super()
		this.skinName = "SpecialRingActivityPanelSkin"
		this.list.itemRenderer = SpecialRingActivityItem
		this.m_Mc = new MovieClip
		this.ringEffeGroup.addChild(this.m_Mc)
		// this.commonWindowBg.title = ''
	}

	public open(...param: any[]) {
		this.commonWindowBg.OnAdded(this)		

		this.AddClick(this.descBtn, this._OnClick)
		this.AddClick(this.goBtn, this._OnClick)

		this.observe(MessageDef.RING_UPDATE_DATA, this.UpdateContent)
		this.observe(MessageDef.RING_UPDATE_TASK_DATA, this.UpdateContent)

		this.UpdateContent()
	}

	public close() {
		this.commonWindowBg.OnRemoved()
	}

	private _OnClick(e: egret.TouchEvent) {
		switch(e.target) {
			case this.descBtn:
				// ViewManager.ins().open(ArtifactMainWin, 1, this.m_RingConfig.id)
				ViewManager.ins().open(RingMainWin, 0, this.m_RingConfig.id)
				ViewManager.ins().close(this)
			break
			case this.goBtn:
				if (SpecialRing.ins().CanActiveRing()) {
					if (Checker.Money(MoneyConst.yuanbao, this.m_RingConfig.todaypay)) {
						SpecialRing.ins().SendActiveRing()
					}
				} else {
					UserTips.ErrorTip("激活条件未完成")
				}
			break
		}
	}

	public UpdateContent() {
		let ringId = SpecialRing.ins().GetCurActId()
		this.m_RingConfig = GlobalConfig.ins("PublicSpecialringConfig")[ringId]
		if (this.m_RingConfig == null) {
			return
		}
		
		SpecialRingWin.SetRingTipImg(this.ringTipImg, this.m_RingConfig, null)
		this.powerLabel.text = SpecialRingWin.GetRingPower(this.m_RingConfig.id, 1, true)
		// this.titleImg.source = SpecialRingWin.GetRingNameImg(this.m_RingConfig.id)
		this.commonWindowBg.title = this.m_RingConfig.name
		this.commonWindowBg._UpdateTitle();
		this.list.dataProvider = new eui.ArrayCollection(this.GetActConfigList())
		this.m_Mc.loadUrl(SpecialRingWin.GetRingEffPath(this.m_RingConfig.id), true, -1)
		UIHelper.SetIconMovie(this.m_Mc, 0)

		let isActive = SpecialRing.ins().HasRing(this.m_RingConfig.id)
		this.activeGroup.visible = isActive
		this.deactiveGroup.visible = !isActive

		this.descBtn.icon = SpecialRingItem.ICON_LIST[SpecialRingWin.GetIdIndex(this.m_RingConfig.id)-1]
	}

	private GetActConfigList() {
		let list = []
		for (let i = 0; i < this.m_RingConfig.condition.length; ++i) {
			list.push(this.m_RingConfig)
		}
		return list
	}
}

class SpecialRingActivityItem extends eui.ItemRenderer {
	private conditionLabel: eui.Label
	private goLabel: eui.Label
	private finishImg: eui.Label

	protected childrenCreated() {
		this.touchEnabled = false
		this.goLabel.addEventListener(egret.TouchEvent.TOUCH_TAP, this._OnClick, this)
		UIHelper.SetLinkStyleLabel(this.goLabel)
	}

	private _OnClick() {
		ViewManager.ins().close(SpecialRingActivityPanel);
		let conditionData = GlobalConfig.ins("ExringTaskConfig")[this.data.condition[this.itemIndex]]
		ViewManager.Guide(conditionData.controlTarget, null)
	}

	protected dataChanged() {
		let conditionData = GlobalConfig.ins("ExringTaskConfig")[this.data.condition[this.itemIndex]]
		let taskInfo = SpecialRing.ins().GetTaskInfo(conditionData.id)

		let finish = SpecialRing.ins().GetCurActState(this.itemIndex) != RewardState.NotReached
		if (finish)	{
			this.conditionLabel.text = conditionData.desc + `(已完成)`
		} else {
			let targetValue = conditionData.type == 8 ? Math.floor(conditionData.target * 0.001) : conditionData.target
			this.conditionLabel.text = conditionData.desc + `(${taskInfo ? taskInfo.value : 0}/${targetValue})`
		}
		this.finishImg.visible = finish
		this.goLabel.visible = !finish
	}
}
window["SpecialRingActivityPanel"]=SpecialRingActivityPanel
window["SpecialRingActivityItem"]=SpecialRingActivityItem