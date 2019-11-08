class AcrossLadderChallengeTip extends BaseEuiPanel {

	public opHeadBG: eui.Image;
	public opHead: eui.Image;
	public opName: eui.Label;
	public opRank: eui.Label;
	public opLv: eui.Label;
	public opPower: eui.Label;
	public btnChallenge: eui.Button;
	//private dialogCloseBtn:eui.Button;
	public m_Lan1: eui.Label;
	public titleLabel: eui.Label;
	public m_bg: CommonPopBg;

	public constructor() {
		super()
	}

	initUI() {
		super.initUI()
		this.skinName = "AcrossLadderChallengeTipSkin"
		this.m_Lan1.text = GlobalConfig.jifengTiaoyueLg.st101465;
		this.btnChallenge.label = GlobalConfig.jifengTiaoyueLg.st100046;
		this.titleLabel.text = GlobalConfig.jifengTiaoyueLg.st101466;
		this.m_bg.init("AcrossLadderChallengeTip", GlobalConfig.jifengTiaoyueLg.st100367)
	}

	open() {
		for (var e = [], t = 0; t < arguments.length; t++) e[t] = arguments[t];
		// this.dialogCloseBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this._OnClick, this);
		this.changeNormalState();
		var playerItemData: AcrossLadderItemData = AcrossLadderPanelData.ins().getCurrentPlayerItem();
		this.updateDisplay(playerItemData);
		this.btnChallenge.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouch, this);
		MessageCenter.ins().addListener(MessageDef.ACROSSLADDER_CHALLENGE_CONFIRM, this.changeTextState, this);
	}

	close() {
		for (var e = [], t = 0; t < arguments.length; t++) e[t] = arguments[t];
		this.btnChallenge.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouch, this);
		//this.dialogCloseBtn.removeEventListener(egret.TouchEvent.TOUCH_TAP, this._OnClick, this)
	}
	private _OnClick(e: egret.TouchEvent) {
		ViewManager.ins().close(this);
	}

	private updateDisplay(playerItemData: AcrossLadderItemData) {
		this.opHead.source = ResDataPath.GetHeadMiniImgName(playerItemData.job, playerItemData.sex);
		this.opName.text = playerItemData.playerName;
		this.opRank.textFlow = <Array<egret.ITextElement>>[
			{ text: GlobalConfig.jifengTiaoyueLg.st100868, style: { "textColor": 0xbf7d00 } },
			{ text: playerItemData.rank.toString(), style: { "textColor": 0x535557 } }
		];
		this.opLv.text = LanguageString.jifengTiaoyueCh(GlobalConfig.jifengTiaoyueLg.st101443, [playerItemData.zsLv.toString(), playerItemData.lv.toString()]);
		this.opPower.textFlow = <Array<egret.ITextElement>>[
			{ text: GlobalConfig.jifengTiaoyueLg.st100809, style: { "textColor": 0xbf7d00 } },
			{ text: playerItemData.power.toString(), style: { "textColor": 0x535557 } }
		];
	}

	private onTouch(e: egret.TouchEvent) {
		let challengeNum = AcrossLadderPanelData.ins().challengeNum;
		if (challengeNum > 0) {
			let targetPlayerId: number = AcrossLadderPanelData.ins().getTargetPlayerId();
			let combat: number = (this.currentState == "normal") ? 0 : targetPlayerId;
			AcrossLadderCenter.ins().reqAcrossLadderStartCombat(targetPlayerId, combat);
			ViewManager.ins().close(AcrossLadderChallengeTip);//临时处理，服务器没返回关闭
		} else {
			UserTips.ins().showTips(GlobalConfig.jifengTiaoyueLg.st101469);
		}
	}

	private changeNormalState(): void {
		this.currentState = "normal";
	}
	private changeTextState(): void {
		this.currentState = "text";
	}

}
ViewManager.ins().reg(AcrossLadderChallengeTip, LayerManager.UI_Popup);
window["AcrossLadderChallengeTip"] = AcrossLadderChallengeTip