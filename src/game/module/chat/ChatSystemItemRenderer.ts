class ChatSystemItemRenderer extends eui.ItemRenderer {
	public constructor() {
		super()

		this.skinName = "SysMesItemSkin"
	}
	str
	type
	dataChanged() {
		1 == this.data.type
			? (this.str.textFlow = TextFlowMaker.generateTextFlow("|C:0xFD2F2F&T:" + this.data.str + "|"), this.type.source = "comp_55_28_06_png")
			: (this.str.textFlow = TextFlowMaker.generateTextFlow(this.data.str), this.type.source = "comp_55_28_02_png")
	}
	setFriendGroup(t) { }
}
window["ChatSystemItemRenderer"]=ChatSystemItemRenderer