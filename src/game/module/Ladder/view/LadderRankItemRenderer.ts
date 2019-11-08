class LadderRankItemRenderer extends eui.ItemRenderer {
	public constructor() {
		super();

		this.skinName = "TiantiRankItem";
	}

	//rankImg
	rank
	nameLabel
	winNum
	// dwImg
	// level
	// levelBg
	bg: eui.Image

	private levelIcon: LadderLevelIcon

	dataChanged() {
		//this.bg.source = this.itemIndex % 2 == 0 ? "ui_ph_di_q@10_10_10_10" : "ui_ph_di_s@10_10_10_10"
		var rankData = this.data;
		// if (rankData.pos <= 3) {
		// 	this.rankImg.source = LadderRankWin.LADDER_RANK_ICON + (2+rankData.pos)+"_png";
		// 	this.rank.text = "";
		// }
		// else {
		// 	this.rank.visible = true;
		// 	this.rank.text = rankData.pos + "";
		// 	this.rankImg.source = "comp_68_68_06_png";
		// }
		this.rank.visible = true;
			this.rank.text = rankData.pos + "";
		this.nameLabel.text = rankData.player;
		this.winNum.text = rankData.winNum + GlobalConfig.jifengTiaoyueLg.st100812;
		this.levelIcon.SetRank(rankData.challgeLevel, rankData.challgeId)
		// this.dwImg.source = LadderWin.GetRankIcon(rankData.challgeLevel)
		// var config = Ladder.ins().getLevelConfig(rankData.challgeLevel, rankData.challgeId);
		// if (config && config.showDan > 0) {
		// 	this.level.source = 'laddergradnum_' + config.showDan;
		// 	this.levelBg.visible = true;
		// }
		// else {
		// 	this.level.source = null;
		// 	this.levelBg.visible = false;
		// }
	};
}
window["LadderRankItemRenderer"]=LadderRankItemRenderer