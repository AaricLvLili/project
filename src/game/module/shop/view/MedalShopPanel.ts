class MedalShopPanel extends BaseView implements ICommonWindowTitle {

	coin = 0
	listDatas = new eui.ArrayCollection
	list
	label0: eui.Label
	label1: eui.Label
	scroller
	labelCoin
	windowTitleIconName: string = GlobalConfig.jifengTiaoyueLg.st100073;

	private _type: number//商店类型
	private _cfg: any//商店配置
	private _hasCount: number//拥有的道具数量
	private _itemName: string//拥有的道具名字
	public constructor(...param) {
		super()
		this.skinName = "FeatsShopSkin"
		this._type = param[0];
		let str: string = this.getShopType(this._type);
		this.windowTitleIconName = str
		this.name = str;
	}

	childrenCreated() {
		this.list.itemRenderer = MedalShopItemRenderer
		this.list.dataProvider = this.listDatas
		// this.label0.textFlow = (new egret.HtmlTextParser).parser('<a href="event:"><u>' + this.label0.text + "</u></a>")

	}
	open() {
		this._setCfgByName(this._type)
		this.observe(MessageDef.SHOP_MEADAL_RESULT, this.updataData)
		this.observe(MessageDef.SHOP_MEADAL_BUY_RESULT, this.buyResult)
		Shop.ins().sendMedalMessage(this._type)
		for (var t = [], e = 0; e < arguments.length; e++) t[e - 0] = arguments[e];
		this.addTouchEvent(this, this.onBuy, this.list)
		this.addTouchEvent(this, this.onGetCoin, this.label0)



	}
	close() {
		this.removeObserve()
	}
	updataData(t: FeatsStoreData, type) {
		if (this._type != type) return
		var e = this._cfg;
		for (var i in e) {
			var s = t.exchangeCount[e[i].index];
			e[i].exchangeCount = isNaN(s) ? 0 : s
		}
		this.setListData(e)
	}
	onBuy(t) {
		if ("buy" == t.target.name) {
			// var e = GameLogic.ins().actorModel.feats
			var e = this._getValueByName(this._type)

			var i = t.target.parent
			var s = i.data
			if (s.exchangeCount >= s.daycount && 0 != s.daycount) {
				let n = GlobalConfig.jifengTiaoyueLg.st100074;
				UserTips.ins().showTips(n)
			} else if (s.feats > e) {
				let n = this._itemName + GlobalConfig.jifengTiaoyueLg.st100075;
				UserTips.ins().showTips(n)
			} else Shop.ins().sendBuyMedal(s.index, this._type)
		}
	}
	buyResult(index, count, type) {
		if (this._type != type) return
		var e = GlobalConfig.jifengTiaoyueLg.st100076;
		var i = 0
		let s = this._cfg
		for (var n in s) {
			if (s[n].index == index) {
				s[n].exchangeCount = count
				i = s[n].feats
				break
			}
		}
		e += i + this._itemName
		UserTips.ins().showTips(e)
		this.setListData(s)
	}
	setListData(t) {
		var e = this.scroller.viewport.scrollH
		this.listDatas.removeAll()
		for (var i in t) this.listDatas.addItem(t[i])
		this.labelCoin.text = this._getValueByName(this._type)
		this.scroller.viewport.scrollH = e
	}
	onGetCoin(t) {
		(<ShopGoodsWarn>ViewManager.ins().open(ShopGoodsWarn)).setData(this._getItemId(this._type), 1)
	}

	UpdateContent(): void {

	}
	private _setCfgByName(shopType: ShopType): void {
		switch (shopType) {
			case ShopType.FEAT:
				this._cfg = GlobalConfig.ins("FeatsStore")
				this._itemName = GlobalConfig.jifengTiaoyueLg.st100077;
				break;
			case ShopType.PET:
				this._cfg = GlobalConfig.ins("PetStore")
				//this._itemName = "宠物碎片"
				this._itemName = MoneyManger.MoneyConstToName(MoneyConst.PETCREDIT)
				break;
			case ShopType.RIDE:
				this._cfg = GlobalConfig.ins("MountStore")
				//this._itemName = "坐骑碎片"
				this._itemName =MoneyManger.MoneyConstToName(MoneyConst.RIDECREDIT)
				break;
			case ShopType.CROSS:
				this._cfg = GlobalConfig.ins("KufuStore")
				//this._itemName = "跨服积分"
				this._itemName = MoneyManger.MoneyConstToName(MoneyConst.CROSSCREDIT)
				break;
			case ShopType.GUILD:
				this._cfg = GlobalConfig.ins("GuildaStore")
				this._itemName = MoneyManger.MoneyConstToName(MoneyConst.GuildContrib)
				break;
			case ShopType.ARTI:
				this._cfg = GlobalConfig.ins("ArtifactStore")
				this._itemName =  MoneyManger.MoneyConstToName(MoneyConst.ARTIFACTCREDIT)
				break;
		}
		this.label0.text = GlobalConfig.jifengTiaoyueLg.st100083 + this._itemName;
		this.label1.text = GlobalConfig.jifengTiaoyueLg.st100084 + this._itemName;
		UIHelper.SetLinkStyleLabel(this.label0);
	}
	/**
	 * 获取拥有的货币数量
	 */
	private _getValueByName(shopType: ShopType): number {
		switch (shopType) {
			case ShopType.FEAT:
				return GameLogic.ins().actorModel.feats
			case ShopType.PET:
				return GameLogic.ins().actorModel.petCredit
			case ShopType.RIDE:
				return GameLogic.ins().actorModel.rideCredit
			case ShopType.CROSS:
				return GameLogic.ins().actorModel.crossCredit
			case ShopType.GUILD:
				return Guild.ins().myCon;
			case ShopType.ARTI:
				return GameLogic.ins().actorModel.artifactCredit
		}
	}
	private _getItemId(shopType: ShopType): number {
		switch (shopType) {
			case ShopType.FEAT:
				return MoneyConst.FEATS;
			case ShopType.PET:
				return MoneyConst.PETCREDIT
			case ShopType.RIDE:
				return MoneyConst.RIDECREDIT
			case ShopType.CROSS:
				return MoneyConst.CROSSCREDIT
			case ShopType.GUILD:
				return MoneyConst.GuildContrib
			case ShopType.ARTI:
				return MoneyConst.ARTIFACTCREDIT
			default:
				return null
		}
	}
	private getShopType(shopType: ShopType): string {
		let str: string = "";
		switch (shopType) {
			case ShopType.FEAT:
				str = GlobalConfig.jifengTiaoyueLg.st100073
				break;
			case ShopType.PET:
				str = GlobalConfig.jifengTiaoyueLg.st100078;
				break;
			case ShopType.RIDE:
				str = GlobalConfig.jifengTiaoyueLg.st100079
				break;
			case ShopType.CROSS:
				str = GlobalConfig.jifengTiaoyueLg.st100080
				break;
			case ShopType.GUILD:
				str = GlobalConfig.jifengTiaoyueLg.st100081
				break;
			case ShopType.ARTI:
				str = GlobalConfig.jifengTiaoyueLg.st100082
				break;
		}
		return str;
	}
}
window["MedalShopPanel"] = MedalShopPanel