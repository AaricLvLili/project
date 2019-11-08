class BagAddItemWarn extends BaseEuiPanel {
	public constructor() {
		super()
	}

	private price: PriceIcon

	private decBtn: eui.Button
	private addBtn: eui.Button
	private sureBtn: eui.Button
	private cancelBtn: eui.Button
	// private closeBtn: eui.Button

	private count: eui.Label
	private dialogCloseBtn:eui.Button;
	private bagBaseConfig:any;

	initUI() {
		super.initUI()
		this.skinName = "OpenCellSkin"
		this.price.setType(MoneyConst.yuanbao)
	}

	open() {
		this.addTouchEvent(this, this.onTap, this.decBtn);
		this.addTouchEvent(this, this.onTap, this.addBtn);
		this.addTouchEvent(this, this.onTap, this.sureBtn);
		this.addTouchEvent(this, this.onTap, this.cancelBtn);
		// this.addTouchEvent(this, this.onTap, this.closeBtn);
		 this.dialogCloseBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this._OnClick, this);
		this.setCount(5)
	}

	close() {
		 this.dialogCloseBtn.removeEventListener(egret.TouchEvent.TOUCH_TAP, this._OnClick, this);
		this.removeEvents()
	}

	private _OnClick(e: egret.TouchEvent) {
		ViewManager.ins().close(this);
	}

	onTap = function (e) {
		switch (e.currentTarget) {
			case this.decBtn:
				this.setCount(Number(this.count.text) - 5);
				break;
			case this.addBtn:
				this.setCount(Number(this.count.text) + 5);
				break;
			case this.sureBtn:
				if (GameLogic.ins().actorModel.yb < this.price.price) {
					UserTips.ins().showTips(GlobalConfig.jifengTiaoyueLg.st100014);
					break
				}
				UserBag.ins().sendAddBagGrid(Number(this.count.text) / 5)
			case this.cancelBtn:
			// case this.closeBtn:
				ViewManager.ins().close(BagAddItemWarn)
		}
	}
	setCount(addNum: number) {
		if(this.bagBaseConfig == null)
			this.bagBaseConfig = GlobalConfig.ins("BagBaseConfig");
		var bagBaseConfig = this.bagBaseConfig;
		var bagExpandConfig = GlobalConfig.ins("BagExpandConfig")
		var configLength = CommonUtils.getObjectLength(bagExpandConfig)
		var size = (UserBag.ins().bagNum - bagBaseConfig.baseSize) / bagBaseConfig.rowSize
		var n = (configLength - size) * bagBaseConfig.rowSize
		if (5 > addNum) {
			(addNum = 5, UserTips.ins().showTips(GlobalConfig.jifengTiaoyueLg.st101685))
		} else if (addNum > n) {
			addNum = n
			UserTips.ins().showTips(GlobalConfig.jifengTiaoyueLg.st101686)
		}
		this.count.text = "" + addNum;
		for (var s = 0, a = addNum / bagBaseConfig.rowSize, l = 1; a >= l; l++)
			s += bagExpandConfig[size + l].cost;
		this.price.setPrice(s)
	}
}

ViewManager.ins().reg(BagAddItemWarn, LayerManager.UI_Popup)
window["BagAddItemWarn"]=BagAddItemWarn