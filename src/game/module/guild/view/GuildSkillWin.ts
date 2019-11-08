class GuildSkillWin extends BaseEuiPanel implements ICommonWindow, ICommonWindowRoleSelect, ICommonWindowTitle {

	selectBmpX = [0, 33, 108, 183, 266.5, 353];

	// selectIconID
	learnLab

	comLearnBtn: eui.Button

	comCon
	// praCon
	selectSkillID

	selectSkillType
	comDesc: eui.Label
	// comCurBase

	// comNextLab

	comCost0
	// praCurSkill
	// praCurBase
	// praName

	// praBarLab
	// praNextLab
	// praCost
	// praCost0

	skillGroup: eui.Group
	private m_SkillGroup: SkillGroup
	comDescGroup: eui.Group

	private commonWindowBg: CommonWindowBg
	private powerLabel: PowerLabel;
	private skillIcon: eui.Component;
	private readonly skillIdx: number = 37;
	windowTitleIconName = GlobalConfig.jifengTiaoyueLg.st100918;

	public constructor() {
		super();
		this.skinName = "GuildSkillSkin";
	};

	initUI() {
		super.initUI();
		this.m_SkillGroup = new SkillGroup(this.skillGroup, this._SelectSkill, this)
		for (let i = 0; i < 5; ++i) {
			let comp = this.m_SkillGroup.GetComp(i)
			//comp.icon.source = "guildskill" + (i >= 3 ? "2" : "1") + ((i % 3) + 1)
			comp.m_Lan1.text = GlobalConfig.jifengTiaoyueLg.st101016;
			comp.m_Lan2.text = GlobalConfig.jifengTiaoyueLg.st101017;
			comp.icon.source = `propIcon_0${this.skillIdx + i}_png`;
			comp.bg.imgBg.source = i >= 3 ? "pf_red_01_png" : "pf_black_01_png"
			comp.lock.text = ""
		}
		this.comLearnBtn.label = GlobalConfig.jifengTiaoyueLg.st101018;
		this.learnLab.textFlow = (new egret.HtmlTextParser).parser(`${GlobalConfig.jifengTiaoyueLg.st101501}  <a href=\"event:\"><font color='#${Color.Green}'><u>${GlobalConfig.jifengTiaoyueLg.st101502}</u></font></a>`);
	}

	open() {
		this.commonWindowBg.OnAdded(this)
		this.m_SkillGroup.open()
		this.comLearnBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTap, this);
		this.learnLab.addEventListener(egret.TextEvent.LINK, this.onLink, this);
		MessageCenter.addListener(Guild.ins().postGuildSkillInfo, this.update, this);
		MessageCenter.addListener(Guild.ins().postMyGuildInfo, this._SelectSkill, this);
		MessageCenter.addListener(GameLogic.ins().postSubRoleChange, this.updateRole, this);
		MessageCenter.addListener(Guild.ins().postGuildInfo, this.update, this);
		Guild.ins().sendGuildSkillInfo();
		Guild.ins().sendGuildInfo();
		Guild.ins().sendMyGuildInfo();
		this._UpdateSkillList()
	};
	close() {
		this.commonWindowBg.OnRemoved()
		this.m_SkillGroup.close()
		this.comLearnBtn.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onTap, this);
		this.learnLab.removeEventListener(egret.TextEvent.LINK, this.onLink, this);
		MessageCenter.ins().removeAll(this);
	};
	onLink() {
		ViewManager.ins().close(this)
		ViewManager.ins().open(GuildWin, 1);
	};
	updateRole() {
		Guild.ins().sendGuildSkillInfo();
	};

	update() {
		this._UpdateSkillList()
		this._SelectSkill();
	}

	private _UpdateSkillList() {
		var roleSkillInfo = Guild.ins().getSkllInfoByIndex(this.roleSelect.getCurRole());
		for (let i = 0; i < 5; ++i) {
			let comp = this.m_SkillGroup.GetComp(i)
			let [skillType, skillId] = this.GetSkillType(i + 1)

			let skillInfo = roleSkillInfo.GetSkillInfoByIndex(skillType, skillId - 1)
			var level = skillInfo.level

			comp.skillName.text = this.GetSkillNameConfig(skillType)[skillId - 1]

			comp.skillName.text = "" + this.GetSkillNameConfig(skillType)[skillId - 1];
			let str = "Lv." + level
			// if (skillType == GuildSkillType.PRACTICE) {
			if (level == 0 && skillInfo.exp == 0) {
				str = GlobalConfig.jifengTiaoyueLg.st100273
			}

			var csInfo = this.GetSkillDP(skillType, skillId, level);
			comp.comLv.text = LanguageString.jifengTiaoyueCh(GlobalConfig.jifengTiaoyueLg.st101019, [level])

			var csInfoNext = this.GetSkillDP(skillType, skillId, level + 1);
			comp.comCurBase.text = level == 0 ? GlobalConfig.jifengTiaoyueLg.st100273 : AttributeData.getAttStr(csInfo.attrs, 0, 1, "：", true);
			comp.comNextLab.text = AttributeData.getAttStr(csInfoNext.attrs, 0, 1, "：", true);

			if (skillType == GuildSkillType.PRACTICE) {
				comp.praBar.visible = true;
				comp.praBar.maximum = csInfoNext.upExp;
				comp.praBar.value = skillInfo.exp
			}
			else {
				comp.praBar.visible = false;
			}
		}
	}

	onTap(e) {
		switch (e.currentTarget) {
			case this.comLearnBtn:
				this.praBtnOnClick()
				break;
		}
	};

	private GetSkillType(index: number): any {
		// this.selectSkillID = (selectId - 1 ) % 3 + 1;
		return [index < 4 ? GuildSkillType.NORMAL : GuildSkillType.PRACTICE, (index - 1) % 3 + 1]
	}

	praBtnOnClick() {
		var roleSkillInfo = Guild.ins().getSkllInfoByIndex(this.roleSelect.getCurRole());
		let skillInfo = roleSkillInfo.GetSkillInfoByIndex(this.selectSkillType, this.selectSkillID - 1)
		var level = skillInfo.level;
		var buildLevel = Guild.ins().getBuildingLevels(GuildBuilding.GUILD_LIANGONGFANG - 1);
		// var maxLevel = this.GetSkillConfig(this.selectSkillType).lenth
		var cpsInfoNext = this.GetSkillDP(this.selectSkillType, this.selectSkillID, level + 1);
		if (buildLevel == 0 || level >= this.GetSkillLevel(this.selectSkillType, buildLevel)) {
			UserTips.ins().showTips(GlobalConfig.jifengTiaoyueLg.st101020);
			return;
		}
		if (cpsInfoNext.contribute > Guild.ins().myCon) {
			UserTips.ins().showTips(GlobalConfig.jifengTiaoyueLg.st101021);
			return;
		}
		else if (GameLogic.ins().actorModel.gold < cpsInfoNext.money) {
			UserTips.ins().showTips(GlobalConfig.jifengTiaoyueLg.st100222);
			return;
		}
		if (this.selectSkillType == GuildSkillType.PRACTICE) {
			Guild.ins().sendPracticeGuildSkill(this.roleSelect.getCurRole(), this.selectSkillID);
		} else {
			Guild.ins().sendLearnGuildSkill(this.roleSelect.getCurRole(), this.selectSkillID);
		}
	};

	private _SelectSkill(): void {
		let selectId = this.m_SkillGroup.SelectedIndex + 1;
		[this.selectSkillType, this.selectSkillID] = this.GetSkillType(selectId)

		var roleSkillInfo = Guild.ins().getSkllInfoByIndex(this.roleSelect.getCurRole());
		let skillInfo = roleSkillInfo.GetSkillInfoByIndex(this.selectSkillType, this.selectSkillID - 1)
		var level = skillInfo.level
		var csInfo = this.GetSkillDP(this.selectSkillType, this.selectSkillID, level);
		let config = this.GetSkillConfig(this.selectSkillType)[this.selectSkillID]
		var maxLevel = config.length;
		var buildLevel = Guild.ins().getBuildingLevels(GuildBuilding.GUILD_LIANGONGFANG - 1);

		this.learnLab.visible = (buildLevel < 1 || level >= this.GetSkillLevel(this.selectSkillType, buildLevel));
		this.comLearnBtn.visible = !this.learnLab.visible
		this.comDescGroup.visible = !this.learnLab.visible;
		this.comLearnBtn.label = level == 0 ? GlobalConfig.jifengTiaoyueLg.st101022 : GlobalConfig.jifengTiaoyueLg.st100208

		if (level < maxLevel) {
			var csInfoNext = this.GetSkillDP(this.selectSkillType, this.selectSkillID, level + 1);
			var colorStr = Guild.ins().myCon >= csInfoNext.contribute ? Color.Green : Color.Red;
			this.comCon.textFlow = TextFlowMaker.generateTextFlow(LanguageString.jifengTiaoyueCh(GlobalConfig.jifengTiaoyueLg.st101023, [StringUtils.addColor(Guild.ins().myCon.toString(), colorStr), csInfoNext.contribute]));
			this.comCost0.text = csInfoNext.money + "";
			this.comCost0.textColor = GameLogic.ins().actorModel.gold >= csInfoNext.money ? 0x008f22 : 0x008f22;
		}
		else {
			this.comCon.text = "0";
			this.comCost0.text = "0";
			this.comCost0.textColor = 0x008f22;
		}

		if (level == 0) {
			this.powerLabel.text = "0"
		} else {
			this.powerLabel.text = ItemConfig.CalcAttrScoreValue(csInfo.attrs) + ""
		}
	}

	private GetSkillConfig(skillType: GuildSkillType) {
		let config = skillType == GuildSkillType.NORMAL ? GlobalConfig.ins("GuildCommonSkillConfig") : GlobalConfig.ins("GuildPracticeSkillConfig")
		return config
	}

	public GetSkillNameConfig(skillType: GuildSkillType) {
		return skillType == GuildSkillType.NORMAL ? GlobalConfig.ins("GuildConfig").commonSkillNames : GlobalConfig.ins("GuildConfig").practiceSkillNames
	}

	public GetSkillLevel(skillType: GuildSkillType, buildLevel: number) {
		return skillType == GuildSkillType.NORMAL ? GlobalConfig.ins("GuildConfig").commonSkillLevels[buildLevel - 1] : GlobalConfig.ins("GuildConfig").practiceSkillLevels[buildLevel - 1]
	}

	private GetSkillDP(skillType: GuildSkillType, skillId: number, level: number) {
		let config = this.GetSkillConfig(skillType)
		var infos = config[skillId];
		if (level == 0) {
			return infos[0];
		}
		for (var index = 0; index < infos.length; index++) {
			var element = infos[index];
			if (element.level == level)
				return element;
		}
		return null;
	}

	m_RoleSelectPanel?: RoleSelectPanel

	get roleSelect(): RoleSelectPanel {
		return this.m_RoleSelectPanel
	}

	UpdateContent(): void {
		this.update()
	}
}

ViewManager.ins().reg(GuildSkillWin, LayerManager.UI_Main);
window["GuildSkillWin"] = GuildSkillWin