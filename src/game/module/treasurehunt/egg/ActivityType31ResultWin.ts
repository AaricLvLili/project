class ActivityType31ResultWin extends BaseEuiPanel {

	private static readonly c_launchX = 180;
	private static readonly c_launchY = 500;
	private static readonly c_firstX = 50;
	private static readonly c_firstY = 180;
	private static readonly c_distantX = 77;
	private static readonly c_distantY = 90;
	private static readonly c_depotX = 320;
	private static readonly c_depotY = 620;
	private static readonly waitTime = 50;
	public m_bg: CommonPopBg;
	public buyBtn: eui.Button;
	public closeBtn: eui.Button;
	public num: eui.Label;
	public tip: eui.Label;
	public m_Group: eui.Group;

	arr = [];
	items = [];
	huntType

	private dialogCloseBtn: eui.Button;
	activityId: number = 0;
	// private priceIcon03: PriceIcon

	public constructor() {
		super()
	}

	initUI() {
		super.initUI()
		this.skinName = "ActivityType31ResultSkin";
		this.closeBtn.label = GlobalConfig.jifengTiaoyueLg.st100040;
	};
	open(...param: any[]) {
		super.open(param);
		this.m_bg.init(`ActivityType31ResultWin`, GlobalConfig.jifengTiaoyueLg.st100038)
		this.closeBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.closeCB, this);
		this.buyBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.buy, this);
		this.observe(MessageDef.HUNT_RESULT, this.updateView)
		this.updateView([param[0], param[1], param[2]]);
		this.canClicck = true;
		// this.list.itemRenderer = ActivityItemShow
	};
	close() {
		super.close()
		this.closeBtn.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.closeCB, this);
		this.buyBtn.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.buy, this);
		MessageCenter.ins().removeAll(this);
	};
	private _OnClick(e: egret.TouchEvent) {
		ViewManager.ins().close(this);
	}
	updateView(param) {
		this.huntType = param[0];
		this.arr = param[1];
		this.activityId = param[2];
		var config = ActivityType31Data.getConfig(this.activityId);

		if (this.huntType == 0) {
			this.num.text = config.huntOnce + "";
			this.currentState = "one"
			egret.setTimeout(function () {
				if (!this.tip) {
					return;
				}
				this.tip.text = LanguageString.jifengTiaoyueCh(GlobalConfig.jifengTiaoyueLg.st102069, [1])
				this.buyBtn.label = GlobalConfig.jifengTiaoyueLg.st102058;
			}, this, 200);

		} else if (this.huntType == 1) {
			this.num.text = config.huntTenth + "";
			this.currentState = "ten"
			egret.setTimeout(function () {
				if (!this.tip) {
					return;
				}
				this.tip.text = LanguageString.jifengTiaoyueCh(GlobalConfig.jifengTiaoyueLg.st102069, [10])
				this.buyBtn.label = GlobalConfig.jifengTiaoyueLg.st102057;
			}, this, 200);
		} else {
			this.num.text = "";
			this.currentState = "type_2"
			egret.setTimeout(function () {
				if (!this.tip) {
					return;
				}
				this.tip.text = GlobalConfig.jifengTiaoyueLg.st102070;
			}, this, 200);
		}
		this.playResult();
	};
	playResult() {
		this.canBuy = true
		this.m_Group.removeChildren();
		for (var i = 0; i < this.arr.length; i++) {
			this.items[i] = this.createItem(this.m_Group, this.arr[i]);
			var t = egret.Tween.get(this.items[i]);
			this.items[i].x = (i % 5) * ActivityType31ResultWin.c_distantX + ActivityType31ResultWin.c_firstX;
			this.items[i].y = Math.floor(i / 5) * ActivityType31ResultWin.c_distantY + ActivityType31ResultWin.c_firstY;
			this.items[i].alpha = 0;
			this.items[i].showEquipEffect();

			t.wait(i * ActivityType31ResultWin.waitTime).to({ alpha: 1 }, 200).call((obj) => {
				egret.Tween.removeTweens(obj);
			}, this, [this.items[i]]);
		}
	};

	static PlayItem(i, item) {
		var t = egret.Tween.get(item);
		item.x = (i % 5) * ActivityType31ResultWin.c_distantX + ActivityType31ResultWin.c_firstX;
		item.y = Math.floor(i / 5) * ActivityType31ResultWin.c_distantY + ActivityType31ResultWin.c_firstY;
		item.alpha = 0;
		item.showEquipEffect();
		t.wait(i * ActivityType31ResultWin.waitTime).to({ alpha: 1 }, 200).call(() => {
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
			t.to({ "y": ActivityType31ResultWin.c_depotY, "x": ActivityType31ResultWin.c_depotX, "scaleX": 0, "scaleY": 0 }, 300 - Math.floor(i / 5) * 50).call(() => {
				egret.Tween.removeTweens(item);
				if (i == len - 1) {
					if (fun != undefined) {
						fun();
					}
					for (let item of list) {
						item.destruct();
						DisplayUtils.removeFromParent(item)
					}
				}
			});
		}
	};
	private createItem(view, data) {
		var item = new ItemBase();
		view.addChild(item);

		//元宝取奖池金额
		if (data[0] == MoneyConst.yuanbao) {
			var activityData = <ActivityType31Data>GameGlobal.activityData[this.activityId];
			item.data = { id: MoneyConst.yuanbao, type: 0, count: data[1] };
		}
		else {
			item.data = this.getRewardData(data[0]);
		}

		item.x = ActivityType31ResultWin.c_launchX;
		item.y = ActivityType31ResultWin.c_launchY;
		return item;
	};

	private getRewardData(id) {
		var config = ActivityType31Data.getConfig(this.activityId);
		var len = config.rewardShow.length;
		for (let i = 0; i < len; ++i) {
			var reward = config.rewardShow[i];
			if (id == reward.id)
				return reward;
		}
		return id;
	}

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
		ActivityType31ResultWin.playGet(this.items, func);
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
			ActivityType31ResultWin.playGet(this.items);
			ActivityType31Model.ins().sendHuntOne(this.huntType, this.activityId);
		}


	};
}

ViewManager.ins().reg(ActivityType31ResultWin, LayerManager.UI_Popup);

window["ActivityType31ResultWin"] = ActivityType31ResultWin