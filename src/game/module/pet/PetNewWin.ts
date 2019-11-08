class PetNewWin extends BaseEuiPanel {
	public constructor() {
		super()
		this.skinName = "PetNewWinSkin";
	}

	public m_PetAnim: PetAnim;
	public m_SureBtn: eui.Button;

	public m_Img: eui.Image;

	private petData: PetData;

	public static isOpen: boolean = false;
	initUI() {
		super.initUI();
		this.m_PetAnim.m_RAndNameLab.stroke = 1;
		this.m_PetAnim.m_RAndNameLab.strokeColor = 0xFFFFFF;
		this.m_PetAnim.m_Power.visible = false;
		this.m_PetAnim.m_Bg.visible = false;
		this.m_PetAnim.m_NameGroup.y = 230;
	}
	open(...param: any[]) {
		this.petData = param[0];
		if (this.petData.star > 0) {
			this.m_Img.source = "comp_262_70_5_png"
		} else {
			this.m_Img.source = "comp_262_70_1_png"
		}
		this.time = 5;
		this.addViewEvent();
		this.addTimer();
		this.setData();
		PetNewWin.isOpen = true;

	}
	close() {
		this.release();
	}
	public release() {
		this.removeTimer();
		this.m_PetAnim.release();
		PetNewWin.isOpen = false;
	}

	private time: number = 5;

	private setData() {
		this.m_SureBtn.label = GlobalConfig.jifengTiaoyueLg.st100040 + "（" + this.time + "）";
		this.m_PetAnim.setPetData(this.petData.petid);
		this.m_PetAnim.playNewEff();
		this.m_PetAnim.m_Bg.visible = false;
		let isCompele: boolean = GuideLocalStorage.checkIdIsCompele(15);
		if (!isCompele) {
			Setting.currPart = 15;
			Setting.currStep = 0;
			GuideUtils.ins().show(this.m_SureBtn, 15, 0);
		}
	}
	private addTimer() {
		this.removeTimer();
		TimerManager.ins().doTimer(1000, 0, this.refTime, this);
	}
	private removeTimer() {
		TimerManager.ins().remove(this.refTime, this);
	}

	private refTime() {
		this.time -= 1;
		this.m_SureBtn.label = GlobalConfig.jifengTiaoyueLg.st100040 + "（" + this.time + "）";
		if (this.time < 0) {
			this.onClickClose();
		}
	}
	private addViewEvent() {
		this.observe(PetEvt.PET_DATAUPDATE_MSG, this.setData);
		this.AddClick(this.m_SureBtn, this.onClickClose);
	}

	private onClickClose() {
		PetNewWin.isOpen = false;
		GuideUtils.ins().next(this.m_SureBtn);
		GameGlobal.MessageCenter.dispatch(PetEvt.PET_GUIDE_MSG);
		ViewManager.ins().close(this);
	}
}

ViewManager.ins().reg(PetNewWin, LayerManager.UI_Top);
window["PetNewWin"] = PetNewWin