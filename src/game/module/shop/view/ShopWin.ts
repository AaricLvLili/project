class ShopWin extends BaseEuiPanel implements ICommonWindow {

	// 定义view对象的层级
	public static LAYER_LEVEL = LayerManager.UI_Main
	// blackMarketPanel: BlackMarketPanel
	// viewStack: eui.ViewStack
	// integrationPanel: IntegrationPanel
	// itemShopPanel: ItemShopPanel
	// medalPanel: MedalShopPanel

	// tab: eui.TabBar

	// closeBtn
	// closeBtn0

	public commonWindowBg: CommonWindowBg
	public blackMarketPanel: BlackMarketPanel;
	public itemShopPanel: ItemShopPanel;
	public medalPanel: MedalShopPanel;
	//private mijingShop: MiJingShop;

	private shopList = [
		/**功勋商店 */
		ShopType.FEAT,//功勋商店
		/**宠物商店 */
		ShopType.PET,//宠物商店
		/**坐骑商店 */
		ShopType.RIDE,//坐骑商店
		// /**神器商店 */
		// ShopType.ARTI,//神器商店
		/**跨服商店 */
		ShopType.CROSS,//跨服商店
		/**公会商店 */
		ShopType.GUILD,//公会商店
	]




	initUI() {
		super.initUI()
		this.skinName = "MainWinSkin";
		this.blackMarketPanel = new BlackMarketPanel();
		this.commonWindowBg.AddChildStack(this.blackMarketPanel);
		this.itemShopPanel = new ItemShopPanel();
		this.commonWindowBg.AddChildStack(this.itemShopPanel);
		let shopList = this.shopList;
		for (let i = 0, len = shopList.length; i < len; i++) {
			let item = new MedalShopPanel(shopList[i]);
			this.commonWindowBg.AddChildStack(item);
		}
		// let miJingShop = new MiJingShop();
		// this.mijingShop = miJingShop;
		// miJingShop.name = "秘境商城";
		// this.viewStack.addChild(miJingShop);//屏蔽
		if (Main.isDebug || SdkMgr.isWxGame()) {
			let ShareShop = new ShareShopPanel();
			ShareShop.name = GlobalConfig.jifengTiaoyueLg.st100085;
			this.commonWindowBg.AddChildStack(ShareShop);
		}
		// this.viewStack.selectedIndex = 0;
		// this.tab.dataProvider = this.viewStack;
	};
	open(...param: any[]) {
		// this.closeBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onClick, this);
		// this.closeBtn0.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onClick, this);
		// this.tab.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTabTouch, this);
		// Shop.ins().postRefreshGoodsSuccess(false);
		// this.commonWindowBg.closeBtn = this["closeBtn"]

		var index = param[0] == undefined ? 0 : param[0];
		this.commonWindowBg.OnAdded(this, index)
		// this.setOpenIndex(index);
		// this.viewStack.selectedIndex = index;
	};
	close() {
		this.commonWindowBg.OnRemoved()
	};
	// onClick(e) {
	// 	switch (e.currentTarget) {
	// 		case this.closeBtn:
	// 		case this.closeBtn0:
	// 			ViewManager.ins().close(this);
	// 			break;
	// 	}
	// };
	// setOpenIndex(selectedIndex) {
	// 	switch (selectedIndex) {
	// 		case 2:
	// 			this.itemShopPanel.open();
	// 			break;
	// 		case 1:
	// 			this.integrationPanel.open();
	// 			break;
	// 		case 0:
	// 			this.blackMarketPanel.open();
	// 			break;
	// 		case 3:
	// 			this.medalPanel.open();
	// 			break;
	// 	}
	// };
	// onTabTouch(e) {
	// 	this.setOpenIndex(e.currentTarget.selectedIndex);
	// };

	OnBackClick(clickType: number): number {
		return 0
	}

	OnOpenIndex(openIndex: number): boolean {
		return true
	}
}

window["ShopWin"] = ShopWin