/**跨服战公会奖励展示view*/
class KFguildWarGuildRewardPanel extends BaseView {

	private itemList: eui.List;
	private list: eui.List;
	dataArr: eui.ArrayCollection;
	dataArr1: eui.ArrayCollection;
	private guildBattleConst: any;
	private title1: eui.Label;
	private title2: eui.Label;
	public m_Lan1: eui.Label;

	public constructor() {
		super();
		this.skinName = "KFguildWarGuildRewardSkin";
		this.dataArr = new eui.ArrayCollection;
		this.dataArr1 = new eui.ArrayCollection;
		this.itemList.itemRenderer = ItemBase;
		this.list.itemRenderer = GuildInteRewardItemRenderer;
		this.m_Lan1.text = GlobalConfig.jifengTiaoyueLg.st101044;
	}

	//param[0](1:跨服小组，2：跨服决赛)
	open(...param: any[]) {

		GuildWar.ins().guildRankRewardType = param[0];
		var dataList = GuildWar.ins().creatGuildRewardList(param[0]);
		this.dataArr1.source = dataList
		this.list.dataProvider = this.dataArr1

		var config: any;
		if (param[0] == 1) {
			this.title1.text = GlobalConfig.jifengTiaoyueLg.st101066;
			this.title2.text = GlobalConfig.jifengTiaoyueLg.st101067;
			config = GlobalConfig.ins("GuildBattleConst1");
		}
		else {
			this.title1.text = GlobalConfig.jifengTiaoyueLg.st101068;
			this.title2.text = GlobalConfig.jifengTiaoyueLg.st101069;
			config = GlobalConfig.ins("GuildBattleConst2");
		}

		var n = config.occupationAward;
		this.dataArr.source = n
		this.itemList.dataProvider = this.dataArr
	}

	close() {
		this.dataArr.source = null
		this.dataArr1.source = null
	}
}
window["KFguildWarGuildRewardPanel"] = KFguildWarGuildRewardPanel