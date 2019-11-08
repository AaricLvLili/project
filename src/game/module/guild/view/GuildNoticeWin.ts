class GuildNoticeWin extends BaseEuiPanel {
	public constructor() {
		super();
	}


	saveBtn
	textInput
	//private dialogCloseBtn:eui.Button;
	public m_Lan1: eui.Label;

	initUI() {
		super.initUI()
		this.skinName = "GuildNoticeSkin";
		this.m_Lan1.text = GlobalConfig.jifengTiaoyueLg.st100937;
		this.saveBtn.label = GlobalConfig.jifengTiaoyueLg.st100938;
	};
	open() {
		this.m_bg.init(`GuildNoticeWin`, GlobalConfig.jifengTiaoyueLg.st100936)
		//this.dialogCloseBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this._OnClick, this);
		var param = [];
		for (var _i = 0; _i < arguments.length; _i++) {
			param[_i - 0] = arguments[_i];
		}
		this.saveBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTap, this);
		this.textInput.text = Guild.ins().notice;
	};
	close() {
		var param = [];
		for (var _i = 0; _i < arguments.length; _i++) {
			param[_i - 0] = arguments[_i];
		}
		this.saveBtn.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onTap, this);
		//this.dialogCloseBtn.removeEventListener(egret.TouchEvent.TOUCH_TAP, this._OnClick, this)
	};
	private _OnClick(e: egret.TouchEvent) {
		ViewManager.ins().close(this);
	}
	onTap(e) {
		switch (e.currentTarget) {

			case this.saveBtn:
				Guild.ins().notice = this.textInput.text;
				Guild.ins().sendChangeNotice(this.textInput.text);
				ViewManager.ins().close(this);
				break;
		}
	};
}


ViewManager.ins().reg(GuildNoticeWin, LayerManager.UI_Popup);
window["GuildNoticeWin"] = GuildNoticeWin