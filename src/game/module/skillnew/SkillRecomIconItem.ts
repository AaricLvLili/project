class SkillRecomIconItem extends eui.ItemRenderer {
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

	public isCanUse: boolean = false;
	public index: number = -1;
	public m_TipsImg: eui.Image;
	public createChildren() {
		super.createChildren();
		this.addEvent();
	}

	private addEvent() {
		this.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onClick, this);
	}

	private removeEvent() {
		this.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onClick, this);
	}
	public dataChanged() {
		super.dataChanged();
		let data: { job: number, curRole: number, index: number } = this.data;
		this.index = data.index;
		this.m_MainSkill.visible = false;
		this.m_Mask.visible = false;
		this.m_Shuo.visible = false;
		this.m_LvLab.visible = false;
		this.isCanUse = false;
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
		let skillJobLv: number;
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
					this.m_Shuo.text = GlobalConfig.jifengTiaoyueLg.st100273;//未学习
				} else {
					if (skillLv == UserSkill.ins().maxLv) {
						this.m_LvLab.text = "MAX";
					} else {
						this.m_LvLab.text = "Lv." + skillLv + "/" + UserSkill.ins().maxLv;
					}
					this.m_LvLab.visible = true;
					this.isCanUse = true;
				}
			} else {
				this.m_Mask.visible = true;
				this.m_Shuo.visible = true;
				this.m_Shuo.text = GlobalConfig.jifengTiaoyueLg.st100253;//未解锁
			}
		}
	}
	private onClick() {
		let nowData: { job: number, curRole: number, index: number, jobLv: number } = this.data;
		let data = { job: nowData.job, curRole: nowData.curRole, index: nowData.index };
		ViewManager.ins().open(SkillShowWin, data);
	}
}
window["SkillRecomIconItem"] = SkillRecomIconItem