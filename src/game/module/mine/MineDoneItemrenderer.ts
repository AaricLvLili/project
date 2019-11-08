class MineDoneItemrenderer extends eui.ItemRenderer {
	desc

	public constructor() {
		super()
		this.skinName = "KDDoneItemSkin"

	}
	dataChanged() {
		var e = GameGlobal.mineModel.getCfgByType();
		e
			? 1 == this.data.win
				? this.desc.text = LanguageString.jifengTiaoyueCh(GlobalConfig.jifengTiaoyueLg.st101767, [this.data.name, e.name])
				: this.desc.text = LanguageString.jifengTiaoyueCh(GlobalConfig.jifengTiaoyueLg.st101768, [this.data.name, e.name])
			: this.desc.text = ""
	}
}
window["MineDoneItemrenderer"] = MineDoneItemrenderer