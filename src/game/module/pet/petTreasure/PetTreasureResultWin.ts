class PetTreasureResultWin extends BaseEuiPanel {
	public constructor() {
		super()
		this.skinName = "PetTreasureResultWinSkin";
	}

	public m_BuyBtn1: eui.Button;
	public m_BuyBtn10: eui.Button;
	public m_NeedGroup10: eui.Group;
	public m_PriceLab10: eui.Label;
	public m_PriceLab0: eui.Label;
	public m_PriceImg10: eui.Image;
	public m_ZheKou: eui.Label;
	public m_NeedGroup1: eui.Group;
	public m_PriceLab1: eui.Label;
	public m_PriceImg1: eui.Image;
	public m_PriceItemLab1: eui.Label;
	public m_PriceItemImg1: eui.Image;
	public m_List10: eui.List;
	public m_List1: eui.List;

	public m_Main10Group: eui.Group;
	public m_Main1Group: eui.Group;
	public m_CloseBtn: eui.Button;


	private listData10: eui.ArrayCollection;
	private listData1: eui.ArrayCollection;

	private timeNum = 0;
	private m_MainGroup: eui.Group;

	private type: number = 0;
	public m_AddItem: eui.Group;
	public m_huo: eui.Label;
	public m_NowItem: eui.Group;
	public m_TitleImg: eui.Image;

	public createChildren() {
		super.createChildren();
		this.m_List10.itemRenderer = PetTreasureItemIcon;
		this.listData10 = new eui.ArrayCollection;
		this.m_List10.dataProvider = this.listData10;

		this.m_List1.itemRenderer = PetTreasureItemIcon;
		this.listData1 = new eui.ArrayCollection;
		this.m_List1.dataProvider = this.listData1;
		this.m_BuyBtn1.label = GlobalConfig.jifengTiaoyueLg.st100406;
		this.m_BuyBtn10.label = GlobalConfig.jifengTiaoyueLg.st100407;
		this.m_CloseBtn.label = GlobalConfig.jifengTiaoyueLg.st100040;

	}
	open(...param: any[]) {
		this.type = param[0];
		this.m_MainGroup.touchEnabled = false;
		this.addViewEvent();
		this.setData();
	}
	close() {
		this.release();
	}
	public release() {
		this.removeViewEvent();
	}
	private addViewEvent() {
		this.AddClick(this.m_BuyBtn1, this.onClickBuy);
		this.AddClick(this.m_BuyBtn10, this.onClickBuy);
		this.AddClick(this.m_CloseBtn, this.onClickClose);
	}
	private removeViewEvent() {
	}
	private setData() {
		let result
		if (!this.type) {
			this.m_AddItem.visible = true;
			this.m_NowItem.horizontalCenter = -36;
			this.m_PriceImg1.source = MoneyManger.MoneyConstToSource(MoneyConst.yuanbao);
			this.m_PriceImg10.source = MoneyManger.MoneyConstToSource(MoneyConst.yuanbao);
			let petTreasureHuntConfig = GlobalConfig.ins("petTreasureHuntConfig");
			if (petTreasureHuntConfig) {
				let itemNum = UserBag.ins().getBagGoodsCountById(0, petTreasureHuntConfig.itemid);
				this.m_PriceItemLab1.text = itemNum + "/1";

			}
			let petModel = PetModel.getInstance;
			result = petModel.petTreasureResult;
			this.checkGadGuide();
			this.m_TitleImg.source = "comp_116_28_02_png";
			this.m_BuyBtn1.label = GlobalConfig.jifengTiaoyueLg.st100406;
			this.m_BuyBtn10.label = GlobalConfig.jifengTiaoyueLg.st100407;
		} else {
			this.m_AddItem.visible = false;
			this.m_NowItem.horizontalCenter = 0;
			this.m_PriceImg1.source = MoneyManger.MoneyConstToSource(MoneyConst.COUPON);
			this.m_PriceImg10.source = MoneyManger.MoneyConstToSource(MoneyConst.COUPON);
			let couponModel = CouponModel.getInstance;
			result = couponModel.treasureResult;
			this.m_TitleImg.source = "comp_116_28_07_png";
			this.m_BuyBtn1.label = LanguageString.jifengTiaoyueCh(GlobalConfig.jifengTiaoyueLg.st102111, [1]);
			this.m_BuyBtn10.label = LanguageString.jifengTiaoyueCh(GlobalConfig.jifengTiaoyueLg.st102111, [10]);
		}
		this.removeTime();
		this.listData1.removeAll();
		this.listData10.removeAll();
		this.timeNum = 0;
		if (result.length == 1) {
			this.listData1.replaceAll(result);
			this.m_Main10Group.visible = false;
			this.m_Main1Group.visible = true;
		} else {
			this.m_Main10Group.visible = true;
			this.m_Main1Group.visible = false;
			this.addTime();
		}
		this.setNeedItem();
	}
	private addTime() {
		this.removeTime();
		TimerManager.ins().doTimer(200, 9, this.setTimeData, this);
		this.setTimeData();
	}
	private removeTime() {
		TimerManager.ins().remove(this.setTimeData, this);
	}
	private setTimeData() {
		let setData;
		let result;
		if (!this.type) {
			let petModel = PetModel.getInstance;
			result = petModel.petTreasureResult;
		} else {
			let couponModel = CouponModel.getInstance;
			result = couponModel.treasureResult;
		}
		setData = result[this.timeNum];
		this.listData10.addItem(setData);
		this.timeNum += 1;
	}
	private setNeedItem() {
		if (!this.type) {
			let petTreasureHuntConfig = GlobalConfig.ins("petTreasureHuntConfig");
			if (petTreasureHuntConfig) {
				this.m_PriceLab1.text = petTreasureHuntConfig.huntOnce;
				this.m_PriceLab10.text = petTreasureHuntConfig.huntTenth;
				this.m_PriceLab0.text = parseInt(petTreasureHuntConfig.huntOnce) * 10 + "";
				this.m_ZheKou.text = petTreasureHuntConfig.discount;
				let itemConfig = GlobalConfig.ins("ItemConfig")[petTreasureHuntConfig.itemid]
				let itemNum = UserBag.ins().getBagGoodsCountById(0, petTreasureHuntConfig.itemid);
				if (itemConfig) {
					let icon = itemConfig.icon + "_png";
					this.m_PriceItemImg1.source = icon;
				}
				this.m_PriceImg1.source = MoneyManger.MoneyConstToSource(MoneyConst.yuanbao)
				this.m_PriceImg10.source = MoneyManger.MoneyConstToSource(MoneyConst.yuanbao)
			}
		} else {
			let ticketTreasureHuntConfig = GlobalConfig.ins("ticketTreasureHuntConfig");
			if (ticketTreasureHuntConfig) {
				this.m_PriceLab1.text = ticketTreasureHuntConfig.huntOnce;
				this.m_PriceLab10.text = ticketTreasureHuntConfig.huntTenth;
				this.m_PriceLab0.text = parseInt(ticketTreasureHuntConfig.huntOnce) * 10 + "";
				this.m_ZheKou.text = ticketTreasureHuntConfig.discount;
				this.m_PriceImg1.source = MoneyManger.MoneyConstToSource(MoneyConst.COUPON)
				this.m_PriceImg10.source = MoneyManger.MoneyConstToSource(MoneyConst.COUPON)
			}
		}
	}

	private onClickBuy(e: egret.TouchEvent) {
		if (!this.type) {
			let yb: number = GameLogic.ins().actorModel.yb;
			let itemNum = 0;
			let petTreasureHuntConfig = GlobalConfig.ins("petTreasureHuntConfig");
			if (petTreasureHuntConfig) {
				itemNum = UserBag.ins().getBagGoodsCountById(0, petTreasureHuntConfig.itemid);
				switch (e.currentTarget) {
					case this.m_BuyBtn1:
						if (itemNum >= 1) {
							PetSproto.ins().sendTreasure(0);
							return;
						} else if (yb >= petTreasureHuntConfig.huntOnce) {
							PetSproto.ins().sendTreasure(0);
							return;
						}
						UserTips.ins().showTips(GlobalConfig.jifengTiaoyueLg.st100405);
						break;
					case this.m_BuyBtn10:
						if (itemNum >= 10) {
							PetSproto.ins().sendTreasure(1);
							return;
						} else if (yb >= petTreasureHuntConfig.huntTenth) {
							PetSproto.ins().sendTreasure(1);
							return;
						}
						UserTips.ins().showTips(GlobalConfig.jifengTiaoyueLg.st100405);
						break;
				}
			}
		} else {
			let coupon: number = GameLogic.ins().actorModel.coupon;
			let ticketTreasureHuntConfig = GlobalConfig.ins("ticketTreasureHuntConfig");
			if (ticketTreasureHuntConfig) {
				switch (e.currentTarget) {
					case this.m_BuyBtn1:
						if (coupon >= ticketTreasureHuntConfig.huntOnce) {
							CouponSproto.ins().sendTreasure(1);
							return;
						}
						UserWarn.ins().setBuyGoodsWarn(MoneyConst.COUPON);
						UserTips.ins().showTips(GlobalConfig.jifengTiaoyueLg.st102103);
						break;
					case this.m_BuyBtn10:
						if (coupon >= ticketTreasureHuntConfig.huntTenth) {
							CouponSproto.ins().sendTreasure(2);
							return;
						}
						UserWarn.ins().setBuyGoodsWarn(MoneyConst.COUPON);
						UserTips.ins().showTips(GlobalConfig.jifengTiaoyueLg.st102103);
						break;
				}
			}
		}
	}

	private checkGadGuide() {
		if (Setting.currPart == 14 && Setting.currStep == 3) {
			GuideUtils.ins().show(this.m_CloseBtn, 14, 3);
			this.m_CloseBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onClickGadGuide, this);
		}
	}

	private onClickGadGuide() {
		GuideUtils.ins().next(this.m_CloseBtn);
		this.m_CloseBtn.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onClickGadGuide, this);
		GameGlobal.MessageCenter.dispatch(PetEvt.PET_TREASUREGUIDE_END);
		ViewManager.ins().close(this);
	}

	private onClickClose() {
		ViewManager.ins().close(this);
	}
}
ViewManager.ins().reg(PetTreasureResultWin, LayerManager.UI_Popup);
window["PetTreasureResultWin"] = PetTreasureResultWin