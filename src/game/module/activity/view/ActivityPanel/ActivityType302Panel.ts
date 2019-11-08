class ActivityType302Panel extends ActivityPanel implements ICommonWindowTitle {

	public closeBtn: eui.Button;
	public iconList: eui.List;
	public btnBuy: eui.Button;
	public tabTop: eui.TabBar;
	public tabMiddle: eui.TabBar;
	public txtTitle: eui.Label;

	private listMiddleData: eui.ArrayCollection
	private listTopData: eui.ArrayCollection
	private rewardListData: eui.ArrayCollection
	private _curDay: number
	private _curPos: number
	private _curCfg: any
	private _data: ActivityType302Data

	public constructor() {
		super()

	}
	public createChildren() {
		super.createChildren();
		this.skinName = `ActivityType302Skin`
		this.listMiddleData = new eui.ArrayCollection()
		this.rewardListData = new eui.ArrayCollection()
		this.listTopData = new eui.ArrayCollection()
		this.tabMiddle.dataProvider = this.listMiddleData
		this.tabTop.dataProvider = this.listTopData
		this.iconList.dataProvider = this.rewardListData
		this.iconList.itemRenderer = ItemBase
		this.btnBuy.label = GlobalConfig.jifengTiaoyueLg.st101344;
	}


	open() {
		super.open()
		if (this._data == null)
			this._data = GameGlobal.activityData[ActivityModel.TYPE_302] as ActivityType302Data
		let list: number[] = this.getListTopData(this._data.openDay)
		// for (let i in GlobalConfig.activityType302Config) {
		// 	let item = GlobalConfig.activityType302Config[i]
		// 	for (let k in item) {
		// 		if (item[k]["day"]) {
		// 			list.push(item[k]["day"])
		// 			break;
		// 		}
		// 	}
		// }
		this._curDay = list[0]

		this._curPos = 1

		this.listTopData.replaceAll(list)
		let data: any[] = GlobalConfig.activityType302Config[this._curDay - 1]
		let newData: any[] = [];
		for (var i = 0; i < data.length; i++) {
			let list = { price: data[i].price + GlobalConfig.jifengTiaoyueLg.st101343 }
			newData.push(list);
		}
		this.listMiddleData.replaceAll(newData)
		// egret.setTimeout(function () {
		for (var i = 0; i < this.tabMiddle.numChildren; i++) {
			let child: any = this.tabMiddle.getChildAt(i)
			if (child && child.m_Lan1) {
				child.m_Lan1.text = GlobalConfig.jifengTiaoyueLg.st101343;
			}
		}
		// }, this, 100);

		this.tabTop.selectedIndex = list[0] - 1
		this.tabMiddle.selectedIndex = 0
		this.tabTop.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouch, this)
		this.tabMiddle.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouch, this)
		this.btnBuy.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouch, this)
		this.closeBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouch, this)
		this.observe(MessageDef.UPDATE_ACTIVITY_PANEL, this._dayUpdate)
		this.UpdateContent()

	}
	private _dayUpdate(): void {
		this.listTopData.replaceAll(this.getListTopData(this._data.openDay))
		this.UpdateContent()
	}

	close() {
		super.close()
		this._curDay = -1
		this._curPos = -1
		this._data = null
		this.tabTop.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouch, this)
		this.tabMiddle.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouch, this)
		this.btnBuy.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouch, this)
		this.closeBtn.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouch, this)
		ViewManager.ins().close(this)
	}
	private onTouch(e: egret.TouchEvent): void {
		switch (e.currentTarget) {
			case this.tabTop:

				let selectedIndex = e.currentTarget.selectedIndex
				if (selectedIndex + 1 > this._data.openDay) {
					this.tabTop.selectedIndex = this._curDay - 1
					UserTips.ins().showTips(GlobalConfig.jifengTiaoyueLg.st101341);
					return
				}
				if (selectedIndex == this._curDay - 1)
					return
				this._curDay = selectedIndex + 1
				this._curPos = 1
				this.tabMiddle.selectedIndex = 0
				this.UpdateContent()

				break;
			case this.tabMiddle:
				e.currentTarget.selectedIndex != this._curPos - 1 && (this._curPos = e.currentTarget.selectedIndex + 1, this.UpdateContent())
				break;
			case this.btnBuy:
				// Recharge.ins().TestReCharge(this._curCfg.goodsID)
				Recharge.ins().TestDayOne(this._curCfg)
				break;
			case this.closeBtn:
				this.close()
				break;
		}

	}

	private config: any;
	public UpdateContent() {
		if (this.config == null)
			this.config = GlobalConfig.activityType302Config;
		let curIdx = (this._curDay - 1) * 3 + this._curPos
		for (let i in this.config[this._curDay - 1]) {
			let item = this.config[this._curDay - 1][i]
			if (item.index == curIdx) {
				this._curCfg = item
				break;
			}
		}
		if (this._curCfg == null) return

		let isGet = BitUtil.Has(this._data.records, curIdx)
		this.btnBuy.enabled = !isGet
		this.btnBuy.label = isGet ? GlobalConfig.jifengTiaoyueLg.st101342 : `${this._curCfg.price}` + GlobalConfig.jifengTiaoyueLg.st101343
		this.txtTitle.text = this._curCfg.tips;
		this.rewardListData.source = this._curCfg.rewards;
		this.rewardListData.refresh();
		// var tempArr = [];
		// for(var key in this._curCfg.rewards){
		// 	tempArr.push(this._curCfg.rewards[key]);
		// }

		// egret.log(tempArr.toString());
		// this.rewardListData.removeAll();
		// this.rewardListData.replaceAll(tempArr)
	}
	private getListTopData(curDay: number): Array<number> {
		let list = []
		for (let i = 0; i < curDay; i++) {
			list.push(i + 1)
		}
		return list
	}
}
ViewManager.ins().reg(ActivityType302Panel, LayerManager.UI_Popup);
window["ActivityType302Panel"] = ActivityType302Panel