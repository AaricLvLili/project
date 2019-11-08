class TrLegendshuxinItemLabel extends eui.ItemRenderer {
	public constructor() {
		super()
		this.skinName = "TrLegendshuxinItemLabelSkin"
	}

	public shuText0: eui.Label;
	public itemTu1: eui.Image;


	public dataChanged() {
		this.teJieData();
		this.fuWenData();
	}

	//特戒戒灵之语
	teJieData() { 
		let tJdata = this.data
		if (tJdata.configId == null || tJdata.zslevel == null) return;
		let configIndex = tJdata.configId;
		let zslevelId = tJdata.zslevel;
		let attrConfig = GlobalConfig.ins("ExRingSoulEvil")[configIndex][zslevelId];
		this.itemTu1.visible = true;
		let attrMiStr: string = "";
		var len = attrConfig.attr.length;
		for (var j = 0; j < len; j++) {
			attrMiStr += StringUtils.complementByChar(AttributeData.getAttrStrByType(attrConfig.attr[j].type), 0) + ": " + AttributeData.getAttStrByType(attrConfig.attr[j]);
		}
		let attrStr = attrConfig.zslevel + GlobalConfig.jifengTiaoyueLg.st100067 + " " + attrConfig.name + "\n" + attrMiStr + "\n";
		this.itemTu1.source = "fuyin" + configIndex + "_png";
		this.shuText0.text = attrStr;
	}

	//符文特殊属性
	fuWenData() {
		this.itemTu1.visible = false;
		let data = this.data
		let fuWenConfig = GlobalConfig.ins("EquipConfig")[data];
		if(!fuWenConfig)
			return;
		let str = (fuWenConfig.baseAttr == null)?"":StringUtils.complementByChar(AttributeData.getAttrStrByType(fuWenConfig.baseAttr[0].type), 0) + ": " + AttributeData.getAttStrByType(fuWenConfig.baseAttr[0]);
		this.shuText0.text = str;
	}


}
window["TrLegendshuxinItemLabel"] = TrLegendshuxinItemLabel