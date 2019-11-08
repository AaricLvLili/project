class RuleIconBase {

	protected firstTap

	layerCount = 0
	tar: any
	public updateMessage: any[];

	effX = 0;
	effY = 0;
	/** 存储自己父级容器*/
	public parentGpuop: eui.Group;

	static thisUpdate;
	static thisObj;

	static thisUpdateCity;
	static thisObjCity;

	protected _groupEff: eui.Group
	protected _mc: MovieClip

	public constructor(t) {
		this.tar = t;
		this.parentGpuop = t.parent;
	}

	checkShowIcon() {
		return true;
	}

	checkShowRedPoint() {
		return null;
	}

	getEffName(redPointNum) {
		return null;
	}

	/** 执行 */
	tapExecute() {
	}

	update() {
		if (RuleIconBase.thisObj && RuleIconBase.thisObj.getChildIndex(this.parentGpuop) > -1) {
			RuleIconBase.thisUpdate.call(RuleIconBase.thisObj, this);
		} else if (RuleIconBase.thisObjCity && RuleIconBase.thisObjCity.getChildIndex(this.parentGpuop) > -1) {
			RuleIconBase.thisUpdateCity.call(RuleIconBase.thisObjCity, this);
		}
	}

	addEvent() {
		for (let data of this.updateMessage) {
			if (typeof (data) == "function") {
				MessageCenter.addListener(data, this.update, this);
			} else {
				MessageCenter.ins().addListener(data, this.update, this)
			}
		}
	}

	removeEvent() {
		MessageCenter.ins().removeAll(this);
	}
	public DestoryMc(): void {
		if (this._mc == null)
			return
		DisplayUtils.dispose(this._mc)
		ObjectPool.ins().push(this._mc)
		this._mc = null
	}

	protected DefEffe(e) {
		return this.firstTap || e ? (this.effX = 33, this.effY = 33, "eff_main_icon02") : void 0
	}

	public onTimer() {
	}
}
window["RuleIconBase"] = RuleIconBase