class ZaoYuRecordWin extends BaseEuiPanel {

	list: eui.List

	//private dialogCloseBtn:eui.Button;
    public m_Lan1:eui.Label;

	public constructor() {
		super()
		this.skinName = "ZaoYuRecordSkin"
		this.list.itemRenderer = ZaoYuRecordItem

		this.m_Lan1.text=GlobalConfig.jifengTiaoyueLg.st100561;
	}

	open() {
       //	this.dialogCloseBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this._OnClick, this);
		// this.observe(Encounter.ins().postDataUpdate, this.updateData)
		this.observe(Encounter.postZaoYuRecord, this.updateData)
		Encounter.ins().sendInquireRecord()
		this.updateData(Encounter.ins().inquireRecord)
		this.m_bg.init(`ZaoYuRecordWin`,GlobalConfig.jifengTiaoyueLg.st100560)
		// App.MessageCenter.addListener(MessagerEvent.UPDATE_ZAOYU_RECORD, this.updateData, this)
		// App.ControllerManager.applyFunc(ControllerConst.Encounter, EncounterFunc.SEND_INQUIRE_RECORD)
	}
    
	close() {
		this.removeEvents()
		this.removeObserve()
		//this.dialogCloseBtn.removeEventListener(egret.TouchEvent.TOUCH_TAP, this._OnClick, this)
	}

	updateData(datas: EncounterRecordData[]) {
		function sortFunc(lhs: EncounterRecordData, rhs: EncounterRecordData) {
			return lhs.time < rhs.time ? 1 : lhs.time > rhs.time ? -1 : 0
		}
		datas.sort(sortFunc)
		this.list.dataProvider = new eui.ArrayCollection(datas)
	}
	private _OnClick(e: egret.TouchEvent) {
		ViewManager.ins().close(this);
	}
}

ViewManager.ins().reg(ZaoYuRecordWin, LayerManager.UI_Popup);
window["ZaoYuRecordWin"]=ZaoYuRecordWin