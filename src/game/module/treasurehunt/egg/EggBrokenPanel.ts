class EggBrokenPanel extends eui.Component {
	public constructor() {
		super()

		this.skinName = "EggBrokenSkin"

		this.menuScroller.scrollPolicyV = eui.ScrollPolicy.OFF

		this.listEgg.itemRenderer = EggBrokenPanelItem;
		this.list.itemRenderer = HuntListRenderer;
		this.m_Lan1.text = GlobalConfig.jifengTiaoyueLg.st101309;
		this.m_Lan2.text = GlobalConfig.jifengTiaoyueLg.st101310;
		this.warehouse.label = GlobalConfig.jifengTiaoyueLg.st101311;
		this.buy0.label = GlobalConfig.jifengTiaoyueLg.st101312;
		this.buy1.label = GlobalConfig.jifengTiaoyueLg.st101313;
	}

	list
	buy0
	buy1
	priceIcon1
	priceIcon2
	lefttime: eui.Label

	menuScroller
	listEgg: eui.List
	warehouse: eui.Button

	// new eui.ArrayCollection(eggDatas)
	private m_ArrayDatas = new eui.ArrayCollection
	public m_Lan1: eui.Label;
	public m_Lan2: eui.Label;

	open(e) {
		this.updateView()
		this.buy0.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onBuy, this);
		this.buy1.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onBuy, this);
		this.warehouse.addEventListener(egret.TouchEvent.TOUCH_TAP, this._OnClick, this);
		MessageCenter.addListener(EggBroken.postBestListInfo, this.listRefush, this);
		GameGlobal.MessageCenter.addListener(MessageDef.EggBroken_ADDRECORD, this.listAddData, this);
		GameGlobal.MessageCenter.addListener(MessageDef.EGG_BROKEN_RESULT, this._UpdateList, this);
		GameGlobal.MessageCenter.addListener(MessageDef.ITEM_COUNT_CHANGE, this._UpdateRedPoint, this)
		EggBroken.ins().sendHuntList();

		var config = GlobalConfig.ins("SEDayConfig")[GameServer.serverOpenDay];
		this.priceIcon1.price = GlobalConfig.ins("SmashEggsConfig").huntOnce
		this.priceIcon2.price = GlobalConfig.ins("SmashEggsConfig").huntTenth
		if (config) {
			config = config.rewardShow;
			for (var i = 0; i < 3; i++) {
				this['item' + i].data = config[i];
				(this['item' + i] as ItemBase).showItemEffect()
			}
		}
		this.listRefush([]);
		this.listEgg.dataProvider = this.m_ArrayDatas
		this._UpdateList()
		this.lefttime.text = this.updateTimer(EggBroken.ins().endTime)
	}

	private _OnClick() {
		ViewManager.ins().open(TreasureStorePanel);
	}

	private _UpdateList() {
		var eggDatas = []
		var rewardConfig = GlobalConfig.ins("SEtotalrewardsConfig")
		for (let index in rewardConfig) {
			eggDatas.push([rewardConfig[index].index, rewardConfig[index].time])
		}
		eggDatas.sort(function (lhs, rhs) {
			return lhs[0] - rhs[0]
		})
		this.m_ArrayDatas.replaceAll(eggDatas)

		this._UpdateRedPoint()
	}

	private _UpdateRedPoint() {
		UIHelper.ShowRedPoint(this.warehouse, TreasureHuntWin.IsRedPointByWarehouse())
	}

	close() {
		this.buy0.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onBuy, this);
		this.buy1.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onBuy, this);
		this.warehouse.removeEventListener(egret.TouchEvent.TOUCH_TAP, this._OnClick, this);
		MessageCenter.ins().removeAll(this);
	}

	listRefush(datas) {
		this.list.dataProvider = new eui.ArrayCollection(datas);
	}
	listAddData(data) {
		this.list.dataProvider.addItemAt(data, 0)
	}
	onBuy(e) {
		switch (e.target) {
			case this.buy0:
				{
					this.buyHunt(0);
					break;
				}
			case this.buy1:
				{
					this.buyHunt(1);
					break;
				}
			default:
				break;
		}
	}
	buyHunt(type) {
		var huntOnce = type == 0 && GlobalConfig.ins("SmashEggsConfig").huntOnce || GlobalConfig.ins("SmashEggsConfig").huntTenth;
		if (Checker.Money(MoneyConst.yuanbao, huntOnce, Checker.YUNBAO_FRAME)) {
			EggBroken.ins().sendHunt(type);
		}
	}
	hitting(id) {
		EggBroken.ins().sendHitting(id);
	}
	updateData() {

	}
	updateView() {

	}
	updateTimer(e) {
		var t = "",
			i = e - GameServer.serverTime;
		return t = LanguageString.jifengTiaoyueCh(GlobalConfig.jifengTiaoyueLg.st100628, [(i / 24 / 3600 >> 0), (i / 3600 % 24 >> 0), (i / 60 % 60 >> 0)])
	}
}

class EggBrokenPanelItem extends eui.ItemRenderer {
	public constructor() {
		super()
		this.skinName = "OnlyOneEggSkin"
		this.btOpen.addEventListener(egret.TouchEvent.TOUCH_TAP, this.OnClick, this)
	}
	hasopen: eui.Label
	btOpen: eui.Button
	showCount: eui.Label
	index: number = 0
	needcount: number = 0

	private OnClick(e: egret.TouchEvent) {
		switch (e.currentTarget) {
			case this.btOpen:
				// if (EggBroken.ins().count >= this.needcount)
				// 	EggBroken.ins().sendHitting(this.index);
				if (!this.IsHas()) {
					ViewManager.ins().open(EggBrokenPreview2Panel, this.index)
				}
				break;
		}
	}
	dataChanged() {
		this.index = this.data[0]
		this.needcount = this.data[1]
		this.hasopen.visible = this.IsHas()
		// this.showCount.curValue = Math.min(EggBroken.ins().count, this.needcount)
		// this.showCount.consumeValue = this.needcount
		this.showCount.textFlow = ConsumeLabel.GetValueColor(Math.min(EggBroken.ins().count, this.needcount), this.needcount)
	}

	private IsHas(): boolean {
		return ((1 << this.index) & EggBroken.ins().awards) != 0
	}
}
window["EggBrokenPanel"] = EggBrokenPanel
window["EggBrokenPanelItem"] = EggBrokenPanelItem