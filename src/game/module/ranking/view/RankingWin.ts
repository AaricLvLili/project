class RankingWin extends BaseEuiPanel implements ICommonWindow {
	public constructor() {
		super()
		this.layerLevel = VIEW_LAYER_LEVEL.TOP
	}
	public rankingpanel: RankingPanel;


	private commonWindowBg: CommonWindowBg

	initUI() {
		super.initUI()
		this.skinName = "MainWinSkin";
		this.rankingpanel = new RankingPanel();
		this.rankingpanel.name=GlobalConfig.jifengTiaoyueLg.st100091;
		this.commonWindowBg.AddChildStack(this.rankingpanel);
	};
	open(...param: any[]) {
		let lastSelect = null != param[0] ? param[0] : 0
		let tabIndex = null != param[1] ? param[1] : 0
		this.commonWindowBg.OnAdded(this, lastSelect, 0)

		this.observe(Rank.postPraiseResult, this.updateRedPoint)
		this.observe(Rank.postPraiseData, this.updateRedPoint)
	};
	close() {
		this.commonWindowBg.OnRemoved()
		this.removeObserve()
		this.rankingpanel.release();
	};

	updateRedPoint() {
		this.commonWindowBg.ShowTalRedPoint(0, Rank.ins().canPraiseInAll())
	}

	OnBackClick(clickType: number): number {
		return 0
	}
	OnOpenIndex(openIndex: number): boolean {
		return true
	}
}

ViewManager.ins().reg(RankingWin, LayerManager.UI_Main);

window["RankingWin"] = RankingWin