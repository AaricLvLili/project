/** 每日一元活动*/
class DayOneActivityPanel extends BaseEuiPanel {
	public constructor() {
		super();
	}

	private maskBg :eui.Image;
	private closeBtn: eui.Button;
	private btn: eui.Button;
	private iconList: eui.List;

	public initUI(): void {
		super.initUI();
		this.skinName = "DayOneActivitySkin";
		this.iconList.itemRenderer = ItemBase;
		this.iconList.dataProvider = new eui.ArrayCollection(GlobalConfig.ins("ChongZhi1Config")[98][0][0].awardList);
	};

	public open(): void {
		this.addTouchEvent(this, this.closTouchFun, this.maskBg);
		this.addTouchEvent(this, this.closTouchFun, this.closeBtn);
		this.addTouchEvent(this, this.onTouch, this.btn);
		// this.observe(MessageDef.DAYONE_ACTIVITY,this.updateRewardState);
		// this.updateRewardState();
	}

	/*public updateRewardState():void
	{
		if(DayOneActivityController.ins().rewardState == 1)
			this.btn["labelBitmap"].source = "dayOne_awardTxt_png";
		else
			this.btn["labelBitmap"].source = "dayOne_clickTxt_png";
	}*/

	public close(): void {
		this.removeEvents();
	}

	private closTouchFun(): void {
		ViewManager.ins().close(DayOneActivityPanel);
	}

	private onTouch(evt:egret.TouchEvent):void
	{
		if(DayOneActivityController.ins().rewardState == 2)
			Recharge.ins().TestReCharge(11)
		else
			DayOneActivityController.ins().sendDayOneActivityReward();
	}
}
ViewManager.ins().reg(DayOneActivityPanel, LayerManager.UI_Popup);
window["DayOneActivityPanel"]=DayOneActivityPanel