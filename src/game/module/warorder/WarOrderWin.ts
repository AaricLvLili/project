class WarOrderWin extends BaseEuiPanel implements ICommonWindow, ICommonWindowTitle {
	public constructor() {
		super()
		this.skinName = "MainWinSkin";
	}

	public commonWindowBg: CommonWindowBg;
	windowTitleIconName: string = GlobalConfig.jifengTiaoyueLg.st102071;
	private warOrderPanel: WarOrderPanel;
	private warOrderMissionPanel: WarOrderMissionPanel;

	initUI() {
		super.initUI();
		this.warOrderPanel = new WarOrderPanel();
		this.commonWindowBg.AddChildStack(this.warOrderPanel);
		this.warOrderMissionPanel = new WarOrderMissionPanel();
		this.commonWindowBg.AddChildStack(this.warOrderMissionPanel);
	}

	open(...param: any[]) {
		this.commonWindowBg.OnAdded(this, param && param[0]);
		this.addWinEvent();
		this.updateRedPoint();
	}
	close() {
		this.warOrderPanel.release();
		this.warOrderMissionPanel.release();
		this.removeObserve();
		this.removeWinEvetn();
		this.commonWindowBg.OnRemoved();
	}
	private addWinEvent() {
		this.observe(WarOrderEvt.WARORDEREVT_DATAUPDATE_MSG, this.updateRedPoint)
	}

	private removeWinEvetn() {
	}

	private updateRedPoint() {
		let warORderModel = WarOrderModel.getInstance;
		this.commonWindowBg.ShowTalRedPoint(0, warORderModel.checkAwardRewPoint())
		this.commonWindowBg.ShowTalRedPoint(1, warORderModel.checkMissionRedPoint())
	};


	OnBackClick(clickType: number): number {
		return 0
	}
	OnOpenIndex(openIndex: number): boolean {
		return true
	}

	UpdateContent(): void { }

}

ViewManager.ins().reg(WarOrderWin, LayerManager.UI_Main);
window["WarOrderWin"] = WarOrderWin