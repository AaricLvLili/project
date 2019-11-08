class BagItemBase extends ItemBase {

	public childrenCreated() {
		super.childrenCreated()
		this.isShowJob(true)
	}

	protected _UpdateRedPoint() {
		if (this.data.getCanbeHc && this.data.getCanbeHc()) {
			this.redPoint.visible = true;
			return;
		}

		if (this.data.getCanbeUsed) {
			this.redPoint.visible = this.data.getCanbeUsed()
		} else {
			super._UpdateRedPoint()
		}
	}

	public showDetail(): void {
		//是否可以合成
		if (this.itemConfig.synthesis) {
			ViewManager.ins().open(ItemHcTipsWin, 0, this.itemConfig.id);
			return;
		}

		if (this.itemConfig.useType == ItemUseType.TYPE00) {
			super.showDetail()
		} else if (this.itemConfig.useType == ItemUseType.TYPE01 || this.itemConfig.useType == ItemUseType.TYPE02 || this.itemConfig.useType == ItemUseType.TYPE05) {
			if (!ItemData.IsNotTimeLimitUse(this.itemConfig)) {
				super.showDetail()
				return
			}
			ViewManager.ins().open(ItemUseTipsWin, 0, this.itemConfig.id);
		}
		if (this.itemConfig.useType == ItemUseType.TYPE03) {
			// ViewManager.ins().open(ItemUseTipsWin, 0, this.itemConfig.id);
			ViewManager.ins().open(AttrTipsWin, 0, this.data.handle, this.itemConfig.id, this.data);
		}
		if (this.itemConfig.type == ItemType.TYPE11) {
			ViewManager.ins().open(MountDanYaoUseWin, this.data, ItemType.TYPE11, true)
		}else
		if (this.itemConfig.type == ItemType.TYPE16) {
			ViewManager.ins().open(MountDanYaoUseWin, this.data, ItemType.TYPE16, true)
		}
	}
}
window["BagItemBase"] = BagItemBase