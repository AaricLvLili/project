class BaseView extends eui.Component {

	private eventList: EventListenerData[] = []

	observe(event: Function | string, func: Function): void {
		if (typeof (event) == "function") {
			MessageCenter.addListener(event, func, this)
		} else {
			MessageCenter.ins().addListener(event, func, this)
		}
	}

	removeObserve() {
		MessageCenter.ins().removeAll(this)
	}

	checkEventList(): void {
		if (this.eventList.length > 0) {
			Logger.Warn("基于BaseView离开舞台时并未清空eventList", this, this.eventList)
		}
	}

	AddClick(target: egret.DisplayObject, func: Function): void {
		this.addEvent(egret.TouchEvent.TOUCH_TAP, func, this, target);
	}


	AddItemClick(target: egret.DisplayObject, func: Function): void {
		this.addEvent(eui.ItemTapEvent.ITEM_TAP, func, this, target)
	}

	addTouchEvent(thisObject: any, func: Function, target: egret.DisplayObject) {
		this.addEvent(egret.TouchEvent.TOUCH_TAP, func, thisObject, target)
	}

	addItemTapEvent(thisObject: any, func: Function, target: egret.DisplayObject) {
		this.addEvent(eui.ItemTapEvent.ITEM_TAP, func, thisObject, target)
	}

	addTextLinkEvent(thisObject: any, func: Function, target: egret.DisplayObject) {
		this.addEvent(egret.TextEvent.LINK, func, thisObject, target)
	}

	addTouchEndEvent(thisObject: any, func: Function, target: egret.DisplayObject) {
		this.addEvent(egret.TouchEvent.TOUCH_END, func, thisObject, target)
	}

	addChangeEvent(thisObject: any, func: Function, target: egret.DisplayObject) {
		this.addEvent(egret.TouchEvent.CHANGE, func, thisObject, target)
	}

	addEvent(event: string, func: Function, thisObject: any, targetObj: egret.DisplayObject = null, useCapture: boolean = false) {
		if (targetObj == null) {
			// targetObj = this;
			console.debug("没有给定目标控件", this["__class__"])
			return;
		}

		for (var i = 0, list = this.eventList; i < list.length; ++i) {
			if (list[i].addObject == targetObj) {
				// console.debug("重复绑定对象", this["__class__"])
				return
			}
		}

		var data = new EventListenerData(targetObj, event, func, thisObject, useCapture, 0);
		if (data) {
			this.eventList.push(data)
		} else {
			egret.log("绑定侦听事件失败")
		}

		// if (thisObject instanceof eui.Button) {
		// 	let flg = SoundSetPanel.getSoundLocalData("btnSoundEff");
		// 	if (flg) SoundManager.ins().playEffect(GlobalConfig.soundConfig[4].soundResource + "_mp3");
		// }
	}

	removeEvents(): void {
		let list = this.eventList
		for (var i = 0, len = list.length; i < len; i++) {
			list[i].clean();
		}
		this.eventList = []
	}

	// $onClose() {
	// 	for (var t = 0; t < this.numChildren; t++) {
	// 		var i = this.getChildAt(t);
	// 		if (i instanceof BaseView) {
	// 			i.$onClose()
	// 		}
	// 	}
	// 	this.removeEvents(),
	// 	this.removeObserve()
	// }

	public DoOpen(...param: any[]) {
		this.open.apply(this, param);
	}

	public DoClose(...param: any[]) {
		this.close.apply(this, param);
		// for (var t = 0; t < this.numChildren; t++) {
		// 	var i = this.getChildAt(t);
		// 	if (i instanceof BaseView) {
		// 		i.DoClose(param);
		// 		if (i.parent && i.name != "miniChat") {
		// 			i.parent.removeChild(i);
		// 			i = null;
		// 		}
		// 	}
		// }
		this.removeEvents();
		this.removeObserve();
	}

	/**
     * 面板开启执行函数，用于子类继承
     * @param param 参数
     */
	public open(...param: any[]) {
	}

	/**
	 * 面板关闭执行函数，用于子类继承
	 * @param param 参数
	 */
	public close(...param: any[]) {
	}
}
window["BaseView"] = BaseView