class GainZsWin extends BaseEuiPanel {
	public constructor() {
		super()
	}

	infoTxts
	toDays
	items
	btns
	priceIcon1: PriceIcon
	priceIcon2: PriceIcon
	// colorCanvas
	// closeBtn0
	// closeBtn

	//private dialogCloseBtn:eui.Button;
	private ZhuanShengConfig;
	private m_TurnLab1: eui.Label;
	private m_TurnLab2: eui.Label;


	initUI() {
		super.initUI()
		this.skinName = "GainZsSkin";
		this.infoTxts = [this['infoTxt0'], this['infoTxt1'], this['infoTxt2']];
		this.toDays = [this['toDay0'], this['toDay1'], this['toDay2']];
		this.items = [this['item0'], this['item1'], this['item2']];
		this.btns = [this['btn0'], this['btn1'], this['btn2']];
		for (var i = 0; i < this.items.length; i++) {
			this.items[i].isShowName(false);
		}
		this.priceIcon1.setType(MoneyConst.yuanbao);
		this.priceIcon2.setType(MoneyConst.yuanbao);
		var reward = new RewardData();
		reward.type = 0;
		reward.id = 0;
		reward.count = 0;
		this.items[0].data = reward;
		this.layerLevel = VIEW_LAYER_LEVEL.TOP;
		this.btns[0].label = GlobalConfig.jifengTiaoyueLg.st100726;
	};
	open() {
		this.m_bg.init(`GainZsWin`, GlobalConfig.jifengTiaoyueLg.st100727)
		//this.dialogCloseBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this._OnClick, this);
		this.AddClick(this, this.onTap);
		MessageCenter.addListener(UserZs.ins().postZsData, this.setData, this);
		MessageCenter.addListener(GameLogic.ins().postLevelChange, this.setData, this);
		this.setData();
	};
	close() {
		//this.dialogCloseBtn.removeEventListener(egret.TouchEvent.TOUCH_TAP, this._OnClick, this)
		// this.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onTap, this);
		MessageCenter.ins().removeAll(this);
	};
	private _OnClick(e: egret.TouchEvent) {
		ViewManager.ins().close(this);
	}
	setData() {
		if (this.ZhuanShengConfig == null)
			this.ZhuanShengConfig = GlobalConfig.ins("ZhuanShengConfig");
		var config = this.ZhuanShengConfig;
		var actorModel = GameLogic.ins().actorModel;
		var lowestLv = config.level + 1;
		var lv = Math.max(actorModel.level, lowestLv);
		var lvConfig = GlobalConfig.zhuanShengLevelConfig[lv];
		var expConfig = GlobalConfig.ins("ZhuanShengExpConfig")[lv];
		var ins = UserZs.ins();
		var sCount;
		this.toDays[0].textColor = actorModel.level < lowestLv ? 0xf87372 : 0xA89C88;

		let languageStr = LanguageString.jifengTiaoyueCh(GlobalConfig.jifengTiaoyueLg.st100715, [expConfig.exp])//"增加<font color=\"#9de242\">" + expConfig.exp + "</font>修为\n\n等级兑换：降1级"
		this.infoTxts[0].textFlow = (new egret.HtmlTextParser()).parser(languageStr);
		sCount = config.conversionCount - ins.upgradeCount[0];

		let languageStr1 = LanguageString.jifengTiaoyueCh(GlobalConfig.jifengTiaoyueLg.st100716, [lowestLv - 1]);//"大于" + (lowestLv - 1) + "级才能兑换"
		let languageStr2 = LanguageString.jifengTiaoyueCh(GlobalConfig.jifengTiaoyueLg.st100717, [sCount]);//"今天还可兑换<font color=\"#9de242\">" + sCount + "</font>次"

		this.toDays[0].textFlow = (new egret.HtmlTextParser()).parser(actorModel.level < lowestLv ? languageStr1 : languageStr2);
		this.btns[0].enabled = sCount > 0;
		var itemID = config.normalItem;
		var itemConfig = GlobalConfig.itemConfig[itemID];
		var count = UserBag.ins().getBagGoodsCountById(0, itemID);
		this.items[1].data = itemID;
		if (count) {
			this.btns[1].label = GlobalConfig.jifengTiaoyueLg.st100711;//"立即使用"
			this.btns[1].labelDisplay.size = 14
		}
		else {
			this.btns[1].label = GlobalConfig.jifengTiaoyueLg.st100718;//"购买并使用"
			this.btns[1].labelDisplay.size = 14
		}
		this.btns[1].name = config.normalExp + "";
		this.priceIcon1.visible = count == 0;
		this.priceIcon1.setPrice(ItemStoreConfig.getStoreByItemID(itemID).price);
		this.priceIcon1.name = itemConfig.name;

		let languageStr3 = LanguageString.jifengTiaoyueCh(GlobalConfig.jifengTiaoyueLg.st100719, [config.normalExp, itemConfig.name]);
		let languageStr4 = LanguageString.jifengTiaoyueCh(GlobalConfig.jifengTiaoyueLg.st100720, [count]);
		this.infoTxts[1].textFlow = (new egret.HtmlTextParser()).parser(languageStr3 + (count ? languageStr4 : ""));

		let zsLv: number = 0;
		if (UserZs.ins().lv > 12) {
			zsLv = 12;
		} else {
			zsLv = UserZs.ins().lv;
		}
		sCount = config.normalCount[zsLv] - ins.upgradeCount[1]
		let languageStr5 = LanguageString.jifengTiaoyueCh(GlobalConfig.jifengTiaoyueLg.st100717, [sCount]);//"今天还可兑换<font color=\"#9de242\">" + sCount + "</font>次"
		this.toDays[1].textFlow = (new egret.HtmlTextParser()).parser(languageStr5);
		this.btns[1].enabled = sCount > 0;
		itemID = config.advanceItem;
		itemConfig = GlobalConfig.itemConfig[itemID];
		count = UserBag.ins().getBagGoodsCountById(0, itemID);
		this.items[2].data = itemID;
		if (count) {
			this.btns[2].label = GlobalConfig.jifengTiaoyueLg.st100711;//"立即使用"
			this.btns[2].labelDisplay.size = 14
		}
		else {
			this.btns[2].label = GlobalConfig.jifengTiaoyueLg.st100718;//"购买并使用"
			this.btns[2].labelDisplay.size = 14
		}
		this.btns[2].name = config.advanceExp + "";

		this.priceIcon2.visible = count == 0;
		let storeconfig2 = ItemStoreConfig.getStoreByItemID(itemID)
		this.priceIcon2.setPrice(storeconfig2.price);
		this.priceIcon2.setType(storeconfig2.costType);
		this.priceIcon2.name = itemConfig.name;

		let languageStr6 = LanguageString.jifengTiaoyueCh(GlobalConfig.jifengTiaoyueLg.st100719, [config.advanceExp, itemConfig.name]);
		let languageStr7 = LanguageString.jifengTiaoyueCh(GlobalConfig.jifengTiaoyueLg.st100720, [count]);

		this.infoTxts[2].textFlow = (new egret.HtmlTextParser()).parser(languageStr6 + (count ? languageStr7 : ""));
		sCount = config.advanceCount[zsLv] - ins.upgradeCount[2]
		let languageStr8 = LanguageString.jifengTiaoyueCh(GlobalConfig.jifengTiaoyueLg.st100717, [sCount]);
		this.toDays[2].textFlow = (new egret.HtmlTextParser()).parser(languageStr8);
		this.btns[2].enabled = sCount > 0;

		for (var i = 0; i < 3; i++) {
			UIHelper.ShowRedPoint(this['btn' + i], UserZs.ins().canGet(i));
		}
		if (ins.lv >= config.maxzslevel) {
			this.m_TurnLab1.visible = false;
			this.m_TurnLab2.visible = false;
		} else {
			let nextLv: number = ins.lv + 1;
			if (nextLv > 12) {
				nextLv = 12;
			}
			this.m_TurnLab1.textFlow = (new egret.HtmlTextParser()).parser("<font color=\"#9de242\">" + nextLv + "</font>" + GlobalConfig.jifengTiaoyueLg.st100721 + "<font color=\"#9de242\">" + this.ZhuanShengConfig["normalCount"][nextLv] + "</font>");
			this.m_TurnLab2.textFlow = (new egret.HtmlTextParser()).parser("<font color=\"#9de242\">" + nextLv + "</font>" + GlobalConfig.jifengTiaoyueLg.st100721 + "<font color=\"#9de242\">" + this.ZhuanShengConfig["advanceCount"][nextLv] + "</font>");
		}
	};
	onTap(e) {
		switch (e.target) {
			// case this.colorCanvas:
			// case this.closeBtn0:
			// case this.closeBtn:
			// 	ViewManager.ins().close(this);
			// 	break;
			default:
				var index_1 = this.btns.indexOf(e.target);
				if (index_1 > -1) {
					if (index_1 == 0) {
						UserZs.ins().sendGetXiuWei(index_1 + 1);
					}
					else if (this.btns[index_1].label == GlobalConfig.jifengTiaoyueLg.st100711) {
						UserZs.ins().sendGetXiuWei(index_1 + 1);
					}
					else {
						// var price = this['priceIcon' + index_1].getPrice();
						// if (GameLogic.ins().actorModel.yb < price) {
						// 	UserTips.ins().showTips(GlobalConfig.languageConfig.st100008);
						// 	return;
						// }

						// if (this.ZhuanShengConfig == null)
						// 	this.ZhuanShengConfig = GlobalConfig.ins("ZhuanShengConfig");
						// let tmp = this.ZhuanShengConfig;
						// tmp = index_1 == 1 && tmp.normalItem || tmp.advanceItem
						// UserZs.ins().sendGetXiuWei(index_1 + 1, tmp);

						var price = this['priceIcon' + index_1].getPrice();
						var config = this.ZhuanShengConfig;
						let itemID: number;
						if (index_1 == 1)
							itemID = config.normalItem;
						else
							itemID = config.advanceItem;
						let storeconfig = ItemStoreConfig.getStoreByItemID(itemID)
						if (Checker.Money(storeconfig.costType, price)) {
							if (this.ZhuanShengConfig == null)
								this.ZhuanShengConfig = GlobalConfig.ins("ZhuanShengConfig");
							let tmp = this.ZhuanShengConfig;
							tmp = index_1 == 1 && tmp.normalItem || tmp.advanceItem
							UserZs.ins().sendGetXiuWei(index_1 + 1, tmp);
						}
					}
				}
		}
	};
}

ViewManager.ins().reg(GainZsWin, LayerManager.UI_Popup);

window["GainZsWin"] = GainZsWin