class GuanQiaMapWin extends BaseEuiPanel implements ICommonWindow {
	public constructor() {
		super()
		this.skinName = "MainWinSkin";
		this.layerLevel = VIEW_LAYER_LEVEL.TOP;
	}
	public commonWindowBg: CommonWindowBg;
	private guanQiaMapPanel: GuanQiaMapPanel;
	initUI() {
		super.initUI();
		this.guanQiaMapPanel = new GuanQiaMapPanel();
		this.guanQiaMapPanel.name = GlobalConfig.jifengTiaoyueLg.st100752;
		this.commonWindowBg.AddChildStack(this.guanQiaMapPanel);
	};
	open() {
		super.open()
		this.commonWindowBg.OnAdded(this)
		this.commonWindowBg.tabBar.visible = false
	};
	close() {
		super.close();
		this.guanQiaMapPanel.release();
		this.commonWindowBg.OnRemoved();
	};

	OnBackClick(clickType: number): number {
		return 0
	}

	OnOpenIndex(openIndex: number): boolean {
		return true
	}
}

ViewManager.ins().reg(GuanQiaMapWin, LayerManager.UI_Main);

window["GuanQiaMapWin"]=GuanQiaMapWin