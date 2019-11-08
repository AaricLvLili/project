/**跨服上届战况第一轮view*/
class KFlastFighting1Panel extends BaseView implements ICommonWindowTitle {
	private list: eui.List;
	private bestguildname: eui.Label;
	private guildName: eui.Label;
	private myGrouping: eui.Label;
	private data: eui.ArrayCollection;
	public m_Lan1: eui.Label;
	public m_Lan2: eui.Label;

	windowTitleIconName: string = GlobalConfig.jifengTiaoyueLg.st101058;

	public constructor() {
		super();
		this.skinName = "KFlastFighting1Skin"
		this.name = GlobalConfig.jifengTiaoyueLg.st101061;
		this.data = new eui.ArrayCollection([]);
		this.m_Lan1.text = GlobalConfig.jifengTiaoyueLg.st101054;
		this.m_Lan2.text = GlobalConfig.jifengTiaoyueLg.st101055;
	}

	public open() {
		this.list.itemRenderer = KFguildGroupingItemRenderer;
		this.list.dataProvider = this.data;
		GameGlobal.MessageCenter.addListener(MessageDef.KF_GUILD_LAST_GROUPING_INFO, this.refushGroupingInfo, this)
		GuildWar.ins().sendKFLastGroupingInfo();
	}

	private refushGroupingInfo(rsp: Sproto.sc_gdwar_guild_group_request): void {
		this.bestguildname.textFlow = TextFlowMaker.generateTextFlow(StringUtils.addColor(GlobalConfig.jifengTiaoyueLg.st101049, 0xFFB051)
			+ StringUtils.addColor(rsp.bestguildname, 0x535557));

		this.guildName.text = LanguageString.jifengTiaoyueCh(GlobalConfig.jifengTiaoyueLg.st101050, [rsp.serverid, rsp.guildname])

		if (rsp.infznumber && rsp.infznumber > 0)
			this.myGrouping.text = LanguageString.jifengTiaoyueCh(GlobalConfig.jifengTiaoyueLg.st101051, [StringUtils.numberToEnglishLetter(rsp.infznumber)])
		else
			this.myGrouping.text = GlobalConfig.jifengTiaoyueLg.st100378;
		this.data.replaceAll(rsp.lists);
	}

	public close() {
		GameGlobal.MessageCenter.removeListener(MessageDef.KF_GUILD_LAST_GROUPING_INFO, this.refushGroupingInfo, this)
	}

	public UpdateContent(): void {

	}
}
window["KFlastFighting1Panel"] = KFlastFighting1Panel