class PersonRewardRenderer extends eui.ItemRenderer {

	itemList
desc
	public constructor() {
		super()
		this.skinName = "PersonRewardRendererSkin"
		this.itemList.itemRenderer = ItemBase
	}

	dataChanged () {
		this.desc.text = +this.data.integral + "", this.itemList.dataProvider = new eui.ArrayCollection(this.data.award)
	}
}
window["PersonRewardRenderer"]=PersonRewardRenderer