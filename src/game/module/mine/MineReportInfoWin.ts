class MineReportInfoWin extends BaseEuiPanel {

	public static LAYER_LEVEL = LayerManager.UI_Popup;

	public constructor() {
		super()
	}

	list
	//	private dialogCloseBtn:eui.Button;
	initUI() {
		super.initUI()
		this.skinName = "KuangDongReportSkin"
		this.list.itemRenderer = MineReportItemRenderer
	}

	open() {
		this.m_bg.init(`MineReportInfoWin`, GlobalConfig.jifengTiaoyueLg.st101728)
		for (var e = [], t = 0; t < arguments.length; t++) e[t] = arguments[t];
		GameGlobal.MessageCenter.addListener(MessageDef.MINE_REVENGE_LIST, this.refushList, this)
		MineModel.ins().reportMineInfo(MineReportType.REQ_REVENGE)
		GameGlobal.MessageCenter.addListener(MessageDef.FUBEN_CHANGE, this.mapChange, this)
		//this.dialogCloseBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this._OnClick, this);
		GameGlobal.mineModel.robNews = !1
		GameGlobal.MessageCenter.dispatch(MessageDef.REFUSHMINE_RED_INFO)
		this.refushList()
	}

	close() {
		for (var e = [], t = 0; t < arguments.length; t++) e[t] = arguments[t];
		GameGlobal.MessageCenter.removeListener(MessageDef.MINE_REVENGE_LIST, this.refushList, this)
		GameGlobal.MessageCenter.removeListener(MessageDef.FUBEN_CHANGE, this.mapChange, this)
		//this.dialogCloseBtn.removeEventListener(egret.TouchEvent.TOUCH_TAP, this._OnClick, this)
	}

	mapChange() {
		ViewManager.ins().close(MineReportInfoWin)
	}

	refushList() {
		this.list.dataProvider = new eui.ArrayCollection(GameGlobal.mineModel.mineRecordList)
	}
	private _OnClick(e: egret.TouchEvent) {
		ViewManager.ins().close(this);
	}
}
window["MineReportInfoWin"]=MineReportInfoWin