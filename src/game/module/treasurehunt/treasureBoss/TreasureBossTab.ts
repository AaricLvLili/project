class TreasureBossTab extends eui.ItemRenderer {

	public selectedImage: eui.Image;
	public copyName: eui.Label;
	public constructor() {
		super();
		this.skinName = "TreasureBossTabSkin";
	}

	protected dataChanged(): void {
		super.dataChanged();
		this.copyName.text = GlobalConfig.jifengTiaoyueLg.st100047 + (this.itemIndex + 1);

	}

	public set selected(value: boolean) {
		if (this.selected == value) return;
		this.invalidateState();
		this.selectedImage.visible = value;
	}
}
window["TreasureBossTab"] = TreasureBossTab