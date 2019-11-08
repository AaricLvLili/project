class GuildConWin extends BaseEuiPanel {
	public constructor() {
		super();
	}

	desc0
	desc1
	info0
	info1
	count0
	btn0: eui.Button
	count1
	//private dialogCloseBtn:eui.Button;
	btn1
	//private m_bg:CommonPopBg

	initUI() {
		super.initUI()
		this.skinName = "GuildConSkin";
		this.desc0.text = LanguageString.jifengTiaoyueCh(GlobalConfig.jifengTiaoyueLg.st100940, [GlobalConfig.ins("GuildDonateConfig")[1].count])
		this.desc1.text = LanguageString.jifengTiaoyueCh(GlobalConfig.jifengTiaoyueLg.st100941, [GlobalConfig.ins("GuildDonateConfig")[2].count])
		this.info0.text = LanguageString.jifengTiaoyueCh(GlobalConfig.jifengTiaoyueLg.st100942, [GlobalConfig.ins("GuildDonateConfig")[1].awardContri, GlobalConfig.ins("GuildDonateConfig")[1].awardFund])
		this.info1.text = LanguageString.jifengTiaoyueCh(GlobalConfig.jifengTiaoyueLg.st100942, [GlobalConfig.ins("GuildDonateConfig")[2].awardContri, GlobalConfig.ins("GuildDonateConfig")[2].awardFund])
		this.btn1.label = GlobalConfig.jifengTiaoyueLg.st100931;
		this.btn0.label = GlobalConfig.jifengTiaoyueLg.st100931;

	};
	static openCheck() {
		var param = [];
		for (var _i = 0; _i < arguments.length; _i++) {
			param[_i - 0] = arguments[_i];
		}
		return true;
	};
	update() {
		var num = GlobalConfig.ins("GuildDonateConfig")[1].dayCount[UserVip.ins().lv];
		var nextNum = GlobalConfig.ins("GuildDonateConfig")[1].dayCount[UserVip.ins().lv + 1];
		// var arr = Guild.ins().getConCount();
		if (Guild.ins().GetSurplusConCount(0) <= 0) {
			if (nextNum && (nextNum - num > 0)) {
				this.count0.textFlow = new egret.HtmlTextParser().parser(LanguageString.jifengTiaoyueCh(GlobalConfig.jifengTiaoyueLg.st100943, [(UserVip.ins().lv + 1), (nextNum - num)]));
				this.btn0.label = UserVip.ins().lv == 0 ? GlobalConfig.jifengTiaoyueLg.st100944 : GlobalConfig.jifengTiaoyueLg.st100945;
			} else {
				this.count0.text = Guild.ins().GetConCount(0) + "/" + Guild.ins().GetMaxConCount(0)
				this.btn0.label = GlobalConfig.jifengTiaoyueLg.st100931;
			}
			//  vip有跳转
			// this.btn0.enabled = UserVip.ins().lv == 0
		}
		else {
			// this.btn0.enabled = true;
			this.count0.text = Guild.ins().GetConCount(0) + "/" + Guild.ins().GetMaxConCount(0)
		}
		this.count1.text = Guild.ins().GetConCount(1) + "/" + Guild.ins().GetMaxConCount(1)
	};
	open() {
		this.m_bg.init(`GuildConWin`, GlobalConfig.jifengTiaoyueLg.st100946)
		var param = [];
		for (var _i = 0; _i < arguments.length; _i++) {
			param[_i - 0] = arguments[_i];
		}
		//this.dialogCloseBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this._OnClick, this);
		this.btn0.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTap, this);
		this.btn1.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTap, this);
		MessageCenter.addListener(Guild.ins().postConCount, this.update, this);
		Guild.ins().sendConCount();
		if (UserVip.ins().lv == 0)
			this.btn0.label = GlobalConfig.jifengTiaoyueLg.st100944;
		else
			this.btn0.label = GlobalConfig.jifengTiaoyueLg.st100931;

		this.btn0.visible = !WxSdk.ins().isHidePay();
		this.count0.visible = !WxSdk.ins().isHidePay();
	};
	close() {
		var param = [];
		for (var _i = 0; _i < arguments.length; _i++) {
			param[_i - 0] = arguments[_i];
		}
		//this.dialogCloseBtn.removeEventListener(egret.TouchEvent.TOUCH_TAP, this._OnClick, this)
		this.btn0.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onTap, this);
		this.btn1.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onTap, this);
		MessageCenter.ins().removeAll(this);
	};
	private _OnClick(e: egret.TouchEvent) {
		ViewManager.ins().close(this);
	}
	onTap(e) {
		switch (e.currentTarget) {
			case this.btn0:

				// if (Guild.ins().GetSurplusConCount(0) <= 0) {
				// 	var num = GlobalConfig.ins("GuildDonateConfig")[1].dayCount[UserVip.ins().lv];
				// 	var nextNum = GlobalConfig.ins("GuildDonateConfig")[1].dayCount[UserVip.ins().lv + 1];
				// 	if (nextNum && (nextNum - num > 0)) {
				// 		ViewManager.ins().close(this)
				// 		ViewManager.ins().open(VipWin);
				// 	} else {
				// 		UserTips.ins().showTips("次数不足");
				// 	}
				// } else if (GameLogic.ins().actorModel.yb > GlobalConfig.ins("GuildDonateConfig")[1].count) {
				// 	Guild.ins().sendCon(1);
				// }
				// else
				// 	UserTips.ins().showTips("钻石不足");
				if (GuildConWin.DonateYb() == 1) {
					ViewManager.ins().close(this)
					ViewManager.ins().open(VipWin);
				}
				break;
			case this.btn1:
				if (Guild.ins().GetSurplusConCount(1) <= 0)
					UserTips.ins().showTips(GlobalConfig.jifengTiaoyueLg.st100947);
				else if (GameLogic.ins().actorModel.gold > GlobalConfig.ins("GuildDonateConfig")[2].count) {
					Guild.ins().sendCon(2);
				}
				else
					UserTips.ins().showTips(GlobalConfig.jifengTiaoyueLg.st100222);
				break;
		}
	};

	public static DonateYb() {
		if (Guild.ins().GetSurplusConCount(0) <= 0) {
			let config = GlobalConfig.ins("GuildDonateConfig")[1].dayCount
			let vipLv = UserVip.ins().lv
			var num = config[vipLv];
			var nextNum = config[vipLv + 1];
			if (nextNum && (nextNum - num > 0)) {
				return 1
			} else {
				UserTips.ins().showTips(GlobalConfig.jifengTiaoyueLg.st100947);
			}
		} else if (GameLogic.ins().actorModel.yb > GlobalConfig.ins("GuildDonateConfig")[1].count) {
			Guild.ins().sendCon(1);
		}
		else {
			UserTips.ins().showTips(GlobalConfig.jifengTiaoyueLg.st100008);
		}
		return 0
	}
}

ViewManager.ins().reg(GuildConWin, LayerManager.UI_Popup);

window["GuildConWin"] = GuildConWin