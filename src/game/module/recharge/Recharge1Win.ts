class Recharge1Win extends BaseEuiPanel implements ICommonWindow, ICommonWindowTitle {
	static LAYER_LEVEL = LayerManager.UI_Main
	public constructor() {
		super()
	}
	private commonWindowBg: CommonWindowBg = null;
	private tabBar: eui.TabBar = null;
	private chargeBtn: eui.Button = null;
	private awardsBtn: eui.Button = null;
	private chargeNum: eui.Label = null;
	private rewardList: eui.List = null;
	windowTitleIconName: string = GlobalConfig.jifengTiaoyueLg.st100049;

	private reimg = [
		"100",
		"500",
		"1000",
	]

	_data
	_index

	UpdateContent(): void { }

	initUI() {
		this.skinName = "FirstChargeSkin";
		this.rewardList.itemRenderer = ItemBase
		this.awardsBtn.label = GlobalConfig.jifengTiaoyueLg.st100004;
		this.chargeBtn.label = GlobalConfig.jifengTiaoyueLg.st100052;
	}

	open() {
		for (var f = 0; f < 3; f++) {
			let con = this.getConfig(f);
			if (con) {
				this.reimg[f] = con.pay;
			}
		}
		this.tabBar.validateNow()
		let num = this.tabBar.numChildren;
		for (var f = 0; f < num; f++) {
			let child: any = this.tabBar.getChildAt(f);
			if (child) {
				child.data.label = this.reimg[f] + GlobalConfig.jifengTiaoyueLg.st100050;
			}
		}
		this.commonWindowBg.OnAdded(this)
		this.chargeBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouch, this)
		this.awardsBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouch, this)
		this.tabBar.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTabTouch, this)
		GameGlobal.MessageCenter.addListener(MessageDef.UPDATE_RECHARGE, this.setWinData, this);
		var i;
		this._data = GameGlobal.rechargeData[0];
		for (var n = 0; 2 > n; n++)
			if (i = this._data.num >= this.getConfig(0).pay && !this.getRemindByIndex(0))
				return this.tabBar.selectedIndex = this._index = n, void this.setWinData();
		this.tabBar.selectedIndex = this._index = 1, this.setWinData()

	}

	close() {
		this.commonWindowBg.OnRemoved()
		this.chargeBtn.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouch, this)
		this.awardsBtn.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouch, this)
		this.tabBar.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onTabTouch, this)
		GameGlobal.MessageCenter.removeListener(MessageDef.UPDATE_RECHARGE, this.setWinData, this)
	}

	closeCB(e) {
		ViewManager.ins().close(this)
	}

	onTouch(e) {
		switch (e.currentTarget) {
			case this.chargeBtn:
				ViewManager.ins().open(ChargeFirstWin);
				break;
			case this.awardsBtn:
				for (var t = this.getConfig(this._index), i = 0, r = 0; r < t.awardList.length; r++) 1 == t.awardList[r].type && t.awardList[r].id < 2e5 && i++;
				if (i > UserBag.ins().getSurplusCount()) return void UserTips.ins().showTips(GlobalConfig.jifengTiaoyueLg.st100051);
				Recharge.ins().sendGetAwards(0, this._index)
		}
	}

	onTabTouch(e) {
		e.currentTarget.selectedIndex != this._index && (this._index = e.currentTarget.selectedIndex, this.setWinData())
	}

	setEff(e) {
		this.rewardList.validateNow()
		for (let i = 0; i < this.rewardList.numChildren; ++i) {
			let item = this.rewardList.getChildAt(i) as ItemBase
			if (item) {
				item.showItemEffect()
			}
		}
	}

	setWinData() {
		this.chargeNum.text = this.reimg[this._index]
		this._data = GameGlobal.rechargeData[0];
		var isRemind = this.getRemindByIndex(this._index),
			t = this._index + 1;
		var config = this.getConfig(this._index)
		if (!config) {
			return
		}
		let job = GameGlobal.rolesModel[0].job;
		this.rewardList.dataProvider = new eui.ArrayCollection(config.awardList)
		this.chargeBtn.visible = this._data.num < config.pay
		this.awardsBtn.visible = this._data.num >= config.pay && !isRemind
		UIHelper.SetBtnNormalEffe(this.awardsBtn, this.awardsBtn.visible);
		this.setEff(this._index)
		this.redPoint()
	}

	getConfig(index: number) {

		return Recharge.ins().GetConfig()[index]
	}

	getRemindByIndex(e) {
		return BitUtil.Has(GameGlobal.rechargeData[0].isAwards, e)
	}

	redPoint() {
		for (let i = 0; i < this.tabBar.numChildren; ++i) {
			let child = this.tabBar.getChildAt(i)
			let config = this.getConfig(i)
			let pay = config ? config.pay : 9999999
			UIHelper.ShowRedPoint(child as eui.Component, this._data.num >= pay && !this.getRemindByIndex(i))
		}
	}
}
window["Recharge1Win"] = Recharge1Win