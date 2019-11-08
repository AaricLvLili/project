class MoneyTreeBoxWin extends BaseEuiPanel {

	static LAYER_LEVEL = LayerManager.UI_Popup

	dataList = []
	list
	sure: eui.Button
	desc
	index

	//private dialogCloseBtn:eui.Button;

	public constructor() {
		super()
	}

	initUI() {
		super.initUI()
		this.skinName = "MoneyTreeBoxSkin"
		this.list.itemRenderer = ItemBase
		
	}

	open() {
		this.m_bg.init(`MoneyTreeBoxWin`,GlobalConfig.jifengTiaoyueLg.st101386)
		//this.dialogCloseBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this._OnClick, this);
		for (var e = [], t = 0; t < arguments.length; t++) e[t] = arguments[t];
		this.sure.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTap, this)
		// this.closeBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTap, this)
		// this.closeBtn1.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTap, this)
		this.index = e[0];
		var i = MoneyTreeModel.ins().getBoxInfoByIndex(this.index);
		this.desc.text = LanguageString.jifengTiaoyueCh(GlobalConfig.jifengTiaoyueLg.st101749,i.time), this.creatRewardList(i.box), this.list.dataProvider = new eui.ArrayCollection(this.dataList)
		// this.sure.enabled = MoneyTreeModel.ins().playNum >= i.time
		this.sure.label = GlobalConfig.jifengTiaoyueLg.st101210
		this.sure.enabled = false
		if (MoneyTreeModel.ins().playNum >= i.time) {
			if (MoneyTreeModel.ins().getOrderByIndex(this.index - 1) == 0) {
				this.sure.enabled = true
			} else {
				this.sure.label = GlobalConfig.jifengTiaoyueLg.st100981
			}
		}
	}

	close() {
		//this.dialogCloseBtn.removeEventListener(egret.TouchEvent.TOUCH_TAP, this._OnClick, this)
		for (var e = [], t = 0; t < arguments.length; t++) e[t] = arguments[t];
		this.sure.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onTap, this)
		// this.closeBtn.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onTap, this)
		//  this.closeBtn1.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onTap, this)
	}

	private _OnClick(e: egret.TouchEvent) {
		ViewManager.ins().close(this);
	}

	creatRewardList(e) {
		for (var t, i = 0; 3 > i; i++) this.dataList[i] ? t = this.dataList[i] : (t = new RewardData, t.type = 0, t.id = 1, this.dataList.push(t)), t.count = e[i]
	}

	onTap(e) {
		switch (e.currentTarget) {
			// case this.closeBtn:
			// case this.closeBtn1:
			// 	ViewManager.ins().close(MoneyTreeBoxWin);
			// 	break;
			case this.sure:
				MoneyTreeModel.ins().sendGetCaseReward(this.index)
				ViewManager.ins().close(MoneyTreeBoxWin);
		}
	}
}
window["MoneyTreeBoxWin"]=MoneyTreeBoxWin