class GadLvUpItem extends eui.ItemRenderer {
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
		this.m_SelectGouImg.visible = false;
	}
	public dataChanged() {
		super.dataChanged();
		let data: GadBagData = this.data;

		if (data.configID > 0) {
			this.m_Icon.visible = true;
			this.m_Lv.visible = true;
			this.m_StarGroup.visible = true;
			this.m_Icon.source = data.itemConfig.icon + "_png";
			this.m_Lv.text = "+" + data.level;
			let star = data.star;
			GadModel.getInstance.setStarNum(star, this.m_StarGroup)
			this.m_Bg.source = ResDataPath.GetItemQualityName(data.star);
		} else {
			this.m_Bg.source = ResDataPath.GetItemQualityName(0);
			this.m_Icon.visible = false;
			this.m_Lv.visible = false;
			this.m_StarGroup.visible = false;
		}
	}

	public release() {
		DisplayUtils.dispose(this.m_ItemEff);
		this.m_ItemEff = null;
	}


	public playEff() {
		let data: GadBagData = this.data;
		if (data.configID > 0) {
			this.playBodyEff();
		}
	}

	private m_ItemEff: MovieClip;
	private playBodyEff() {
		this.m_ItemEff = ViewManager.ins().createEff(this.m_ItemEff, this.m_MianGroup, "eff_ui_icon");
	}
	/**引导用 */
	public guideSet() {
		this.m_Bg.source = ResDataPath.GetItemQualityName(0);
		this.m_Icon.visible = false;
		this.m_Lv.visible = false;
		this.m_StarGroup.visible = false;
	}
}
window["GadLvUpItem"] = GadLvUpItem