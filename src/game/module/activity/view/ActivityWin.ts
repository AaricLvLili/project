class ActivityWin extends BaseEuiPanel implements ICommonWindow {

	static LAYER_LEVEL = LayerManager.UI_Main

	protected type = 0
	private activityPanelList = []
	// private leftBtn
	// private rightBtn
	private menuList: eui.List
	private closeBtn
	closeBtn0
	menuScroller
	dataArr
	private _datas: ActBtnData[]
	viewStack: eui.ViewStack

	public activityGroup: eui.Group

	private descBg: eui.Image
	private descGrop: any
	private m_RightBtnRedPoint: eui.Image;
	public commonWindowBg: CommonWindowBg
	public m_Lan1: eui.Label;

	public constructor() {
		super()
	}

	_InitUI() {
		this.commonWindowBg.helpBtn.visible = false;
		this.menuList.itemRenderer = ActivityBtnRenderer
		this.commonWindowBg.tabBar.visible = false
		this.commonWindowBg.closeBtn.visible = false
		this.commonWindowBg.returnBtn.visible = false
		this.commonWindowBg.imgNav.visible = false
		this.menuScroller.horizontalScrollBar.autoVisibility = false;
		this.menuScroller.horizontalScrollBar.visible = false;
		this.commonWindowBg.nameIcon.text = GlobalConfig.jifengTiaoyueLg.st101273;
	}

	protected changeSkinByType(e) {
		switch (this.type) {
			case 0:
				this.skinName = "ActivityWinSkin";
				break;
		}
	}

	protected _UpdateTitleImg() {

	}

	protected _SetActWinType(value) {
		this.type = null == value ? 0 : value
	}

	open(...param: any[]) {


		var activityType = void 0 == param[0] ? 0 : param[0]
		let arg2 = param[2]
		this._SetActWinType(param[1])
		this.changeSkinByType(this.type)
		this.m_Lan1.text = GlobalConfig.jifengTiaoyueLg.st101274;
		// this.rightEff = new MovieClip
		// this.rightEff.x = this.rightBtn.x - 6
		// this.rightEff.y = this.rightBtn.y - 6
		// this.leftEff = new MovieClip
		// this.leftEff.scaleX = -1
		// this.leftEff.x = this.leftBtn.x + 8
		// this.leftEff.y = this.leftBtn.y - 6
		this._UpdateTitleImg()
		this._InitUI()
		this.updateView(activityType, arg2)
		this.closeBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onClick, this)
		this.closeBtn0.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onClick, this)
		this.menuList.addEventListener(egret.Event.CHANGE, this.onClickMenu, this)
		GameGlobal.MessageCenter.addListener(MessageDef.UPDATE_ACTIVITY_PANEL, this.updatePanel, this)
		// this.leftBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchBtn, this)
		// this.rightBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchBtn, this)
		GameGlobal.MessageCenter.addListener(MessageDef.ACTIVITY_IS_AWARDS, this.refushRedPoint, this)
		GameGlobal.MessageCenter.addListener(MessageDef.MONEY_RECHARGE_GIFT_CHANGE, this.refushRedPoint, this)
		GameGlobal.MessageCenter.addListener(MessageDef.UPDATE_RECHARGE, this.refushRedPoint, this)

		GameGlobal.MessageCenter.addListener(MessageDef.ACTIVITY4_UPDATE, this.refushRedPoint, this)
		this.menuScroller.addEventListener(egret.Event.CHANGE, this.onChange, this)
	}

	close() {
		for (var e = [], t = 0; t < arguments.length; t++) e[t] = arguments[t];
		this.closeBtn.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onClick, this)
		this.closeBtn0.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onClick, this)
		this.menuList.removeEventListener(egret.Event.CHANGE, this.onClickMenu, this)
		GameGlobal.MessageCenter.removeListener(MessageDef.UPDATE_ACTIVITY_PANEL, this.updatePanel, this)
		// this.leftBtn.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchBtn, this)
		// this.rightBtn.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchBtn, this)
		GameGlobal.MessageCenter.removeListener(MessageDef.ACTIVITY_IS_AWARDS, this.refushRedPoint, this)
		GameGlobal.MessageCenter.removeListener(MessageDef.MONEY_RECHARGE_GIFT_CHANGE, this.refushRedPoint, this)
		GameGlobal.MessageCenter.removeListener(MessageDef.UPDATE_RECHARGE, this.refushRedPoint, this)
		GameGlobal.MessageCenter.removeListener(MessageDef.ACTIVITY4_UPDATE, this.refushRedPoint, this)
		this.menuScroller.removeEventListener(egret.Event.CHANGE, this.onChange, this)
		TimerManager.ins().removeAll(this);
		// DisplayUtils.dispose(this.leftEff);
		// this.leftEff = null
		// DisplayUtils.dispose(this.rightEff);
		// this.rightEff = null;
		for (var i = 0; i < this.activityPanelList.length; i++) this.activityPanelList[i].close()
	}

	refushRedPoint() {
		this.dataArr.replaceAll(this._datas)
		this.menuList.dataProvider = this.dataArr
	}

	updateView(activityType = 0, arg2 = null) {
		if (this.viewStack && this.viewStack.numElements) {
			for (var t = 0; t < this.viewStack.numElements; t++) {
				ObjectPool.ins().push(this.viewStack.getElementAt(t));
			}
		}

		this.viewStack.removeChildren(), this.activityPanelList = [];
		var i = 0;
		this._datas = GameGlobal.activityModel.getbtnListByType(this.type)
		this._datas.sort(this.sort);
		// for (let d of this._datas) {
		for (let k1 = 0; k1 < this._datas.length; ++k1) {
			let d = this._datas[k1]
			if (d.id == ActivityModel.CUS_ACT_4.id) {

				this._datas.splice(k1, 1)
				this._datas.push(d);
				break
			}
		}

		let openIndex = 0
		for (var n in this._datas) {
			var id = this._datas[n].id
			let type
			if (id == ActivityModel.CUS_ACT_1.id) {
				let panel = new Recharge3Win
				type = ActivityModel.CUS_ACT_1.type
				panel["activityID"] = id
				this.activityPanelList[i] = panel
			} else if (id == ActivityModel.CUS_ACT_2.id) {
				let panel = new RechargeGiftPanel()
				type = ActivityModel.CUS_ACT_2.type
				panel["activityID"] = id
				this.activityPanelList[i] = panel
			} else if (id == ActivityModel.CUS_ACT_3.id) {
				let panel = new EggBrokenPanel()
				type = ActivityModel.CUS_ACT_3.type
				panel["activityID"] = id
				this.activityPanelList[i] = panel
			} else if (id == ActivityModel.CUS_ACT_4.id) {
				let panel = new ActivityGuildWinnerPanel()
				type = ActivityModel.CUS_ACT_4.type
				panel["activityID"] = id
				this.activityPanelList[i] = panel
			} else if (id == ActivityModel.CUS_ACT_5.id) {
				let panel = new DayTargetPanel()
				type = ActivityModel.CUS_ACT_5.type
				panel["activityID"] = id
				this.activityPanelList[i] = panel
			} else {
				type = this._datas[n].actType
				this.activityPanelList[i] = ActivityPanel.create(id);
			}
			if (type == activityType) {
				if (activityType == ActivityModel.TYPE_02) {
					if (ActivityType2Panel.IsGift(id)) {
						openIndex = i
					}
				} else {
					openIndex = i
				}
			}

			this.viewStack.addChild(this.activityPanelList[i])
			i++;
		}
		this.dataArr = new eui.ArrayCollection(this._datas)
		this.menuList.dataProvider = this.dataArr, this.onChange()
		// TimerManager.ins().doTimer(1e3, 0, this.timerFunc, this)
		if (this.viewStack.numElements > 0) {
			this.setOpenIndex(openIndex, arg2)
		}
	}

	updatePanel(id) {
		for (var key in this.activityPanelList) {
			if (this.activityPanelList[key].activityID == id) {
				if (this.activityPanelList[key] && this.activityPanelList[key].updateData) {
					this.activityPanelList[key].updateData();
				}
			}
		}
		this.refushRedPoint()
	}

	onClick(e) {
		switch (e.currentTarget) {
			case this.closeBtn:
			case this.closeBtn0:
				ViewManager.ins().close(this)
		}
	}

	public date: eui.Label
	public desc: eui.Label

	setOpenIndex(index, arg2 = null) {
		let activityObj = this.activityPanelList[index]
		//这里特殊处理一下幸运轮盘
		for (var i = 0; i < this.activityPanelList.length; i++) {
			let panel = this.activityPanelList[i];
			if (panel instanceof ActivityType31Panel) {
				if (activityObj != panel) {
					panel.close();
				}
			}
		}
		// 这里特殊处理一下活动描述框的背景，因为特惠礼包不需要显示
		if (this.descGrop) {
			this.descGrop.visible = true
			if (activityObj.activityID == 8 || activityObj.activityID == 20001
				|| activityObj.activityID == 20002 || activityObj.activityID == -1000) {
				this.descGrop.visible = false;
			}
		}

		let activityId = activityObj.activityID
		activityObj.open(arg2)
		this.viewStack.selectedIndex = index
		this.menuList.selectedIndex = index
		GameGlobal.activityModel.palyEffList[activityId] = !0
		this.refushRedPoint()

		let time, des = null
		if (activityObj.GetActivityTimeAndDes) {
			[time, des] = activityObj.GetActivityTimeAndDes()
		}
		if (time == null) {
			let config = GameGlobal.activityData[activityId]
			if (config) {
				time = config.getRemindTimeString()
				des = ActivityModel.GetActivityConfig(activityId).desc
			}
		}

		//时间结束或合服活动或天降豪礼的砸蛋都屏蔽activityGroup
		var config = ActivityModel.GetActivityConfig(activityId)
		if (!time || ActivityWinSummer.onPlace == ActivityModel.BTN_TYPE_04 || (config && config.activityType == 12)) {
			this.activityGroup.visible = false
		} else {
			this.activityGroup.visible = true
			this.date.text = GlobalConfig.jifengTiaoyueLg.st100025 + time
			this.desc.text = des
		}
		if (!time || config.activityType == 303) {
			this.activityGroup.visible = false;
			MessageCenter.ins().dispatch(MessageDef.UPDATE_ACTIVITY303_PANEL);
		}
		if ((config && config.activityType == 31)) {
			this.activityGroup.visible = false
		}
	}

	onClickMenu(e) {
		this.setOpenIndex(e.currentTarget.selectedIndex)
	}

	onChange() {
		// // var url = ResDataPath.GetUIEffePath("eff_switcheff");//lxh资源回收
		// this.menuList.scrollH < 60
		// 	? (this.leftBtn.visible = !1, this.rightBtn.visible = !0)
		// 	: this.menuList.scrollH > 68 * this.menuList.dataProvider.length - this.menuScroller.width
		// 		? (this.leftBtn.visible = !0, this.rightBtn.visible = !1)
		// 		: (this.leftBtn.visible = !0, this.rightBtn.visible = !0),
		// 	this.viewStack.numElements <= 5 && (this.leftBtn.visible = !1, this.rightBtn.visible = !1);
		// // this.leftBtn.visible
		// // 	? (this.leftEff.loadUrl(url, !0, -1), this.addChild(this.leftEff))
		// // 	: DisplayUtils.removeFromParent(this.leftEff), this.rightBtn.visible
		// // 	? (this.rightEff.loadUrl(url, !0, -1), this.addChild(this.rightEff))
		// // 	: DisplayUtils.removeFromParent(this.rightEff);
		// if (this.m_RightBtnRedPoint && this.rightBtn.visible == false && this.m_RightBtnRedPoint.visible) {
		// 	this.m_RightBtnRedPoint.visible = false;
		// }
		if (!this.menuScroller) return
		//this.m_RightBtnRedPoint.visible = this.menuScroller.viewport.contentWidth > this.menuScroller.width
		this.m_RightBtnRedPoint.visible = this.dataArr.length > 4
		if (this.m_RightBtnRedPoint.visible == false) return
		if (this.menuScroller && this.menuScroller.viewport && this.menuScroller.viewport.scrollH == 0) {
			this.m_RightBtnRedPoint.source = `cycle_btn_01_01_png`
		} else if (this.menuScroller && this.menuScroller.viewport && this.menuScroller.viewport.scrollH == this.menuScroller.viewport.contentWidth - this.menuScroller.width) {
			this.m_RightBtnRedPoint.source = `cycle_btn_01_02_png`
		}
	}

	// onTouchBtn(e) {
	// 	// var t = 350;
	// 	// switch (e.target) {
	// 	// 	case this.leftBtn:
	// 	// 		this.menuList.scrollH <= t ? this.menuList.scrollH = 0 : this.menuList.scrollH -= t;
	// 	// 		break;
	// 	// 	case this.rightBtn:
	// 	// 		this.menuList.scrollH < 68 * (this.menuList.dataProvider.length - 5) + 12 ? this.menuList.scrollH = 68 * (this.menuList.dataProvider.length - 5) + 12 : this.menuList.scrollH += t
	// 	// }
	// 	// this.onChange()
	// }


	sort(e, t) {
		return e.type > t.type ? 1 : e.type < t.type ? -1 : 0
	}
	// onClick(e) {
	// 	if (!ActivityType31Model.bCanClose && !ActivityType31Model.isPlayTween) {
	// 		let viewStack: egret.DisplayObjectContainer = <egret.DisplayObjectContainer>this.getChildByName("viewStack")
	// 		let ActivityType31Panel: ActivityType31Panel
	// 		if (viewStack) {
	// 			ActivityType31Panel = <ActivityType31Panel>viewStack.getChildByName("幸运转盘")
	// 		}
	// 		let warnGroup = ActivityType31Panel.warn;
	// 		warnGroup.visible = true
	// 		return
	// 	}
	// }

}
window["ActivityWin"] = ActivityWin