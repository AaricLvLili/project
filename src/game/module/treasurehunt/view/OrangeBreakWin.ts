class OrangeBreakWin extends BaseEuiPanel {
	public constructor() {
		super()
		this.skinName = "OrangeBreakWinSkin";
	}
	public m_bg: CommonPopBg;
	public languageTxt: eui.Label;

	public m_List: eui.List;
	public m_TipLab: eui.Label;
	private listData: eui.ArrayCollection;
	public scroller: eui.Scroller;
	public gainList: eui.List;

	public createChildren() {
		super.createChildren();
		this.m_bg.init(`OrangeBreakWin`, GlobalConfig.jifengTiaoyueLg.st101865);
		this.m_TipLab.text = GlobalConfig.jifengTiaoyueLg.st101866;
		this.languageTxt.text = GlobalConfig.jifengTiaoyueLg.st100108;
		this.m_List.itemRenderer = OrangeBreakItem;
		this.listData = new eui.ArrayCollection();
		this.m_List.dataProvider = this.listData;

		this.gainList.itemRenderer = GainGoodsItem;

	}
	initUI() {
		super.initUI();
	}
	open(...param: any[]) {
		this.addViewEvent();
		this.setData();
	}
	close() {
		this.release();
	}
	public release() {
	}
	private addViewEvent() {
		this.AddClick(this.gainList, this.onTouchList)
		this.observe(MessageDef.EQUIP_ITEM_RESOLVE_MSG, this.setData)
	}
	private removeViewEvent() {

	}

	private setData() {
		let config = GlobalConfig.ins("LegendRecycleConfig");
		let dataIdList = [];
		let i = 0;
		for (let key in config) {
			let num = 1;
			let listData = this.listData.source[i];
			if (listData) {
				num = listData["smeltSelectNum"];
			}
			let data: { id: number, smeltSelectNum: number } = { id: config[key].id, smeltSelectNum: num };
			dataIdList.push(data);
			i++;
		}
		this.listData.replaceAll(dataIdList);
		this.setListData();
	}

	onTouchList(e) {
		var item = e.target;
		if (!item) {
			return
		}
		item = item.userData
		if (item) {
			if (item[1][0]) {
				if (GameGuider.guidance(item[1][0], item[1][1])) {
					//ViewManager.ins().closePartPanel()//先注释掉，有关掉当前界面的BUG
					ViewManager.ins().close(this);
				} else {
					// UserTips.ins().showTips("不在开放时间内！！！")
				}
			}
		}
	};

	private setListData() {
		let id = 200007;
		let gainConfig = GlobalConfig.ins("GainItemConfig")[id];
		if (gainConfig != null) {
			let config = gainConfig.gainWay.slice(0, gainConfig.gainWay.length)
			for (let i = 0; i < config.length; ++i) {
				let data = config[i]
				if (data[1][0] == ViewIndexDef.ACT_GIFT) {
					let activityData = ActivityModel.ins().GetActivityDataByType(2)
					if (!ActivityModel.ins().IsOpen(activityData)) {
						config.splice(i, 1)
					}
					if (id == ViewIndexDef.EGG_BROKEN_PANEL && !EggBroken.IsOpen()) {// 判断砸金蛋活动是否关闭
						config.splice(i, 1)
					}
				}
			}
			this.gainList.dataProvider = new eui.ArrayCollection(config);
		} else {
			this.gainList.dataProvider = new eui.ArrayCollection([]);
		}

		// this.currentState = shopConfig ? "shop" : "getway"
		this.validateNow();
	}


}
ViewManager.ins().reg(OrangeBreakWin, LayerManager.UI_Popup);
window["OrangeBreakWin"] = OrangeBreakWin