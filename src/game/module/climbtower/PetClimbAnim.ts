class PetClimbAnim extends eui.Component {
	public constructor() {
		super();
	}
	public m_level: eui.Label;
	public m_AnimGroup: eui.Group;
	public m_ArrImg: eui.Image;
	private m_Eff: MovieClip;

	private configData: any;
	public m_DeadImg: eui.Image;
	public m_ElementImg: eui.Image;


	public createChildren() {
		super.createChildren();
		this.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onClick, this);
	}
	public setData(configData: any) {
		if (configData) {
			this.configData = configData;
			let climbTowerModel = ClimbTowerModel.getInstance;
			let monstersConfig = GlobalConfig.ins("MonstersConfig")[configData.monsterId];
			if (monstersConfig) {
				this.playEff(monstersConfig.avatar + "_3" + EntityAction.STAND);
				this.m_ElementImg.source = ResDataPath.GetElementImgName(monstersConfig.elementType);
			}
			if (configData.id == climbTowerModel.petSelectIndex) {
				this.m_ArrImg.visible = true;
			} else {
				this.m_ArrImg.visible = false;
			}
			this.m_level.text = LanguageString.jifengTiaoyueCh(GlobalConfig.jifengTiaoyueLg.st100390, [configData.id]);
			let isBattle = climbTowerModel.getIsBattle(climbTowerModel.ClimbTowerPetData.pass, configData.id);
			if (isBattle) {
				this.m_DeadImg.visible = false;
			} else {
				this.m_DeadImg.visible = true;
			}
		} else {
			this.release();
		}
	}
	private initEffData() {
		if (!this.m_Eff) {
			this.m_Eff = new MovieClip();
			this.m_Eff.touchEnabled = false;
			this.m_AnimGroup.addChild(this.m_Eff);
			this.m_Eff.x = this.m_AnimGroup.width / 2;
			this.m_Eff.y = this.m_AnimGroup.height / 2;
			this.m_Eff.scaleX = this.m_Eff.scaleY = 0.5;
		}
	}
	private playEff(name: string) {
		this.initEffData();
		this.m_Eff.loadUrl(ResDataPath.GetMonsterBodyPath(name), true, -1);
	}

	public release() {
		DisplayUtils.dispose(this.m_Eff);
		this.m_Eff = null;
		this.m_ArrImg.visible = false;
		this.m_DeadImg.visible = false;
		this.m_ElementImg.source = "";
		this.m_level.text = "";
	}

	private onClick() {
		if (this.configData) {
			ClimbTowerModel.getInstance.petSelectIndex = this.configData.id;
			GameGlobal.MessageCenter.dispatch(ClimbTowerEvent.CLIMBPET_DATAUPDATE_MSG);
		}
	}

}
window["PetClimbAnim"] = PetClimbAnim