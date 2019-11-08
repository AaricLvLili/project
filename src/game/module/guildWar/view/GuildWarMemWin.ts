class GuildWarMemWin extends BaseEuiPanel implements ICommonWindow {

    public static LAYER_LEVEL = LayerManager.UI_Main

	public constructor() {
		super()
	}

	commonWindowBg: CommonWindowBg
	list: eui.List
	data
	initUI() {
		this.skinName = "GuildWarMemSkin"
		this.list.itemRenderer = GuildWarMemListRenderer
		this.data = new eui.ArrayCollection
	}

	open() {
		this.commonWindowBg.OnAdded(this)
		this.list.dataProvider = this.data
		GameGlobal.MessageCenter.addListener(MessageDef.GUILDWAR_MYRANK_CHANGE, this.refushList, this)
		GuildReward.ins().SendGetMyGuildRank()
		this.refushList()
	}

	close() {
		this.commonWindowBg.OnRemoved()
		GameGlobal.MessageCenter.removeListener(MessageDef.GUILDWAR_MYRANK_CHANGE, this.refushList, this)
	}

	refushList() {
		this.data.replaceAll(GuildReward.ins().myRankList)
	}

	onTap(e) {
		ViewManager.ins().close(this)
	}
}
window["GuildWarMemWin"]=GuildWarMemWin