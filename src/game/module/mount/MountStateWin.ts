class MountStateWin extends BaseEuiPanel {
	public constructor() {
		super()
		this.skinName = "MountStateWinSkin";
	}
	public m_MountAnim: MountAnim;
	public m_LvUpGroup: eui.Group;
	public m_EquipGroup: eui.Group;
	public m_SkinGroup: eui.Group;
	public m_DanYaoGroup: eui.Group;
	private m_MountData: MountData;
	private languageTxt:eui.Label;
	private languageTxt0:eui.Label;
	private languageTxt1:eui.Label;
	private languageTxt2:eui.Label;

	initUI() {
		super.initUI();
		this.languageTxt.text = GlobalConfig.jifengTiaoyueLg.st100687;
		this.languageTxt0.text = GlobalConfig.jifengTiaoyueLg.st100688;
		this.languageTxt1.text = GlobalConfig.jifengTiaoyueLg.st100689;
		this.languageTxt2.text = GlobalConfig.jifengTiaoyueLg.st100690;
		this.m_bg.init(`MountStateWin`, GlobalConfig.jifengTiaoyueLg.st100686);
	}
	open(...param: any[]) {
		this.m_MountData = param[0];
		this.addViewEvent();
		this.setData();
	}
	close() {
		this.release();
	}
	public release() {
		this.m_MountAnim.release();
		this.removeViewEvent();
	}
	private addViewEvent() {
	}
	private removeViewEvent() {
	}
	private setData() {
		let mountModel = MountModel.getInstance;
		let mountData: MountData = this.m_MountData;
		this.m_MountAnim.setMountData(mountData);
		AttributeData.setAttrGroup(mountData.attr, this.m_DanYaoGroup);
		let allEquipAttr = mountModel.getMountAllEquipAttr(mountData);
		AttributeData.setAttrGroup(allEquipAttr, this.m_EquipGroup);
		let starLvAttr = mountModel.getMountStarLvAllAttr(mountData);
		AttributeData.setAttrGroup(starLvAttr, this.m_LvUpGroup);
		let skinAttr = mountModel.getMountSkinAttr();
		AttributeData.setAttrGroup(skinAttr, this.m_SkinGroup);
	}


	private onClickClose() {
		ViewManager.ins().close(this);
	}
}

ViewManager.ins().reg(MountStateWin, LayerManager.UI_Popup);
window["MountStateWin"] = MountStateWin