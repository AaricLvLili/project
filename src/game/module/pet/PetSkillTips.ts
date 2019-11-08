class PetSkillTips extends BaseEuiPanel {
	public constructor() {
		super()
		this.skinName = "PetSkillTipsSkin";
	}
	public m_TouchBg: eui.Rect;
	public m_MainGroup: eui.Group;
	private data: { skillId: number, point: egret.Point, type: number };

	public m_PetSkillItem: PetSkillItem;
	public m_Name: eui.Label;
	public m_Cont: eui.Label;
	public m_Type: eui.Label;


	initUI() {
		super.initUI();
	}
	open(...param: any[]) {
		this.m_PetSkillItem.removeEvent();
		this.addViewEvent();
		this.data = param[0];
		this.setData();
	}
	close() {
		this.release();
	}
	public release() {
	}
	private addViewEvent() {
		this.AddClick(this.m_TouchBg, this.onClickClose);
	}
	private setData() {
		let skillsConfig = GlobalConfig.ins("SkillsConfig")[this.data.skillId];
		if (skillsConfig) {
			this.m_PetSkillItem.setData(this.data.skillId, this.data.type);
			this.m_Name.text = skillsConfig.skinName;
			this.m_Cont.text = skillsConfig.desc;
		}
		if (this.data.type == 1) {
			this.m_Type.text = GlobalConfig.jifengTiaoyueLg.st101349;
		} else {
			this.m_Type.text = GlobalConfig.jifengTiaoyueLg.st101350;
		}
		// if (this.data) {
		// this.m_MainGroup.x = this.data.point.x;
		// this.m_MainGroup.y = this.data.point.y;
		// }
	}

	private onClickClose() {
		ViewManager.ins().close(this);
	}
}

ViewManager.ins().reg(PetSkillTips, LayerManager.UI_Popup);
window["PetSkillTips"] = PetSkillTips