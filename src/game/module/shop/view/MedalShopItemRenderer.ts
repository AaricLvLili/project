class MedalShopItemRenderer extends eui.ItemRenderer {

	btnGet
	btnGethis
	labelTimes

	public constructor() {
		super()

		this.skinName = "FeatsShopItem"

		this.btnGet && (this.btnGethis.name = "buy")
	}
	private priceIcon: PriceIcon

	private m_ShopItemBase: ShopBaseItemData

	childrenCreated() {
		this.m_ShopItemBase = new ShopBaseItemData(this["shopBaseItem"])
	}
	dataChanged() {
		var e = this.data,
			t = new RewardData;
		t.count = e.count
		t.type = e.type
		t.id = e.id
		this.m_ShopItemBase.item.data = t
		this.m_ShopItemBase.item.isShowName(false);
		// this.m_ShopItemBase._SetName(this.m_ShopItemBase.item.getText())
		// this.m_ShopItemBase._SetName(TextFlowMaker.generateTextFlow(`|C:${this.m_ShopItemBase.item.getTextColor()}&T:${this.m_ShopItemBase.item.getText()}|`));
		this.m_ShopItemBase._SetName(this.m_ShopItemBase.item.getText());
		this.priceIcon.iconImg.source = "little_icon_10_png"
		this.priceIcon.setPrice(e.feats)
		0 == e.daycount ? this.labelTimes.visible = !1 : (this.labelTimes.visible = !0, this.labelTimes.text = "今日已兑换" + e.exchangeCount + "/" + e.daycount)
	}
}
window["MedalShopItemRenderer"] = MedalShopItemRenderer