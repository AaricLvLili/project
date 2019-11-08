class MountDanYaoWin extends BaseEuiPanel implements ICommonWindow {
	public constructor() {
		super()
		this.skinName = "MainWinSkin";
	}
	public commonWindowBg: CommonWindowBg;
	private mountDanYaoPanel: MountDanYaoPanel;
	initUI() {
		super.initUI();
		this.mountDanYaoPanel = new MountDanYaoPanel();
		this.mountDanYaoPanel.name = GlobalConfig.jifengTiaoyueLg.st100681;//"坐骑属性丹";
		this.commonWindowBg.AddChildStack(this.mountDanYaoPanel);
	}

	open(...param: any[]) {
		this.commonWindowBg.OnAdded(this, param && param[0])
		this.updateRedPoint();
	}
	close() {
		var bottomView = <UIView2>ViewManager.ins().getView(UIView2)
		if (bottomView != null) {
			bottomView.closeNav(UIView2.NAV_PET)
		}
		this.removeObserve();
		this.commonWindowBg.OnRemoved();
	}

	private updateRedPoint() {
	};

	OnBackClick(clickType: number): number {
		return 0
	}
	OnOpenIndex(openIndex: number): boolean {
		return true
	}

	UpdateContent(): void { }
} 
ViewManager.ins().reg(MountDanYaoWin, LayerManager.UI_Main);
window["MountDanYaoWin"]=MountDanYaoWin