class MainGetAnim extends eui.Component {
	public constructor() {
		super();
		this.skinName = "MainGetAnimSkin";
	}
	public m_Bg: eui.Image;
	public m_EffGroup: eui.Group;
	public m_AnimGroup: eui.Group;
	public m_NameBg: eui.Image;
	public m_RAndNameLab: eui.Label;
	private m_Eff;
	private m_NewEff;
	public m_ItemBase: ItemBase;

	public setData() {
		this.playNewEff();
		if (UserBag.ins().showList.length > 0) {
			let idList = UserBag.ins().showList.splice(0, 1);
			let id = idList[0];
			let itemConfig = GlobalConfig.ins("ItemConfig")[id];
			if (itemConfig) {
				this.m_RAndNameLab.text = itemConfig.name;
			}
			let exhibitionConfig = GlobalConfig.ins("ExhibitionConfig")[id];
			if (exhibitionConfig) {
				let resAnimType = 1;
				let name = "";
				this.m_AnimGroup.visible = true;
				this.m_ItemBase.visible = true;
				switch (exhibitionConfig.type) {
					case 1:
						resAnimType = ResAnimType.TYPE2;
						name = exhibitionConfig.display + "_3" + EntityAction.STAND
						this.playEff(name, resAnimType);
						this.m_ItemBase.visible = false;
						break;
					case 2:
						resAnimType = ResAnimType.TYPE1;
						name = exhibitionConfig.display;
						this.playEff(name, resAnimType);
						this.m_ItemBase.visible = false;
						break;
					case 3:
						this.m_ItemBase.data = id;
						this.m_ItemBase.dataChanged();
						// this.m_ItemBase.setItemImg(itemConfig.icon + "_png");
						// this.m_ItemBase.setItemBg(ResDataPath.GetItemQualityName(itemConfig.quality));
						// this.m_ItemBase.nameTxt.text = itemConfig.name;
						this.m_ItemBase.showItemEffect();
						this.m_ItemBase.isShowName(false);
						this.m_AnimGroup.visible = false;
						break;
				}

			}
		}
	}
	public release() {
		DisplayUtils.dispose(this.m_Eff);
		this.m_Eff = null;
		DisplayUtils.dispose(this.m_NewEff);
		this.m_NewEff = null;
	}
	private playEff(name: string, type: ResAnimType) {
		this.m_Eff = ViewManager.ins().createEff(this.m_Eff, this.m_AnimGroup, name, -1, type)
	}
	public playNewEff() {
		this.m_NewEff = ViewManager.ins().createEff(this.m_NewEff, this.m_EffGroup, "eff_ui_activation", -1)
	}


}
window["MainGetAnim"] = MainGetAnim