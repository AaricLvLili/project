class PetAllShowItem extends eui.ItemRenderer {
	public constructor() {
		super();
	}
	public m_MianGroup: eui.Group;
	public m_Bg: eui.Image;
	public m_Shuo: eui.Image;
	public m_Icon: eui.Image;
	public m_Lv: eui.Label;
	public m_Mask: eui.Rect;


	public dataChanged() {
		super.dataChanged();
		let petId: number = this.data;
		let petModel = PetModel.getInstance;
		let petData = petModel.petDic.get(petId);
		let petConfig = GlobalConfig.ins("PetConfig")[petId];
		if (petConfig) {
			this.m_Bg.source = ResDataPath.GetItemQualityName(petConfig.quality);
			this.m_Icon.source = ResDataPath.getBossHeadImage(petConfig.head);//petConfig.head + "_png";
		}
		if (petData.level == 0) {
			this.m_Lv.visible = false;
		} else {
			this.m_Lv.visible = true;
			this.m_Lv.text = LanguageString.jifengTiaoyueCh(GlobalConfig.jifengTiaoyueLg.st101368,[petData.level]);
		}
		if (petData.isActivate == true) {
			this.m_Mask.visible = false;
		} else {
			this.m_Mask.visible = true;
		}
	}

}
window["PetAllShowItem"]=PetAllShowItem