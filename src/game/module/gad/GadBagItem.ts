class GadBagItem extends ItemBase {
	public constructor() {
		super();
		this.skinName="GadBagItemSkin";
	}
	public m_StarGroup: eui.Group;
	public m_Lv: eui.Label;
	public dataChanged() {
		super.dataChanged();
		let gadModel = GadModel.getInstance;
		gadModel.setStarNum(this.itemConfig.quality, this.m_StarGroup);
		let gadItemData: ItemData = this.data;
		let gadBagData = gadModel.gadBagDic.get(gadItemData.handle);
		this.m_Lv.text = "+" + gadBagData.level;
	};
}
window["GadBagItem"]=GadBagItem