class SkillGroup {

	private m_Items: any[]

	private m_Callback: Function
	private m_ThisObject

	private m_SelectIndex = 0

	public get SelectedIndex() {
		return this.m_SelectIndex
	}

	public constructor(group: eui.Group, callback, thisObject, type: string = "skill") {
		this.m_Items = group.$children
		for (let item of this.m_Items) {
			item.currentState = type
		}
		this.m_Callback = callback
		this.m_ThisObject = thisObject
	}

	public updateDesc(index: number): void {

	}

	public open() {
		this.SelectItem(0);
		if (this.skillsOpenConfig == null)
			this.skillsOpenConfig = GlobalConfig.ins("SkillsOpenConfig");

		var level = UserSkill.ins().getSkillLimitLevel();
		let len = this.m_Items.length;
		for (var i = 0; i < len; i++) {
			let skillItem = this.m_Items[i];
			if (skillItem == null) {
				continue;
			}
			let config = this.skillsOpenConfig[i + 1];
			// skillItem.skillName2.text= config.skillName;;



		}
		for (let skillItem of this.m_Items) {

			skillItem.addEventListener(egret.TouchEvent.TOUCH_TAP, this._OnClick, this);
		}
	}

	public close() {
		for (let skillItem of this.m_Items) {
			skillItem.removeEventListener(egret.TouchEvent.TOUCH_TAP, this._OnClick, this);
		}
	}

	private skillsOpenConfig: any;
	private _OnClick(e: egret.TouchEvent) {
		let index = this.m_Items.indexOf(e.currentTarget)
		if (index == -1) {
			return
		}

		// if(this.skillsOpenConfig == null)
		//     this.skillsOpenConfig = GlobalConfig.ins("SkillsOpenConfig");

		// var level = UserSkill.ins().getSkillLimitLevel();
		// let config = this.skillsOpenConfig[index + 1];
		// if (level >= config.level) {
		this.m_SelectIndex = index;

		this.SelectItem(index)
		if (this.m_Callback) {
			this.m_Callback.call(this.m_ThisObject, index)
		}
		// }

	}

	private SelectItem(index: number): void {
		let i = 0
		for (let item of this.m_Items) {
			// item.skillIcon["select"].visible = index == i
			item["select"].visible = index == i
			++i
		}
	}

	public PlayUpTip(index: number, level: number) {
		var tip = BitmapNumber.ins().createNumPic("+" + level, "3");
		tip.touchEnabled = false
		let skillItem = this.m_Items[index];
		if (skillItem == null)
			return;
		tip.x = skillItem.width / 2;
		tip.y = skillItem.height / 4;
		skillItem.addChild(tip);
		var t = egret.Tween.get(tip);
		t.to({ "y": tip.y - 45 }, 1000).to({ "alpha": 0 }, 500).call(() => {
			egret.Tween.removeTweens(tip);
			DisplayUtils.removeFromParent(tip);
		}, this);
	}

	public SetRedPoint(isshow: boolean[]) {
		for (let i = 0; i < this.m_Items.length; ++i) {
			let skillItem = this.m_Items[i]
			skillItem['redPoint'].visible = isshow[i];
		}
	}

