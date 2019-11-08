class PetAttachWin extends BaseEuiPanel {
	public constructor() {
		super()
		this.skinName = "PetAttachWinSkin";
	}
	public m_Scroller: eui.Scroller;
	public m_List: eui.List;

	private m_ListData: eui.ArrayCollection;


	public createChildren() {
		super.createChildren();
		this.m_List.itemRenderer = PetAttachItem;
		this.m_ListData = new eui.ArrayCollection();
		this.m_List.dataProvider = this.m_ListData;
		this.m_bg.init(`PetAttachWin`, GlobalConfig.jifengTiaoyueLg.st101090);
	}
	initUI() {
		super.initUI();
	}
	open(...param: any[]) {
		this.addViewEvent();
		this.setData();
	}
	close() {
		this.release();
	}
	public release() {
	}
	private addViewEvent() {
		this.observe(PetEvt.PET_ATTACH_MSG, this.setData);
	}
	private setData() {
		let petModel: PetModel = PetModel.getInstance;
		let petDatas = petModel.getAttachList();
		this.m_ListData.replaceAll(petDatas);
	}
	private onClickClose() {
		ViewManager.ins().close(this);
	}
}

ViewManager.ins().reg(PetAttachWin, LayerManager.UI_Popup);
window["PetAttachWin"] = PetAttachWin