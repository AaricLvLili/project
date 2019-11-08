class SkillIcon extends eui.Component {
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
	public m_TipsImg: eui.Image;
	public createChildren() {
		super.createChildren();
		this.m_Mask.visible = false;
		this.m_LvLab.visible = false;
		this.m_Shuo.visible = false;
	}
	public setData(data: { job: number, curRole: number, index: number }) {
		let skillLv = UserSkill.ins().getskillLv(data.curRole, data.index);
		let skillId = UserSkill.ins().getSkillId(data.job, data.index, skillLv);
		let skillsConfig = GlobalConfig.ins("SkillsConfig")[skillId];
		if (skillsConfig) {
			this.m_Icon.source = skillsConfig.icon + "_png";
			if (skillsConfig.skillType == SkillType.TYPE1) {
				this.m_MainSkill.visible = true;
				this.m_TipsImg.source = "comp_26_26_4_png";
			} else if (skillsConfig.skillType == SkillType.TYPE4) {
				this.m_MainSkill.visible = true;
				this.m_TipsImg.source = "comp_26_26_3_png";
			} else {
				this.m_MainSkill.visible = false;
			}
		}
	}
}
window["SkillIcon"] = SkillIcon