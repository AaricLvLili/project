class ChaosBattlePointPanel extends BaseView implements ICommonWindowTitle {
	windowTitleIconName?: string;
	public constructor(data?: any) {
		super();
		this.name = GlobalConfig.jifengTiaoyueLg.st101037;
		this.windowTitleIconName = GlobalConfig.jifengTiaoyueLg.st101037;
		this.skinName = "ChaosBattleLayerPanelSkin";
	}
	public m_Scroller: eui.Scroller;
	public m_List: eui.List;

	private listData: eui.ArrayCollection;
	protected childrenCreated() {
		super.childrenCreated();
		this.m_List.itemRenderer = ChaosBattlePointItem;
		this.listData = new eui.ArrayCollection();
		this.m_List.dataProvider = this.listData;
	};
	private addViewEvent() {
		this.observe(ChaosBattleEvt.CHAOSBATTLE_DATAUPDATE_POINT, this.initData);
	}
	private removeEvent() {
	}

	public open() {
		this.addViewEvent();
		this.initData();
	};
	public close() {
		this.removeEvent();
	};

	public release() {
		this.removeEvent();
	}

	private initData() {
		let chaosBattleModel = ChaosBattleModel.getInstance;
		this.listData.replaceAll(chaosBattleModel.pointList);
	}

	UpdateContent(): void {

	}
}
window["ChaosBattlePointPanel"] = ChaosBattlePointPanel