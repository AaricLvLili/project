class WarOrderItem extends eui.ItemRenderer {
	public constructor() {
		super();
		this.skinName = "WarOrderItemSkin";
	}
	public m_LvLab: eui.Label;
	public m_List1: eui.List;
	public m_List2: eui.List;
	private listData1: eui.ArrayCollection;
	private listData2: eui.ArrayCollection;
	public createChildren() {
		super.createChildren()
		this.m_List1.itemRenderer = WarOrderIconItem;
		this.m_List2.itemRenderer = WarOrderIconItem;
		this.listData1 = new eui.ArrayCollection();
		this.listData2 = new eui.ArrayCollection();
		this.m_List1.dataProvider = this.listData1;
		this.m_List2.dataProvider = this.listData2;

		this.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onClick, this);
	}



	public dataChanged() {
		super.dataChanged();
		let warOrderModel = WarOrderModel.getInstance;
		let lv = this.data;
		this.m_LvLab.text = lv + "";
		let listData1 = [];
		let config = GlobalConfig.ins("TokenConfig")[warOrderModel.mainId];
		if (config) {
			let baseAward = config[lv - 1].baseAward
			for (var i = 0; i < baseAward.length; i++) {
				let baseAwardItem = { type: baseAward[i].type, id: baseAward[i].id, count: baseAward[i].count, isShowName: 2 }
				let data1 = { lv: lv, type: 1, item: baseAwardItem };
				listData1.push(data1);
			}
			this.listData1.replaceAll(listData1);
			let listData2 = [];
			let advancedAward = config[lv - 1].advancedAward
			for (var i = 0; i < advancedAward.length; i++) {
				let advancedAwardItem = { type: advancedAward[i].type, id: advancedAward[i].id, count: advancedAward[i].count, isShowName: 2 }
				let data2 = { lv: lv, type: 2, item: advancedAwardItem };
				listData2.push(data2);
			}
			this.listData2.replaceAll(listData2);
		}
		MessageCenter.ins().dispatch(WarOrderEvt.WARORDEREVT_CHANGESHOWLIST_MSG);
	}

	private onClick() {
		let isCan = WarOrderModel.getInstance.checkCanGetByLv(this.data)
		if (isCan) {
			WarOrderSproto.ins().sendGetAllAward();
		}
	}
}
window["WarOrderItem"] = WarOrderItem