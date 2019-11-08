/**跨服战个人奖励展示view*/
class KFguildWarOwnRewardPanel extends BaseView {
	private list: eui.List;
	private list1: eui.List;
	private dataArr: eui.ArrayCollection;
	private dataArr1: eui.ArrayCollection;
	private dataList;
	private dataList1;
	public m_Lan1: eui.Label;
	public m_Lan2: eui.Label;

	public constructor() {
		super()
		this.skinName = "KFguildWarOwnRewardSkin";
		this.list.itemRenderer = PersonRewardRenderer;
		this.list1.itemRenderer = GuildInteRewardItemRenderer;
		this.dataArr = new eui.ArrayCollection;
		this.dataArr1 = new eui.ArrayCollection;
		this.m_Lan1.text=GlobalConfig.jifengTiaoyueLg.st101065;
		this.m_Lan2.text=GlobalConfig.jifengTiaoyueLg.st101044;
	}

	open(...param: any[]) {

		GuildWar.ins().guildRankRewardType = param[0];
		this.dataList = [];
		var cfg: any;
		var cfg1: any;
		if (param[0] == 1) {
			cfg = GlobalConfig.ins("GuildBattlePersonalAward1");
			cfg1 = GlobalConfig.ins("GuildBattlePersonalRankAward1");
		}
		else {
			cfg = GlobalConfig.ins("GuildBattlePersonalAward2");
			cfg1 = GlobalConfig.ins("GuildBattlePersonalRankAward2");
		}

		for (var n in cfg) {
			this.dataList.push(cfg[n]);
		}

		if (this.dataArr.source = this.dataList, this.list.dataProvider = this.dataArr) {
			this.dataList1 = [];
			for (var n in cfg1) this.dataList1.push(cfg1[n]);
		}
		this.dataArr1.source = this.dataList1, this.list1.dataProvider = this.dataArr1
	}

	close() {

	}
}
window["KFguildWarOwnRewardPanel"] = KFguildWarOwnRewardPanel