class EggBrokenResultWin extends BaseEuiPanel {

	private static readonly c_launchX = 180;
	private static readonly c_launchY = 500;
	private static readonly c_firstX = 50;
	private static readonly c_firstY = 180;
	private static readonly c_distantX = 77;
	private static readonly c_distantY = 90;
	private static readonly c_depotX = 320;
	private static readonly c_depotY = 620;
	private static readonly waitTime = 50;

	arr = [];
	items = [];
	// canClicck
	closeBtn
	// closeBtn0
	buyBtn
	huntType
	// tip
	num

	private dialogCloseBtn: eui.Button;
	activityId: number = 0;
	// private priceIcon03: PriceIcon
	public m_Group: eui.Group;
	public titleLabel: eui.Label;
	public tip: eui.Label;

	public constructor() {
		super()
	}

	initUI() {
		super.initUI()
		this.skinName = "EggBrokenResultSkin";
		// this.closeBtn['nameImage'].source = 'xb_27';
		// this.canClicck = true;

		// this.priceIcon03.iconImg.source = ResDataPath.GetItemFullName("200015")
		// this.commonDialog.notClickMask = true
		// this.commonDialog.mCallback = () => {
		// 	this.closeCB(null)
		// }
		this.titleLabel.text = GlobalConfig.jifengTiaoyueLg.st101314;
		this.closeBtn.label = GlobalConfig.jifengTiaoyueLg.st101176;

	};
	open(...param: any[]) {
		this.closeBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.closeCB, this);
		this.buyBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.buy, this);
		this.observe(MessageDef.HUNT_RESULT, this.updateView)
		this.updateView([param[0], param[1], param[2]]);
		this.dialogCloseBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this._OnClick, this);
	};
	close() {
		this.closeBtn.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.closeCB, this);
		// this.closeBtn0.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.closeCB, this);
		this.buyBtn.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.buy, this);
		MessageCenter.ins().removeAll(this);
		this.dialogCloseBtn.removeEventListener(egret.TouchEvent.TOUCH_TAP, this._OnClick, this)
	};
	private _OnClick(e: egret.TouchEvent) {
		ViewManager.ins().close(this);
	}
	updateView(param) {
		this.huntType = param[0];
		this.arr = param[1];
		this.activityId = param[2];
		var config = ActivityModel.GetActivityConfig(this.activityId)//天降豪礼的砸蛋
		if (this.huntType == 0) {
			// this.tip.source = 'ui_xb_1c_cq';
			// this.buyBtn.label = "购买1个"
			this.num.text = (config && config.activityType == 12) ? GlobalConfig.ins("SmashEggsAConfig").huntOnce + "" : GlobalConfig.ins("SmashEggsConfig").huntOnce + "";
			this.currentState = "one"
			egret.setTimeout(function () {
				this.tip.text = LanguageString.jifengTiaoyueCh(GlobalConfig.jifengTiaoyueLg.st101315, [1]);
				this.buyBtn.label = LanguageString.jifengTiaoyueCh(GlobalConfig.jifengTiaoyueLg.st101316, [1]);
			}, this, 100)
		} else if (this.huntType == 1) {
			// this.tip.source = 'ui_xb_10c_cq';
			// this.buyBtn.label = "购买10个"
			this.num.text = (config && config.activityType == 12) ? GlobalConfig.ins("SmashEggsAConfig").huntTenth + "" : GlobalConfig.ins("SmashEggsConfig").huntTenth + "";
			this.currentState = "ten"
			egret.setTimeout(function () {
				this.tip.text = LanguageString.jifengTiaoyueCh(GlobalConfig.jifengTiaoyueLg.st101315, [10]);
				this.buyBtn.label = LanguageString.jifengTiaoyueCh(GlobalConfig.jifengTiaoyueLg.st101316, [10]);
			}, this, 100)

		} else {
			this.num.text = "";
			this.currentState = "type_2"
		}
		this.playResult();
	};
	playResult() {
		this.canBuy = true
		this.m_Group.removeChildren();
		for (var i = 0; i < this.arr.length; i++) {
			this.items[i] = EggBrokenResultWin.createItem(this.m_Group, this.arr[i]);
			var t = egret.Tween.get(this.items[i]);
			this.items[i].x = (i % 5) * EggBrokenResultWin.c_distantX + EggBrokenResultWin.c_firstX;
			this.items[i].y = Math.floor(i / 5) * EggBrokenResultWin.c_distantY + EggBrokenResultWin.c_firstY;
			this.items[i].alpha = 0;
			this.items[i].showEquipEffect();
			t.wait(i * EggBrokenResultWin.waitTime).to({ alpha: 1 }, 200).call((obj) => {
				egret.Tween.removeTweens(obj);
			}, this, [this.items[i]]);
		}
	};

	static PlayItem(i, item) {
		var t = egret.Tween.get(item);
		item.x = (i % 5) * EggBrokenResultWin.c_distantX + EggBrokenResultWin.c_firstX;
		item.y = Math.floor(i / 5) * EggBrokenResultWin.c_distantY + EggBrokenResultWin.c_firstY;
		item.alpha = 0;
		item.showEquipEffect();
		t.wait(i * EggBrokenResultWin.waitTime).to({ alpha: 1 }, 200).call(() => {
			egret.Tween.removeTweens(item);
		});
	}

	static playGet(items: any[], fun = undefined) {
		if (items.length == 0) {
			if (fun) {
				fun()
			}
			return
		}
		let list = items.slice(0, items.length)
		items.length = 0
		for (let i = 0, len = list.length; i < len; i++) {
			let item = list[i]
			item.alpha = 1
			egret.Tween.removeTweens(item)
			var t = egret.Tween.get(item);
			t.to({ "y": EggBrokenResultWin.c_depotY, "x": EggBrokenResultWin.c_depotX, "scaleX": 0, "scaleY": 0 }, 300 - Math.floor(i / 5) * 50).call(() => {
				egret.Tween.removeTweens(item);
				if (i == len - 1) {
					if (fun != undefined) {
						fun();
					}
					// this.releaseAllItem();
					for (let item of list) {
						item.destruct();
						DisplayUtils.removeFromParent(item)
					}
				}
			});
		}
	};
	static createItem(view, data, cls = null) {
		var item = new (cls || ItemBase)();
		view.addChild(item);
		item.num = data[1];
		item.data = data[0];
		item.x = EggBrokenResultWin.c_launchX;
		item.y = EggBrokenResultWin.c_launchY;
		return item;
	};
	// releaseAllItem() {
	// 	for (var k in this.items) {
	// 		this.items[k].destruct();
	// 		this.removeChild(this.items[k]);
	// 	}
	// 	this.items = [];
	// };

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
			EggBroken.ins().sendHunt(this.huntType, this.activityId);
		}

		// if (GameLogic.ins().actorModel.yb >= Number(this.num.text)) {
		// 	if (this.items.length > 0) {
		// 		this.playGet()
		// 	}
		// var func = () => {
		// Hunt.ins().sendHunt(this.huntType);
		// };
		// this.playGet(func);
		// this.canClicck = false;
		// }
		// else {
		// UserTips.ins().showTips("|C:0xf87372&T:钻石不足|");
		// }
	};
}

ViewManager.ins().reg(EggBrokenResultWin, LayerManager.UI_Popup);

window["EggBrokenResultWin"] = EggBrokenResultWin