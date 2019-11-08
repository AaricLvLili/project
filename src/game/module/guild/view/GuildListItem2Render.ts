class GuildListItem2Render extends eui.ItemRenderer {
	public constructor() {
		super();

		this.skinName = "GuildListItemSkin";
	}
	numLab: eui.Label;
	nameLab
	president
	member

	//icon: eui.Image
	powerLabel: eui.Label

	//private static ICON = ["comp_68_68_03_png", "comp_68_68_04_png", "comp_68_68_05_png", ""]
	public m_Lan1: eui.Label;
	public m_Lan2: eui.Label;

	public createChildren() {
		super.createChildren();
		this.m_Lan1.text = GlobalConfig.jifengTiaoyueLg.st100898;
		this.m_Lan2.text = GlobalConfig.jifengTiaoyueLg.st100899;
	}

	dataChanged() {
		if (this.data instanceof GuildListInfo) {
			var info = this.data;
			var gc = GlobalConfig.ins("GuildConfig");
			if (info && gc) {
				this.nameLab.textFlow = (new egret.HtmlTextParser()).parser(info.guildName + ("<font color='#0FEE27'>(Lv." + info.guildLevel + ")</font>"));
				this.president.text = info.guildPresident;

				let maxMember: number = (GameServer.serverMergeTime > 0) ? gc.maxHeFuMember[info.guildLevel - 1] : gc.maxMember[info.guildLevel - 1];
				this.member.textColor = info.guildMember < maxMember ? 0x535557 : 0xFF4E00;
				this.member.text = info.guildMember + "/" + maxMember;
				this.powerLabel.text = GlobalConfig.jifengTiaoyueLg.st100973 + `${CommonUtils.overLength(info.totalpower)}`;
				// if(info.guildRank <= 3)
				// {
				// 	this.numLab.visible = false;
				// 	this.icon.visible = true;
				// 	// this.icon.source = GuildListItem2Render.ICON[Math.min(info.guildRank, 3)];
				// 	this.icon.source = GuildListItem2Render.ICON[info.guildRank-1];
				// }
				// else
				// {
				// 	this.numLab.visible = true;
				// 	this.icon.visible = false;
				// 	this.numLab.text = info.guildRank + "";
				// }
				this.numLab.visible = true;
				this.numLab.text = info.guildRank + "";

			}
		}
	};
}
window["GuildListItem2Render"] = GuildListItem2Render