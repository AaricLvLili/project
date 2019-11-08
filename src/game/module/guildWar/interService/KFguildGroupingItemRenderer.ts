class KFguildGroupingItemRenderer extends eui.ItemRenderer {
	public constructor() {
		super();
		this.skinName = "KFguildGroupingItemSkin";
	}

	public title: eui.Label;
	public groupingTitle: eui.Label;
	public grouping0: eui.Label;
	public grouping1: eui.Label;
	public grouping2: eui.Label;
	public grouping3: eui.Label;

	public dataChanged() {
		var data = this.data as Sproto.kffz_info;
		var str: string = LanguageString.jifengTiaoyueCh(GlobalConfig.jifengTiaoyueLg.st101051, [StringUtils.numberToEnglishLetter(this.itemIndex + 1)]);
		if (data.winguild.serverid && data.winguild.guildname) {
			this.title.textFlow = TextFlowMaker.generateTextFlow(StringUtils.addColor(str + GlobalConfig.jifengTiaoyueLg.st101062, 0xFFB051)
				+ StringUtils.addColor(LanguageString.jifengTiaoyueCh(GlobalConfig.jifengTiaoyueLg.st101050, [data.winguild.serverid, data.winguild.guildname]), 0x3477EF));
		}
		else {
			this.title.textFlow = TextFlowMaker.generateTextFlow(StringUtils.addColor(str + GlobalConfig.jifengTiaoyueLg.st101062, 0xFFB051)
				+ StringUtils.addColor(GlobalConfig.jifengTiaoyueLg.st100378, 0x3477EF));
		}
		this.groupingTitle.text = str + GlobalConfig.jifengTiaoyueLg.st100896;

		for (var i = 0; i < data.guildlist.length; i++) {
			let info: Sproto.kffz_one = data.guildlist[i];
			if (this["grouping" + i] && info)
				this["grouping" + i].text = LanguageString.jifengTiaoyueCh(GlobalConfig.jifengTiaoyueLg.st101050, [info.serverid, info.guildname]);
		}
	}
}
window["KFguildGroupingItemRenderer"] = KFguildGroupingItemRenderer