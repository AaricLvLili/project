class GuileWarReliveWin extends BaseEuiPanel {

	public static LAYER_LEVEL = LayerManager.UI_Popup
	////////////////////////////////////////////////////////////////////////////////////////////////////
	// SwitchCDSkin.exml
	////////////////////////////////////////////////////////////////////////////////////////////////////
	private background: eui.Image
	private killName: eui.Label
	private guildName: eui.Label
	private mapName: eui.Label
	private timeDown: eui.Label
	private closeBtn: eui.Button
	////////////////////////////////////////////////////////////////////////////////////////////////////

	type
	defaultStr
	s
	private languageTxt:eui.Label;
	private languageTxt0:eui.Label;
	private languageTxt1:eui.Label;

	public constructor() {
		super()
	}

	initUI() {
		this.skinName = "SwitchCDSkin"
		this.languageTxt.text = GlobalConfig.jifengTiaoyueLg.st101587;
		this.languageTxt0.text = GlobalConfig.jifengTiaoyueLg.st101588 + "：";
		this.languageTxt1.text = GlobalConfig.jifengTiaoyueLg.st100367;
	}

	open() {
		for (var e = [], t = 0; t < arguments.length; t++) e[t] = arguments[t];
		switch (this.type = e[0], this.type) {
			case 1:
				this.currentState = "switch", this.defaultStr = GlobalConfig.jifengTiaoyueLg.st101582, this.s = GuildWar.ins().getCdByType(this.type);
				break;
			case 2:
				this.currentState = "revive", this.defaultStr = GlobalConfig.jifengTiaoyueLg.st101583, this.s = e[1];
				break;
			case 3:
				this.currentState = "exit", this.defaultStr = GlobalConfig.jifengTiaoyueLg.st101584, this.s = GuildWar.ins().getCdByType(this.type)
		}
		this.closeBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTap, this), this.timeDown.text = "" + this.s + this.defaultStr, TimerManager.ins().remove(this.updateCloseBtnLabel, this), TimerManager.ins().doTimer(1e3, this.s, this.updateCloseBtnLabel, this), this.refushMapInfo()
	}

	close() {
		for (var e = [], t = 0; t < arguments.length; t++) e[t] = arguments[t];
		this.closeBtn.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onTap, this), TimerManager.ins().remove(this.updateCloseBtnLabel, this), 1 != this.type && (GuildWar.ins().GetKillName())
	}

	refushMapInfo() {
		1 == this.type ? this.mapName.text = GuildWar.ins().getNextMapName() : 2 == this.type && (this.killName.text = LanguageString.jifengTiaoyueCh(GlobalConfig.jifengTiaoyueLg.st101585, [GuildWar.ins().GetKillName()]), this.guildName.text = GlobalConfig.jifengTiaoyueLg.st101586 + "：" + GuildWar.ins().GetKillGuild() + " ")
	}

	updateCloseBtnLabel() {
		this.s--
		if (this.s <= 0) {
			1 == this.type && GuildWar.ins().SendNextMap()
			2 == this.type && ViewManager.ins().close(GuileWarReliveWin);
			3 == this.type && (GuildWar.ins().SendExitFb(), ViewManager.ins().close(GuileWarReliveWin))
		}
		this.timeDown.text = "" + this.s + this.defaultStr
	}

	onTap(e) {
		switch (e.currentTarget) {
			case this.closeBtn:
				ViewManager.ins().close(GuileWarReliveWin)
		}
	}
}
window["GuileWarReliveWin"] = GuileWarReliveWin