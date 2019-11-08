class GuildIconRule extends RuleIconBase {
	public constructor(t) {
		super(t)

		this.updateMessage = [
			GameLogic.ins().postLevelChange,
			GuildFB.ins().postGuildFubenInfo,
			Guild.ins().postGuildInfo,
			GuildRobber.ins().postGuildRobberInfo
		];
	}


	checkShowIcon() {
		return true;
	};
	checkShowRedPoint() {
		// if (Guild.ins().myOffice >= GuildOffice.GUILD_FUBANGZHU && Guild.ins().hasApplys())
		// 	return 1;
		// if (GuildFB.ins().hasbtn())
		// 	return 1;
		// if ((GameLogic.ins().actorModel.guildID == undefined || GameLogic.ins().actorModel.guildID == 0) && GameLogic.ins().actorModel.level > 69)
		// 	return 1;
		// if (GuildRobber.ins().hasbtn())
		// 	return 1;
		// return 0;
		return Deblocking.IsRedDotGuildBtn()
	};
	tapExecute() {
		if (GameLogic.ins().actorModel.level >= GlobalConfig.ins("GuildConfig").openLevel) {
			if (GameLogic.ins().actorModel.guildID == undefined || GameLogic.ins().actorModel.guildID == 0)
				ViewManager.ins().open(GuildApplyWin);
			else
				ViewManager.ins().open(GuildMap);
		}
		else {
			UserTips.ins().showTips(LanguageString.jifengTiaoyueCh(GlobalConfig.jifengTiaoyueLg.st101438,[GlobalConfig.ins("GuildConfig").openLevel]));
		}
	};
}
window["GuildIconRule"]=GuildIconRule