class PetNameWin extends BaseEuiPanel {
	public constructor() {
		super()
		this.skinName = "PetNameWinSkin";
	}

	public m_CloseBtn3: eui.Button;
	public m_SureBtn: eui.Button;
	public m_Text: eui.EditableText;

	private petData: PetData;
	public m_Lan1: eui.Label;
	public m_Lan2: eui.Label;

	initUI() {
		super.initUI();
		this.m_Lan1.text = GlobalConfig.jifengTiaoyueLg.st101173;
		this.m_Lan2.text = GlobalConfig.jifengTiaoyueLg.st101174;
		this.m_CloseBtn3.label = GlobalConfig.jifengTiaoyueLg.st101175;
		this.m_SureBtn.label = GlobalConfig.jifengTiaoyueLg.st101176;
		this.m_Text.text = GlobalConfig.jifengTiaoyueLg.st101177;
		this.m_bg.init(`PetNameWin`, GlobalConfig.jifengTiaoyueLg.st101172);
	}
	open(...param: any[]) {
		this.petData = param[0];
		this.addViewEvent();
		this.setData();
	}
	close() {
		this.release();
	}
	public release() {
		this.removeViewEvent();
	}
	private addViewEvent() {
		// this.m_Text.addEventListener(egret.Event.CHANGE, this.checkLen, this);
		this.AddClick(this.m_CloseBtn3, this.onClickClose);
		this.AddClick(this.m_SureBtn, this.onClicSure);
	}
	private removeViewEvent() {
		// this.m_Text.removeEventListener(egret.Event.CHANGE, this.checkLen, this);
	}
	private setData() {
		this.m_Text.text = this.petData.name;
	}

	private onClicSure() {
		if (this.m_Text.text.length > 6) {
			this.m_Text.text = this.m_Text.text.slice(0, 6);
		}
		PetSproto.ins().sendChangeName(this.petData.petid, this.m_Text.text);
	}
	// private checkLen() {
	// if (this.m_Text.text.length > 6) {
	// 	this.m_Text.text = this.m_Text.text.slice(0, 6);
	// }
	// }
	private onClickClose() {
		ViewManager.ins().close(this);
	}
}

ViewManager.ins().reg(PetNameWin, LayerManager.UI_Popup);
window["PetNameWin"] = PetNameWin