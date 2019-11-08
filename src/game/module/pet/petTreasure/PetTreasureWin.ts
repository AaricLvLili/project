class PetTreasureWin extends BaseEuiPanel implements ICommonWindow, ICommonWindowTitle {
	public constructor() {
		super()
		this.skinName = "MainWinSkin";
	}

	public commonWindowBg: CommonWindowBg;



	windowTitleIconName: string = GlobalConfig.jifengTiaoyueLg.st100462;
	private petTreasurePanel: PetTreasurePanel;

	initUI() {
		super.initUI();
		this.petTreasurePanel = new PetTreasurePanel();
		this.petTreasurePanel.name = GlobalConfig.jifengTiaoyueLg.st100404;
		this.commonWindowBg.AddChildStack(this.petTreasurePanel);
		PetSproto.ins().sendGetPetInitMsg();
		PetSproto.ins().sendPetAttachInit();
	}

	open(...param: any[]) {
		this.commonWindowBg.OnAdded(this, param && param[0]);
		this.updateRedPoint();
	}
	close() {
		this.petTreasurePanel.release();
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

ViewManager.ins().reg(PetTreasureWin, LayerManager.UI_Main);
window["PetTreasureWin"] = PetTreasureWin