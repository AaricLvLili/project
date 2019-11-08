class ShopBaseItemData {

	public m_Comp

	public constructor(comp) {
		// super()
		this.m_Comp = comp
		if (this.m_Comp && this.m_Comp.discountIcon)
			this.m_Comp.discountIcon.visible = false;
		if (this.m_Comp && this.m_Comp.imgHot)
			this.m_Comp.imgHot.visible = false;
		this.item.isShowName(false)
		this.item.isShowJob(true)

	}

	get itemName(): eui.Label {
		return this.m_Comp.itemName
	}
	get discountIcon(): eui.Group {
		return this.m_Comp.discountIcon
	}
	get discount(): eui.Label {
		return this.m_Comp.discount
	}
	get item(): ItemBase {
		return this.m_Comp.itemIcon
	}
	get imgHot(): eui.Image {
		return this.m_Comp.imgHot
	}

	dataChanged() {
	}

	public _SetName(text: egret.ITextElement[] | string) {
		if (typeof (text) == "string") {
			this.itemName.text = text
		} else {
			this.itemName.textFlow = text
		}
	}

	public _SetDiscount(discount: number) {
		this.discount.text = discount + GlobalConfig.jifengTiaoyueLg.st102090;
		this.discountIcon.visible = discount > 0
	}

	public _SetItem(id, count, type) {
		var red = new RewardData();
		red.id = id
		red.count = count
		red.type = type
		this.item.data = red;
	}
	public _SetImgHot(isShow: boolean) {
		this.imgHot.visible = isShow
		// this.itemName.horizontalCenter = isShow ? 19 : 0
	}

	// static jobTypeToIcon = [
	// 	"",
	// 	"job1Item",
	// 	"job2Item",
	// 	"job3Item",
	// ];
	// static qualityToTextBG = [
	// 	"shop_02",
	// 	"shop_07",
	// 	"shop_06",
	// 	"shop_10",
	// 	"shop_03",
	// 	"shop_05",
	// ];
}

window["ShopBaseItemData"] = ShopBaseItemData