class Activity2Panel1 extends eui.Component {

	isInit = !1

	public constructor() {
		super()
		this.skinName = "LimitGiftActSkin"
	}

	activityID: number
	public desc: eui.Label;
	public date: eui.Label;
	public list: eui.List;

	public childrenCreated() {
		this.list.itemRenderer = Activity2Item
	}

	open() {
		this.updateData()
		let config = GameGlobal.activityData[this.activityID];
		this.date.text = GlobalConfig.jifengTiaoyueLg.st100025 + config.getRemindTimeString()

		if (GlobalConfig.ins("ActivityAConfig")[this.activityID])
			this.desc.text = GlobalConfig.ins("ActivityAConfig")[this.activityID].desc;
		else
			this.desc.text = GlobalConfig.ins("ActivityConfig")[this.activityID].desc;
		MessageCenter.ins().addListener(MessageDef.UPDATE_ACTIVITY2_MSG, this.updateData, this);
	}

	close() {
		MessageCenter.ins().removeListener(MessageDef.UPDATE_ACTIVITY2_MSG, this.updateData, this);
	}

	updateData() {

		var activityData: ActivityType2Data = <ActivityType2Data>GameGlobal.activityData[this.activityID]
		var config = activityData.GetConfigData()
		let datas = []
		for (var i = 0; i < config.length; i++) {
			var configData = config[i]
			datas.push({
				configData: configData,
				activityID: this.activityID,
				isLast: i == (config.length - 1),
			})
		}
		datas.sort((lhs, rhs) => {
			let lhsSurplusCount = activityData.buyData[lhs.configData.index - 1] || 0
			let rhsSurplusCount = activityData.buyData[rhs.configData.index - 1] || 0
			if (lhsSurplusCount == 0 && rhsSurplusCount == 0) {
				return -1
			}
			if (lhsSurplusCount == 0) {
				return 1
			}
			if (rhsSurplusCount == 0) {
				return -1
			}
			return lhs.configData.index - rhs.configData.index
		})

		this.list.dataProvider = new eui.ArrayCollection(datas)
	}
}

class Activity2Item extends eui.ItemRenderer {

	buy: eui.Button
	item: ItemBase
	title
	price: PriceIcon
	y_price: PriceIcon
	desc
	redPoint: eui.Image
	bg: eui.Image
	imgDiscount: eui.BitmapLabel
	imgDiscountBg: eui.Image
	gcx
	public m_Lan1: eui.Label;
	public m_Lan2: eui.Label;
	public itemName: eui.Label;

	childrenCreated() {
		this.buy.addEventListener(egret.TouchEvent.TOUCH_TAP, this._OnClick, this)
		this.buy.label = GlobalConfig.jifengTiaoyueLg.st101282;
		this.m_Lan1.text = GlobalConfig.jifengTiaoyueLg.st101336;
		this.m_Lan2.text = GlobalConfig.jifengTiaoyueLg.st101337;
	}

	private _OnClick() {
		let configData = this.data.configData
		let activityID = this.data.activityID

		let index = configData.index - 1

		var activityData: ActivityType2Data = <ActivityType2Data>GameGlobal.activityData[activityID];
		try {
			let val = (activityData.buyData[index] || 0, 1 == configData.currencyType ? GameGlobal.actorModel.gold : GameGlobal.actorModel.yb)
			1 == configData.currencyType ? GameGlobal.actorModel.gold : GameGlobal.actorModel.yb
			let curStr = 1 == configData.currencyType ? GlobalConfig.jifengTiaoyueLg.st100018 : GlobalConfig.jifengTiaoyueLg.st100050;
			if (0 == UserBag.ins().getSurplusCount()) {
				UserTips.ins().showTips(GlobalConfig.jifengTiaoyueLg.st101329)
			} else {
				if (configData.vip && GameGlobal.actorModel.vipLv < configData.vip) {
					UserTips.ins().showTips(GlobalConfig.jifengTiaoyueLg.st101330)
				} else {
					if (parseInt(val + "") >= configData.price) {
						WarnWin.show(LanguageString.jifengTiaoyueCh(GlobalConfig.jifengTiaoyueLg.st101331, [configData.price + curStr]), () => {
							ActivityModel.ins().sendReward(activityID, index + 1)
						}, this)
					} else {
						UserTips.ins().showTips(curStr + GlobalConfig.jifengTiaoyueLg.st101332)
					}
				}
			}
		} catch (e) {
			egret.log("限购按钮错误"), egret.log(e)
		}
	}

	dataChanged() {
		let configData = this.data.configData
		let activityID = this.data.activityID
		let index = configData.index - 1

		var activityData: ActivityType2Data = <ActivityType2Data>GameGlobal.activityData[activityID]
		let surplusCount = activityData.buyData[index] || 0
		this.item.data = configData.rewards[0]
		this.price.labelColor = "0xD6B344"
		this.y_price.labelColor = "0xADADAD"
		this.item.showLegendEffe()
		this.title.text = configData.vip ? LanguageString.jifengTiaoyueCh(GlobalConfig.jifengTiaoyueLg.st101333, [configData.vip]) : ""
		this.price.price = configData.price, this.price.type = 1 == configData.currencyType ? MoneyConst.gold : MoneyConst.yuanbao
		let discount = configData.discount.replace("discount_", "")
		let zk
		if (discount[1] == null) {
			zk = discount[0]
		} else {
			if (discount[0] == 0) {
				zk = "0.0" + discount[1];
			} else {
				zk = "0." + discount[0] + discount[1];
			}
		}

		this.y_price.price = Math.round(configData.price / parseFloat(zk)), this.y_price.type = 1 == configData.currencyType ? MoneyConst.gold : MoneyConst.yuanbao

		this.desc.text = GlobalConfig.jifengTiaoyueLg.st101335 + (surplusCount)
		this.buy.enabled = surplusCount > 0
		// this.redPoint.visible = GameGlobal.activityModel.IsRedpointType2Item(activityData.type, activityID, index)
		this.redPoint.visible = activityData.IsRedpointType2Item(index)
		// 这个背景不要
		//this.bg.visible = this.data.isLast


		try {
			let discount = configData.discount.replace("discount_", "")
			if (discount[1] == "0") {
				this.imgDiscount.text = discount[0] + GlobalConfig.jifengTiaoyueLg.st102090;
				// this.imgDiscount.scaleX = this.imgDiscount.scaleY = 1
			} else {
				this.imgDiscount.text = discount[0] + "." + discount[1] + GlobalConfig.jifengTiaoyueLg.st102090;
				// this.imgDiscount.scaleX = this.imgDiscount.scaleY = 0.8
			}
			this.imgDiscountBg.visible = true
			this.imgDiscount.visible = true
		} catch (e) {
			this.imgDiscountBg.visible = false
			this.imgDiscount.visible = false
			console.log(e)
		}
		// this.imgDiscount.source = configData.discount
		this.item.isShowName(false);
		this.itemName.text = this.item.nameTxt.text;
	}
}
window["Activity2Panel1"] = Activity2Panel1
window["Activity2Item"] = Activity2Item