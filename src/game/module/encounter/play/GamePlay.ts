class GamePlay extends BaseEuiPanel implements ICommonWindow {
	private commonWindowBg: CommonWindowBg
	public constructor() {
		super()
		this.layerLevel = VIEW_LAYER_LEVEL.TOP
	}
	public gamePersonPanel: GamePersonPanel;
	public gameLimitPanel: GameLimitPanel;
	public gameCrossPanel: GameCrossPanel;

	initUI() {
		super.initUI()
		this.skinName = "MainWinSkin";
		this.gamePersonPanel = new GamePersonPanel();
		this.gamePersonPanel.name = GlobalConfig.jifengTiaoyueLg.st100537;
		this.commonWindowBg.AddChildStack(this.gamePersonPanel);
		// this.gameLimitPanel = new GameLimitPanel();
		// this.gameLimitPanel.name = GlobalConfig.languageConfig.st100538;
		// this.commonWindowBg.AddChildStack(this.gameLimitPanel);
		// this.gameCrossPanel = new GameCrossPanel();
		// this.gameCrossPanel.name = GlobalConfig.languageConfig.st100539;
		// this.commonWindowBg.AddChildStack(this.gameCrossPanel);
	};

	open(...param: any[]) {
		var index = param[0] == undefined ? 0 : param[0];
		this.commonWindowBg.OnAdded(this, index);
	};
	close() {
		this.commonWindowBg.OnRemoved();
	};

	OnBackClick(clickType: number): number {
		return 0
	}

	OnOpenIndex?(openIndex: number): boolean {
		return true
	}

}
ViewManager.ins().reg(GamePlay, LayerManager.UI_Main);
window["GamePlay"] = GamePlay