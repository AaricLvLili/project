/**属性加点系统*/
class RoleAddAttrPointWin extends BaseEuiPanel implements ICommonWindow, ICommonWindowTitle {
	public constructor() {
		super();
		this.skinName = "MainWinSkin";
	}

	public commonWindowBg: CommonWindowBg;
	public roleAddAttrPointPanel: RoleAddAttrPointPanel;
	initUI() {
		super.initUI();
		this.roleAddAttrPointPanel = new RoleAddAttrPointPanel();
		this.roleAddAttrPointPanel.name = GlobalConfig.jifengTiaoyueLg.st100597;
		this.commonWindowBg.AddChildStack(this.roleAddAttrPointPanel);
	}

	open(...param: any[]) {
		this.commonWindowBg.OnAdded(this, param && param[0])
	}

	close() {
		this.commonWindowBg.OnRemoved();
	}

	OnBackClick(clickType: number): number {
		return 0
	}

	OnOpenIndex(openIndex: number): boolean {
		return true
	}

	UpdateContent(): void { }
}
ViewManager.ins().reg(RoleAddAttrPointWin, LayerManager.UI_Main);
window["RoleAddAttrPointWin"] = RoleAddAttrPointWin