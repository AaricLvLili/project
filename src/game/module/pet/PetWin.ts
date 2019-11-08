class PetWin extends BaseEuiPanel implements ICommonWindow, ICommonWindowTitle {
	public constructor() {
		super()
		this.skinName = "MainWinSkin";
	}

	public commonWindowBg: CommonWindowBg;



	windowTitleIconName: string = GlobalConfig.jifengTiaoyueLg.st100462;

	private petMainPanel: PetMainPanel;
	private petSkillPanel: PetSkillPanel;
	private petAttachPanel: PetAttachPanel;
	public static isSaveGuide = true;
	initUI() {
		super.initUI();
		this.petMainPanel = new PetMainPanel();
		this.petMainPanel.name = GlobalConfig.jifengTiaoyueLg.st101089;
		this.commonWindowBg.AddChildStack(this.petMainPanel);
		this.petSkillPanel = new PetSkillPanel();
		this.petSkillPanel.name = GlobalConfig.jifengTiaoyueLg.st101088;
		this.commonWindowBg.AddChildStack(this.petSkillPanel);
		this.petAttachPanel = new PetAttachPanel();
		this.petAttachPanel.name = GlobalConfig.jifengTiaoyueLg.st101090;
		this.commonWindowBg.AddChildStack(this.petAttachPanel);
	}

	open(...param: any[]) {
		PetWin.isSaveGuide = true;
		PetSproto.ins().sendGetPetInitMsg();
		PetSproto.ins().sendPetAttachInit();
		this.commonWindowBg.OnAdded(this, param && param[0]);
		this.addWinEvent();
		this.updateRedPoint();
	}
	close() {
		PetWin.isSaveGuide = false;
		this.petMainPanel.release();
		this.petSkillPanel.release();
		this.petAttachPanel.release();
		var bottomView = <UIView2>ViewManager.ins().getView(UIView2)
		if (bottomView != null) {
			bottomView.closeNav(UIView2.NAV_PET)
		}
		this.removeObserve();
		this.removeWinEvetn();
		this.commonWindowBg.OnRemoved();
	}
	private addWinEvent() {
		this.observe(PetEvt.PET_DATAUPDATE_MSG, this.updateRedPoint);
		this.observe(PetEvt.PET_GUIDE_MSG_END, this.checkGuideEnd);
		this.observe(PetEvt.PET_ATTACH_MSG, this.updateRedPoint);
	}

	private removeWinEvetn() {
		if (this.commonWindowBg) {
			this.commonWindowBg.returnBtn.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onClick, this);
		}

	}

	private updateRedPoint() {
		let petModel = PetModel.getInstance;
		this.commonWindowBg.ShowTalRedPoint(0, petModel.checkPetStateRedPoint())
		this.commonWindowBg.ShowTalRedPoint(1, petModel.checkSkilledPoint())
		this.commonWindowBg.ShowTalRedPoint(2, petModel.checkAllRoleAttactRedPoint());
	};

	private checkGuideEnd() {
		if (Setting.currPart == 17 && Setting.currStep == 3 && UserFb.ins().guanqiaID == GuideQuanQiaType.PET) {
			this.commonWindowBg.returnBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onClick, this);
			GuideUtils.ins().show(this.commonWindowBg.returnBtn, 17, 3);
		} else if (Setting.currPart == 27 && Setting.currStep == 4) {
			this.commonWindowBg.returnBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onClick, this);
			GuideUtils.ins().show(this.commonWindowBg.returnBtn, 27, 4);
		}
	}

	private onClick() {
		GuideUtils.ins().next(this.commonWindowBg.returnBtn);
	}

	OnBackClick(clickType: number): number {
		return 0
	}
	OnOpenIndex(openIndex: number): boolean {
		if (openIndex == 2) {
			return Deblocking.Check(DeblockingType.TYPE_94)
		}
		return true
	}

	UpdateContent(): void { }

}

ViewManager.ins().reg(PetWin, LayerManager.UI_Main);
window["PetWin"] = PetWin