class MainNewWin extends BaseEuiPanel {
	public constructor() {
		super()
		this.skinName = "MainNewWinSkin";
	}

	public m_MainAnim: MainAnim;
	public m_SureBtn: eui.Button;
	public m_Img: eui.Image;

	public static isOpen: boolean = false;

	private roleID: number;
	private animType: number;
	private animStr: string;
	private animName: string;
	private imageType: number;
	initUI() {
		super.initUI();
	}
	open(...param: any[]) {
		this.animType = param[0];
		this.roleID = param[1];
		this.animStr = param[2][0];
		this.animName = param[2][1];
		this.imageType = param[2][2];
		this.time = 5;
		this.addViewEvent();
		this.addTimer();
		this.setData();
		this.checkGuide();
	}
	close() {
		this.m_MainAnim.release();
		this.release();
	}
	public release() {
		this.removeTimer();
	}

	private time: number = 5;

	private setData() {
		this.m_SureBtn.label = GlobalConfig.jifengTiaoyueLg.st100040 + "（" + this.time + "）";
		if (this.imageType != null) {
			this.m_Img.source = "comp_262_70_" + this.imageType + "_png"
		}
		this.m_MainAnim.setData(this.animType, this.roleID, this.animStr, this.animName);
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
		this.AddClick(this.m_SureBtn, this.onClickClose);
	}

	private onClickClose() {
		GuideUtils.ins().next(this.m_SureBtn);
		let uIView2 = ViewManager.ins().getView(UIView2);
		if (uIView2 instanceof UIView2) {
			uIView2.checkArGuide();
		}
		ViewManager.ins().close(this);
	}
	private checkGuide() {
		if (UserFb2.ins().fbChallengeId == GuideArtifact.Artifact) {
			this.removeTimer();
			GuideUtils.ins().show(this.m_SureBtn, 68, 5);
		}
	}
}

ViewManager.ins().reg(MainNewWin, LayerManager.UI_Top);
window["MainNewWin"] = MainNewWin