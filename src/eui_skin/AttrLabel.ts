class AttrLabel extends eui.Component implements eui.UIComponent {
	public constructor() {
		super();
	}

	private static GAP = 20
	private static MIDDLE_POS = 240
	private static ARROW_WIDTH = 20

	private arrows: eui.Image
	private attrBg: eui.Image
	private attrLabel: eui.Label
	private nextAttrLabel: eui.Label

	private m_HideBg: boolean
	private m_Text: string

	private leftSolaAttr:eui.Label

	public showBg() {
		this.attrBg.visible = true;
	}

	public set hideBg(value) {
		this.m_HideBg = true
	}

	private m_Gap = AttrLabel.GAP

	public set gap(gap) {
		this.m_Gap = parseInt(gap)
		this._UpdateGap()
	}

	public set text(value) {
		this.m_Text = value
		this._UpdateText()
	}

	protected partAdded(partName: string, instance: any): void {
		super.partAdded(partName, instance);
	}

	protected childrenCreated(): void {
		super.childrenCreated();
		if (this.m_HideBg) {
			this.attrBg.visible = false
		}
		if (this.m_Gap != null) {
			this._UpdateGap()
		}
		if (this.m_Text != null) {
			this._UpdateText()
		}

		this.leftSolaAttr.visible = false;
	}

	public ShowSolaAttr(showLeftStr:string , hangNum:number)
	{
		this.leftSolaAttr.visible = true;
		var tempX = 2 < showLeftStr.length ? 77 : 44;

		this.leftSolaAttr.height = this.attrLabel.height;
		this.leftSolaAttr.x = this.attrLabel.x - tempX;
		this.leftSolaAttr.y = this.attrLabel.y;
		for(var i = 0;i<hangNum;i++)
		{
			showLeftStr = "\n <font color = '0xffcc00'>"+showLeftStr+"</font>";
		}
		this.leftSolaAttr.textFlow = (new egret.HtmlTextParser).parse(showLeftStr);
		this.leftSolaAttr.verticalCenter = this.attrLabel.verticalCenter;
	}

	private _UpdateGap(): void {
		if (!this.$stage) {
			return
		}
		let gap = (this.m_Gap || AttrLabel.GAP) + AttrLabel.ARROW_WIDTH
		if (this.nextAttrLabel.visible) {
			this.nextAttrLabel.x = AttrLabel.MIDDLE_POS + gap
			this.attrLabel.x = AttrLabel.MIDDLE_POS - gap - this.attrLabel.width
		} else {
			this.attrLabel.x = AttrLabel.MIDDLE_POS - this.attrLabel.width * 0.5
		}
	}

	private _UpdateText(): void {
		if (!this.$stage || this.m_Text == null) {
			return
		}
		this.attrLabel.text = this.m_Text
		this.arrows.visible = false
		this.nextAttrLabel.visible = false
	}

	public SetCurAttr(attr: string): void {
		this.attrLabel.textFlow = (new egret.HtmlTextParser).parse(attr);
		this.arrows.visible = false
		this.nextAttrLabel.visible = false
		this._UpdateGap()
	}

	public SetNextAttr(attr: string): void {
		this.nextAttrLabel.textFlow = (new egret.HtmlTextParser).parse(attr);
		this.arrows.visible = true
		this.nextAttrLabel.visible = true
		this._UpdateGap()
	}

	public SetCurAttrNew(attr: string): void {
		this.attrLabel.text = attr
		this.arrows.visible = false
		this.nextAttrLabel.visible = false
		if (this.attrBg.visible == false) {
			this.attrBg.visible = true;
		}
	}

	public SetNextAttrNew(attr: string): void {
		this.nextAttrLabel.text = attr
		this.arrows.visible = true
		this.nextAttrLabel.visible = true
		if (this.attrBg.visible == false) {
			this.attrBg.visible = true;
		}
	}

	public SetCurAttrByAddType(curConfig, addConfig): void {
		let attr = AttributeData.getAttStr(AttributeData.AttrAddition(curConfig.attr, addConfig.attr), 1);
		this.SetCurAttr(attr)
	}

	public SetNextAttrByAddType(nextConfig, nextAddConfig): void {
		let attr = AttributeData.getAttStr(AttributeData.AttrAddition(nextConfig.attr, nextAddConfig.attr), 1);
		this.SetNextAttr(attr)
	}

	moveAttr() {
		var t = egret.Tween.get(this.attrLabel);
		let x1 = this.attrLabel.x
		let x2 = this.nextAttrLabel.x
		t.to({ "x": x1 + 200, "alpha": 0 }, 100).to({ "x": x1 - 200 }, 100).to({ "x": x1, "alpha": 1 }, 100);
		var t1 = egret.Tween.get(this.nextAttrLabel);
		t1.to({ "x": x2 + 200, "alpha": 0 }, 100).to({ "x": x2 - 200 }, 100).to({ "x": x2, "alpha": 1 }, 100);
	}
}window["AttrLabel"]=AttrLabel 
