class KFseeGuildRankPanel extends BaseView implements ICommonWindowTitle{
	private list: eui.List;
	private data:eui.ArrayCollection;
	windowTitleIconName: string = GlobalConfig.jifengTiaoyueLg.st101031;//"L公会排行R"
	public constructor() {
		super()
		this.skinName = "GuildInteRankSkin"
		this.name = GlobalConfig.jifengTiaoyueLg.st101031;//"公会排行"
		this.list.itemRenderer = GuildInteRankItemRenderer
		this.data = new eui.ArrayCollection([])
		this.currentState = "now";
	}

	public open() {
		this.list.dataProvider = this.data
		GameGlobal.MessageCenter.addListener(MessageDef.GUILDWAR_RANK_INFO, this.refushList, this)
		GameSocket.ins().Rpc(C2sProtocol.cs_gdwar_guild_rank);
	}

	public close() {
		GameGlobal.MessageCenter.removeListener(MessageDef.GUILDWAR_RANK_INFO, this.refushList, this)
	}

	private refushList() {
		this.data.replaceAll(GuildReward.ins().guildRankList)
	}

	public UpdateContent(): void {

	}
}
window["KFseeGuildRankPanel"]=KFseeGuildRankPanel