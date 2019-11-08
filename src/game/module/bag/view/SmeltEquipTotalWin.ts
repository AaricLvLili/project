class SmeltEquipTotalWin extends BaseEuiPanel implements ICommonWindow {
	public constructor() {
		super()
		this.layerLevel = VIEW_LAYER_LEVEL.TOP; //设为1级UI
	}

	// tab
	// viewStack: eui.ViewStack
	// lastSelect
	// closeBtn
	// closeBtn0
	// equip
	// equiprong
	// redPoint

	commonWindowBg: CommonWindowBg

	private smeltEquipNormalPanel:SmeltEquipNormalPanel;
	private smeltEquipRongluPanel:SmeltEquipRongluPanel;

	initUI() {
		super.initUI()
		this.skinName = "MainWinSkin";
		this.smeltEquipNormalPanel=new SmeltEquipNormalPanel();
		this.smeltEquipNormalPanel.name= GlobalConfig.jifengTiaoyueLg.st101447;
		this.commonWindowBg.AddChildStack(this.smeltEquipNormalPanel);

		this.smeltEquipRongluPanel=new SmeltEquipRongluPanel();
		this.smeltEquipRongluPanel.name= GlobalConfig.jifengTiaoyueLg.st101457;
		this.commonWindowBg.AddChildStack(this.smeltEquipRongluPanel);
	};
	open() {
		// this.lastSelect = 0;
		// this.viewStack.selectedIndex = this.lastSelect;
		// this.closeBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTap, this);
		// this.closeBtn0.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTap, this);
		// this.tab.addEventListener(egret.Event.CHANGE, this.onTabTouch, this);
		this.commonWindowBg.OnAdded(this)
		MessageCenter.addListener(Bless.ins().postBlessRongluSuccess, this.itemUpdate, this);
		// this.viewStack.getElementAt(this.lastSelect)['open']();
		this.itemUpdate();
	};
	close() {
		this.commonWindowBg.OnRemoved()
		// this.closeBtn.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onTap, this);
		// this.closeBtn0.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onTap, this);
		// this.tab.removeEventListener(egret.Event.CHANGE, this.onTabTouch, this);
		// this.equip.close();
		// this.equiprong.close();
	};
	itemUpdate() {
		this.commonWindowBg.ShowTalRedPoint(1, UserBag.ins().getWingZhuEquip().length >= 10)
		// if (UserBag.ins().getWingZhuEquip().length >= 10) {
		// 	this.redPoint.visible = true;
		// }
		// else {
		// 	this.redPoint.visible = false;
		// }
	};
    /**
     * 点击标签页按钮
     */
	// onTabTouch(e) {
	// this.viewStack.getElementAt(this.lastSelect)['close']();
	// this.lastSelect = this.viewStack.selectedIndex;
	// this.viewStack.getElementAt(this.lastSelect)['open']();
	// };
	// onTap(e) {
	// 	switch (e.currentTarget) {
	// 		case this.closeBtn:
	// 		case this.closeBtn0:
	// 			ViewManager.ins().close(this);
	// 			break;
	// 	}
	// };

	OnBackClick(clickType: number): number { return 0 }
	OnOpenIndex(openIndex: number): boolean { return true }
}

ViewManager.ins().reg(SmeltEquipTotalWin, LayerManager.UI_Main);
window["SmeltEquipTotalWin"] = SmeltEquipTotalWin