class ChaosBattlePointWin extends BaseEuiPanel implements ICommonWindow, ICommonWindowTitle {
	public constructor() {
		super()
		this.skinName = "MainWinSkin";
	}
	public commonWindowBg: CommonWindowBg;
	private chaosBattlePointPanel: ChaosBattlePointPanel;
	initUI() {
		super.initUI();
		this.chaosBattlePointPanel = new ChaosBattlePointPanel();
		this.commonWindowBg.AddChildStack(this.chaosBattlePointPanel);
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
		this.chaosBattlePointPanel.release();
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

ViewManager.ins().reg(ChaosBattlePointWin, LayerManager.UI_Popup);
window["ChaosBattlePointWin"] = ChaosBattlePointWin;