class ZhuZaiFenjiePanel extends BaseView implements ICommonWindowTitle {
	public constructor() {
		super()
		this.skinName = "ZhuzaiEquipDecomSkin";
		this.windowTitleIconName = GlobalConfig.jifengTiaoyueLg.st100207;
	}
	list
	useTxt0
	countTxt
	btn:eui.Button
	private languageTxt:eui.Label;

	childrenCreated() {

		this.list.dataProvider = new eui.ArrayCollection([])
		this.useTxt0.text = ""
		this.countTxt.text = ""
		this.btn.label = GlobalConfig.jifengTiaoyueLg.st100209;
		this.languageTxt.text = GlobalConfig.jifengTiaoyueLg.st100236;
	}

	open  () { 
		this.startSetBagData(), 
		this.btn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTap, this),

		GameGlobal.MessageCenter.addListener(MessageDef.ITEM_COUNT_CHANGE, this.startSetBagData, this)
	}
	
	close () {
		this.btn.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onTap, this)
		GameGlobal.MessageCenter.removeListener(MessageDef.ITEM_COUNT_CHANGE, this.startSetBagData, this)
	}

	startSetBagData  () {
		TimerManager.ins().doTimer(100, 1, this.setBagData, this)
	}

	setBagData  () {
		// var item, list = [],
			let config = GlobalConfig.ins("EquipPointResolveConfig")
			let count = 0;
		// for (var key in config) {
		// 	item = UserBag.ins().getBagGoodsById(UserBag.BAG_TYPE_OTHTER, config[key].itemId)
		// 	item && (list.push(item), count += item.count * config[key].materials[0].count)
		// }

		let datas = []
		let getList = ZhuzaiEquip.ins().GetFengjieList()
		for (let key in getList) {
			let itemId = parseInt(key)
			let getCount = getList[itemId]
			if (getCount > 0) {
				let configData = config[itemId]
				count += getCount * configData.materials[0].count
				datas.push(RewardData.ToRewardData({type:1, id:itemId, count:getCount}))
			}
		}
		let nameId 
		for (let key in config) {
			nameId = config[key].materials[0].id
		}
		this.countTxt.text = GlobalConfig.jifengTiaoyueLg.st100235 + GlobalConfig.itemConfig[nameId].name + "："
		this.useTxt0.text = count + ""
		this.list.dataProvider = new eui.ArrayCollection(datas)
	}

	onTap () {
		ZhuzaiEquip.ins().sendFenjie()
	}

	windowTitleIconName: string = "";

	UpdateContent(): void {

	}
}
window["ZhuZaiFenjiePanel"]=ZhuZaiFenjiePanel