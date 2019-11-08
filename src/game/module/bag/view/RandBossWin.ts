class RandBossWin extends BaseEuiPanel {

	// 定义view对象的层级
	public static LAYER_LEVEL = LayerManager.UI_Main_2

	public constructor() {
		super()
	}

	list
	upVip

	// closeBtn
	// closeBtn0
	sure
	info
	playNum
	lastNum

	private commonWindowBg: CommonWindowBg
	bossdesc
	initUI() {

		this.skinName = "RandBossSkin"
		this.list.itemRenderer = ItemBase
		this.upVip.textFlow = (new egret.HtmlTextParser).parser(GlobalConfig.jifengTiaoyueLg.st101636)
	}

	open() {
		for (var e = [], t = 0; t < arguments.length; t++) e[t] = arguments[t];
		// this.closeBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTap, this)
		// this.closeBtn0.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTap, this)
		this.commonWindowBg.OnAdded(this)
		this.sure.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTap, this)
		this.upVip.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTap, this)
		this.info = this.getUserInfoByItemId(e[0])
		this.list.dataProvider = new eui.ArrayCollection(this.info.show);
		var i = UserFb.ins().bossCallNum,
			n = this.info.challengeTime[GameGlobal.actorModel.vipLv];
		this.playNum.text = n - i + "/" + n
		this.lastNum = n - i
		this.bossdesc.text = this.info.titledes;
		this.upVip.visible = !WxSdk.ins().isHidePay();
	}

	close() {
		for (var e = [], t = 0; t < arguments.length; t++) e[t] = arguments[t];
		this.commonWindowBg.OnRemoved()
		// this.closeBtn.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onTap, this)
		// this.closeBtn0.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onTap, this)
		this.sure.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onTap, this)
		this.upVip.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onTap, this)
	}

	onTap(e) {
		switch (e.currentTarget) {
			// case this.closeBtn:
			// case this.closeBtn0:
			// 	ViewManager.ins().close(RandBossWin);
			// 	break;
			case this.sure:
				if (this.lastNum <= 0) return void UserTips.ins().showTips(GlobalConfig.jifengTiaoyueLg.st101637);
				if (GameGlobal.actorModel.level >= this.info.levelLimit) return UserFb.ins().sendCallBossPlay(this.info.id), ViewManager.ins().close(RandBossWin), void ViewManager.ins().close(BagWin);
				UserTips.ins().showTips(LanguageString.jifengTiaoyueCh(GlobalConfig.jifengTiaoyueLg.st101638, [this.info.levelLimit]));
				break;
			case this.upVip:
				ViewManager.ins().open(VipWin);
				ViewManager.ins().close(this)
				break
		}
	}

	getUserInfoByItemId(e) {
		var t = GlobalConfig.ins("OtherBoss2Config");
		for (var i in t)
			if (t[i].itemId == e) return t[i];
		return null
	}
}
window["RandBossWin"] = RandBossWin