class BlackMarketItemRenderer extends eui.ItemRenderer {
	public constructor() {
		super()
	}
	goodsID
	arrowIcon
	CEKey
	CEValue

	private priceIcon: PriceIcon

	private m_ShopItemBase: ShopBaseItemData

	public shopBaseItem: eui.Component;
	public buyBtn: eui.Button;


	childrenCreated() {
		this.m_ShopItemBase = new ShopBaseItemData(this["shopBaseItem"])
		this.m_ShopItemBase.item.mCallback = () => {
			this.showTip()
		}
		this.buyBtn.label = GlobalConfig.jifengTiaoyueLg.st100069;
		this.CEKey.label = GlobalConfig.jifengTiaoyueLg.st100070;
	}

	dataChanged() {
		var shopItem: ShopEquipData = this.data;
		var itemData = shopItem.item;
		var itemConfig = GlobalConfig.itemConfig[itemData.configID];
		this.goodsID = shopItem.id;
		var costStr = "";
		if (shopItem.costNum > 100000) {
			costStr = Math.floor(shopItem.costNum / 10000) + GlobalConfig.jifengTiaoyueLg.st100066;
		}
		else {
			costStr = shopItem.costNum + "";
		}
		// this.money.text = costStr;
		this.priceIcon.text = costStr
		// this.itemName.text = itemConfig.name;
		// this.itemName.textColor = ItemBase.QUALITY_COLOR[itemConfig.quality];
		let lvText
		if (itemConfig.zsLevel > 0) {
			lvText = "(" + itemConfig.zsLevel + GlobalConfig.jifengTiaoyueLg.st100067 + ")";
		}
		else {
			lvText = "(Lv." + itemConfig.level + ")";
		}

		let text = itemConfig.name
		//let color = ItemBase.QUALITY_COLOR_STR[itemConfig.quality]
		// this.m_ShopItemBase._SetName(TextFlowMaker.generateTextFlow(`|C:${color}&T:${text}|${lvText}|`))
		this.m_ShopItemBase._SetName(`${text}${lvText}`)
		// this.m_ShopItemBase.item.data = itemData.configID
		// this.m_ShopItemBase.item.setCount(shopItem.costNum) .count =  shopItem.costNum > 1 ? this.setCount(this.data.count + "") : this.setCount(""); shopItem.costNum
		this.m_ShopItemBase.item.data = shopItem.item
		this.m_ShopItemBase.item.isShowJob(true)
		this.m_ShopItemBase.item.showLegendEffe()
		this.m_ShopItemBase.item.IsShowRedPoint(false)
		this.m_ShopItemBase.item.isShowName(false);
		this.m_ShopItemBase._SetDiscount(shopItem.discountType)
		this.m_ShopItemBase._SetImgHot(shopItem.discountType > 0)
		// this.num.text = (itemData.count == 1 ? "" : itemData.count + "");
		this.priceIcon.type = shopItem.costType == 1 ? MoneyConst.gold : MoneyConst.yuanbao
		// this.textBG.source = BlackMarketItemRenderer.qualityToTextBG[itemConfig.quality];
		// this.itemIcon.setData(itemConfig);
		// this.itemIcon.imgJob.source = BlackMarketItemRenderer.jobTypeToIcon[itemConfig.job];
		if (itemConfig.job != 0) {
			var ceGap = UserBag.ins().calculationScore(shopItem.item);
			if (ceGap > 0) {
				this.arrowIcon.visible = true;
				this.CEKey.visible = true;
				this.CEValue.visible = true;
				this.CEValue.text = ceGap + "";
			}
			else {
				this.arrowIcon.visible = false;
				this.CEKey.visible = false;
				this.CEValue.visible = false;
			}
		}
		else {
			this.arrowIcon.visible = false;
			this.CEKey.visible = false;
			this.CEValue.visible = false;
		}
	};
	showTip() {
		var configID;
		var shopData = Shop.ins().shopData;
		var len = shopData.getShopEquipDataLength();
		var sed = null;
		for (var i = 0; i < len; i++) {
			sed = shopData.getShopEquipDataByIndex(i);
			if (sed != null) {
				if (sed.id == this.goodsID) {
					configID = sed.item.configID;
				}
			}
		}
		if (configID == undefined) {
			new Error(GlobalConfig.jifengTiaoyueLg.st100068);
		}
		var itemConfig = GlobalConfig.itemConfig[configID];
		if (itemConfig.type != undefined) {
			if (itemConfig.type == 0) {
				ViewManager.ins().open(EquipDetailedWin, 1, null, itemConfig.id);
			}
			else {
				ViewManager.ins().open(ItemDetailedWin, 0, itemConfig.id, this.data.item.count);
			}
		}
	};

}
window["BlackMarketItemRenderer"] = BlackMarketItemRenderer