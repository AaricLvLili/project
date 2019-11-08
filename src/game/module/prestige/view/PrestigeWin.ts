class PrestigeWin extends BaseView implements ICommonWindowTitle {

	private progressBar: eui.ProgressBar
	private starList: StarList
	private curLevelImg: eui.Image
	private upBtn: eui.Button
	//private rankBtn: eui.Button
	private rankBtn: eui.Label
	private getway: eui.Image
	private tips: eui.Label
	private powerLabel: PowerLabel
	private attrLabel: AttrLabel

	private nameGroup: eui.Group
	private roleShow1: RoleShowPanel
	private roleShow2: RoleShowPanel
	private roleShow3: RoleShowPanel
	private roleList: RoleShowPanel[]
	private btnHelp1: eui.Group
	private btnHelp2: eui.Group
	private btnHelp3: eui.Group

	private btnShowEffect: eui.Button
	private prestigeCommonConfig: any;
	private prestigeLevelConfig: any;
	public m_Lan4: eui.Label;
	public m_Lan5: eui.Label;
	public m_Lan1: eui.Label;
	public m_Lan2: eui.Label;
	public m_Lan3: eui.Label;
	public m_Lan6: eui.Label;
	public review: eui.Button;

	public constructor() {
		super()
		this.skinName = "PrestigeWinSkin";
		this.name = GlobalConfig.jifengTiaoyueLg.st101246;
		this.review.touchEnabled = true
		this.progressBar.labelFunction = (val, max) => {
			return this.curProValue + "/" + this.maxProValue
		}
		this.roleList = [this.roleShow1, this.roleShow2, this.roleShow3];
		this.rankBtn.text = GlobalConfig.jifengTiaoyueLg.st101256;
		UIHelper.SetLinkStyleLabel(this.rankBtn);
		this.progressBar.slideDuration = 0;
		this.m_Lan1.text = GlobalConfig.jifengTiaoyueLg.st100378
		this.m_Lan2.text = GlobalConfig.jifengTiaoyueLg.st100378
		this.m_Lan3.text = GlobalConfig.jifengTiaoyueLg.st100378
		this.m_Lan4.text = GlobalConfig.jifengTiaoyueLg.st101254
		this.m_Lan5.text = GlobalConfig.jifengTiaoyueLg.st101255
		this.m_Lan6.text = GlobalConfig.jifengTiaoyueLg.st101257;
		this.review.label = GlobalConfig.jifengTiaoyueLg.st101258;
		this.upBtn.label = GlobalConfig.jifengTiaoyueLg.st100214;

	}
	windowTitleIconName: string = GlobalConfig.jifengTiaoyueLg.st101246;
	open() {
		this.AddClick(this.review, this.OnClick)
		this.AddClick(this.upBtn, this.OnClick)
		this.AddClick(this.rankBtn, this.OnClick)
		this.AddClick(this.getway, this.OnClick)
		this.AddClick(this.btnShowEffect, this.OnClick)
		this.AddClick(this.btnHelp1, this.OnClick)
		this.AddClick(this.btnHelp2, this.OnClick)
		this.AddClick(this.btnHelp3, this.OnClick)
		this.observe(MessageDef.PRESTIGE_RESULT, this._DoEventResult)
		this.observe(MessageDef.PRESTIGE_RANK_TOPTHREE, this._DoEventRankTopThree)
		PrestigeModel.ins().SendPrestigeReqTopthree();
	}

	public release() {
		for (var i = 0; i < this.roleList.length; i++) {
			this.roleList[i].release();
		}
	}

	private _DoEventResult(result: boolean) {
		this.UpdateContent()
	}

	OnClick(e: egret.TouchEvent): void {
		switch (e.currentTarget) {
			case this.review:
				ViewManager.ins().open(PrestigeListView)
				break;
			case this.upBtn:
				if (this.prestigeLevelConfig == null)
					this.prestigeLevelConfig = GlobalConfig.ins("PrestigeLevelConfig");
				let prestige = GameGlobal.actorModel.prestige;
				let prestigeLv = GameGlobal.actorModel.prestige_level;
				let configData = this.prestigeLevelConfig[prestigeLv];
				if (configData.growUpNeed <= prestige) {
					if (this.prestigeLevelConfig[prestigeLv + 1])
						PrestigeModel.ins().SendUpgrade()
					else
						UserTips.ins().showTips(GlobalConfig.jifengTiaoyueLg.st101247);
				} else {
					UserTips.ins().showTips(GlobalConfig.jifengTiaoyueLg.st101248);
				}
				break;
			case this.rankBtn:
				Rank.ins().OpenRankPanel(RankDataType.TYPE_PRESTIGE);
				break;
			case this.getway:
				UserWarn.ins().setBuyGoodsWarn(10)
				break;
			case this.btnShowEffect:
				ViewManager.ins().open(ZsBossRuleSpeak, 19, GlobalConfig.jifengTiaoyueLg.st101249)
				break;
			case this.btnHelp1:
				ViewManager.ins().open(ZsBossRuleSpeak, 20, GlobalConfig.jifengTiaoyueLg.st101250)
				break;
			case this.btnHelp2:
				ViewManager.ins().open(ZsBossRuleSpeak, 21, GlobalConfig.jifengTiaoyueLg.st101251)
				break;
			case this.btnHelp3:
				ViewManager.ins().open(ZsBossRuleSpeak, 22, GlobalConfig.jifengTiaoyueLg.st101252)
				break;
		}
	}

	private _DoEventRankTopThree() {
		var praises = PrestigeModel.ins().praises
		for (let i = 0; i < praises.length; ++i) {
			if (praises[i].id > 0) {
				(<eui.Label>this.nameGroup.getChildAt(i)).text = praises[i].name
				let subRole = praises[i].subRole[0]
				this.roleList[i].creatAnim(subRole)
				// this.roleList[i].Set(DressType.ARM, subRole)
				// this.roleList[i].Set(DressType.ROLE, subRole)
				// this.roleList[i].Set(DressType.WING, subRole)

			}
		};
	}

	private curProValue = 0
	private maxProValue = 0

	UpdateContent(): void {
		//this.tips.text = `威名值低于自身的玩家，被攻击时伤害减少${GlobalConfig.ins("PrestigeCommonConfig").openLevel * 0.0001 * 100}%`
		if (this.prestigeCommonConfig == null)
			this.prestigeCommonConfig = GlobalConfig.ins("PrestigeCommonConfig");
		if (this.prestigeLevelConfig == null)
			this.prestigeLevelConfig = GlobalConfig.ins("PrestigeLevelConfig");

		let addValue = this.prestigeCommonConfig.PrestigeReduction / 10000 * 100;
		addValue = Math.floor(addValue);
		this.tips.text = LanguageString.jifengTiaoyueCh(GlobalConfig.jifengTiaoyueLg.st101253, [addValue]);
		let prestige = GameGlobal.actorModel.prestige
		let prestigeLv = GameGlobal.actorModel.prestige_level

		let preConfigData = this.prestigeLevelConfig[prestigeLv - 1]
		let preValue = preConfigData ? preConfigData.growUpNeed : 0
		let configData = this.prestigeLevelConfig[prestigeLv]
		let nextConfigData = this.prestigeLevelConfig[prestigeLv + 1]

		this.curLevelImg.source = `comp_135_37_${configData.level}_png`;
		this.starList.starNum = configData.star

		this.maxProValue = configData.growUpNeed// - preValue
		this.curProValue = prestige// - preValue

		this.progressBar.maximum = this.maxProValue
		this.progressBar.value = this.curProValue
		this.progressBar.labelDisplay.text = this.progressBar.labelFunction(0, 0)

		this.attrLabel.SetCurAttrNew(AttributeData.getAttStr(configData.attrs, 0))
		if (nextConfigData) {
			this.attrLabel.SetNextAttrNew(AttributeData.getAttStr(nextConfigData.attrs, 0))
		}

		if (configData.growUpState == 2 && configData.growUpNeed <= prestige) {
			this.progressBar.value = this.progressBar.maximum = 1
			this.progressBar.labelDisplay.visible = false
			this.upBtn.label = prestigeLv && GlobalConfig.jifengTiaoyueLg.st100214 || GlobalConfig.jifengTiaoyueLg.st100212
		} else {
			this.progressBar.labelDisplay.visible = true
			this.upBtn.label = GlobalConfig.jifengTiaoyueLg.st100211;
		}

		this.powerLabel.text = UserBag.getAttrPower(configData.attrs)
	}

	static openCheck(...param: any[]) {
		return Deblocking.Check(DeblockingType.TYPE_89)
	};

	public CheckRedPoint(): boolean {
		return PrestigeModel.CheckRedPoint()
	}
}
window["PrestigeWin"] = PrestigeWin