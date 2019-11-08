class MountEquipStarIcon extends eui.Component {
	public constructor() {
		super();
	}

	public m_MianGroup: eui.Group;
	public m_Bg: eui.Image;
	public m_Icon: eui.Image;
	public m_UnLockLab: eui.Label;
	public m_LvLab: eui.Label;
	public m_StarGroup: eui.Group;
	public m_ItemLvLab: eui.Label;

	public createChildren() {
		super.createChildren();
		this.m_ItemLvLab.text = "";
	}

	public setData(itmeId: number, starNum: number) {
		let itemConfig = GlobalConfig.ins("ItemConfig")[itmeId];
		if (itemConfig) {
			this.m_Bg.source = ResDataPath.GetItemQualityName(itemConfig.quality);
			this.m_Icon.source = itemConfig.icon + "_png";
			this.m_LvLab.text = LanguageString.jifengTiaoyueCh(GlobalConfig.jifengTiaoyueLg.st101869, [itemConfig.zsLevel]);
			this.m_UnLockLab.text = "";
			MountModel.getInstance.setStar(this.m_StarGroup, starNum);
		}
	}

	public noItem() {
		this.m_Bg.source = ResDataPath.GetItemQualityName(0);
		this.m_Icon.source = "pf_orange_02_png";
		this.m_LvLab.text = "";
		this.m_UnLockLab.text = "";
	}

}
window["MountEquipStarIcon"] = MountEquipStarIcon