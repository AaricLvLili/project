class PetStarWin extends BaseEuiPanel {
	public constructor() {
		super()
		this.skinName = "PetStarWinSkin";
	}

	public m_LeftStarGroup: eui.Group;
	public m_RightStarGroup: eui.Group;
	public m_UpStarBtn: eui.Button;
	public m_ArrImg: eui.Image;
	public m_PetAnim: PetAnim;
	public m_CanUpStarGroup: eui.Group;
	public m_LeftGroup: eui.Group;
	public m_RightGroup: eui.Group;
	public m_LeftLab: eui.Label;
	public m_RightLab: eui.Label;
	public m_StarFullLab: eui.Label;

	private petData: PetData;
	private needItemId: number;

	public m_Power: PowerLabel;
	public m_Lan1: eui.Label;
	public m_NeedItem: MainNeedItem;

	public createChildren() {
		super.createChildren();
		this.m_Lan1.text = GlobalConfig.jifengTiaoyueLg.st101170;
		this.m_StarFullLab.text = GlobalConfig.jifengTiaoyueLg.st101171;
		this.m_UpStarBtn.label = GlobalConfig.jifengTiaoyueLg.st100211;
		this.m_bg.init(`PetStarWin`, GlobalConfig.jifengTiaoyueLg.st101169);
	}
	initUI() {
		super.initUI();
	}
	open(...param: any[]) {
		this.addViewEvent();
		this.m_PetAnim.shPower();
		this.petData = param[0];
		this.setData();
	}
	close() {
		this.release();
	}
	public release() {
		DisplayUtils.dispose(this.m_NewEff);
		this.m_NewEff = null;
		DisplayUtils.dispose(this.m_ItemEff);
		this.m_ItemEff = null;
		this.removeViewEvent();
		this.m_PetAnim.release();
	}
	private addViewEvent() {
		this.m_NeedItem.addEvent();
		this.AddClick(this.m_UpStarBtn, this.onClickUpStar);
		this.observe(PetEvt.PET_DATAUPDATE_MSG, this.setData);
		this.observe(PetEvt.PET_STARUPEFF_MSG, this.playUpEff);
	}
	private removeViewEvent() {
		this.m_NeedItem.removeEvent();
	}
	private setData() {
		let petModel = PetModel.getInstance;
		let petData = this.petData;
		let petConfig = GlobalConfig.ins("PetConfig")[petData.petid];
		if (petData && petConfig) {
			this.m_Power.text = petData.power;
			this.m_PetAnim.setPetData(petData.petid);

			let petStarLevelExpConfig = GlobalConfig.ins("PetStarLevelExpConfig")[petData.star + 1];
			if (petStarLevelExpConfig && petData.star < petConfig.maxstarLevel) {
				let neeItemNum = 0;
				if (petData.isCanCarStarUp) {
					this.needItemId = petConfig.activationItem;
					neeItemNum = petStarLevelExpConfig.itemNum2
				} else {
					this.needItemId = petConfig.starItem;
					neeItemNum = petStarLevelExpConfig.itemNum;
				}
				this.m_NeedItem.setData(this.needItemId, neeItemNum);
				this.m_LeftLab.text = AttributeData.getAttStr(petModel.getStarAttr(petData.petid, petData.star), 1);
				this.m_RightLab.text = AttributeData.getAttStr(petModel.getStarAttr(petData.petid, petData.star + 1), 1);
				this.m_StarFullLab.visible = false;
				this.m_CanUpStarGroup.visible = true;
				this.m_ArrImg.visible = true;
				this.m_RightGroup.visible = true;
				this.m_LeftGroup.horizontalCenter = -116;
			} else {
				this.m_LeftLab.text = AttributeData.getAttStr(petModel.getStarAttr(petData.petid, petData.star), 1);
				this.m_ArrImg.visible = false;
				this.m_RightGroup.visible = false;
				this.m_LeftGroup.horizontalCenter = 0;
				this.m_StarFullLab.visible = true;
				this.m_CanUpStarGroup.visible = false;
			}
			petModel.setStar(this.m_LeftStarGroup, petData.star);
			petModel.setStar(this.m_RightStarGroup, petData.star + 1);

		}
		this.checkStarGuide();
	}



	private onClickUpStar() {
		let petData = this.petData;
		let petConfig = GlobalConfig.ins("PetConfig")[petData.petid];
		if (petData && petConfig) {

			let petStarLevelExpConfig = GlobalConfig.ins("PetStarLevelExpConfig")[petData.star + 1];
			if (petStarLevelExpConfig) {
				let needItemId = 0;
				let neeItemNum = 0;
				if (petData.isCanCarStarUp) {
					needItemId = petConfig.activationItem;
					neeItemNum = petStarLevelExpConfig.itemNum2
				} else {
					needItemId = petConfig.starItem;
					neeItemNum = petStarLevelExpConfig.itemNum;
				}
				let itemNum = UserBag.ins().getBagGoodsCountById(0, needItemId);
				if (itemNum >= neeItemNum) {
					PetSproto.ins().sendPetUpStarMsg(petData.petid);
				} else {
					UserTips.ins().showTips(GlobalConfig.jifengTiaoyueLg.st100217);
				}
			} else {
				UserTips.ins().showTips(GlobalConfig.jifengTiaoyueLg.st101168);
			}
		}
	}

	private onClickClose() {
		ViewManager.ins().close(this);
	}

	public m_EffGroup: eui.Group;
	public m_ItemEffGroup: eui.Group;
	private m_ItemEff: MovieClip;
	private m_NewEff: MovieClip;
	public playUpEff() {
		this.m_ItemEff = ViewManager.ins().createEff(this.m_ItemEff, this.m_ItemEffGroup, "eff_ui_icon");
		this.m_NewEff = ViewManager.ins().createEff(this.m_NewEff, this.m_EffGroup, "eff_ui_upgrade");
	}

	private onClickGetLab() {
		if (this.needItemId) {
			UserWarn.ins().setBuyGoodsWarn(this.needItemId);
		}
	}

	private checkStarGuide() {
		if (PetModel.getInstance.checkGuideStar() && Setting.currPart == 27 && Setting.currStep == 2) {
			GuideUtils.ins().show(this.m_UpStarBtn, 27, 2);
			this.m_UpStarBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onClickStarGuide, this, true, 10);
		} else if (Setting.currPart == 27 && Setting.currStep == 3) {
			GuideUtils.ins().show(this.m_bg.closeButtomBtn, 27, 3);
			this.m_bg.closeButtomBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onClickGuideClose, this, true, 10);
			ViewManager.ins().close(PetNewWin);
		}
	}
	private onClickStarGuide() {
		GuideUtils.ins().next(this.m_UpStarBtn);
		this.m_UpStarBtn.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onClickStarGuide, this, true);
	}

	private onClickGuideClose() {
		GuideUtils.ins().next(this.m_bg.closeButtomBtn);
		this.m_bg.closeButtomBtn.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onClickGuideClose, this, true);
		MessageCenter.ins().dispatch(PetEvt.PET_GUIDE_MSG_END);
	}

}
ViewManager.ins().reg(PetStarWin, LayerManager.UI_Popup);
window["PetStarWin"] = PetStarWin