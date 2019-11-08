
class DartCarRevengeWin extends BaseEuiPanel {

	static LAYER_LEVEL = LayerManager.UI_Popup

	public constructor() {
		super()
	}

	reward
	data: Sproto.biaoche_record_info
	attBtn
	nametx
	AttrNum
	time
	handImg

	//private dialogCloseBtn: eui.Button;
	initUI() {
		super.initUI()
		this.skinName = "KuangDongFuchouSkin"
		this.reward.itemRenderer = ItemBase

	}

	open() {
		this.m_bg.init(`DartCarRevengeWin`, GlobalConfig.jifengTiaoyueLg.st101729)
		for (var e = [], t = 0; t < arguments.length; t++) e[t] = arguments[t];
		//this.dialogCloseBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this._OnClick, this);
		this.data = e[0], this.attBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTap, this), this.refushInfo()
	}

	close() {
		for (var e = [], t = 0; t < arguments.length; t++) e[t] = arguments[t];
		this.attBtn.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onTap, this)
		//this.dialogCloseBtn.removeEventListener(egret.TouchEvent.TOUCH_TAP, this._OnClick, this)
	}
	private _OnClick(e: egret.TouchEvent) {
		ViewManager.ins().close(this);
	}

	refushInfo() {
		this.nametx.text =GlobalConfig.jifengTiaoyueLg.st101730 + this.data.roberName;
		this.AttrNum.text =GlobalConfig.jifengTiaoyueLg.st100809 + this.data.fightPow;
		this.time.text = GlobalConfig.jifengTiaoyueLg.st101731 + DateUtils.GetFormatSecond(this.data.robTime, 8);
		this.reward.dataProvider = new eui.ArrayCollection(DartCarModel.countRewardList(this.data.biaocheType, !0, 1));
		ErrorLog.Assert(this.data, "DartCarRevengeWin   this.data") || (this.handImg.source = "propIcon_048_png");
	}

	onTap(e) {
		switch (e.target) {
			case this.attBtn:
				DartCarModel.ins().sendDartCarRevenge(this.data.robIndex);
				ViewManager.ins().close(DartCarRevengeWin)
				break;
		}
	}
}
window["DartCarRevengeWin"]=DartCarRevengeWin