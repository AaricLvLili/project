class PetStateWin extends BaseEuiPanel {
	public constructor() {
		super()
		this.skinName = "PetStateWinSkin";
	}
	public m_BattleLab: eui.Label;
	public m_CloseBtn: eui.Button;
	public m_CloseBtn0: eui.Button;
	public m_Title: eui.Label;
	public m_SkillCont: eui.Label;
	public m_PetAnim: PetAnim;
	public m_PetSkillItem: PetSkillItem;
	public m_ScrollerSkill: eui.Scroller;
	public m_ListSkill: eui.List;
	public m_StateGroup: eui.Group;


	private m_PetData: PetData;

	private m_ListSkillData: eui.ArrayCollection;
	public m_Lan1: eui.Label;
	public m_Lan2: eui.Label;
	public m_Power: PowerLabel;

	public createChildren() {
		super.createChildren();
		this.m_ListSkill.itemRenderer = PetSkillIconItem;
		this.m_ListSkillData = new eui.ArrayCollection();
		this.m_ListSkill.dataProvider = this.m_ListSkillData;
		this.m_PetAnim.shPower();
		this.m_Lan1.text = GlobalConfig.jifengTiaoyueLg.st101131;
		this.m_Lan2.text = GlobalConfig.jifengTiaoyueLg.st101132;
		this.m_Title.text = GlobalConfig.jifengTiaoyueLg.st101133;
	}
	initUI() {
		super.initUI();
	}
	open(...param: any[]) {
		this.m_PetData = param[0];
		this.addViewEvent();
		this.setData();
	}
	close() {
		this.release();
	}
	public release() {
		this.m_PetAnim.release();
	}
	private addViewEvent() {
		this.AddClick(this.m_CloseBtn, this.onClickClose);
		this.AddClick(this.m_CloseBtn0, this.onClickClose);
	}
	private setData() {
		let petData = this.m_PetData;
		let petModel = PetModel.getInstance;
		let power = 0;
		if (petData.power == 0) {
			let attr = petModel.getPetAttr(petData.petid, 1, 0);
			power = Math.floor(UserBag.getAttrPower(attr));
			this.m_Power.text = power;
			AttributeData.setAttrGroup(attr, this.m_StateGroup);
		} else {
			this.m_Power.text = petData.power;
		}
		let skillsConfig = GlobalConfig.ins("SkillsConfig")[petData.skill];
		if (skillsConfig) {
			this.m_SkillCont.text = skillsConfig.desc
		}
		this.m_PetAnim.setPetData(petData.petid);
		this.m_PetSkillItem.setData(petData.skill, 1);
		let allSkillList = [];
		for (var i = 0; i < petData.bskill.length; i++) {
			let petSkillData = { id: petData.bskill[i], type: 2 };
			allSkillList.push(petSkillData);
		}
		this.m_ListSkillData.replaceAll(allSkillList);
		if (petData.attr.length > 0) {
			AttributeData.setAttrGroup(petData.fightAttr, this.m_StateGroup);
		}
	}

	private onClickClose() {
		ViewManager.ins().close(this);
	}
}

ViewManager.ins().reg(PetStateWin, LayerManager.UI_Popup);
window["PetStateWin"] = PetStateWin