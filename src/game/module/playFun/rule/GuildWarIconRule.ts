class GuildWarIconRule extends RuleIconBase {
	public constructor(t) {
		super(t)
		this.updateMessage = [
			MessageDef.GUILDWAR_STARTSTATU_CHANGE
		]
	}

	checkShowIcon() {
		if (GuildWar.ins().guildWarStartType == undefined || GuildWar.ins().guildWarStartType == 0) {
			this.tar.icon = "fun_tmzb_png";
			return GuildWar.ins().getIsShowGuildWarBtn();
		}
		else {
			this.tar.icon = "fun_kfzb_png";
			return GuildWar.ins().getIsShowKfGuildWarBtn();
		}
	}

	getEffName(e) {
		this.effX = 145
		this.effY = 41
		return "eff_main_icon03"
	}

	tapExecute() {
		if (!GameGlobal.actorModel.HasGuild()) {
			if (GuildWar.ins().guildWarStartType && GuildWar.ins().guildWarStartType > 0)
				UserTips.ErrorTip("加入公会后才能参与跨服争霸活动");
			else
				UserTips.ErrorTip("加入公会后才能参与遗迹争霸活动");
		} else {
			ViewManager.ins().open(GuildMap)
			TimerManager.ins().doTimer(100, 1, () => {
				let index = (GuildWar.ins().guildWarStartType > 0) ? 1 : 0;
				ViewManager.ins().open(GuildWarMainBgWin, index);
			}, this)
		}
	}
}
window["GuildWarIconRule"]=GuildWarIconRule