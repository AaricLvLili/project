class ExpjadePanel extends BaseEuiPanel {

	public static LAYER_LEVEL = LayerManager.UI_Popup
	private item: ItemBase
	private exp01: eui.Label
	private getwayLabel01: GetwayLabel
	private exp02: eui.Label
	private getwayLabel02: GetwayLabel
	//private tipLabel: eui.Label
	private expLabel: eui.Label

	private jingyanyuCommonConfig: any;
	//private dialogCloseBtn:eui.Button;

	public constructor() {
		super()
		this.skinName = "ExpjadePanelSkin"
		this.item.mCallback = function () { }
	}

	open() {
		this.AddClick(this.getwayLabel01, this._OnClick)
		this.AddClick(this.getwayLabel02, this._OnClick)
		GameGlobal.MessageCenter.addListener(MessageDef.EXPJADE_UPDATE, this.UpdateContent, this)
		this.UpdateContent();
		this.m_bg.init(`ExpjadePanel`, GlobalConfig.jifengTiaoyueLg.st101605)
		//this.dialogCloseBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this._OnClickClose, this);
	}

	close() {
		//this.dialogCloseBtn.removeEventListener(egret.TouchEvent.TOUCH_TAP, this._OnClickClose, this)
		this.removeObserve();
		this.removeEvents();
	}

	private _OnClickClose(): void {
		ViewManager.ins().close(this)
	}

	private _OnClick(e: egret.TouchEvent) {
		if (this.jingyanyuCommonConfig == null)
			this.jingyanyuCommonConfig = GlobalConfig.ins("JingyanyuCommonConfig");
		let openLevel = this.jingyanyuCommonConfig.openLevel;
		if (GameGlobal.actorModel.level < openLevel) {
			UserTips.ins().showTips(LanguageString.jifengTiaoyueCh(GlobalConfig.jifengTiaoyueLg.st101606, [openLevel]))
			return
		}
		let expjadeModel = ExpjadeModel.ins()
		if (expjadeModel.useCount >= ExpjadeModel.GetCountPerDay()) {
			UserTips.ins().showTips(GlobalConfig.jifengTiaoyueLg.st101607)
			return
		}
		switch (e.currentTarget) {
			case this.getwayLabel01:
				ExpjadeModel.ins().SendUse(1)
				break

			case this.getwayLabel02:
				let vip = ExpjadeModel.ins().getNextVip()
				if (UserVip.ins().lv < vip) {
					UserTips.ins().showTips(GlobalConfig.jifengTiaoyueLg.st101608)
					return
				}
				ExpjadeModel.ins().SendUse(2)
				break
		}

		let itemData = UserBag.ins().getBagItemById(this.jingyanyuCommonConfig.fullItemID)
		if (itemData && itemData.count == 1) {
			ViewManager.ins().close(this)
		}
	}

	private UpdateContent() {
		if (this.jingyanyuCommonConfig == null)
			this.jingyanyuCommonConfig = GlobalConfig.ins("JingyanyuCommonConfig");
		let configData = GlobalConfig.ins("JingyanyuLevelConfig")[GameGlobal.actorModel.vipLv]
		let commonConfigData = this.jingyanyuCommonConfig;

		let expjadeModel = ExpjadeModel.ins()
		// let curShowExp = Math.min(expjadeModel.allExp, commonConfigData.maxExp)
		let curShowExp = commonConfigData.maxExp

		// this.exp01.text = `1倍领取：${curShowExp}经验（${expjadeModel.useCount}/${configData.countPerDay}）`

		let suffix = GlobalConfig.jifengTiaoyueLg.st101611;
		// if (expjadeModel.useCount >= configData.countPerDay) {
		// 	suffix = "|C:0xf87372&T:次数已经用完|"
		// }
		this.exp01.textFlow = TextFlowMaker.generateTextFlow(LanguageString.jifengTiaoyueCh(GlobalConfig.jifengTiaoyueLg.st101609, [curShowExp, suffix]))
		// if (expjadeModel.useCount >= configData.countPerDay) {
		// 	this.getwayLabel01.SetUnLabel("次数已经用完")
		// } else {
		// 	this.getwayLabel01.SetDefault()
		// }

		let vip = ExpjadeModel.ins().getNextVip()
		this.exp02.textFlow = TextFlowMaker.generateTextFlow(LanguageString.jifengTiaoyueCh(GlobalConfig.jifengTiaoyueLg.st101610, [curShowExp * 2, vip]))
		this.expLabel.text = `${curShowExp}/${commonConfigData.maxExp}`

		this.item.data = UserBag.ins().getBagItemById(this.jingyanyuCommonConfig.fullItemID)

		// if (GameGlobal.actorModel.level < commonConfigData.openLevel) {
		// 	this.getwayLabel01.visible = false
		// 	this.getwayLabel02.visible = false
		// 	this.tipLabel.text = `等级达到${commonConfigData.openLevel}可以领取`
		// } else {
		// 	this.getwayLabel01.visible = true
		// 	this.getwayLabel02.visible = true
		// 	this.tipLabel.text = "VIP可以增加领取次数"
		// }
	}
}
window["ExpjadePanel"] = ExpjadePanel