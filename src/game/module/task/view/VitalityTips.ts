class VitalityTips extends BaseEuiPanel {
	public constructor() {
		super()
		this.skinName = "VitalityTipsSkin";
	}
	public m_bg: CommonPopBg;
	public m_MainBtn: eui.Button;
	public m_Lan1: eui.Label;
	public m_List1: eui.List;

	public time: number = 4;
	public createChildren() {
		super.createChildren();
		this.m_bg.init(`VitalityTips`, GlobalConfig.jifengTiaoyueLg.st102097);
	}
	initUI() {
		super.initUI();
	}
	open(...param: any[]) {
		this.time = 4
		this.addViewEvent();
		this.setData();
	}
	close() {
		this.release();
	}
	public release() {
		this.removeViewEvent();
		this.removeTime();
	}
	private addViewEvent() {
		this.AddClick(this.m_MainBtn, this.onClickClose);
	}
	private removeViewEvent() {
	}
	private setData() {
		let lordLevelConfig = GlobalConfig.ins("LordLevelConfig")[UserTask.ins().lv];
		this.m_List1.dataProvider = new eui.ArrayCollection(lordLevelConfig.award);
		this.playTime();
	}
	public addTime() {
		this.removeTime();
		TimerManager.ins().doTimer(1000, 0, this.playTime, this);
		this.playTime();
	}
	public removeTime() {
		TimerManager.ins().doTimer(1000, 0, this.playTime, this);
	}
	private playTime() {
		this.time--;
		this.m_MainBtn.label = GlobalConfig.jifengTiaoyueLg.st100040 + "(" + this.time + ")";
		if (this.time <= 0) {
			this.removeTime();
			this.onClickClose();
		}
	}
	private onClickClose() {
		ViewManager.ins().close(this);
	}

}
ViewManager.ins().reg(VitalityTips, LayerManager.UI_Popup);
window["VitalityTips"] = VitalityTips