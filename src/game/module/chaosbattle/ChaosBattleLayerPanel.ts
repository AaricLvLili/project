class ChaosBattleLayerPanel extends BaseView implements ICommonWindowTitle {
	windowTitleIconName?: string;
	public constructor(data?: any) {
		super();
		this.name = GlobalConfig.jifengTiaoyueLg.st102019;
		this.windowTitleIconName = GlobalConfig.jifengTiaoyueLg.st102018;
		this.skinName = "ChaosBattleLayerPanelSkin";
	}
	public m_Scroller: eui.Scroller;
	public m_List: eui.List;

	private listData: eui.ArrayCollection;
	protected childrenCreated() {
		super.childrenCreated();
		this.m_List.itemRenderer = ChaosBattleLayerItem;
		this.listData = new eui.ArrayCollection();
		this.m_List.dataProvider = this.listData;
	};
	private addViewEvent() {
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
		this.listData.replaceAll(chaosBattleModel.layerAwardData);
	}

	UpdateContent(): void {

	}
}
window["ChaosBattleLayerPanel"] = ChaosBattleLayerPanel