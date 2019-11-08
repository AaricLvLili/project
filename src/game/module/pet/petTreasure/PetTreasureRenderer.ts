class PetTreasureRenderer extends eui.ItemRenderer {


	public constructor() {
		super();
		this.skinName = "HuntListRendererSkin"
	}

	showText

	dataChanged() {
		var arr = this.data;
		var item = GlobalConfig.itemConfig[arr[1]];
		var str, cc = "";
		if (arr[2]) {
			cc = "x" + arr[2]
		}

		if (item) {
			str = "<font color = '#12b2ff'>" + arr[0] + "</font> " + GlobalConfig.jifengTiaoyueLg.st101471 + "<font color='" + ItemBase.QUALITY_COLOR[item.quality] + "'>" + item.name + cc + "</font>";
		} else {
			str = "<font color = '#12b2ff'>" + arr[0] + "</font>" + GlobalConfig.jifengTiaoyueLg.st101471 + " <font color='" + ItemBase.QUALITY_COLOR[0] + "'>" + MoneyManger.MoneyConstToName(arr[1]) + cc + "</font>";
		}
		this.showText.textFlow = TextFlowMaker.generateTextFlow(str);
	};


}
window["PetTreasureRenderer"] = PetTreasureRenderer