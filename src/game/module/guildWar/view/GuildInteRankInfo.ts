class GuildInteRankInfo extends BaseView implements ICommonWindowTitle {

	////////////////////////////////////////////////////////////////////////////////////////////////////
	// GuildInteRankSkin.exml
	////////////////////////////////////////////////////////////////////////////////////////////////////
	private list: eui.List
	private infoDesc: eui.Label
	private guildName: eui.Label
	////////////////////////////////////////////////////////////////////////////////////////////////////


	data
	windowTitleIconName: string = GlobalConfig.jifengTiaoyueLg.st101031;
	public m_Lan1: eui.Label;
	public m_Lan2: eui.Label;
	public m_Lan3: eui.Label;
	public m_Lan4: eui.Label;
	public m_Lan5: eui.Label;
	public titleDesc: eui.Label;

	public constructor() {
		super()
		this.skinName = "GuildInteRankSkin"
		this.name = GlobalConfig.jifengTiaoyueLg.st101031;
		this.list.itemRenderer = GuildInteRankItemRenderer
		this.data = new eui.ArrayCollection([])
		this.currentState = GuildWar.ins().isWatStart ? "now" : "last"
		this.infoDesc.text = ""
		this.guildName.text = ""
		this.m_Lan1.text = GlobalConfig.jifengTiaoyueLg.st101035;
		this.m_Lan2.text = GlobalConfig.jifengTiaoyueLg.st100821;
		this.m_Lan3.text = GlobalConfig.jifengTiaoyueLg.st100896;
		this.m_Lan4.text = GlobalConfig.jifengTiaoyueLg.st101036;
		this.m_Lan5.text = GlobalConfig.jifengTiaoyueLg.st101037;
		this.titleDesc.text=GlobalConfig.jifengTiaoyueLg.st101063;
	}

	open() {
		for (var e = [], t = 0; t < arguments.length; t++) e[t] = arguments[t];
		this.list.dataProvider = this.data
		GameGlobal.MessageCenter.addListener(MessageDef.GUILDWAR_RANK_INFO, this.refushList, this)
		GuildReward.ins().SendGuildRank()
	}

	close() {
		GameGlobal.MessageCenter.removeListener(MessageDef.GUILDWAR_RANK_INFO, this.refushList, this)
	}

	refushList() {
		this.data.replaceAll(GuildReward.ins().guildRankList)
		if (GuildReward.ins().upGuildName.length > 0) {
			this.guildName.text = GuildReward.ins().upGuildName;
			var e = GlobalConfig.jifengTiaoyueLg.st100280;
			switch (GuildReward.ins().upReason) {
				case 0:
					e = GlobalConfig.jifengTiaoyueLg.st100280;
					break;
				case 1:
					e = GlobalConfig.jifengTiaoyueLg.st101032;
					break;
				case 2:
					e = GlobalConfig.jifengTiaoyueLg.st101033;
			}
			this.infoDesc.text = e
		} else {
			this.guildName.text = GlobalConfig.jifengTiaoyueLg.st101034;
			this.infoDesc.text = GlobalConfig.jifengTiaoyueLg.st100280;
		}
	}

	UpdateContent(): void {

	}
}
window["GuildInteRankInfo"] = GuildInteRankInfo