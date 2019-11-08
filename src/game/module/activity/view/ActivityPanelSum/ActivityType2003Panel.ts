class ActivityType2003Panel extends ActivityPanel {

	////////////////////////////////////////////////////////////////////////////////////////////////////
	// ActivityType2003Skin.exml
	////////////////////////////////////////////////////////////////////////////////////////////////////
	private timeLabel: eui.Label;
	private activityDec: eui.Label;
	private dataGroup: eui.DataGroup
	/**合服寻宝左边预览*/
	public dataGroupLeft: eui.DataGroup;
	/**合服寻宝右边预览*/
	public dataGroupRight: eui.DataGroup;
	private item1: ItemBase
	private item2: ItemBase
	private item1Name: eui.Label
	private item2Name: eui.Label
	private priceIcon1: PriceIcon
	private priceIcon2: PriceIcon
	private btn1: eui.Button
	private btn2: eui.Button
	private warehouseBtn: eui.Button
	private list: eui.List
	////////////////////////////////////////////////////////////////////////////////////////////////////


	public constructor() {
		super()
		// if (ActivityWinSummer.onPlace == ActivityModel.BTN_TYPE_04) {
		// 	this.skinName = "HfActivityType2003Skin"
		// 	this.dataGroupLeft.itemRenderer = ItemBase
		// 	this.dataGroupRight.itemRenderer = ItemBase
		// }
		// else {
		this.skinName = "HfActivityType2003Skin"
		// this.dataGroup.itemRenderer = ItemBase
		this.dataGroupLeft.itemRenderer = ItemBase
		this.dataGroupRight.itemRenderer = ItemBase
		// }

		this.list.itemRenderer = ActivityType2003Item
		this.list.dataProvider = new eui.ArrayCollection([])
	}

	public open() {
		this.btn1.addEventListener(egret.TouchEvent.TOUCH_TAP, this._OnClick, this)
		this.btn2.addEventListener(egret.TouchEvent.TOUCH_TAP, this._OnClick, this)
		this.warehouseBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this._OnClick, this)
		GameGlobal.MessageCenter.addListener(MessageDef.ACTIVITY_HUNT_INIT_RECORD, this._DoInitRecord, this)
		GameGlobal.MessageCenter.addListener(MessageDef.ACTIVITY_HUNT_ADD_RECORD, this._DoAddRecord, this)
		GameGlobal.MessageCenter.addListener(MessageDef.ITEM_COUNT_CHANGE, this._UpdateRedPoint, this)
		ActivityModel.ins().SendGetHuntRecord(4)
		this.updateData()
	}

	public close() {
		this.btn1.removeEventListener(egret.TouchEvent.TOUCH_TAP, this._OnClick, this)
		this.btn2.removeEventListener(egret.TouchEvent.TOUCH_TAP, this._OnClick, this)
		this.warehouseBtn.removeEventListener(egret.TouchEvent.TOUCH_TAP, this._OnClick, this)
	}

	private _DoInitRecord(type: number, datas: Sproto.record_data[]) {
		if (type == 4) {
			let array = (this.list.dataProvider as eui.ArrayCollection);
			array.removeAll();
			array.replaceAll(datas)
			// (this.list.dataProvider as eui.ArrayCollection).addItem(data)
		}
	}

	private _DoAddRecord(type: number, data: Sproto.record_data) {
		if (type == 4) {
			(this.list.dataProvider as eui.ArrayCollection).addItemAt(data, 0)
		}
	}

	public updateData() {
		let actData = this.GetActData<ActivityType2003Data>()
		if (!actData) {
			return
		}

		// if (ActivityWinSummer.onPlace == ActivityModel.BTN_TYPE_04) {
		// 	this.dataGroupLeft.dataProvider = new eui.ArrayCollection(this.GetNormalReward(2, 8))
		// 	this.dataGroupRight.dataProvider = new eui.ArrayCollection(this.GetNormalReward(8, 14))
		// }
		// else {
		// this.dataGroup.dataProvider = new eui.ArrayCollection(this.GetNormalReward())
		this.dataGroupLeft.dataProvider = new eui.ArrayCollection(this.GetNormalReward(2, 8))
		this.dataGroupRight.dataProvider = new eui.ArrayCollection(this.GetNormalReward(8, 14))
		// }

		this.timeLabel.text = "剩余时间：" + actData.GetSurplusTimeStr()
		this.activityDec.text = `活动说明：${ActivityModel.GetActivityConfig(this.activityID).desc}`;

		let config = actData.GetConfig()
		this.priceIcon1.price = config.huntOnce
		this.priceIcon2.price = config.huntTenth
		this.item1.data = config.rewardShow[0]
		this.item2.data = config.rewardShow[1]
		this.item1Name.text = this.item1.getItemName();
		this.item2Name.text = this.item2.getItemName();
		this.item1.showItemEffect()
		this.item2.showItemEffect()
		this.item1.isShowName(false)
		this.item2.isShowName(false)

		this._UpdateRedPoint()
	}

	private GetNormalReward(s: number = 2, e: number = 6): number[] {
		let config = this.GetActData<ActivityType2003Data>().GetConfig()
		let list = []
		for (let i = s; i < e; ++i) {
			let id = config.rewardShow[i]
			if (id) {
				list.push(id)
			}
		}
		return list
	}

	private _OnClick(e: egret.TouchEvent) {
		let config = this.GetActData<ActivityType2003Data>().GetConfig()
		switch (e.currentTarget) {
			case this.btn1:
				if (Checker.Money(MoneyConst.yuanbao, config.huntOnce)) {
					ActivityModel.ins().sendReward(this.activityID, 0)
				}
				break
			case this.btn2:
				if (Checker.Money(MoneyConst.yuanbao, config.huntTenth)) {
					ActivityModel.ins().sendReward(this.activityID, 1)
				}
				break
			case this.warehouseBtn:
				ViewManager.ins().open(TreasureStorePanel);
				break
		}
	}

	private _UpdateRedPoint() {
		UIHelper.ShowRedPoint(this.warehouseBtn, TreasureHuntWin.IsRedPointByWarehouse())
	}

	GetActivityTimeAndDes() {
		return [false]
	}
}

class ActivityType2003Item extends eui.ItemRenderer {

	////////////////////////////////////////////////////////////////////////////////////////////////////
	// ActivityType2003ItemSkin.exml
	////////////////////////////////////////////////////////////////////////////////////////////////////
	private label: eui.Label
	////////////////////////////////////////////////////////////////////////////////////////////////////

	protected childrenCreated() {

	}

	protected dataChanged() {
		var arr = this.data as Sproto.record_data
		let name = arr.name
		let id = arr.itemid
		let count = arr.count
		this.label.textFlow = HuntListRenderer.MakeTextFlow(name, id, count)
	}
}
window["ActivityType2003Panel"] = ActivityType2003Panel
window["ActivityType2003Item"] = ActivityType2003Item