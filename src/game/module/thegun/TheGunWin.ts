class TheGunWin extends BaseEuiPanel implements ICommonWindow, ICommonWindowTitle {
	public constructor() {
		super()
		this.skinName = "MainWinSkin";
	}

	public commonWindowBg: CommonWindowBg;
	windowTitleIconName: string = GlobalConfig.jifengTiaoyueLg.st102041;

	private theGunPanel: TheGunPanel;
	initUI() {
		super.initUI();
		this.theGunPanel = new TheGunPanel();
		this.commonWindowBg.AddChildStack(this.theGunPanel);
	}

	open(...param: any[]) {
		TheGunSproto.ins().sendTheGunInitMsg();
		this.commonWindowBg.OnAdded(this, param && param[0]);
		this.addWinEvent();
		this.updateRedPoint();
	}
	close() {
		this.theGunPanel.release();
		this.removeObserve();
		this.removeWinEvetn();
		this.commonWindowBg.OnRemoved();
	}
	private addWinEvent() {
		this.observe(TheGunEvt.THEGUN_DATAUPDATE_MSG, this.updateRedPoint);
		this.observe(TheGunEvt.THEGUN_AWARD_MSG, this.updateRedPoint);
		this.observe(TheGunEvt.THEGUN_DANYAO_MSG, this.updateRedPoint);
		this.observe(TheGunEvt.THEGUN_SKILLDATAUPDATE_MSG, this.updateRedPoint);
	}

	private removeWinEvetn() {

	}

	private updateRedPoint() {
		let theGunModel = TheGunModel.getInstance;
		this.commonWindowBg.ShowTalRedPoint(0, theGunModel.checkAllRedPoint())
	};

	OnBackClick(clickType: number): number {
		return 0
	}
	OnOpenIndex(openIndex: number): boolean {
		return true
	}

	UpdateContent(): void { }

}

ViewManager.ins().reg(TheGunWin, LayerManager.UI_Main);
window["TheGunWin"] = TheGunWin