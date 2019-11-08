class GetwayLabel extends eui.Component implements  eui.UIComponent {

	private m_Eff: MovieClip

	public label: eui.Label
	private m_Text: string
	private m_TextColor

	public set text(value) {
		this.m_Text = value
		this._Update()
	}

	public get text() {
		return this.m_Text
	}

	public set textColor(value) {
		this.m_TextColor = value
		this._Update()
	}

	public constructor() {
		super();
	}

	protected partAdded(partName:string,instance:any):void
	{
		super.partAdded(partName,instance);
	}


	protected childrenCreated():void
	{
		super.childrenCreated();
		this._Update()
		if (this.m_TextColor) {
			this.label.textColor = this.m_TextColor
		}
	}

	private _Update() {
		if (this.$stage) {
			this.label.textFlow = (new egret.HtmlTextParser).parser("<a href=\"event:\"><u>" + this.m_Text + "</u></a>");
			if (this.m_TextColor) {
				this.label.textColor = this.m_TextColor
			}
		}
	}

	public SetUnLabel(text: string) {
		this.label.text = text
		this.label.textColor = 0xf87372
	}

	public SetDefault() {
		this.textColor = 0x2ECA22
		// this.label.textColor = 
		// this._Update()
	}
    
	public PlayEff(state: boolean) {
		if (!state) {
            if (this.m_Eff) {
				this.m_Eff.visible = false
			}
			return
		}
		let eff = this.m_Eff
		if (!eff) {
			eff = this.m_Eff = new MovieClip
			eff.touchEnabled = false
			if (this.m_Text.length > 4)
				eff.loadUrl(ResDataPath.GetUIEffePath("eff_ui_wzlj_002"), true, -1);
			else
				eff.loadUrl(ResDataPath.GetUIEffePath("eff_ui_wzlj_001"), true, -1);
			this.addChild(eff)
		}
		// eff.scaleX = eff.scaleY = 0.8
		// eff.x = (this.label.width - 132 * 0.8) * 0.5
		// eff.y = (this.label.height - 39 * 0.8) * 0.5

		if (this.m_Text.length > 4) {
			eff.x = 50
			eff.y = 13
		} else {
			eff.x = 32
			eff.y = 8
		}
		eff.visible = true
	}

	private static gainItemConfig:any;
	public static GainItemLabel(itemId): string {
		if(GetwayLabel.gainItemConfig == null)
		{
			GetwayLabel.gainItemConfig = GlobalConfig.ins("GainItemConfig");
		}
		let gainConfig = GetwayLabel.gainItemConfig[itemId];
		if (gainConfig) {
			return gainConfig.gainWay[0][0]
		} 
		return null
	}

	public static GainItemWay(itemId): string {
		if(GetwayLabel.gainItemConfig == null)
		{
			GetwayLabel.gainItemConfig = GlobalConfig.ins("GainItemConfig");
		}
		let gainConfig = GetwayLabel.gainItemConfig[itemId]
		if (gainConfig) {
			return gainConfig.gainWay[0][1][0]
		} 
		return null
	}
}
window["GetwayLabel"]=GetwayLabel