class ActivityType2003ResultPanel extends BaseEuiPanel {

	public static LAYER_LEVEL = LayerManager.UI_Popup

	arr = [];
	items = [];
	closeBtn: eui.Button
	buyBtn: eui.Button
	huntType: number
	num: eui.Label
	//private dialogCloseBtn:eui.Button;
	// private commonDialog: CommonDialog

	public constructor() {
		super()
	}

	initUI() {
		super.initUI()
		this.skinName = "ActivityType2003ResultSkin";
		//this.dialogCloseBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this._OnClick, this);
		// this.commonDialog.notClickMask = true
		// this.commonDialog.mCallback = () => {
		// 	this.closeCB(null)
		// }

	};
	open(...param: any[]) {
		this.m_bg.init(`ActivityType2003ResultPanel`, `提示`)
		this.closeBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.closeCB, this);
		this.buyBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.buy, this);
		this.observe(MessageDef.HUNT_RESULT, this.updateView)
		this.updateView([param[0], param[1]]);
		// this.commonDialog.OnAdded(this) 
	};
	close() {
		this.closeBtn.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.closeCB, this);
		this.buyBtn.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.buy, this);
		MessageCenter.ins().removeAll(this);
		// this.commonDialog.OnRemoved()
		//this.dialogCloseBtn.removeEventListener(egret.TouchEvent.TOUCH_TAP, this._OnClick, this)
	};
	private _OnClick(e: egret.TouchEvent) {
		ViewManager.ins().close(this);
	}

	updateView(param) {
		this.huntType = param[0];
		this.arr = param[1];
		if (this.huntType == 0) {
			this.num.text = GlobalConfig.ins("ActivityType2003Config")[2003].huntOnce + "";
			this.currentState = "one"
		} else if (this.huntType == 1) {
			this.num.text = GlobalConfig.ins("ActivityType2003Config")[2003].huntTenth + "";
			this.currentState = "ten"
		} else {
			this.num.text = "";
			this.currentState = "type_2"
		}
		this.playResult();
	};
	playResult() {
		this.canBuy = true
		for (var i = 0; i < this.arr.length; i++) {
			let item = EggBrokenResultWin.createItem(this, this.arr[i], ItemBaseEffe);
			this.items[i] = item
			EggBrokenResultWin.PlayItem(i, item)
		}
	};


	canClicck = true
	canBuy = true

	closeCB(e) {
		if (!this.canClicck) {
			return;
		}
		this.canClicck = false;
		var func = () => {
			ViewManager.ins().close(this);
		};
		EggBrokenResultWin.playGet(this.items, func);
	};
	buy(e) {
		if (!this.canClicck) {
			return
		}
		if (!this.canBuy) {
			return
		}
		if (this.huntType > 1) {
			this.closeCB(null)
			return
		}
		if (Checker.Money(MoneyConst.yuanbao, Number(this.num.text), Checker.YUNBAO_FRAME)) {
			this.canBuy = false
			EggBrokenResultWin.playGet(this.items);

			var id: number = 2003;
			if (ActivityWinSummer.onPlace == ActivityModel.BTN_TYPE_03)
				id = 2008;
			else if (ActivityWinSummer.onPlace == ActivityModel.BTN_TYPE_04)
				id = 2011;
			ActivityModel.ins().sendReward(id, this.huntType)
		}
	};
}

window["ActivityType2003ResultPanel"]=ActivityType2003ResultPanel