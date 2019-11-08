class BossBloodPanelType1 implements IBossBloodPanel {

	private targetNow: BossTargetInfo
	protected m_Context: BossBloodPanel

	private remainM: number

	private get clearRole(): any {
		return this.m_Context.clearRole
	}

	private get see(): any {
		return this.m_Context.see
	}

	private get hudun(): any {
		return this.m_Context.hudun
	}

	private get hudunbloodBar(): any {
		return this.m_Context.hudunbloodBar
	}

	protected get cd(): any {
		return this.m_Context.cd
	}

	protected get timeLable(): any {
		return this.m_Context.timeLable
	}
	private get autoClear(): any {
		return this.m_Context.autoClear
	}

	public constructor(context: BossBloodPanel) {
		this.m_Context = context
	}

	DoOpen() {
		this.huDunChange();

		this.reliveInfoChange(false);

		this.see.visible = true
		this.clearRole.visible = !GameMap.IsPublicBoss() || !GameMap.IsHomeBoss() || !GameMap.IsSyBoss() || !GameMap.IsKfBoss() || !GameMap.IsXbBoss()
		this.clearRole.selected = ZsBoss.ins().clearOther;
	}

	//刷新boss目标信息
	OnRefreshTargetInfo() {
		if (!this.targetNow) {
			this.targetNow = new BossTargetInfo();
			this.targetNow.x = 10;
			this.targetNow.y = 210;
			this.targetNow.top = 151;
			if (Main.isLiuhai) {
				this.targetNow.top = 191;
			}
			this.targetNow.right = 0;
		}
		// this.targetNow.y = this.IsShowHudun() ? 300 : 220
		var target = (EntityManager.ins().getEntityByHandle(UserBoss.ins().handler));
		if (target) {
			this.targetNow.refushTargetInfo(target);
			this.m_Context.addChild(this.targetNow);
			return
		}
		this._ClearTarget()
	}

	huDunChange() {
		//判断是否在转生boss
		if (ZsBoss.ins().isZsBossFb(GameMap.fubenID) || GameMap.IsWorldBoss()) {
			if (this.IsShowHudun()) {
				this.hudun.visible = true;
				this.hudunbloodBar.value = ZsBoss.ins().hudun;
			}
			else {
				this.hudun.visible = false;
			}
		}
		else {
			this.hudun.visible = false;
		}
	};

	private IsShowHudun() {
		return ZsBoss.ins().hudun && ZsBoss.ins().hudun > 0
	}

	private reliveInfoChange(send = false) {
		if (ZsBoss.ins().isZsBossFb(GameMap.fubenID) || GameMap.IsWorldBoss()) {
			let t = ZsBoss.ins().reliveTime
			this.cd.visible = ZsBoss.ins().checkisAutoRelive(send)
			this.timeLable.text = LanguageString.jifengTiaoyueCh(GlobalConfig.jifengTiaoyueLg.st101390, [ZsBoss.ins().reliveTime]);
			TimerManager.ins().remove(this.refushLabel, this);
			this.autoClear.selected = ZsBoss.ins().autoClear;
			if (this.cd.visible) {
				this.remainM = ZsBoss.ins().reliveTime;
				TimerManager.ins().doTimer(1000, this.remainM, this.refushLabel, this, this.overTime, this);
			}
		} else {
			this.cd.visible = false;
		}
	};

	private _UpdateReliveInfo() {
		this.reliveInfoChange(true)
	}

	private overTime() {
		this.cd.visible = false;
	}

	OnAutoClearCD() {
		if (ZsBoss.ins().checkIsMoreMoney()) {
			if (this.autoClear.selected) {
				WarnWin.show(LanguageString.jifengTiaoyueCh(GlobalConfig.jifengTiaoyueLg.st101391, [30]), () => {
					this.autoClear.selected = true;
					ZsBoss.ins().autoClear = this.autoClear.selected;
					if (this.autoClear.selected) {
						UserTips.ins().showTips(GlobalConfig.jifengTiaoyueLg.st101392);
						ZsBoss.ins().checkisAutoRelive();
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

	refushLabel() {
		this.remainM--;
		this.timeLable.text = LanguageString.jifengTiaoyueCh(GlobalConfig.jifengTiaoyueLg.st101390, [this.remainM]);
	}

	OnAddEvent() {
		GameGlobal.MessageCenter.addListener(MessageDef.ZS_BOSS_HUDUN_POINT, this.huDunChange, this)
		GameGlobal.MessageCenter.addListener(MessageDef.ZS_BOSS_REMAIN_TIME, this._UpdateReliveInfo, this)
	}

	OnRemoveEvent() {
		GameGlobal.MessageCenter.removeListener(MessageDef.ZS_BOSS_HUDUN_POINT, this.huDunChange, this)
		GameGlobal.MessageCenter.removeListener(MessageDef.ZS_BOSS_REMAIN_TIME, this._UpdateReliveInfo, this)
	}

	OnSeeReward() {
		let isZsBoss = ZsBoss.ins().isZsBossFb(GameMap.fubenID);
		ViewManager.ins().open(ZsBossRewardShowWin, isZsBoss)
	}

	OnClearCD() {
		if (ZsBoss.ins().checkIsMoreMoney()) {
			ZSBossCDPanel.Show(this.autoClear.selected)
		}
		else {
			UserTips.ins().showTips(GlobalConfig.jifengTiaoyueLg.st101394);
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
window["BossBloodPanelType1"] = BossBloodPanelType1