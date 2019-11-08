class PowerLabel extends eui.Component implements eui.UIComponent {

	private label: eui.BitmapLabel
	private bg: eui.Image

	private m_Value: string

	private m_HideBg: boolean

	public set text(value: string | number) {
		this.m_Value = value.toString();
		this._SetText()
	}

	public set hideBg(value) {
		this.m_HideBg = true
	}

	private _SetText(): void {
		if (this.m_Value) {
			// this.label.text = `战斗力  ${this.m_Value}`
			if (this.bg) {
				this.label.text = `${this.m_Value}`
			} else {
				this.label.text = `${this.m_Value}`
			}
		}
	}

	public constructor() {
		super()
	}

	protected partAdded(partName: string, instance: any): void {
		super.partAdded(partName, instance);
	}

	protected childrenCreated(): void {
		super.childrenCreated();
		this._SetText()
		if (this.m_HideBg) {
			this.bg.visible = true;
		}
	}
}
window["PowerLabel"] = PowerLabel