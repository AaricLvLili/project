class PublicBossOwnerChange extends BaseEuiView {

    public static LAYER_LEVEL = LayerManager.UI_Popup

	private label: eui.Label
	private m_Timer: number

	public constructor() {
		super()
		this.skinName = "PublicBossOwnerChangeSkin"
		this.touchEnabled = false
		this.touchChildren = false
	}

	public open(...param: any[]) {
		this.label.text = `${param[0]}`+GlobalConfig.jifengTiaoyueLg.st101693+`${param[1]}`
		if (this.m_Timer) {
			egret.clearTimeout(this.m_Timer)
			this.m_Timer = null
		}
		this.m_Timer = egret.setTimeout(this._TimeOut, this, 3000)
	}

	private _TimeOut() {
		ViewManager.ins().close(this)
	}
}
window["PublicBossOwnerChange"]=PublicBossOwnerChange