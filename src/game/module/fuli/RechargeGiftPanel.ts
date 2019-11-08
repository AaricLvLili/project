
class RechargeGiftPanel extends eui.Component {
	public constructor() {
		super()

		this.skinName = "AchieveSkin"
		this.listTop.itemRenderer = RechargeGiftPanelItem
	}
	public m_ItemList1: eui.List;
	public m_ItemList2: eui.List;
	public m_Lan1: eui.Label;
	listTop
	public createChildren() {
		super.createChildren();
		this.m_Lan1.text = GlobalConfig.jifengTiaoyueLg.st101993;
		let config = GlobalConfig.ins("RechargeGiftPoolConfig");
		let data1 = [];
		let data2 = [];
		for (var i = 1; i < 6; i++) {
			data1.push(config[i].id);
		}
		for (var i = 6; i < 10; i++) {
			data2.push(config[i].id);
		}
		this.m_ItemList1.dataProvider = new eui.ArrayCollection(data1);
		this.m_ItemList2.dataProvider = new eui.ArrayCollection(data2);
	}
	updateData() {

	}
	open(e) {
		this.updateView()
		GameGlobal.MessageCenter.addListener(MessageDef.MONEY_RECHARGE_GIFT_CHANGE, this.updateView, this)
	}

	close() {
		GameGlobal.MessageCenter.removeListener(MessageDef.MONEY_RECHARGE_GIFT_CHANGE, this.updateView, this)
	}

	onChange() {
		this.updateTopList()
	}

	updateView() {
		this.updateTopList()
	}

	updateTopList() {
		let configData = GlobalConfig.ins("RechargeGiftConfig")
		let datas = []
		for (let key in configData) {
			datas.push(configData[key])
		}
		let model = MoneyTreeModel.ins()
		let sortIndex = function (type: RewardState) {
			if (type == RewardState.CanGet) {
				return 0
			}
			if (type == RewardState.Gotten) {
				return 3
			}
			if (type == RewardState.NotReached) {
				return 1
			}
			if (type == RewardState.Undo) {
				return 2
			}
			return 3
		}
		datas.sort((lhs, rhs) => {
			let lhsState = sortIndex(model.GetRechargeGiftState(lhs.index))
			let rhsState = sortIndex(model.GetRechargeGiftState(rhs.index))
			if (lhsState == rhsState) {
				return lhs.index - rhs.index
			}
			return lhsState - rhsState
		})
		/*
		//重新做排序
		let datas = []
		for (let key in configData) {
			let index = configData[key]["index"];
			let state = activityData.GetRewardState(index)
			let weight = 3;
			if (state == RewardState.NotReached)
				weight = 1;
			else if (state == RewardState.CanGet)
				weight = 0;
			else if (state == RewardState.Gotten)
				weight = 3;
			else if (state == RewardState.Undo)
				weight = 2;
			
			config[key]["sortweight"] = weight
		 	datas.push(config[key])
		}
		datas.sort((lhs, rhs) => {
		 	return lhs.sortweight - rhs.sortweight
		 })
		 */
		this.listTop.dataProvider = new eui.ArrayCollection(datas)
	}
}

class RechargeGiftPanelItem extends eui.ItemRenderer {
	public constructor() {
		super()
		this._SetSkin()
	}
	public labelInfo: eui.Label;
	public btnGet: eui.Button;
	public labelGet: eui.Image;
	public labelGo: eui.Label;
	public labelUndo: eui.Label;
	public list: eui.List;

	protected _SetSkin() {
		this.skinName = "AchieveItemSkin"
		this.labelUndo.text = GlobalConfig.jifengTiaoyueLg.st100680;
		this.btnGet.label = GlobalConfig.jifengTiaoyueLg.st101076;
		this.labelGo.text = GlobalConfig.jifengTiaoyueLg.st101077;
	}

	public childrenCreated() {
		this.labelGo.name = "go"
		// this.labelGo.textFlow = TextFlowMaker.generateTextFlow1("|U:&T:前往完成|")
		UIHelper.SetLinkStyleLabel(this.labelGo)
		this.btnGet.name = "get"

		this.list.itemRenderer = ItemBaseEffe

		this.labelGo.addEventListener(egret.TouchEvent.TOUCH_TAP, this.OnClick, this)
		this.btnGet.addEventListener(egret.TouchEvent.TOUCH_TAP, this.OnClick, this)
	}

	price: PriceIcon

	protected m_Award = []

	private OnClick(e: egret.TouchEvent) {
		switch (e.currentTarget) {
			case this.labelGo:
				this.OnClickClose()
				ViewManager.ins().open(ChargeFirstWin)
				break

			case this.btnGet:
				let count = 0
				for (let item of this.m_Award) {
					if (item.type == 2) {
						count += item.count
					}
				}
				if (UserBag.ins().getSurplusCount() < count) {
					var t = GlobalConfig.jifengTiaoyueLg.st101072;
					UserTips.ins().showTips(t);
					break
				}
				// var i = e.target.parent.data;
				// MoneyTreeModel.ins().GetRechargeGift(i.index)
				this.OnGetAward(e)
				break
		}
	}

	protected OnClickClose() {
		ViewManager.ins().close(FuliWin)
	}

	protected OnGetAward(e) {
		var i = e.target.parent.data;
		MoneyTreeModel.ins().GetRechargeGift(i.index)
	}

	dataChanged() {
		var data = this.data
		if (!ErrorLog.Assert(data, "AchievementTaskConfig no such id:" + data.index)) {
			var n = data.desc
			this.labelInfo.textFlow = TextFlowMaker.generateTextFlow1(n)
			let array = null
			if (!data || !data.awardList) {
				array = []
			} else {
				array = data.awardList
			}
			this.m_Award = array
			this.list.dataProvider = new eui.ArrayCollection(array)
			// data && data.awardList && data.awardList[0] && (this.reward.data = data.awardList[0])
			// this.reward.showItemEffect()
			this.currentState = "" + MoneyTreeModel.ins().GetRechargeGiftState(data.index)
		}
	}
}
window["RechargeGiftPanel"] = RechargeGiftPanel
window["RechargeGiftPanelItem"] = RechargeGiftPanelItem