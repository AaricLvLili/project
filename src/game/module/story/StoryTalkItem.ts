class StoryTalkItem extends eui.Component {
	public constructor() {
		super();
		this.skinName = "StoryTalkItemSkin";
	}
	public m_Tips1: eui.Label;
	public m_Tips2: eui.Label;
	public m_Tips3: eui.Label;
	public m_RoleImg: eui.Image;
	public m_NameLab: eui.Label;


	public createChildren() {
		super.createChildren();
	}

	private dialogueConfig: any

	public setData(dialogueConfig: any) {
		this.dialogueConfig = dialogueConfig;
		switch (dialogueConfig.type) {
			case GuideJQType.TYPE1:
				this.currentState = "state1";
				break;
			case GuideJQType.TYPE2:
				this.currentState = "state3";
				break;
			case GuideJQType.TYPE5:
				this.currentState = "state2";
				break;
		}
		TimerManager.ins().doNext(this.setLab(), this);
	}

	private setLab() {
		if (this.dialogueConfig) {
			if (this.dialogueConfig.txt) {
				this.m_Tips1.textFlow = TextFlowMaker.generateTextFlow(this.dialogueConfig.txt);
			}
			if (this.dialogueConfig.txt2) {
				this.m_Tips2.textFlow = TextFlowMaker.generateTextFlow(this.dialogueConfig.txt2);
			}
			if (this.dialogueConfig.txt3) {
				this.m_Tips3.textFlow = TextFlowMaker.generateTextFlow(this.dialogueConfig.txt3);
			}
			let role = SubRoles.ins().getSubRoleByIndex(0);
			if (this.dialogueConfig.img == "0") {
				let sex = role.sex;
				let job = role.job;
				this.m_RoleImg.source = "comp_jq_role_" + sex + job + "_png";
			} else {
				this.m_RoleImg.source = this.dialogueConfig.img + "_png";
			}
			if (this.dialogueConfig.name == "0") {
				this.m_NameLab.text = role.name;
			} else {
				this.m_NameLab.text = this.dialogueConfig.name;
			}
		}
	}
}
window["StoryTalkItem"] = StoryTalkItem