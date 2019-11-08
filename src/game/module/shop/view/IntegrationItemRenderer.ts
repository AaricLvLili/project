class IntegrationItemRenderer extends eui.ItemRenderer {

	// item: ItemBase
	goodsID
	money
	integration: PriceIcon
	// itemName
	// textBG
	// used

	public constructor() {
		super()

		this.skinName = "ShopPointItem";
		// this.item = new ItemBase();
		// this.item.x = 18;
		// this.item.y = 12;
		// this.item.isShowName(false);
		// this.addChild(this.item);
	}

		
	private priceIcon: PriceIcon

	private m_ShopItemBase: ShopBaseItemData

	childrenCreated() {
		this.m_ShopItemBase = new ShopBaseItemData(this["shopBaseItem"])
	}


	dataChanged() {
		var shopItem = this.data;
		var itemConfig = GlobalConfig.itemConfig[shopItem.id];
		if (itemConfig == undefined)
			return;
		this.goodsID = shopItem.index;
		this.money.price = CommonUtils.overLength(shopItem.YuanBao);
		this.integration.price = CommonUtils.overLength(shopItem.integral);
		this.integration.iconImg.source = "mall_res_002"


		this.m_ShopItemBase._SetName(itemConfig.name)
		// this.itemName.text = itemConfig.name;
		// this.itemName.textColor = ItemBase.QUALITY_COLOR[itemConfig.quality];
		// this.textBG.source = BlackMarketItemRenderer.qualityToTextBG[itemConfig.quality];
		// this.used.text = ""; //"（" + shopItem.type + "）";
		// this.used.x = this.itemName.x + this.itemName.width;
		var red = new RewardData();
		red.id = itemConfig.id;
		red.count = shopItem.count;
		red.type = shopItem.type;
		this.m_ShopItemBase.item.data = red;
		// this.item.num = shopItem.count;
	};
}
window["IntegrationItemRenderer"]=IntegrationItemRenderer