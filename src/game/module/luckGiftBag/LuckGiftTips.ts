class LuckGiftTips extends BaseEuiPanel  {
	private m_Rect: eui.Rect;
	private m_TipsLab: eui.Label;
	private m_ConfigId: number;
	public constructor() {
		super();
		this.skinName = "LuckGiftTipsSkin";
	}
	initUI() {
		super.initUI();
	}
	public open(...param: any[]) {
		this.m_ConfigId = param[0];
		this.addViewEvent();
		this.setData();
		this.addTick();
	};
	public close() {
		this.removeTick();
		this.removeViewEvent();
	};

	private setData() {
		let activityGiftConfig = GlobalConfig.ins("ActivityGiftConfig");
		if (activityGiftConfig) {
			let activityGiftData = activityGiftConfig[this.m_ConfigId];
			if (activityGiftData) {
				this.m_TipsLab.text = activityGiftData.tips;
			}
		}
	}

	private addViewEvent() {
		this.m_Rect.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onClose, this);
	}

	private removeViewEvent() {
		this.m_Rect.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onClose, this);
	}

	private addTick() {
		this.removeTick();
		TimerManager.ins().doTimer(5000, 1, this.onClose, this);
	}
	private removeTick() {
		TimerManager.ins().remove(this.onClose, this);
	}


	private onClose() {
		ViewManager.ins().close(LuckGiftTips);
	}

}
ViewManager.ins().reg(LuckGiftTips, LayerManager.UI_Popup);
window["LuckGiftTips"]=LuckGiftTips