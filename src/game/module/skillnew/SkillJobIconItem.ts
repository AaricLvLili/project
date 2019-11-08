class SkillJobIconItem extends eui.ItemRenderer {
	public constructor() {
		super();
		this.skinName = "SkillIconSkin";
	}
	public m_MianGroup: eui.Group;
	public m_Bg: eui.Image;
	public m_Icon: eui.Image;
	public m_LvLab: eui.Label;
	public m_MainSkill: eui.Group;
	public m_Mask: eui.Rect;
	public m_Shuo: eui.Label;

	public m_RedPoint: eui.Image;

	private isCanUse: boolean = false;

	public static img: SkillMoveImg;

	private isCanMove: boolean = false;
	// private languageTxt: eui.Label;
	public m_TipsImg: eui.Image;

	public createChildren() {
		super.createChildren();
		this.addEvent();
		// this.languageTxt.text = GlobalConfig.languageConfig.st100254;
	}

	private addEvent() {
		this.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.onClickBegin, this, true, 10);
		this.addEventListener(egret.TouchEvent.TOUCH_END, this.onClickEnd, this);
		this.addEventListener(egret.TouchEvent.TOUCH_RELEASE_OUTSIDE, this.onClickEnd, this, true, 10);
		this.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onClick, this);
	}

	public guideRemoveEvent() {
		this.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onClick, this);
	}


	public dataChanged() {
		super.dataChanged();
		this.m_MainSkill.visible = false;
		this.m_Mask.visible = false;
		this.m_Shuo.visible = false;
		this.m_LvLab.visible = false;
		this.isCanUse = false;

		let data: { job: number, curRole: number, index: number } = this.data;
		let skillJobLv: number;
		var subRole = SubRoles.ins().getSubRoleByIndex(data.curRole);
		let skillLv = UserSkill.ins().getskillLv(data.curRole, data.index);
		let skillID = UserSkill.ins().getSkillId(data.job, data.index, skillLv);
		let skillsConfig = GlobalConfig.ins("SkillsConfig")[skillID];
		if (skillsConfig) {
			this.m_Icon.source = skillsConfig.icon + "_png";
			if (skillsConfig.skillType == SkillType.TYPE1) {
				this.m_MainSkill.visible = true;
				this.m_TipsImg.source = "comp_26_26_4_png";
			} else if (skillsConfig.skillType == SkillType.TYPE4) {
				this.m_MainSkill.visible = true;
				this.m_TipsImg.source = "comp_26_26_3_png";
			}
		}
		/**3key配置读取有点问题 */
		let config = GlobalConfig.ins("SkillsOpenConfig")[data.job];
		let skillsOpenConfig = null;
		for (var i = 0; i < config.length; i++) {
			if (config[i].index == data.index) {
				skillsOpenConfig = config[i];
				skillJobLv = config[i].level;
				break;
			}
		}
		if (skillsOpenConfig) {
			let zzlevel = ZhuanZhiModel.ins().getZhuanZhiLevel(data.curRole);
			if (zzlevel >= skillJobLv) {
				if (skillLv <= 0) {
					this.m_Mask.visible = true;
					this.m_Shuo.visible = true;
					this.m_Shuo.text = GlobalConfig.jifengTiaoyueLg.st100340;//未激活
				} else {
					if (skillLv == UserSkill.ins().maxLv) {
						this.m_LvLab.text = "MAX";
					} else {
						this.m_LvLab.text = "Lv." + skillLv + "/" + UserSkill.ins().maxLv;
					}
					let skillConfig = GlobalConfig.ins("SkillsConfig")[skillsOpenConfig.skillId];
					if (skillConfig && skillConfig.skillType != SkillType.TYPE4) {
						this.isCanUse = true;
					}
					this.m_LvLab.visible = true;
				}
			} else {
				this.m_Mask.visible = true;
				this.m_Shuo.visible = true;
				this.m_Shuo.text = GlobalConfig.jifengTiaoyueLg.st100253;//"未解锁";
			}
		}
		let isCanLvUP = UserSkill.ins().checkSkillCanLvUp(data.curRole, data.index);
		if (isCanLvUP) {
			this.m_RedPoint.visible = true;
		} else {
			this.m_RedPoint.visible = false;
		}
	}

	private onClickBegin(evt: egret.TouchEvent) {
		this.stage.removeEventListener(egret.TouchEvent.TOUCH_MOVE, this.onClickMove, this);
		this.stage.removeEventListener(egret.TouchEvent.TOUCH_END, this.onClickEnd, this);
		if (this.isCanUse == true) {
			this.stage.addEventListener(egret.TouchEvent.TOUCH_MOVE, this.onClickMove, this);
			this.stage.addEventListener(egret.TouchEvent.TOUCH_END, this.onClickEnd, this);
			if (!SkillJobIconItem.img) {
				SkillJobIconItem.img = new SkillMoveImg();
				SkillJobIconItem.img.width = 60;
				SkillJobIconItem.img.height = 60;
				SkillJobIconItem.img.anchorOffsetX = SkillJobIconItem.img.width / 2;
				SkillJobIconItem.img.anchorOffsetY = SkillJobIconItem.img.height / 2;
				SkillJobIconItem.img.touchEnabled = false;
			}
			SkillMainPanel.Scroller.scrollPolicyV = eui.ScrollPolicy.OFF;
			let data: { job: number, level: number, curRole: number, index: number } = this.data;
			SkillJobIconItem.img.setData(data);
			this.stage.addChild(SkillJobIconItem.img);
			let x = evt.stageX;
			let y = evt.stageY;
			SkillJobIconItem.img.x = x;
			SkillJobIconItem.img.y = y;
		}
	}

	private onClickMove(evt: egret.TouchEvent) {
		let x = evt.stageX;
		let y = evt.stageY;
		if (SkillJobIconItem.img) {
			SkillJobIconItem.img.x = x;
			SkillJobIconItem.img.y = y;
		}
	}

	private onClickEnd(evt: egret.TouchEvent) {
		if (SkillJobIconItem.img) {
			SkillJobIconItem.img.release();
		}
		if (SkillMainPanel.Scroller) {
			SkillMainPanel.Scroller.scrollPolicyV = eui.ScrollPolicy.ON;
		}
		if (this.stage) {
			this.stage.removeEventListener(egret.TouchEvent.TOUCH_MOVE, this.onClickMove, this);
		}
	}

	private onClick() {
		let data: { job: number, curRole: number, index: number } = this.data;
		GuideUtils.ins().next(this);
		ViewManager.ins().open(SkillShowWin, data);
	}


}
window["SkillJobIconItem"] = SkillJobIconItem