class PetIconBase extends eui.Component {
	public constructor() {
		super();
		this.skinName = "PetIconItemSkin";
	}
	public m_MianGroup: eui.Group;
	public m_Bg: eui.Image;
	public m_Shuo: eui.Image;
	public m_Icon: eui.Image;
	public m_Lv: eui.Label;
	public m_Mask: eui.Rect;

	public setData(petId: number, lv: number = 0) {
		this.m_Bg.source = ResDataPath.GetItemQualityName(0);
		let petConfig = GlobalConfig.ins("PetConfig")[petId];
		if (petConfig) {
			this.m_Bg.source = ResDataPath.GetItemQualityName(petConfig.quality);
			this.m_Icon.source = ResDataPath.getBossHeadImage(petConfig.head);//petConfig.head + "_png";
		}
		if (lv == 0) {
			this.m_Lv.visible = false;
		} else {
			this.m_Lv.visible = true;
			this.m_Lv.text = LanguageString.jifengTiaoyueCh(GlobalConfig.jifengTiaoyueLg.st101368, [lv]);
		}
		this.setShuo();
	}

	public setShuo(isUnLock: boolean = false) {
		if (isUnLock == true) {
			this.m_Icon.visible = false;
			this.m_Shuo.visible = true;
			this.m_Lv.text = "";
			this.m_Bg.source = ResDataPath.GetItemQualityName(0);
		} else {
			this.m_Icon.visible = true;
			this.m_Shuo.visible = false;
		}
	}

	public setNot() {
		this.m_Bg.source = ResDataPath.GetItemQualityName(0);
		this.m_Lv.text = "";
		this.m_Icon.source = "";
		this.setShuo(false);
	}

}
window["PetIconBase"] = PetIconBase