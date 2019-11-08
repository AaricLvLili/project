class ChaosBattleRankWin extends BaseEuiPanel implements ICommonWindow, ICommonWindowTitle {
	public constructor() {
		super()
		this.skinName = "MainWinSkin";
	}
	public commonWindowBg: CommonWindowBg;
	// windowTitleIconName: string = GlobalConfig.languageConfig.st100462;
	private chaosBattleRankPanel: ChaosBattleRankPanel;
	private chaosBattleLayerPanel: ChaosBattleLayerPanel;
	private chaosBattleRankAwardPanel: ChaosBattleRankAwardPanel;
	initUI() {
		super.initUI();
		this.chaosBattleRankPanel = new ChaosBattleRankPanel();
		this.commonWindowBg.AddChildStack(this.chaosBattleRankPanel);
		this.chaosBattleLayerPanel = new ChaosBattleLayerPanel();
		this.commonWindowBg.AddChildStack(this.chaosBattleLayerPanel);
		this.chaosBattleRankAwardPanel = new ChaosBattleRankAwardPanel();
		this.commonWindowBg.AddChildStack(this.chaosBattleRankAwardPanel);
	}

	open(...param: any[]) {
		ChaosBattleSproto.ins().sendRank();
		this.commonWindowBg.OnAdded(this, param && param[0]);
		this.addWinEvent();
		this.updateRedPoint();
	}
	close() {
		this.removeObserve();
		this.removeWinEvetn();
		this.commonWindowBg.OnRemoved();
		this.chaosBattleRankPanel.release();
		this.chaosBattleLayerPanel.release();
		this.chaosBattleRankAwardPanel.release();
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

ViewManager.ins().reg(ChaosBattleRankWin, LayerManager.UI_Popup);
window["ChaosBattleRankWin"] = ChaosBattleRankWin;