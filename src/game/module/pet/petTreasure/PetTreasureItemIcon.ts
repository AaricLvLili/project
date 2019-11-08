class PetTreasureItemIcon extends eui.ItemRenderer {
	public constructor() {
		super();
	}
	public m_ItemBase: ItemBase;
	public createChildren() {
		super.createChildren();
		this.m_ItemBase.nameTxt.textColor = 0xFFFFFF;
	}

	public dataChanged() {
		super.dataChanged();
		let itemData = this.data;
		this.m_ItemBase.data = itemData;
		this.m_ItemBase.dataChanged();
		this.playTween();
	}

	public playTween() {
		egret.Tween.removeTweens(this.m_ItemBase);
		this.m_ItemBase.scaleX = 0;
		this.m_ItemBase.scaleY = 0;
		egret.Tween.get(this.m_ItemBase).to({ scaleX: 1, scaleY: 1 }, 300);
	}

}

window["PetTreasureItemIcon"] = PetTreasureItemIcon