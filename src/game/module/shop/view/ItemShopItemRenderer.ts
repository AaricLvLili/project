class ItemShopItemRenderer extends eui.ItemRenderer {

	goodsID = 0;
	private priceIcon: PriceIcon
	private m_ShopItemBase: ShopBaseItemData
	public buyBtn: eui.Button;

	public constructor() {
		super()
		this.skinName = "ItemShopItem";
		this.buyBtn.label = GlobalConfig.jifengTiaoyueLg.st100069;
	}

	childrenCreated() {
		this.m_ShopItemBase = new ShopBaseItemData(this["shopBaseItem"])
	}

	dataChanged() {
		var shopItem = this.data;
		if (shopItem.costType != null) {
			this.priceIcon.setType(shopItem.costType)
		}
		this.goodsID = shopItem.index;
		var itemConfig = GlobalConfig.itemConfig[shopItem.itemId];
		this.m_ShopItemBase.item.data = shopItem.itemId
		this.m_ShopItemBase.item.isShowName(false);
		this.priceIcon.setPrice(shopItem.price > 1e5 ? Math.floor(shopItem.price / 1e4) + GlobalConfig.jifengTiaoyueLg.st100066 : shopItem.price + "")
		let nameStr = (shopItem.type == 1) ? itemConfig.name : MoneyManger.MoneyConstToName(shopItem.itemId);
		this.m_ShopItemBase._SetName(`${nameStr}（${shopItem.use}）`);

	};
}
window["ItemShopItemRenderer"] = ItemShopItemRenderer