class HuntResultWin extends BaseEuiPanel {

	private static readonly c_launchX = 0;//180;
	private static readonly c_launchY = 0//500;
	private static readonly c_firstX = 2;//50;
	private static readonly c_firstY = 0;//120;
	private static readonly c_distantX = 110;  //宽
	private static readonly c_distantY = 116;	//高
	private static readonly c_depotX = 320;
	private static readonly c_depotY = 620;
	private static readonly waitTime = 50;

	arr = [];
	items = [];
	// canClicck
	huntType
	tip: eui.Label
	num

	//private dialogCloseBtn:eui.Button;
	private priceIcon03: PriceIcon
	private scrollerCon: eui.Group;

	canClicck = true
	canBuy = true
	public buyBtn: eui.Button;
	public closeBtn: eui.Button;

	public constructor() {
		super()
	}

	initUI() {
		super.initUI()
		this.skinName = "HuntResult";
		// this.closeBtn['nameImage'].source = 'xb_27';
		// this.canClicck = true;
		this.priceIcon03.iconImg.source = ResDataPath.GetItemFullName("200015")
		// this.commonDialog.notClickMask = true
		// this.commonDialog.mCallback = () => {
		// 	this.closeCB(null)
		// }
		this.closeBtn.label=GlobalConfig.jifengTiaoyueLg.st100040;
	};
	open(...param: any[]) {
		this.canClicck = true;
		this.canBuy = true;
		this.m_bg.init(`HuntResultWin`, GlobalConfig.jifengTiaoyueLg.st100038)
		this.closeBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.closeCB, this);
		// this.closeBtn0.addEventListener(egret.TouchEvent.TOUCH_TAP, this.closeCB, this);
		this.buyBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.buy, this);
		// MessageCenter.addListener(Hunt.postHuntResult , this.updateView, this);
		this.observe(MessageDef.HUNT_RESULT, this.updateView)
		this.observe(UserBag.postItemAdd, this.updatePrice)//zy
		this.updateView([param[0], param[1]]);
		//this.dialogCloseBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this._OnClick, this);
	};
	close() {
		this.closeBtn.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.closeCB, this);
		// this.closeBtn0.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.closeCB, this);
		this.buyBtn.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.buy, this);
		MessageCenter.ins().removeAll(this);
		//this.dialogCloseBtn.removeEventListener(egret.TouchEvent.TOUCH_TAP, this._OnClick, this)
	};
	private _OnClick(e: egret.TouchEvent) {
		ViewManager.ins().close(this);
	}
	// private updateView(huntType, arr): void {
	updateView(param) {
		let costCount;
		this.huntType = param[0];
		this.arr = param[1];
		if (this.huntType == 0) {
			// this.tip.source = 'ui_xb_1c_cq';
			this.tip.text = LanguageString.jifengTiaoyueCh(GlobalConfig.jifengTiaoyueLg.st100039, [1]);
			this.buyBtn.label = LanguageString.jifengTiaoyueCh(GlobalConfig.jifengTiaoyueLg.st100037, [1]);
			this.num.text = GlobalConfig.ins("TreasureHuntConfig").huntOnce + "";
			this.currentState = "one"
			costCount = 1;
		} else {
			// this.tip.source = 'ui_xb_10c_cq';
			this.tip.text = LanguageString.jifengTiaoyueCh(GlobalConfig.jifengTiaoyueLg.st100039, [10]);
			this.buyBtn.label = LanguageString.jifengTiaoyueCh(GlobalConfig.jifengTiaoyueLg.st100037, [10]);
			this.num.text = GlobalConfig.ins("TreasureHuntConfig").huntTenth + "";
			this.currentState = "ten"
			costCount = 10;
		}
		let count = UserBag.ins().getBagGoodsCountById(UserBag.BAG_TYPE_OTHTER, ItemConst.TREASURE_HUNT)
		this.priceIcon03.setText(`(${count}/${costCount})`);
		this.playResult();
	};

	//zy
	private updatePrice(): void {
		let count = UserBag.ins().getBagGoodsCountById(UserBag.BAG_TYPE_OTHTER, ItemConst.TREASURE_HUNT)
		let costCount = (this.huntType == 0) ? 1 : 10;
		this.priceIcon03.setText(`(${count}/${costCount})`);
	}

	playResult() {
		this.canBuy = true
		this.scrollerCon.scrollV = 0;
		this.scrollerCon.removeChildren();
		for (var i = 0; i < this.arr.length; i++) {
			this.items[i] = this.createItem(this.arr[i]);
			var t = egret.Tween.get(this.items[i]);
			this.items[i].x = (i % 5) * HuntResultWin.c_distantX + HuntResultWin.c_firstX;
			this.items[i].y = Math.floor(i / 5) * HuntResultWin.c_distantY + HuntResultWin.c_firstY;
			this.items[i].alpha = 0;
			this.items[i].showEquipEffect();
			t.wait(i * HuntResultWin.waitTime).to({ alpha: 1 }, 200).call((obj) => {
				egret.Tween.removeTweens(obj);
				// count--;
				// if (count == 0) {
				// 	if (fun != undefined) {
				// 		fun();
				// 	}
				// this.canClicck = true;
				// }
			}, this, [this.items[i]]);
		}
	};
	playGet(fun = undefined) {
		if (this.items.length == 0) {
			if (fun) {
				fun()
			}
			return
		}
		let list = this.items.slice(0, this.items.length)
		this.items = []
		for (let i = 0, len = list.length; i < len; i++) {
			let item = list[i]
			item.alpha = 1
			egret.Tween.removeTweens(item)
			var t = egret.Tween.get(item);
			t.to({ "y": HuntResultWin.c_depotY, "x": HuntResultWin.c_depotX, "scaleX": 0, "scaleY": 0 }, 300 - Math.floor(i / 5) * 50).call(() => {
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
	createItem(data) {
		var item = new ItemBase();
		this.scrollerCon.addChild(item);
		item.num = data[1];
		item.data = data[0];
		// item.x = HuntResultWin.c_launchX;
		// item.y = HuntResultWin.c_launchY;
		return item;
	};
	// releaseAllItem() {
	// 	for (var k in this.items) {
	// 		this.items[k].destruct();
	// 		this.removeChild(this.items[k]);
	// 	}
	// 	this.items = [];
	// };



	closeCB(e) {
		if (!this.canClicck) {
			return;
		}
		this.canClicck = false;
		var func = () => {
			ViewManager.ins().close(this);
		};
		this.playGet(func);
	};
	buy(e) {
		if (!this.canClicck) {
			return
		}
		if (!this.canBuy) {
			return
		}
		// if ((this.huntType == 0 && UserBag.ins().getBagGoodsCountById(UserBag.BAG_TYPE_OTHTER, ItemConst.TREASURE_HUNT) > 0)
		// 		|| Checker.Money(MoneyConst.yuanbao, Number(this.num.text), Checker.YUNBAO_FRAME)) {
		// 	this.canBuy = false
		// 	this.playGet();
		// 	Hunt.ins().sendHunt(this.huntType);
		// }

		//过渠道测试，将钻石屏蔽，修改为道具寻宝
		var haveCount = UserBag.ins().getBagGoodsCountById(UserBag.BAG_TYPE_OTHTER, ItemConst.TREASURE_HUNT);
		var costCount = (this.huntType == 0) ? 1 : 10;
		if (haveCount >= costCount) {
			this.canBuy = false
			this.playGet();
			// Hunt.ins().sendHunt(1);
			Hunt.ins().sendHunt(this.huntType);
		}
		else {
			UserWarn.ins().setBuyGoodsWarn(ItemConst.TREASURE_HUNT, 10 - haveCount);
		}

		if (1) return;//以下代码为正式服代码，渠道测试通过可能会修改回来


		var needYuanbao;
		var haveCount = UserBag.ins().getBagGoodsCountById(UserBag.BAG_TYPE_OTHTER, ItemConst.TREASURE_HUNT);
		if (this.huntType == 0) {
			needYuanbao = 0 < haveCount ? 0 : GlobalConfig.ins("TreasureHuntConfig").huntOnce;
		} else {
			var tempNeed = GlobalConfig.ins("TreasureHuntConfig").huntTenth;
			var haveCount = UserBag.ins().getBagGoodsCountById(UserBag.BAG_TYPE_OTHTER, ItemConst.TREASURE_HUNT);
			needYuanbao = 9 < haveCount ? 0 : GlobalConfig.ins("TreasureHuntConfig").huntOnce * (10 - haveCount);
			needYuanbao = tempNeed < needYuanbao && tempNeed || needYuanbao;//超过500钻石是有优惠的
		}
		if (Checker.Money(MoneyConst.yuanbao, needYuanbao, Checker.YUNBAO_FRAME)) {
			this.canBuy = false
			this.playGet();
			Hunt.ins().sendHunt(this.huntType);
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

ViewManager.ins().reg(HuntResultWin, LayerManager.UI_Popup);

window["HuntResultWin"] = HuntResultWin