/**全民boss挑战提示*/
class PublicBossRebirthPanel extends eui.Component {
	public constructor(_challengeFunc, _closeFunc) {
		super();
		this.skinName = "PublicBossRebirthPanelSkin"
		this.challengeFunc = _challengeFunc;
		this.closeFunc = _closeFunc;
	}

	public head: eui.Image;
	public m_ElementImg: eui.Image;
	public closeTopBtn: eui.Button;
	public check: eui.CheckBox;
	public txtTitle: eui.Label;
	public challengeBtn: eui.Button;
	private challengeFunc: Function;
	private closeFunc: Function;

	public childrenCreated() {
		super.childrenCreated();
		this.closeTopBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTap, this);
		this.check.addEventListener(egret.Event.CHANGE, this.onTap, this);
		this.challengeBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTap, this);
	}

	public updata() {
		var config = GlobalConfig.publicBossConfig[PlayFun.ins().index][0];
		if (config) {
			let bossConfig = GlobalConfig.monstersConfig[config.bossId];
			this.head.source = ResDataPath.getBossHeadImage(bossConfig.head);//bossConfig.head + "_png";
			let str = config.zsLevel > 0 ?  LanguageString.jifengTiaoyueCh(GlobalConfig.jifengTiaoyueLg.st101367,[config.zsLevel]) : LanguageString.jifengTiaoyueCh(GlobalConfig.jifengTiaoyueLg.st101368,[config.level ])
			this.txtTitle.text = str + " " + bossConfig.name;
			this.m_ElementImg.source = ResDataPath.GetElementImgName(bossConfig.elementType);
		}
	}

	private onTap(e: egret.TouchEvent) {
		switch (e.currentTarget) {
			case this.closeTopBtn:
				if (this.closeFunc) this.closeFunc();
				break;
			case this.challengeBtn:
				if (this.challengeFunc) this.challengeFunc();
				break;
			case this.check:
				PlayFun.ins().noTips = this.check.selected;
				break;
		}
	}

	public release() {
		this.closeTopBtn.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onTap, this);
		this.check.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onTap, this);
		this.challengeBtn.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onTap, this);
		this.challengeFunc = null;
		this.closeFunc = null;
	}
}
window["PublicBossRebirthPanel"] = PublicBossRebirthPanel