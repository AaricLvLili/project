class CouponTrePanel extends BaseView implements ICommonWindowTitle {
	windowTitleIconName?: string;
	mWindowHelpId = 38;
	public constructor(data?: any) {
		super();
		this.name = GlobalConfig.jifengTiaoyueLg.st102102 + GlobalConfig.jifengTiaoyueLg.st100032;
		this.windowTitleIconName = GlobalConfig.jifengTiaoyueLg.st102102 + GlobalConfig.jifengTiaoyueLg.st100032;
		this.skinName = "CouponTrePanelSkin";
		this.touchEnabled = false;
	}

	public boxGroup: eui.Group;
	public warehouse: eui.Button;
	public m_ItemGroup: eui.Group;
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
	public m_MsgScroller: eui.Scroller;
	public m_MsList: eui.List;
	public m_LuckGroup: eui.Group;

	private msListData: eui.ArrayCollection;
	public m_LuckImgGroup: eui.Group;
	public m_ShowAllLab: eui.Label;

	public m_LuckBtn: eui.Group;
	public m_LuckImg: eui.Image;
	public m_Mask: eui.Rect;
	public m_LuckCount: eui.Label;
	public m_ProGroup: eui.Group;
	private isCanGetAward: boolean = false;
	public redPoint: eui.Group;

	protected childrenCreated() {
		super.childrenCreated();
		this.setNeedItem();
		this.m_MsList.itemRenderer = PetTreasureRenderer;
		this.msListData = new eui.ArrayCollection;
		this.m_MsList.dataProvider = this.msListData;
		this.m_ShowAllLab.textFlow = <Array<egret.ITextElement>>[
			{ text: GlobalConfig.jifengTiaoyueLg.st102104, style: { "underline": true } }];
		this.m_LuckImg.mask = this.m_Mask;
		this.m_BuyBtn1.label = LanguageString.jifengTiaoyueCh(GlobalConfig.jifengTiaoyueLg.st102111, [1]);
		this.m_BuyBtn10.label = LanguageString.jifengTiaoyueCh(GlobalConfig.jifengTiaoyueLg.st102111, [10]);
	};
	private addViewEvent() {
		this.AddClick(this.m_BuyBtn1, this.onClickBuy);
		this.AddClick(this.m_BuyBtn10, this.onClickBuy);
		this.AddClick(this.warehouse, this.onWarehouse);
		this.AddClick(this.m_ShowAllLab, this.onClickShowAll);
		this.AddClick(this.m_LuckBtn, this.onClickLuckBtn);
		this.observe(CouponEvt.COUPON_TREASURE_ROLE_MSG, this.setRoleList);
		this.observe(CouponEvt.COUPON_TREASURE_UPDATE, this.initData);
	}
	private removeEvent() {
	}

	public open() {
		this.addViewEvent();
		this.initData();
		this.setEff(true);
	};
	public close() {
		this.release();
	};

	public release() {
		this.removeEvent();
		this.setEff(false);
	}

	private initData() {
		this.setRoleList();
		this.setShowItem();

	}
	UpdateContent(): void {

	}

	private setEff(isShow: boolean) {
		for (var k = 0; k < this.m_LuckGroup.numChildren; k++) {
			let item = this.m_LuckGroup.getChildAt(k);
			if (item && item instanceof ItemBase) {
				if (isShow) {
					item.showEffect(6);
				} else {
					item.clearEffect()
				}
			}
		}
		for (var k = 0; k < this.m_ItemGroup.numChildren; k++) {
			let child = this.m_ItemGroup.getChildAt(k);
			if (child && child instanceof CouponItem) {
				child.showEff(isShow);
			}
		}
	}

	private setShowItem() {
		let couponModel = CouponModel.getInstance;
		let ticketTreasureHuntPoolConfig = GlobalConfig.ins("ticketTreasureHuntPoolConfig");
		let i = 0;
		for (let key in ticketTreasureHuntPoolConfig) {
			let data = ticketTreasureHuntPoolConfig[key];
			let child = this.m_ItemGroup.getChildAt(i);
			if (child && child instanceof CouponItem) {
				child.data = data.itemId;
				child.dataChanged();
			}
			i++;
		}
		let data = couponModel.getLuckShowItem();
		for (var k = 0; k < data.length; k++) {
			let item = this.m_LuckGroup.getChildAt(k);
			if (item && item instanceof ItemBase) {
				item.data = data[k];
				item.dataChanged();
			}
		}
		let tiConfig = GlobalConfig.ins("ticketPoolTotalrewardsConfig")[couponModel.luckIndex + 1];
		if (!tiConfig) {
			tiConfig = GlobalConfig.ins("ticketPoolTotalrewardsConfig")[couponModel.luckMaxNum];
		}
		this.m_LuckCount.text = couponModel.lucknum + "/" + tiConfig.time
		let pro = couponModel.lucknum / tiConfig.time;
		this.isCanGetAward = false;
		this.redPoint.visible = false;
		if (pro >= 1) {
			pro = 1;
			if (couponModel.luckIndex != couponModel.luckMaxNum) {
				this.isCanGetAward = true;
				this.redPoint.visible = true;
			}
		}
		this.m_Mask.height = this.m_LuckImg.height * pro;
		let num = couponModel.luckIndex % 5
		for (var k = 1; k <= this.m_LuckImgGroup.numChildren; k++) {
			let img = this.m_LuckImgGroup.getChildAt(k - 1);
			if (couponModel.luckIndex == couponModel.luckMaxNum) {
				img.visible = true;
			} else if (k <= num) {
				img.visible = true;
			} else {
				img.visible = false;
			}
			let img2 = this.m_ProGroup.getChildAt(k - 1);
			if (couponModel.luckIndex == couponModel.luckMaxNum) {
				img2.visible = true;
			} else if (k <= num) {
				img2.visible = true;
			} else if (pro == 1 && k <= num + 1) {
				img2.visible = true;
			} else {
				img2.visible = false;
			}
		}
		this.warehouse["redPoint"].visible = couponModel.checkBagRedPoint();
	}

	private setNeedItem() {
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

	private setRoleList() {
		let couponModel = CouponModel.getInstance;
		this.msListData.replaceAll(couponModel.treasureRoleList);
	}

	private onClickBuy(e: egret.TouchEvent) {
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
	private onWarehouse(e: egret.TouchEvent): void {
		ViewManager.ins().open(TreasureStorePanel, UserBag.BAG_TYPE_VIPTREASUREHUNT);
	}

	private onClickShowAll() {
		ViewManager.ins().open(CouponShowWin);
	}

	private onClickLuckBtn() {
		let couponModel = CouponModel.getInstance;
		if (this.isCanGetAward && couponModel.luckIndex != couponModel.luckMaxNum) {
			CouponSproto.ins().sendGetAward(couponModel.luckIndex + 1);
		}
	}


}
window["CouponTrePanel"] = CouponTrePanel