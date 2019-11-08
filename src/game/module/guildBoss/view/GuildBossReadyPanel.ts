class GuildBossReadyPanel extends BaseEuiPanel implements ICommonWindow, ICommonWindowTitle {

	public static LAYER_LEVEL = LayerManager.UI_Main
	windowTitleIconName = GlobalConfig.jifengTiaoyueLg.st101805;
	////////////////////////////////////////////////////////////////////////////////////////////////////
	// GuildBossReadyPanelSkin.exml
	////////////////////////////////////////////////////////////////////////////////////////////////////
	private commonWindowBg: CommonWindowBg
	private getwayLabel: GetwayLabel
	private labelDisplay: eui.Label
	private callBtn: eui.Button
	private dataGroup: eui.DataGroup
	private tip1Label: eui.Label
	private tip2Label: eui.Label
	private callRole: eui.Component
	private rankRole: eui.Component
	private rankBtn: eui.Button
	private hpProgress: eui.ProgressBar
	private hurtLabel: eui.Label
	private bossLvComp: eui.Component
	////////////////////////////////////////////////////////////////////////////////////////////////////
	private bossGroup: eui.Group
	private bossImage: MovieClip
	private languageTxt: eui.Label;
	private languageTxt0: eui.Label;
	private languageTxt1: eui.Label;

	public constructor() {
		super()
		this.skinName = "GuildBossReadyPanelSkin"
		this.dataGroup.itemRenderer = ItemBase
		this.hpProgress.slideDuration = 0
		this.hpProgress.labelFunction = function (cur, max) {
			return Math.floor(cur / max * 100) + "%"
		}
	}

	public childrenCreated() {
		this.dataGroup.itemRenderer = ItemBase
		this.callBtn.label = GlobalConfig.jifengTiaoyueLg.st101810;
		this.rankBtn.label = GlobalConfig.jifengTiaoyueLg.st101811;
		this.tip2Label.text = GlobalConfig.jifengTiaoyueLg.st101812;
		this.languageTxt.text = GlobalConfig.jifengTiaoyueLg.st101813;
		this.languageTxt0.text = GlobalConfig.jifengTiaoyueLg.st101814;
		this.languageTxt1.text = GlobalConfig.jifengTiaoyueLg.st101815;
	}

	private initMc() {
		if (!this.bossImage) {
			this.bossImage = new MovieClip;
			this.bossGroup.addChild(this.bossImage);
		}
	}

	public open() {
		this.commonWindowBg.OnAdded(this)
		this.AddClick(this.rankBtn, this._OnClick)
		this.AddClick(this.callBtn, this._OnClick)
		this.AddClick(this.getwayLabel, this._OnClick)
		this.hpProgress.maximum = 100
		this.hpProgress.value = 100
		this._UpdateData()

		TimerManager.ins().doTimer(1000, 0, this._UpdateTip1, this)

		GameGlobal.MessageCenter.addListener(MessageDef.GUILD_BOSS_CALL_INFO, this._UpdateData, this)
		GameGlobal.MessageCenter.addListener(MessageDef.GUILD_BOSS_OPEN_INFO, this._UpdateData, this)
		GuildBoss.ins().SendGetBossInfo()
	}

	public close() {
		GameGlobal.MessageCenter.removeListener(MessageDef.GUILD_BOSS_CALL_INFO, this._UpdateData, this)
		GameGlobal.MessageCenter.removeListener(MessageDef.GUILD_BOSS_OPEN_INFO, this._UpdateData, this)
		DisplayUtils.dispose(this.bossImage);
		this.bossImage = null;
		this.commonWindowBg.OnRemoved()
		TimerManager.ins().remove(this._UpdateTip1, this)
	}

	private _UpdateData() {
		this.hpProgress.value = GuildBoss.ins().HpPercent()
		this._UpdateTip1()
		let callInfo = GuildBoss.ins().GetCallInfo()
		if (!callInfo) {
			return
		}
		let configData = GlobalConfig.ins("GuildBossConfig")[GuildBoss.ins().GetBossIndex()]
		if (!configData) {
			return
		}
		this.dataGroup.dataProvider = new eui.ArrayCollection(RewardData.ToRewardDatas(configData.limitRewards1))
		GuildBossViewHelper.SetRoleHead(this.callRole, callInfo.callName, callInfo.callOffice, callInfo.callHead)

		let rankData = callInfo.rankDatas[0]
		if (rankData == null) {
			GuildBossViewHelper.SetRoleHead(this.rankRole, GlobalConfig.jifengTiaoyueLg.st100378, null, 0)
			this.hurtLabel.text = GlobalConfig.jifengTiaoyueLg.st101808 + "：" + CommonUtils.overLength(0)
		} else {
			GuildBossViewHelper.SetRoleHead(this.rankRole, rankData.name, rankData.office, rankData.head)
			this.hurtLabel.text = GlobalConfig.jifengTiaoyueLg.st101808 + "：" + CommonUtils.overLength(rankData.value)
		}
		this.initMc();
		UIHelper.SetMonsterMc(this.bossImage, configData.bossId)
		GuildBossViewHelper.SetBossLv(this.bossLvComp, configData.level, configData.zsLevel)
	}

	private _OnClick(e: egret.TouchEvent) {
		switch (e.target) {
			case this.callBtn:
				GuildBoss.ins().SendBossFight()
				ViewManager.ins().close(this)
				break
			case this.getwayLabel:
				ViewManager.ins().open(GuildBossRewardPanel)
				break
			case this.rankBtn:
				ViewManager.ins().open(GuildBossHuntph)
				break
		}
	}

	private _UpdateTip1(): void {
		let time = GuildBoss.ins().GetSurplusTime()
		// if (time <= 0) {
		// 	this.tip1Label.text = `BOSS已逃跑`
		// } else {
		let t = Math.ceil(time / 60)
		this.tip1Label.text = LanguageString.jifengTiaoyueCh(GlobalConfig.jifengTiaoyueLg.st101809, [t])//`距离BOSS逃跑时间：${t}分钟`
		// }
	}

	UpdateContent() {

	}
	mWindowHelpId = 24
}
window["GuildBossReadyPanel"] = GuildBossReadyPanel