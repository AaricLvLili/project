class AcrossLadderRankReward extends BaseEuiPanel implements ICommonWindow, ICommonWindowTitle {
	public constructor() {
		super();
	}
	windowTitleIconName = GlobalConfig.jifengTiaoyueLg.st101680;
	private commonWindowBg: CommonWindowBg;
	private acrossLadderRankReward01: AcrossLadderRankReward01;
	public initUI() {
		super.initUI();
		this.skinName = "MainWinSkin";
		this.acrossLadderRankReward01 = new AcrossLadderRankReward01();
		this.acrossLadderRankReward01.name = GlobalConfig.jifengTiaoyueLg.st101026;
		this.commonWindowBg.AddChildStack(this.acrossLadderRankReward01);

	}

	public open(...param: any[]) {
		this.commonWindowBg.OnAdded(this);
		this.observe(MessageDef.ACROSSLADDER_HISTORY_RANK, this.refushRed)
		this.refushRed()
		// this.commonWindowBg.closeBtn = this["closeBtn"];

	}

	public close(...param: any[]) {
		this.commonWindowBg.OnRemoved();
		this.acrossLadderRankReward01.release();
	}

	UpdateContent(): void {

	}

	OnBackClick(clickType: number): number {
		return 0
	}

	OnOpenIndex(openIndex: number): boolean {
		return true
	}

	/**更新红点提示 */
	refushRed() {
		this.commonWindowBg.CheckTabRedPoint();
	}

}
ViewManager.ins().reg(AcrossLadderRankReward, LayerManager.UI_Popup);
window["AcrossLadderRankReward"] = AcrossLadderRankReward