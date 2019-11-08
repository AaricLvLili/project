class MountEquipIcon extends eui.Component {
	public constructor() {
		super();
	}

	public m_MianGroup: eui.Group;
	public m_Bg: eui.Image;
	public m_Icon: eui.Image;
	public m_Cont: eui.Label;
	public m_SelectImg: eui.Image;
	public setData(itmeId: number) {
		let itemConfig = GlobalConfig.ins("ItemConfig")[itmeId];
		if (itemConfig) {
			this.m_Bg.source = ResDataPath.GetItemQualityName(itemConfig.quality);
			this.m_Icon.source = itemConfig.icon + "_png";
			this.m_Cont.text = LanguageString.jifengTiaoyueCh(GlobalConfig.jifengTiaoyueLg.st101869, [itemConfig.zsLevel]);
		}
	}

	public noItem() {
		this.m_Bg.source = ResDataPath.GetItemQualityName(0);
		this.m_Icon.source = "pf_orange_02_png";
		this.m_Cont.text = "";
	}

}
window["MountEquipIcon"] = MountEquipIcon