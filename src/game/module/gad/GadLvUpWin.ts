class GadLvUpWin extends BaseEuiPanel {
	public constructor() {
		super()
		this.skinName = "GadLvUpWinSkin";
	}
	public m_LvStateGroup: eui.Group;
	public m_LvLeftAttrGroup: eui.Group;
	public m_LvRightAttrGroup: eui.Group;
	public m_StateTile: eui.Label;
	public m_ArrImg: eui.Image;
	public m_MainBtnGroup: eui.Group;
	public m_UpLvBtn: eui.Button;
	public m_NeedItemGroup: eui.Group;
	public m_LvUpItemImg: eui.Image;
	public m_LvUpItemNum: eui.Label;
	public m_FullLab: eui.Label;
	public m_ExpBar: BarDoubleComp;
	public m_PowerGroup: eui.Group;
	public m_LeftLvLab: eui.Label;
	public m_RightLvLab: eui.Label;
	public m_Scroller: eui.Scroller;
	public m_List: eui.List;
	public m_NameLab: eui.Label;
	public m_PointLab: eui.Label;
	public m_GadItem: GadItem;

	public m_LeftGroup: eui.Group;
	public m_RightGroup: eui.Group;
	public m_LastAttrGroup: eui.Group;

	private listData: eui.ArrayCollection;
	public m_TipsLab: eui.Label;

	public gadData: GadData;

	public m_LvUpEffGroup: eui.Group;
	public m_BodyEffGrouo: eui.Group;
	public m_BodyEffGrouo0: eui.Group;
	public m_ItemEffGroup: eui.Group;


	public m_GuideGadLvUpItem: GadLvUpItem;

	public m_Lan1: eui.Label;
	public m_Lan2: eui.Label;
	public m_Lan3: eui.Label;

	public m_StateTile0: eui.Label;
	public m_Power: PowerLabel;

	public createChildren() {
		super.createChildren();
		this.m_List.itemRenderer = GadLvUpItem;
		this.listData = new eui.ArrayCollection();
		this.m_List.dataProvider = this.listData;


		this.m_Lan1.text = GlobalConfig.jifengTiaoyueLg.st100325;
		this.m_Lan2.text = GlobalConfig.jifengTiaoyueLg.st100326;
		this.m_FullLab.text = GlobalConfig.jifengTiaoyueLg.st100327;
		this.m_Lan3.text = GlobalConfig.jifengTiaoyueLg.st100218;
		this.m_UpLvBtn.label = GlobalConfig.jifengTiaoyueLg.st100317;
		this.m_StateTile.text = GlobalConfig.jifengTiaoyueLg.st100328;
		this.m_StateTile0.text = GlobalConfig.jifengTiaoyueLg.st100329;
		this.m_bg.init(`GadLvUpWin`, GlobalConfig.jifengTiaoyueLg.st100324);
	}
	initUI() {
		super.initUI();
	}
	open(...param: any[]) {
		this.gadData = param[0];
		GadModel.getInstance.setAutoLvUpItem();
		this.addViewEvent();
		this.setData();
	}
	close() {
		let gadModel = GadModel.getInstance;
		gadModel.lvUpSelectData.clear();
		this.release();
	}
	public release() {
		let num = this.m_List.numChildren;
		for (var i = 0; i < num; i++) {
			let child = this.m_List.getChildAt(i);
			if (child && child instanceof GadLvUpItem) {
				child.release();
			}
		}
		DisplayUtils.dispose(this.m_BodyEff);
		this.m_BodyEff = null;
		DisplayUtils.dispose(this.m_BodyEff0);
		this.m_BodyEff0 = null;
		DisplayUtils.dispose(this.m_UpLvEff);
		this.m_UpLvEff = null;
		DisplayUtils.dispose(this.m_ItemEff);
		this.m_ItemEff = null;
		this.removeViewEvent();
	}
	private addViewEvent() {
		this.m_List.addEventListener(eui.ItemTapEvent.ITEM_TAP, this.onClickList, this);
		this.observe(GadEvent.GAD_DATAUPDATE_MSG, this.setData);
		this.observe(GadEvent.GAD_SURESELECT_DATAUPDATE_MSG, this.setData);
		this.observe(GadEvent.GAD_LVUP_MSG, this.getLvUpMsg);
		this.AddClick(this.m_UpLvBtn, this.onClickLvUpBtn);
	}
	private removeViewEvent() {
		this.m_List.removeEventListener(eui.ItemTapEvent.ITEM_TAP, this.onClickList, this);
	}

	private getLvUpMsg() {
		let num = this.m_List.numChildren;
		for (var i = 0; i < num; i++) {
			let child = this.m_List.getChildAt(i);
			if (child && child instanceof GadLvUpItem) {
				child.playEff();
			}
		}
		this.playBodyEff();
		this.setData();
	}
	private setData() {
		let gadModel = GadModel.getInstance;
		let gadData: GadData = this.gadData;
		this.m_TipsLab.visible = false;
		this.m_GadItem.setData(gadData, false);
		let power = Math.floor(UserBag.getAttrPower(gadData.attr));
		this.m_Power.text = power;
		this.m_NameLab.text = gadData.itemConfig.name + " +" + gadData.level;
		this.m_PointLab.text = GlobalConfig.jifengTiaoyueLg.st100315 + gadData.slot;
		let allData = [];
		let needExp: number = 0;
		let noNeedHandle: number[] = [];
		for (var i = 0; i < 20; i++) {
			let lvUpSelectData: GadBagData = gadModel.lvUpSelectData.values[i];
			if (lvUpSelectData && !gadData.isLvMax && needExp < gadData.maxLvNeedExp) {
				allData.push(lvUpSelectData);
				needExp += lvUpSelectData.supexp;
			} else if (lvUpSelectData) {
				noNeedHandle.push(lvUpSelectData.handle)
				let noDataGadBag = new GadBagData();
				noDataGadBag.configID = -1;
				allData.push(noDataGadBag);
			}
			else {
				let noDataGadBag = new GadBagData();
				noDataGadBag.configID = -1;
				allData.push(noDataGadBag);
			}
		}
		for (var i = 0; i < noNeedHandle.length; i++) {
			gadModel.lvUpSelectData.remove(noNeedHandle[i]);

		}
		this.listData.replaceAll(allData);
		let expgold: { exp: number, gold: number } = gadModel.getNowSelectItemAllExpAndGold();
		let coalevelConfig = GlobalConfig.ins("COAlevelConfig")[gadData.itemConfig.quality][gadData.level];
		let maxExp: number = 0;
		if (coalevelConfig) {
			maxExp = coalevelConfig.exp;
		}
		this.m_ExpBar.maximum = maxExp;
		this.m_ExpBar.value = gadData.exp;
		this.m_ExpBar.m_ExpBar.maximum = maxExp;
		this.m_ExpBar.m_ExpBar.value = expgold.exp + gadData.exp
		this.m_LeftLvLab.text = "+" + gadData.level;
		AttributeData.setAttrGroup(this.gadData.mainAttr, this.m_LvLeftAttrGroup);
		AttributeData.setAttrGroup(this.gadData.lotAttr, this.m_LastAttrGroup);
		let nextCoalevelConfig = GlobalConfig.ins("COAlevelConfig")[gadData.itemConfig.quality][gadData.level + 1];
		if (nextCoalevelConfig) {
			if (gadModel.lvUpSelectData.length > 0) {
				this.m_ArrImg.visible = true;
				this.m_RightGroup.visible = true;
				this.m_RightLvLab.visible = true;
				this.m_LeftGroup.horizontalCenter = -121;
				this.m_MainBtnGroup.visible = true;
				this.m_FullLab.visible = false;
				let lvData: { lv: number, isbeyond: boolean } = gadModel.getUpLvNumBuyExp(gadData, expgold.exp);
				this.m_RightLvLab.text = "+" + lvData.lv;
				if ((lvData.lv % 3 == 0 || (lvData.lv - gadData.level) >= 3) && lvData.lv > gadData.level) {
					this.m_TipsLab.visible = true
					if (this.gadData.lotAttr.length >= 4) {
						this.m_TipsLab.text = GlobalConfig.jifengTiaoyueLg.st100320;
					} else {
						this.m_TipsLab.text = GlobalConfig.jifengTiaoyueLg.st100321;
					}
				}
				let coawordproduceConfig = GlobalConfig.ins("COAwordproduceConfig")[gadData.itemid];
				let wfb = coawordproduceConfig.mainlevelup * 0.0001;
				if (coawordproduceConfig) {
					let config = GlobalConfig.ins("COAmainwordConfig");
					let attr = [];
					let attrconfigData: any = config[gadData.mainId];
					if (attrconfigData) {
						let data = { type: attrconfigData.value[0].type, value: attrconfigData.value[0].value + (attrconfigData.value[0].value * wfb) * (lvData.lv) };
						attr.push(data);
					}
					if (lvData.lv > gadData.level) {
						AttributeData.setAttrGroup(attr, this.m_LvRightAttrGroup, 18, Color.Red);
					} else {
						AttributeData.setAttrGroup(this.gadData.mainAttr, this.m_LvRightAttrGroup, 18, Color.FontColor);
					}

				}
				this.setNeeItem(expgold.gold);
			} else {
				this.m_ArrImg.visible = false;
				this.m_RightGroup.visible = false;
				this.m_RightLvLab.visible = false;
				this.m_LeftGroup.horizontalCenter = 0;
				this.m_MainBtnGroup.visible = true;
				this.m_FullLab.visible = false;
				this.setNeeItem(0);
			}
		} else {
			this.m_ArrImg.visible = false;
			this.m_RightGroup.visible = false;
			this.m_RightLvLab.visible = false;
			this.m_LeftGroup.horizontalCenter = 0;
			this.m_MainBtnGroup.visible = false;
			this.m_FullLab.visible = true;
			this.m_ExpBar.maximum = 0;
			this.m_ExpBar.value = 0;
		}
		this.checkGuide();
	}

	private setNeeItem(gold) {
		let needItemData = [];
		let needData: { type: number, id: number, count: number } = { type: 0, id: 1, count: gold };
		needItemData.push(needData);
		UserBag.ins().setNeedItem(needItemData, this.m_NeedItemGroup);
	}
	private onClickLvUpBtn() {
		let gadModel = GadModel.getInstance;
		let expgold: { exp: number, gold: number } = gadModel.getNowSelectItemAllExpAndGold();
		let gold: number = GameLogic.ins().actorModel.gold;
		if (gold >= expgold.gold) {
			let handler: number[] = [];
			for (var i = 0; i < gadModel.lvUpSelectData.values.length; i++) {
				handler.push(gadModel.lvUpSelectData.values[i].handle);
			}
			if (handler.length > 0) {
				GadSproto.ins().sendGadLvUp(this.gadData.roleId, this.gadData.slot, handler);
			} else {
				UserTips.ins().showTips(GlobalConfig.jifengTiaoyueLg.st100322);
			}

		} else {
			UserTips.ins().showTips(GlobalConfig.jifengTiaoyueLg.st100323);
		}
	}
	private onClickList() {
		ViewManager.ins().open(GadLvUpSelectWin);
	}
	private onClickClose() {
		ViewManager.ins().close(this);
	}

	private m_BodyEff: MovieClip;
	private m_BodyEff0: MovieClip;
	private m_UpLvEff: MovieClip;
	private m_ItemEff: MovieClip;
	private playBodyEff() {
		this.m_BodyEff = ViewManager.ins().createEff(this.m_BodyEff, this.m_BodyEffGrouo, "eff_ui_upgrade");
		this.m_BodyEff0 = ViewManager.ins().createEff(this.m_BodyEff0, this.m_BodyEffGrouo0, "eff_ui_iconUpgrade");
		this.m_UpLvEff = ViewManager.ins().createEff(this.m_UpLvEff, this.m_LvUpEffGroup, "eff_ui_success");
		this.m_ItemEff = ViewManager.ins().createEff(this.m_ItemEff, this.m_ItemEffGroup, "eff_ui_icon");
	}

	private checkGuide() {
		if (Setting.currPart == 20 && Setting.currStep == 6) {
			this.m_GuideGadLvUpItem.visible = true;
			this.m_GuideGadLvUpItem.guideSet();
			GuideUtils.ins().show(this.m_GuideGadLvUpItem, 20, 6);
			this.m_GuideGadLvUpItem.addEventListener(egret.TouchEvent.TOUCH_TAP, this.nextGuide, this, true, 10);
		} else {
			this.m_GuideGadLvUpItem.visible = false;
		}
		if (Setting.currPart == 20 && Setting.currStep == 9) {
			GuideUtils.ins().show(this.m_UpLvBtn, 20, 9);
			this.m_UpLvBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.nextGuide2, this, true, 10);
		}
		if (Setting.currPart == 20 && Setting.currStep == 10) {
			GuideUtils.ins().show(this.m_bg.closeButtomBtn, 20, 10);
			this.m_bg.closeButtomBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.nextGuide3, this, true, 10);
		}
	}

	private nextGuide() {
		GuideUtils.ins().next(this.m_GuideGadLvUpItem);
		ViewManager.ins().open(GadLvUpSelectWin);
		this.m_GuideGadLvUpItem.visible = false;
		this.m_GuideGadLvUpItem.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.nextGuide, this, true);
	}

	private nextGuide2() {
		GuideUtils.ins().next(this.m_UpLvBtn);
		this.m_UpLvBtn.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.nextGuide2, this, true);
	}

	private nextGuide3() {
		GuideUtils.ins().next(this.m_bg.closeButtomBtn);
		GameGlobal.MessageCenter.dispatch(GadEvent.GAD_GUIDEEND_MSG);
		this.m_bg.closeButtomBtn.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.nextGuide3, this, true);
	}
}
ViewManager.ins().reg(GadLvUpWin, LayerManager.UI_Popup);
window["GadLvUpWin"] = GadLvUpWin