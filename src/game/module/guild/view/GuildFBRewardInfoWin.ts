class GuildFBRewardInfoWin extends BaseEuiPanel {
	public constructor() {
		super();
	}

	btn1
	btn2
	info
	//private dialogCloseBtn:eui.Button;
	initUI() {
		super.initUI();
		this.skinName = "GuildFbRewardSkin";

	};
	open() {
		this.m_bg.init(`MailDetailedWin`, GlobalConfig.jifengTiaoyueLg.st101236)
		var param = [];
		for (var _i = 0; _i < arguments.length; _i++) {
			param[_i - 0] = arguments[_i];
		}
		//this.dialogCloseBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this._OnClick, this);
		this.btn1.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTap, this);
		this.btn2.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTap, this);
		MessageCenter.addListener(GuildFB.ins().postGuildFubenInfo, this.updateInfo, this);
		this.info = param[0];
		this.updateInfo();
	};
	close() {
		var param = [];
		for (var _i = 0; _i < arguments.length; _i++) {
			param[_i - 0] = arguments[_i];
		}
		//this.dialogCloseBtn.removeEventListener(egret.TouchEvent.TOUCH_TAP, this._OnClick, this)
		this.btn1.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onTap, this);
		this.btn2.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onTap, this);
		MessageCenter.ins().removeAll(this);
	};
	private _OnClick(e: egret.TouchEvent) {
		ViewManager.ins().close(this);
	}
	updateInfo() {
		var datas = GuildFB.ins().getGkDatas();
		if (datas) {
			for (var i = 0; i < 5; i++) {
				if (datas.length <= i)
					this['label' + (i + 1)].text = GlobalConfig.jifengTiaoyueLg.st100378;//"暂无";
				else
					this['label' + (i + 1)].text = datas[i];
			}
		}
	};
	onTap(e) {
		switch (e.currentTarget) {


			case this.btn1:
				WarnWin.show(this.info.tips1, function () {
				}, this);
				break;
			case this.btn2:
				WarnWin.show(this.info.tips2, function () {
				}, this);
				break;
		}
	};
}


ViewManager.ins().reg(GuildFBRewardInfoWin, LayerManager.UI_Popup);
window["GuildFBRewardInfoWin"]=GuildFBRewardInfoWin