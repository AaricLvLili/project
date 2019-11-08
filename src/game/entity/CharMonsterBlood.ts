class CharMonsterBlood extends eui.Component {
	public constructor() {
		super();
		this.skinName = "CharMonsterBloodSkin";
	}
	public m_Name: eui.Label;
	public m_HpBlood: eui.ProgressBar;
	public m_MpBlood: eui.ProgressBar;
	public m_NeiGongBlood: eui.ProgressBar;
	public m_ElemtImg: eui.Image;

	public createChildren() {
		super.createChildren();
	}

	public initData() {
		this.m_HpBlood.slideDuration = 0
		this.m_MpBlood.slideDuration = 0
		this.m_NeiGongBlood.slideDuration = 0;
		this.m_HpBlood.value = 100;
		this.m_HpBlood.maximum = 100;
		this.m_MpBlood.value = 0;
		this.m_MpBlood.maximum = 100;
		this.m_NeiGongBlood.value = 0;
		this.m_NeiGongBlood.maximum = 100;
		this.m_HpBlood.visible = false;
		this.m_MpBlood.visible = false;
		this.m_NeiGongBlood.visible = false;
		this.m_Name.visible = false;
		this.m_ElemtImg.visible = false;
	}

	public show() {
		this.m_HpBlood.visible = true;
		// this.m_MpBlood.visible = true;
		this.m_NeiGongBlood.visible = true;
		this.m_Name.visible = true;
		if (this.m_NeiGongBlood.value == 0) {
			this.m_NeiGongBlood.visible = false;
		}
	}

}
window["CharMonsterBlood"] = CharMonsterBlood