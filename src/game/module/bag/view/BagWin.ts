class BagWin extends BaseEuiPanel implements ICommonWindow, ICommonWindowTitle {
	public constructor() {
		super();
		this.layerLevel = VIEW_LAYER_LEVEL.TOP; //设为1级UI
	}
	private commonWindowBg: CommonWindowBg = null;
	private viewStack: eui.ViewStack = null;
	private itemList = null;//装备
	private itemListGoods = null;//道具
	private itemScroller = null;
	private itemGoodsScroller = null;
	private smeltBtn = null;
	private addBtn = null;
	private itemCount
	private bagBaseConfig: any;

	public itemGadScroller = null;
	public itemListGad;
	private listData: eui.ArrayCollection;
	public m_TogGroup: eui.Group;
	public m_LvTog: eui.ToggleButton;
	public m_StarTog: eui.ToggleButton;
	public m_PointTog: eui.ToggleButton;
	public m_SortGroup: eui.Group;
	public m_SortImg: eui.Image;
	public m_SortLab: eui.Label;

	private isUPSort: boolean = false;
	public m_Lan1: eui.Label;
	public m_BagGroup: eui.Group;
	public m_ItemGroup: eui.Group;
	public m_GadGroup: eui.Group;
	initUI() {
		super.initUI()
		this.skinName = "BagSkin";
		this.itemList.itemRenderer = BagItemBase;
		this.itemListGoods.itemRenderer = BagItemBase;
		this.itemScroller.viewport = this.itemList;
		this.itemGoodsScroller.viewport = this.itemListGoods;
		this.itemListGad.itemRenderer = GadBagItem;
		this.listData = new eui.ArrayCollection();
		this.itemListGad.dataProvider = this.listData;
		this.itemGadScroller.viewport = this.itemListGad;
		this.m_Lan1.text = GlobalConfig.jifengTiaoyueLg.st101237;
		this.smeltBtn.label = GlobalConfig.jifengTiaoyueLg.st101238;
		this.m_BagGroup.name = GlobalConfig.jifengTiaoyueLg.st100665;
		this.m_ItemGroup.name = GlobalConfig.jifengTiaoyueLg.st101241;
		this.m_GadGroup.name = GlobalConfig.jifengTiaoyueLg.st100305;
		this.m_SortLab.text=GlobalConfig.jifengTiaoyueLg.st100332;
		this.m_LvTog.label=GlobalConfig.jifengTiaoyueLg.st100333;
		this.m_StarTog.label=GlobalConfig.jifengTiaoyueLg.st100334;
		this.m_PointTog.label=GlobalConfig.jifengTiaoyueLg.st100335;
	};
	open(...args: any[]) {

		this.commonWindowBg.SetViewStack(this.viewStack)
		this.commonWindowBg.OnAdded(this)
		this.addTouchEvent(this, this.onClick, this.smeltBtn)
		this.addTouchEvent(this, this.onClick, this.addBtn)
		this.addTouchEvent(this, this.onClickSort, this.m_SortGroup);
		this.addTouchEvent(this, this.onClickTog, this.m_LvTog);
		this.addTouchEvent(this, this.onClickTog, this.m_StarTog);
		this.addTouchEvent(this, this.onClickTog, this.m_PointTog);

		this.observe(UserBag.postUseItemSuccess, this.setBagData)
		this.observe(UserBag.postHcItemSuccess, this.setBagData)
		this.observe(UserBag.postBagVolAdd, this.setCount)
		MessageCenter.ins().addListener(GadEvent.GAD_DATAUPDATE_MSG, this.setGadBagData, this);
		this.setBagData();
		this.setGadBagData();
		var openIndex = args[0]
		var checkOpen = this.OnOpenIndex(openIndex)
		this.commonWindowBg.OnAdded(this, checkOpen ? openIndex : 0)

	};
	close() {
		this.commonWindowBg.OnRemoved()
		this.smeltBtn.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onClick, this);
		this.addBtn.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onClick, this);
		MessageCenter.ins().removeListener(GadEvent.GAD_DATAUPDATE_MSG, this.setBagData, this);
		ViewManager.ins().close(BagWin);
		// var uiview2 = <UIView2>ViewManager.ins().getView(UIView2);
		// if (uiview2)
		// 	uiview2.closeNav(UIView2.NAV_BAG);
		MessageCenter.ins().removeAll(this);

		this.removeEvents()
		this.removeObserve()
		let uiview2 = <UIView2>ViewManager.ins().getView(UIView2);
		if (uiview2)
			uiview2.closeNav(UIView2.NAV_MYBAG);
	};




	/** 销毁窗口*/
	destoryView() {
		super.destoryView()
		for (var i = 0; i < this.itemList.numElements; i++) {
			if (this.itemList.getElementAt(i))
				this.itemList.getElementAt(i).destroy();
		}
		for (var i = 0; i < this.itemListGoods.numElements; i++) {
			if (this.itemListGoods.getElementAt(i))
				this.itemListGoods.getElementAt(i).destroy();
		}

		for (var i = 0; i < this.itemListGad.numElements; i++) {
			if (this.itemListGad.getElementAt(i))
				this.itemListGad.getElementAt(i).destroy();
		}
	};
	/**点击 */
	onClick(e) {
		switch (e.currentTarget) {
			// case this.closeBtn:
			// case this.closeBtn0:
			// 	ViewManager.ins().close(BagWin);
			// 	break;
			case this.smeltBtn:
				ViewManager.ins().close(BagWin);
				ViewManager.ins().open(SmeltEquipTotalWin);
				break;
			case this.addBtn:
				if (this.bagBaseConfig == null)
					this.bagBaseConfig = GlobalConfig.ins("BagBaseConfig");
				var config = this.bagBaseConfig;
				var row = (UserBag.ins().bagNum - config.baseSize) / config.rowSize;
				if (row == CommonUtils.getObjectLength(GlobalConfig.ins("BagExpandConfig"))) {
					UserTips.ins().showTips(StringUtils.addColor(GlobalConfig.jifengTiaoyueLg.st101239, 0xf87372));
				} else {
					ViewManager.ins().open(BagAddItemWarn);
				}
				break;

		}
	};
	setCount() {
		this.itemCount.text = UserBag.ins().getBagItemNum() + "/" + UserBag.ins().getMaxBagRoom();
	};
	setBagData() {
		this.itemList.dataProvider = new eui.ArrayCollection(UserBag.ins().getBagSortQualityEquips(5, 0, 1));
		this.itemListGoods.dataProvider = new eui.ArrayCollection(UserBag.ins().getBagGoodsBySort());
		// (this.itemListGoods.dataProvider as eui.ArrayCollection).replaceAll(UserBag.ins().getBagGoodsBySort());
		this.setCount();
		if (UserBag.ins().getBagItemNum() / UserBag.ins().getMaxBagRoom() >= 0.8 || UserBag.ins().getWingZhuEquip().length >= 10) {
			UIHelper.ShowRedPoint(this.smeltBtn, true)
			this.commonWindowBg.ShowTalRedPoint(0, true)
		} else {
			UIHelper.ShowRedPoint(this.smeltBtn, false)
			this.commonWindowBg.ShowTalRedPoint(0, false)
		}
		this.commonWindowBg.ShowTalRedPoint(1, UserBag.ins().getIsExitUsedItem())
	};

	setGadBagData() {
		let gadModel = GadModel.getInstance;
		let gadBagDatas: GadBagData[] = gadModel.gadBagDic.values;
		if (this.m_LvTog.selected == true) {
			if (this.isUPSort == true) {
				gadBagDatas.sort(this.sorUpLevel);
			} else {
				gadBagDatas.sort(this.sorDownLevel);
			}
		} else if (this.m_StarTog.selected == true) {
			if (this.isUPSort == true) {
				gadBagDatas.sort(this.sorUpStar);
			} else {
				gadBagDatas.sort(this.sorDownStar);
			}
		} else if (this.m_PointTog.selected == true) {
			if (this.isUPSort == true) {
				gadBagDatas.sort(this.sorUpSlot);
			} else {
				gadBagDatas.sort(this.sorDownSlot);
			}
		}
		let data = gadModel.getChangeGadItemData(gadBagDatas);
		this.listData.replaceAll(data);
	}
	private onClickSort() {
		this.isUPSort = !this.isUPSort;
		if (this.isUPSort) {
			this.m_SortImg.source = "rect_btn_39_28_png";
			this.m_SortLab.text = GlobalConfig.jifengTiaoyueLg.st100331;
		} else {
			this.m_SortImg.source = "rect_btn_39_28_02_png";
			this.m_SortLab.text = GlobalConfig.jifengTiaoyueLg.st100332;
		}
		this.setGadBagData();
	}
	private onClickTog(e: egret.TouchEvent) {
		for (var i = 0; i < this.m_TogGroup.numChildren; i++) {
			let child = this.m_TogGroup.getChildAt(i);
			if (child && child instanceof eui.ToggleButton) {
				if (child.selected == true) {
					child.touchEnabled = true;
					child.selected = false
				}
			}
		}
		let btn: eui.ToggleButton = e.currentTarget;
		btn.touchEnabled = false;
		btn.selected = true;
		this.setGadBagData();
	}
	/**关联排序 */
	private sorUpLevel(item1: { level: number }, item2: { level: number }): number {
		return item1.level - item2.level;
	}
	/**关联排序 */
	private sorDownLevel(item1: { level: number }, item2: { level: number }): number {
		return item2.level - item1.level;
	}

	/**关联排序 */
	private sorUpStar(item1: { star: number }, item2: { star: number }): number {
		return item1.star - item2.star;
	}
	/**关联排序 */
	private sorDownStar(item1: { star: number }, item2: { star: number }): number {
		return item2.star - item1.star;
	}

	/**关联排序 */
	private sorUpSlot(item1: { slot: number }, item2: { slot: number }): number {
		return item1.slot - item2.slot;
	}
	/**关联排序 */
	private sorDownSlot(item1: { slot: number }, item2: { slot: number }): number {
		return item2.slot - item1.slot;
	}

	OnBackClick(clickType: number): number {
		return 0
	}

	OnOpenIndex(openIndex: number): boolean {
		return true
	}

	windowTitleIconName: string = GlobalConfig.jifengTiaoyueLg.st101240;

	UpdateContent(): void { }
}

ViewManager.ins().reg(BagWin, LayerManager.UI_Main);
window["BagWin"] = BagWin