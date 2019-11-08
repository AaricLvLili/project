class GuildMemberItem2Render extends eui.ItemRenderer {
	public constructor() {
		super();
	}

	impeachBtn
	demiseBtn
	downBtn
	kickBtn
	appointBtn
	nameLab
	conLab
	attack
	face: eui.Component
	onLine
	group1
	group2
	group3

	public createChildren() {
		super.createChildren();
		this.impeachBtn.label = GlobalConfig.jifengTiaoyueLg.st100963;
		this.demiseBtn.label = GlobalConfig.jifengTiaoyueLg.st100964;
		this.downBtn.label = GlobalConfig.jifengTiaoyueLg.st100965;
		this.kickBtn.label = GlobalConfig.jifengTiaoyueLg.st100966;
		this.appointBtn.label = GlobalConfig.jifengTiaoyueLg.st100967;
	}

	onTap(e) {
		var info = this.data;
		var roleID = info.roleID;
		switch (e) {
			case this.impeachBtn://弹劾
				if (!GuildWar.ins().OtherOperation(GlobalConfig.jifengTiaoyueLg.st100968)) {
					return
				}
				WarnWin.show(LanguageString.jifengTiaoyueCh(GlobalConfig.jifengTiaoyueLg.st101509, [GlobalConfig.ins("GuildConfig").impeachCost]), function () {
					if (GameLogic.ins().actorModel.yb > GlobalConfig.ins("GuildConfig").impeachCost) {
						Guild.ins().sendDemise();
					}
					else
						UserTips.ins().showTips(GlobalConfig.jifengTiaoyueLg.st100008);
				}, this);
				break;
			case this.demiseBtn://禅让
				if (!GuildWar.ins().OtherOperation(GlobalConfig.jifengTiaoyueLg.st100969)) {
					return
				}
				WarnWin.show(GlobalConfig.jifengTiaoyueLg.st101510 + "[" + info.name + "]", function () {
					Guild.ins().sendChangeOffice(roleID, GuildOffice.GUILD_BANGZHU);
				}, this);
				break;
			case this.downBtn://免除
				WarnWin.show(LanguageString.jifengTiaoyueCh(GlobalConfig.jifengTiaoyueLg.st101511, [info.name]), function () {
					Guild.ins().sendChangeOffice(roleID, GuildOffice.GUILD_MEMBER);
				}, this);
				break;
			case this.kickBtn://踢出
				WarnWin.show(LanguageString.jifengTiaoyueCh(GlobalConfig.jifengTiaoyueLg.st101512, [info.name]), function () {
					Guild.ins().sendKick(roleID);
				}, this);
				break;
			case this.appointBtn://任命
				WarnWin.show(LanguageString.jifengTiaoyueCh(GlobalConfig.jifengTiaoyueLg.st101513, [info.name]), function () {
					if (Guild.ins().canAppointFHZ()) {
						Guild.ins().sendChangeOffice(roleID, GuildOffice.GUILD_FUBANGZHU);
					}
					else
						UserTips.ins().showTips(GlobalConfig.jifengTiaoyueLg.st100970);
				}, this);
				break;
		}
	};
	dataChanged() {
		if (this.data instanceof GuildMemberInfo) {
			var info = this.data;
			this.nameLab.textFlow = new egret.HtmlTextParser().parser("[" + GuildLanguage.guildOffice(info.office) + "]" + "<font color='#535557'>" + info.name + "</font>");
			this.conLab.text = GlobalConfig.jifengTiaoyueLg.st100971 + info.contribution;
			this.attack.text = GlobalConfig.jifengTiaoyueLg.st100809 + info.attack;
			// this.face.source = "head_" + info.job + info.sex;
			UIHelper.SetHead(this.face, info.job, info.sex)
			var downTime = 0;
			if (info.downTime > 0) {
				downTime = GameServer.serverTime - info.downTime;
				this.onLine.textFlow = new egret.HtmlTextParser().parser("<font color='#f87372'>" + DateUtils.getFormatBySecond(downTime, 7) + GlobalConfig.jifengTiaoyueLg.st101513 + "</font>");
			}
			else
				this.onLine.textFlow = new egret.HtmlTextParser().parser("<font color='#008f22'>" + GlobalConfig.jifengTiaoyueLg.st100972 + "</font>");
			this.group1.visible = false;
			this.group2.visible = false;
			this.group3.visible = false;
			var myOfiice = Guild.ins().myOffice;
			this.impeachBtn.visible = downTime >= 432000; //5天的秒数
			switch (myOfiice) {
				case 6:
					{
						if (info.office == 6)
							break;
						else if (info.office == 5) {
							this.group2.visible = true;
						}
						else {
							this.group3.visible = true;
							this.appointBtn.visible = true;
						}
					}
					break;
				case 5:
					if (info.office == 6) {
						this.group1.visible = true;
					}
					else if (info.office == 5)
						break;
					else {
						this.group3.visible = true;
						this.appointBtn.visible = false;
					}
					break;
				case 4:
				case 3:
				case 2:
					if (info.office == 6)
						this.group1.visible = true;
					break;
				default:
					break;
			}
		}
	};
}
window["GuildMemberItem2Render"] = GuildMemberItem2Render