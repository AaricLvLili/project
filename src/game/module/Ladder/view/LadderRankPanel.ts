class LadderRankPanel extends BaseView implements ICommonWindowTitle {
	public constructor() {
		super()
		this.skinName = "LadderRankPanelSkin";
	}
	public m_Lan1: eui.Label;
	public m_Lan2: eui.Label;
	public m_Lan3: eui.Label;
	public m_Lan4: eui.Label;
	public m_Lan5: eui.Label;

	childrenCreated() {

		this.list.itemRenderer = LadderRankItemRenderer

		this.m_Lan1.text = GlobalConfig.jifengTiaoyueLg.st100821;
		this.m_Lan2.text = GlobalConfig.jifengTiaoyueLg.st100401;
		this.m_Lan3.text = GlobalConfig.jifengTiaoyueLg.st100822;
		this.m_Lan4.text = GlobalConfig.jifengTiaoyueLg.st100823;
		this.m_Lan5.text = GlobalConfig.jifengTiaoyueLg.st100815;
		MessageCenter.addListener(Rank.postRankingData, this.UpdateContent, this)
	}

	open() {

	}

	close() {
	}
	windowTitleIconName: string = GlobalConfig.jifengTiaoyueLg.st100819
	list
	myRank
	WinNum
	// myDwIng
	// levelBg
	// level
	private levelIcon: LadderLevelIcon
	UpdateContent() {
		var rankModel = Rank.ins().rankModel[RankDataType.TYPE_LADDER];
		this.list.dataProvider = new eui.ArrayCollection(rankModel.getDataList());
		this.myRank.text = rankModel.selfPos > 0 ? GlobalConfig.jifengTiaoyueLg.st100811 + rankModel.selfPos : GlobalConfig.jifengTiaoyueLg.st100820;
		this.WinNum.text = GlobalConfig.jifengTiaoyueLg.st100800 + Ladder.ins().winNum + GlobalConfig.jifengTiaoyueLg.st100812;
		this.levelIcon.SetLevel(Ladder.ins().level)
		// this.myDwIng.source = LadderWin.GetRankIcon(Ladder.ins().level)
		// var config = Ladder.ins().getLevelConfig();
		// if (config.showDan > 0) {
		// 	this.levelBg.visible = true;
		// 	this.level.source = 'laddergradnum_' + config.showDan;
		// }
		// else {
		// 	this.levelBg.visible = false;
		// 	this.level.source = null;
		// }
	};
}
window["LadderRankPanel"] = LadderRankPanel