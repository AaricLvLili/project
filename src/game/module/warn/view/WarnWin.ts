class WarnWin extends BaseEuiPanel {
	public constructor() {
		super()
	}
	sureBtn: eui.Button
	notBtn
	callBack
	calback2
	_isShowWin
	warnLabel: eui.Label
	private warnBg: eui.Image
	public dialogCloseBtn: eui.Button;
	/**是否结束时清掉界面 */
	public static isRelease: boolean = false;
	public m_Lan1: eui.Label;


	static show(str, func, thisObj, func2 = null, thisObj2 = null, statu = "normal", data = null) {
		UserWarn.ins().setWarnLabel(str, {
			"func": func,
			"thisObj": thisObj
		}, {
				"func2": func2,
				"thisObj2": thisObj2,
			}, statu, data);
	};

	public static ShowContent(str: string | eui.Component, func, thisObj, func2 = null, thisObj2 = null, statu = "normal", data = null) {
		UserWarn.ins().setWarnContent(str, {
			"func": func,
			"thisObj": thisObj
		}, {
				"func2": func2,
				"thisObj2": thisObj2,
			}, statu, data);
	}

	initUI() {
		super.initUI()
		this.skinName = "warnFrameSkin";
		this.m_Lan1.text = GlobalConfig.jifengTiaoyueLg.st100367;
		this.sureBtn.label = GlobalConfig.jifengTiaoyueLg.st100040;
		this.notBtn.label = GlobalConfig.jifengTiaoyueLg.st100602;

	};
	open() {
		this.sureBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTap, this);
		this.notBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTap, this);
		this.dialogCloseBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this._OnClick, this);
	};
	private _OnClick(e: egret.TouchEvent): void {
		if (this.currentState == "sure2") {
			return;
		}
		ViewManager.ins().close(this);
	}
	close() {

		this.sureBtn.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onTap, this);
		this.notBtn.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onTap, this);
		this.dialogCloseBtn.removeEventListener(egret.TouchEvent.TOUCH_TAP, this._OnClick, this);
		this.callBack = null
		this.calback2 = null
		this.sureBtn.label = `确定`
		this.notBtn.label = `取消`
		if (WarnWin.isRelease == true) {
			WarnWin.isRelease = false;
			ViewManager.ins().releaseView(WarnWin);
		}
	};
	onTap(e) {
		let tempCb1 = this.callBack
		let tempCb2 = this.calback2
		ViewManager.ins().close(WarnWin);
		switch (e.currentTarget) {
			case this.sureBtn:
				if (tempCb1 && tempCb1.func != null)
					tempCb1.func.call(tempCb1.thisObj);
				break;
			case this.notBtn:
				if (tempCb2 && tempCb2.func2) {
					tempCb2.func2.call(tempCb2.thisObj2);
				}
				break;
		}
	}

	get isShowWin() {
		return this._isShowWin;
	}

	set isShowWin(bool) {
		if (this._isShowWin == bool)
			return;
		this._isShowWin = bool;
	}

	private _Adjust(height: number): void {
		let gap = Math.max(height - 37, 0)
		let halfGap = gap * 0.5

		this.warnLabel.y = 382 - halfGap

		this.warnBg.height = 89 + gap
		this.warnBg.y = 356 - halfGap

		this.sureBtn.y = 687 + halfGap
		this.notBtn.y = 687 + halfGap


	}

	setWarnLabel(str, callbackFunc, calbackFun2 = null, statu = "normal", data = null) {
		if (typeof (str) == "string") {
			this.warnLabel.textFlow = (new egret.HtmlTextParser).parser(str);
		} else {
			this.warnLabel.textFlow = str
		}
		this.callBack = callbackFunc;
		this.calback2 = calbackFun2;
		this.currentState = statu;

		if (data) {
			if (data.btnName) {
				this.sureBtn.label = data.btnName
			}

		}

		//this._Adjust(this.warnLabel.height)
	};

	setWarnContent(content: string | eui.Component, callbackFunc, calbackFun2 = null, statu = "normal", data = null) {
		this.warnLabel.visible = false
		this.callBack = callbackFunc;
		this.calback2 = calbackFun2;
		this.currentState = statu;

		if (data) {
			if (data.btnName) {
				this.sureBtn.label = data.btnName
			}

		}

		let comp: eui.Component = null
		if (typeof (content) == "string") {
			comp = new eui.Component
			comp.skinName = content
		} else {
			comp = content
		}
		this.addChild(comp)

		comp.x = (480 - comp.width) * 0.5
		comp.y = (800 - comp.height) * 0.5 - 100;

		//this._Adjust(comp.height)
	}
}

ViewManager.ins().reg(WarnWin, LayerManager.UI_Popup);
window["WarnWin"] = WarnWin