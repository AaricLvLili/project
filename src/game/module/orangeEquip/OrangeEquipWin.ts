class OrangeEquipWin extends BaseEuiPanel implements ICommonWindow {

	private commonWindowBg: CommonWindowBg;
	private legendEquipPanel: LegendEquipPanel;
	private orangeEquipPanel: OrangeEquipPanel;
	public constructor() {
		super();
		this.layerLevel = VIEW_LAYER_LEVEL.TOP;
		this.skinName = "MainWinSkin";
		this.commonWindowBg.roleSelectPanel.y = 135;
	}

	initUI() {
		super.initUI()
		this.orangeEquipPanel = new OrangeEquipPanel();
		this.orangeEquipPanel.name = GlobalConfig.jifengTiaoyueLg.st100630;
		this.commonWindowBg.AddChildStack(this.orangeEquipPanel);
		this.legendEquipPanel = new LegendEquipPanel();
		this.legendEquipPanel.name = GlobalConfig.jifengTiaoyueLg.st101855;
		this.commonWindowBg.AddChildStack(this.legendEquipPanel);
	};
	destoryView() {
		super.destoryView()
	};
	open(...param: any[]) {
		this.observe(UserBag.postHuntStore, this.setRedPoint); //道具变更
		this.observe(MessageDef.ITEM_COUNT_CHANGE, this.setRedPoint)

		let selectIndex = param[0] || 0;
		let roleIndex = param[1] || 0;
		this.commonWindowBg.OnAdded(this, selectIndex, roleIndex)
		this.setRedPoint();
	};
	close(...param: any[]) {
		this.commonWindowBg.OnRemoved()
	};

	static openCheck() {
		return true;
	};
	setRedPoint() {
		UserEquip.ins().updateEquipHandler();
		this.commonWindowBg.ShowTalRedPoint(0, UserEquip.ins().checkOrangeRedPointZy())	//橙装红点判断
		this.commonWindowBg.ShowTalRedPoint(1, LegendModel.ins().IsRedPointLegend())
	};

	OnBackClick(clickType: number): number {
		return 0
	}
	OnOpenIndex(openIndex: number): boolean {
		return true
	}
}

ViewManager.ins().reg(OrangeEquipWin, LayerManager.UI_Main);

window["OrangeEquipWin"] = OrangeEquipWin