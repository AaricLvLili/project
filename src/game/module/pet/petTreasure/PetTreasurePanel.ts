class PetTreasurePanel extends BaseView implements ICommonWindowTitle {
	windowTitleIconName?: string;
	mWindowHelpId = 37
	public constructor(data?: any) {
		super();
		this.name = GlobalConfig.jifengTiaoyueLg.st100404;
		this.windowTitleIconName = GlobalConfig.jifengTiaoyueLg.st100404;
		this.skinName = "PetTreasurePanelSkin";
		this.touchEnabled = false;
	}

	public m_Scroller: eui.Scroller;
	public m_List: eui.List;
	public m_RightBtn: eui.Button;
	public m_LeftBtn: eui.Button;
	public m_PetAnimGroup: eui.Group;
	public m_PetMainSkill: PetSkillItem;
	public m_MsgScroller: eui.Scroller;
	public m_MsList: eui.List;
	public m_WarehouseBtn: eui.Button;

	public m_BuyBtn1: eui.Button;
	public m_BuyBtn10: eui.Button;

	public m_NeedGroup10: eui.Group;
	public m_PriceLab10: eui.Label;
	public m_PriceLab0: eui.Label;
	public m_PriceImg10: eui.Image;
	public m_PriceItemLab10: eui.Label;
	public m_PriceItemImg10: eui.Image;
	public m_ZheKou: eui.Label;

	public m_NeedGroup1: eui.Group;
	public m_PriceLab1: eui.Label;
	public m_PriceImg1: eui.Image;
	public m_PriceItemLab1: eui.Label;
	public m_PriceItemImg1: eui.Image;

	public m_RightArrImg: eui.Image;
	public m_LeftArrImg: eui.Image;


	private listData: eui.ArrayCollection;

	private msListData: eui.ArrayCollection;
	private m_Eff: MovieClip;

	private petConfig: any;

	private petShowNum: number = 0;

	protected childrenCreated() {
		super.childrenCreated();
		this.m_List.itemRenderer = PetTreasureIcon;
		this.listData = new eui.ArrayCollection;
		this.m_List.dataProvider = this.listData;
		this.m_MsList.itemRenderer = PetTreasureRenderer;
		this.msListData = new eui.ArrayCollection;
		this.m_MsList.dataProvider = this.msListData;
		this.setNeedItem();
		this.m_BuyBtn1.label = GlobalConfig.jifengTiaoyueLg.st100406;
		this.m_BuyBtn10.label = GlobalConfig.jifengTiaoyueLg.st100407;

	};
	private addViewEvent() {
		this.AddClick(this.m_BuyBtn1, this.onClickBuy);
		this.AddClick(this.m_BuyBtn10, this.onClickBuy);
		this.AddClick(this.m_RightArrImg, this.onClickArrImg);
		this.AddClick(this.m_LeftArrImg, this.onClickArrImg);
		this.AddClick(this.m_LeftBtn, this.onClickLeftBtn);
		this.AddClick(this.m_RightBtn, this.onClickRightBtn);
		this.observe(PetEvt.PET_TREASURE_MSG, this.setData);
		this.observe(PetEvt.PET_TREASURE_ROLE_MSG, this.setRoleList);
	}
	private removeEvent() {
		if (this.m_Eff) {
			this.m_Eff.removeEventListener(egret.Event.COMPLETE, this.onPlayLoop, this);
		}
	}

	public open() {
		this.addViewEvent();
		this.setData();
	};
	public close() {
		this.release();
	};

	public release() {
		this.removeEvent();
		DisplayUtils.dispose(this.m_Eff);
		this.m_Eff = null;
	}

	private setData() {
		let petModel = PetModel.getInstance;
		let config = GlobalConfig.ins("petTreasureHuntPoolConfig");
		let idList = [];
		let petTreasureHuntPoolConfig;
		let i = 0;
		for (let key in config) {
			if (i == petModel.petTreasureSelectIndex) {
				petTreasureHuntPoolConfig = config[key];
			}
			idList.push(config[key].index);
			i++;
		}
		this.petShowNum = i;
		this.listData.replaceAll(idList);
		if (petTreasureHuntPoolConfig) {
			let petConfig = GlobalConfig.ins("PetConfig")[petTreasureHuntPoolConfig.petID];
			this.petConfig = petConfig;
			this.playEff(petConfig.avatar + "_3" + EntityAction.ATTACK);
			this.m_PetMainSkill.setData(petConfig.skill[0], 1);
		}
		let petTreasureHuntConfig = GlobalConfig.ins("petTreasureHuntConfig");
		if (petTreasureHuntConfig) {
			let itemNum = UserBag.ins().getBagGoodsCountById(0, petTreasureHuntConfig.itemid);
			this.m_PriceItemLab1.text = itemNum + "/1";
			this.m_PriceItemLab10.text = itemNum + "/10";
		}
		this.m_RightArrImg.visible = true;
		this.m_LeftArrImg.visible = true;
		if (petModel.petTreasureSelectIndex == 0) {
			this.m_LeftArrImg.visible = false;
		}
		if (petModel.petTreasureSelectIndex == (i - 1)) {
			this.m_RightArrImg.visible = false;
		}
		this.setRoleList();
		this.checkGadGuide();
	}

	private setRoleList() {
		let petModel = PetModel.getInstance;
		this.msListData.replaceAll(petModel.petTreasureRoleList);
	}

	private setNeedItem() {
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
				this.m_PriceItemImg10.source = icon;
			}
		}
	}

	private initEffData() {
		if (!this.m_Eff) {
			this.m_Eff = new MovieClip();
			this.m_Eff.touchEnabled = false;
			this.m_PetAnimGroup.addChild(this.m_Eff);
			this.m_Eff.x = this.m_PetAnimGroup.width / 2;
			this.m_Eff.y = this.m_PetAnimGroup.height / 2;
			this.m_Eff.addEventListener(egret.Event.COMPLETE, this.onPlayLoop, this);
		}
	}
	private playEff(name: string) {
		this.initEffData();
		this.m_Eff.loadUrl(ResDataPath.GetMonsterBodyPath(name), true, 1);
	}
	private onPlayLoop() {
		this.m_Eff.loadUrl(ResDataPath.GetMonsterBodyPath(this.petConfig.avatar + "_3" + EntityAction.STAND), true, -1);
	}

	private onClickBuy(e: egret.TouchEvent) {
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
	}
	private onClickArrImg(e: egret.TouchEvent) {
		let petModel = PetModel.getInstance;
		switch (e.currentTarget) {
			case this.m_RightArrImg:
				petModel.petTreasureSelectIndex += 1;
				break;
			case this.m_LeftArrImg:
				petModel.petTreasureSelectIndex -= 1;
				break;
		}
		this.setData();
	}

	private onClickLeftBtn() {
		if (this.m_Scroller && this.m_Scroller.viewport) {
			let nowPoint = this.m_Scroller.viewport.scrollH;
			let nextPoibt = nowPoint - (6 * 68);
			if (nextPoibt <= 0) {
				nextPoibt = 0;
			}
			this.m_Scroller.viewport.scrollH = nextPoibt;
		}
	}

	private onClickRightBtn() {
		if (this.m_Scroller && this.m_Scroller.viewport) {
			let maxWidth = (this.petShowNum - 6) * 68 - 6;
			let nowPoint = this.m_Scroller.viewport.scrollH;
			let nextPoibt = nowPoint + (6 * 68);
			if (nextPoibt > maxWidth) {
				nextPoibt = maxWidth;
			}
			this.m_Scroller.viewport.scrollH = nextPoibt;
		}
	}

	private checkGadGuide() {
		if (Setting.currPart == 14 && Setting.currStep == 2) {
			GuideUtils.ins().show(this.m_BuyBtn1, 14, 2);
			this.m_BuyBtn1.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onClickGadGuide, this, true, 10);
		}
	}

	private onClickGadGuide() {
		GuideUtils.ins().next(this.m_BuyBtn1);
		this.m_BuyBtn1.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onClickGadGuide, this, true);
	}

	UpdateContent(): void {

	}

}
window["PetTreasurePanel"] = PetTreasurePanel