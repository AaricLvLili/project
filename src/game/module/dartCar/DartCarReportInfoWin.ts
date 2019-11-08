
class DartCarReportInfoWin extends BaseEuiPanel {

	public static LAYER_LEVEL = LayerManager.UI_Popup;

	public constructor() {
		super()
	}

	list
	//private dialogCloseBtn:eui.Button;
	initUI() {
		super.initUI()
		this.skinName = "KuangDongReportSkin"
		this.list.itemRenderer = DartCarReportInfoItem
		
	}

	open() {
		this.m_bg.init(`DartCarReportInfoWin`,GlobalConfig.jifengTiaoyueLg.st101728)
		for (var e = [], t = 0; t < arguments.length; t++) e[t] = arguments[t];
		GameGlobal.MessageCenter.addListener(MessageDef.FUBEN_CHANGE, this.mapChange, this);
		GameGlobal.MessageCenter.addListener(MessageDef.DARTCAR_REVENGE_LIST, this.refushList, this);
		DartCarModel.ins().sendDartCarReportInfo();
		//this.dialogCloseBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this._OnClick, this);
		this.refushList()
	}

	close() {
		for (var e = [], t = 0; t < arguments.length; t++) e[t] = arguments[t];
		GameGlobal.MessageCenter.removeListener(MessageDef.DARTCAR_REVENGE_LIST, this.refushList, this)
		GameGlobal.MessageCenter.removeListener(MessageDef.FUBEN_CHANGE, this.mapChange, this)
		//this.dialogCloseBtn.removeEventListener(egret.TouchEvent.TOUCH_TAP, this._OnClick, this)
	}

	mapChange() {
		ViewManager.ins().close(DartCarReportInfoWin)
	}

	refushList() {
		this.list.dataProvider = new eui.ArrayCollection(DartCarModel.ins().dartCarRecordList)
	}
	private _OnClick(e: egret.TouchEvent) {
		ViewManager.ins().close(this);
	}
}
window["DartCarReportInfoWin"]=DartCarReportInfoWin