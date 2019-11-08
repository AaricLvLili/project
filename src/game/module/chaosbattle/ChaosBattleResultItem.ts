class ChaosBattleResultItem extends eui.ItemRenderer {
	public constructor() {
		super()
		this.skinName = "ChaosBattleResultItemSkin";
	}
	public m_Name: eui.Label;
	public m_Point: eui.Label;
	public m_PointNum: eui.Label;
	public m_RankImg: eui.Image;


	public createChildren() {
		super.createChildren();
		this.m_Point.text = GlobalConfig.jifengTiaoyueLg.st102054;
	}

	public dataChanged() {
		super.dataChanged();
		let data: ChaosBattleRankData = this.data
		this.m_RankImg.source = "comp_68_67_0" + (this.itemIndex + 1) + "_png";
		this.m_PointNum.text = data.pointNum + "";
		this.m_Name.text = data.name;
	}
}
window["ChaosBattleResultItem"] = ChaosBattleResultItem