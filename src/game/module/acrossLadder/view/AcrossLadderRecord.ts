class AcrossLadderRecord extends BaseEuiView {
	public constructor() {
		super()
	}

	private recordList: eui.List;
	//private dialogCloseBtn: eui.Button;
	public m_Scroller: eui.Scroller;
	private m_bg

	initUI() {
		super.initUI();
		this.skinName = "AcrossLadderRecordSkin";
	}

	open() {
		for (var e = [], t = 0; t < arguments.length; t++) e[t] = arguments[t];
		this.recordList.itemRenderer = AcrossLadderRecordItem;
		this.updateRecordInfo();
		this.m_bg.init(`AcrossLadderRecord`,GlobalConfig.jifengTiaoyueLg.st100808)
		//this.dialogCloseBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this._OnClick, this);
	}

	close() {
		for (var e = [], t = 0; t < arguments.length; t++) e[t] = arguments[t];
		// this.commonDialog.OnRemoved();
		this.m_Scroller.stopAnimation();
		//this.dialogCloseBtn.removeEventListener(egret.TouchEvent.TOUCH_TAP, this._OnClick, this)
	}
	private _OnClick(e: egret.TouchEvent) {
		ViewManager.ins().close(this);
	}

	public updateRecordInfo(): void {
		var dataList: Array<AcrossLadderRecordItemData> = AcrossLadderPanelData.ins().recordList;
		dataList.sort(this.sort);
		this.recordList.dataProvider = new eui.ArrayCollection(dataList);
	}

	private sort(a, b) {
		return b.recordTime - a.recordTime;
	}
}
ViewManager.ins().reg(AcrossLadderRecord, LayerManager.UI_Popup);
window["AcrossLadderRecord"]=AcrossLadderRecord