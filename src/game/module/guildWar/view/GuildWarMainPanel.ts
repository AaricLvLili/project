class GuildWarMainPanel extends BaseView implements ICommonWindowTitle {

	private roleShowPanel: RoleShowPanel
	private redBag: eui.Group
	private surplusLabel: eui.Label
	private surplusTimeLabel: eui.Label
	private rewardList: eui.List
	private getBtn: eui.Button
	private rewardSee: eui.Image
	private play: eui.Button
	private guildName: eui.Label
	private guildOwn: eui.Label
	private openDesc: eui.Label
	private LastSee: eui.Image
	private getSign: eui.Image
	private group: eui.Group;
	private guildBattleConst: any;
	private mc: MovieClip;
	private groupInfo: eui.Group

	windowTitleIconName: string = GlobalConfig.jifengTiaoyueLg.st100920;
	public m_Lan1: eui.Label;

	public constructor() {
		super()
		this.name = GlobalConfig.jifengTiaoyueLg.st100920;
		this.skinName = "GuildWarMainSkin"
		this.rewardList.itemRenderer = ItemBase;
		this.touchEnabled = false;
		this.play.label = GlobalConfig.jifengTiaoyueLg.st100920;
		this.m_Lan1.text = GlobalConfig.jifengTiaoyueLg.st101029;
	}

	public static m_IsShowRedBag: boolean;
	public open(...param: any[]) {
		this.AddClick(this.redBag, this._OnClick)
		this.AddClick(this.getBtn, this._OnClick)
		this.AddClick(this.rewardSee, this._OnClick)
		this.AddClick(this.play, this._OnClick)
		this.AddClick(this.LastSee, this._OnClick)

		GameGlobal.MessageCenter.addListener(MessageDef.GUILDWAR_GETDAY_REWARD, this.refushRewardStatu, this)
		GameGlobal.MessageCenter.addListener(MessageDef.GUILDWAR_REDBAGINFO_CHANGE, this.refushRewardStatu, this)
		GameGlobal.MessageCenter.addListener(MessageDef.GUILDWAR_STARTSTATU_CHANGE, this.refushStartEffect, this)
		GameGlobal.MessageCenter.addListener(MessageDef.GUILD_REWARD_WINNER_INFO, this.refushPanelInfo, this)

		if (this.guildBattleConst == null)
			this.guildBattleConst = GlobalConfig.ins("GuildBattleConst");
		this.rewardList.dataProvider = new eui.ArrayCollection(this.guildBattleConst.occupationAwardShow)
		this.LastSee.visible = !GuildWar.ins().isWatStart

		this.refushPanelInfo()
		this.refushStartEffect()

		GuildReward.ins().SendWinnerInfo(0);

		this._DoUpdate()
		TimerManager.ins().doTimer(1000, 0, this._DoUpdate, this)

		if (GuildWarMainPanel.m_IsShowRedBag) {
			this.ShowRedBagPanel()
		}


	}

	public close() {
		TimerManager.ins().remove(this._DoUpdate, this);
		this.removeObserve();
		this.removeEvents();
		DisplayUtils.dispose(this.mc);
		this.mc = null;
	}

	private _DoUpdate() {
		let guildReward = GuildReward.ins()
		if (guildReward.canSend) {
			this.surplusLabel.text = ""
		} else {
			this.surplusLabel.text = guildReward.getRedBagNum + "/" + guildReward.redBagCount
		}
		this.surplusTimeLabel.text = DateUtils.GetFormatSecond(guildReward.redBagSurplusTime, DateUtils.TIME_FORMAT_1)
	}

	private ShowRedBagPanel() {
		GuildReward.ins().canRod || GuildReward.ins().canSend
			? ViewManager.ins().open(GuildWarRedBagPanel)
			: ViewManager.ins().open(RedBagDetailsWin);
	}

	private _OnClick(e: egret.TouchEvent) {
		switch (e.target) {
			case this.redBag:
				this.ShowRedBagPanel()
				break;
			case this.getBtn:
				ViewManager.ins().open(GetRewardPanel, GlobalConfig.jifengTiaoyueLg.st101026, GlobalConfig.jifengTiaoyueLg.st101027, RewardData.ToRewardDatas(GlobalConfig.ins("GuildBattleDayAward")[GuildReward.ins().rewardDay].award), () => {
					if (!GuildReward.ins().canGetDay) {
						UserTips.ErrorTip(GlobalConfig.jifengTiaoyueLg.st101028);
						return
					}
					GuildReward.ins().SendGetDayaward(0)
				}, true)
				break;
			case this.rewardSee:
				ViewManager.ins().open(GuildWarRewardPanel)
				break;
			case this.play:
				GuildWar.ins().SendJoinWar()
				break;
			case this.LastSee:
				ViewManager.ins().open(GuildWarRewardPanel, 0, 1)
				break;
			default:
				break;
		}
	}

	refushPanelInfo() {
		// GuildWar.ins().isWatStart
		// 	? this.openDesc.text = ""
		// 	: this.openDesc.text = GuildWar.ins().setOpenDesc()
		this.openDesc.text = GuildWar.ins().setOpenDesc()
		this.refushRewardStatu()
		this.refushWinGuild()
	}

	refushStartEffect() {
		UIHelper.SetBtnNormalEffe(this.play, GuildWar.ins().isWatStart)
	}

	refushRewardStatu() {
		this.getSign.visible = GuildReward.ins().getDayReward
		UIHelper.ShowRedPoint(this.getBtn, GuildReward.ins().canGetDay && !GuildReward.ins().getDayReward)
		this.redBag.visible = (GuildReward.ins().getRedBagType == 0) && GuildReward.ins().isHaveRedBag()
	}

	refushWinGuild() {
		var hasGuild = GuildReward.ins().winGuildInfo.guildid > 0;
		// this.guildOwn.visible = hasGuild
		// this.guildName.visible = hasGuild
		this.groupInfo.visible = hasGuild
		this.roleShowPanel.visible = hasGuild
		if (hasGuild) {
			var winInfo = GuildReward.ins().winGuildInfo;
			this.guildName.text = winInfo.guildname
			this.guildOwn.text = winInfo.leadername

			let subRole = new SubRole()
			subRole.parser(winInfo.leaderinfo)

			// this.roleShowPanel.Set(DressType.ARM, subRole)
			// this.roleShowPanel.Set(DressType.ROLE, subRole)
			// this.roleShowPanel.Set(DressType.WING, subRole)
			this.roleShowPanel.creatAnim(subRole);
			if (!this.mc) {
				this.mc = new MovieClip();
			}
			this.mc.scaleX = this.mc.scaleY = 0.6;
			this.mc.loadUrl(ResDataPath.GetUIEffePath("eff_title_tmbz"), true, -1)
			this.group.addChild(this.mc)
		}
	}

	mWindowHelpId?: number = 10
	public UpdateContent(): void {

	}
}

window["GuildWarMainPanel"] = GuildWarMainPanel