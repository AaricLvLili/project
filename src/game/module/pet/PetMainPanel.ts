class PetMainPanel extends BaseView implements ICommonWindowTitle {
	windowTitleIconName?: string;
	mWindowHelpId = 31;
	public constructor(data?: any) {
		super();
		this.name = GlobalConfig.jifengTiaoyueLg.st101089;
		this.windowTitleIconName = GlobalConfig.jifengTiaoyueLg.st101089;
		this.skinName = "PetMainPanelSkin";
		this.touchEnabled = false;
	}
	public m_PetSmeltBtn: eui.Button;
	public m_PetDebrisBtn: eui.Button;
	public m_PetAllShowBtn: eui.Button;
	public m_PetAwakeingBtn: eui.Button;
	windowCommonBg = "pic_bj_20_png"
	public m_Scroller: eui.Scroller;
	public m_List: eui.List;
	public m_RightBtn: eui.Button;
	public m_RightBtnRedPoint: eui.Image;
	public m_LeftBtn: eui.Button;
	public m_LeftBtnRedPoint: eui.Image;
	public m_PetAnim: PetAnim;
	public m_PetStateBtn: eui.Image;
	public m_PetAllAddBtn: eui.Image;
	public m_FightNumLab: eui.Label;
	public m_ActivateNumLab: eui.Label;
	public m_ActivateGroup: eui.Group;
	public m_PetMainSkill: PetSkillItem;
	public m_AutoBuyBox: eui.CheckBox;
	public m_UpLvBtn: eui.Button;
	public m_AutoUpLvBtn: eui.Button;
	public m_BattleBtn: eui.Button;
	public m_UpStarBtn: eui.Button;
	public m_ChangeName: eui.Button;
	public m_NoActivateGroup: eui.Group;
	public m_ScrollerSkill: eui.Scroller;
	public m_ListSkill: eui.List;
	public m_RightBtnSkill: eui.Button;
	public m_LeftBtnSkill: eui.Button;
	public m_ActivateBtn: eui.Button;
	public getItem: eui.Label;

	public m_ExpBar: eui.ProgressBar;

	public m_NeedItemGroup: eui.Group;

	private m_ListData: eui.ArrayCollection;
	private m_ListSkillData: eui.ArrayCollection;

	public m_BodyEffGrouo: eui.Group;
	public m_LvUpEffGroup: eui.Group;

	public m_LvBtnRedPoint: eui.Image;
	public m_ActivateBtnRedPoint: eui.Image;
	public m_StarUpBtnRedPoint: eui.Image;


	_isAutoUp: boolean = false

	private oldselectIndex: number = 0;

	private isChangeHV: boolean = false;
	public m_Lan2: eui.Label;
	public m_Lan1: eui.Label;
	public m_Lan3: eui.Label;
	public m_Lan4: eui.Label;
	public m_Lan5: eui.Label;

	public m_MainSkillGroup: eui.Group;
	public m_NeedItem: MainNeedItem;

	// public m_ItemList:eui.List;
	// public m_NameLab:eui.Label;
	// public m_NeedItemLab:eui.Label;
	// public m_GetLab:eui.Label;

	protected childrenCreated() {
		super.childrenCreated();
		this.m_List.itemRenderer = PetIconItem;
		this.m_ListData = new eui.ArrayCollection();
		this.m_List.dataProvider = this.m_ListData;

		this.m_ListSkill.itemRenderer = PetSkillIconItem;
		this.m_ListSkillData = new eui.ArrayCollection();
		this.m_ListSkill.dataProvider = this.m_ListSkillData;

		this.m_BodyEffGrouo.touchEnabled = false;
		this.m_LvUpEffGroup.touchEnabled = false;

		this.getItem.text = GlobalConfig.jifengTiaoyueLg.st100418;
		UIHelper.SetLinkStyleLabel(this.getItem);

		this.m_Lan1.text = GlobalConfig.jifengTiaoyueLg.st101100;
		this.m_Lan2.text = GlobalConfig.jifengTiaoyueLg.st101101;
		this.m_Lan3.text = GlobalConfig.jifengTiaoyueLg.st101102;
		this.m_Lan4.text = GlobalConfig.jifengTiaoyueLg.st101109;
		this.m_Lan5.text = GlobalConfig.jifengTiaoyueLg.st100218;
		this.m_UpLvBtn.label = GlobalConfig.jifengTiaoyueLg.st101103
		this.m_AutoUpLvBtn.label = GlobalConfig.jifengTiaoyueLg.st101104
		this.m_AutoBuyBox.label = GlobalConfig.jifengTiaoyueLg.st101105
		this.m_BattleBtn.label = GlobalConfig.jifengTiaoyueLg.st101106
		this.m_UpStarBtn.label = GlobalConfig.jifengTiaoyueLg.st101107
		this.m_ChangeName.label = GlobalConfig.jifengTiaoyueLg.st101108
		this.m_ActivateBtn.label = GlobalConfig.jifengTiaoyueLg.st100212;


	};
	private addViewEvent() {
		this.observe(PetEvt.PET_DATAUPDATE_MSG, this.initData);
		this.observe(PetEvt.PET_LVUP_MSG, this.playBodyEff);
		this.observe(PetEvt.PET_GUIDE_MSG, this.guideLvUp);
		this.observe(PetEvt.PET_DEBRIS_MSG, this.initData);
		this.observe(MessageDef.BAG_HAS_ITEM_CAN_USE, this.initData);
		this.AddClick(this.m_ActivateBtn, this.onClickActivateBtn);
		this.AddClick(this.m_BattleBtn, this.onClickFight);
		this.AddClick(this.m_UpStarBtn, this.onClickUpStar);
		this.AddClick(this.m_UpLvBtn, this.onClickLv);
		this.AddClick(this.m_AutoUpLvBtn, this.btnAutoUpClick);
		this.AddClick(this.m_ChangeName, this.onClickChangeName);
		this.AddClick(this.m_PetStateBtn, this.onClickState);
		this.AddClick(this.m_PetAllAddBtn, this.onClickAllAddBtn);
		this.AddClick(this.m_PetSmeltBtn, this.onClickSmeltBtn);
		this.AddClick(this.m_PetAllShowBtn, this.onClickAllShowBtn);
		this.AddClick(this.m_LeftBtn, this.onClickLeftBtn);
		this.AddClick(this.m_RightBtn, this.onClickRightBtn);
		this.AddClick(this.m_PetDebrisBtn, this.onClickPetDebrisBtn);
		this.AddClick(this.getItem, this.onClickGetLab1);
		this.AddClick(this.m_PetAwakeingBtn, this.onClickAwakeingBtn);
		this.m_Scroller.addEventListener(egret.Event.CHANGE, this.onSaveScrData, this);
		this.AddClick(this.m_MainSkillGroup, this.onClickMainSkill);
		this.m_NeedItem.addEvent();

	}
	private removeEvent() {
		this.m_NeedItem.removeEvent();
		this.m_Scroller.removeEventListener(egret.Event.CHANGE, this.onSaveScrData, this);
	}

	public open() {
		this.addViewEvent();
		this.initData();
		PetModel.getInstance.allResonanceAttr();
	};
	public close() {
		this.stopAutoUp();
		this.removeEvent();
		if (this.m_BodyEff) {
			DisplayUtils.dispose(this.m_BodyEff);
			this.m_BodyEff = null;
		}
		if (this.m_UpLvEff) {
			DisplayUtils.dispose(this.m_UpLvEff);
			this.m_UpLvEff = null;
		}
	};

	public release() {
		this.removeEvent();
		this.m_PetAnim.release();
		if (this.m_BodyEff) {
			DisplayUtils.dispose(this.m_BodyEff);
			this.m_BodyEff = null;
		}
		if (this.m_UpLvEff) {
			DisplayUtils.dispose(this.m_UpLvEff);
			this.m_UpLvEff = null;
		}
	}
	private onSaveScrData() {
		if (this.m_Scroller && this.m_Scroller.viewport) {
			PetModel.getInstance.scrollH = this.m_Scroller.viewport.scrollH;
		}
		this.setListRedPoint();
	}

	private initData() {
		this.setPetListData();
		this.setPetData();
		this.checkDebrisRedPoint();
	}

	private setPetData() {
		let petModel = PetModel.getInstance;
		let petData = petModel.getNowSelectPetData();
		if (petData) {
			let petConfig = GlobalConfig.ins("PetConfig")[petData.petid];
			this.m_FightNumLab.text = petModel.getAllPetPower() + "";
			this.m_ActivateNumLab.text = petModel.getAllPetActivate() + "";
			if (this.oldselectIndex != petModel.selectIndex) {
				this.stopAutoUp();
				this.oldselectIndex = petModel.selectIndex;
			}
			if (petData && petConfig) {
				this.m_PetAnim.setPetData(petData.petid);
				if (petData.isActivate) {
					this.m_ActivateGroup.visible = true;
					this.m_NoActivateGroup.visible = false;
				} else {
					this.m_ActivateGroup.visible = false;
					this.m_NoActivateGroup.visible = true;
					this.m_NeedItem.setData(petConfig.activationItem, 1);
					let allSkillList = [];
					let petSkillDataMain = { id: petData.skill, type: 1 };
					allSkillList.push(petSkillDataMain);
					for (var i = 0; i < petData.bskill.length; i++) {
						let petSkillData = { id: petData.bskill[i], type: 2 };
						allSkillList.push(petSkillData);
					}
					this.m_ListSkillData.replaceAll(allSkillList);
					if (this.m_ScrollerSkill && this.m_ScrollerSkill.viewport) {
						this.m_ScrollerSkill.viewport.scrollH = 0;
					}
				}
				let petLevelExpConfig = GlobalConfig.ins("PetLevelExpConfig")[petData.level];
				if (petLevelExpConfig) {
					if (this.m_ExpBar.maximum > petLevelExpConfig.exp) {
						this.m_ExpBar.slideDuration = 0
					}
					this.m_ExpBar.maximum = petLevelExpConfig.exp;
					this.m_ExpBar.value = petData.exp;
					if (this.m_ExpBar.slideDuration == 0) {
						this.m_ExpBar.slideDuration = 500;
					}
					let needItemData = [{ type: 1, id: petLevelExpConfig.itemId, count: petLevelExpConfig.itemNum }];
					UserBag.ins().setNeedItem(needItemData, this.m_NeedItemGroup);
				}
				this.m_PetMainSkill.setData(petData.skill, 1);
				if (petData.isCanLvUp) {
					this.m_LvBtnRedPoint.visible = true;
				} else {
					this.m_LvBtnRedPoint.visible = false;
				}
				if (petData.isCanActivate) {
					this.m_ActivateBtnRedPoint.visible = true;
				} else {
					this.m_ActivateBtnRedPoint.visible = false;
				}
				if (petData.isCanStarUp) {
					this.m_StarUpBtnRedPoint.visible = true;
				} else {
					this.m_StarUpBtnRedPoint.visible = false;
				}
				this.m_PetAwakeingBtn["redPoint"].visible = petData.isCanAwakening;
			}
			this.setListRedPoint();
			this.checkGuide();
			this.checkStarGuide();
		}
	}

	private setPetListData() {
		let petModel = PetModel.getInstance;
		let petDatas = petModel.getSoltPetData();
		this.m_ListData.replaceAll(petDatas);
		if (this.m_Scroller && this.m_Scroller.viewport) {
			this.m_Scroller.viewport.scrollH = petModel.scrollH;
		}
	}

	private onClickActivateBtn() {
		let petModel = PetModel.getInstance;
		let petData = petModel.getNowSelectPetData();
		let petConfig = GlobalConfig.ins("PetConfig")[petData.petid];
		let itemData = GlobalConfig.ins("ItemConfig")[petConfig.activationItem];
		let itemNum = UserBag.ins().getBagGoodsCountById(0, petConfig.activationItem);
		GuideUtils.ins().next(this.m_ActivateBtn);
		if (itemNum >= 1) {
			PetSproto.ins().sendPetActivate(petData.petid);
		} else {
			UserTips.ins().showTips(GlobalConfig.jifengTiaoyueLg.st101093);
		}
	}
	private onClickFight() {
		GuideUtils.ins().next(this.m_BattleBtn);
		ViewManager.ins().open(PetBattlePop)
	}
	private onClickUpStar() {
		let petModel = PetModel.getInstance;
		let petData = petModel.getNowSelectPetData();
		ViewManager.ins().open(PetStarWin, petData);
	}

	private onClickLv() {
		let petModel = PetModel.getInstance;
		let petData = petModel.getNowSelectPetData();
		let petLevelExpConfig = GlobalConfig.ins("PetLevelExpConfig")[petData.level];
		GuideUtils.ins().next(this.m_UpLvBtn);
		if (petData.level >= GameLogic.ins().actorModel.level) {
			return UserTips.ins().showTips(GlobalConfig.jifengTiaoyueLg.st101094);
		}
		if (petLevelExpConfig) {
			let itemNum = UserBag.ins().getBagGoodsCountById(0, petLevelExpConfig.itemId);
			if (itemNum >= petLevelExpConfig.itemNum) {
				PetSproto.ins().sendPetUpLevelMsg(petData.petid, false);
			} else {
				if (this.m_AutoBuyBox.selected == true) {
					let lastitemNum = petLevelExpConfig.itemNum - itemNum;
					if (Checker.Money(MoneyConst.yuanbao, ItemStoreConfig.getStoreByItemID(petLevelExpConfig.itemId).price * petLevelExpConfig.itemNum, Checker.YUNBAO_FRAME)) {
						//身上钻石还足够
						PetSproto.ins().sendPetUpLevelMsg(petData.petid, true);
						return;
					}
				}
				else {
					UserWarn.ins().setBuyGoodsWarn(petLevelExpConfig.itemId, petLevelExpConfig.itemNum - itemNum);
				}
				// UserTips.ins().showTips(GlobalConfig.languageConfig.st101095);
			}
		}
	}

	btnAutoUpClick() {
		if (this._isAutoUp) {
			this.stopAutoUp();
		}
		else {
			this._isAutoUp = true;
			this.m_AutoUpLvBtn.label = GlobalConfig.jifengTiaoyueLg.st101096;
			TimerManager.ins().doTimer(150 * 4, 0, this.autoUpStar, this);
		}
	}

	stopAutoUp() {
		this._isAutoUp = false;
		this.m_AutoUpLvBtn.label = GlobalConfig.jifengTiaoyueLg.st101097;
		TimerManager.ins().remove(this.autoUpStar, this);
	};
	autoUpStar() {
		let petModel = PetModel.getInstance;
		let petData = petModel.getNowSelectPetData();
		let nextPetLevelExpConfig = GlobalConfig.ins("PetLevelExpConfig")[petData.level + 1];
		let petLevelExpConfig = GlobalConfig.ins("PetLevelExpConfig")[petData.level];
		if (nextPetLevelExpConfig == null && petData.exp == petLevelExpConfig.exp) {
			this._isAutoUp = false;
			this.m_AutoUpLvBtn.label = GlobalConfig.jifengTiaoyueLg.st101097;
			TimerManager.ins().remove(this.autoUpStar, this);
			UserTips.ins().showTips(GlobalConfig.jifengTiaoyueLg.st101098);
			return;
		}
		if (petData.level >= GameLogic.ins().actorModel.level) {
			this._isAutoUp = false;
			this.m_AutoUpLvBtn.label = GlobalConfig.jifengTiaoyueLg.st101097;
			TimerManager.ins().remove(this.autoUpStar, this);
			return UserTips.ins().showTips(GlobalConfig.jifengTiaoyueLg.st101099);
		}
		let itemNum = UserBag.ins().getBagGoodsCountById(0, petLevelExpConfig.itemId);
		if (itemNum >= petLevelExpConfig.itemNum) {
			PetSproto.ins().sendPetUpLevelMsg(petData.petid, true);
		}
		else {
			//勾选了自动购买材料，先去用钻石购买材料
			if (this.m_AutoBuyBox.selected == true) {
				let lastitemNum = petLevelExpConfig.itemNum - itemNum;
				if (Checker.Money(MoneyConst.yuanbao, ItemStoreConfig.getStoreByItemID(petLevelExpConfig.itemId).price * petLevelExpConfig.itemNum, Checker.YUNBAO_FRAME)) {
					//身上钻石还足够
					PetSproto.ins().sendPetUpLevelMsg(petData.petid, true);
					return;
				}
			}
			else {
				UserWarn.ins().setBuyGoodsWarn(petLevelExpConfig.itemId, petLevelExpConfig.itemNum - itemNum);
			}
			this._isAutoUp = false;
			this.m_AutoUpLvBtn.label = GlobalConfig.jifengTiaoyueLg.st101097;
			TimerManager.ins().remove(this.autoUpStar, this);
		}
	};

	private onClickChangeName() {
		let petModel = PetModel.getInstance;
		let petData = petModel.getNowSelectPetData();
		ViewManager.ins().open(PetNameWin, petData);
	}

	private onClickState() {
		let petModel = PetModel.getInstance;
		let petData = petModel.getNowSelectPetData();
		ViewManager.ins().open(PetStateWin, petData);
	}

	private onClickAllAddBtn() {
		let petModel = PetModel.getInstance;
		let petData = petModel.getNowSelectPetData();
		ViewManager.ins().open(PetAllAddWin, petData);
	}

	private onClickSmeltBtn() {
		ViewManager.ins().open(PetDebrisWin, 1);
	}

	private onClickAllShowBtn() {
		ViewManager.ins().open(PetAllShowWin);
	}

	private m_BodyEff: MovieClip;
	private m_UpLvEff: MovieClip;
	private playBodyEff() {
		this.m_BodyEff = ViewManager.ins().createEff(this.m_BodyEff, this.m_BodyEffGrouo, "eff_ui_bodyUpgrade");
		this.m_UpLvEff = ViewManager.ins().createEff(this.m_UpLvEff, this.m_LvUpEffGroup, "eff_ui_success");
	}


	private onClickGetLab() {
		let petModel = PetModel.getInstance;
		let petData = petModel.getNowSelectPetData();
		let petConfig = GlobalConfig.ins("PetConfig")[petData.petid];
		if (petConfig) {
			UserWarn.ins().setBuyGoodsWarn(petConfig.activationItem);
		}
	}

	private onClickGetLab1() {
		let petModel = PetModel.getInstance;
		let petData = petModel.getNowSelectPetData();
		let nextPetLevelExpConfig = GlobalConfig.ins("PetLevelExpConfig")[petData.level + 1];
		let petLevelExpConfig = GlobalConfig.ins("PetLevelExpConfig")[petData.level];
		if (petLevelExpConfig) {
			UserWarn.ins().setBuyGoodsWarn(petLevelExpConfig.itemId);
		}
	}

	private oneIconWidth: number = 68;

	private setListRedPoint() {
		let oneIconWidth = this.oneIconWidth;
		let petModel = PetModel.getInstance;
		if (petModel.scrollH > oneIconWidth) {
			this.m_LeftBtn.visible = true;
		} else {
			this.m_LeftBtn.visible = false;
		}
		let len = petModel.petDic.values.length;
		if (petModel.scrollH < ((len - 6) * oneIconWidth)) {
			this.m_RightBtn.visible = true;
		} else {
			this.m_RightBtn.visible = false;
		}
		let petDatas = petModel.getSoltPetData();
		let leftLen = Math.ceil(petModel.scrollH / oneIconWidth);
		this.m_LeftBtnRedPoint.visible = false;
		for (var i = 0; i < leftLen; i++) {
			let petData = petDatas[i];
			if (petData) {
				if (petData.isCanLvUp || petData.isCanStarUp || petData.isCanActivate || petData.isCanAwakening) {
					this.m_LeftBtnRedPoint.visible = true;
					break;
				}
			}
		}
		let maxWidth = (len - 6) * oneIconWidth;
		this.m_RightBtnRedPoint.visible = false;
		let righeLen = len - Math.floor((maxWidth - petModel.scrollH) / oneIconWidth);
		for (var i = righeLen - 1; i < len; i++) {
			let petData = petDatas[i];
			if (petData) {
				if (petData.isCanLvUp || petData.isCanStarUp || petData.isCanActivate || petData.isCanAwakening) {
					this.m_RightBtnRedPoint.visible = true;
					break;
				}
			}
		}
	}

	public guideLvUp() {
		let petModel = PetModel.getInstance;
		if (petModel.checkGuideLvUp() && petModel.selectIndex == petModel.guidePeiId && PetNewWin.isOpen == false) {
			if (this.m_Scroller && this.m_Scroller.viewport) {
				this.m_Scroller.viewport.scrollH = PetModel.getInstance.scrollH = 0;
			}
			PetWin.isSaveGuide = true;
			GuideUtils.ins().show(this.m_UpLvBtn, 16, 0);
		}
	}
	/**这是检查与引导相关的 */
	private checkGuide() {
		if (UserFb.ins().guanqiaID != GuideQuanQiaType.PET) {
			return;
		}
		let petModel = PetModel.getInstance;
		if (petModel.checkGuideFirstPet() && this.isChangeHV == false) {
			let petDatas = petModel.getSoltPetData();
			let guidePeiIdIndex: number;
			for (var i = 0; i < petDatas.length; i++) {
				let petData = petDatas[i];
				if (petData.petid == petModel.guidePeiId) {
					guidePeiIdIndex = i;
					break;
				}
			}
			this.isChangeHV = true;
			let width = guidePeiIdIndex * 68 - 6;
			let maxWidth = (petDatas.length - 6) * 68 - 6;
			if (width > maxWidth) {
				width = maxWidth;
			}
			if (this.m_Scroller && this.m_Scroller.viewport) {
				this.m_Scroller.viewport.scrollH = PetModel.getInstance.scrollH = width;
			}
		}
		if (petModel.checkGuideFirstPet() && petModel.selectIndex == petModel.guidePeiId) {
			Setting.currPart = 14;
			Setting.currStep = 5;
			PetWin.isSaveGuide = true;
			GuideUtils.ins().show(this.m_ActivateBtn, 14, 5);
		}
		this.guideLvUp();
		if (petModel.checkGuideBattle() && petModel.selectIndex == petModel.guidePeiId && Setting.currPart == 17 && Setting.currStep == 0) {
			PetWin.isSaveGuide = true;
			GuideUtils.ins().show(this.m_BattleBtn, 17, 0);
		}

	}

	private checkStarGuide() {
		if (PetModel.getInstance.checkGuideStar() && Setting.currPart == 27 && Setting.currStep == 1) {
			PetWin.isSaveGuide = true;
			GuideUtils.ins().show(this.m_UpStarBtn, 27, 1);
			this.m_UpStarBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onClickStarGuide, this, true, 10);
		}
	}

	private onClickStarGuide() {
		GuideUtils.ins().next(this.m_UpStarBtn);
		this.m_UpStarBtn.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onClickStarGuide, this, true);
	}

	UpdateContent(): void {

	}

	private onClickLeftBtn() {
		let nowPoint = PetModel.getInstance.scrollH;
		let nextPoibt = nowPoint - (6 * 68);
		if (nextPoibt <= 0) {
			nextPoibt = 0;
		}
		if (this.m_Scroller && this.m_Scroller.viewport) {
			this.m_Scroller.viewport.scrollH = PetModel.getInstance.scrollH = nextPoibt;
		}
	}

	private onClickRightBtn() {
		let petModel = PetModel.getInstance;
		let petDatas = petModel.getSoltPetData();
		let maxWidth = (petDatas.length - 6) * 68 - 6;
		let nowPoint = PetModel.getInstance.scrollH;
		let nextPoibt = nowPoint + (6 * 68);
		if (nextPoibt > maxWidth) {
			nextPoibt = maxWidth;
		}
		if (this.m_Scroller && this.m_Scroller.viewport) {
			this.m_Scroller.viewport.scrollH = PetModel.getInstance.scrollH = nextPoibt;
		}
	}

	private onClickPetDebrisBtn() {
		ViewManager.ins().open(PetDebrisWin);
	}

	private checkDebrisRedPoint() {
		this.m_PetDebrisBtn["redPoint"].visible = PetModel.getInstance.checkAllPetDebrisRedPoint();
	}

	private onClickAwakeingBtn() {
		ViewManager.ins().open(PetAwakeningWin);
	}

	private onClickMainSkill() {
		let petModel = PetModel.getInstance;
		let petData = petModel.getNowSelectPetData();
		if (petData.isActivate) {
			ViewManager.ins().open(PetSkillMainWin, petData);
		} else {
			UserTips.ins().showTips(GlobalConfig.jifengTiaoyueLg.st101138);
		}
	}
}
window["PetMainPanel"] = PetMainPanel