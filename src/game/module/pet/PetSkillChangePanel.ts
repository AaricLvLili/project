class PetSkillChangePanel extends BaseView implements ICommonWindowTitle {
	windowTitleIconName?: string;
	mWindowHelpId = 30;
	public constructor(data?: any) {
		super();
		this.name = GlobalConfig.jifengTiaoyueLg.st101140;
		this.windowTitleIconName = GlobalConfig.jifengTiaoyueLg.st101140;
		this.skinName = "PetSkillChangePanelSkin";
		this.touchEnabled = false;
	}
	public m_ShuoSkillNumLab: eui.Label;
	public m_SureChangeBtn: eui.Button;
	public m_SkillChangeBtn: eui.Button;
	public m_AutoBuy: eui.CheckBox;
	public m_ItemNum: eui.Label;
	public m_Scroller: eui.Scroller;
	public m_List: eui.List;
	private m_ListData: eui.ArrayCollection;
	public m_ItemImg: eui.Image;
	public m_SkillChangeRedPoint: eui.Image;


	private m_ShuoYbNum: number = 0;

	private static isTips: boolean = false;

	public getItem: eui.Label;

	private isShowRedPoint: boolean = true;
	public m_Lan1: eui.Label;
	public m_Lan2: eui.Label;
	public m_Lan3: eui.Label;
	public m_EffGroup: eui.Group;
	public m_ItemEffGroup: eui.Group;

	protected childrenCreated() {
		super.childrenCreated();
		this.m_List.itemRenderer = PetSkillChangeItem;
		this.m_ListData = new eui.ArrayCollection();
		this.m_List.dataProvider = this.m_ListData;
		UIHelper.SetLinkStyleLabel(this.getItem);
		this.m_AutoBuy.label = GlobalConfig.jifengTiaoyueLg.st101147;
		this.getItem.text = GlobalConfig.jifengTiaoyueLg.st100418;
		this.m_SkillChangeBtn.label = GlobalConfig.jifengTiaoyueLg.st101139;
		this.m_SureChangeBtn.label = GlobalConfig.jifengTiaoyueLg.st101148;
		this.m_Lan1.text = GlobalConfig.jifengTiaoyueLg.st100022;
		this.m_Lan2.text = GlobalConfig.jifengTiaoyueLg.st101149;
		this.m_Lan3.text = GlobalConfig.jifengTiaoyueLg.st101150;
	};
	private addViewEvent() {
		this.observe(PetEvt.PET_CHANGEWASHSKILL_MSG, this.initData);
		this.observe(PetEvt.PET_CHANGEWASHSKILLEFF_MSG, this.playUpEff);
		this.observe(MessageDef.BAG_HAS_ITEM_CAN_USE, this.initData);
		this.AddClick(this.m_SureChangeBtn, this.onClickSureChangeBtn);
		this.AddClick(this.m_SkillChangeBtn, this.onClickSkillChange);
		this.AddClick(this.getItem, this.onClickGetLab);

	}
	public open() {
		this.isShowRedPoint = true;
		this.addViewEvent();
		this.initData();
	};
	public close() {
		GameGlobal.MessageCenter.dispatch(PetEvt.PET_SKILLCHANG_CLOSE);
	};

	public release() {
		if (this.m_ItemEff) {
			DisplayUtils.dispose(this.m_ItemEff)
			this.m_ItemEff = null;
		}
		if (this.m_NewEff) {
			DisplayUtils.dispose(this.m_NewEff)
			this.m_ItemEff = null;
		}
	}
	private initData() {
		this.setListData();
		this.setData()
	}

	private setData() {
		let petModel = PetModel.getInstance;
		let petData = petModel.getNowSelectPetData();
		let shuoNum = 0;
		for (var i = 0; i < petData.lock.length; i++) {
			for (var f = 0; f < petData.bskill.length; f++) {
				if (petData.lock[i] == petData.bskill[f]) {
					shuoNum += 1;
				}
			}
		}
		let petBasicConfig = GlobalConfig.ins("PetBasicConfig");
		let shuoYbNum = petBasicConfig.bSkillFusionCost.count * shuoNum;
		this.m_ShuoYbNum = shuoYbNum;
		this.m_ShuoSkillNumLab.text = LanguageString.jifengTiaoyueCh(GlobalConfig.jifengTiaoyueLg.st101141, [shuoNum, shuoYbNum]);
		let itemConfig = GlobalConfig.ins("ItemConfig")[petBasicConfig.cost.id];
		if (itemConfig) {
			this.m_ItemImg.source = itemConfig.icon + "_png";
		}
		let itemNum = UserBag.ins().getBagGoodsCountById(0, petBasicConfig.cost.id);
		this.m_ItemNum.text = itemNum + "/" + petBasicConfig.cost.count;
		if (petData.isCanSkillChange && this.isShowRedPoint) {
			this.m_SkillChangeRedPoint.visible = true;
		} else {
			this.m_SkillChangeRedPoint.visible = false;
		}
	}

	private onClickGetLab() {
		let petBasicConfig = GlobalConfig.ins("PetBasicConfig");
		UserWarn.ins().setBuyGoodsWarn(petBasicConfig.cost.id);
	}

	private setListData() {
		let petModel = PetModel.getInstance;
		let petData = petModel.getNowSelectPetData();
		let skillDatas = [];
		for (var i = 0; i < petModel.petSkillMaxNum; i++) {
			let washSkill = petData.wash[i];
			let skill = petData.bskill[i];
			let isShuo = false;
			for (var f = 0; f < petData.lock.length; f++) {
				if (petData.lock[f] == skill) {
					isShuo = true;
					break;
				}
			}
			let skillData = { skill: skill, washSkill: washSkill, isShuo: isShuo }
			skillDatas.push(skillData);
		}
		this.m_ListData.replaceAll(skillDatas);
	}

	private onClickSureChangeBtn() {
		let petModel = PetModel.getInstance;
		let petData = petModel.getNowSelectPetData();
		if (petData.wash && petData.wash.length > 0) {
			WarnWin.show(GlobalConfig.jifengTiaoyueLg.st101991, function () {
				PetSproto.ins().sendPetWashrepMsg(petData.petid);
			}, this);
		} else {
			UserTips.ins().showTips(GlobalConfig.jifengTiaoyueLg.st101142);
		}
	}
	private onClickSkillChange() {
		this.isShowRedPoint = false;
		let petModel = PetModel.getInstance;
		let petData = petModel.getNowSelectPetData();
		let shuoNum = petData.lock.length;
		if (shuoNum == petModel.petSkillMaxNum) {
			UserTips.ins().showTips(GlobalConfig.jifengTiaoyueLg.st101143);
			return;
		}
		let yb: number = GameLogic.ins().actorModel.yb;
		if (yb < this.m_ShuoYbNum) {
			UserTips.ins().showTips(GlobalConfig.jifengTiaoyueLg.st101144);
			return;
		}
		let petBasicConfig = GlobalConfig.ins("PetBasicConfig");
		let itemNum = UserBag.ins().getBagGoodsCountById(0, petBasicConfig.cost.id);
		if (this.m_AutoBuy.selected == false) {
			if (itemNum < petBasicConfig.cost.count) {
				UserTips.ins().showTips(GlobalConfig.jifengTiaoyueLg.st101145);
				return;
			}
			PetSproto.ins().sendPetWash(petData.petid, false);
		} else if (this.m_AutoBuy.selected == true) {
			let yb = ItemStoreConfig.getStoreByItemID(petBasicConfig.cost.id).price * petBasicConfig.cost.count;
			if (itemNum >= petBasicConfig.cost.count) {
				PetSproto.ins().sendPetWash(petData.petid, false);
				return;
			} else if (Checker.Money(MoneyConst.yuanbao, yb, Checker.YUNBAO_FRAME)) {
				//身上钻石还足够
				if (PetSkillChangePanel.isTips == false) {
					PetSkillChangePanel.isTips = true;
					WarnWin.show(LanguageString.jifengTiaoyueCh(GlobalConfig.jifengTiaoyueLg.st101146, [yb]), function () {
						PetSproto.ins().sendPetWash(petData.petid, true);
					}, this)
				} else {
					PetSproto.ins().sendPetWash(petData.petid, true);
				}
				return;
			}
		}
	}
	private m_ItemEff: MovieClip;
	private m_NewEff: MovieClip;
	public playUpEff() {
		this.m_ItemEff = ViewManager.ins().createEff(this.m_ItemEff, this.m_ItemEffGroup, "eff_ui_success");
		this.m_NewEff = ViewManager.ins().createEff(this.m_NewEff, this.m_EffGroup, "eff_ui_upgrade");
	}
	UpdateContent(): void {

	}

}
window["PetSkillChangePanel"] = PetSkillChangePanel