class WarOrderBtn extends eui.ItemRenderer {
	public constructor() {
		super();
	}
	public labelDisplay: eui.Label;
	public iconDisplay: eui.Image;
	public redPoint: eui.Image;

	public createChildren() {
		super.createChildren();
		this.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.onClick, this);
	}
	public dataChanged() {
		super.dataChanged();
		let type = this.data;
		switch (type) {
			case 1:
				this.labelDisplay.text = GlobalConfig.jifengTiaoyueLg.st102082
				break;
			case 2:
				this.labelDisplay.text = GlobalConfig.jifengTiaoyueLg.st102083
				break;
			default:
				this.labelDisplay.text = GlobalConfig.jifengTiaoyueLg.st102084
				break;
		}
		if (WarOrderModel.getInstance.showMissionType == type) {
			this.enabled = false;
		} else {
			this.enabled = true;
		}
		this.redPoint.visible = WarOrderModel.getInstance.checkMissionRedPointBuyType(type)
	}
	private onClick() {
		WarOrderModel.getInstance.showMissionType = this.data;
		MessageCenter.ins().dispatch(WarOrderEvt.WARORDEREVT_DATAUPDATEMISSIONTYPE_MSG);
	}
}
window["WarOrderBtn"] = WarOrderBtn