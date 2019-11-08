class PetSkillChangeItem extends eui.ItemRenderer {
	public constructor() {
		super();
	}
	public m_PetSkillItem1: PetSkillItem;
	public m_Name1: eui.Label;
	public m_Cont1: eui.Label;
	public m_Shuo: eui.Image;
	public m_PetSkillItem2: PetSkillItem;
	public m_Name2: eui.Label;
	public m_Cont2: eui.Label;

	private isShou: boolean = false;

	public createChildren() {
		super.createChildren();
		this.addEvent();
		this.m_PetSkillItem1.type = 2;
		this.m_PetSkillItem2.type = 2;
	}

	private addEvent() {
		this.m_Shuo.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onClick, this);
	}
	public dataChanged() {
		super.dataChanged();
		let petModel = PetModel.getInstance;
		this.m_Shuo.visible = true;
		let data: { skill: number, washSkill: number, isShuo: boolean } = this.data;
		if (data.skill) {
			this.m_PetSkillItem1.setData(data.skill, 2);
			let skillsConfig = GlobalConfig.ins("SkillsConfig")[data.skill];
			if (skillsConfig) {
				this.m_Name1.text = skillsConfig.skinName;
				this.m_Cont1.text = skillsConfig.desc;
			}
		} else {
			this.m_PetSkillItem1.setShuo();
			this.m_Name1.text = "";
			this.m_Cont1.text = "";
			this.m_Shuo.visible = false;
		}
		if (data.washSkill) {
			this.m_PetSkillItem2.setData(data.washSkill, 2);
			let skillsConfig = GlobalConfig.ins("SkillsConfig")[data.washSkill];
			if (skillsConfig) {
				this.m_Name2.text = skillsConfig.skinName;
				this.m_Cont2.text = skillsConfig.desc;
			}
		} else {
			this.m_PetSkillItem2.setNot();
			this.m_Name2.text = "";
			this.m_Cont2.text = "";
		}
		if (data.isShuo == true) {
			this.m_Shuo.source = "comp_28_30_1_png";
		} else {
			this.m_Shuo.source = "comp_32_37_1_png";
		}
	}

	private onClick() {
		let data: { skill: number, washSkill: number, isShuo: boolean } = this.data;
		let petModel = PetModel.getInstance;
		let petData = petModel.getNowSelectPetData();
		PetSproto.ins().sendPetWashLockMsg(petData.petid, data.skill, !data.isShuo);
	}
}
window["PetSkillChangeItem"]=PetSkillChangeItem