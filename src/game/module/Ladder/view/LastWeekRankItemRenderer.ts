class LastWeekRankItemRenderer extends eui.ItemRenderer {
	public constructor() {
		super();
	}
	index
	//rankImg
	rank

	nameLabel
	winNum
	// head
	// headBg
	item1
	private levelIcon: LadderLevelIcon

	dataChanged() {
		this.index = this.itemIndex + 1;
		// if (this.index <= 3) {
		// 	// this.rankImg.source = LadderRankWin.LADDER_RANK_ICON + this.index;
		// 	this.rankImg.source = LadderRankWin.LADDER_RANK_ICON + (2+this.index)+"_png";
		// 	this.rank.text = "";
		// }
		// else {
		// 	this.rank.text = this.index + "";
		// 	this.rankImg.source = "comp_68_68_06_png";
		// }
		this.rank.text = this.index + "";
		if (this.data instanceof RankDataLadder) {
			var rankData = this.data;
			// this.dwImg.source = LadderWin.GetRankIcon(rankData.challgeLevel)
			this.nameLabel.text = rankData.player;
			this.winNum.text = rankData.winNum + GlobalConfig.jifengTiaoyueLg.st100812;
			// this.head.source = "main_chathead" + rankData.job;
			// this.headBg.source = "ladder_level_" + rankData.challgeLevel;
			// var config = Ladder.ins().getLevelConfig(rankData.challgeLevel, rankData.challgeId);
			this.item1.data = Ladder.ins().creatRewardData(GlobalConfig.ins("TianTiRankAwardConfig")[this.index + ""].award[0]);
			this.setlevelInfo(rankData.challgeLevel < 4);
			// if (this.index == 1) {
			// 	this.headBg.source = "ladder_level_5";
			// }

			this.levelIcon.SetRank2(rankData.challgeLevel, rankData.challgeId)
		}
		else if (this.data instanceof TianTiDanConfig) {
			var danConfig = this.data;
			this.winNum.text = "";
			this.nameLabel.text = danConfig.showLevel + GlobalConfig.jifengTiaoyueLg.st100816;
			this.item1.data = Ladder.ins().creatRewardData(danConfig.danAward[0]);
			this.setlevelInfo(true);
			// this.headBg.source = "ladder_level_" + danConfig.level;
			this.setlevelInfo(false);
			//this.rankImg.source = "";
			this.rank.text = "";

			this.levelIcon.SetRank2(danConfig.level, 0)
		}
		else {
			this.winNum.text = "";
			this.nameLabel.text = GlobalConfig.jifengTiaoyueLg.st100817 + this.index + GlobalConfig.jifengTiaoyueLg.st100818;
			this.item1.data = Ladder.ins().creatRewardData(GlobalConfig.ins("TianTiRankAwardConfig")[this.index + ""].award[0]);

			this.levelIcon.SetRank2(4, 0)
			// this.headBg.source = "ladder_level_4";
			this.setlevelInfo(false);
			// if (this.index == 1) {
			// 	this.headBg.source = "ladder_level_5";
			// }
		}
	};
	setlevelInfo(boo) {
		// this.levelBg.visible = this.level.visible = boo;
	};
}
window["LastWeekRankItemRenderer"]=LastWeekRankItemRenderer