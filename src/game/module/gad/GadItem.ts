class GadItem extends eui.Component {
	public constructor() {
		super();
		this.skinName = "GadItemSkin";
	}
	public m_MianGroup: eui.Group;
	public m_Bg: eui.Image;
	public m_AddImg: eui.Image;
	public m_Icon: eui.Image;
	public m_Lv: eui.Label;
	public m_SelectGouImg: eui.Image;
	public m_StarGroup: eui.Group;

	public createChildren() {
		super.createChildren();
		this.m_AddImg.visible = false;
		this.m_SelectGouImg.visible = false;
	}
	/**用纹章数据 */
	public setData(itemData: GadData | GadBagData, isShowLv: boolean = true) {
		let star = itemData.itemConfig.quality;
		this.m_Icon.source = itemData.itemConfig.icon + "_png";
		if (this.skinName == "GadItemBigStarSkin") {
			GadModel.getInstance.setStarNum(star, this.m_StarGroup, 0.8)
		} else {
			GadModel.getInstance.setStarNum(star, this.m_StarGroup)
		}
		if (isShowLv) {
			this.m_Lv.visible = true;
			this.m_Lv.text = "+" + itemData.level;
		} else {
			this.m_Lv.visible = false;
		}

		this.m_Bg.source = ResDataPath.GetItemQualityName(star);
	}

}


window["GadItem"]=GadItem