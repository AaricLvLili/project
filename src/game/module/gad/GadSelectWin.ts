class GadSelectWin extends BaseEuiPanel {
	public constructor() {
		super()
		this.skinName = "GadSelectWinSkin";
	}
	public m_Scroller: eui.Scroller;
	public m_List: eui.List;
	public m_NoGad: eui.Label;


	private gadData: GadData;
	private listData: eui.ArrayCollection;

	public createChildren() {
		super.createChildren();
		this.m_List.itemRenderer = GadSelectItem;
		this.listData = new eui.ArrayCollection();
		this.m_List.dataProvider = this.listData;
		this.m_NoGad.text = GlobalConfig.jifengTiaoyueLg.st100312;
		this.m_bg.init(`GadSelectWin`, GlobalConfig.jifengTiaoyueLg.st100311);
	}
	initUI() {
		super.initUI();
	}
	open(...param: any[]) {
		this.gadData = param[0];
		this.addViewEvent();
		this.setData();
	}
	close() {
		this.release();
	}
	public release() {
		this.removeViewEvent();
	}
	private addViewEvent() {
	}
	private removeViewEvent() {
	}
	private setData() {
		let gadModel = GadModel.getInstance;
		this.m_NoGad.visible = false;
		let gadData = this.gadData;
		if (gadModel) {
			let allItemData: GadBagData[] = [];
			if (gadData.itemid > 0) {
				let itemData = new GadBagData;
				itemData.attr = gadData.attr;
				itemData.configID = gadData.itemid;
				itemData.exp = gadData.exp;
				itemData.handle = -1;
				itemData.level = gadData.level;
				allItemData.push(itemData);
			}
			let itemData: GadBagData[] = gadModel.getGadBuySlot(gadData.slot);
			for (var i = 0; i < itemData.length; i++) {
				let needGadData = itemData[i];
				let weight = 0;
				weight += needGadData.power / 10000;
				weight += needGadData.level;
				weight += needGadData.attr.length * 100;
				weight += needGadData.suit * 1000;
				weight += needGadData.star * 10000;
				needGadData.weight = weight;
				allItemData.push(itemData[i]);
			}
			allItemData.sort(this.sorUpWeight);
			this.listData.replaceAll(allItemData);
			if (allItemData.length > 0) {
				this.m_NoGad.visible = false;
			} else {
				this.m_NoGad.visible = true;
			}
		}
	}
	private onClickClose() {
		ViewManager.ins().close(this);
	}

	/**关联排序 */
	private sorUpWeight(item1: { weight: number }, item2: { weight: number }): number {
		return item2.weight - item1.weight;
	}

}
ViewManager.ins().reg(GadSelectWin, LayerManager.UI_Popup);
window["GadSelectWin"] = GadSelectWin