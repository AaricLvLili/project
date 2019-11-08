class ItemBaseStore extends ItemBase {

	onClick() {
		var uuid = this.data.handle;
		if (!this.data.type) {
			UserBag.ins().sendGetGoodsByStore(uuid);
		} else {
			UserBag.ins().sendGetGoodsByStore(uuid, UserBag.BAG_TYPE_VIPTREASUREHUNT);
		}
	};
}

class TreasureStorePanel extends BaseEuiPanel {

	list
	listScroller
	public getBtn: eui.Button;

	//private dialogCloseBtn:eui.Button;
	private type: number = 0;

	public static isOpen: boolean = false;
	protected childrenCreated() {
		this.name = GlobalConfig.jifengTiaoyueLg.st101311;
		this.skinName = "TreasureStore";
		this.list.itemRenderer = ItemBaseStore;
		this.listScroller.viewport = this.list;
		//this.dialogCloseBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this._OnClick, this);
		this.getBtn.label = GlobalConfig.jifengTiaoyueLg.st101317;
	};
	open(...param: any[]) {
		this.type = param[0];
		TreasureStorePanel.isOpen = true;
		this.m_bg.init(`TreasureStorePanel`, GlobalConfig.jifengTiaoyueLg.st101311)
		this.getBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.getGoods, this);
		MessageCenter.addListener(UserBag.postHuntStore, this.updateData, this);
		this.updateData();
	};
	close() {
		TreasureStorePanel.isOpen = false;
		var param = [];
		for (var _i = 0; _i < arguments.length; _i++) {
			param[_i - 0] = arguments[_i];
		}
		this.getBtn.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.getGoods, this);
		MessageCenter.ins().removeAll(this);
		//this.dialogCloseBtn.removeEventListener(egret.TouchEvent.TOUCH_TAP, this._OnClick, this)
	};
	private _OnClick(e: egret.TouchEvent) {
		ViewManager.ins().close(this);
	}
	updateData() {
		var datas = []
		if (!this.type) {
			datas = UserBag.ins().getHuntGoodsBySort();
		} else {
			datas = UserBag.ins().getHuntGoodsBySort(UserBag.BAG_TYPE_VIPTREASUREHUNT);
		}
		for (var i = 0; i < datas.length; i++) {
			datas[i].type = this.type;
		}
		this.list.dataProvider = new eui.ArrayCollection(datas);
	};
	getGoods(e) {
		if (this.list.dataProvider.length > 0) {
			if (!this.type) {
				UserBag.ins().sendGetGoodsByStore(0);
				if (UserBag.ins().getSurplusCount() < this.list.dataProvider.length) {
					ViewManager.ins().close(TreasureStorePanel);
					BagFullTipsPanel.OpenNoCloseMe()
				}
			} else {
				UserBag.ins().sendGetGoodsByStore(0, UserBag.BAG_TYPE_VIPTREASUREHUNT);
				if (UserBag.ins().getSurplusCount() < this.list.dataProvider.length) {
					ViewManager.ins().close(TreasureStorePanel);
					BagFullTipsPanel.OpenNoCloseMe()
				}
				egret.setTimeout(function () {
					GameGlobal.MessageCenter.dispatch(CouponEvt.COUPON_TREASURE_UPDATE);
				}, this, 500)
			}
		}

	};
}
ViewManager.ins().reg(TreasureStorePanel, LayerManager.UI_Popup);
window["ItemBaseStore"] = ItemBaseStore
window["TreasureStorePanel"] = TreasureStorePanel