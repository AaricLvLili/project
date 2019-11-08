class GuildCreateWin extends BaseEuiPanel {
	public constructor() {
		super();
	}
	selectLevel = 1;
	leftLab
	rightLab
	textInput
	selectBmp
	//private dialogCloseBtn:eui.Button;
	okBtn
	public time: eui.Label;

	initUI() {
		super.initUI()
		this.skinName = "GuildBuildSkin";
		let str1 = this.formatLab(1);
		let str2 = this.formatLab(2);
		this.leftLab.textFlow = new egret.HtmlTextParser().parser(str1);
		this.rightLab.textFlow = new egret.HtmlTextParser().parser(str2);
		this.textInput.maxChars = 6;
		this.time.text = GlobalConfig.jifengTiaoyueLg.st100907;
		this.okBtn.label = GlobalConfig.jifengTiaoyueLg.st100908;

	};
	changeSelect(id) {
		this.selectLevel = id;
		//this.selectBmp.x = this.selectLevel == 1 ? 124 : 388;
		this.selectBmp.horizontalCenter = this.selectLevel == 1 ? this.leftLab.horizontalCenter : this.rightLab.horizontalCenter;
	};
	formatLab(level) {
		var gcc = GlobalConfig.ins("GuildCreateConfig");
		var gc = GlobalConfig.ins("GuildConfig");
		var maxMember: number = (GameServer.serverMergeTime > 0) ? gc.maxHeFuMember[level - 1] : gc.maxMember[level - 1];
		var vipLv = gcc[level].vipLv;
		var vipDesc = vipLv > 0 ? "<font color='#535557' size='16'>(VIP" + vipLv + GlobalConfig.jifengTiaoyueLg.st101795 + ")</font>" : "";
		var tempAward = gcc[level].award == 0 ? "\n" : LanguageString.jifengTiaoyueCh(GlobalConfig.jifengTiaoyueLg.st100909, [gcc[level].award.toString()]);
		var content = LanguageString.jifengTiaoyueCh(GlobalConfig.jifengTiaoyueLg.st100910, [gcc[level].level.toString()])
			+ "\n" + vipDesc
			+ LanguageString.jifengTiaoyueCh(GlobalConfig.jifengTiaoyueLg.st100911, [maxMember])
			+ tempAward
			+ LanguageString.jifengTiaoyueCh(GlobalConfig.jifengTiaoyueLg.st100912, [gcc[level].moneyCount.toString()])
		var str = "<font color='#535557' size='16'>" + content + "</font>"
		return str;
	};
	static openCheck() {
		var param = [];
		for (var _i = 0; _i < arguments.length; _i++) {
			param[_i - 0] = arguments[_i];
		}
		return true;
	};
	open() {
		this.m_bg.init(`GuildCreateWin`, GlobalConfig.jifengTiaoyueLg.st100906)
		//this.dialogCloseBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this._OnClick, this);
		this.leftLab.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTap, this);
		this.rightLab.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTap, this);
		this.okBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTap, this);
	};
	close() {
		//	this.dialogCloseBtn.removeEventListener(egret.TouchEvent.TOUCH_TAP, this._OnClick, this)
		this.leftLab.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onTap, this);
		this.rightLab.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onTap, this);
		this.okBtn.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onTap, this);
	};
	private _OnClick(e: egret.TouchEvent) {
		ViewManager.ins().close(this);
	}
	onTap(e) {

		switch (e.currentTarget) {
			case this.okBtn:
				{
					var gcc = GlobalConfig.ins("GuildCreateConfig");
					var dp = gcc[this.selectLevel];
					var vipLv = gcc[dp.level].vipLv;
					if (UserVip.ins().lv < vipLv) {
						UserTips.ins().showTips(GlobalConfig.jifengTiaoyueLg.st100913);
						return;
					}
					if (this.textInput.text == "")
						UserTips.ins().showTips(GlobalConfig.jifengTiaoyueLg.st100914);
					else if (!(GameLogic.ins().actorModel.yb > dp.moneyCount))
						UserTips.ins().showTips(GlobalConfig.jifengTiaoyueLg.st100008);
					else {
						WarnWin.show(LanguageString.jifengTiaoyueCh(GlobalConfig.jifengTiaoyueLg.st100915, [dp.moneyCount, dp.level, this.textInput.text]), () => {
							Guild.ins().sendGuildCreate(this.selectLevel, this.textInput.text);
						}, this);
					}
					break;
				}
			case this.leftLab:
				this.changeSelect(1);
				break;
			case this.rightLab:
				this.changeSelect(2);
				break;
		}
	};
}

ViewManager.ins().reg(GuildCreateWin, LayerManager.UI_Popup);

window["GuildCreateWin"] = GuildCreateWin