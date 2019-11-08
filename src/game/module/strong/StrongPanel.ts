class StrongPanel extends BaseView implements ICommonWindowTitle {
	windowTitleIconName?: string;
	public constructor(data?: any) {
		super();
		this.skinName = "StrongPanelSkin";
	}
	public m_Scroller: eui.Scroller;
	public m_List: eui.List;
	private listData: eui.ArrayCollection;
	public config: any[];
	protected childrenCreated() {
		super.childrenCreated();
		this.m_List.itemRenderer = StrongItem;
		this.listData = new eui.ArrayCollection();
		this.m_List.dataProvider = this.listData;
	}
	private addViewEvent() {
	}
	private removeEvent() {
	}
	public open() {
		this.initData();
	};
	public close() {
		this.removeEvent();
	};
	public release() {
		this.removeEvent();
	}
	private initData() {
		this.listData.replaceAll(this.config);
	}

	UpdateContent(): void {

	}
}
window["StrongPanel"] = StrongPanel