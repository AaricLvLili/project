class WarOrderIconItem extends eui.ItemRenderer {
	public constructor() {
		super();
		this.skinName = "WarOrderIconItemSkin";
	}
	public m_ItemBase: ItemBase;
	public m_MaskGuoup: eui.Group;
	public m_Shuo: eui.Image;
	public dataChanged() {
		super.dataChanged();
		let data: { lv: number, type: number, item: { type: number, id: number, count: number } } = this.data;
		this.m_ItemBase.data = data.item;
		this.m_ItemBase.dataChanged();
		let warOrderModel = WarOrderModel.getInstance;
		switch (data.type) {
			case 1:
				let showNum = warOrderModel.commonAwardList[data.lv - 1];
				switch (showNum) {
					case 0:
						this.m_MaskGuoup.visible = false;
						this.m_Shuo.visible = true;
						break;
					case 1:
						this.m_MaskGuoup.visible = false;
						this.m_Shuo.visible = false;
						break;
					case 2:
						this.m_MaskGuoup.visible = true;
						this.m_Shuo.visible = false;
						break;
				}
				break;
			default:
				if (warOrderModel.isUpWarOrder) {
					let showNum = warOrderModel.upAwardList[data.lv - 1];
					switch (showNum) {
						case 0:
							this.m_MaskGuoup.visible = false;
							this.m_Shuo.visible = true;
							break;
						case 1:
							this.m_MaskGuoup.visible = false;
							this.m_Shuo.visible = false;
							break;
						case 2:
							this.m_MaskGuoup.visible = true;
							this.m_Shuo.visible = false;
							break;
					}
				} else {
					this.m_Shuo.visible = true;
					this.m_MaskGuoup.visible = false;
				}
				break;
		}
	}
}
window["WarOrderIconItem"] = WarOrderIconItem