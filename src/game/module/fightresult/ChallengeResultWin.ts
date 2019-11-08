class ChallengeResultWin extends BaseEuiPanel {
	public static LAYER_LEVEL = LayerManager.UI_Popup

	private list0: eui.List
	private list1: eui.List
	private nextLabel: eui.Label
	private exitBtn: eui.Button
	private fightResultBg: FightResultPanel
	private get closeBtn(): eui.Button {
		return this.fightResultBg["closeBtn"]
	}

	private m_Time: number
	private m_CloseFunc: Function
	private m_HasNext = true
	public award_label: eui.Label;

	public constructor() {
		super()

		this.skinName = "ChallengeResultSkin";

		this.list0.itemRenderer = ItemBase
		this.list1.itemRenderer = ItemBase
		this.exitBtn.label = GlobalConfig.jifengTiaoyueLg.st100962;
		this.nextLabel.text = GlobalConfig.jifengTiaoyueLg.st101837;
		this.award_label.text = GlobalConfig.jifengTiaoyueLg.st101838;
	}

	public open(...param: any[]) {
		this.m_CloseFunc = param[0];

		this.AddClick(this.exitBtn, this._OnClick)
		this.AddClick(this.closeBtn, this._ContinueChallenge)

		// 结算的时候id已经改变，所以这里要-1
		// let fbId = UserFb2.ins().fbChallengeId - 1
		let fbId = UserFb2.ins().fbChallengeId
		this.fightResultBg.SetState("win")
		let config0 = GlobalConfig.fbChallengeConfig[fbId]
		if (config0)
			this.list0.dataProvider = new eui.ArrayCollection(config0.firstAward)
		else
			Main.errorBack("ChallengeResultWin fbChallengeConfig = null fubenID:" + fbId);

		let config1 = GlobalConfig.fbChallengeConfig[fbId + 1]
		if (config1 && !Checker.Level(config1.zsLv, config1.lv)) {
			config1 = null
		}
		if (config1) {
			this.closeBtn.x = 95
			this.closeBtn.name = GlobalConfig.jifengTiaoyueLg.st101602;
			this.list1.dataProvider = new eui.ArrayCollection(config1.firstAward)
		} else {
			this.list1.visible = false
			this.nextLabel.visible = false
			this.closeBtn.name = GlobalConfig.jifengTiaoyueLg.st100962;
			this.exitBtn.visible = false
			this.m_HasNext = false
		}

		this.m_Time = 5
		this._UpdateCloseBtnLabel();
		TimerManager.ins().doTimer(1000, this.m_Time, this._UpdateCloseBtnLabel, this);
		this.checkGuide();
	}

	private removeTime() {
		TimerManager.ins().remove(this._UpdateCloseBtnLabel, this);
	}

	public close() {
		this.removeTime();
		TimerManager.ins().remove(this._UpdateCloseBtnLabel, this);
	}

	public onMaskTap(): void {
		//点击背景不操作注释了
		// super.onMaskTap();
		// this._OnClick();
	}

	private _OnClick() {
		GuideUtils.ins().next(this.exitBtn);
		UserFb.ins().sendExitFb();
		ViewManager.ins().close(this)
		if (this.m_CloseFunc) {
			this.m_CloseFunc();
			this.m_CloseFunc = null;
		}
	}

	private _UpdateCloseBtnLabel() {
		if (--this.m_Time <= 0) {
			this._ContinueChallenge()
		}
		this.closeBtn.label = this.closeBtn.name + "(" + Math.max(this.m_Time, 0) + "s)";
	}

	private _ContinueChallenge() {
		if (this.m_HasNext) {
			ViewManager.ins().close(this)
			UserFb2.ins().sendChallenge();
		} else {
			this._OnClick()
		}
	}

	private checkGuide() {
		if (UserFb2.ins().fbChallengeId == GuideArtifact.Artifact) {
			this.removeTime();
			Setting.currPart = 68;
			Setting.currStep = 0;
			GuideUtils.ins().show(this.exitBtn, 68, 0);
		}
	}
}
window["ChallengeResultWin"] = ChallengeResultWin