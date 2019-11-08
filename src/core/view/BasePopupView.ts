class BasePopupView extends BaseEuiView {
    
    public GetLayerLevel() {
        return LayerManager.UI_Popup
    }

	public constructor() {
		super()
        // let img = new eui.Image
		// img.width = 500
		// img.height = 900
		// img.source = "ui_cm_mb@2_2_2_2"
		// this.addChildAt(img, 0);
	}

	// public partAdded(partName:string, instance: any): void {
	// 	console.log(partName, instance)
	// }
}
window["BasePopupView"]=BasePopupView