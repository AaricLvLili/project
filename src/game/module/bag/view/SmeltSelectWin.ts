class SmeltSelectWin extends BaseEuiPanel {

	public static LAYER_LEVEL = LayerManager.UI_Popup

	public constructor() {
		super()
	}

	itemList: eui.List
	itemScroller
	checkList
	len
	// closeBtn
	// closeBtn0
	sureBtn
	countLabel

	//private dialogCloseBtn: eui.Button;

	initUI() {
		super.initUI()
		this.skinName = "SmeltSelectSkin";
		this.itemList.itemRenderer = SmeltSelectItem;
		this.itemScroller.viewport = this.itemList;
		this.checkList = [];

	};
	open(...param: any[]) {
		this.len = param[1];
		this.m_bg.init(`SmeltSelectWin`, `选择装备`)
		// this.closeBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTap, this);
		// this.closeBtn0.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTap, this);
		this.sureBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTap, this);
		this.itemList.addEventListener(eui.ItemTapEvent.ITEM_TAP, this.onItemTap, this);
		UserBag.ins().smeltItemList = param[2];
		this.itemList.dataProvider = new eui.ArrayCollection(param[0]);
		this.setSmeltEquipList(param[2]);
		//this.dialogCloseBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this._OnClick, this);
	};
	close() {
		// this.closeBtn.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onTap, this);
		// this.closeBtn0.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onTap, this);
		this.sureBtn.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onTap, this);
		this.itemList.removeEventListener(eui.ItemTapEvent.ITEM_TAP, this.onItemTap, this);
		this.foolChecklist();
		MessageCenter.ins().removeAll(this);
		UserEquip.ins().postEquipCheckList(this.checkList);
		//this.dialogCloseBtn.removeEventListener(egret.TouchEvent.TOUCH_TAP, this._OnClick, this)
	};
	private _OnClick(e: egret.TouchEvent) {
		ViewManager.ins().close(this);
	}
	onItemTap(e: eui.ItemTapEvent) {
		var item: SmeltSelectItem = e.itemRenderer as SmeltSelectItem;
		if (!item.checkBoxs.selected && this.checkList.length >= this.len)
			return;
		item.checkBoxs.selected = !item.checkBoxs.selected;
		var itemData = this.itemList.selectedItem;
		if (item.checkBoxs.selected) {
			this.checkList[this.checkList.length] = itemData;
			UserBag.ins().smeltItemList = this.checkList;
			if (this.checkList.length == this.len) {
				UserEquip.ins().postEquipCheckList(this.checkList);
				ViewManager.ins().close(SmeltSelectWin);
				return;
			}
		}
		else {
			// var index = this.checkList.indexOf(itemData);
			// if (index < 0)
			// 	return;
			let index: number = null;
			for (var i = 0; i < this.checkList.length; i++) {
				if (this.checkList[i].handle == itemData.handle) {
					index = i;
					break;
				}
			}
			if (index == null) {
				return;
			}
			this.checkList.splice(index, 1);
			UserBag.ins().smeltItemList = this.checkList;
		}
		this.setCountLabel(this.checkList.length);
	};
	onTap(e) {
		switch (e.currentTarget) {
			// case this.closeBtn:
			// case this.closeBtn0:
			// 	ViewManager.ins().close(SmeltSelectWin);
			// 	break;
			case this.sureBtn:
				// UserEquip.ins().postEquipCheckList(this.checkList);
				ViewManager.ins().close(SmeltSelectWin);
				break;
		}
	};
	setSmeltEquipList(list) {
		this.checkList = list;
		this.checkListData();
		this.setCountLabel(this.checkList.length);
		// TimerManager.ins().doFrame(60, 1,this.defaultSelect, this);
		// TimerManager.ins().doTimer(100, 1,this.defaultSelect, this);
	};

	// private defaultSelect():void
	// {
	// TimerManager.ins().remove(this.defaultSelect,this);
	// 	var len2 = this.checkList.length;
	// 	var numElements = this.itemList.numElements;
	// 	for (var i = 0; i < len2; i++) {
	// 		for (var j = 0; j < numElements; j++) {
	// 			var item: SmeltSelectItem = this.itemList.getElementAt(j) as SmeltSelectItem;
	// 			if(!item || !item.data) continue ;
	// 			if (this.checkList[i] && this.checkList[i].handle == item.data.handle) {
	// 				if (this.checkList.length <= this.len) {
	// 					this.checkList[i] = item.data;
	// 					item.checkBoxs.selected = true;
	// 				}
	// 				continue;
	// 			}
	// 		}
	// 	}
	// }

	setCountLabel(count) {
		this.countLabel.text = count + "/" + this.len;
	};
	checkListData() {
		var len = this.checkList.length;
		for (var i = len - 1; i >= 0; i--) {
			if (this.checkList[i] == null || !this.checkList[i].handle) {
				this.checkList.splice(i, 1);
			}
		}
	};
	foolChecklist() {
		var len = this.checkList.length;
		for (var i = 0; i < this.len; i++) {
			if (i >= len) {
				this.checkList.push(null);
			}
		}
	};
}

window["SmeltSelectWin"]=SmeltSelectWin