class PersonInteRewardInfo extends BaseView implements ICommonWindowTitle {

	list
	list1
	dataArr
	dataArr1
	dataList
	dataList1
	windowTitleIconName: string = GlobalConfig.jifengTiaoyueLg.st101042;
	public m_Lan1: eui.Label;
	public m_Lan2: eui.Label;

	public constructor() {
		super()

		this.skinName = "PersonInteRewardSkin"
		this.name = GlobalConfig.jifengTiaoyueLg.st101042;
		this.list.itemRenderer = PersonRewardRenderer
		this.list1.itemRenderer = GuildInteRewardItemRenderer
		this.dataArr = new eui.ArrayCollection
		this.dataArr1 = new eui.ArrayCollection
		this.m_Lan1.text = GlobalConfig.jifengTiaoyueLg.st101043;
		this.m_Lan2.text = GlobalConfig.jifengTiaoyueLg.st101044;
	}

	open() {
		for (var e = [], t = 0; t < arguments.length; t++) e[t] = arguments[t];
		if (!this.dataList) {
			this.dataList = [];
			var i = GlobalConfig.ins("GuildBattlePersonalAward");
			for (var n in i) this.dataList.push(i[n])
		}
		if (this.dataArr.source = this.dataList, this.list.dataProvider = this.dataArr, !this.dataList1) {
			this.dataList1 = [];
			var i = GlobalConfig.ins("GuildBattlePersonalRankAward");
			for (var n in i) this.dataList1.push(i[n])
		}

		GuildWar.ins().guildRankRewardType = 0;
		this.dataArr1.source = this.dataList1, this.list1.dataProvider = this.dataArr1
	}

	close() {
		for (var e = [], t = 0; t < arguments.length; t++) e[t] = arguments[t]
	}

	UpdateContent(): void {

	}
}
window["PersonInteRewardInfo"] = PersonInteRewardInfo