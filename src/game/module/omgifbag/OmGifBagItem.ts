class OmGifBagItem extends eui.ItemRenderer {
	public constructor() {
		super();
	}
	public m_ItemBase: ItemBase;
	public m_ItemName: eui.Label;
	public m_Cont: eui.Label;

	public createChildren() {
		super.createChildren();
		this.m_ItemBase.nameTxt.visible = false;
	}
	public dataChanged() {
		super.dataChanged();
		let data: { type: number, id: number, count: number, itemTips: string } = this.data;
		if (data.type == 1) {
			let itemConfig = GlobalConfig.ins("ItemConfig")[data.id];
			this.m_ItemName.text = itemConfig.name;
		} else {
			this.m_ItemName.text = MoneyManger.MoneyConstToName(data.id);
		}
		data["isShowName"] = 2
		this.m_Cont.text = data.itemTips;
		this.m_ItemBase.data = data;
		this.m_ItemBase.dataChanged();
	}
}
window["OmGifBagItem"] = OmGifBagItem