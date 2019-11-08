class ErrorLog {

	static httpLog = false;

	private static _ins;

	static ins(): ErrorLog {
		if (this._ins == null) {
			this._ins = new ErrorLog()
		}
		return this._ins;
	}

	show(showText: string) {
		var obj: any = new BaseView;
		obj.skinName = "ErrorSkin";
		var func = () => {
			DisplayUtils.removeFromParent(<BaseView><any>this)
			// obj.$onClose()
		}
		func.bind(obj);
		obj.notBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, func, obj)
		obj.lab.text = showText
		StageUtils.ins().getUIStage().addChild(obj)
	}

	static Assert(bool: any, text: string) {
		if (bool) {
			return false;
		} else {
			if (DebugUtils.isDebug) {
				ErrorLog.ins().show(text)
				if (ErrorLog.httpLog) {
					// ReportData.getIns().report(i, "error")
				}
			}
			return true;
		}
	}
}

var Assert = ErrorLog.Assert;
window["ErrorLog"]=ErrorLog