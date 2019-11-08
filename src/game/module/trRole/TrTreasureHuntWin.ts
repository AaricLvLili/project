class TrTreasureHuntWin extends BaseEuiPanel implements ICommonWindow {

	public static LAYER_LEVEL = LayerManager.UI_Main

	private commonWindowBg: CommonWindowBg

	public mActorData: Sproto.sc_show_other_actor_request
	public mRoleData: Role[] = []
	private sxPanel: TrLegendshuxinPanel

	constructor() {
		super()
		this.skinName = "MainWinSkin";

	}
	public createChildren() {
		super.createChildren();
		this.sxPanel = new TrLegendshuxinPanel(this);
		this.commonWindowBg.AddChildStack(this.sxPanel)
	}

	open(...param: any[]) {
		this.mActorData = param[0]
		this.mRoleData = param[1]
		this.commonWindowBg["roleSelect"]["mRoleData"] = this.mRoleData as any
		this.commonWindowBg.OnAdded(this, 0, param[2])
	};
	close(...param: any[]) {
		this.commonWindowBg.OnRemoved()
	};

	OnBackClick(clickType: number): number {
		return 0
	}
	OnOpenIndex(openIndex: number): boolean {
		return true
	}
}
window["TrTreasureHuntWin"] = TrTreasureHuntWin