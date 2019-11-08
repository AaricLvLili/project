class LongZhuangAttr extends eui.Component {
	public curAttrLabel: eui.Label;
	public nameTxt: eui.Label;
	public nextAttrLabel: eui.Label;
	public m_ArrImg: eui.Image;

	public constructor() {
		super();
		this.skinName = "LongzhuangAttrSkin";
	}

	public setCurrAttr(attrStr: string): void {
		this.curAttrLabel.text = attrStr;
	}

	public setNextAttr(attrStr: string): void {
		if (attrStr == null || attrStr == "") {
			this.nextAttrLabel.visible = false;
			this.m_ArrImg.visible = false;
			this.curAttrLabel.horizontalCenter = 30;
			return;
		}
		this.nextAttrLabel.visible = true;
		this.m_ArrImg.visible = true;
		this.curAttrLabel.horizontalCenter = -117
		this.nextAttrLabel.text = attrStr;
	}
}
window["LongZhuangAttr"] = LongZhuangAttr