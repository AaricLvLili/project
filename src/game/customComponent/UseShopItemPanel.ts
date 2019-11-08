class UseShopItemPanel extends BaseEuiView {

    public static LAYER_LEVEL = LayerManager.UI_Popup

	private commonDialog: CommonDialog
	private showGroup: eui.Group

	private m_Items: UseShopItem[] = []

	public static Show(title: string,  useShopItemData: IUseShopItemAdapter[], messageDef: string[]) {
		ViewManager.ins().open(UseShopItemPanel, title, useShopItemData, messageDef)
	}

	public constructor() {
		super()
		this.skinName = "UseShopItemPanelSkin"
		for (let item of this["cacheGroup"].$children) {
			this.m_Items.push(new UseShopItem(item))
		}
		// for (let i = 0; i < this.cacheg)
		// this.m_Items = this["cacheGroup"].$children as any
	}

	public open(...param: any[]) {
		let title = param[0]
		let itemDatas = param[1] as IUseShopItemAdapter[]
		let messageDef = param[2]
		if (messageDef) {
			for (let def of messageDef) {
				GameGlobal.MessageCenter.addListener(def, this.UpdateContent, this)
			}
		}

		this.commonDialog.title = title
		this.commonDialog.OnAdded(this)

		this.showGroup.removeChildren()
		for (let i = 0; i < itemDatas.length; ++i) {
			let item = this.m_Items[i]
			item.Init(itemDatas[i])
			item.Update()
			this.showGroup.addChild(item.mItem as any)
		}
		for (let i = itemDatas.length; i < this.m_Items.length; ++i) {
			this.m_Items[i].visible = false
		}
		egret.callLater(this._LateUpdate, this)
	}

	public close() {
        for (let item of this.m_Items) {
			item.close()
		}
		GameGlobal.MessageCenter.removeAll(this)
		this.commonDialog.OnRemoved()
	}

	private _LateUpdate() {
		this.commonDialog.height = this.showGroup.height + 60
	}

	public UpdateContent() {
		for (let i = 0; i < this.m_Items.length; ++i) {
			let item = this.m_Items[i]
			if (item && item.visible) {
				item.Update()
			}
		}
	}
}

interface IUseShopItemAdapter {
	GetItemId(): number
	GetSurplusCount?(): number
	GetToDayStr?(): string
	GetDes(): string
	DoUse(): void
}

class UseShopItem {

	public mItem: {
		infoTxt: eui.Label,
		infoCount: eui.Label,
		toDay: eui.Label,
		btn: eui.Button,
		item: ItemBase,
		priceIcon: PriceIcon,
		redPoint: eui.Image
	}

	private m_Adapter: IUseShopItemAdapter
	private itemConfig:any;
	public constructor(comp) {
		this.mItem = comp
		this.mItem.item.isShowName(false)
	}

	public get visible(): boolean {
		return	(this.mItem as any).visible
	}

	public set visible(value) {
		(this.mItem as any).visible = value
	}

	public Init(adapter: IUseShopItemAdapter) {
		this.m_Adapter = adapter
		this.visible = true

		this.mItem.btn.addEventListener(egret.TouchEvent.TOUCH_TAP, this._OnClick, this)
	}

	public close() {
		this.mItem.btn.addEventListener(egret.TouchEvent.TOUCH_TAP, this._OnClick, this)
		this.m_Adapter = null
		this.mItem = null
	}

	private _OnClick(): void {
		if (this.m_Adapter) {
			let itemId = this.m_Adapter.GetItemId();
			if(this.itemConfig == null) 
				this.itemConfig = GlobalConfig.itemConfig; 
			let itemConfig = this.itemConfig[itemId];
			let count = UserBag.ins().getBagGoodsCountById(UserBag.BAG_TYPE_OTHTER, itemId)
			if (count > 0) {
				this.m_Adapter.DoUse()
			} else {
				let shopConfig = ItemStoreConfig.getStoreByItemID(itemId)
				if (shopConfig && Checker.Money(MoneyConst.yuanbao, ItemStoreConfig.getStoreByItemID(itemId).price)) {
					this.m_Adapter.DoUse()
				}
			}
		}
	}

	public Update() {
		let itemId = this.m_Adapter.GetItemId()
		let toDayStr = this.m_Adapter.GetToDayStr ? this.m_Adapter.GetToDayStr() : null
		let surplus = this.m_Adapter.GetSurplusCount ? this.m_Adapter.GetSurplusCount : null
		let infoStr = this.m_Adapter.GetDes();
		if(this.itemConfig == null) 
			this.itemConfig = GlobalConfig.itemConfig; 

		let itemConfig2 = this.itemConfig[itemId];
		let count = UserBag.ins().getBagGoodsCountById(UserBag.BAG_TYPE_OTHTER, itemId)
		this.mItem.item.data = itemId
		if (toDayStr && surplus) {
			this.mItem.toDay.visible = true
			this.mItem.toDay.textFlow = (new egret.HtmlTextParser()).parser(StringUtils.Format(toDayStr, surplus));
		} else {
			this.mItem.toDay.visible = false
		}
		this.mItem.priceIcon.visible = count == 0
		// this.mItem.infoCount.visible = count != 0
		this.mItem.redPoint.visible = count != 0
		if (count > 0) {
			this.mItem.infoCount.text = itemConfig2.name + LanguageString.jifengTiaoyueCh(GlobalConfig.jifengTiaoyueLg.st101828,[count])
			this.mItem.btn.label = GlobalConfig.jifengTiaoyueLg.st100272//"使用"
		} else {
			this.mItem.infoCount.text = `${itemConfig2.name}`
			let shopConfig = ItemStoreConfig.getStoreByItemID(itemId)
			if (shopConfig) {
				this.mItem.priceIcon.type = MoneyConst.yuanbao
				this.mItem.priceIcon.price = ItemStoreConfig.getStoreByItemID(itemId).price
				this.mItem.priceIcon.name = itemConfig2.name
				this.mItem.btn.label = GlobalConfig.jifengTiaoyueLg.st100718;//"购买并使用"
			} else {
				this.mItem.priceIcon.visible = false
				this.mItem.btn.visible = false
			}
		}
		if (infoStr) {
			this.mItem.infoTxt.textFlow = (new egret.HtmlTextParser).parse(infoStr)
		} else {
			this.mItem.infoTxt.text = itemConfig2.desc
		}
	}
}
window["UseShopItemPanel"]=UseShopItemPanel
window["UseShopItem"]=UseShopItem