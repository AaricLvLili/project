class PetAnim extends eui.Component {
	public constructor() {
		super();
		this.skinName = "PetAnimSkin";
	}

	public m_Bg: eui.Image;
	public m_RAndNameLab: eui.Label;
	public m_StarGroup: eui.Group;
	private m_Eff: MovieClip;
	public m_AnimGroup: eui.Group;
	public m_EffGroup: eui.Group;
	public m_Activate: eui.Image;
	public m_ElementImg: eui.Image;
	public m_Power: PowerLabel;
	public m_NameBg: eui.Image;
	private m_NewEff;
	public m_NameGroup: eui.Group;

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
			this.m_RAndNameLab.textFlow = <Array<egret.ITextElement>>[
				{ text: petModel.getRName(petConfig.quality) + " ", style: { "textColor": petModel.getQualityColor(petConfig.quality) } },
				{ text: "Lv." + lv + " " },
				{ text: petData.name }
			];
			petModel.setStar(this.m_StarGroup, petData.star);
			let power = 0;
			if (petData.power == 0) {
				let attr = petModel.getPetAttr(petData.petid, 1, 0);
				power = Math.floor(UserBag.getAttrPower(attr));
				this.m_Power.text = power;
			} else {
				this.m_Power.text = petData.power;
			}

			this.playEff(petConfig.avatar + "_3" + EntityAction.STAND, ResAnimType.TYPE2);
			if (petData.isActivate) {
				this.m_Activate.visible = false;
			} else {
				this.m_Activate.visible = true;
			}
			let monstersConfig = GlobalConfig.ins("MonstersConfig")[petConfig.monsterId];
			if (monstersConfig) {
				this.m_ElementImg.source = ResDataPath.GetElementImgName(monstersConfig.elementType);
			}
		}
	}
	public release() {
		DisplayUtils.dispose(this.m_Eff);
		this.m_Eff = null;
		DisplayUtils.dispose(this.m_NewEff);
		this.m_NewEff = null;
	}

	public shPower(isShow: boolean = false) {
		if (isShow) {
			this.m_Power.visible = true;
		} else {
			this.m_Power.visible = false;
		}
	}
	private playEff(name: string, type: ResAnimType) {
		this.m_Eff = ViewManager.ins().createEff(this.m_Eff, this.m_AnimGroup, name, -1, type)
	}
	public playNewEff() {
		this.m_NewEff = ViewManager.ins().createEff(this.m_NewEff, this.m_EffGroup, "eff_ui_activation", -1)
	}

}
window["PetAnim"] = PetAnim