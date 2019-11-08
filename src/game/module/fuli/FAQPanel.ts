class FAQPanel extends eui.Component {
	des: eui.Label;
	private opinionBtn: eui.Button;
	public constructor() {
		super()
		this.skinName = "FAQSkin"
		var desc: string = GlobalConfig.jifengTiaoyueLg.st100030;

		this.des.text = desc;
		if(SdkMgr.currSdk==SdkMgr.P_TYPE_8){
			this.des.text = "经典大作回归，缔造只属于你的神装!\n如果您在游戏过程中有发现bug和游戏问题，及对游戏的建议想法，欢迎您联系我们客服反馈。核实采纳后将会给您50-1000不等的钻石奖励。加群更有丰厚礼包哦！\n客服QQ：3091603763"
		}
		this.opinionBtn.label = GlobalConfig.jifengTiaoyueLg.st100031;
	}

	open() {
		this.opinionBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.tapClick, this);
	}

	close() {
		this.opinionBtn.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.tapClick, this);
	}

	private tapClick(e: egret.TouchEvent): void {
		ViewManager.ins().open(OpinionPanel);
	}
}
window["FAQPanel"] = FAQPanel