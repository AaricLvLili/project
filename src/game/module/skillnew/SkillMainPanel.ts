class SkillMainPanel extends BaseView implements ICommonWindowTitle, ICommonWindowRoleSelect {
	m_RoleSelectPanel?: RoleSelectPanel;
	mWindowHelpId = 32;
	public constructor(data?: any) {
		super();
		this.skinName = "SkillMainPanelSkin";
		this.touchEnabled = false;
	}

	public m_Scroller: eui.Scroller;
	public m_List: eui.List;
	public m_MainScroller: eui.Scroller;
	public m_MainList: eui.List;
	public m_SkillRecomBtn: eui.Button;

	public totalPower: PowerLabel;
	private listData: eui.ArrayCollection;
	private mainlistData: eui.ArrayCollection;

	public static Scroller: eui.Scroller;


	private isInguide = false;
	private isInguide2 = false;


	public m_GuideGroup: eui.Group;
	public m_GuideSkillChangeJobIcon: SkillJobIconItem;
	public m_GuideSkillChangeIcon: SkillIconItem;
	public m_Finger: eui.Image;
	public m_GuideGroup0: eui.Group;
	public m_GuideSkillChangeJobIcon0: SkillJobIconItem;
	public m_GuideSkillChangeIcon0: SkillIconItem;
	public m_Finger0: eui.Image;
	public m_GuideGroup1: eui.Group;
	public m_GuideSkillChangeJobIcon1: SkillJobIconItem;
	public m_GuideSkillChangeIcon1: SkillIconItem;
	public m_Finger1: eui.Image;
	public m_GuideMianSkillChangeJobIcon: SkillJobIconItem;
	public m_GuideMianSkillChangeJobIcon0: SkillJobIconItem;
	public m_GuideMianSkillChangeJobIcon1: SkillJobIconItem;

	private languageTxt0: eui.Label;
	private languageTxt1: eui.Label;

	protected childrenCreated() {
		super.childrenCreated();
		this.m_List.itemRenderer = SkillMainItem;
		this.listData = new eui.ArrayCollection();
		this.m_List.dataProvider = this.listData;

		this.m_MainList.itemRenderer = SkillIconItem;
		this.mainlistData = new eui.ArrayCollection();
		this.m_MainList.dataProvider = this.mainlistData;
		SkillMainPanel.Scroller = this.m_Scroller;

		this.languageTxt0.text = GlobalConfig.jifengTiaoyueLg.st100250;
		this.languageTxt1.text = GlobalConfig.jifengTiaoyueLg.st100252;
		this.m_SkillRecomBtn.label = GlobalConfig.jifengTiaoyueLg.st100251;
		this.m_SkillRecomBtn.visible = false;//屏蔽推荐按钮
	};
	private addViewEvent() {
		this.observe(MessageDef.SKILL_UPDATE, this.initData);
		this.observe(MessageDef.SKILL_UPGRADE, this.initData);
		this.observe(MessageDef.SKILL_GREWUPALL, this.initData);
		this.observe(MessageDef.CLOSE_SKILLSHOWWIN_MSG, this.checkGuide);
		this.observe(MessageDef.GUIDE_SKILL_END, this.hideSkillGuide);
		this.AddClick(this.m_SkillRecomBtn, this.onClickSkillRecomBtn);
		this.AddClick(this.m_GuideMianSkillChangeJobIcon, this.compeleGuide);
		this.AddClick(this.m_GuideMianSkillChangeJobIcon0, this.compeleGuide);
		this.AddClick(this.m_GuideMianSkillChangeJobIcon1, this.compeleGuide);

	}
	private removeEvent() {
	}

	public open() {
		this.m_GuideGroup.visible = false;
		this.m_GuideMianSkillChangeJobIcon.visible = false;
		this.m_GuideGroup0.visible = false;
		this.m_GuideMianSkillChangeJobIcon0.visible = false;
		this.m_GuideGroup1.visible = false;
		this.m_GuideMianSkillChangeJobIcon1.visible = false;
		this.addViewEvent();
		this.initData();
	};
	public close() {
		this.isInguide = false;
		this.isInguide2 = false;
		this.removeEvent();
	};

	public release() {
		egret.Tween.removeTweens(this.m_Finger);
		egret.Tween.removeTweens(this.m_Finger0);
		egret.Tween.removeTweens(this.m_Finger1);
		let numClild = this.m_List.numChildren;
		for (var i = 0; i < numClild; i++) {
			let child = this.m_List.getChildAt(i);
			if (child instanceof SkillMainItem) {
				child.release();
			}
		}
	}

	private initData() {
		let curRole = this.m_RoleSelectPanel.getCurRole();
		var subRole = SubRoles.ins().getSubRoleByIndex(curRole);
		let fKeyConfig = GlobalConfig.ins("SkillsOpenConfig");
		let sKeyConfig = fKeyConfig[subRole.job];
		let mainData = [];
		for (var i = 0; i < 4; i++) {
			let newData = { job: subRole.job, level: i, curRole: curRole };
			mainData.push(newData);
		}
		this.listData.replaceAll(mainData);
		let skillIndex = subRole.skillsDataIndex;
		let skillIds = subRole.skillsData
		let mainListData: { skillId: number, job: number, curRole: number, index: number }[] = [];
		for (var i = 0; i < 7; i++) {
			let skillId = -1;
			let index = -1;
			if (skillIndex[i] != null) {
				index = skillIndex[i];
				let skillLv = skillIds[index - 1];
				skillId = UserSkill.ins().getSkillId(subRole.job, index, skillLv);
			}
			let mainData = { skillId: skillId, job: subRole.job, curRole: curRole, index: index };
			mainListData.push(mainData);
		}
		this.mainlistData.replaceAll(mainListData);
		this.setRetPoint();
		this.totalPower.text = subRole.power.toString();
		this.checkGuide();

	}

	private onClickSkillRecomBtn() {
		let curRole = this.m_RoleSelectPanel.getCurRole();
		ViewManager.ins().open(SkillRecomWin, curRole);
	}

	private setRetPoint() {
		for (var i = 0; i < SubRoles.ins().rolesModel.length; i++) {
			let isCanSkillUp = UserSkill.ins().checkRoleSkillCanLvUp(i);
			let isCanAddSkill = UserSkill.ins().checkAddSkillRedPoint(i);
			let isShowRedPoint = false;
			if (isCanSkillUp == true || isCanAddSkill == true) {
				isShowRedPoint = true;
			}
			this.m_RoleSelectPanel.showRedPoint(i, isShowRedPoint);
		}
	};

	UpdateContent(): void {
		this.initData();
	}

	private checkGuide() {
		// this.checkSkill(GuideQuanQiaType.SKILL, this.m_GuideMianSkillChangeJobIcon, 18, 2, 2);
		// this.checkSkill(GuideQuanQiaType.SKILL1, this.m_GuideMianSkillChangeJobIcon0, 23, 2, 3);
		// this.checkSkill(GuideQuanQiaType.SKILL2, this.m_GuideMianSkillChangeJobIcon1, 25, 2, 4);
		// this.checkAddSkillGuide(GuideQuanQiaType.SKILL, 19, 2, this.m_GuideSkillChangeJobIcon, this.m_GuideSkillChangeIcon, this.m_GuideGroup, this.m_Finger);
		// this.checkAddSkillGuide(GuideQuanQiaType.SKILL1, 24, 3, this.m_GuideSkillChangeJobIcon0, this.m_GuideSkillChangeIcon0, this.m_GuideGroup0, this.m_Finger0);
		// this.checkAddSkillGuide(GuideQuanQiaType.SKILL2, 26, 4, this.m_GuideSkillChangeJobIcon1, this.m_GuideSkillChangeIcon1, this.m_GuideGroup1, this.m_Finger1);
	}


	private compeleGuide() {
		this.m_GuideMianSkillChangeJobIcon.visible = false;
		this.m_GuideMianSkillChangeJobIcon0.visible = false;
		this.m_GuideMianSkillChangeJobIcon1.visible = false;
	}

	private checkSkill(guideQuanQiaType: GuideQuanQiaType, skillJobIconItem: SkillJobIconItem, currPart: number, currStep: number, skillIndex: number) {
		let curRole = this.m_RoleSelectPanel.getCurRole();
		var subRole = SubRoles.ins().getSubRoleByIndex(curRole);
		if (curRole == 0 && UserFb.ins().guanqiaID == guideQuanQiaType) {
			if (UserSkill.ins().checkSkillGuide(skillIndex)) {
				let data = { job: subRole.job, curRole: 0, index: skillIndex }
				skillJobIconItem.data = data;
				skillJobIconItem.dataChanged();
				if (this.isInguide == false) {
					Setting.currPart = currPart;
					Setting.currStep = currStep;
					skillJobIconItem.visible = true;
					GuideUtils.ins().show(skillJobIconItem, currPart, currStep)
					this.isInguide = true;
				}
			}
		}
	}


	private checkAddSkillGuide(guideQuanQiaType: GuideQuanQiaType, guideId: number, skillIndex: number, skillJobIconItem: SkillJobIconItem, skillIconItem: SkillIconItem, guideGroup: eui.Group, finger: eui.Image) {
		let curRole = this.m_RoleSelectPanel.getCurRole();
		var subRole = SubRoles.ins().getSubRoleByIndex(curRole);
		if (UserSkill.ins().checkSkillAddGuide(guideId, skillIndex) && SkillShowWin.isOpen == false && UserFb.ins().guanqiaID == guideQuanQiaType) {
			skillJobIconItem.guideRemoveEvent();
			let data = { job: subRole.job, curRole: 0, index: skillIndex }
			skillJobIconItem.data = data;
			skillJobIconItem.dataChanged();
			let mainData = { skillId: -1, job: subRole.job, curRole: curRole, index: -1 };
			skillIconItem.data = mainData;
			skillIconItem.dataChanged();
			skillIconItem.isGuideUser = true;
			skillIconItem.itemIndex = skillIndex - 1;
			if (this.isInguide2 == false) {
				Setting.currPart = guideId;
				Setting.currStep = 0;
				egret.Tween.get(finger, { loop: true }).
					to({ x: skillIconItem.width / 2 + skillIconItem.x, y: skillIconItem.height / 2 + skillIconItem.y }, 1000).wait(300).
					call(() => {
						finger.x = skillJobIconItem.width / 2;
						finger.y = skillJobIconItem.height / 2;
					})
				guideGroup.visible = true;
				GuideUtils.ins().show(guideGroup, guideId, 0)
				this.isInguide2 = true;
				GuideUtils.ins().hideFinge();
			}
		}
	}
	private hideSkillGuide() {
		GuideUtils.ins().next(this.m_GuideGroup);
		GuideUtils.ins().next(this.m_GuideGroup0);
		GuideUtils.ins().next(this.m_GuideGroup1);
		egret.Tween.removeTweens(this.m_Finger);
		egret.Tween.removeTweens(this.m_Finger0);
		egret.Tween.removeTweens(this.m_Finger1);
		this.m_GuideGroup.visible = false;
		this.m_GuideGroup0.visible = false;
		this.m_GuideGroup1.visible = false;
	}
}
window["SkillMainPanel"] = SkillMainPanel