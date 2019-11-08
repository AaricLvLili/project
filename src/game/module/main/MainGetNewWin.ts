class MainGetNewWin extends BaseEuiPanel {
	public constructor() {
		super()
		this.skinName = "MainGetNewWinSkin";
	}

	public m_MainGetAnim: MainGetAnim;
	public m_SureBtn: eui.Button;
	public m_Img: eui.Image;

	public static isOpen: boolean = false;
	initUI() {
		super.initUI();
	}
	open(...param: any[]) {
		MainGetNewWin.isOpen = true;
		this.time = 5;
		this.addViewEvent();
		this.addTimer();
		this.setData();
		this.checkGuide();
	}
	close() {
		MainGetNewWin.isOpen = false;
		this.m_MainGetAnim.release();
		this.release();
	}
	public release() {
		this.removeTimer();
	}

	private time: number = 5;

	private setData() {
		this.m_SureBtn.label = GlobalConfig.jifengTiaoyueLg.st100040 + "（" + this.time + "）";
		let id = UserBag.ins().showList[0];
		let exhibitionConfig = GlobalConfig.ins("ExhibitionConfig")[id];
		if (exhibitionConfig) {
			this.m_Img.source = exhibitionConfig.textTips + "_png";
		}
		this.m_MainGetAnim.setData();
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

	public onMaskTap() {
		this.onClickClose();
	}

	private onClickClose() {
		GuideUtils.ins().next(this.m_SureBtn);
		let fbWin = ViewManager.ins().getView(FbWin);
		if (fbWin instanceof FbWin) {
			fbWin.fbChallengePanel.checkGuide2();
		}
		if (UserBag.ins().showList.length > 0) {
			this.time = 6;
			this.setData();
			this.refTime();
		} else {
			ViewManager.ins().close(this);
		}
	}

	private checkGuide() {
		if (UserFb2.ins().fbChallengeId == GuideArtifact.Artifact) {
			this.removeTimer();
			GuideUtils.ins().show(this.m_SureBtn, 68, 2);
		}
	}
}

ViewManager.ins().reg(MainGetNewWin, LayerManager.UI_Top);
window["MainGetNewWin"] = MainGetNewWin