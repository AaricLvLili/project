class PetAwakeningPanel extends BaseView implements ICommonWindowTitle {
	windowTitleIconName?: string;
	public constructor(data?: any) {
		super();
		this.name = GlobalConfig.jifengTiaoyueLg.st101127;
		this.windowTitleIconName = GlobalConfig.jifengTiaoyueLg.st101127;
		this.skinName = "PetAwakeningPanelSkin";
		this.touchEnabled = false;
	}
	public m_PetAnim: PetAnim;
	public m_PetStateBtn: eui.Image;
	public m_MainBtnGroup: eui.Group;
	public m_MainBtn: eui.Button;
	public m_NeedItemGroup: eui.Group;
	public m_AttrGroup: eui.Group;
	public m_StateLab: eui.Label;
	public m_AwakeningLab: eui.Label;

	public m_RImg: eui.Image;
	public m_NameLab: eui.Label;
	public m_ElementImg: eui.Image;
	public m_Lab1: eui.Label;
	public m_Power: PowerLabel;

	protected childrenCreated() {
		super.childrenCreated();
		this.m_PetAnim.m_RAndNameLab.visible = false;
		this.m_PetAnim.m_StarGroup.visible = false;
		this.m_PetAnim.m_Power.visible = false;
		this.m_PetAnim.m_ElementImg.visible = false;
		this.m_StateLab.text = GlobalConfig.jifengTiaoyueLg.st101129;
		this.m_AwakeningLab.text = GlobalConfig.jifengTiaoyueLg.st101130;
		this.m_MainBtn.label = GlobalConfig.jifengTiaoyueLg.st100212;
		this.m_Lab1.text = GlobalConfig.jifengTiaoyueLg.st100022;
		this.m_PetAnim.m_NameBg.visible = false;
	};
	private addViewEvent() {
		this.AddClick(this.m_MainBtn, this.onClickMain);
		this.AddClick(this.m_PetStateBtn, this.onClickState);
		this.observe(PetEvt.PET_AWAKEING_MSG, this.setData);
		this.observe(PetEvt.PET_AWAKEING_MSG_EFF, this.playUpEff);
	}
	private removeEvent() {
	}
	public open() {
		this.addViewEvent();
		this.setData();
	};
	public close() {
		this.release();
		this.removeEvent();
	};

	public release() {
		this.removeEvent();
		DisplayUtils.dispose(this.m_NewEff);
		this.m_NewEff = null;
		DisplayUtils.dispose(this.m_ItemEff);
		this.m_ItemEff = null;
	}
	private setData() {
		let petModel = PetModel.getInstance;
		let petData = petModel.getNowSelectPetData();
		let petConfig = GlobalConfig.ins("PetConfig")[petData.petid];
		if (petData && petConfig) {
			this.m_PetAnim.setPetData(petData.petid);
			this.m_PetAnim.m_Activate.visible = false;
			AttributeData.setAttrGroup(petConfig.awakenValue, this.m_AttrGroup);
			UserBag.ins().setNeedItem([petConfig.awakenCost], this.m_NeedItemGroup);
			if (petData.isAwakening) {
				this.m_StateLab.visible = false;
				this.m_AwakeningLab.visible = true;
				this.m_MainBtnGroup.visible = false;
			} else {
				this.m_StateLab.visible = true;
				this.m_AwakeningLab.visible = false;
				this.m_MainBtnGroup.visible = true;
			}
			this.setPetData(petData.petid);
		}

	}

	private onClickMain() {
		let petModel = PetModel.getInstance;
		let petData = petModel.getNowSelectPetData();
		let petConfig = GlobalConfig.ins("PetConfig")[petData.petid];
		if (petData.isActivate == false) {
			UserTips.ins().showTips(GlobalConfig.jifengTiaoyueLg.st101128);
			return;
		}
		if (petConfig.elementValue) {
			let yb: number = GameLogic.ins().actorModel.yb;
			if (yb >= petConfig.awakenCost.count) {
				PetSproto.ins().sendAwakening(petData.petid);
			} else {
				UserTips.ins().showTips(GlobalConfig.jifengTiaoyueLg.st100008);
			}
		}
	}
	private onClickState() {
		let petModel = PetModel.getInstance;
		let petData = petModel.getNowSelectPetData();
		ViewManager.ins().open(PetStateWin, petData);
	}
	UpdateContent(): void {
	}

	public setPetData(petId: number) {
		let petModel = PetModel.getInstance;
		let petData: PetData = petModel.petDic.get(petId);
		let petConfig = GlobalConfig.ins("PetConfig")[petData.petid];
		if (petData && petConfig) {
			let lv: number;
			if (petData.level == 0) {
				lv = 1;
			} else {
				lv = petData.level;
			}
			this.m_NameLab.textFlow = <Array<egret.ITextElement>>[
				{ text: "Lv." + lv + " " },
				{ text: petData.name }
			];
			let power = 0;
			if (petData.power == 0) {
				let attr = petModel.getPetAttr(petData.petid, 1, 0);
				power = Math.floor(UserBag.getAttrPower(attr));
				this.m_Power.text = power;
			} else {
				this.m_Power.text = petData.power;
			}
			let monstersConfig = GlobalConfig.ins("MonstersConfig")[petConfig.monsterId];
			if (monstersConfig) {
				this.m_ElementImg.source = ResDataPath.GetElementImgName(monstersConfig.elementType);
			}
			this.m_RImg.source = "comp_" + petModel.getRName2(petConfig.quality) + "_png";
		}
	}

	public m_EffGroup: eui.Group;
	public m_ItemEffGroup: eui.Group;
	private m_ItemEff: MovieClip;
	private m_NewEff: MovieClip;
	public playUpEff() {
		this.m_ItemEff = ViewManager.ins().createEff(this.m_ItemEff, this.m_ItemEffGroup, "eff_ui_success");
		this.m_NewEff = ViewManager.ins().createEff(this.m_NewEff, this.m_EffGroup, "eff_ui_upgrade");
	}





}
window["PetAwakeningPanel"] = PetAwakeningPanel