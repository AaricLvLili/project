class ActorName extends eui.Component implements  eui.UIComponent {

	private title: eui.Group
	private m1: eui.Image
	private m2: eui.Image
	private vip: eui.Image
	private lv: eui.BitmapLabel

	// 部分skin下不显示
	private pos: eui.Group
	private label: eui.Label

	// 尊
	private m_IsMonth01: boolean = false
	// 月
	private m_IsMonth02: boolean = false
	private m_VipLv: number = 0
	private m_Name: string | egret.ITextElement[] = ""

	private m_Align: boolean = false

	public set actorName(name: string) {
		this.m_Name = name
		this._UpdateContent()
	}

	public set month(isMonty: boolean) {
		this.m_IsMonth02 = Boolean(isMonty)
		this._UpdateContent()
	}

	public set zun(isZun: boolean) {
		this.m_IsMonth01 = Boolean(isZun)
		this._UpdateContent()
	}

	public set vipLv(vipLv: number) {
		this.m_VipLv = Number(vipLv)
		this._UpdateContent()
	}

	public set align(value: boolean) {
		this.m_Align = Boolean(value)
		this._UpdateContent()
	}

	public Set(name: string | egret.ITextElement[], vipLv: number, isMonty: boolean | number, isZun: boolean | number): void {
		this.m_Name = name
		this.m_VipLv = vipLv
		this.m_IsMonth02 = isMonty ? true : false
		this.m_IsMonth01 = isZun ? true : false
		this._UpdateContent()
	}

	public constructor() {
		super()
	}

	private _UpdateContent(): void {
		if (!this.$stage) {
			return
		}
		let scale = 0.9
		this.m1.width = this.m_IsMonth01 ? Math.floor(19 * scale) : 0
		this.m2.width = this.m_IsMonth02 ? Math.floor(18 * scale) : 0
		if (this.m_VipLv > 0) {
			this.vip.width = Math.floor(43 * scale)
			this.lv.text = this.m_VipLv + ""
			// this.lv.width = Math.floor(this.lv.text.length * 12 * scale)
			this.lv.width = this.lv.text.length * 12
		} else {
			this.lv.text = ""
			this.vip.width = 0
			this.lv.width = 0
		}
		this.title.validateNow()
		if (this.label) {
			if (this.m_Name == null) {
				this.label.text = ""
			} else if (typeof(this.m_Name) == "string") {
				this.label.text = this.m_Name
			} else {
				this.label.textFlow = this.m_Name
			}
			this.label.x = this.title.width > 0 ? (this.title.width + 1) : 0

			if (this.m_Align) {
				let w = this.label.x + this.label.width
				this.pos.x = Math.floor((this.width - w) * 0.5)
			} else {
				this.pos.x = 0
			}
		}
	}
}
window["ActorName"]=ActorName