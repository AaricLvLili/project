class DartCarCompleteItem extends eui.ItemRenderer{
	desc
	public constructor() {
		super()
		this.skinName = "KDDoneItemSkin"

	}
	dataChanged() {
		var config = GlobalConfig.ins("BiaoCheTypeConfig")[DartCarModel.ins().DartCarType];
		if(config)
		{
			if(this.data.win)
				this.desc.text = this.data.name + LanguageString.jifengTiaoyueCh(GlobalConfig.jifengTiaoyueLg.st101722,[config.name]);
			else
				this.desc.text = this.data.name + LanguageString.jifengTiaoyueCh(GlobalConfig.jifengTiaoyueLg.st101723,[config.name])
		}
		else
		{
			this.desc.text = "";
		}
	}
}
window["DartCarCompleteItem"]=DartCarCompleteItem