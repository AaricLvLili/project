class EventListenerData {

	addObject: egret.DisplayObject;
	type: string;
	listener: Function;
	thisObject: any;
	useCapture: boolean;
	priority: number;

	public constructor(addObj:  egret.DisplayObject, type: string, func: Function, thisObj: any, useCapture: boolean, priority: number) {
		this.addObject = addObj
        this.type = type
        this.listener = func
        this.thisObject = thisObj
        this.useCapture = useCapture
        this.priority = priority
		if (addObj) {
			addObj.addEventListener(type, func, thisObj, useCapture, priority)
		} else {
			console.log("不存在增加侦听事件的对象")
		}
	}

	clean () {
		if (this.addObject) {
			if (this.addObject.hasEventListener(this.type)) {
				this.addObject.removeEventListener(this.type, this.listener, this.thisObject, this.useCapture)
				this.addObject = null;
				this.type = null;
				this.listener = null;
				this.useCapture = null;
				this.priority = null;
			} else {
				// console.warn("无可删除侦听事件: " + this.type);
				// console.log(this)
			}
		} else {
			// console.warn("不存在增加侦听事件的对象")
		}
    }
}
window["EventListenerData"]=EventListenerData