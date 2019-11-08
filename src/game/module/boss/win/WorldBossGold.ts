class WorldBossGold extends BaseEuiPanel {

	s
	okBtn
	infoTxt
	price

	initUI() {
		super.initUI();
		this.skinName = "WorldBossGoldSkin";
	};
	open() {
		this.m_bg.init(`WorldBossGold`, GlobalConfig.jifengTiaoyueLg.st100367)
		var param = [];
		for (var _i = 0; _i < arguments.length; _i++) {
			param[_i - 0] = arguments[_i];
		}
		var hurt = param[0];
		var gold = param[1];
		this.infoTxt.textFlow = (new egret.HtmlTextParser()).parser(LanguageString.jifengTiaoyueCh(GlobalConfig.jifengTiaoyueLg.st101696, [hurt]));
		this.price.setType(MoneyConst.gold);
		this.price.setPrice(gold);
		this.s = 10;
		this.updateBtn();
		TimerManager.ins().doTimer(1000, this.s, this.updateBtn, this);
		this.okBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTap, this);
	};
	close() {
		this.okBtn.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onTap, this);
		TimerManager.ins().remove(this.updateBtn, this);
		UserFb.ins().sendExitFb();
	};
	onTap() {
		ViewManager.ins().close(this);
	};
	updateBtn() {
		this.s--;
		this.okBtn.label = GlobalConfig.jifengTiaoyueLg.st101176 + "（" + this.s + "s）";
		if (this.s <= 0) {
			this.onTap();
		}
	};
}


ViewManager.ins().reg(WorldBossGold, LayerManager.UI_Main);
window["WorldBossGold"] = WorldBossGold