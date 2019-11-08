class ZsBossRuleSpeak extends BaseEuiPanel {
    
	static LAYER_LEVEL = LayerManager.UI_Popup
	
	public constructor() {
		super()
	}
	textInfo
	background
	group
	txtTitle

	initUI() {
		super.initUI()
		this.skinName = "HelpTipsSkin";
	};
	open(...param: any[]) {
		// var index = param[0] + 1;
		var str = param[2];
		if (str)
		{
			this.textInfo.textFlow = TextFlowMaker.generateTextFlow(str);
		}
		else
		{
			var index = param[0]
			let config = GlobalConfig.ins("HelpInfoConfig")[index]
			if (config) {
				this.textInfo.textFlow = TextFlowMaker.generateTextFlow(config.text);
			} else {
				this.textInfo.text = GlobalConfig.jifengTiaoyueLg.st101892;
			}
		}
		
		// this.textInfo.height = this.textInfo.textHeight;
		// this.background.height = this.textInfo.textHeight + 100;
		// this.group.y = (StageUtils.ins().getHeight() - this.background.height) / 2;
		this.AddClick(this, this.otherClose);
		var isTitle = param[1]
		if (isTitle)
			this.txtTitle.textFlow = TextFlowMaker.generateTextFlow(isTitle)
		
	};
	close() {
		
	};
	otherClose(evt) {
		ViewManager.ins().close(this);
	};
}

window["ZsBossRuleSpeak"]=ZsBossRuleSpeak