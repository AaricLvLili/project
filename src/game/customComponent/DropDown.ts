class DropDown extends eui.Component {
	public constructor() {
		super();
	}
	list
	value

	childrenCreated() {
		// this.skinName = 'DropDownSkin';
		this.touchEnabled = true;
		this.currentState = 'up';
		this.list.addEventListener(egret.Event.CHANGE, this.listSelect, this);
		this.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTap, this);
		this.addEventListener(egret.Event.REMOVED_FROM_STAGE, this.removeStage, this);
	};
	listSelect(e) {
		this.value.text = this.list.selectedItem.name;
	};
	removeStage() {
		if (this.stage)
			this.stage.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onTap, this);
	};
	onTap(e) {
		this.currentState = this.currentState == 'up' ? 'down' : 'up';
		e.stopPropagation();
		if (this.stage) {
			if (this.currentState == 'down')
				this.stage.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTap, this);
			else
				this.stage.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onTap, this);
		}
	};
	setData(data) {
		this.list.dataProvider = data;
	};
	setSelectedIndex(value) {
		this.list.selectedIndex = value;
	};
	getSelectedIndex() {
		return this.list.selectedIndex;
	};
	setLabel(str) {
		this.value.text = str;
	};
	getLabel() {
		return this.value.text;
	};
	setEnabled(b) {
		this.list.touchEnabled = b;
		this.list.touchChildren = b;
	};
	getEnabled() {
		return this.list.touchEnabled;
	};
	destructor() {
		this.list.removeEventListener(egret.Event.CHANGE, this.listSelect, this);
		this.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onTap, this);
		this.removeEventListener(egret.Event.REMOVED_FROM_STAGE, this.removeStage, this);
		this.removeStage();
	}
}
window["DropDown"]=DropDown