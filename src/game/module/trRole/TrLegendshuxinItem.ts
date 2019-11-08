class TrLegendshuxinItem extends eui.ItemRenderer {
	public constructor() {
		super()
		this.skinName = "TrLegendshuxinItemSkin"
		this.touchEnabled =true
		this.touchChildren =false
	}
	public static readonly ICON_LIST = {
		"0": "fun_sq_png",
		"1": "fun_tj_png",
		"2": "fun_fw_png",
		"3": "fun_sz_png",
		"4": "fun_xf_png",
		"5": "fun_jm_png",
		"6": "fun_tf_png",
		"7": "fun_liz_png",
	}
	public icon: eui.Image;
	public select: eui.Image;

	private _id
	//private btn: eui.Button
	public dataChanged() {
		this._id = this.data
		// this.btn.icon = TrLegendshuxinItem.ICON_LIST[this.data]
		// this.name = this.data
		this.icon.source = TrLegendshuxinItem.ICON_LIST[this.data]
		this.select.visible = false
	}
	public get id() {
		return this._id
	}
	public setSelect(value: boolean) {
		this.select.visible = value
	}



}
window["TrLegendshuxinItem"] = TrLegendshuxinItem