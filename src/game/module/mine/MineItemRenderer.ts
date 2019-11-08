class MineItemRenderer extends eui.ItemRenderer {

	reward
	type
	typeImg
	sign
	lightBg
	selectBg
	specialItem: eui.Group
	doubleRewardText: eui.Label
	public m_Lan1: eui.Label;

	public constructor() {
		super()
		this.skinName = "KDUpdataItemSkin"
		this.reward.itemRenderer = ItemBase

		this.m_Lan1.text=GlobalConfig.jifengTiaoyueLg.st100865;

	}

	dataChanged() {
		var e = this.data;
		// this.type.source = "ky_100" + e.level
		this.type.source = `comp_74_21_0${e.level}_png`
		this.typeImg.source = ResDataPath.GetMineNameByType(e.level)
		this.reward.dataProvider = new eui.ArrayCollection(MineModel.countRewardList(e.level).concat(e.item))
		this.sign.visible = !1
		this.lightBg.visible = !1
		this.selectBg.visible = !1;
		if (this.itemIndex == (this.parent as eui.List).numElements - 1) {
			this.specialItem.visible = false
		} else {
			this.specialItem.visible = false
		}

		this.doubleRewardText.visible = MineModel.ins().isDoubleMining;
	}
}
window["MineItemRenderer"] = MineItemRenderer