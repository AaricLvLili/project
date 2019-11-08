class HuntListRenderer extends eui.ItemRenderer {

	// static job = ["", " 剑士", " 法师", " 牧师"]

	public constructor() {
		super();
		this.skinName = "HuntListRendererSkin"
	}

	showText

	dataChanged() {
		var arr = this.data;
		var item = GlobalConfig.itemConfig[arr[1]];
		if (item == null)
			return;
		var str, cc = "";
		if (arr[2]) {
			cc = "x" + arr[2]
		}
		if (item.type == 0) {
			str = "<font color = '#12b2ff'>" + arr[0] + "</font> " + GlobalConfig.jifengTiaoyueLg.st101471 + " <font color='" + ItemBase.QUALITY_COLOR[item.quality] + "'>" + HuntListRenderer.makeNameList(item) + cc + "</font>";
		}
		else {
			str = "<font color = '#12b2ff'>" + arr[0] + "</font> " + GlobalConfig.jifengTiaoyueLg.st101471 + " <font color='" + ItemBase.QUALITY_COLOR[item.quality] + "'>" + item.name + cc + "</font>";
		}
		this.showText.textFlow = TextFlowMaker.generateTextFlow(str);
	};

	static MakeTextFlow(name: string, itemId: number, itemCount: number): egret.ITextElement[] {
		var item = GlobalConfig.itemConfig[itemId];
		if (item == null) {
			return []
		}
		var str, cc = "";
		if (itemCount) {
			cc = "x" + itemCount
		}
		if (item.type == 0) {
			str = "<font color = '#12b2ff'>" + name + "</font> " + GlobalConfig.jifengTiaoyueLg.st101471 + "  <font color='" + ItemBase.QUALITY_COLOR[item.quality] + "'>" + this.makeNameList(item) + cc + "</font>";
		}
		else {
			str = "<font color = '#12b2ff'>" + name + "</font>" + GlobalConfig.jifengTiaoyueLg.st101471 + "  <font color='" + ItemBase.QUALITY_COLOR[item.quality] + "'>" + item.name + cc + "</font>";
		}
		return TextFlowMaker.generateTextFlow(str)
	}

	static makeNameList(item) {
		var name = '';
		name = item.name;
		if (item.zsLevel > 0) {
			name += "(" + item.zsLevel + GlobalConfig.jifengTiaoyueLg.st100067 + " ";
		}
		else {
			name += "(" + item.level + GlobalConfig.jifengTiaoyueLg.st100093 + " ";
		}
		name += Role.jobNumberToName(item.job) + ")";
		return name;
	};
	static QUALITY_COLOR = ["#f7f0f0", "#5ad200", "#00d8ff", "#ce1af5", "#feca2d", "#f87372"];
}
window["HuntListRenderer"] = HuntListRenderer