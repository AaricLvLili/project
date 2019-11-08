/**遗迹争霸公会奖励view*/
class GuildInteRewardInfo extends BaseView implements ICommonWindowTitle {

	////////////////////////////////////////////////////////////////////////////////////////////////////
	// GuildInteRewardSkin.exml
	////////////////////////////////////////////////////////////////////////////////////////////////////
	private itemList: eui.List
	private list1: eui.List
	////////////////////////////////////////////////////////////////////////////////////////////////////

	dataArr
	dataArr1
	windowTitleIconName: string = GlobalConfig.jifengTiaoyueLg.st101039;
	private guildBattleConst: any;
	public m_Lan1: eui.Label;
	public m_Lan2: eui.Label;
	public m_Lan3: eui.Label;

	public constructor() {
		super()

		this.skinName = "GuildInteRewardSkin"
		this.name = GlobalConfig.jifengTiaoyueLg.st101039;
		this.dataArr = new eui.ArrayCollection
		this.dataArr1 = new eui.ArrayCollection
		this.itemList.itemRenderer = ItemBase
		this.list1.itemRenderer = GuildInteRewardItemRenderer
		this.m_Lan1.text = GlobalConfig.jifengTiaoyueLg.st101040;
		this.m_Lan2.text = GlobalConfig.jifengTiaoyueLg.st101041;
		this.m_Lan3.text = GlobalConfig.jifengTiaoyueLg.st100920;
	}

	open() {

		GuildWar.ins().guildRankRewardType = 0;
		if (this.guildBattleConst == null)
			this.guildBattleConst = GlobalConfig.ins("GuildBattleConst");

		var dataList = GuildWar.ins().creatGuildRewardList();
		this.dataArr1.source = dataList
		this.list1.dataProvider = this.dataArr1
		var n = this.guildBattleConst.occupationAward;
		this.dataArr.source = n
		this.itemList.dataProvider = this.dataArr
	}

	close() {
		for (var e = [], t = 0; t < arguments.length; t++) e[t] = arguments[t];
		this.dataArr.source = null
		this.dataArr1.source = null
	}

	UpdateContent(): void {

	}
}

window["GuildInteRewardInfo"] = GuildInteRewardInfo