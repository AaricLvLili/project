class RechargeBaseWin extends BaseEuiPanel implements ICommonWindow {

	public constructor() {
		super()
	}

	public list: eui.List
	public awardsBtn: eui.Button
	public chongZhi1Config: any;
	public returnBtn: eui.Button;

	initUI() {
		this.setSkinName()
		this.list.itemRenderer = ItemBase
	}

	public GetLayerLevel() {
		return LayerManager.UI_Main
	}

	setSkinName() {
		this.skinName = "FirstChargeSkin"
	}

	protected GetRewardData() {
		return GameGlobal.rechargeData[0]
	}

	protected GetRewardDataIndex() {
		return 0
	}

	protected GetRewardIndex() {
		return 0
	}

	open() {
		this.awardsBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouch, this);
		this.returnBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouch, this);
		GameGlobal.MessageCenter.addListener(MessageDef.UPDATE_RECHARGE, this.setWinData, this);

	}

	resetCommonReBtn() {
	}

	close() {
		this.awardsBtn.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouch, this)
		this.returnBtn.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouch, this);
		GameGlobal.MessageCenter.removeListener(MessageDef.UPDATE_RECHARGE, this.setWinData, this)
	}


	onTouch(e) {
		switch (e.currentTarget) {
			case this.awardsBtn:
				for (var t = this.getConfig(this.GetRewardIndex()), i = 0, r = 0; r < t.awardList.length; r++) 1 == t.awardList[r].type && t.awardList[r].id < 2e5 && i++;
				if (i > UserBag.ins().getSurplusCount()) return void UserTips.ins().showTips(GlobalConfig.jifengTiaoyueLg.st100051);
				Recharge.ins().sendGetAwards(this.GetRewardDataIndex(), this.GetRewardIndex())
				break;
			case this.returnBtn:
				ViewManager.ins().close(this);
				break;
		}
	}

	setEff(e) {
		this.list.validateNow()
		for (let i = 0; i < this.list.numChildren; ++i) {
			let item = this.list.getChildAt(i) as ItemBase
			if (item) {
				item.showEffect(6)
			}
		}
	}

	setWinData() {
		let _data = this.GetRewardData()
		var isRemind = this.getRemindByIndex(this.GetRewardIndex()),
			t = this.GetRewardIndex() + 1;
		var config = this.getConfig(this.GetRewardIndex())
		if (!config) {
			return
		}
		let job = GameGlobal.rolesModel[0].job;
		this.list.dataProvider = new eui.ArrayCollection(config.awardList)
		this._SetGoBtnState(_data.num < config.pay)
		this.awardsBtn.visible = _data.num >= config.pay && !isRemind
		//UIHelper.SetBtnEffe(this.awardsBtn, "eff_btn_reward", this.awardsBtn.visible, 1, 1, 65, 20);暂时屏蔽
		this.setEff(this.GetRewardIndex())
	}

	protected _SetGoBtnState(visible: boolean) {

	}

	protected _OpenRecharge() {
		ViewManager.ins().close(this)
		ViewManager.ins().open(ChargeFirstWin);
	}

	getConfig(index: number) {
		if (this.chongZhi1Config == null)
			this.chongZhi1Config = GlobalConfig.ins("ChongZhi1Config");

		var config;
		let _data = this.GetRewardData();
		if (_data.isFirst)
			config = GameServer.serverMergeTime > 0 ? this.chongZhi1Config[99][0][index] : this.chongZhi1Config[0][0][index];
		else {
			var i = _data.day / 9 >= 1 ? 2 : 1;
			config = 1 == i ? this.chongZhi1Config[i][_data.day % 9][index] : this.chongZhi1Config[i][(_data.day - 9) % 7][index]
		}
		return config
	}

	protected getRemindByIndex(index) {
		return 1 == (this.GetRewardData().isAwards >> index & 1)
	}
}
window["RechargeBaseWin"] = RechargeBaseWin