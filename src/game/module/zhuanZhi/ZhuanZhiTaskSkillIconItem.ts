class ZhuanZhiTaskSkillIconItem extends eui.ItemRenderer {
	public constructor() {
		super();
		this.skinName = "SkillIconSkin";
	}
	public m_MianGroup: eui.Group;
	public m_Bg: eui.Image;
	public m_Icon: eui.Image;
	public m_LvLab: eui.Label;
	public m_MainSkill: eui.Group;
	public m_Shuo: eui.Label;
	public m_Mask: eui.Rect;



	public createChildren() {
		super.createChildren();
		this.m_MainSkill.visible = false;
		this.m_Shuo.visible = false;
		this.m_LvLab.visible = false;
		this.m_Mask.visible = false;
		this.addEvent();
	}

	private addEvent() {
		this.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onClick, this);
	}
	public dataChanged() {
		super.dataChanged();
		let data: { job: number, curRole: number, index: number } = this.data;
		let skillLv = UserSkill.ins().getskillLv(data.curRole, data.index);
		let skillID = UserSkill.ins().getSkillId(data.job, data.index, skillLv);
		let skillsConfig = GlobalConfig.ins("SkillsConfig")[skillID];
		if (skillsConfig) {
			this.m_Icon.source = skillsConfig.icon + "_png";
		}
	}
	private onClick() {
		let data: { job: number, curRole: number, index: number } = this.data;
		ViewManager.ins().open(SkillShowWin, data);
	}

}
window["ZhuanZhiTaskSkillIconItem"]=ZhuanZhiTaskSkillIconItem