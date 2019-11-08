/**跨服争霸view*/
class KFguildWarMainPanel extends BaseView implements ICommonWindowTitle {

	private roleShowPanel: RoleShowPanel;
	private redBag: eui.Group;
	private surplusLabel: eui.Label;
	private surplusTimeLabel: eui.Label;
	private rewardList: eui.List;
	private getBtn: eui.Button;
	private rewardSee: eui.Image;
	private play: eui.Button;
	private guildName: eui.Label;
	private guildOwn: eui.Label;
	private openDesc: eui.Label;
	private LastSee: eui.Image;
	private getSign: eui.Image;
	private groupingBtn: eui.Button;
	private group: eui.Group;
	private guildBattleConst: any;
	private mc: MovieClip;
	private groupInfo: eui.Group

	windowTitleIconName: string = GlobalConfig.jifengTiaoyueLg.st101045;
	public m_Lan1: eui.Label;

	public constructor() {
		super()
		this.name = GlobalConfig.jifengTiaoyueLg.st101045;
		this.skinName = "KFguildWarMainSkin";
		this.rewardList.itemRenderer = ItemBase;
		this.touchEnabled = false;
		this.m_Lan1.text = GlobalConfig.jifengTiaoyueLg.st101029;
		this.play.label = GlobalConfig.jifengTiaoyueLg.st101045;
	}

	public static m_IsShowRedBag: boolean;
	public open(...param: any[]) {
		this.AddClick(this.redBag, this._OnClick);
		this.AddClick(this.getBtn, this._OnClick);
		this.AddClick(this.rewardSee, this._OnClick);
		this.AddClick(this.play, this._OnClick);
		this.AddClick(this.LastSee, this._OnClick);
		this.AddClick(this.groupingBtn, this._OnClick);

		GameGlobal.MessageCenter.addListener(MessageDef.GUILDWAR_GETDAY_REWARD, this.refushRewardStatu, this);
		GameGlobal.MessageCenter.addListener(MessageDef.GUILDWAR_REDBAGINFO_CHANGE, this.refushRewardStatu, this);
		GameGlobal.MessageCenter.addListener(MessageDef.GUILDWAR_STARTSTATU_CHANGE, this.refushStartEffect, this);
		GameGlobal.MessageCenter.addListener(MessageDef.GUILD_REWARD_WINNER_INFO, this.refushPanelInfo, this);

		if (this.guildBattleConst == null)
			this.guildBattleConst = GlobalConfig.ins("GuildBattleConst2");
		this.rewardList.dataProvider = new eui.ArrayCollection(this.guildBattleConst.occupationAwardShow);
		this.LastSee.visible = !GuildWar.ins().kFisWatStart;

		this.refushPanelInfo();
		this.refushStartEffect();

		GuildReward.ins().SendWinnerInfo(2);

		this._DoUpdate();
		TimerManager.ins().doTimer(1000, 0, this._DoUpdate, this);

		if (KFguildWarMainPanel.m_IsShowRedBag) {
			this.ShowRedBagPanel();
		}


	}

	public close() {
		TimerManager.ins().remove(this._DoUpdate, this)
		this.removeObserve();
		this.removeEvents();
		DisplayUtils.dispose(this.mc);
		this.mc = null;
	}

	private _DoUpdate() {
		let guildReward = GuildReward.ins()
		if (guildReward.canSend) {
			this.surplusLabel.text = "";
		} else {
			this.surplusLabel.text = guildReward.getRedBagNum + "/" + guildReward.redBagCount;
		}
		this.surplusTimeLabel.text = DateUtils.GetFormatSecond(guildReward.redBagSurplusTime, DateUtils.TIME_FORMAT_1);
	}

	private ShowRedBagPanel() {
		GuildReward.ins().canRod || GuildReward.ins().canSend
			? ViewManager.ins().open(GuildWarRedBagPanel)
			: ViewManager.ins().open(RedBagDetailsWin);
	}

	private _OnClick(e: egret.TouchEvent) {
		switch (e.target) {
			case this.redBag:
				this.ShowRedBagPanel();
				break;
			case this.getBtn:
				ViewManager.ins().open(GetRewardPanel, GlobalConfig.jifengTiaoyueLg.st101026, GlobalConfig.jifengTiaoyueLg.st101027, RewardData.ToRewardDatas(GlobalConfig.ins("GuildBattleDayAward2")[GuildReward.ins().kFrewardDay].award), () => {
					if (!GuildReward.ins().canKfGetDay) {
						UserTips.ErrorTip(GlobalConfig.jifengTiaoyueLg.st101046);
						return
					}
					GuildReward.ins().SendGetDayaward(GuildReward.ins().kFrewardType);
				}, true)
				break;
			case this.rewardSee:
				ViewManager.ins().open(KFguildWarRewardBgWin);
				break;
			case this.play:
				GuildWar.ins().SendKFjoinWar();
				break;
			case this.LastSee:
				ViewManager.ins().open(KFlastFightingBgWin);
				break;
			case this.groupingBtn:
				ViewManager.ins().open(KFguildGroupingWin);
				break;
			default:
				break;
		}
	}

	public refushPanelInfo() {
		// if(GuildWar.ins().kFisWatStart)
		// {
		// 	this.openDesc.text = "";
		// }
		// else
		// {
		// 	this.openDesc.text = GuildWar.ins().setAllKFOpenDesc();
		// }
		this.openDesc.text = GuildWar.ins().setAllKFOpenDesc();
		this.refushRewardStatu();
		this.refushWinGuild();
	}

	/**跨服争霸按钮开始特效*/
	public refushStartEffect() {
		UIHelper.SetBtnNormalEffe(this.play, GuildWar.ins().kFisWatStart)
	}

	/**刷新红包和每日奖励显示*/
	public refushRewardStatu() {
		this.getSign.visible = GuildReward.ins().getKfDayReward;
		UIHelper.ShowRedPoint(this.getBtn, GuildReward.ins().canKfGetDay && !GuildReward.ins().getKfDayReward);
		this.redBag.visible = (GuildReward.ins().getRedBagType > 0) && GuildReward.ins().isHaveRedBag();
	}

	/**刷新获胜公会信息显示*/
	public refushWinGuild() {
		var hasGuild = GuildReward.ins().winGuildInfo.guildid > 0;
		// this.guildOwn.visible = hasGuild;
		// this.guildName.visible = hasGuild;
		this.groupInfo.visible = hasGuild
		this.roleShowPanel.visible = hasGuild;
		if (hasGuild) {
			var winInfo = GuildReward.ins().winGuildInfo;
			this.guildName.text = winInfo.guildname;
			this.guildOwn.text = winInfo.leadername;

			let subRole = new SubRole();
			subRole.parser(winInfo.leaderinfo);

			// this.roleShowPanel.Set(DressType.ARM, subRole);
			// this.roleShowPanel.Set(DressType.ROLE, subRole);
			// this.roleShowPanel.Set(DressType.WING, subRole);
			this.roleShowPanel.creatAnim(subRole);
			if (!this.mc) {
				this.mc = new MovieClip();
			}
			this.mc.scaleX=this.mc.scaleY=0.6;
			this.mc.loadUrl(ResDataPath.GetUIEffePath("eff_title_kfbz"), true, -1)
			this.group.addChild(this.mc)
		}
	}

	mWindowHelpId?: number = 10;
	public UpdateContent(): void {

	}
}
window["KFguildWarMainPanel"] = KFguildWarMainPanel