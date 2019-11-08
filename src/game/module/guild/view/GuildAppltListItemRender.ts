class GuildAppltListItemRender extends eui.ItemRenderer {
	public constructor() {
		super();
		this.skinName = "MemberApplyItemSkin";
		this.ok.label=GlobalConfig.jifengTiaoyueLg.st101874
		this.cancel.label=GlobalConfig.jifengTiaoyueLg.st101873
	}
	nameLab: ActorName
	attack
	myFace: eui.Component
	public ok: eui.Button;
	public cancel: eui.Button;
	onTap(e) {
		switch (e) {
			case this.ok:
				let maxMember: number = (GameServer.serverMergeTime > 0) ? GlobalConfig.ins("GuildConfig").maxHeFuMember[Guild.ins().guildLv - 1] : GlobalConfig.ins("GuildConfig").maxMember[Guild.ins().guildLv - 1];
				if (Guild.ins().getMemberNum() >= maxMember) {
					UserTips.ins().showTips("|C:0xf87372&T:" + GlobalConfig.jifengTiaoyueLg.st101794 + "|");
					return;
				}
				Guild.ins().sendProcessJoin(this.data.roleID, 1);
				this.removeOne();
				break;
			case this.cancel:
				Guild.ins().sendProcessJoin(this.data.roleID, 0);
				this.removeOne();
				break;
		}
	};
	removeOne() {
		var aps = Guild.ins().applyPlayers;
		for (var index = 0; index < aps.length; index++) {
			var element = aps[index];
			if (element.roleID == this.data.roleID) {
				aps.splice(index, 1);
				Guild.ins().hasApply = aps.length > 0;
				Guild.ins().postGuildApplysInfos();
			}
		}
	};
	dataChanged() {
		if (this.data instanceof GuildApplyInfo) {
			var info = this.data;
			// var name_1 = "<font color='#C2BAA5'>" + info.name + "</font>";
			// name_1 = info.vipLevel > 0 ? ("[VIP" + info.vipLevel + "]") + name_1 : name_1;
			// this.nameLab.textFlow = (new egret.HtmlTextParser).parser(name_1);
			this.nameLab.Set(info.name, info.vipLevel, false, false)
			this.attack.text = GlobalConfig.jifengTiaoyueLg.st100809 + CommonUtils.overLength(info.attack)
			// this.myFace.source = "head_" + info.job + info.sex;
			UIHelper.SetHead(this.myFace, info.job, info.sex)
		}
	};
}
window["GuildAppltListItemRender"] = GuildAppltListItemRender