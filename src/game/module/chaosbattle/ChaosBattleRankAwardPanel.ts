class ChaosBattleRankAwardPanel extends BaseView implements ICommonWindowTitle {
	windowTitleIconName?: string;
	public constructor(data?: any) {
		super();
		this.name = GlobalConfig.jifengTiaoyueLg.st102020;
		this.windowTitleIconName = GlobalConfig.jifengTiaoyueLg.st102018;
		this.skinName = "PersonInteRewardSkin";
	}
	public list1: eui.List;
	public list: eui.List;
	public m_Lan1: eui.Label;
	public m_Lan2: eui.Label;
	private listData1: eui.ArrayCollection;
	private listData2: eui.ArrayCollection;
	protected childrenCreated() {
		super.childrenCreated();
		this.m_Lan1.text = GlobalConfig.jifengTiaoyueLg.st101043;
		this.m_Lan2.text = GlobalConfig.jifengTiaoyueLg.st101044;
		this.list.itemRenderer = PersonRewardRenderer
		this.list1.itemRenderer = GuildInteRewardItemRenderer
		this.listData1 = new eui.ArrayCollection();
		this.listData2 = new eui.ArrayCollection();
		this.list1.dataProvider = this.listData1;
		this.list.dataProvider = this.listData2;
		let config2 = GlobalConfig.ins("CompetitionPersonalAward");
		let data2 = [];
		for (let key in config2) {
			data2.push(config2[key]);
		}
		this.listData2.replaceAll(data2);

		let config = GlobalConfig.ins("CompetitionPersonalRankAward");
		let data = [];
		for (let key in config) {
			data.push(config[key]);
		}
		this.listData1.replaceAll(data);
	};
	private addViewEvent() {
		this.observe(ChaosBattleEvt.CHAOSBATTLE_DATAUPDATE_MSG, this.initData)
	}
	private removeEvent() {
	}

	public open() {
		this.addViewEvent();
		this.initData();
	};
	public close() {
		this.removeEvent();
	};

	public release() {
		this.removeEvent();
	}

	private initData() {
	}

	UpdateContent(): void {

	}
}
window["ChaosBattleRankAwardPanel"] = ChaosBattleRankAwardPanel