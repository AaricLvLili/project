class WarOrderShowItem extends eui.Component {
	public constructor() {
		super();
		this.skinName = "WarOrderShowItemSkin";
	}
	public m_Lan1: eui.Label;
	public m_Lan2: eui.Label;
	public m_Lan3: eui.Label;
	public m_List3: eui.List;
	public m_MaskGroup: eui.Group;
	public m_Lan4: eui.Label;
	public m_LvLab: eui.Label;
	public m_List1: eui.List;
	public m_List2: eui.List;

	public m_Scroller: eui.Scroller;


	private listData1: eui.ArrayCollection;
	private listData2: eui.ArrayCollection;
	private listData3: eui.ArrayCollection;

	public createChildren() {
		super.createChildren();
		this.m_Lan1.text = GlobalConfig.jifengTiaoyueLg.st100333;
		this.m_Lan2.text = GlobalConfig.jifengTiaoyueLg.st101386;
		this.m_Lan3.text = GlobalConfig.jifengTiaoyueLg.st102075;
		this.m_Lan4.text = GlobalConfig.jifengTiaoyueLg.st100431;

		this.listData1 = new eui.ArrayCollection();
		this.listData2 = new eui.ArrayCollection();
		this.listData3 = new eui.ArrayCollection();

		this.m_List1.itemRenderer = ItemBase;
		this.m_List2.itemRenderer = ItemBase;
		this.m_List3.itemRenderer = WarOrderItem;

		this.m_List1.dataProvider = this.listData1;
		this.m_List2.dataProvider = this.listData2;
		this.m_List3.dataProvider = this.listData3;
		this.addEvent();
	}

	public addEvent() {
		this.m_MaskGroup.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onClickJinJie, this);
		MessageCenter.ins().addListener(WarOrderEvt.WARORDEREVT_DATAUPDATE_MSG, this.setData, this)
		MessageCenter.ins().addListener(WarOrderEvt.WARORDEREVT_CHANGESHOWLIST_MSG, this.setPreviewLv, this)
		// this.m_Scroller.addEventListener(egret.Event.CHANGE, this.setPreviewLv, this);
	}


	private onClickJinJie() {
		ViewManager.ins().open(WarOrderJinJieWin);
	}

	public setData() {
		let warOrderModel = WarOrderModel.getInstance;
		let config = GlobalConfig.ins("TokenConfig")[warOrderModel.mainId];
		if (config) {
			let lvList = []
			for (var i = 0; i < config.length; i++) {
				lvList.push(config[i].level);
			}
			this.listData3.replaceAll(lvList);
		}
		if (warOrderModel.isUpWarOrder) {
			this.m_MaskGroup.visible = false;
		} else {
			this.m_MaskGroup.visible = true;
		}
		if (WarOrderPanel.isFirstOpen) {
			WarOrderPanel.isFirstOpen = false;
			this.m_Scroller.viewport.scrollV = warOrderModel.listPoint;
		}
		this.setPreviewLv();
	}
	private previewLv: number = 0;
	private setPreviewLv() {
		let warOrderModel = WarOrderModel.getInstance;
		let num = this.m_List3.numChildren;
		let hight = 0;
		if (this.m_Scroller.viewport) {
			hight = this.m_Scroller.viewport.scrollV;
		}
		let nowLv = Math.ceil((hight + warOrderModel.scrHight) / warOrderModel.oneItemHight)
		if (nowLv > warOrderModel.maxLv) {
			nowLv = warOrderModel.maxLv;
		} else
			if (nowLv <= 0) {
				nowLv = 1;
			}
		let previewLv = Math.ceil(nowLv / 10)
		if (this.previewLv != previewLv) {
			this.previewLv = previewLv;
			if (previewLv) {
				this.m_LvLab.text = "(" + (previewLv * 10) + ")";
			}

			let config = GlobalConfig.ins("TokenConfig")[warOrderModel.mainId];
			if (config) {
				let tokenConfig = config[previewLv * 10 - 1];
				if (tokenConfig) {
					let data1 = []
					for (var i = 0; i < tokenConfig.baseAward.length; i++) {
						let needData = { type: tokenConfig.baseAward[i].type, id: tokenConfig.baseAward[i].id, count: tokenConfig.baseAward[i].count, isShowName: 2 };
						data1.push(needData);
					}
					this.listData1.removeAll();
					this.listData1.replaceAll(data1);
					let data2 = []
					for (var i = 0; i < tokenConfig.baseAward.length; i++) {
						let needData = { type: tokenConfig.advancedAward[i].type, id: tokenConfig.advancedAward[i].id, count: tokenConfig.advancedAward[i].count, isShowName: 2 };
						data2.push(needData);
					}
					this.listData2.removeAll();
					this.listData2.replaceAll(data2);
				}
			}
		}

	}

}
window["WarOrderShowItem"] = WarOrderShowItem