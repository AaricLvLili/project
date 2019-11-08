class MonthCardWin extends eui.Component {
	public constructor() {
		super()
		this.skinName = "MonthCardPanelSkin"
		this.list_yk.itemRenderer = ItemBaseEffe

		this.fsImg.text = GlobalConfig.jifengTiaoyueLg.st100028;
		this.getBtn.label = GlobalConfig.jifengTiaoyueLg.st100004;
	}

	lastTime: string
	sendBtn: eui.Button
	sendBtn2: eui.Button
	list_yk: eui.List
	sendBtn2State: eui.Label;
	getBtn: eui.Button
	stateImg: eui.Image
	fsImg: eui.Label


	open() {
		this.sendBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTap, this)
		this.sendBtn2.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTap, this)
		this.getBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTap, this)
		GameGlobal.MessageCenter.addListener(MessageDef.RECHARGE_UPDATE_MONTH_DAY, this._UpdateContent, this)
		GameGlobal.MessageCenter.addListener(MessageDef.RECHARGE_UPDATE_MONTH_REWARD, this._UpdateContent, this)
		this._UpdateContent()
	}

	private _UpdateContent(): void {
		this.sendBtn2.visible = !Recharge.ins().zunCard
		this.sendBtn2State.visible = Recharge.ins().zunCard

		this.fsImg.visible = Recharge.ins().GetMonthReward() == RewardState.NotReached

		this.getBtn.visible = Recharge.ins().GetMonthReward() == RewardState.CanGet
		//this.getBtn.enabled = Recharge.ins().GetMonthReward() == RewardState.CanGet
		this.stateImg.visible = Recharge.ins().GetMonthReward() == RewardState.Gotten
		UIHelper.SetBtnNormalEffe(this.getBtn, this.getBtn.visible);

		let monthDay = Recharge.ins().monthDay > 0
		// this.sendBtn.visible = !monthDay

		// this.sendBtnState.visible = monthDay

		if (monthDay) {
			var i = Recharge.ins().monthDay,
				n = Math.floor(i / 86400),
				s = GlobalConfig.jifengTiaoyueLg.st100025 + "<font color='#00ff00'>" + n + "</font>" + GlobalConfig.jifengTiaoyueLg.st100006;
			//this.lastTime.textFlow = (new egret.HtmlTextParser).parser(s)
			this.lastTime = GlobalConfig.jifengTiaoyueLg.st100025 + n + GlobalConfig.jifengTiaoyueLg.st100006;
			// this.sendActiveState.visible = true
			// this.sendBtn.visible = false;
		} else {
			this.lastTime = ""
			// this.sendBtn.visible = true;
		}
		let monthCardConfig = GlobalConfig.ins("MonthCardConfig");
		let money = monthCardConfig.money / 10;
		let money2 = monthCardConfig.moneyEx / 10;
		this.sendBtn2.label = money2 + GlobalConfig.jifengTiaoyueLg.st100026;
		this.sendBtn.skinName = monthDay ? `Btn3Skin` : `Btn1Skin`
		this.sendBtn.label = monthDay ? money + GlobalConfig.jifengTiaoyueLg.st100027 + "\n" + this.lastTime : money + GlobalConfig.jifengTiaoyueLg.st100026
		this.list_yk.dataProvider = new eui.ArrayCollection(RewardData.ToRewardDatas(GlobalConfig.ins("MonthCardConfig").firstAward))
	}
	close() {
		this.sendBtn.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onTap, this)
		this.sendBtn2.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onTap, this)
		GameGlobal.MessageCenter.removeListener(MessageDef.RECHARGE_UPDATE_MONTH_DAY, this._UpdateContent, this)
		GameGlobal.MessageCenter.removeListener(MessageDef.RECHARGE_UPDATE_MONTH_REWARD, this._UpdateContent, this)
	}

	onTap(e) {
		switch (e.currentTarget) {
			case this.sendBtn:
				Recharge.ins().TestMonth(1);
				break;
			case this.sendBtn2:
				Recharge.ins().TestMonth(2);
				break;
			case this.getBtn:
				if (UserBag.ins().getSurplusCount() < UserBag.BAG_ENOUGH) {
					BagFullTipsPanel.Open()
				} else {
					Recharge.ins().sendgetgifData();  //请求奖励 
				}
				break
		}
	}
}
window["MonthCardWin"] = MonthCardWin