class GuanQiaWin extends BaseEuiPanel implements ICommonWindow {
	public constructor() {
		super()
		this.skinName = "MainWinSkin";
		this.layerLevel = VIEW_LAYER_LEVEL.TOP;
	}
	private commonWindowBg: CommonWindowBg
	public guanQiaRewardPanel: GuanQiaPanel;

	initUI() {
		super.initUI();
		this.guanQiaRewardPanel = new GuanQiaPanel();
		this.guanQiaRewardPanel.name = GlobalConfig.jifengTiaoyueLg.st100744;
		this.commonWindowBg.AddChildStack(this.guanQiaRewardPanel);
	};
	open() {
		super.open()
		this.commonWindowBg.OnAdded(this)
		this.commonWindowBg.tabBar.visible = false
	};
	close() {
		super.close()
		this.commonWindowBg.OnRemoved()
		this.guanQiaRewardPanel.release();
	};

	OnBackClick(clickType: number): number {
		return 0
	}

	OnOpenIndex(openIndex: number): boolean {
		return true
	}
}

ViewManager.ins().reg(GuanQiaWin, LayerManager.UI_Main);

window["GuanQiaWin"]=GuanQiaWin