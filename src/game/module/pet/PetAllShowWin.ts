class PetAllShowWin extends BaseEuiPanel implements ICommonWindow, ICommonWindowTitle {
	public constructor() {
		super()
		this.skinName = "MainWinSkin";
	}

	public commonWindowBg: CommonWindowBg;



	windowTitleIconName: string = GlobalConfig.jifengTiaoyueLg.st101116;
	private petAllShowPanel: PetAllShowPanel;
	private petAllShowStatePanel: PetAllShowStatePanel;
	initUI() {
		super.initUI();
		this.petAllShowStatePanel = new PetAllShowStatePanel();
		this.commonWindowBg.AddChildStack(this.petAllShowStatePanel);
		this.petAllShowPanel = new PetAllShowPanel();
		this.petAllShowPanel.name = GlobalConfig.jifengTiaoyueLg.st101846;
		this.commonWindowBg.AddChildStack(this.petAllShowPanel);
	}

	open(...param: any[]) {
		this.commonWindowBg.OnAdded(this, param && param[0])
		this.updateRedPoint();
	}
	close() {
		this.petAllShowPanel.release();
		this.removeObserve();
		this.commonWindowBg.OnRemoved();
	}

	private updateRedPoint() {
		// let numChild = this.viewStack.numChildren;
		// for (var i = 0; i < numChild; i++) {
		// 	let child = this.viewStack.getChildAt(i);
		// 	if (child && child instanceof LuckGiftBagPanel) {
		// 		this.commonWindowBg.ShowTalRedPoint(i, LuckGiftBagModel.getInstance.cleckRedPoint(child.configDataId))
		// 	}
		// }
	};





	OnBackClick(clickType: number): number {
		return 0
	}
	OnOpenIndex(openIndex: number): boolean {
		return true
	}

	UpdateContent(): void { }

}

ViewManager.ins().reg(PetAllShowWin, LayerManager.UI_Main);
window["PetAllShowWin"] = PetAllShowWin