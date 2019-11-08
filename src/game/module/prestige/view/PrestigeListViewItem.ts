class PrestigeListViewItem extends eui.ItemRenderer {

	private prestigeLevelConfig: any;
	public num: eui.Label;
	public icon: eui.Image;


	public constructor() {
		super()
		this.skinName = "PrestigeListItemSkin"
	}

	dataChanged() {
		this.num.text = this.data.num+""
		this.icon.source = `comp_135_37_${this.data.id}_png`
	}

}
window["PrestigeListViewItem"]=PrestigeListViewItem