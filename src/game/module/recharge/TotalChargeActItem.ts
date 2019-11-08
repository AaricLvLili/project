class TotalChargeActItem extends RechargeGiftPanelItem {
	public constructor() {
		super()

		this.list.itemRenderer = ItemBase
		this.price.type = MoneyConst.yuanbao
		this.price.visible = true
	}
	protected createChildren() {
		super.createChildren();
		this.labelGo.text = GlobalConfig.jifengTiaoyueLg.st101077;
		this.labelUndo.text = GlobalConfig.jifengTiaoyueLg.st100680;
		this.btnGet.label = GlobalConfig.jifengTiaoyueLg.st101076;
	}
	_index
	getRemindByIndex(e) {
		return 1 == (GameGlobal.rechargeData[1].isAwards >> e & 1)
	}

	protected OnGetAward(e) {
		Recharge.ins().sendGetAwards(1, this._index)
	}

	dataChanged() {
		var e = this.data
		let num = GameGlobal.rechargeData[1].num;
		this.m_Award = e.awardList
		this._index = e.index, this.price.price = e.pay
		this.list.dataProvider = new eui.ArrayCollection(e.awardList)
		this.list.validateNow()
		for (let i = 0; i < this.list.numChildren; ++i) {
			(this.list.getChildAt(i) as ItemBase).showItemEffect()
		}
		var isRemind = this.getRemindByIndex(this._index);

		if (num >= e.pay) {
			if (isRemind) {
				this.currentState = "2"
			} else {
				this.currentState = "1"
			}
		} else {
			this.currentState = "0"
		}

		// num >= e.pay
		// 	? isRemind
		// 		? (this.btnGet.visible = !1, this.labelGet.visible = !0)
		// 		: (this.btnGet.visible = !0, this.labelGet.visible = !1, this.btnGet.addEventListener(egret.TouchEvent.TOUCH_END, this.onClick, this))
		// 	: this.btnGet.visible = this.labelGet.visible = !1
	}
}
window["TotalChargeActItem"] = TotalChargeActItem