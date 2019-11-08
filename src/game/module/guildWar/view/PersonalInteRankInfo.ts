class PersonalInteRankInfo extends BaseView implements ICommonWindowTitle {

	data
	list
	public m_Lan2: eui.Label;
	public m_Lan3: eui.Label;
	public m_Lan4: eui.Label;
	public m_Lan5: eui.Label;

	public constructor() {
		super()
		this.skinName = "PersonalInteRankSkin"
		this.name = GlobalConfig.jifengTiaoyueLg.st101038;
		this.list.itemRenderer = GuildInteRankItemRenderer
		this.data = new eui.ArrayCollection([])

		this.m_Lan2.text = GlobalConfig.jifengTiaoyueLg.st100821;
		this.m_Lan3.text = GlobalConfig.jifengTiaoyueLg.st100896;
		this.m_Lan4.text = GlobalConfig.jifengTiaoyueLg.st101036;
		this.m_Lan5.text = GlobalConfig.jifengTiaoyueLg.st101037;
	}
	windowTitleIconName: string = GlobalConfig.jifengTiaoyueLg.st101038;
	open() {
		for (var e = [], t = 0; t < arguments.length; t++) e[t] = arguments[t];
		this.list.dataProvider = this.data
		GameGlobal.MessageCenter.addListener(MessageDef.GUILDWAR_PERSONAL_RANK_INFO, this.refushList, this)
		GuildReward.ins().SendPersonalRank()
	}

	close() {
		GameGlobal.MessageCenter.removeListener(MessageDef.GUILDWAR_PERSONAL_RANK_INFO, this.refushList, this)
	}

	refushList() {
		this.data.replaceAll(GuildReward.ins().guildPersonalRankList)
	}

	UpdateContent(): void {

	}
}
window["PersonalInteRankInfo"] = PersonalInteRankInfo