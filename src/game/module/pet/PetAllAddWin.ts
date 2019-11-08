class PetAllAddWin extends BaseEuiPanel {
	public constructor() {
		super()
		this.skinName = "PetAllAddWinSkin";
	}

	public m_ActivateNumLab: eui.Label;
	public m_LvAllAttrGroup: eui.Group;
	public m_AllStarAttrGroup: eui.Group;
	public m_FightNumLab: eui.Label;
	public m_PetAnim: PetAnim;
	public m_Power: PowerLabel;

	public m_Lan3: eui.Label;
	public m_Lan1: eui.Label;
	public m_Lan2: eui.Label;
	public m_Lan4: eui.Label;


	private m_PetData: PetData;
	initUI() {
		super.initUI();
		this.m_Lan1.text = GlobalConfig.jifengTiaoyueLg.st101100;
		this.m_Lan2.text = GlobalConfig.jifengTiaoyueLg.st101101;
		this.m_Lan3.text = GlobalConfig.jifengTiaoyueLg.st101135;
		this.m_Lan4.text = GlobalConfig.jifengTiaoyueLg.st101136;
		this.m_bg.init(`PetAllAddWin`, GlobalConfig.jifengTiaoyueLg.st101134);
	}
	open(...param: any[]) {
		this.m_PetData = param[0];
		this.addViewEvent();
		this.setData();
	}
	close() {
		this.release();
	}
	public release() {
		this.m_PetAnim.release();
	}
	private addViewEvent() {
	}
	private setData() {
		let petModel = PetModel.getInstance;
		this.m_FightNumLab.text = "" + petModel.getAllPetPower() + "";
		this.m_ActivateNumLab.text = petModel.getAllPetActivate() + "";
		this.m_PetAnim.setPetData(this.m_PetData.petid);
		this.m_PetAnim.shPower();
		this.m_Power.text = petModel.getAllPetPower() + "";
		AttributeData.setAttrGroup(petModel.getAllLvAttr(), this.m_LvAllAttrGroup);
		AttributeData.setAttrGroup(petModel.getAllStarAttr(), this.m_AllStarAttrGroup);
	}

	private onClickClose() {
		ViewManager.ins().close(this);
	}
}

ViewManager.ins().reg(PetAllAddWin, LayerManager.UI_Popup);
window["PetAllAddWin"] = PetAllAddWin