class PetAllShowPanel extends BaseView implements ICommonWindowTitle {
	windowTitleIconName?: string;
	public constructor(data?: any) {
		super();
		this.skinName = "PetAllShowPanelSkin";
		this.name = GlobalConfig.jifengTiaoyueLg.st101846;
		this.windowTitleIconName = GlobalConfig.jifengTiaoyueLg.st101116;
		this.touchEnabled = false;
	}
	public m_Scroller: eui.Scroller;
	public m_List: eui.List;
	public m_BtnScroller: eui.Scroller;
	public m_BtnList: eui.List;
	private listData: eui.ArrayCollection;
	private btnListData: eui.ArrayCollection;
	public m_Power: PowerLabel;


	private m_PetAllShowData: any;


	protected childrenCreated() {
		super.childrenCreated();
		this.m_List.itemRenderer = PetAllShowMainItem;
		this.listData = new eui.ArrayCollection();
		this.m_List.dataProvider = this.listData;

		this.m_BtnList.itemRenderer = PetAllShowBtn;
		this.btnListData = new eui.ArrayCollection();
		this.m_BtnList.dataProvider = this.btnListData;
	};
	private addViewEvent() {
		this.observe(PetEvt.PET_ALLSHOW_MSG, this.initData)
	}
	public open() {
		this.addViewEvent();
		this.initData();
	};
	public close() {
	};
	public release() {
		PetModel.getInstance.petAllShowIndex = 0;
	}

	private initData() {
		this.m_Scroller.stopAnimation();
		if (this.m_Scroller && this.m_Scroller.viewport) {
			this.m_Scroller.viewport.scrollV = 0;
		}
		let config = GlobalConfig.ins("PetFettersConfig");
		let btnList = [];
		for (let key in config) {
			btnList.push(parseInt(key))
		}
		this.btnListData.replaceAll(btnList);
		let typeList = [];
		let config2 = config[PetModel.getInstance.petAllShowIndex + 1]
		for (let key in config2) {
			typeList.push(parseInt(key));
		}
		this.listData.replaceAll(typeList);
		this.listData.refresh();
		egret.setTimeout(function () {
			if (this.m_Scroller && this.m_Scroller.viewport && this.m_Scroller.viewport.scrollV != 0) {
				this.m_Scroller.viewport.scrollV = 0;
			}
		}, this, 100);
		this.m_Power.text = PetModel.getInstance.getAllPetPower();
	}

	private onClickLook() {
		ViewManager.ins().open(PetFetterWin, this.m_PetAllShowData);
	}
	UpdateContent(): void {

	}

}
window["PetAllShowPanel"] = PetAllShowPanel