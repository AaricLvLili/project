class RankTabItemRenderer extends eui.ItemRenderer {
	public constructor() {
		super()
		this.skinName = "BtnTab3Skin";
	}

	dataChanged() {
		super.dataChanged();
	};
}
window["RankTabItemRenderer"]=RankTabItemRenderer