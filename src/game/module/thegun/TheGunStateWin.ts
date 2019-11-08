class TheGunStateWin extends BaseEuiPanel {
	public constructor() {
		super()
		this.skinName = "TheGunStateWinSkin";
	}
	public m_bg: CommonPopBg;
	public m_TheGunAnim: TheGunAnim;
	public m_Lan1: eui.Label;
	public m_Lan2: eui.Label;

	public theGunData: TheGunData;
	public m_LvUpGroup: eui.Group;
	public m_DanGroup: eui.Group;
	public m_LvGoup: eui.Group;
	public m_LvLab: eui.Label;
	public m_SkillGroup: eui.Group;
	public m_Lan0: eui.Label;

	initUI() {
		super.initUI();
		this.m_Lan1.text = GlobalConfig.jifengTiaoyueLg.st100687;
		this.m_Lan2.text = GlobalConfig.jifengTiaoyueLg.st102038;
		this.m_Lan0.text = GlobalConfig.jifengTiaoyueLg.st100246 + GlobalConfig.jifengTiaoyueLg.st101831;
		this.m_bg.init(`TheGunStateWin`, GlobalConfig.jifengTiaoyueLg.st102039);
	}
	open(...param: any[]) {
		this.theGunData = param[0];
		this.addViewEvent();
		this.setData();
	}
	close() {
		this.release();
	}
	public release() {
		this.m_TheGunAnim.release();
		this.removeViewEvent();
	}
	private addViewEvent() {
	}
	private removeViewEvent() {
	}
	private setData() {
		let theGunModel = TheGunModel.getInstance;
		let theGunData: TheGunData = this.theGunData;
		if (!theGunData) {
			return;
		}
		this.m_LvLab.text = theGunData.level + GlobalConfig.jifengTiaoyueLg.st100103;
		this.m_TheGunAnim.setTheGunData(theGunData);
		let starLvAttr = theGunModel.getTheGunStarLvAllAttr(theGunData);
		AttributeData.setAttrGroup(starLvAttr, this.m_LvUpGroup);
		let danAttr = theGunData.allDanAttr;
		AttributeData.setAttrGroup(danAttr, this.m_DanGroup);
		let skillAttr = theGunModel.getSkillAttr(theGunData);
		AttributeData.setAttrGroup(skillAttr, this.m_SkillGroup);
	}


	private onClickClose() {
		ViewManager.ins().close(this);
	}
}

ViewManager.ins().reg(TheGunStateWin, LayerManager.UI_Popup);
window["TheGunStateWin"] = TheGunStateWin