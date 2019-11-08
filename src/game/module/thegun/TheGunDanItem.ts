class TheGunDanItem extends ItemBase {
	public constructor() {
		super();
		this.skinName = "ItemSkin";
	}
	// public redPoint;
	public dataChanged() {
		super.dataChanged();
		let data = this.data;
		this.nameTxt.visible = false;
		this.count.text = this.data.count + "";
		this.count.visible = true;
		this.mCallback = function () {
			let itemData = UserBag.ins().getBagGoodsByTypeAndId(0, this.data.id);
			if (!itemData) {
				itemData = new ItemData();
				itemData.count = 0;
				itemData.configID = this.data.id;
			}
			ViewManager.ins().open(MountDanYaoUseWin, itemData, ItemType.TYPE16);
		}
		let needItemData = UserBag.ins().getBagGoodsByTypeAndId(0, this.data.id);
		if (needItemData && needItemData.count > 0) {
			this.redPoint.visible = true
		} else {
			this.redPoint.visible = false
		}
	}
}
window["TheGunDanItem"] = TheGunDanItem