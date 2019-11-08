class IntegrationPanel extends BaseView implements ICommonWindowTitle {

	list
	label1

	windowTitleIconName: string = "L积分商店R"
	childrenCreated() {
		this.name = "积分商店";
		this.skinName = "ShopPointSkin";
		this.list.itemRenderer = IntegrationItemRenderer;
	}

	open() {
		this.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTap, this);
		MessageCenter.addListener(Shop.postRefreshIntegrationSucc, this.buyResultCB, this);
		this.updateData();
	};
	close() {
		this.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onTap, this);
		MessageCenter.ins().removeAll(this);
	};
	buyResultCB(param) {
		if (param[0]) {
			UserTips.ins().showTips("购买成功");
		}
		else {
			UserTips.ins().showTips("|C:0xf87372&T:购买失败|");
		}
		let num = param[1]
		this.label1.text = "我的积分：" + CommonUtils.overLength(num) + "（在神秘商店购买商品或刷新获得）";
	};
	updateData() {
		var arr = [];
		var dataProvider = GlobalConfig.ins("IntegralStore");
		for (var k in dataProvider) {
			arr.push(dataProvider[k]);
		}
		this.list.dataProvider = new eui.ArrayCollection(arr);
		this.label1.text = "我的积分：" + CommonUtils.overLength(Shop.ins().shopData.point) + "（在神秘商店购买商品或刷新获得）";
	};
	onTap(e) {
		if (e.target.name == "buy") {
			var goodsID = e.target.parent['goodsID'];
			var dataProvider = GlobalConfig.ins("IntegralStore");
			var integ = void 0;
			for (var k in dataProvider) {
				var element = dataProvider[k];
				if (element.index == goodsID) {
					integ = element;
				}
			}
			if (integ.type != 1) {
				if (UserBag.ins().getSurplusCount() <= 0) {
					var strTips = "背包已满，无法购买";
					UserTips.ins().showTips(strTips);
					return;
				}
			}
			if (GameLogic.ins().actorModel.yb < integ.YuanBao) {
				UserTips.ins().showTips("|C:0xf87372&T:钻石不足！|");
				return;
			}
			if (Shop.ins().shopData.point < integ.integral) {
				UserTips.ins().showTips("|C:0xf87372&T:积分不足！|");
				return;
			}
			Shop.ins().sendIntegrationShop(goodsID);
		}
	};

	UpdateContent(): void {

	}
}
window["IntegrationPanel"]=IntegrationPanel