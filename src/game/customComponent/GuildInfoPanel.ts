class GuildInfoPanel extends BaseView implements ICommonWindowTitle {
	public constructor() {
		super();
		this.skinName="GuildInfoSkin";
	}

	userGuild:Guild
	checkJoin: eui.Button
	lbchange: eui.Button;
	list
	// eff
	conBtn
	myCon
	guildName
	guildLevel
	guildMoney
	notice
	guildMember
	public guildName0: eui.Label;
	public m_Lan1: eui.Label;
	public m_Lan2: eui.Label;
	public m_Lan3: eui.Label;
	public m_Lan4: eui.Label;
	public m_Lan5: eui.Label;
	public m_Lan6: eui.Label;
	public m_Lan7: eui.Label;

	childrenCreated() {
		this.userGuild = Guild.ins();
		// this.checkJoin.textFlow = (new egret.HtmlTextParser).parser("<a href=\"event:\"><u>" + this.checkJoin.text + "</u></a>");
		// this.checkJoin.touchEnabled = true;
		this.list.itemRenderer = GuildMemberItem1Render;
		// this.eff = new MovieClip;
		// this.eff.loadUrl(ResDataPath.GetUIEffePath("chargeff1"), true);
		// this.eff.x = this.checkJoin.x - 12;
		// this.eff.y = this.checkJoin.y - 8;
		// this.eff.scaleX = 0.7;

		// 这里修改为带下划线的文字
		// this.lbchange.textFlow = (new egret.HtmlTextParser).parser("<u>修改</u>")
		this.guildName0.text = GlobalConfig.jifengTiaoyueLg.st100896;
		this.m_Lan1.text = GlobalConfig.jifengTiaoyueLg.st100923;
		this.m_Lan2.text = GlobalConfig.jifengTiaoyueLg.st100899;
		this.m_Lan3.text = GlobalConfig.jifengTiaoyueLg.st100924;
		this.m_Lan4.text = GlobalConfig.jifengTiaoyueLg.st100925;
		this.m_Lan5.text = GlobalConfig.jifengTiaoyueLg.st100926;
		this.m_Lan6.text = GlobalConfig.jifengTiaoyueLg.st100927;
		this.lbchange.label = GlobalConfig.jifengTiaoyueLg.st100928;
		this.m_Lan7.text = GlobalConfig.jifengTiaoyueLg.st100929;
		this.checkJoin.label = GlobalConfig.jifengTiaoyueLg.st100930;
		this.conBtn.label = GlobalConfig.jifengTiaoyueLg.st100931;

	};
	open() {
		var param = [];
		for (var _i = 0; _i < arguments.length; _i++) {
			param[_i - 0] = arguments[_i];
		}
		this.checkJoin.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onLinkApply, this);
		this.lbchange.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onLinkChange, this);
		this.conBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTap, this);
		MessageCenter.addListener(Guild.ins().postGuildInfo, this.onGuildInit, this);
		MessageCenter.addListener(Guild.ins().postGuildMembers, this.updateMember, this);
		MessageCenter.addListener(Guild.ins().postMyGuildInfo, this.updateMyInfo, this);
		MessageCenter.addListener(Guild.ins().postChangeNotice, this.onGuildInit, this);
		MessageCenter.addListener(Guild.ins().postGuildMoney, this.updateGuild, this);
		MessageCenter.addListener(Guild.ins().postGuildApplysInfos, this.updateApplys, this);
		Guild.ins().sendGuildInfo();
		this.updateApplys();
		this.updateMyInfo();
	};
	close() {
		var param = [];
		for (var _i = 0; _i < arguments.length; _i++) {
			param[_i - 0] = arguments[_i];
		}
		this.checkJoin.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onLinkApply, this);
		this.lbchange.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onLinkChange, this);
		this.conBtn.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onTap, this);
		// DisplayUtils.removeFromParent(this.eff);
		MessageCenter.ins().removeAll(this);
	};
	onTap(e) {
		switch (e.currentTarget) {
			case this.conBtn:
				ViewManager.ins().open(GuildConWin);
				break;
		}
	};
	updateMyInfo() {
		this.myCon.text = this.userGuild.myCon + "";
		this.checkJoin.visible = this.userGuild.myOffice >= GuildOffice.GUILD_FUBANGZHU;
		this.lbchange.visible = this.userGuild.myOffice >= GuildOffice.GUILD_FUBANGZHU;
	};
	onGuildInit() {
		this.updateGuild();
	};
	updateGuild() {
		this.guildName.text = this.userGuild.guildName;
		this.guildLevel.text = this.userGuild.guildLv.toString();
		this.guildMoney.text = this.userGuild.money.toString();
		this.notice.text = this.userGuild.notice;
	};
	updateMember() {
		var gc = GlobalConfig.ins("GuildConfig");
		let maxMember: number = (GameServer.serverMergeTime > 0) ? gc.maxHeFuMember[Guild.ins().guildLv - 1] : gc.maxMember[Guild.ins().guildLv - 1];
		this.guildMember.text = this.userGuild.getMemberNum() + "/" + maxMember;
		this.list.dataProvider = new eui.ArrayCollection(this.userGuild.getGuildMembers(1));
	};
	onLinkChange() {
		ViewManager.ins().open(GuildNoticeWin);
	};
	onLinkApply() {
		ViewManager.ins().open(GuildApplyListWin);
	};
	updateApplys() {
		UIHelper.ShowRedPoint(this.checkJoin, this.userGuild.hasApplys())
		// if (this.userGuild.hasApplys()) {
		// 	this.checkJoin.parent.addChildAt(this.eff, this.getChildIndex(this.checkJoin));
		// 	this.eff.play(-1);
		// }
		// else
		// 	DisplayUtils.removeFromParent(this.eff);
	};

	windowTitleIconName?: string = GlobalConfig.jifengTiaoyueLg.st100896
	UpdateContent(): void {

	}
}
window["GuildInfoPanel"] = GuildInfoPanel