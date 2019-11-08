class GadLvUpSelectItem extends eui.ItemRenderer {
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
		this.addEvent();
		this.m_AddImg.visible = false;
	}
	private addEvent() {
		this.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onClick, this);
	}
	public dataChanged() {
		super.dataChanged();
		let gadModel = GadModel.getInstance;
		let gadBagData: GadBagData = this.data;
		this.m_Icon.source = gadBagData.itemConfig.icon + "_png";
		this.m_Lv.text = "+" + gadBagData.level;
		let star = gadBagData.star;
		GadModel.getInstance.setStarNum(star, this.m_StarGroup);
		let selectGadBagData = gadModel.lvUpSelectData.get(gadBagData.handle);
		if (selectGadBagData) {
			this.m_SelectGouImg.visible = true;
		} else {
			this.m_SelectGouImg.visible = false;
		}
		this.m_Bg.source = ResDataPath.GetItemQualityName(gadBagData.star);
	}


	private onClick() {
		let gadModel = GadModel.getInstance;
		let gadBagData: GadBagData = this.data;
		let selectGadBagData = gadModel.lvUpSelectData.get(gadBagData.handle);
		if (selectGadBagData) {
			gadModel.lvUpSelectData.remove(gadBagData.handle);
			GameGlobal.MessageCenter.dispatch(GadEvent.GAD_SELECT_DATAUPDATE_MSG);
			this.dataChanged();
		} else {
			if (gadModel.lvUpSelectData.length < 20) {
				gadModel.lvUpSelectData.set(gadBagData.handle, gadBagData);
				GameGlobal.MessageCenter.dispatch(GadEvent.GAD_SELECT_DATAUPDATE_MSG);
				this.dataChanged();
			} else {
				UserTips.ins().showTips(GlobalConfig.jifengTiaoyueLg.st101755);
			}
		}
	}
}
window["GadLvUpSelectItem"]=GadLvUpSelectItem