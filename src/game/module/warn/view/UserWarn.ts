class UserWarn extends BaseSystem {

	static ins(): UserWarn {
		return super.ins();
	};

	setWarnLabel(str, callBackFun, callBackFun2, statu = "normal", data = null) {
		(<WarnWin>ViewManager.ins().open(WarnWin)).setWarnLabel(str, callBackFun, callBackFun2, statu, data);
	};

	setWarnContent(str, callBackFun, callBackFun2, statu = "normal", data = null) {
		(<WarnWin>ViewManager.ins().open(WarnWin)).setWarnContent(str, callBackFun, callBackFun2, statu, data);
	};

	setBuyGoodsWarn(id, num = 1) {
		(<ShopGoodsWarn>ViewManager.ins().open(ShopGoodsWarn)).setData(id, num);
	};
}

MessageCenter.compile(UserWarn);
window["UserWarn"]=UserWarn