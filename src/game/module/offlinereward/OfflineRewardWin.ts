class OfflineRewardWin extends BaseEuiPanel {

	private okBtn: eui.Button;
	private ShareOkBtn: eui.Button;
	private ShareGetBtn: eui.Button;
	private btnGroup: eui.Group;
	//time
	exp
	money
	equipNum
	// bagFull
	// label4
	// label6
	// label3
	// label5
	//private dialogCloseBtn:eui.Button;
	public closeBtn: eui.Button;
	public m_Lab: eui.Label;

	public onMaskTap(): void {

	}
	public constructor() {
		super()
		this.skinName = "OfflineRewardSkin";
		this.okBtn.label = GlobalConfig.jifengTiaoyueLg.st101176;
		GameGlobal.MessageCenter.addListener(MessageDef.OFFLIN_SHAREJONIN_SUCCESS, this.updateBtnState, this);

		if (!SdkMgr.isWxGame() && this.btnGroup) {
			this.ShareOkBtn.visible = false;
			this.ShareGetBtn.visible = false;
			this.btnGroup.horizontalCenter = 115;
		}
	}

	// shareLinJoin() {
	// 	this.ShareOkBtn.visible = false;
	// 	this.ShareGetBtn.visible = true;
	// }

	open(...param: any[]) {
		this.closeBtn.visible = false;
		this.rect.alpha = 0.6;
		this.okBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onClick, this);
		this.ShareOkBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onClick, this);
		this.ShareGetBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onClick, this);
		this.closeBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onClick, this);
		// GameGlobal.MessageCenter.addListener(ShareEvt.WX_SHARE, this.updateBtnState, this);
		this.update(param[0]);
		this.updateBtnState();
		//this.m_bg.init(`OfflineRewardWin`, `获得离线资源`, false, null, false)
		//this.dialogCloseBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onClick, this);
	}

	close() {
		this.okBtn.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onClick, this);
		this.ShareOkBtn.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onClick, this);
		this.ShareGetBtn.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onClick, this);
		this.closeBtn.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onClick, this);
		// GameGlobal.MessageCenter.removeListener(ShareEvt.WX_SHARE, this.updateBtnState, this);
		// ShareModel.ins().backGame = false;
		//this.dialogCloseBtn.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onClick, this)
	}

	update(arr: Sproto.sc_raid_chapter_offline_reward_request) {
		//this.time.text = "离线时间：" + DateUtils.getFormatBySecond(arr.offlineTime, DateUtils.TIME_FORMAT_9);
		let otherExp: number = 0;
		let otherMoney: number = 0;
		if (arr.offlineData.length > 0) {
			for (let i = 0; i < arr.offlineData.length; i++) {
				let obj: Sproto.offline_data = arr.offlineData[i];
				otherExp += obj.exp;
				otherMoney += obj.gold
			}
		}
		this.exp.text = "" + (arr.exp + otherExp);
		this.money.text = "" + (arr.money + otherMoney);
		this.equipNum.text = "" + (arr.equipNum1 + arr.equipNum2)
		// if (arr.equipNum2 == 0) {
		// 	this.bagFull.visible = false;
		// } else {
		// 	this.bagFull.visible = true;
		// 	this.bagFull.textFlow = (new egret.HtmlTextParser).parser("背包已满，自动出售<a color=0x00FF00>" + arr.equipNum2 + "</a>件装备");
		// }
		// if (arr.offlineData.length > 0) {
		// 	for (var i = 0; i < arr.offlineData.length; i++) {
		// 		var obj = arr.offlineData[i];
		// 		if (obj.type == 1) {
		// 			this.label4.text = obj.gold;
		// 			this.label6.text = obj.exp;
		// 		} else if (obj.type == 2) {
		// 			this.label3.text = obj.gold;
		// 			this.label5.text = obj.exp;
		// 		}
		// 	}
		// }
	}

	onClick(e) {
		switch (e.currentTarget) {
			case this.okBtn:
			case this.closeBtn:
				//type	#1普通2:双倍
				let req = new Sproto.cs_offline_apply_req_request;
				req.type = 1;
				GameSocket.ins().Rpc(C2sProtocol.cs_offline_apply_req, req, null, this);
				ViewManager.ins().close(this);
				break;
			case this.ShareOkBtn:
				WxSdk.ins().shareOffineReward = true;
				WxSdk.ins().shareAppMessage();
				break;
			case this.ShareGetBtn:
				let req2 = new Sproto.cs_offline_apply_req_request;
				req2.type = 2;
				GameSocket.ins().Rpc(C2sProtocol.cs_offline_apply_req, req2, null, this);
				ViewManager.ins().close(this);
				WxSdk.ins().shareOffineReward = false;
				// UserTips.InfoTip("恭喜获得了双倍离线经验!");
				UserTips.InfoTip(GlobalConfig.jifengTiaoyueLg.st101962)
				break;
		}

	}

	private updateBtnState(): void {
		this.m_Lab.visible = false;
		if (!SdkMgr.isWxGame())
			return;
		this.m_Lab.visible = true;
		if (WxSdk.ins().shareOffineReward) {
			this.ShareGetBtn.visible = true;
			this.ShareOkBtn.visible = false;
		}
		else {
			this.ShareGetBtn.visible = false;
			this.ShareOkBtn.visible = true;
		}
	}
}

ViewManager.ins().reg(OfflineRewardWin, LayerManager.UI_Popup);

window["OfflineRewardWin"] = OfflineRewardWin