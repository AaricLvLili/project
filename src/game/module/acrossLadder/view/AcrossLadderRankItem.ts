class AcrossLadderRankItem extends eui.ItemRenderer {

	public bg: eui.Image;
	public rankLabel: eui.Label;
	public nameLabel: eui.Label;
	public lvLabel: eui.Label;
	public powerLabel: eui.Label;
	//public m_RankImg: eui.Image;

	public constructor() {
		super();
		this.skinName = "AcrossLadderRankItemSkin";
	}

	protected dataChanged(): void {
		var info: AcrossLadderRankItemData = this.data;
		this.bg.visible = (this.itemIndex % 2 == 1);
		let rank = info.rank;
		// if (rank <= 3) {
		// 	this.rankLabel.visible = false;
		// 	this.m_RankImg.visible = true;
		// 	this.m_RankImg.source = `comp_47_49_${rank}_png`
		// } else {
		// 	this.rankLabel.visible = true;
		// 	this.m_RankImg.visible = false;
		// 	this.rankLabel.text = info.rank.toString();
		// }
		this.rankLabel.text = info.rank + '';
		this.nameLabel.text = info.name.toString();
		this.lvLabel.text =  LanguageString.jifengTiaoyueCh(GlobalConfig.jifengTiaoyueLg.st101443, [info.zhLv.toString(),  info.lv.toString()]);
		this.powerLabel.text = info.power.toString();
	}
}
window["AcrossLadderRankItem"]=AcrossLadderRankItem