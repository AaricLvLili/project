class BossBloodPanelType2 implements IBossBloodPanel {

	private targetNow: BossOwnerInfo
	private m_Context: BossBloodPanel

	private clearSelect: boolean
	private publicBossBaseConfig: any;
	private kuafuBossBaseConfig: any;


	private isFlg: boolean;
	private get clearRole(): any {
		return this.m_Context.clearRole
	}

	private get see(): any {
		return this.m_Context.see
	}

	private get cd(): any {
		return this.m_Context.cd
	}

	private get timeLable(): any {
		return this.m_Context.timeLable
	}
	private get autoClear(): any {
		return this.m_Context.autoClear
	}

	public constructor(context: BossBloodPanel) {
		this.m_Context = context
	}

	DoOpen() {
		this.reliveInfoChange();

		this.see.visible = true
		this.m_Context.seeRewardBtn.visible = !UserBoss.ins().IsXbBoss(GameMap.fbType);//寻宝BOSS屏蔽归属奖励按钮
		this.clearRole.selected = ZsBoss.ins().clearOther;
	}

	private _IsSee() {
		return ZsBoss.ins().isZsBossFb(GameMap.fubenID) || UserBoss.ins().IsPublicBoss(GameMap.fbType)
			|| UserBoss.ins().IsKfBoss(GameMap.fbType) || UserBoss.ins().IsXbBoss(GameMap.fbType) || GameMap.IsWorldBoss()
	}

	//刷新boss目标信息
	OnRefreshTargetInfo() {
		if (!this.targetNow) {
			this.targetNow = new BossOwnerInfo();
			this.targetNow.x = 10;
			this.targetNow.y = 210;
			this.targetNow.top = 151;
			if (Main.isLiuhai) {
				this.targetNow.top = 191;
			}
			this.targetNow.right = 0;
		}
		// var target = UserBoss.ins().GetCurOwnerHandler()
		var target = UserBoss.ins().GetCurOwnerData();
		// var target = (EntityManager.ins().getEntityByHandle(UserBoss.ins().handler));
		if (target && target.actorid != 0) {
			this.targetNow.refushTargetInfo(target);
			this.m_Context.addChild(this.targetNow);
			return
		}

		this._ClearTarget()
	}

	private reliveInfoChange() {
		this.cd.visible = UserBoss.ins().CheckIsDead()
		this._RefreshLabel()
		TimerManager.ins().remove(this._RefreshLabel, this);
		this.autoClear.selected = ZsBoss.ins().autoClear;
		if (this.cd.visible) {
			TimerManager.ins().doTimer(1000, Math.ceil(UserBoss.ins().GetReliveSurplusTime()), this._RefreshLabel, this, this.overTime, this);
		}
	};

	private _UpdateReliveInfo() {
		UserBoss.ins().AutoRelive()
		this.reliveInfoChange()
	}

	private overTime() {
		this.cd.visible = false;
	}

	OnAutoClearCD() {
		if (UserBoss.ins().CheckIsMoreMoney()) {
			if (this.autoClear.selected) {
				if (this.publicBossBaseConfig == null)
					this.publicBossBaseConfig = GlobalConfig.ins("PublicBossBaseConfig");

				if (this.kuafuBossBaseConfig == null)
					this.kuafuBossBaseConfig = GlobalConfig.ins("KuafuBossBaseConfig");

				var reburnPay: number
				if (GameMap.IsPublicBoss())
					reburnPay = this.publicBossBaseConfig.reburnPay;
				else if (GameMap.IsHomeBoss())
					reburnPay = this.publicBossBaseConfig.vipreburnPay;
				else if (GameMap.IsSyBoss()) {
					let config = GlobalConfig.ins("PaidBossBaseConfig")
					reburnPay = config.reburnPay;
				}
				else if (GameMap.IsXbBoss())
					reburnPay = 30;
				else
					reburnPay = this.kuafuBossBaseConfig.reburnPay;

				WarnWin.show(LanguageString.jifengTiaoyueCh(GlobalConfig.jifengTiaoyueLg.st101391, [reburnPay]), () => {
					this.autoClear.selected = true;
					ZsBoss.ins().autoClear = this.autoClear.selected;
					if (this.autoClear.selected) {
						UserTips.ins().showTips(GlobalConfig.jifengTiaoyueLg.st101392);
						// ZsBoss.ins().checkisAutoRelive();
						UserBoss.ins().AutoRelive()
					}
				}, this, () => {
					this.autoClear.selected = false;
				}, this);
			} else {
				ZsBoss.ins().autoClear = this.autoClear.selected;
			}
		} else {
			this.autoClear.selected = false;
			UserTips.ins().showTips(GlobalConfig.jifengTiaoyueLg.st101393);
		}
	}

	_RefreshLabel() {
		this.timeLable.text = LanguageString.jifengTiaoyueCh(GlobalConfig.jifengTiaoyueLg.st101390,[UserBoss.ins().GetReliveSurplusTime()])
	}

	/** 护盾处理*/
	private huDunChange(time: number): void {
		if (this.isFlg) {
			return;
		}
		this.isFlg = true;
		this.m_Context.rectMac.visible = this.m_Context.hudun.visible = true;
		this.m_Context.hudunbloodBar.value = this.m_Context.hudunbloodBar.maximum = 100;
		this.m_Context.huDunDesc.text = GlobalConfig.jifengTiaoyueLg.st101395;
		if (this.targetNow) {//更新玩家信息坐标
			this.targetNow.y = this.m_Context.hudun.visible ? 210 : 150;
		}
		this.m_Context.rectMac.x = this.m_Context.hudunbloodBar.x;
		this.m_Context.rectMac.y = this.m_Context.hudunbloodBar.y;
		this.m_Context.hudunbloodBar.labelDisplay.visible = false;
		this.m_Context.hudunbloodBar.mask = this.m_Context.rectMac;
		var tween: egret.Tween = egret.Tween.get(this.m_Context.rectMac);
		tween.to({ x: this.m_Context.rectMac.x - 210 }, time).call(() => {
			egret.Tween.removeTweens(this.m_Context.rectMac);
			this.m_Context.huDunDesc.text = GlobalConfig.jifengTiaoyueLg.st101382;
			this.isFlg = this.m_Context.hudun.visible = false;
			this.m_Context.hudunbloodBar.labelDisplay.visible = true;
			if (this.targetNow) {//更新玩家信息坐标
				this.targetNow.y = this.m_Context.hudun.visible ? 210 : 150;
			}
			this.m_Context.hudunbloodBar.mask = null;
		});
	}

	OnAddEvent() {
		GameGlobal.MessageCenter.addListener(MessageDef.PUBLIC_BOSS_RELIVE_UPDATE, this._UpdateReliveInfo, this)
		GameGlobal.MessageCenter.addListener(MessageDef.PUBLIC_BOSS_OWNER_CHNAGE, this.OnRefreshTargetInfo, this)
		GameGlobal.MessageCenter.addListener(MessageDef.BOSS_TIME_HUDUN, this.huDunChange, this);
	}

	OnRemoveEvent() {
		GameGlobal.MessageCenter.removeListener(MessageDef.PUBLIC_BOSS_RELIVE_UPDATE, this._UpdateReliveInfo, this)
		GameGlobal.MessageCenter.removeListener(MessageDef.PUBLIC_BOSS_OWNER_CHNAGE, this.OnRefreshTargetInfo, this)
		GameGlobal.MessageCenter.removeListener(MessageDef.BOSS_TIME_HUDUN, this.huDunChange, this);
	}

	OnSeeReward() {
		ViewManager.ins().open(PublicBossRewardPanel, UserBoss.ins().monsterID)
	}

	OnClearCD() {
		if (UserBoss.ins().CheckIsMoreMoney()) {
			ZSBossCDPanel.Show(this.autoClear.selected, () => {
				UserBoss.ins().SendReliveCd()
			})
		}
		else {
			UserTips.ins().showTips(GlobalConfig.jifengTiaoyueLg.st100008);
		}
	}

	ClearData() {
		this._ClearTarget()
	}

	private _ClearTarget() {
		if (this.targetNow && this.targetNow.parent) {
			DisplayUtils.removeFromParent(this.targetNow);
		}
	}
}
window["BossBloodPanelType2"] = BossBloodPanelType2