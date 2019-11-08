class BossBloodPanelType3 implements IBossBloodPanel {

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

	private m_Raid: BaseRaid

	public constructor(context: BossBloodPanel) {
		this.m_Context = context
		this.m_Raid = BaseRaid.GetRaidByType(UserFb.FB_TYPE_GUILD_BOSS)
		this.m_Raid.mReliveChange = this._UpdateReliveInfo
		this.m_Raid.mReliveChangeObj = this
		this.reliveInfoChange()
	}

	DoOpen() {
		this.reliveInfoChange();

		// this.see.visible = true
		// this.clearRole.selected = this.m_Raid.mClearRole
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
		// this.targetNow.y = 235
		var target = (EntityManager.ins().getEntityByHandle(UserBoss.ins().handler));
		if (target) {
			this.targetNow.refushTargetInfo(target);
			this.m_Context.addChild(this.targetNow);
			return
		}
		this._ClearTarget()
	}


	private reliveInfoChange() {
		this.cd.visible = this.m_Raid.CheckIsDead()
		this._RefreshLabel()
		TimerManager.ins().remove(this._RefreshLabel, this);
		this.autoClear.selected = this.m_Raid.AutoClear;
		if (this.cd.visible) {
			TimerManager.ins().doTimer(1000, Math.ceil(this.m_Raid.GetReliveSurplusTime()), this._RefreshLabel, this, this.overTime, this);
		}
	};

	private _UpdateReliveInfo() {
		this.m_Raid.AutoRelive()
		this.reliveInfoChange()
	}

	private overTime() {
		this.cd.visible = false;
	}

	OnAutoClearCD() {
		if (this.m_Raid.CheckIsMoreMoney()) {
			if (this.autoClear.selected) {
				WarnWin.show(LanguageString.jifengTiaoyueCh(GlobalConfig.jifengTiaoyueLg.st101391,[this.m_Raid.GetReliveYb()]) , () => {
					this.autoClear.selected = true;
					this.m_Raid.AutoClear = this.autoClear.selected;
					if (this.autoClear.selected) {
						UserTips.ins().showTips(GlobalConfig.jifengTiaoyueLg.st101392);
						this.m_Raid.AutoRelive()
					}
				}, this, () => {
					this.autoClear.selected = false;
				}, this);
			} else {
				this.m_Raid.AutoClear = this.autoClear.selected;
			}
		} else {
			this.autoClear.selected = false;
			UserTips.ins().showTips(GlobalConfig.jifengTiaoyueLg.st101393);
		}
	}

	_RefreshLabel() {
		this.timeLable.text =LanguageString.jifengTiaoyueCh(GlobalConfig.jifengTiaoyueLg.st101390,[this.m_Raid.GetReliveSurplusTime()]);
	}

	OnAddEvent() {

	}

	OnRemoveEvent() {

	}

	OnSeeReward() {
		this.m_Raid.ShowRewardPanel()
		// ViewManager.ins().open(ZsBossRewardShowWin)
	}

	OnClearCD() {
		let comp = new eui.Component as any
		comp.skinName = "ZSBossCDSkin"
		let label: eui.Label = comp.label
		WarnWin.isRelease = true;
		label.textFlow = (new egret.HtmlTextParser).parser(LanguageString.jifengTiaoyueCh(GlobalConfig.jifengTiaoyueLg.st101396,[this.m_Raid.GetReliveYb()]))
		comp.check.selected = this.m_Raid.AutoClear
		let func = () => {
			this.m_Raid.AutoClear = comp.check.selected
			if (comp.check.selected) {
				UserTips.ins().showTips(GlobalConfig.jifengTiaoyueLg.st101392)
			}
		}
		comp.check.addEventListener(egret.Event.CHANGE, func, null)
		WarnWin.ShowContent(comp, () => {
			(comp.check as eui.CheckBox).removeEventListener(egret.Event.CHANGE, func, null)
			if (this.m_Raid.CheckIsMoreMoney()) {
				this.m_Raid.AutoClear = comp.check.selected
				this.m_Raid.SendReliveCd()
			}
		}, null)
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
window["BossBloodPanelType3"] = BossBloodPanelType3