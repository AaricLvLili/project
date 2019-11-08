class CustomServicePanel extends BaseChatPanel implements ICommonWindowTitle {

	defaultText = GlobalConfig.jifengTiaoyueLg.st101711
	input: eui.TextInput
	/** 描述文字*/
	public desc: eui.Label;

	public constructor() {
		super()
	}
	windowTitleIconName: string = GlobalConfig.jifengTiaoyueLg.st101717;
	childrenCreated() {
		// this.input.textDisplay.fontFamily = "Microsoft YaHei"
		// this.input.textDisplay.size = 16
		// this.input.textDisplay.lineSpacing = 0
		// this.input.textDisplay.multiline = !0
		// this.input.textDisplay.wordWrap = !0
		// this.input.textDisplay.height = 272
		// this.input.textDisplay.textAlign = "left"
		// this.input.textDisplay.verticalAlign = "top"
		// 0 == this.input.text.length ? (this.input.prompt = this.defaultText, this.input.textColor = 7105644) : this.input.textColor = 14668213
	}
	open() {
		this.addTouchEvent(this, this.onTap, this.sendBtn)
	}

	onTap(t) {
		return 0 == this.input.text.length || this.input.text == this.defaultText ? void UserTips.ins().showTips(GlobalConfig.jifengTiaoyueLg.st101718) : void ReportData.getIns().advice(this.input.text, this.callBack, this)
	}

	callBack() {
		this.input.text = ""
	}

	UpdateContent(): void {

	}
}
window["CustomServicePanel"] = CustomServicePanel