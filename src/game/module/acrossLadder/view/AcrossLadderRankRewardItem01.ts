class AcrossLadderRankRewardItem01 extends eui.ItemRenderer {
	public constructor() {
		super();
	}
	private m_ranking: eui.Image;
	private m_rankingTxt: eui.Label;
	private goodsConfig: any = GlobalConfig.ins("ItemConfig");
	public m_List: eui.List;
	public listData: eui.ArrayCollection;
	public createChildren() {
		super.createChildren();
		this.m_List.itemRenderer = ItemBase;
		this.listData = new eui.ArrayCollection;
		this.m_List.dataProvider = this.listData;
	}

	protected dataChanged() {
		let text = "";
		let kuafuJingJiDayAwardConfig = GlobalConfig.ins("KuafuJingJiDayAwardConfig")[this.data.paixuId];
		if (kuafuJingJiDayAwardConfig) {
			text = kuafuJingJiDayAwardConfig.shuoMing;
		}
		this.m_rankingTxt.text = LanguageString.jifengTiaoyueCh(GlobalConfig.jifengTiaoyueLg.st101635, [text]);
		var awards: Array<any> = this.data.award;
		this.listData.removeAll();
		this.listData.replaceAll(awards);
		this.listData.refresh();
	}
}
window["AcrossLadderRankRewardItem01"] = AcrossLadderRankRewardItem01