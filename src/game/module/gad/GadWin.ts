class GadWin extends BaseEuiPanel implements ICommonWindow, ICommonWindowTitle {
	public constructor() {
		super()
		this.skinName = "MainWinSkin";
	}

	public commonWindowBg: CommonWindowBg;
	public viewStack: eui.ViewStack;


	mWindowHelpId = 29;
	windowTitleIconName: string = GlobalConfig.jifengTiaoyueLg.st100305;

	private gadPanel: GadPanel;
	initUI() {
		super.initUI();
		this.gadPanel = new GadPanel();
		this.gadPanel.name = GlobalConfig.jifengTiaoyueLg.st100305;
		this.commonWindowBg.AddChildStack(this.gadPanel);
	}

	open(...param: any[]) {
		this.commonWindowBg.OnAdded(this, param && param[0])
		this.addWinEvent();
		this.updateRedPoint();
	}
	close() {
		this.gadPanel.release();
		var bottomView = <UIView2>ViewManager.ins().getView(UIView2)
		if (bottomView != null) {
			bottomView.closeNav(UIView2.NAV_PET)
		}
		this.removeObserve();
		this.removeWinEvetn();
		this.commonWindowBg.OnRemoved();
	}
	private addWinEvent() {
		this.observe(GadEvent.GAD_DATAUPDATE_MSG, this.updateRedPoint);
		this.observe(GadEvent.GAD_GUIDEEND_MSG, this.checkLastGadGuide)
	}

	private removeWinEvetn() {
	}

	private updateRedPoint() {
		let gadModel = GadModel.getInstance;
		let isShow: boolean = false;
		if (gadModel.checkAllRoleCanChangeItem() || gadModel.checkAllRoleCanLvUp()) {
			isShow = true;
		}
		this.commonWindowBg.ShowTalRedPoint(0, isShow);
	};

	private checkLastGadGuide() {
		if (Setting.currPart == 20 && Setting.currStep == 11) {
			GuideUtils.ins().show(this.commonWindowBg.returnBtn, 20, 11);
			this.commonWindowBg.returnBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onClickGuideEnd, this);
		}
	}

	private onClickGuideEnd() {
		GuideUtils.ins().next(this.commonWindowBg.returnBtn);
		this.commonWindowBg.returnBtn.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onClickGuideEnd, this);
		MessageCenter.ins().dispatch(GadEvent.GAD_GUIDEENDBATTLE_MSG);
	}

	OnBackClick(clickType: number): number {
		return 0
	}
	OnOpenIndex(openIndex: number): boolean {
		return true
	}

	UpdateContent(): void { }

}

ViewManager.ins().reg(GadWin, LayerManager.UI_Main);
window["GadWin"] = GadWin