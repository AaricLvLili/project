class ShopGoodsWarn extends BaseEuiPanel {
	public constructor() {
		super();
	}

	gainList: eui.List
	countTxt
	private price: PriceIcon
	private totalPrice: PriceIcon
	public itemIcon: ItemIcon;
	decBtn
	addBtn
	dec10Btn
	add10Btn
	buyBtn: eui.Button;
	topUpBtn: eui.Button;
	private _totalNum = 0
	_goodsId
	nameTxt
	titleTxt
	goodsGroup
	scroller: eui.Scroller;

	//private dialogCloseBtn: eui.Button;
	private gainItemConfig: any;
	private languageTxt: eui.Label;
	private languageTxt0: eui.Label;
	shopConfig
	initUI() {
		super.initUI()
		this.skinName = "GainGoodsSkin";
		this.gainList.itemRenderer = GainGoodsItem;
		this.countTxt.restrict = "0-9";
		this.price.setType(MoneyConst.yuanbao);
		this.totalPrice.setType(MoneyConst.yuanbao);
		this.topUpBtn.visible = StartGetUserInfo.isOne == false;//如果是单机屏蔽充值按钮
		this.languageTxt.text = GlobalConfig.jifengTiaoyueLg.st100791 + "：";
		this.languageTxt0.text = GlobalConfig.jifengTiaoyueLg.st100792 + "：";
		this.buyBtn.label = GlobalConfig.jifengTiaoyueLg.st100069;
		this.topUpBtn.label = GlobalConfig.jifengTiaoyueLg.st100227;
	};
	open() {
		this.topUpBtn.visible = !WxSdk.ins().isHidePay();
		this.m_bg.init(`ShopGoodsWarn`, GlobalConfig.jifengTiaoyueLg.st100108)
		//this.dialogCloseBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this._OnClick, this);
		// this.commonDialog.OnAdded(this)
		TimerManager.ins().doTimer(500, 1, () => {
			this.decBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTap, this);
			this.addBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTap, this);
			this.dec10Btn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTap, this);
			this.add10Btn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTap, this);
			this.buyBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTap, this);
			this.topUpBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTap, this);
			// this.closeBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTap, this);
			// this.closeBtn0.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTap, this);
			this.gainList.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchList, this);
			this.countTxt.addEventListener(egret.Event.CHANGE, this.onTxtChange, this);
			MessageCenter.addListener(Shop.postBuyResult, this.buyCallBack, this);
		}, this);
	};

	close() {
		//this.dialogCloseBtn.removeEventListener(egret.TouchEvent.TOUCH_TAP, this._OnClick, this)
		this.decBtn.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onTap, this);
		this.addBtn.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onTap, this);
		this.dec10Btn.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onTap, this);
		this.add10Btn.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onTap, this);
		this.buyBtn.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onTap, this);
		this.topUpBtn.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onTap, this);
		// this.closeBtn.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onTap, this);
		// this.closeBtn0.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onTap, this);
		this.gainList.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchList, this);
		this.countTxt.removeEventListener(egret.Event.CHANGE, this.onTxtChange, this);
		MessageCenter.ins().removeAll(this);
	};
	onTap(e) {
		switch (e.currentTarget) {
			case this.decBtn:
				this.setTotalPrice(this._totalNum - 1);
				break;
			case this.addBtn:
				this.setTotalPrice(this._totalNum + 1);
				break;
			case this.dec10Btn:
				this.setTotalPrice(this._totalNum - 10);
				break;
			case this.add10Btn:
				this.setTotalPrice(this._totalNum + 10);
				break;
			case this.buyBtn:
				if (Checker.Money(this.shopConfig.costType, this.totalPrice.getPrice())) {
					Shop.ins().sendBuy(1, [[this._goodsId, this._totalNum]]);
				}
				break;
			case this.topUpBtn:
				ViewManager.ins().open(ChargeFirstWin);
				ViewManager.ins().close(this)
				break;
			// case this.closeBtn:
			// case this.closeBtn0:
			// 	ViewManager.ins().close(ShopGoodsWarn);
			// 	break;
		}
	};
	private _OnClick(e: egret.TouchEvent) {
		ViewManager.ins().close(this);
	}
	onTouchList(e) {
		var item = e.target;
		if (!item) {
			return
		}
		item = item.userData
		if (item) {
			if (item[1][0]) {
				if (GameGuider.guidance(item[1][0], item[1][1])) {
					//ViewManager.ins().closePartPanel()//先注释掉，有关掉当前界面的BUG
					ViewManager.ins().close(ShopGoodsWarn);
				} else {
					// UserTips.ins().showTips("不在开放时间内！！！")
				}
			}
		}
	};
	buyCallBack(num) {
		if (num > 0) {
			ViewManager.ins().close(ShopGoodsWarn);
		}
		else
			UserTips.ins().showTips(GlobalConfig.jifengTiaoyueLg.st100014);
	};
	onTxtChange(e) {
		var num = Number(this.countTxt.text);
		this.setTotalPrice(num);
	};
	setData(id, num) {
		var shopConfig;
		if (id >= 101501 && id <= 151505) {
			var itemConfig = GlobalConfig.itemConfig[id];
			this.itemIcon.setData(itemConfig);
			this.nameTxt.text = "" + itemConfig.name;
			this.nameTxt.textColor = ItemBase.QUALITY_COLOR[itemConfig.quality];
			shopConfig = false
			this.titleTxt.text = GlobalConfig.jifengTiaoyueLg.st100786;//"材料不足，通过以下方式获得";
		} else if (id > 20000) {
			var itemConfig = GlobalConfig.itemConfig[id];
			this.itemIcon.setData(itemConfig);
			this.nameTxt.text = "" + itemConfig.name;
			this.nameTxt.textColor = ItemBase.QUALITY_COLOR[itemConfig.quality];
			shopConfig = ItemStoreConfig.getStoreByItemID(id);
			this.titleTxt.text = GlobalConfig.jifengTiaoyueLg.st100786;//"材料不足，通过以下方式获得";
		} else {
			this.itemIcon.setData(null);
			// switch (id) {
			// 	//金币
			// 	case MoneyConst.gold:
			// 		this.itemIcon.imgIcon.source = "propIcon_025_png";
			// 		this.nameTxt.text = GlobalConfig.languageConfig.st100018;//"金币";
			// 		this.titleTxt.text = GlobalConfig.languageConfig.st100787;//"货币不足，通过以下方式获得";
			// 		break;
			// 	//魂值
			// 	case MoneyConst.soul:
			// 		this.itemIcon.imgIcon.source = "comp_53_53_01_png";
			// 		this.nameTxt.text = GlobalConfig.languageConfig.st100657;//"灵魄";
			// 		shopConfig = ItemStoreConfig.getStoreByItemID(id);
			// 		this.titleTxt.text = GlobalConfig.languageConfig.st100788;//"灵魄不足，通过以下方式获得";
			// 		break;
			// 	case MoneyConst.PRESTIGE:
			// 		this.itemIcon.imgIcon.source = RewardData.getCurrencyRes(id)
			// 		this.nameTxt.text = RewardData.getCurrencyName(id)
			// 		this.titleTxt.text = GlobalConfig.languageConfig.st100789;//"通过以下方式获得"
			// 		break;
			// 	default:
			this.itemIcon.setItemImg(MoneyManger.MoneyConstToSource(id));
			this.itemIcon.setItemBg(ResDataPath.GetItemQualityName(MoneyManger.MoneyConstToQuality(id)));
			this.nameTxt.text = MoneyManger.MoneyConstToName(id);
			this.titleTxt.text = MoneyManger.MoneyConstToName(id) + GlobalConfig.jifengTiaoyueLg.st100790;
			// 		break
			// }
			this.nameTxt.textColor = 0xFFB82A;
		}

		if (this.gainItemConfig == null) {
			this.gainItemConfig = GlobalConfig.ins("GainItemConfig");
		}

		var gainConfig = this.gainItemConfig[id];
		if (gainConfig != null) {
			let config = gainConfig.gainWay.slice(0, gainConfig.gainWay.length)
			for (let i = 0; i < config.length; ++i) {
				let data = config[i]
				if (data[1][0] == ViewIndexDef.ACT_GIFT) {
					let activityData = ActivityModel.ins().GetActivityDataByType(2)
					if (!ActivityModel.ins().IsOpen(activityData)) {
						config.splice(i, 1)
					}
					if (id == ViewIndexDef.EGG_BROKEN_PANEL && !EggBroken.IsOpen()) {// 判断砸金蛋活动是否关闭
						config.splice(i, 1)
					}
				}
			}
			this.gainList.dataProvider = new eui.ArrayCollection(config);
		} else {
			this.gainList.dataProvider = new eui.ArrayCollection([]);
		}

		this.currentState = shopConfig ? "shop" : "getway"
		this.validateNow();
		var len = this.gainList.dataProvider.length;
		this.shopConfig = shopConfig
		if (shopConfig) {
			this.price.setType(shopConfig.costType);
			this.totalPrice.setType(shopConfig.costType);
			this._goodsId = shopConfig.index;
			this.price.setPrice(shopConfig.price);
			this.setTotalPrice(num);
		} else {
		}
	};
	setTotalPrice(num: number) {
		if (num <= 0)
			this._totalNum = 1;
		else if (num >= 10000)
			this._totalNum = 9999;
		else
			this._totalNum = num;
		this.countTxt.text = this._totalNum + "";
		this.totalPrice.setPrice(this._totalNum * this.price.getPrice());
	};
}

ViewManager.ins().reg(ShopGoodsWarn, LayerManager.UI_Popup);

window["ShopGoodsWarn"] = ShopGoodsWarn