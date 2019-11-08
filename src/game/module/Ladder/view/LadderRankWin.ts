class LadderRankWin extends BaseEuiPanel implements ICommonWindow {

	static readonly LADDER_RANK_ICON = "comp_68_68_0"
	public static GetIcon(level: number): string {
		switch (level) {
			case 1: return "comp_95_78_01_png"
			case 2: return "comp_95_78_02_png"
			case 3: return "comp_95_78_03_png"
			case 4: return "comp_95_78_04_png"
		}
		return "comp_95_78_01_png"
	}

	public static GetRankIcon(level: number) {
		switch (level) {
			case 1: return "comp_95_78_01_png"
			case 2: return "comp_95_78_02_png"
			case 3: return "comp_95_78_03_png"
			case 4: return "comp_95_78_04_png"
		}
		return "comp_95_78_01_png"
	}

	private commonWindowBg: CommonWindowBg;
	private ladderPreWeekPanel: LadderPreWeekPanel;
	private ladderRankPanel: LadderRankPanel;
	initUI() {
		super.initUI()
		this.skinName = "MainWinSkin";
		this.ladderPreWeekPanel = new LadderPreWeekPanel();
		this.ladderPreWeekPanel.name = GlobalConfig.jifengTiaoyueLg.st100810;
		this.commonWindowBg.AddChildStack(this.ladderPreWeekPanel);
		this.ladderRankPanel = new LadderRankPanel();
		this.ladderRankPanel.name = GlobalConfig.jifengTiaoyueLg.st100400;
		this.commonWindowBg.AddChildStack(this.ladderRankPanel);
	};
	open(...param: any[]) {
		Rank.ins().sendGetRankingData(RankDataType.TYPE_LADDER)
		let selectIndex = param[0] || 0;
		this.commonWindowBg.OnAdded(this, selectIndex)
		// this.observe(MessageDef.LADDER_UPWEEK_RANK_UPDATE, this.refushredPoint)
		// this.observe(MessageDef.LADDER_PRE_WEEK_REWARD, this.refushredPoint)
		// this.refushredPoint()
	};

	close() {
		this.commonWindowBg.OnRemoved()
		MessageCenter.ins().removeAll(this);
	};

	/**更新红点提示 */
	// refushredPoint() {
	// 	this.commonWindowBg.ShowTalRedPoint(2, Ladder.ins().isCanReward)
	// }

	OnBackClick(clickType: number): number {
		return 0
	}
	OnOpenIndex(openIndex: number): boolean {
		return true
	}
}

ViewManager.ins().reg(LadderRankWin, LayerManager.UI_Main);
window["LadderRankWin"] = LadderRankWin