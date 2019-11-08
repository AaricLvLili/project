class MountNewWin extends BaseEuiPanel {
	public constructor() {
		super()
		this.skinName = "MountNewWinSkin";
	}

	private m_MountData: MountData;
	public m_MountAnim: MountAnim;
	public m_SureBtn: eui.Button;


	initUI() {
		super.initUI();
		this.m_MountAnim.m_RAndNameLab.stroke = 1;
		this.m_MountAnim.m_RAndNameLab.strokeColor = 0xffffff;
		this.m_MountAnim.m_Bg.visible = false;
		this.m_MountAnim.m_NameGroup.y = 230;
	}
	open(...param: any[]) {
		this.m_MountData = param[0];
		this.time = 5;
		this.addViewEvent();
		this.addTimer();
		this.setData();
	}
	close() {
		this.release();
	}
	public release() {
		this.m_MountAnim.release();
		this.removeTimer();
		this.removeViewEvent();
	}
	private addViewEvent() {
		this.AddClick(this.m_SureBtn, this.onClickClose)
	}
	private removeViewEvent() {
	}
	private setData() {
		this.m_SureBtn.label = GlobalConfig.jifengTiaoyueLg.st100040 + "（" + this.time + "）";
		let mountData: MountData = this.m_MountData;
		this.m_MountAnim.setMountData(mountData);
		this.m_MountAnim.m_Bg.visible = false;
		this.m_MountAnim.totalPower.visible = false;
		this.m_MountAnim.m_RAndNameLab.visible = false;
		this.m_MountAnim.m_NameBg.visible = false;
		this.m_MountAnim.playNewEff();
	}


	private onClickClose() {
		ViewManager.ins().close(this);
	}

	private time: number = 5;

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
}

ViewManager.ins().reg(MountNewWin, LayerManager.UI_Top);
window["MountNewWin"] = MountNewWin