/**跨服分组*/
class KFguildGroupingWin extends BaseEuiPanel implements ICommonWindow {

	public static LAYER_LEVEL = LayerManager.UI_Main;
	private commonWindowBg: CommonWindowBg;
	private list: eui.List;
	private bestguildname: eui.Label;
	private guildName: eui.Label;
	private myGrouping: eui.Label;
	private entitle: eui.Label;
	private data: eui.ArrayCollection;
	private openDesc1: eui.Label;
	private openDesc2: eui.Label;

	public m_Lan1: eui.Label;
	public m_Lan2: eui.Label;
	public m_Lan3: eui.Label;
	public m_Lan4: eui.Label;


	public constructor() {
		super();
		this.skinName = "KFguildGroupingSkin";
		this.list.itemRenderer = KFguildGroupingItemRenderer;
		this.data = new eui.ArrayCollection([]);
		this.commonWindowBg.title = GlobalConfig.jifengTiaoyueLg.st101872;
		this.m_Lan1.text = GlobalConfig.jifengTiaoyueLg.st101054;
		this.m_Lan2.text = GlobalConfig.jifengTiaoyueLg.st101055;
		this.m_Lan3.text = GlobalConfig.jifengTiaoyueLg.st101056;
		this.m_Lan4.text = GlobalConfig.jifengTiaoyueLg.st101057;

	}

	public open() {
		this.commonWindowBg.OnAdded(this);
		this.list.dataProvider = this.data;
		GameGlobal.MessageCenter.addListener(MessageDef.KF_GUILD_GROUPING_INFO, this.refushGroupingInfo, this)
		GuildWar.ins().sendKFguildGroupInfo();
		this.openDesc1.textFlow = TextFlowMaker.generateTextFlow(StringUtils.addColor(GlobalConfig.jifengTiaoyueLg.st101047, 0x535557)
			+ StringUtils.addColor(GuildWar.ins().setKF1OpenDesc(), Color.Green));

		this.openDesc2.textFlow = TextFlowMaker.generateTextFlow(StringUtils.addColor(GlobalConfig.jifengTiaoyueLg.st101048, 0x535557)
			+ StringUtils.addColor(GuildWar.ins().setKF2OpenDesc(), Color.Green));
	}

	private refushGroupingInfo(rsp: Sproto.sc_gdwar_guild_group_request): void {
		this.bestguildname.textFlow = TextFlowMaker.generateTextFlow(StringUtils.addColor(GlobalConfig.jifengTiaoyueLg.st101049, 0xFFB051)
			+ StringUtils.addColor(rsp.bestguildname, 0x535557));

		this.guildName.text = LanguageString.jifengTiaoyueCh(GlobalConfig.jifengTiaoyueLg.st101050, [rsp.serverid, rsp.guildname]);

		if (rsp.infznumber && rsp.infznumber > 0)
			this.myGrouping.text = LanguageString.jifengTiaoyueCh(GlobalConfig.jifengTiaoyueLg.st101051, [StringUtils.numberToEnglishLetter(rsp.infznumber)]);
		else
			this.myGrouping.text = GlobalConfig.jifengTiaoyueLg.st100378;

		if (rsp.entitle == 2) {
			this.entitle.text = GlobalConfig.jifengTiaoyueLg.st101052;
			this.entitle.textColor = Color.Green;
		}
		else {
			this.entitle.text = GlobalConfig.jifengTiaoyueLg.st101053;
			this.entitle.textColor = Color.Red;
		}

		this.data.replaceAll(rsp.lists);
	}

	public close() {
		this.commonWindowBg.OnRemoved();
		GameGlobal.MessageCenter.removeListener(MessageDef.KF_GUILD_GROUPING_INFO, this.refushGroupingInfo, this)
	}
}
window["KFguildGroupingWin"] = KFguildGroupingWin