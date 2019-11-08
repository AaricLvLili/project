class GuildBossCallPanel extends BaseEuiPanel implements ICommonWindow, ICommonWindowTitle {

	public static LAYER_LEVEL = LayerManager.UI_Main
	windowTitleIconName = GlobalConfig.jifengTiaoyueLg.st101805;
	////////////////////////////////////////////////////////////////////////////////////////////////////
	// GuildBossCallPanelSkin.exml
	////////////////////////////////////////////////////////////////////////////////////////////////////
	private commonWindowBg: CommonWindowBg
	private bossGroup: eui.Group
	private priceIcon: PriceIcon
	private getwayLabel: eui.Label
	private callBtn: eui.Button
	private dataGroup: eui.DataGroup
	private tip1Label: eui.Label
	private tip2Label: eui.Label
	private callNumLabel: eui.Label
	private bossLvComp: eui.Component
	////////////////////////////////////////////////////////////////////////////////////////////////////
	private learnLab: eui.Label
	private bossImage: MovieClip
	private languageTxt: eui.Label;

	public constructor() {
		super()
		this.skinName = "GuildBossCallPanelSkin"
		this.dataGroup.itemRenderer = ItemBase
		this.bossImage = new MovieClip;
		this.bossGroup.addChild(this.bossImage)
		this.learnLab.textFlow = (new egret.HtmlTextParser).parser(GlobalConfig.jifengTiaoyueLg.st101798 + "<a href=\"event:\"><font color='#008f22'><u>" + GlobalConfig.jifengTiaoyueLg.st101502 + "</u></font></a>");
		this.languageTxt.text = GlobalConfig.jifengTiaoyueLg.st101806;
		this.callBtn.label = GlobalConfig.jifengTiaoyueLg.st101700;
	}

	public open() {
		this.commonWindowBg.OnAdded(this)
		this.AddClick(this.callBtn, this._OnClick)
		this.getwayLabel.touchEnabled = true
		this.AddClick(this.getwayLabel, this._OnClick)
		this._UpateCallNum(GuildBoss.ins().times(), GuildBoss.ins().GetMaxCallTimes())
		// GuildBossViewHelper.SetBossLv(this.bossLvComp, GuildBoss.ins().bossLv())

		let constConfig = GlobalConfig.ins("PublicGuildBossBaseConfig")
		this.tip2Label.text = GlobalConfig.jifengTiaoyueLg.st101799 + `：${constConfig.opentime[0]}:00~${constConfig.opentime[1]}:00`

		let index = this._GetCallIndex()
		let configData = GlobalConfig.ins("GuildBossConfig")[index]
		this.tip1Label.text = LanguageString.jifengTiaoyueCh(GlobalConfig.jifengTiaoyueLg.st101800, [configData.escapetime]);//`召唤后需要在${configData.escapetime}分钟内击杀BOSS`
		GuildBossViewHelper.SetBossLv(this.bossLvComp, configData.level, configData.zsLevel)
		this.dataGroup.dataProvider = new eui.ArrayCollection(RewardData.ToRewardDatas(configData.zhrewards))
		this._UpdatePrice(configData.soul)
		UIHelper.SetMonsterMc(this.bossImage, configData.bossId)
		this.learnLab.addEventListener(egret.TextEvent.LINK, this.onLink, this);

		var buildLevel = Guild.ins().getBuildingLevels(GuildBuilding.GUILD_BOSS - 1);
		this.learnLab.visible = false;
		if (buildLevel == 0) {
			UserTips.ins().showTips(GlobalConfig.jifengTiaoyueLg.st101801);
			this.learnLab.visible = true
			this.priceIcon.visible = false
			this.callBtn.visible = false
			this.tip1Label.visible = false
			return;
		}
		UIHelper.SetLinkStyleLabel(this.getwayLabel, GlobalConfig.jifengTiaoyueLg.st101802)//查看奖励明细
	}

	public close() {
		this.commonWindowBg.OnRemoved()
	}

	private _OnClick(e: egret.TouchEvent) {
		switch (e.currentTarget) {
			case this.callBtn:
				if (GuildBoss.ins().times() >= GuildBoss.ins().GetMaxCallTimes()) {
					UserTips.ErrorTip(GlobalConfig.jifengTiaoyueLg.st101803)//召唤次数不足
					return
				}


				let index = this._GetCallIndex()
				let configData = GlobalConfig.ins("GuildBossConfig")[index]
				if (configData) {
					if (Checker.Money(MoneyConst.yuanbao, configData.soul)) {
						GuildBoss.ins().SendBossCall()
						// ViewManager.ins().close(GuildBossCallPanel)	
					}
				}
				break
			case this.getwayLabel:
				ViewManager.ins().open(GuildBossRewardPanel)
				break
		}
	}

	private _UpateCallNum(cur: number, max: number) {
		this.callNumLabel.text = GlobalConfig.jifengTiaoyueLg.st101804 + `：${cur}/${max}`//今日公会BOSS已召唤次数
	}

	onLink() {
		ViewManager.ins().close(this)
		ViewManager.ins().open(GuildWin, 1);
	};

	private _UpdatePrice(value: number) {
		this.priceIcon.price = value
	}

	private _GetCallIndex(): number {
		return GuildBoss.ins().GetMaxCallIndex() || 1
	}

	UpdateContent() {

	}
	mWindowHelpId = 24
}
window["GuildBossCallPanel"] = GuildBossCallPanel