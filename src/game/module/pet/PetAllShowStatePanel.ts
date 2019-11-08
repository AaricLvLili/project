class PetAllShowStatePanel extends BaseView implements ICommonWindowTitle {
	windowTitleIconName?: string;
	public m_Power: PowerLabel;
	public m_Lan0: eui.Label;
	public m_Bar: eui.ProgressBar;
	public m_StateGroup1: eui.Group;
	public m_Lan1: eui.Label;
	public m_Cont: eui.Label;
	public m_Lan5: eui.Label;
	public starList: StarList;
	public m_Lan2: eui.Label;
	public m_Lan3: eui.Label;
	public m_StateGroup0: eui.Group;
	public m_StateGroup2: eui.Group;
	public m_Lan4: eui.Label;
	public m_MainBtnGroup: eui.Group;
	public m_MainBtn: eui.Button;
	public m_Lab: eui.Label;
	public m_NeedItemGroup: eui.Group;
	public m_FullImg: eui.Image;
	public m_LefLab: eui.Label;
	public m_RightLab: eui.Label;
	public m_LeftAttrGroup: eui.Group;
	public m_RightGroup: eui.Group;
	public m_AttrImg: eui.Image;
	mWindowHelpId = 33;
	public constructor(data?: any) {
		super();
		this.name = GlobalConfig.jifengTiaoyueLg.st101116;
		this.windowTitleIconName = GlobalConfig.jifengTiaoyueLg.st101116;
		this.skinName = "PetAllShowStatePanelSkin";
		this.touchEnabled = false;
		this.m_Lan0.text = GlobalConfig.jifengTiaoyueLg.st101847;
		this.m_Lan1.text = GlobalConfig.jifengTiaoyueLg.st101848;
		this.m_Lan2.text = GlobalConfig.jifengTiaoyueLg.st101850
		this.m_Lan3.text = GlobalConfig.jifengTiaoyueLg.st100260
		this.m_Lan4.text = GlobalConfig.jifengTiaoyueLg.st100676
		this.m_Lan5.text = GlobalConfig.jifengTiaoyueLg.st101849;
		this.m_Lab.text = GlobalConfig.jifengTiaoyueLg.st100022;
	}
	protected childrenCreated() {
		super.childrenCreated();
	};
	private addViewEvent() {
		this.AddClick(this.m_MainBtn, this.onClickMainBtn);
		this.observe(PetEvt.PET_ALLSHOWSTATE_MSG, this.lvUp)
	}
	public open() {
		this.addViewEvent();
		this.initData();
	};
	public close() {
		DisplayUtils.dispose(this.m_ItemEff);
		this.m_ItemEff = null;
		DisplayUtils.dispose(this.m_NewEff);
		this.m_NewEff = null;
	};
	public release() {
	}

	private lvUp() {
		this.initData();
		this.playUpEff();
	}

	private initData() {
		let petModel = PetModel.getInstance;
		this.m_Bar.maximum = petModel.petMaxNum;
		this.m_Bar.value = petModel.nowPetHaveNum;
		let illustratedConfig = GlobalConfig.ins("illustratedConfig")[petModel.petAllShowLv];
		let nextIllustratedConfig = GlobalConfig.ins("illustratedConfig")[petModel.petAllShowLv + 1];
		if (nextIllustratedConfig) {
			let petNextShowAttr = AttributeData.getAttr([petModel.allResonanceAttr(), petModel.nowAllShowPetAttr(nextIllustratedConfig.additionRatio * 0.01)])
			AttributeData.setAttrGroup(petNextShowAttr, this.m_StateGroup2);
			this.m_LeftAttrGroup.horizontalCenter = -128;
			this.m_RightGroup.visible = true;
			this.m_AttrImg.visible = true;
			this.m_MainBtnGroup.visible = true;
			this.m_FullImg.visible = false;
			this.m_RightLab.textFlow = (new egret.HtmlTextParser).parser(LanguageString.jifengTiaoyueCh(GlobalConfig.jifengTiaoyueLg.st101851, [nextIllustratedConfig.additionRatio]));
		} else {
			this.m_RightGroup.visible = false;
			this.m_AttrImg.visible = false;
			this.m_LeftAttrGroup.horizontalCenter = 0;
			this.m_MainBtnGroup.visible = false;
			this.m_FullImg.visible = true;
		}
		if (illustratedConfig) {
			this.m_Cont.textFlow = (new egret.HtmlTextParser).parser(LanguageString.jifengTiaoyueCh(GlobalConfig.jifengTiaoyueLg.st101852, [illustratedConfig.additionRatio]));
			this.m_LefLab.textFlow = (new egret.HtmlTextParser).parser(LanguageString.jifengTiaoyueCh(GlobalConfig.jifengTiaoyueLg.st101851, [illustratedConfig.additionRatio]));
			UserBag.ins().setNeedItem([illustratedConfig.Cost], this.m_NeedItemGroup);
			this.starList.starNum = petModel.petAllShowLv;
			let petNowShowAttr = petModel.petNowAllShowAttr();
			AttributeData.setAttrGroup(petNowShowAttr, this.m_StateGroup1);
			AttributeData.setAttrGroup(petNowShowAttr, this.m_StateGroup0);
			this.m_Power.text = petModel.getAllPetPower();
		}

	}

	private onClickMainBtn() {
		let petModel = PetModel.getInstance;
		let illustratedConfig = GlobalConfig.ins("illustratedConfig")[petModel.petAllShowLv];
		let yb: number = GameLogic.ins().actorModel.yb;
		if (yb >= illustratedConfig.Cost.count) {
			PetSproto.ins().sendPetAllShowLvUp();
		} else {
			UserTips.ins().showTips(GlobalConfig.jifengTiaoyueLg.st100008);
		}
	}

	UpdateContent(): void {

	}
	public m_ItemEffGroup: eui.Group;
	public m_EffGroup: eui.Group;
	private m_ItemEff: MovieClip;
	private m_NewEff: MovieClip;
	public playUpEff() {
		this.m_ItemEff = ViewManager.ins().createEff(this.m_ItemEff, this.m_ItemEffGroup, "eff_ui_success");
		this.m_NewEff = ViewManager.ins().createEff(this.m_NewEff, this.m_EffGroup, "eff_ui_upgrade");
	}

}
window["PetAllShowStatePanel"] = PetAllShowStatePanel