class GuildListItemRender extends eui.ItemRenderer {
	public constructor() {
		super();
		this.skinName = "ApplyItemSkin";
	}
	applyBtn
	numLab
	nameLab
	president
	member
	attrLabel
	label_Limit: eui.Label;
	bg: eui.Image
	public m_Lan1: eui.Label;
	public m_Lan2: eui.Label;

	public createChildren() {
		super.createChildren();
		this.m_Lan1.text = GlobalConfig.jifengTiaoyueLg.st100898;
		this.m_Lan2.text = GlobalConfig.jifengTiaoyueLg.st100899;
	}

	onTap() {
		var info = this.data;
		if (Guild.ins().applyGuilds.indexOf(info.guildID) == -1) {
			if (!GuildWar.ins().OtherOperation(GlobalConfig.jifengTiaoyueLg.st100900)) {
				return
			}
			if (this.data.attr > GameLogic.ins().actorModel.power) {
				UserTips.ins().showTips(GlobalConfig.jifengTiaoyueLg.st100901);
				return;
			}
			this.applyBtn.enabled = false;
			this.applyBtn.label = GlobalConfig.jifengTiaoyueLg.st100902;
			Guild.ins().applyGuilds.push(info.guildID);
			Guild.ins().sendJoinGuild(info.guildID);
		}
	};

	dataChanged() {
		//this.bg.source = "base_100_80_01_png";//this.itemIndex % 2 == 0 ? "ui_bh_bg_bai@15_15_15_15" : "ui_bh_bg_hei@15_15_15_15"
		if (this.data instanceof GuildListInfo) {
			var info = this.data;
			var gc = GlobalConfig.ins("GuildConfig");
			var myPower = GameLogic.ins().actorModel.power;
			var power: string = "";
			if (info && gc) {
				this.numLab.text = info.guildRank + "";
				this.nameLab.textFlow = (new egret.HtmlTextParser()).parser(info.guildName + ("<font color='#0FEE27'>(Lv." + info.guildLevel + ")</font>"));
				this.president.text = info.guildPresident;

				let maxMember: number = (GameServer.serverMergeTime > 0) ? gc.maxHeFuMember[info.guildLevel - 1] : gc.maxMember[info.guildLevel - 1];
				this.member.textColor = info.guildMember < maxMember ? 0x4FBFE2 : 0xf87372;
				this.member.text = info.guildMember + "/" + maxMember;
				this.attrLabel.text = GlobalConfig.jifengTiaoyueLg.st100903 + CommonUtils.overLength(info.totalpower);
				power = CommonUtils.overLength(info.attr).toString();
				this.label_Limit.textFlow = <Array<egret.ITextElement>>[{ text: GlobalConfig.jifengTiaoyueLg.st100809, style: { "textColor": 0xFFB400 } },
				{ text: power, style: { "textColor": (myPower >= info.attr) ? 0xFFB400 : 0xD40303 } }
				];
				if (Guild.ins().applyGuilds.indexOf(info.guildID) > -1) {
					this.applyBtn.enabled = false;
					this.applyBtn.label = GlobalConfig.jifengTiaoyueLg.st100902;
				}
				else {
					this.applyBtn.enabled = true;
					this.applyBtn.label = GlobalConfig.jifengTiaoyueLg.st100905;
				}
			}
		}
	};
	destruct() {
	};
}
window["GuildListItemRender"] = GuildListItemRender