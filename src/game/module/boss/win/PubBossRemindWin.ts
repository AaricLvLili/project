class PubBossRemindWin extends BaseEuiPanel {

	public static LAYER_LEVEL = LayerManager.UI_Popup

	public constructor() {
		super()
	}

	listDatas
	list0

	//private dialogCloseBtn:eui.Button;
	public m_Lan1: eui.Label;
	public m_Lan2: eui.Label;
	public m_Lan3: eui.Label;

	initUI() {
		super.initUI()
		this.skinName = "PubBossRemindSkin";
		this.listDatas = new eui.ArrayCollection;

		this.m_Lan2.text = GlobalConfig.jifengTiaoyueLg.st100333;
		this.m_Lan3.text = GlobalConfig.jifengTiaoyueLg.st100504;
	};
	open() {
		this.m_bg.init(`PubBossRemindWin`, `BOSS`+GlobalConfig.jifengTiaoyueLg.st100505)
		var param = [];
		for (var _i = 0; _i < arguments.length; _i++) {
			param[_i - 0] = arguments[_i];
		}
		//this.dialogCloseBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this._OnClick, this);
		this.listDatas.source = UserBoss.ins().bossInfo;
		this.list0.dataProvider = this.listDatas;
		this.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTap, this);
	};
	close() {
		var param = [];
		for (var _i = 0; _i < arguments.length; _i++) {
			param[_i - 0] = arguments[_i];
		}
		this.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onTap, this);
		//this.dialogCloseBtn.removeEventListener(egret.TouchEvent.TOUCH_TAP, this._OnClick, this)
	};
	private _OnClick(e: egret.TouchEvent) {
		ViewManager.ins().close(this);
	}
	onTap(e) {
		if (e.target instanceof eui.CheckBox) {
			var index = parseInt(e.target.name);
			UserBoss.ins().setRemind(1 << (index + 1));
		}
		else {
		}
	};
}

window["PubBossRemindWin"] = PubBossRemindWin