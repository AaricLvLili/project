class BossWin extends BaseEuiPanel implements ICommonWindow {
	public constructor() {
		super();
		this.skinName = "MainWinSkin";
	}
	private commonWindowBg: CommonWindowBg
	public publicBoss: PublicBossPanel;
	public personalBoss: PersonalBossPanel;
	public zsBoss: ZsBossPanel;
	public kfBoss: KfBossPanel;
	public m_HomeBoss: HomeBossPanel;
	public m_SyBossPanel: SyBossPanel;

	initUI() {
		super.initUI();


		this.personalBoss = new PersonalBossPanel();
		this.personalBoss.name = GlobalConfig.jifengTiaoyueLg.st100464;
		this.commonWindowBg.AddChildStack(this.personalBoss);

		this.publicBoss = new PublicBossPanel();
		this.publicBoss.name = GlobalConfig.jifengTiaoyueLg.st100463;
		this.commonWindowBg.AddChildStack(this.publicBoss);

		this.m_HomeBoss = new HomeBossPanel();
		this.m_HomeBoss.name = GlobalConfig.jifengTiaoyueLg.st100467;
		this.commonWindowBg.AddChildStack(this.m_HomeBoss);

		this.zsBoss = new ZsBossPanel();
		this.zsBoss.name = GlobalConfig.jifengTiaoyueLg.st100465;
		this.commonWindowBg.AddChildStack(this.zsBoss);

		this.kfBoss = new KfBossPanel();
		this.kfBoss.name = GlobalConfig.jifengTiaoyueLg.st100466;
		this.commonWindowBg.AddChildStack(this.kfBoss);

		this.m_SyBossPanel = new SyBossPanel();
		this.commonWindowBg.AddChildStack(this.m_SyBossPanel);
	};
	open(...param: any[]) {
		UserBoss.ins().init();
		// this.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTap, this);
		this.AddClick(this, this.onTap);
		this.observe(MessageDef.PUBLIC_BOSS_LIST_DATA, this.updateRedPoint)
		this.observe(MessageDef.KF_BOSS_LIST_DATA, this.updateRedPoint)
		this.observe(MessageDef.FB_COUNT_UPDATE, this.updateRedPoint)
		this.observe(MessageDef.HOMEBOSS_BOSSMSG_UPDATE, this.updateRedPoint)
		this.observe(SyBossEvt.SYBOSS_DATAUPDATE_MSG, this.updateRedPoint);
		this.commonWindowBg.OnAdded(this, param.length ? param[0] : 0)
		this.updateRedPoint();
		ZsBoss.ins().sendGetBossList();
		UserBoss.ins().sendGetVipBossMsg();
		SyBossSproto.ins().sendGetSyBossInitMsg();
		if ((UserBoss.ins().restoreTime + 3 - GameServer.serverTime) <= 0) {
			UserBoss.ins().sendInfo();
			UserBoss.ins().isDoingTimer = false;
		}
	};

	updateRedPoint() {
		this.commonWindowBg.ShowTalRedPoint(1, UserBoss.ins().isCanChalleng())
		this.commonWindowBg.ShowTalRedPoint(0, DailyFubenConfig.isCanChallenge())
		this.commonWindowBg.ShowTalRedPoint(3, ZsBoss.ins().IsRedPoint())
		this.commonWindowBg.ShowTalRedPoint(4, UserBoss.ins().isCanChallengKf())
		this.commonWindowBg.ShowTalRedPoint(2, HomeBossModel.getInstance.checkAllRedPoint());
		this.commonWindowBg.ShowTalRedPoint(5, SyBossModel.getInstance.checkAllRedPoint());

	};
	close() {
		MessageCenter.ins().removeAll(this);
		this.commonWindowBg.OnRemoved();
		this.publicBoss.release();
		this.personalBoss.release();
		this.zsBoss.release();
		this.kfBoss.release();
		this.m_HomeBoss.release();
		this.m_SyBossPanel.release();
		// DisplayUtils.dispose(this);
	};
	onLink(e) {
		WarnWin.show(LanguageString.jifengTiaoyueCh(GlobalConfig.jifengTiaoyueLg.st101694, [GlobalConfig.ins("WorldBossBaseConfig").clearCdCost]), () => {
			ViewManager.ins().close(this);
			UserBoss.ins().sendClearCD();
		}, this);
	};
	onTap(e) {
		switch (e.currentTarget) {
			default:
				if (e.target instanceof eui.Button) {
					var config = e.target.parent['config'];
					switch (e.target.name) {
						//个人boss挑战
						case "pChallenge":
							if (UserFb.ins().getFbDataById(config.id).getCount() <= 0) {
								UserTips.ins().showTips(GlobalConfig.jifengTiaoyueLg.st100468);
							}
							else if (config.zsLevel <= UserZs.ins().lv && config.levelLimit <= GameLogic.ins().actorModel.level) {
								if (UserBag.ins().getSurplusCount() < UserBag.BAG_ENOUGH) {
									BagFullTipsPanel.Open()
								}
								else {
									UserFb.ins().sendChallenge(e.target.parent.data.id);
									ViewManager.ins().close(this);
								}
							}
							else {
								UserTips.ins().showTips(GlobalConfig.jifengTiaoyueLg.st100469);
							}
							break;
						//全民boss挑战
						case "publicChallenge":
							if (UserBoss.ins().challengeCount <= 0 && !e.target.parent.data.challengeing) {
								UserTips.ins().showTips(GlobalConfig.jifengTiaoyueLg.st100470);
							}
							else if (config.zsLevel <= UserZs.ins().lv && config.level <= GameLogic.ins().actorModel.level) {
								UserBoss.ins().sendChallenge(e.target.parent.data.id);
								ViewManager.ins().close(this);
							}
							else {
								UserTips.ins().showTips(GlobalConfig.jifengTiaoyueLg.st100471);
							}
							break;
						case "ZsBoss":
							// this.applyFunc(BossFunc.WORLD_BOSS_CHALLENGE);
							// ViewManager.ins().close(this);
							break;
						case "kfBoss":
							UserBoss.ins().sendKfBossChallenge(e.target.parent.data.id);
							ViewManager.ins().close(this);
							break;
						case "homeBossBtn": {
							let homeModel: HomeBossModel = HomeBossModel.getInstance;
							if (homeModel.isCanBattle()) {
								UserBoss.ins().sendChallenge(e.target.parent.data.id);
								ViewManager.ins().close(this);
							} else {
								UserTips.ins().showTips(GlobalConfig.jifengTiaoyueLg.st100472);
							}
						}
					}
				}
		}
	};
	static openCheck() {
		return Deblocking.Check(DeblockingType.TYPE_05)
	};


	OnBackClick(clickType: number): number {
		return 0
	}

	OnOpenIndex(openIndex: number): boolean {
		if (openIndex == 3) {
			return Deblocking.Check(DeblockingType.TYPE_21)
		}
		else if (openIndex == 4) {
			return Deblocking.Check(DeblockingType.TYPE_20)
		} else if (openIndex == 2) {
			let viplav = UserVip.ins().lv;
			if (viplav < 1) {
				UserTips.ins().showTips(GlobalConfig.jifengTiaoyueLg.st100473);
				return false;
			}
		} else if (openIndex == 5) {
			return Deblocking.Check(DeblockingType.TYPE_75)
		}
		return true
	}
}

ViewManager.ins().reg(BossWin, LayerManager.UI_Main);
window["BossWin"] = BossWin