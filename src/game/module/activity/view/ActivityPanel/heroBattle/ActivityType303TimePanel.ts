class ActivityType303TimePanel extends BaseEuiView {

	public static LAYER_LEVEL = LayerManager.UI_USER_INFO
	public m_TimeLab: eui.Label;

	public constructor() {
		super();
	}
	public initUI() {
		super.initUI();
		this.skinName = "Activity303TimePanelSkin";
		this.touchEnabled = false;
	};

	public open(...param: any[]) {
		super.open(param);
		this.setData();
	};
	public close(...param: any[]) {
		super.close(param);
		this.removeObserve();
		this.release();
	};
	public setData() {
		this.addTime();
	}

	private addTime() {
		TimerManager.ins().doTimer(1000, 0, this.setTime, this);
		this.setTime();
	}

	private removeTime() {
		TimerManager.ins().remove(this.setTime, this);
	}

	private setTime() {
		if ((Activity303Sproto.ins().time - GameServer.serverTime) < 0) {
			return;
		}
		let str = "";
		if (GameMap.IsTeamFb()) {
			str = GlobalConfig.jifengTiaoyueLg.st102006;
		}
		else {
			str = GlobalConfig.jifengTiaoyueLg.st101379;
		}
		this.m_TimeLab.text =str + DateUtils.GetFormatSecond(Activity303Sproto.ins().time - GameServer.serverTime, DateUtils.TIME_FORMAT_1)
	}

	private release() {
		this.removeTime();
	}

}
window["ActivityType303TimePanel"] = ActivityType303TimePanel