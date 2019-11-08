
class ActivityType12EggBrokenPanel extends BaseEuiPanel {
	public static LAYER_LEVEL = LayerManager.UI_Popup
	    ////////////////////////////////////////////////////////////////////////////////////////////////////
    // EggBrokenItem2Skin.exml
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    private dialogCloseBtn:eui.Button;
    private group: eui.List
    private btOpen: eui.Image
    private sure: eui.Button
    ////////////////////////////////////////////////////////////////////////////////////////////////////

	private m_Index: number = 1

	public constructor() {
		super()
		this.skinName = "EggBrokenItem2Skin"
		this.group.itemRenderer = ItemBase
	}

	open(...param: any[]) {
		this.m_Index = param[0]
		this.dialogCloseBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this._OnClose, this);

		this.AddClick(this.sure, this._OnClick)
		this.group.dataProvider = new eui.ArrayCollection(RewardData.ToRewardDatas(GlobalConfig.ins("SEtotalrewardsAConfig")[this.m_Index].box))
	}

	close() {
		this.dialogCloseBtn.removeEventListener(egret.TouchEvent.TOUCH_TAP, this._OnClose, this)
	}

	private _OnClick() {
		if (EggBroken.ins().count >=GlobalConfig.ins("SEtotalrewardsAConfig")[this.m_Index].time) {
			EggBroken.ins().sendHitting(this.m_Index ,ActivityType12Panel.activityID);
		} else {
			UserTips.ErrorTip("目标未达成")
		}
		ViewManager.ins().close(this)
	}
	private _OnClose(e: egret.TouchEvent) {
		ViewManager.ins().close(this);
	}
}
window["ActivityType12EggBrokenPanel"]=ActivityType12EggBrokenPanel