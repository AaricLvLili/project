class TipsGoodEquip extends eui.Component {

	isUsing = false;
	item
	itemName
	desc
	public constructor() {
		super()
		this.skinName = "OrangeEquipNoticeSkin";
		this.horizontalCenter = 0;
	}


	set data(item) {
		this.item.data = item;
		if (item.itemConfig.quality == 4) {
			this.desc.text = GlobalConfig.jifengTiaoyueLg.st101899;
		}
		else if (item.itemConfig.quality == 5) {
			this.desc.text = GlobalConfig.jifengTiaoyueLg.st101898;
		}
		this.itemName.text = item.itemConfig.name;
		this.itemName.textColor = ItemBase.QUALITY_COLOR[item.itemConfig.quality];
	}
}
window["TipsGoodEquip"]=TipsGoodEquip