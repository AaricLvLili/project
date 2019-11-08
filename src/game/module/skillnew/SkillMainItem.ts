class SkillMainItem extends eui.ItemRenderer {
	public constructor() {
		super();
	}
	public m_SkillRoleAnim: SkillRoleAnim;
	public m_Scroller: eui.Scroller;
	public m_List: eui.List;
	public m_JobLab: eui.Label;
	public m_JobImg: eui.Image;
	public m_Img: eui.Image;
	private listData: eui.ArrayCollection;


	public createChildren() {
		super.createChildren();
		this.m_List.itemRenderer = SkillJobIconItem;
		this.listData = new eui.ArrayCollection();
		this.m_List.dataProvider = this.listData;

	}


	public dataChanged() {
		super.dataChanged();
		let data: { job: number, level: number, curRole: number } = this.data;
		var subRole = SubRoles.ins().getSubRoleByIndex(data.curRole);
		let config = GlobalConfig.ins("SkillsOpenConfig")[data.job]
		let skillData = [];
		for (var i = 0; i < config.length; i++) {
			if (config[i].level == data.level) {
				let newData = { job: data.job, curRole: data.curRole, index: config[i].index };
				skillData.push(newData);
			}
		}
		if (skillData.length >= 5) {
			this.m_List.layout["requestedRowCount"] = 2;
			this.m_Img.source = "comp_33_75_1_png";
		} else {
			this.m_List.layout["requestedRowCount"] = 1;
			this.m_Img.source = "comp_33_75_2_png";
		}
		this.listData.replaceAll(skillData);
		this.m_SkillRoleAnim.setData(data.curRole, data.level, data.job);
		this.m_SkillRoleAnim.hideJob();
		let transferAppearanceConfig = GlobalConfig.ins("TransferAppearanceConfig")[data.job][data.level];
		this.m_JobLab.text = transferAppearanceConfig.targetJob;
		this.m_JobImg.source = "zsjob_" + data.job + "_" + data.level + "_png";
	}


	public release() {
		this.m_SkillRoleAnim.release();
	}



}
window["SkillMainItem"] = SkillMainItem