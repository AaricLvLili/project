class SkillShowWin extends BaseEuiPanel {
	public constructor() {
		super()
		this.skinName = "SkillShowWinSkin";
	}
	public m_SkillIcon: SkillIcon;
	public m_SkillNameLab: eui.Label;
	public m_SkillLvLab: eui.Label;
	public m_NeedLvLab: eui.Label;
	public m_CDLab: eui.Label;
	public m_SkillType: eui.Label;
	public m_NowLvCont: eui.Label;
	public m_NextLvCont: eui.Label;
	public m_MainBtnGroup: eui.Group;
	public m_UpLvBtn: eui.Button;
	public m_FullLab: eui.Label;
	public m_MPLab: eui.Label;

	public m_LvUpEffGroup: eui.Group;
	public m_BodyEffGrouo: eui.Group;
	public m_ItemEffGroup: eui.Group;



	public static isOpen: boolean = false;
	public m_ItemEffGroup0: eui.Group;


	private data: { job: number, curRole: number, index: number };

	private needItemId = 0;
	private haveNum = 0;

	public m_NeedItem: MainNeedItem;


	initUI() {
		super.initUI();
		this.m_bg.init(`SkillShowWin`, GlobalConfig.jifengTiaoyueLg.st100255);
		this.m_MPLab.visible = false;
	}
	open(...param: any[]) {
		this.data = param[0];
		this.addViewEvent();
		this.setData();
		SkillShowWin.isOpen = true;
	}
	close() {
		this.release();
	}
	public release() {
		DisplayUtils.dispose(this.m_BodyEff);
		this.m_BodyEff = null;
		DisplayUtils.dispose(this.m_UpLvEff);
		this.m_UpLvEff = null;
		DisplayUtils.dispose(this.m_ItemEff);
		this.m_ItemEff = null;
		SkillShowWin.isOpen = false;
		this.removeViewEvent();
	}
	private addViewEvent() {
		this.m_NeedItem.addEvent();
		this.AddClick(this.m_UpLvBtn, this.onClickLvUpBtn)
		this.observe(MessageDef.SKILL_UPGRADE, this.onLvUp);
		this.observe(MessageDef.SKILL_GREWUPALL, this.onLvUp);
		this.observe(MessageDef.ITEM_COUNT_CHANGE, this.setData);
	}
	private removeViewEvent() {
		this.m_NeedItem.removeEvent();
	}

	private onLvUp() {
		this.setData();
		this.playBodyEff();
	}
	private setData() {
		this.m_MainBtnGroup.visible = false;
		this.m_FullLab.visible = false;
		let data: { job: number, curRole: number, index: number } = this.data;
		this.m_SkillIcon.setData(data);
		let zzLv = ZhuanZhiModel.ins().getZhuanZhiLevel(data.curRole);
		let skillLv = UserSkill.ins().getskillLv(data.curRole, data.index);
		let skillId = UserSkill.ins().getSkillId(data.job, data.index, skillLv);
		let isCanLvUp: boolean = false;
		let skillsConfig: any;
		if (skillLv == 0) {
			skillsConfig = GlobalConfig.ins("SkillsConfig")[skillId + 1];
			this.m_UpLvBtn.label = GlobalConfig.jifengTiaoyueLg.st100256;//"激活技能";
		} else {
			skillsConfig = GlobalConfig.ins("SkillsConfig")[skillId];
			this.m_UpLvBtn.label = GlobalConfig.jifengTiaoyueLg.st100257;//"升级技能";
		}
		if (skillsConfig) {
			this.m_SkillNameLab.text = skillsConfig.skinName;
			if (skillsConfig.cd == 0) {
				this.m_CDLab.text = "";
			} else {
				let cd = Math.ceil(skillsConfig.cd / 1000);
				this.m_CDLab.text = LanguageString.jifengTiaoyueCh(GlobalConfig.jifengTiaoyueLg.st100258, [cd]);
			}
			let strSkillType = UserSkill.ins().getSkillTypeStr(skillsConfig.skillType);
			if (skillLv == 0) {
				this.m_NowLvCont.text = GlobalConfig.jifengTiaoyueLg.st100259 + "：" + skillsConfig.desc;//激活效果
			} else {
				this.m_NowLvCont.text = GlobalConfig.jifengTiaoyueLg.st100260 + "：" + skillsConfig.desc;//当前效果
			}
			this.m_SkillType.text = GlobalConfig.jifengTiaoyueLg.st100261 + "：" + strSkillType;//技能类型
			if (skillsConfig.skillArgs) {
				this.m_MPLab.text = GlobalConfig.jifengTiaoyueLg.st100262 + "：" + skillsConfig.skillArgs.skillCost + "MP";//技能消耗
			} else {
				this.m_MPLab.text = "";
			}
		}
		let nextSkillsConfig: any;
		nextSkillsConfig = GlobalConfig.ins("SkillsConfig")[skillId + 1];
		if (nextSkillsConfig) {
			if (skillLv == 0) {
				let nextMoveSkillsConfig = GlobalConfig.ins("SkillsConfig")[skillId + 2];
				this.m_NextLvCont.text = GlobalConfig.jifengTiaoyueLg.st100263 + "：" + nextMoveSkillsConfig.desc;//升级效果
			} else {
				this.m_NextLvCont.text = GlobalConfig.jifengTiaoyueLg.st100263 + "：" + nextSkillsConfig.desc;//升级效果
			}
			let needLv = nextSkillsConfig.upgradeLimit;
			let playerlv = GameLogic.ins().actorModel.level;
			let playerzs = UserZs.ins() ? UserZs.ins().lv : 0;
			let str = GlobalConfig.jifengTiaoyueLg.st100093;//级
			if (needLv >= 1000) {
				needLv = needLv / 1000;
				str = GlobalConfig.jifengTiaoyueLg.st100067;//"转";
				if (playerzs >= needLv) {
					this.m_NeedLvLab.textColor = Color.Green;
					isCanLvUp = true;
				} else {
					this.m_NeedLvLab.textColor = Color.Red;
				}
			} else {
				if (playerlv >= needLv) {
					this.m_NeedLvLab.textColor = Color.Green;
					isCanLvUp = true;
				} else {
					this.m_NeedLvLab.textColor = Color.Red;
				}
			}
			if (skillLv == 0) {
				this.m_NeedLvLab.text = LanguageString.jifengTiaoyueCh(GlobalConfig.jifengTiaoyueLg.st100264, [needLv + str]);//"本角色" + needLv + str + "可以激活"
			} else {
				this.m_NeedLvLab.text = LanguageString.jifengTiaoyueCh(GlobalConfig.jifengTiaoyueLg.st100265, [needLv + str]);//"本角色" + needLv + str + "可以升级"
			}
		} else {
			this.m_NextLvCont.text = "";
			this.m_NeedLvLab.text = "";
		}

		this.m_SkillLvLab.text = "Lv." + skillLv + "/" + UserSkill.ins().maxLv;
		this.m_SkillLvLab.textColor = Color.FontColor;
		let config = GlobalConfig.ins("SkillsOpenConfig")[data.job];
		let skillsOpenConfig = null;
		for (var i = 0; i < config.length; i++) {
			if (config[i].index == data.index) {
				skillsOpenConfig = config[i];
				break;
			}
		}
		if (isCanLvUp && skillLv < UserSkill.ins().maxLv && zzLv >= skillsOpenConfig.level) {
			this.m_MainBtnGroup.visible = true;
			let skillsUpgradeConfig = GlobalConfig.ins("SkillsUpgradeConfig")[skillLv + 1];
			if (skillsUpgradeConfig) {
				let needItemId = skillsOpenConfig.levelUpCost;
				this.needItemId = needItemId;
				let itemNum = UserBag.ins().getBagGoodsCountById(0, needItemId);
				let neeItemNum = skillsUpgradeConfig.cost;
				this.haveNum = itemNum;
				this.m_NeedItem.setData(this.needItemId, neeItemNum);
			}
		} else {
			if (zzLv < skillsOpenConfig.level) {
				this.m_FullLab.visible = true
				this.m_FullLab.text = LanguageString.jifengTiaoyueCh(GlobalConfig.jifengTiaoyueLg.st100267, [skillsOpenConfig.roleName]);//"转职为" + skillsOpenConfig.roleName + "后解锁";
				this.m_SkillLvLab.text = GlobalConfig.jifengTiaoyueLg.st100268;//"该职业未解锁";
				this.m_SkillLvLab.textColor = Color.Red;
			} else if (skillLv >= UserSkill.ins().maxLv) {
				this.m_FullLab.visible = true;
				this.m_FullLab.text = GlobalConfig.jifengTiaoyueLg.st100020;//"已满级";
				this.m_NextLvCont.text = "";
			} else if (!isCanLvUp) {
				this.m_FullLab.visible = true
				this.m_FullLab.text = GlobalConfig.jifengTiaoyueLg.st100269;//"没达到升级条件";
			}
		}
		if (data.curRole == 0 && data.index == 2 && UserFb.ins().guanqiaID == GuideQuanQiaType.SKILL) {
			if (UserSkill.ins().checkSkillGuide(2)) {
				Setting.currPart = 18;
				Setting.currStep = 3;
				GuideUtils.ins().show(this.m_UpLvBtn, 18, 3);
			}
		} else if (data.curRole == 0 && data.index == 3 && UserFb.ins().guanqiaID == GuideQuanQiaType.SKILL1) {
			if (UserSkill.ins().checkSkillGuide(3)) {
				Setting.currPart = 23;
				Setting.currStep = 3;
				GuideUtils.ins().show(this.m_UpLvBtn, 23, 3);
			}
		}
		// else if (data.curRole == 0 && data.index == 4 && UserFb.ins().guanqiaID == GuideQuanQiaType.SKILL2) {
		// if (UserSkill.ins().checkSkillGuide(4)) {
		// 	Setting.currPart = 25;
		// 	Setting.currStep = 3;
		// 	GuideUtils.ins().show(this.m_UpLvBtn, 25, 3);
		// }
		// }
		if (Setting.currPart == 18 && Setting.currStep == 4) {
			GuideUtils.ins().show(this.m_bg.closeButtomBtn, 18, 4);
			this.m_bg.closeButtomBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onClickClose, this);
		} else if (Setting.currPart == 23 && Setting.currStep == 4) {
			GuideUtils.ins().show(this.m_bg.closeButtomBtn, 23, 4);
			this.m_bg.closeButtomBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onClickClose, this);
		}
		// else if (Setting.currPart == 25 && Setting.currStep == 4) {
		// 	GuideUtils.ins().show(this.m_bg.closeButtomBtn, 25, 4);
		// 	this.m_bg.closeButtomBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onClickClose, this);
		// }
	}
	private onClickLvUpBtn() {
		GuideUtils.ins().next(this.m_UpLvBtn);
		let data: { job: number, curRole: number, index: number } = this.data;
		let skillLv = UserSkill.ins().getskillLv(data.curRole, data.index);
		let skillsUpgradeConfig = GlobalConfig.ins("SkillsUpgradeConfig")[skillLv + 1];
		if (skillsUpgradeConfig) {
			if (this.haveNum >= skillsUpgradeConfig.cost) {
				UserSkill.ins().sendGrewUpSkill(data.curRole, data.index);
			} else {
				UserTips.ins().showTips(GlobalConfig.jifengTiaoyueLg.st100217);
			}
		}
	}
	private onClickClose() {
		this.m_bg.closeButtomBtn.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onClickClose, this);
		SkillShowWin.isOpen = false;
		GuideUtils.ins().next(this.m_bg.closeButtomBtn);
		ViewManager.ins().close(this);
		MessageCenter.ins().dispatch(MessageDef.CLOSE_SKILLSHOWWIN_MSG, 1);
	}

	private m_BodyEff: MovieClip;
	private m_UpLvEff: MovieClip;
	private m_ItemEff: MovieClip;
	private playBodyEff() {
		this.m_BodyEff = ViewManager.ins().createEff(this.m_BodyEff, this.m_BodyEffGrouo, "eff_ui_upgrade");
		this.m_UpLvEff = ViewManager.ins().createEff(this.m_UpLvEff, this.m_LvUpEffGroup, "eff_ui_success");
		this.m_ItemEff = ViewManager.ins().createEff(this.m_ItemEff, this.m_ItemEffGroup, "eff_ui_iconUpgrade");
	}

	private onClickGetLab() {
		if (this.needItemId) {
			UserWarn.ins().setBuyGoodsWarn(this.needItemId);
		}
	}

}
ViewManager.ins().reg(SkillShowWin, LayerManager.UI_Popup);
window["SkillShowWin"] = SkillShowWin