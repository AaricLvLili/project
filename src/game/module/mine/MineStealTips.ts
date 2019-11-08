class MineStealTips extends BaseEuiPanel {
	public constructor() {
		super();
		this.layerLevel = VIEW_LAYER_LEVEL.TOP;
	}
	private m_Downcount: eui.Label;
	public static downcount: number = 5;
	//private dialogCloseBtn:eui.Button;
	public initUI(): void {
		super.initUI();
		this.skinName = "KuangDongTips";


	}

	open(...param: any[]) {
		this.m_bg.init(`MineStealTips`, GlobalConfig.jifengTiaoyueLg.st100367, false)
		MineStealTips.downcount = param[0];
		//this.dialogCloseBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this._OnClick, this);
		TimerManager.ins().doTimer(1000, MineStealTips.downcount, this.updateDowncount, this);
	}

	close() {
		//this.dialogCloseBtn.removeEventListener(egret.TouchEvent.TOUCH_TAP, this._OnClick, this)
		MessageCenter.ins().removeAll(this);
	}

	private _OnClick(e: egret.TouchEvent) {
		ViewManager.ins().close(this);
	}

	private updateDowncount(): void {
		MineStealTips.downcount--;
		if (MineStealTips.downcount <= 0) {
			this.onClose();
			TimerManager.ins().remove(this.updateDowncount, this);
			return;
		}
		this.m_Downcount.text = MineStealTips.downcount + GlobalConfig.jifengTiaoyueLg.st101902;
	}

	private onClose(): void {
		ViewManager.ins().close(this);
	}
}
ViewManager.ins().reg(MineStealTips, LayerManager.UI_Popup);
window["MineStealTips"]=MineStealTips