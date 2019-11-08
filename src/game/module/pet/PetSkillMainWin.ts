class PetSkillMainWin extends BaseEuiPanel {
	public constructor() {
		super()
		this.skinName = "PetSkillMainWinSkin";
	}

	public m_PetSkillItem: PetSkillItem;
	public m_LvUpGroup: eui.Group;
	public m_LvUpBtn: eui.Button;
	public m_Cont1: eui.Label;
	public m_Cont2: eui.Label;
	public m_LvFullLab: eui.Label;
	public m_SkillLvLab: eui.Label;


	public m_NextContGroup: eui.Group;
	private needItemId: number;

	public m_NeedItem: MainNeedItem;
	public m_AutoBuy: eui.CheckBox;

	public createChildren() {
		super.createChildren();
		this.m_bg.init(`PetSkillMainWin`, GlobalConfig.jifengTiaoyueLg.st101953);
		this.m_AutoBuy.label = GlobalConfig.jifengTiaoyueLg.st101147;
	}
	initUI() {
		super.initUI();
	}
	open(...param: any[]) {
		this.setData();
		this.addViewEvent();
	}
	close() {
		this.release();
	}
	public release() {
		DisplayUtils.dispose(this.m_NewEff);
		this.m_NewEff = null;
		DisplayUtils.dispose(this.m_ItemEff);
		this.m_ItemEff = null;
		DisplayUtils.dispose(this.m_SkillEff);
		this.m_SkillEff = null;
		this.removeViewEvent();
	}
	private addViewEvent() {
		this.m_NeedItem.addEvent();
		this.AddClick(this.m_LvUpBtn, this.onClickLvUp);
		this.observe(PetEvt.PET_DATAUPDATE_MSG, this.setData)
		this.observe(MessageDef.BAG_HAS_ITEM_CAN_USE, this.setData);
	}
	private removeViewEvent() {
		this.m_NeedItem.removeEvent();
	}
	private setData() {
		let petModel = PetModel.getInstance;
		let petData = petModel.getNowSelectPetData();
		let skillstr = petData.skill.toString();
		let skillLvStr = skillstr.slice(skillstr.length - 3, skillstr.length);
		let skillLv = parseInt(skillLvStr);
		this.m_SkillLvLab.text = LanguageString.jifengTiaoyueCh(GlobalConfig.jifengTiaoyueLg.st101368, [skillLv]);
		this.m_PetSkillItem.setData(petData.skill, 1);
		let netSkillId = petData.skill + 1;
		let nowSkillsConfig = GlobalConfig.ins("SkillsConfig")[petData.skill];
		let nextSkillsConfig = GlobalConfig.ins("SkillsConfig")[netSkillId];
		this.m_Cont1.text = nowSkillsConfig.desc;
		let nextPetSkillsUpgradeConfig = GlobalConfig.ins("PetSkillsUpgradeConfig")[skillLv + 1];
		if (nextPetSkillsUpgradeConfig) {
			this.m_Cont2.text = nextSkillsConfig.desc;
			this.m_NextContGroup.visible = true;
			this.m_LvUpGroup.visible = true;
			this.m_LvFullLab.visible = false;
		} else {
			this.m_NextContGroup.visible = false;
			this.m_LvUpGroup.visible = false;
			this.m_LvFullLab.visible = true;
		}
		let nowPetSkillsUpgradeConfig = GlobalConfig.ins("PetSkillsUpgradeConfig")[skillLv];
		if (nowPetSkillsUpgradeConfig) {
			this.needItemId = nowPetSkillsUpgradeConfig.cost.id;
			let itemNum = UserBag.ins().getBagGoodsCountById(0, this.needItemId);
			this.itemNum = itemNum;
			this.needNum = nowPetSkillsUpgradeConfig.cost.count;
			this.m_NeedItem.setData(this.needItemId, this.needNum);
		}
	}

	private itemNum = 0;
	private needNum = 0;
	private static isTips: boolean = false;
	private onClickLvUp() {
		let petModel = PetModel.getInstance;
		let petData = petModel.getNowSelectPetData();
		if (this.m_AutoBuy.selected && this.itemNum < this.needNum) {
			let yb = Shop.ins().getShopPrice(this.needItemId, this.needNum);
			if (Checker.Money(MoneyConst.yuanbao, yb, Checker.YUNBAO_FRAME)) {
				if (PetSkillMainWin.isTips == false) {
					PetSkillMainWin.isTips = true;
					WarnWin.show(LanguageString.jifengTiaoyueCh(GlobalConfig.jifengTiaoyueLg.st102089, [yb, GlobalConfig.jifengTiaoyueLg.st100208]), function () {
						PetSproto.ins().sendPetSkillUp(petData.petid, this.m_AutoBuy.selected);
					}, this)
				} else {
					PetSproto.ins().sendPetSkillUp(petData.petid, this.m_AutoBuy.selected);
				}
			}
			return;
		}
		if (this.itemNum >= this.needNum) {
			PetSproto.ins().sendPetSkillUp(petData.petid, this.m_AutoBuy.selected);
			this.playUpEff();
		} else {
			UserTips.ins().showTips(GlobalConfig.jifengTiaoyueLg.st100217);
		}
	}
	private onClickClose() {
		ViewManager.ins().close(this);
	}


	public m_EffGroup: eui.Group;
	public m_ItemEffGroup: eui.Group;

	private m_ItemEff: MovieClip;
	private m_NewEff: MovieClip;

	public m_SkillEff: MovieClip;
	public m_SkillGroup1: eui.Group;
	public playUpEff() {
		this.m_SkillEff = ViewManager.ins().createEff(this.m_SkillEff, this.m_SkillGroup1, "eff_ui_iconUpgrade");
		this.m_ItemEff = ViewManager.ins().createEff(this.m_ItemEff, this.m_ItemEffGroup, "eff_ui_icon");
		this.m_NewEff = ViewManager.ins().createEff(this.m_NewEff, this.m_EffGroup, "eff_ui_success");

	}

	private onClickGetLab() {
		if (this.needItemId) {
			UserWarn.ins().setBuyGoodsWarn(this.needItemId);
		}
	}

}

ViewManager.ins().reg(PetSkillMainWin, LayerManager.UI_Popup);
window["PetSkillMainWin"] = PetSkillMainWin