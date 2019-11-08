class GuildWarRulesWin extends BaseEuiPanel {

    public static LAYER_LEVEL = LayerManager.UI_Popup

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    // RuleTipsSkin.exml
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    private bg: eui.Image
    private mapName: eui.Label
    private attr: eui.Label
    private leftBtn: eui.Button
    private rightBtn: eui.Button
    private closeBtn: eui.Button
    ////////////////////////////////////////////////////////////////////////////////////////////////////

cruIndex
	public constructor() {
		super()
	}

	initUI() {
		this.skinName = "RuleTipsSkin"
	}
	
	open() {
		for (var e = [], t = 0; t < arguments.length; t++) e[t] = arguments[t];
		this.bg.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTap, this), this.attr.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTap, this), this.leftBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTap, this), this.rightBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTap, this), this.cruIndex = GuildWar.ins().getMapLevelInfo().id, this.refushInfo()
	}
	
	close() {
		for (var e = [], t = 0; t < arguments.length; t++) e[t] = arguments[t];
		this.bg.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onTap, this), this.attr.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onTap, this), this.leftBtn.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onTap, this), this.rightBtn.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onTap, this)
	}
	
	refushInfo() {
		var config:any;
		if(GuildWar.ins().guildWarStartType == 1)
			config = GlobalConfig.ins("GuildBattleLevel1");
		else if (GuildWar.ins().guildWarStartType == 2)
			config = GlobalConfig.ins("GuildBattleLevel2");
		else
			config = GlobalConfig.ins("GuildBattleLevel");
		var t = config[this.cruIndex];
		this.mapName.text = t.name, this.attr.textFlow = TextFlowMaker.generateTextFlow(t.help), this.rightBtn.visible = this.cruIndex < 4, this.leftBtn.visible = this.cruIndex > 1
	}

	
	onTap(e) {
		switch (e.currentTarget) {
			case this.leftBtn:
				--this.cruIndex, this.refushInfo();
				break;
			case this.rightBtn:
				++this.cruIndex, this.refushInfo();
				break;
			default:
				ViewManager.ins().close(this)
		}
	}
}
window["GuildWarRulesWin"]=GuildWarRulesWin