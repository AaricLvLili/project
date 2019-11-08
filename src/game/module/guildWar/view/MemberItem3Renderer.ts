class MemberItem3Renderer extends eui.ItemRenderer {

	////////////////////////////////////////////////////////////////////////////////////////////////////
	// MemberItem3Skin.exml
	////////////////////////////////////////////////////////////////////////////////////////////////////
	public checkBoxs: eui.CheckBox
	private face: eui.Image
	private job: eui.Label
	private nameLable: eui.Label
	private payNum: eui.Label
	private attr: eui.Label
	public btn1: eui.Button
	public btn2: eui.Button
	private inputBg: eui.Image
	public num1: eui.TextInput
	private languageText: eui.Label;
	private languageText0: eui.Label;

	////////////////////////////////////////////////////////////////////////////////////////////////////

	public constructor() {
		super()
		this.skinName = "MemberItem3Skin"
		this.languageText.text = GlobalConfig.jifengTiaoyueLg.st101790 + "：";
		this.languageText0.text = GlobalConfig.jifengTiaoyueLg.st100809;
	}

	dataChanged() {
		try {
			var data = this.data as SelectInfoData
			this.job.textFlow = (new egret.HtmlTextParser).parser("[" + GuildLanguage.guildOffice(data.data.office) + "]<font color = '#DFD1B5'>" + data.data.name + "</font>")
			this.nameLable.text = ""
			this.payNum.text = "" + data.num
			this.attr.text = "" + data.data.attack
			this.face.source = ResDataPath.GetHeadMiniImgName(data.data.job, data.data.sex)

			if (data.chooseNum > 0) {
				this.checkBoxs.selected = true
				this.btn1.visible = this.btn2.visible = this.num1.visible = this.inputBg.visible = true
				this.num1.text = data.chooseNum + ""
			} else {
				this.checkBoxs.selected = false
				this.btn1.visible = this.btn2.visible = this.num1.visible = this.inputBg.visible = false
			}
		} catch (e) {

		}
	}
}
window["MemberItem3Renderer"] = MemberItem3Renderer