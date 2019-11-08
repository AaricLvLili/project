class CouponShopItem extends eui.ItemRenderer {
	public constructor() {
		super();
		this.skinName = "LimitGiftActItemSkin";
	}
	public itemName: eui.Label;
	public item: ItemBase;
	public imgDiscountBg: eui.Image;
	public imgDiscount: eui.Label;
	public m_Lan1: eui.Label;
	public m_Lan2: eui.Label;
	public price: PriceIcon;
	public y_price: PriceIcon;
	public buy: eui.Button;
	public redPoint: eui.Group;
	public desc: eui.Label;
	public title: eui.Label;
	public m_DisGroup: eui.Group;
	childrenCreated() {
		this.buy.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onClick, this)
		this.m_Lan1.text = GlobalConfig.jifengTiaoyueLg.st101336;
		this.m_Lan2.text = GlobalConfig.jifengTiaoyueLg.st101337;
		this.title.visible = false;
	}
	dataChanged() {
		super.dataChanged();
		let id = this.data;
		this.redPoint.visible = false;
		let ticketShopConfig = GlobalConfig.ins("ticketShopConfig")[id];
		let coupon: number = GameLogic.ins().actorModel.coupon;
		if (ticketShopConfig) {
			this.itemName.text = ticketShopConfig.title;
			this.item.data = ticketShopConfig.rewards[0];
			this.item.isShowName(false)
			if (ticketShopConfig.discount) {
				this.m_DisGroup.visible = true;
				this.imgDiscount.text = (ticketShopConfig.discount * 0.1) + GlobalConfig.jifengTiaoyueLg.st102090
			} else {
				this.m_DisGroup.visible = false;
			}
			this.price.price = ticketShopConfig.price;
			this.y_price.price = Math.floor(ticketShopConfig.price / (ticketShopConfig.discount * 0.01));
			this.y_price.iconImg.source = this.price.iconImg.source = MoneyManger.MoneyConstToSource(ticketShopConfig.currencyType);
			let count = ticketShopConfig.count - CouponModel.getInstance.shopDic.get(parseInt(id));
			if (UserVip.ins().lv >= ticketShopConfig.vip) {
				this.buy.label = GlobalConfig.jifengTiaoyueLg.st101282;
				if (coupon >= ticketShopConfig.price && count > 0) {
					this.redPoint.visible = true;
				}
			} else {
				this.buy.label = "VIP" + ticketShopConfig.vip + GlobalConfig.jifengTiaoyueLg.st102105;
			}
			this.desc.text = GlobalConfig.jifengTiaoyueLg.st101335 + count;
		}
	}

	private onClick() {
		let id = this.data;
		let ticketShopConfig = GlobalConfig.ins("ticketShopConfig")[id];
		let coupon: number = GameLogic.ins().actorModel.coupon;
		if (ticketShopConfig) {
			let count = ticketShopConfig.count - CouponModel.getInstance.shopDic.get(parseInt(id));
			if (UserVip.ins().lv >= ticketShopConfig.vip) {
				if (coupon < ticketShopConfig.price) {
					UserTips.ins().showTips(GlobalConfig.jifengTiaoyueLg.st102103);
					return;
				} else if (count <= 0) {
					UserTips.ins().showTips(GlobalConfig.jifengTiaoyueLg.st102106);
					return
				}
				CouponSproto.ins().sendShopBuy(parseInt(id));
			} else {
				UserTips.ins().showTips("VIP" + ticketShopConfig.vip + GlobalConfig.jifengTiaoyueLg.st102105);
			}
		}
	}

}

window["CouponShopItem"] = CouponShopItem