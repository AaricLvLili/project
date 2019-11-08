class Recharge3Win extends eui.Component {
	public constructor() {
		super()

		// this._oneDay = 86400
		this.activityID = 20
		this.initUI()
	}
	// _oneDay
	activityID
	listTop: eui.List
	_data: RechargeData
	desc
	recharge

	initUI() {
		this.skinName = "TotalChargeActSkin", this.name = GlobalConfig.jifengTiaoyueLg.st101298, this.listTop.itemRenderer = TotalChargeActItem
		this.recharge.label=GlobalConfig.jifengTiaoyueLg.st100227;
	}

	open() {
		for (var e = [], t = 0; t < arguments.length; t++) e[t] = arguments[t];
		this.setWinData(), GameGlobal.MessageCenter.addListener(MessageDef.UPDATE_RECHARGE, this.setWinData, this)
		this.recharge.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTabTouch, this)
	}

	close() {
		for (var e = [], t = 0; t < arguments.length; t++) e[t] = arguments[t];
		GameGlobal.MessageCenter.removeListener(MessageDef.UPDATE_RECHARGE, this.setWinData, this)
		this.recharge.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onTabTouch, this)
	}

	onTabTouch(e) {
		switch (e.currentTarget) {
			case this.recharge:
				ViewManager.ins().open(ChargeFirstWin)
		}
	}

	setWinData() {
		this._data = GameGlobal.rechargeData[1]
		this.desc.text = LanguageString.jifengTiaoyueCh(GlobalConfig.jifengTiaoyueLg.st101299, [this._data.num]);

		var config = Recharge.ins().GetConfig2()// GlobalConfig.ins("ChongZhi2Config")[this._data.day / 7 >= 1 ? 2 : 1][this._data.day % 7];
		var list = [];
		for (var n in config) list.push(config[n]), config[n].statu = BitUtil.Has(this._data.isAwards, config[n].index) ? 1 : 0
		list = list.sort(this.sort), this.listTop.dataProvider = new eui.ArrayCollection(list);
	}

	sort(e, t) {
		var i = e.pay,
			n = t.pay;
		return 0 == e.statu && 1 == t.statu ? -1 : 1 == e.statu && 0 == t.statu ? 1 : i > n ? 1 : n > i ? -1 : 0
	}
	updateData(){
		
	}
}
window["Recharge3Win"] = Recharge3Win