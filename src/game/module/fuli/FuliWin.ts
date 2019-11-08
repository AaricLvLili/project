class FuliWin extends BaseEuiPanel implements ICommonWindow, ICommonWindowTitle {

	// static LAYER_LEVEL = LayerManager.UI_Main_2
	static LAYER_LEVEL = LayerManager.UI_Main

	public constructor() {
		super()
	}

	iconList: eui.List
	curId
	listBar: eui.Scroller
	curPanel
	// leftBtn
	// rightBtn
	info: eui.Group;
	_datas
	panleType: number
	arrList
	curPanleList
	panels
	panels2
	selectBtnType
	btnNum
	public m_RightBtnRedPoint: eui.Image;

	private commonWindowBg: CommonWindowBg
	windowTitleIconName: string = GlobalConfig.jifengTiaoyueLg.st100005;
	initUI() {
		super.initUI(), this.skinName = "FuliMainSkin"

		this.iconList.itemRenderer = FuliActBtnRenderer
		this.panels = [CdkeyPanle, MoneyTreePanel, GameNoticePanle, MonthCardWin, null, RechargeGiftPanel, FindAssetsPanel, Recharge3Win, DayLoginPanel, FAQPanel, MonthSingPanel]
		// this.panels2 = [MoneyTreePanel]
		this.panels2 = this.panels
		this.arrList = new eui.ArrayCollection

		this.listBar.horizontalScrollBar.autoVisibility = false;
		this.listBar.horizontalScrollBar.visible = false;
		this.commonWindowBg.tabBar.visible = false
		this.commonWindowBg.imgNav.visible = false
	}

	UpdateContent(): void { }

	open(...param: any[]) {
		this.commonWindowBg.OnAdded(this)
		this.listBar.addEventListener(egret.Event.CHANGE, this.onChange, this)
		this.iconList.addEventListener(egret.Event.CHANGE, this.onClickMenu, this)
		// this.leftBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchBtn, this)
		// this.rightBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchBtn, this)
		GameGlobal.MessageCenter.addListener(MessageDef.MONEY_INFO_CHANGE, this.updateMenuList, this)
		GameGlobal.MessageCenter.addListener(MessageDef.GAME_NOTICE_OPEN, this.updateMenuList, this)
		GameGlobal.MessageCenter.addListener(MessageDef.UPDATA_TASK, this.updateMenuList, this)
		GameGlobal.MessageCenter.addListener(MessageDef.FIND_ASSETS_UPDATE, this.updateMenuList, this);
		GameGlobal.MessageCenter.addListener(MessageDef.MONEY_RECHARGE_GIFT_CHANGE, this.UpdateListRedPoint, this)
		GameGlobal.MessageCenter.addListener(MessageDef.UPDATE_RECHARGE, this.UpdateListRedPoint, this)
		GameGlobal.MessageCenter.addListener(MessageDef.UPDATE_ACTIVITY_PANEL, this.UpdateListRedPoint, this)
		this.panleType = param[0];
		this.curPanleList = 1 == this.panleType ? this.panels : this.panels2;
		this.selectBtnType = 0;
		this.iconList.selectedIndex = 0;
		this.updateMenuList(!0);
		if (param[1]) {
			this.selectBtnType = param[1];
			this.iconList.selectedIndex = this.getSelectIdx(param[1]);
			this.updateMenuList(!0);
		}
	}

	close() {
		for (var e = [], t = 0; t < arguments.length; t++) e[t] = arguments[t];
		this.listBar.addEventListener(egret.Event.CHANGE, this.onChange, this)
		this.iconList.removeEventListener(egret.Event.CHANGE, this.onClickMenu, this)
		GameGlobal.MessageCenter.removeListener(MessageDef.MONEY_INFO_CHANGE, this.updateMenuList, this)
		GameGlobal.MessageCenter.removeListener(MessageDef.GAME_NOTICE_OPEN, this.updateMenuList, this)
		GameGlobal.MessageCenter.removeListener(MessageDef.UPDATA_TASK, this.updateMenuList, this)
		GameGlobal.MessageCenter.removeListener(MessageDef.FIND_ASSETS_UPDATE, this.updateMenuList, this);
		GameGlobal.MessageCenter.removeListener(MessageDef.MONEY_RECHARGE_GIFT_CHANGE, this.UpdateListRedPoint, this)
		GameGlobal.MessageCenter.removeListener(MessageDef.UPDATE_RECHARGE, this.UpdateListRedPoint, this)
		GameGlobal.MessageCenter.removeListener(MessageDef.UPDATE_ACTIVITY_PANEL, this.UpdateListRedPoint, this)
		this.removeObserve()
		this.curPanel.close()
	}

	updateMenuList(e = false, t = 0) {
		this._datas = [];
		var config, n = 0;
		for (var r in GlobalConfig.welfareConfig) {
			config = GlobalConfig.welfareConfig[r];
			if (config.id == 4 && WxSdk.ins().isHidePay())//微信小游戏ios屏蔽月卡
				continue;
			var bool = false;
			if (this.panleType == config.panel) {
				if (2 == config.type) {
					if (MoneyTreeModel.CheckOpen()) {
						this._datas.push(config)
						bool = true
					}
				} else if (9 == config.type) {
					if (DayLoginIconRule.CheckShow()) {
						this._datas.push(config)
						bool = true
					}
				} else if (7 == config.type) {
					if (FindAssetsModel.ins().HasFindAssets()) {
						this._datas.push(config)
						bool = true
					}
				} else {
					if (5 == config.type) {
						// GameGlobal.lunhuiModel.checkSpritePanelOpen()
						if (0) {
							this._datas.push(config)
							bool = true
						}
					} else {
						this._datas.push(config)
						bool = true
					}
				}
			}
			// if (bool) {
			// 	if (config.type == this.selectBtnType) {
			// 		this.iconList.selectedIndex = n
			// 	}
			// 	++n
			// }
		}
		this.arrList.replaceAll(this._datas), this.iconList.dataProvider = this.arrList, e && (this.curId = this._datas[this.iconList.selectedIndex].type, this.updateDetail()), this.btnNum = this._datas.length, this.onChange()
	}

	onClickMenu(e) {
		this.curId = this._datas[this.iconList.selectedIndex].type, this.updateDetail()
	}

	onChange() {

		// this.iconList.scrollH < 20
		// 	? (this.leftBtn.visible = !1, this.rightBtn.visible = !0)
		// 	: this.iconList.scrollH > 68 * this.iconList.dataProvider.length - this.listBar.width
		// 		? (this.leftBtn.visible = !0, this.rightBtn.visible = !1)
		// 		: (this.leftBtn.visible = !0, this.rightBtn.visible = !0)
		// 	, this.btnNum <= 5 && (this.leftBtn.visible = !1, this.rightBtn.visible = !1)
		// if (this.m_RightBtnRedPoint && this.rightBtn.visible == false && this.m_RightBtnRedPoint.visible) {
		// 	this.m_RightBtnRedPoint.visible = false;
		// }
		if (!this.listBar) return
		//this.m_RightBtnRedPoint.visible = this.menuScroller.viewport.contentWidth > this.menuScroller.width
		this.m_RightBtnRedPoint.visible = this.arrList.length > 4
		if (this.m_RightBtnRedPoint.visible == false) return
		if (this.listBar && this.listBar.viewport && this.listBar.viewport.scrollH == 0) {
			this.m_RightBtnRedPoint.source = `cycle_btn_01_01_png`
		} else if (this.listBar && this.listBar.viewport && this.listBar.viewport.scrollH == this.listBar.viewport.contentWidth - this.listBar.width) {
			this.m_RightBtnRedPoint.source = `cycle_btn_01_02_png`
		}
	}

	updateDetail() {
		this.curPanel && (DisplayUtils.removeFromParent(this.curPanel), this.curPanel.close())
		let panelCls = this.curPanleList[this.curId - 1]
		if (!panelCls) {
			return
		}
		this.curPanel = new panelCls
		// this.cruPanel = new this.cruPanleList[0]
		MoneyTreeModel.ins().isOpen[this.curId] || (MoneyTreeModel.ins().isOpen[this.curId] = !0, this.updateMenuList())
		this.curPanel && (this.curPanel.open(), this.info.addChild(this.curPanel))

		if (egret.is(this.curPanel, "ICommonWindowTitle") && this.curPanel.windowCommonBg && this.curPanel.windowCommonBg != "") {
			this.commonWindowBg.ActivityWinBgUpdate(this.curPanel.windowCommonBg);
		} else
			this.commonWindowBg.ActivityWinBgUpdate("");
	}

	private UpdateListRedPoint() {
		for (let i = 0; i < this.iconList.numChildren; ++i) {
			let child = this.iconList.getChildAt(i)
			if (child && child["UpdateRedPoint"]) {
				child["UpdateRedPoint"]()
			}
		}
	}
	private getSelectIdx(type: number): number {
		if (!this._datas) return 0;
		let idx = 0;
		for (let item in this._datas) {
			if (this._datas[item].panel == this.panleType && this._datas[item].type == type) {
				return idx
			}
			idx++
		}
		return 0
	}

	// onTouchBtn(e) {
	// 	var t = 350;
	// 	switch (e.target) {
	// 		case this.leftBtn:
	// 			this.iconList.scrollH <= t ? this.iconList.scrollH = 0 : this.iconList.scrollH -= t;
	// 			break;
	// 		case this.rightBtn:
	// 			this.iconList.scrollH < 70 * (this.iconList.dataProvider.length - 5) + 12 ? this.iconList.scrollH = 70 * (this.iconList.dataProvider.length - 5) + 12 : this.iconList.scrollH += t
	// 	}
	// 	this.onChange()
	// }

	OnBackClick(clickType: number): number {
		return 0
	}
	OnOpenIndex(openIndex: number): boolean {
		return true
	}
}
window["FuliWin"] = FuliWin