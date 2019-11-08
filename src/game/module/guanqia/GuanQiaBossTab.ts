class GuanQiaBossTab extends eui.ItemRenderer {
	public constructor() {
		super();
	}
	public m_Bg: eui.Image;
	public m_selectImg: eui.Image;
	public labelDisplay: eui.Label;
	public redPoint: eui.Image;
	public dataChanged() {
		super.dataChanged();
		this.m_Bg.source = "comp_204_44_" + (this.itemIndex + 1) + "_png";
		if (GuanQiaBossWin.groupId == this.itemIndex + 1) {
			this.m_selectImg.visible = true;
		} else {
			this.m_selectImg.visible = false;
		}
	}
}
window["GuanQiaBossTab"] = GuanQiaBossTab