	public Update(roleId: number) {
		for (let i = 0; i < this.m_Items.length; ++i) {
			let skillItem = this.m_Items[i]
			var role = SubRoles.ins().getSubRoleByIndex(roleId);
			var skillsId = role.getCurSkillIDs();
			var skillId = skillsId[i];
			var skillLevel = role.getSkillsDataByIndex(i);
			var skillTupo = role.skillBreakData[i];
			var skillConfig = GlobalConfig.skillsConfig[skillId]; //skillId是技能最低等级，需要加上当前技能等级才能获取正确的配置 + (skillLevel ? skillLevel - 1 : 0)

			if (this.skillsOpenConfig == null)
				this.skillsOpenConfig = GlobalConfig.ins("SkillsOpenConfig");

			if (skillLevel <= 0) {
				if (UserSkill.ins().getSkillLimitLevel() >= this.skillsOpenConfig[i + 1].level) {
					// skillItem['lock'].textColor = 0X00FD61;
					skillItem['lock'].text = GlobalConfig.jifengTiaoyueLg.st100391;
				} else {
					// skillItem['lock'].textColor = 0XFD000A;
					skillItem['lock'].text = LanguageString.jifengTiaoyueCh(GlobalConfig.jifengTiaoyueLg.st101424,[ this.skillsOpenConfig[i + 1].level]);
				}
				skillItem['lock'].visible = true;
				if (skillItem["lv"]) skillItem["lv"].text = "";
			}
			else {
				skillItem['lock'].visible = false;
				if (skillItem["lv"]) skillItem["lv"].text = LanguageString.jifengTiaoyueCh(GlobalConfig.jifengTiaoyueLg.st101368,[skillLevel]);
			}
			if (skillItem["lv"]) skillItem["lv"].visible = true;
			if (skillItem["tpLv"]) {
				skillItem["tpLv"].visible = true;
				skillItem["tpLv"].text = LanguageString.jifengTiaoyueCh(GlobalConfig.jifengTiaoyueLg.st101439,[skillTupo]);
			}
			skillItem.icon.source = skillConfig.icon + "_png";
			skillItem.skillName.text = skillConfig.skinName + "";
			if (skillItem.skillDesc) skillItem.skillDesc.text = skillConfig.desc + "";

			var breakData = GameGlobal.rolesModel[roleId].skillBreakData
			let lv = breakData[i] ? breakData[i] : 0
			// skillItem["tupo"].source = `ui_tp${lv}`//貌似没用，注释了，wjh
		}
	}

	public Upgdate(roleId: number, mRoleData) {
		for (let i = 0; i < this.m_Items.length; ++i) {
			let skillItem = this.m_Items[i]
			var role = mRoleData[roleId];
			var skillsId = role.getCurSkillIDs();
			var skillId = skillsId[i];
			var skillLevel = role.getSkillsDataByIndex(i);
			var skillConfig = GlobalConfig.skillsConfig[skillId]; //skillId是技能最低等级，需要加上当前技能等级才能获取正确的配置 + (skillLevel ? skillLevel - 1 : 0)
			if (this.skillsOpenConfig == null)
				this.skillsOpenConfig = GlobalConfig.ins("SkillsOpenConfig");
			if (skillLevel <= 0) {
				if (UserSkill.ins().getSkillLimitLevel() >= this.skillsOpenConfig[i + 1].level) {
					// skillItem['lock'].textColor = 0X00FD61;
					skillItem['lock'].text = GlobalConfig.jifengTiaoyueLg.st100391;
				} else {
					// skillItem['lock'].textColor = 0XFD000A;
					skillItem['lock'].text = LanguageString.jifengTiaoyueCh(GlobalConfig.jifengTiaoyueLg.st101424,[this.skillsOpenConfig[i + 1].level]);
				}
				skillItem['lock'].visible = true;
				skillItem["lv"].text = "";
			}
			else {
				skillItem['lock'].visible = false;
				skillItem["lv"].text = LanguageString.jifengTiaoyueCh(GlobalConfig.jifengTiaoyueLg.st101439,[skillLevel]);
			}
			skillItem["icon"].source = skillConfig.icon + "_png";
			skillItem["skillName"].text = skillConfig.skinName + "";

			var breakData = GameGlobal.rolesModel[roleId].skillBreakData
			let lv = breakData[i] ? breakData[i] : 0
			// skillItem["tupo"].source = `ui_tp${lv}`//貌似没用，注释了，wjh
		}
	}

	public GetIcon(index: number): eui.Image {
		return this.m_Items[index]["icon"]
	}

	public GetLock(index: number): eui.Label {
		return this.m_Items[index]["lock"]
	}

	public GetSkillName(index: number): eui.Label {
		return this.m_Items[index]["skillName"]
	}

	public GetComp(index: number): {
		comLv: eui.Label,
		praBar: eui.ProgressBar,
		comCurBase: eui.Label,
		comNextLab: eui.Label,
		skillName: eui.Label,
		icon: eui.Image,
		lock: eui.Label,
		select: eui.Image,
		bg: { imgBg: eui.Image },
		m_Lan1: eui.Label,
		m_Lan2: eui.IDisplayText,
	} {
		return this.m_Items[index] as any
	}
}
window["SkillGroup"] = SkillGroup