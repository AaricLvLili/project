class ItemShopPanel extends BaseView implements ICommonWindowTitle {

	listView
	private priceLabel: eui.Label

	windowTitleIconName: string = GlobalConfig.jifengTiaoyueLg.st100072;
	public integralLabel: eui.Label;

	childrenCreated() {

		this.name = GlobalConfig.jifengTiaoyueLg.st100072;
		this.skinName = "ItemShopSkin";
		this.listView.itemRenderer = ItemShopItemRenderer;
		this.integralLabel.text = GlobalConfig.jifengTiaoyueLg.st100071;
	}

	open() {
		this.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTap, this);
		MessageCenter.addListener(Shop.postBuyResult, this.buyResultCB, this);
		this.updateData();
	};
	close() {
		var param = [];
		for (var _i = 0; _i < arguments.length; _i++) {
			param[_i - 0] = arguments[_i];
		}
		this.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onTap, this);
		MessageCenter.ins().removeAll(this);
	};

	updateData() {
		var arr = [];
		var dataProvider = GlobalConfig.ins("ItemStoreConfig");
		for (var k in dataProvider) {//屏蔽洗红丹，过渠道测试
			if (dataProvider[k].itemId == 450003 || dataProvider[k].itemId == 450004)
				continue;
			arr.push(dataProvider[k]);
		}
		this.listView.dataProvider = new eui.ArrayCollection(arr);

		this.priceLabel.text = GameGlobal.actorModel.yb.toString();
	};
	onTap(e) {
		if (e.target.name == "buy") {
			var goodsID = e.target.parent['goodsID'];
			ViewManager.ins().open(BuyWin, goodsID);
		}
	};
	buyResultCB(result) {
		if (result == 1) {
			UserTips.ins().showTips(GlobalConfig.jifengTiaoyueLg.st100058);
		}
		else {
			UserTips.ins().showTips(GlobalConfig.jifengTiaoyueLg.st100059);
		}

		this.priceLabel.text = GameGlobal.actorModel.yb.toString();
	};
	UpdateContent(): void { }
}

window["ItemShopPanel"] = ItemShopPanel