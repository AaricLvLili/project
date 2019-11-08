class FirstShopPanel extends BaseEuiPanel {

    public static LAYER_LEVEL = LayerManager.UI_Popup

	private bg: eui.Component
	private sure: eui.Button

	public constructor() {
		super()
		this.skinName = "FirstShopSkin"
	}

	public open() {
		this.AddClick(this.bg, this._OnClick)
		this.AddClick(this.sure, this._OnClick)
	}

	private _OnClick() {
		ViewManager.ins().close(this)
	}
}
window["FirstShopPanel"]=FirstShopPanel