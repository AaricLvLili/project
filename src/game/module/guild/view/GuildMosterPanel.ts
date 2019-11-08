class GuildMosterPanel extends eui.Component {

	bossmc: MovieClip;
	staticMc: MovieClip

	start
	index

	public constructor() {
		super();

		this.bossmc = new MovieClip;
		this.bossmc.scaleX = 0.5;
		this.bossmc.scaleY = 0.5;
		this.bossmc.x = 0;
		this.bossmc.y = 0;
		this.addChild(this.bossmc);
		this.staticMc = new MovieClip;
		this.addChild(this.staticMc);
		this.staticMc.y = -60;
		this.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTap, this);
	}


	onTap(e) {
		if (this.start && this.start.robberStart == GuildRobberState.FIGHT) {
			UserTips.ins().showTips(GlobalConfig.jifengTiaoyueLg.st101024);
			return;
		}
		if (GuildRobber.ins().robberChanllge >= GlobalConfig.robberfbconfig.challengeMax) {
			UserTips.ins().showTips(GlobalConfig.jifengTiaoyueLg.st101025);
			return;
		}
		GuildRobber.ins().sendRobberChanger(this.index);
	};
	update(info: RobberStartInfo, p: string) {
		if (info == null) return;
		this.start = info;
		var monster = '';
		monster = GlobalConfig.robberfbconfig.effect[this.start.robberType - 1];
		this.bossmc.loadUrl(ResDataPath.GetMonsterBodyPath("monster" + monster + "_" + DirUtil.get5DirBy8Dir(p) + "s"), true, -1);
		let scale = GlobalConfig.robberfbconfig.effectProportion[this.start.robberType - 1]
		this.bossmc.scaleX = (Number(p) > 4) ? scale : -scale;
		this.bossmc.scaleY = Math.abs(this.bossmc.scaleX);
		this.index = info.pos
		var urlPath = info.robberStart == GuildRobberState.NORMAL ? "ketiaozhan" : "eff_fighting";
		this.staticMc.loadUrl(ResDataPath.GetUIEffePath(urlPath), true, -1);
	};
}
window["GuildMosterPanel"] = GuildMosterPanel