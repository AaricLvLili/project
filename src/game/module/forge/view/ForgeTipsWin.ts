class ForgeTipsWin extends BaseEuiPanel {

	attr
	attrStr
	attrTxt
	attrTxt0
	background
	group

	public constructor() {
		super();
	}


	initUI() {
		super.initUI();
		this.skinName = "forgeTips";
	};
	open() {
		var param = [];
		for (var _i = 0; _i < arguments.length; _i++) {
			param[_i - 0] = arguments[_i];
		}
		this.attr = param[0];
		this.attrStr = param[1];
		this.addEventListener(egret.TouchEvent.TOUCH_END, this.otherClose, this);
		this.attrTxt.text = this.attrStr;
		this.attrTxt0.text = "";
		for (var i = 0; i < this.attr.length; i++) {
			this.attrTxt0.text += this.attr[i] + ((i == this.attr.length - 1) ? "" : "\n");
		}
		this.background.height = this.attrTxt.textHeight + 60;
		this.group.y = this.group.height / 2 - this.background.height / 2;
	};
	close() {
		var param = [];
		for (var _i = 0; _i < arguments.length; _i++) {
			param[_i - 0] = arguments[_i];
		}
		this.removeEventListener(egret.TouchEvent.TOUCH_END, this.otherClose, this);
	};
	otherClose(evt) {
		ViewManager.ins().close(this);
	};
}


ViewManager.ins().reg(ForgeTipsWin, LayerManager.UI_Popup);
window["ForgeTipsWin"]=ForgeTipsWin