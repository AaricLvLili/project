class BuyWin extends BaseEuiPanel {

	public static LAYER_LEVEL = LayerManager.UI_Popup

	public constructor() {
		super()
	}
	num
	itemIcon
	add1Btn
	add10Btn
	sub1Btn
	sub10Btn
	buyBtn
	numLabel
	shopID
	itemName
	used
	textBG

	private price: PriceIcon
	private totalPrice: PriceIcon
	//private closeBtn: eui.Button;


	initUI() {
		super.initUI();
		this.skinName = "BuySkin";
		this.num = 1;
		this.itemIcon.imgJob.visible = false;
	};
	open(...param: any[]) {
		this.m_bg.init(`BuyWin`, GlobalConfig.jifengTiaoyueLg.st100069)
		//this.closeBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this._OnClick, this);
		this.add1Btn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTap, this);
		this.add10Btn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTap, this);
		this.sub1Btn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTap, this);
		this.sub10Btn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTap, this);
		this.buyBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.buy, this);
		this.numLabel.addEventListener(egret.Event.CHANGE, this.inputOver, this);
		this.num = 1;
		this.shopID = param[0];
		this.updateView();
		this.inputOver();
	};
	close() {
		//this.closeBtn.removeEventListener(egret.TouchEvent.TOUCH_TAP, this._OnClick, this)
		this.add1Btn.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onTap, this);
		this.add10Btn.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onTap, this);
		this.sub1Btn.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onTap, this);
		this.sub10Btn.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onTap, this);
		this.buyBtn.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.buy, this);
		this.numLabel.removeEventListener(egret.Event.CHANGE, this.inputOver, this);
	};
	private _OnClick(e: egret.TouchEvent) {
		ViewManager.ins().close(this);
	}
	updateView() {
		var shopConfig = GlobalConfig.ins("ItemStoreConfig")[this.shopID];
		var itemConfig = GlobalConfig.itemConfig[shopConfig.itemId];
		if (shopConfig.type == 0) {
			this.itemIcon.setItemImg(MoneyManger.MoneyConstToSource(shopConfig.itemId))
			this.itemName.text = MoneyManger.MoneyConstToName(shopConfig.itemId);
			this.itemName.textColor = ItemBase.QUALITY_COLOR[0];
		}
		else {
			this.itemIcon.setData(itemConfig);
			this.itemName.text = itemConfig.name;
			this.itemName.textColor = ItemBase.QUALITY_COLOR[itemConfig.quality];
		}
		this.price.price = shopConfig.price
		this.price.price = this.num * shopConfig.price
		this.numLabel.text = this.num + "";

		this.used.text = "（" + shopConfig.use + "）";
		this.used.x = this.itemName.x + this.itemName.width;
		if (shopConfig.costType != null) {
			this.price.setType(shopConfig.costType);
			this.totalPrice.setType(shopConfig.costType);
		}
	};
	onTap(e) {
		switch (e.currentTarget) {
			case this.sub10Btn:
				this.num -= 10;
				break;
			case this.sub1Btn:
				this.num -= 1;
				break;
			case this.add10Btn:
				this.num += 10;
				break;
			case this.add1Btn:
				this.num += 1;
				break;
		}
		if (this.num < 1)
			this.num = 1;
		this.numLabel.text = this.num + "";
		this.inputOver();
	};
	closeCB(e) {
		ViewManager.ins().close(BuyWin);
	};
	buy(e) {
		if (Checker.Money(this.price.getType(), this.totalPrice.price)) {
			var arr = [this.shopID, this.num]; //0:id, 1:num
			Shop.ins().sendBuy(1, [arr]);
			this.closeCB(e)
		}
	};
	inputOver() {
		this.num = parseInt(this.numLabel.text);
		if (isNaN(this.num) || this.num < 1)
			this.num = 1;
		if (this.num > 9999)
			this.num = 9999;
		this.numLabel.text = this.num + "";
		this.totalPrice.price = this.num * this.price.price
	};
}


window["BuyWin"] = BuyWin