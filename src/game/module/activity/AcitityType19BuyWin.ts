class AcitityType19BuyWin extends BaseEuiPanel {

	static LAYER_LEVEL = LayerManager.UI_Main

	public constructor() {
		super()
	}

	num = 0
	numLimit = 0
	numCur = 0


	activityId
	input
	btnClose
	btnAdd
	btnBuy
	btnSub
	price
	labelPrice
	labelSumPrice


	// initUI() {
	// 	e.prototype.initUI.call(this)
	// }

	open() {
		for (var e = [], t = 0; t < arguments.length; t++) e[t] = arguments[t];
		if (e[0]) {
			this.activityId = e[0], this.numLimit = e[1], this.numCur = e[2];
			var i = GlobalConfig.ins("ActivityConfig")[this.activityId];
			this.skinName = i.source2, this.input && this.input.addEventListener(egret.Event.CHANGE, this.onInputChange, this), this.btnAdd && this.btnAdd.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTap, this), this.btnSub && this.btnSub.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTap, this), this.btnClose && this.btnClose.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTap, this), this.btnBuy && this.btnBuy.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTap, this), this.price = GlobalConfig.ins("ActivityType19Config")[this.activityId].currencyNum, this.onNumChange(1)
		}
	}

	close() {
		this.input && this.input.removeEventListener(egret.Event.CHANGE, this.onInputChange, this), this.btnAdd && this.btnAdd.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onTap, this), this.btnSub && this.btnSub.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onTap, this), this.btnClose && this.btnClose.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onTap, this), this.btnBuy && this.btnBuy.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onTap, this)
	}

	onInputChange(e) {
		this.input.text && "" != this.input.text || this.onNumChange(0);
		var t = parseInt(this.input.text);
		!isNaN(t) && t && this.onNumChange(t) || e.preventDefault()
	}

	onTap(e) {
		switch (e.target) {
			case this.btnAdd:
				this.onNumChange(this.num + 1);
				break;
			case this.btnSub:
				this.onNumChange(this.num - 1);
				break;
			case this.btnBuy:
				// if (this.num <= 0) return;
				// if (this.numCur + this.num > this.numLimit) return void UserTips.ins().showTips("超过购买上限");
				// GameGlobal.actorModel.yb >= (this.num * this.price) ? (ActivityModel.ins().sendBuy(this.activityId, this.num) ,ViewManager.ins().close(AcitityType19BuyWin)) : UserTips.ins().showTips("钻石不足");
				break;
			case this.btnClose:
				ViewManager.ins().close(this)
		}
	}

	onNumChange(e) {
		return 0 > e ? !1 : (this.num = e, this.num > 9999 && (this.num = 9999), this.input.text = "" + this.num, this.labelPrice.text = "" + this.price, this.labelSumPrice.text = "" + this.price * this.num, !0)
	}
}
window["AcitityType19BuyWin"]=AcitityType19BuyWin