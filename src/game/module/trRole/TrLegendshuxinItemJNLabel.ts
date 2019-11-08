class TrLegendshuxinItemJNLabel extends eui.ItemRenderer {
	public constructor() {
		super()
		this.skinName = "TrLegendshuxinItemLabelJNSkin"
	}

	public icon: eui.Image;
	public title: eui.Label;
	public desc: eui.Label;

	public dataChanged() {
		this.jingMaiData();
		this.jmTfiData();
	}

	//经脉技能
	jingMaiData() {
		let jmdata = this.data
		let jmIndex = jmdata.skillid
		if (jmIndex == null) return;
		let skillsConfig = GlobalConfig.ins("SkillsConfig")[jmIndex];
		this.icon.source = `${skillsConfig.icon}_png`;
		this.title.text = `${skillsConfig.skinName} LV.${skillsConfig.displayLevel}`;
		this.desc.text = skillsConfig.desc;
	}

	//天赋经脉技能
	jmTfiData() {
		let talentid = this.data.talentid
		let talentlevel = this.data.talentlevel
		if (talentid == null || talentlevel == null) return;
		let tfConfig = GlobalConfig.ins("TransferTalentConfig")[talentid][talentlevel];
		// if (tfConfig == null) return;
		this.desc.visible = false;
		if (tfConfig.attrs.length == 0) {
			let jxData = tfConfig.skillTips
			let skillsConfig = GlobalConfig.ins("SkillsConfig")[jxData];
			this.icon.source = `${skillsConfig.icon}_png`;
			this.title.text = skillsConfig.desc;
		} else {
			this.icon.source = `${tfConfig.TalentID}_png`;
			let descText = StringUtils.complementByChar(AttributeData.getAttrStrByType(tfConfig.attrs[0].type), 0) + ": " + AttributeData.getAttStrByType(tfConfig.attrs[0]);
			this.title.text = descText;
		}
	}

}
window["TrLegendshuxinItemJNLabel"] = TrLegendshuxinItemJNLabel 