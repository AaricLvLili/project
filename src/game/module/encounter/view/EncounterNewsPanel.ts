class EncounterNewsPanel extends BaseEuiPanel {
	public static LAYER_LEVEL = LayerManager.UI_Popup

	private list: eui.List
	private dialogCloseBtn: eui.Button;
	public titleLabel: eui.Label;

	public constructor() {
		super()
		this.skinName = "ZaoYuNewsSkin"

		this.list.itemRenderer = EncounterNewsItem
		this.titleLabel.text = GlobalConfig.jifengTiaoyueLg.st101441;
	}

	public open() {
		Encounter.ins().SendGetNews()
		this.dialogCloseBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this._OnClick, this);
		this.observe(MessageDef.ENCOUNTER_NEWS_LIST, this.UpdateContent)
		this.UpdateContent()
	}

	public close() {
		this.dialogCloseBtn.removeEventListener(egret.TouchEvent.TOUCH_TAP, this._OnClick, this)
	}
	private _OnClick(e: egret.TouchEvent) {
		ViewManager.ins().close(this);
	}

	public UpdateContent() {
		this.list.dataProvider = new eui.ArrayCollection(Encounter.ins().NewsList)
	}

	public static GetInfoLabel(itemId: number, name: string): egret.ITextElement[] {
		let itemConfig = GlobalConfig.itemConfig[itemId]
		return TextFlowMaker.generateTextFlow(LanguageString.jifengTiaoyueCh(GlobalConfig.jifengTiaoyueLg.st101440, [(ItemBase.QUALITY_COLOR[itemConfig.quality] + ""), itemConfig.name, name]))
	}
}

class EncounterNewsItem extends eui.ItemRenderer {
	item: ItemBase
	info: eui.Label
	time: eui.Label

	public dataChanged() {
		let data: Sproto.encounter_news_data = this.data
		this.item.data = data.itemId
		this.item.isShowName(false)
		this.info.textFlow = EncounterNewsPanel.GetInfoLabel(data.itemId, data.name)
		this.time.text = DateUtils.getFormatBySecond(data.time, 2)
	}
}
window["EncounterNewsPanel"] = EncounterNewsPanel
window["EncounterNewsItem"] = EncounterNewsItem