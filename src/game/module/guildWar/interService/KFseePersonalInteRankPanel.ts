class KFseePersonalInteRankPanel extends BaseView implements ICommonWindowTitle{

	private data:eui.ArrayCollection;
	private list:eui.List;
	public constructor() {
		super()
		this.skinName ="PersonalInteRankSkin"
		this.name = GlobalConfig.jifengTiaoyueLg.st101038;//"个人排行"
		this.list.itemRenderer = GuildInteRankItemRenderer
		this.data = new eui.ArrayCollection([])
	}

	windowTitleIconName: string = GlobalConfig.jifengTiaoyueLg.st101038;//"L个人排行R"
	public open () {
		this.list.dataProvider = this.data
		GameGlobal.MessageCenter.addListener(MessageDef.GUILDWAR_PERSONAL_RANK_INFO, this.refushList, this)
		GameSocket.ins().Rpc(C2sProtocol.cs_gdwar_actor_rank);
	}
	
	public close () {
		 GameGlobal.MessageCenter.removeListener(MessageDef.GUILDWAR_PERSONAL_RANK_INFO, this.refushList, this)
	}
	
	private refushList () {
		this.data.replaceAll(GuildReward.ins().guildPersonalRankList)
	}

	public UpdateContent(): void {

	}
}
window["KFseePersonalInteRankPanel"]=KFseePersonalInteRankPanel