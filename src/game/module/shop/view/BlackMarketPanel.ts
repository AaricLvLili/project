class BlackMarketPanel extends BaseView implements ICommonWindowTitle {

	public listView: eui.List;
	public buyAllItemBtn: eui.Button;
	public refreshShopBtn: eui.Button;
	public tip: eui.Label;
	public point: eui.Label;
	public priceIcon: eui.Image;
	public price: eui.Label;

	public noGoods: eui.Label;
	public szClose: eui.Group;
	public szCloseGroup: eui.Group;
	windowTitleIconName: string = GlobalConfig.jifengTiaoyueLg.st100053;
	public m_Lan: eui.Label;

	public constructor() {
		super()
		this.skinName = "BlackMarketSkin";
		this.name = GlobalConfig.jifengTiaoyueLg.st100053;
		this.m_Lan.text = GlobalConfig.jifengTiaoyueLg.st100062;
		this.noGoods.text = GlobalConfig.jifengTiaoyueLg.st100063;
		this.buyAllItemBtn.label = GlobalConfig.jifengTiaoyueLg.st100064;
		this.refreshShopBtn.label = GlobalConfig.jifengTiaoyueLg.st100065;
	}

	protected childrenCreated() {
		this.listView.itemRenderer = BlackMarketItemRenderer;
	}

	open() {
		if (Shop.ins().shopNorefrush) {
			Shop.ins().shopNorefrush = false;
			Shop.ins().sendStartRefreshShop();
			//关闭神秘商店提示
			ViewManager.ins().open(FirstShopPanel)
		}
		this.AddClick(this, this.onTap);
		this.AddClick(this.buyAllItemBtn, this.buyAllItem);
		this.AddClick(this.refreshShopBtn, this.refreshShop);
		MessageCenter.addListener(Shop.postUpdateShopData, this.updateData, this);
		MessageCenter.addListener(Shop.postBuyResult, this.buyResultCB, this);
		this.price.text = GlobalConfig.ins("StoreCommonConfig").refreshYuanBao + "";
		this.szClose.visible = !Shop.ins().openState;
		this.szCloseGroup.visible = Shop.ins().openState;
		this.listView.visible = Shop.ins().openState;
		this.updateData();

		GameGlobal.MessageCenter.dispatch(MessageDef.SHOP_REFRESH, false)
	};
	close() {
		// this.buyAllItemBtn.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.buyAllItem, this);
		// this.refreshShopBtn.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.refreshShop, this);
		MessageCenter.ins().removeAll(this);
		TimerManager.ins().removeAll(this);
	};
	buyAllItem(e) {
		var arr = []; //0:id, 1:num
		var allGold = 0;
		var allYb = 0;
		var bagNum = 0;
		var shopData = Shop.ins().shopData;
		var len = shopData.getShopEquipDataLength();
		var sed = null;
		var point = 0;
		for (var i = 0; i < len; i++) {
			sed = shopData.getShopEquipDataByIndex(i);
			if (sed != null) {
				if (sed.item.itemConfig.type == 0) {
					point = UserBag.ins().calculationScore(sed.item);
					if (point > 0) {
						bagNum += 1;
					}
					else {
						continue;
					}
				}
				arr.push([sed.id, 1]);
				if (sed.costType == 1) {
					allGold += sed.costNum;
				}
				else {
					allYb += sed.costNum;
				}
			}
		}
		if (UserBag.ins().getSurplusCount() < bagNum) {
			var strTips = GlobalConfig.jifengTiaoyueLg.st100054;
			UserTips.ins().showTips(strTips);
			return;
		}
		if (GameLogic.ins().actorModel.gold < allGold) {
			UserWarn.ins().setBuyGoodsWarn(1);
			return;
		}
		if (GameLogic.ins().actorModel.yb < allYb) {
			UserTips.ins().showTips(GlobalConfig.jifengTiaoyueLg.st100014);
			return;
		}
		if (allGold == 0 && allYb == 0) {
			UserTips.ins().showTips(GlobalConfig.jifengTiaoyueLg.st100055);
			return;
		}
		Shop.ins().sendBuy(2, arr);
	};
	refreshShop(e) {
		if (Shop.ins().shopData.times < GlobalConfig.ins("StoreCommonConfig").refreshLimit) {
			// if (GameLogic.ins().actorModel.yb < GlobalConfig.ins("StoreCommonConfig").refreshYuanBao) {
			// 	UserTips.ins().showTips("|C:0xf87372&T:钻石不足！|");
			// 	return;
			// }
			let [type, value] = this.GetRefreshData()
			if (Checker.Money(type, value)) {
				Shop.ins().sendRefreshShop();
			}
		}
		else {
			UserTips.ins().showTips(GlobalConfig.jifengTiaoyueLg.st100056);
		}
	};
	onTap(e) {
		if (e.target.name == "buy") {
			if (UserBag.ins().getSurplusCount() <= 0) {
				var strTips = GlobalConfig.jifengTiaoyueLg.st100054;
				UserTips.ins().showTips(strTips);
				return;
			}
			var goodsID = e.target.parent['goodsID'];
			var sed = Shop.ins().shopData.getShopEquipDataByIndex(goodsID);
			if (sed.costType == 1) {
				if (GameLogic.ins().actorModel.gold < sed.costNum) {
					UserWarn.ins().setBuyGoodsWarn(1);
					return;
				}
			}
			else {
				if (GameLogic.ins().actorModel.yb < sed.costNum) {
					UserTips.ins().showTips(GlobalConfig.jifengTiaoyueLg.st100014);
					return;
				}
			}
			var item = sed.item;
			if (item.itemConfig.type == 0 && item.itemConfig.job != 0) {
				var point = UserBag.ins().calculationScore(item);
				if (point > 0) {
					var arr = [goodsID, 1];
					Shop.ins().sendBuy(2, [arr]);
				}
				else {
					WarnWin.show(GlobalConfig.jifengTiaoyueLg.st100057, function () {
					}, this, null, null, "sure");
				}
			}
			else {
				var arr = [goodsID, 1];
				Shop.ins().sendBuy(2, [arr]);
			}
		}
	};
	buyResultCB(result) {
		if (result == 1) {
			UserTips.ins().showTips(GlobalConfig.jifengTiaoyueLg.st100058);
		}
		else {
			UserTips.ins().showTips(GlobalConfig.jifengTiaoyueLg.st100059);
		}
	};
	updateData() {
		var arr = [];
		var shopData = Shop.ins().shopData;
		var len = shopData.getShopEquipDataLength();
		var sed = null;
		for (var i = 0; i < len; i++) {
			sed = shopData.getShopEquipDataByIndex(i);
			if (sed != null) {
				arr.push(sed);
			}
		}
		this.listView.dataProvider = new eui.ArrayCollection(arr);
		if (!TimerManager.ins().isExists(this.refushEndTime, this)) {
			TimerManager.ins().doTimer(1000, Shop.ins().shopData.refushTime, this.refushEndTime, this);
			this.refushEndTime();
		}

		if (Shop.ins().openState) {
			this.noGoods.visible = arr.length <= 0;
		}
		else {
			this.noGoods.visible = false;
		}
		this.point.text = GlobalConfig.jifengTiaoyueLg.st100060 + Shop.ins().shopData.point;

		let [type, value] = this.GetRefreshData()
		this.priceIcon.source = MoneyManger.MoneyConstToSource(type)
		this.price.text = value + ""
		if (type == MoneyConst.gold) {
			this.price.textFlow = TextFlowMaker.generateTextFlow(this.price.text + `|C:0x00FF00&T:(${shopData.times}/${GlobalConfig.ins("StoreCommonConfig").goldRefreshCount})|`)
		}
	};

	private GetRefreshData() {
		let shopData = Shop.ins().shopData
		let config = GlobalConfig.ins("StoreCommonConfig")
		if (shopData.times >= config.goldRefreshCount) {
			return [MoneyConst.yuanbao, config.refreshYuanBao]
		}
		return [MoneyConst.gold, config.refreshGold]
	}

	refushEndTime() {
		this.tip.text = GlobalConfig.jifengTiaoyueLg.st100061 + DateUtils.getFormatBySecond(Shop.ins().shopData.refushTime);
	};

	UpdateContent(): void {

	}
}

ViewManager.ins().reg(BlackMarketPanel, LayerManager.UI_Main);

window["BlackMarketPanel"] = BlackMarketPanel