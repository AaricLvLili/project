class GuildMap extends BaseEuiPanel {
	public constructor() {
		super();
	}
	list
	closeBtn
	showBtn
	bossBtn: eui.Button
	guildWarReward: eui.Button
	guildWarReward1: eui.Button
	guildWarReward2: eui.Button
	celebrityBtn
	chatBtn
	robberary
	// redPoint0
	// redPoint1
	rankBg
	public nameIcon: eui.Label;
	public manageBtn: eui.Button;
	public practiseBtn: eui.Button;
	public shopBtn: eui.Button;
	public cityBtn: eui.Button;
	public activityBtn: eui.Button;
	public m_Lan1: eui.Label;

	initUI() {
		super.initUI()
		this.skinName = "GuildSkin";
		this.list.itemRenderer = GuildMapMemberItemRender;

		this.nameIcon.text = GlobalConfig.jifengTiaoyueLg.st100896;
		(this.manageBtn.getChildAt(1) as eui.Button).label = GlobalConfig.jifengTiaoyueLg.st100917;
		(this.practiseBtn.getChildAt(1) as eui.Button).label = GlobalConfig.jifengTiaoyueLg.st100918;
		(this.shopBtn.getChildAt(1) as eui.Button).label = GlobalConfig.jifengTiaoyueLg.st100919;
		(this.cityBtn.getChildAt(1) as eui.Button).label = GlobalConfig.jifengTiaoyueLg.st100920;
		(this.activityBtn.getChildAt(1) as eui.Button).label = GlobalConfig.jifengTiaoyueLg.st100921;
		this.m_Lan1.text=GlobalConfig.jifengTiaoyueLg.st100922;
	};
	static openCheck() {
		var param = [];
		for (var _i = 0; _i < arguments.length; _i++) {
			param[_i - 0] = arguments[_i];
		}
		return true;
	};
	open() {
		var param = [];
		for (var _i = 0; _i < arguments.length; _i++) {
			param[_i - 0] = arguments[_i];
		}
		this.closeBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTap, this);
		this.showBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTap, this);
		this.manageBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTap, this);
		this.practiseBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTap, this);
		this.activityBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTap, this);
		this.shopBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTap, this);
		this.celebrityBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTap, this);
		this.cityBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTap, this);
		this.chatBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTap, this);
		this.bossBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTap, this);
		this.guildWarReward.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTap, this);
		this.guildWarReward1.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTap, this);
		this.guildWarReward2.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTap, this);
		MessageCenter.addListener(Guild.ins().postGuildApplysInfos, this.updateApplys, this);
		MessageCenter.addListener(Guild.ins().postGuildTaskUpdate, this.updateRedpoint, this);
		MessageCenter.addListener(GuildFB.ins().postGuildFubenInfo, this.updateRedpoint, this);
		MessageCenter.addListener(Guild.ins().postGuildMembers, this.updateList, this);
		MessageCenter.addListener(GuildRobber.ins().postGuildRobberInfo, this.updateRobber, this);

		GameGlobal.MessageCenter.addListener(MessageDef.GUILDWAR_REDBAGINFO_CHANGE, this.guildWarPointChange, this);
		GameGlobal.MessageCenter.addListener(MessageDef.GUILD_REWARD_UPDATE_DISP_INFO, this.guildWarPointChange, this);
		GameGlobal.MessageCenter.addListener(MessageDef.GUILDWAR_SENDREWARD_SUCCESS, this.guildWarPointChange, this);

		Guild.ins().sendApplyInfos();
		Guild.ins().sendGuildMembers();
		this.updateRedpoint();
		// if (GuildRobber.ins().isUpdateRobber) {
		// GuildRobber.ins().isUpdateRobber = false;
		GuildRobber.ins().sendRobberInfo();
		// }
		this.updateRobber();
		this.guildWarPointChange();
	};
	close() {
		var param = [];
		for (var _i = 0; _i < arguments.length; _i++) {
			param[_i - 0] = arguments[_i];
		}
		this.closeBtn.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onTap, this);
		this.showBtn.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onTap, this);
		this.manageBtn.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onTap, this);
		this.practiseBtn.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onTap, this);
		this.activityBtn.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onTap, this);
		this.shopBtn.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onTap, this);
		this.celebrityBtn.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onTap, this);
		this.cityBtn.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onTap, this);
		this.chatBtn.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onTap, this);
		this.bossBtn.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onTap, this);
		this.guildWarReward.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onTap, this);
		this.guildWarReward1.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onTap, this);
		this.guildWarReward2.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onTap, this);
		this.closeMonster();
		MessageCenter.ins().removeAll(this);

		//UIView2.CloseNav(UIView2.NAV_GUILD)
	};
	//公会强盗
	updateRobber() {
		this.closeMonster();
		let list = GuildRobber.ins().GetRobberList();
		for (let info of list) {
			if (info == null) continue;
			if (info.robberStart != GuildRobberState.DEAD) {
				var panel = new GuildMosterPanel();
				let index = info.pos - 1
				let config = GlobalConfig.robberfbconfig.point[index];
				if (config) {
					panel.x = config[0];
					panel.y = config[1];
					panel.update(info, config[2]);
					this.addChild(panel);
					this.robberary.push(panel);
				}
				else {
					Main.errorBack("GuildMap updateRobber config=null,info.pos=" + info.pos);
				}

			}
		}
	};
	closeMonster() {
		if (this.robberary)
			for (var i = 0; i < this.robberary.length; i++) {
				var panel = this.robberary[i];
				panel.parent.removeChild(panel);
			}
		this.robberary = [];
	};
	updateApplys() {
		UIHelper.ShowRedPoint(this.manageBtn.getChildByName("btn"), Guild.ins().hasApplys())
	};
	updateRedpoint() {
		UIHelper.ShowRedPoint(this.activityBtn.getChildByName("btn"), GuildFB.ins().hasbtn() || Guild.ins().IsTaskRedPoint())
	};
	guildWarPointChange() {
		UIHelper.ShowRedPoint(this.cityBtn.getChildByName("btn"), GuildReward.ins().IsShowRedPoint());
		this.guildWarReward.visible = GuildReward.ins().canSendReward;
		this.guildWarReward1.visible = GuildReward.ins().canSendReward1;
		this.guildWarReward2.visible = GuildReward.ins().canSendReward2;
	}
	updateList() {
		this.list.dataProvider = new eui.ArrayCollection(Guild.ins().getGuildMembers(2));
	};

	onTap(e) {
		switch (e.currentTarget) {
			case this.closeBtn:
				ViewManager.ins().close(GuildMap);
				break;
			case this.showBtn:
				this.list.visible = !this.list.visible;
				this.rankBg.visible = this.list.visible;
				break;
			case this.practiseBtn:
				ViewManager.ins().open(GuildSkillWin);
				break;
			case this.activityBtn:
				ViewManager.ins().open(GuildActivityWin);
				break;
			case this.manageBtn:
				ViewManager.ins().close(GuildMap);
				ViewManager.ins().open(GuildWin);
				break;
			case this.cityBtn:
				ViewManager.ins().open(GuildWarMainBgWin);
				break;
			case this.celebrityBtn:
				UserTips.ins().showTips(GlobalConfig.jifengTiaoyueLg.st100916);
				break;
			case this.shopBtn:
				ViewManager.ins().open(GuildShopWin)
				break;
			case this.bossBtn:
				// if (!Deblocking.Check(DeblockingType.TYPE_18)) {
				// 	return
				// }
				// if (GuildBoss.ins().IsOpen()) {
				// 	ViewManager.ins().open(GuildBossReadyPanel)
				// } else {
				// 	ViewManager.ins().open(GuildBossCallPanel)
				// }
				UserTips.ins().showTips(GlobalConfig.jifengTiaoyueLg.st100916);
				break;
			case this.guildWarReward:
				ViewManager.ins().open(SelectMemberRewardWin, 0)
				break;
			case this.guildWarReward1:
				ViewManager.ins().open(SelectMemberRewardWin, 1)
				break;
			case this.guildWarReward2:
				ViewManager.ins().open(SelectMemberRewardWin, 2)
				break;
			case this.chatBtn:
				// ViewManager.ins().open(ChatWin);
				console.log("-------------  ViewManager.ins().open(ChatWin);")
				break;
		}
	};
}


ViewManager.ins().reg(GuildMap, LayerManager.UI_Main);

window["GuildMap"] = GuildMap