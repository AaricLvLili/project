class TreasureHuntWin extends BaseEuiPanel implements ICommonWindow {

	private commonWindowBg: CommonWindowBg
	private titleIcon;
	public treasureHuntPanel: TreasureHuntPanel;
	public treasureBossPanel: TreasureBossPanel;

	public constructor() {
		super();
		this.layerLevel = VIEW_LAYER_LEVEL.TOP;
	}

	titles = [GlobalConfig.jifengTiaoyueLg.st100032, GlobalConfig.jifengTiaoyueLg.st100041];
	initUI() {
		super.initUI()
		this.skinName = "MainWinSkin";
		this.treasureHuntPanel = new TreasureHuntPanel();
		this.commonWindowBg.AddChildStack(this.treasureHuntPanel);
		// this.treasureBossPanel = new TreasureBossPanel();//屏蔽寻宝boss
		// this.commonWindowBg.AddChildStack(this.treasureBossPanel);
	};
	destoryView() {
		super.destoryView()
	};
	open(...param: any[]) {
		MessageCenter.addListener(UserBag.postHuntStore, this.setRedPoint, this); //道具变更
		this.observe(MessageDef.ITEM_COUNT_CHANGE, this.setRedPoint)

		let selectIndex = param[0] || 0;
		let roleIndex = param[1] || 0;

		this.commonWindowBg.OnAdded(this, selectIndex, roleIndex)


		this.setRedPoint();
	};
	close(...param: any[]) {
		MessageCenter.ins().removeAll(this);
		this.commonWindowBg.OnRemoved()
	};

	static openCheck() {
		return true;
	};
	setRedPoint() {
		this.commonWindowBg.ShowTalRedPoint(0, TreasureHuntWin.IsRedPointByWarehouse() || LegendModel.ins().IsRedItem())
	};

	public static IsRedPointByWarehouse() {
		return UserBag.ins().getHuntGoodsBySort().length > 0
	}

	OnBackClick(clickType: number): number {
		return 0
	}
	OnOpenIndex(openIndex: number): boolean {
		return true
	}

}

ViewManager.ins().reg(TreasureHuntWin, LayerManager.UI_Main);

window["TreasureHuntWin"] = TreasureHuntWin