class PetDebrisWin extends BaseEuiPanel implements ICommonWindow, ICommonWindowTitle {
	public constructor() {
		super()
		this.skinName = "MainWinSkin";
	}
	public commonWindowBg: CommonWindowBg;
	public viewStack: eui.ViewStack;
	windowTitleIconName: string = GlobalConfig.jifengTiaoyueLg.st101124;
	private petDebrisPanel: PetDebrisPanel;
		private petSmeltSelectPanel: PetSmeltSelectPanel;
	initUI() {
		super.initUI();
		this.petDebrisPanel = new PetDebrisPanel();
		this.petDebrisPanel.name = GlobalConfig.jifengTiaoyueLg.st101123;
		this.commonWindowBg.AddChildStack(this.petDebrisPanel)

		this.petSmeltSelectPanel = new PetSmeltSelectPanel();
		this.petSmeltSelectPanel.name = GlobalConfig.jifengTiaoyueLg.st101111;
		this.commonWindowBg.AddChildStack(this.petSmeltSelectPanel);
	}

	open(...param: any[]) {
		this.commonWindowBg.OnAdded(this, param && param[0]);
		this.addWinEvent();
		this.updateRedPoint();
	}
	close() {
		this.petSmeltSelectPanel.release();
		this.petDebrisPanel.release();
		this.removeObserve();
		this.removeWinEvetn();
		this.commonWindowBg.OnRemoved();
	}
	private addWinEvent() {
	}

	private removeWinEvetn() {

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

ViewManager.ins().reg(PetDebrisWin, LayerManager.UI_Main);
window["PetDebrisWin"] = PetDebrisWin