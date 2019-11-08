class PetAwakeningWin extends BaseEuiPanel implements ICommonWindow, ICommonWindowTitle {
	public constructor() {
		super()
		this.skinName = "MainWinSkin";
	}

	public commonWindowBg: CommonWindowBg;
	windowTitleIconName: string = GlobalConfig.jifengTiaoyueLg.st101126;
	private petAwakeningPanel: PetAwakeningPanel;
	initUI() {
		super.initUI();
		this.petAwakeningPanel = new PetAwakeningPanel();
		this.commonWindowBg.AddChildStack(this.petAwakeningPanel)
	}

	open(...param: any[]) {
		this.commonWindowBg.OnAdded(this, param && param[0]);
		this.updateRedPoint();
	}
	close() {
		this.petAwakeningPanel.release();
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

ViewManager.ins().reg(PetAwakeningWin, LayerManager.UI_Main);
window["PetAwakeningWin"] = PetAwakeningWin