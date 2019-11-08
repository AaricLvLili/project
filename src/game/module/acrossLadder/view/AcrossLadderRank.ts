class AcrossLadderRank extends BaseEuiPanel implements ICommonWindowTitle {

	windowTitleIconName: string = GlobalConfig.jifengTiaoyueLg.st100879;
	private commonWindowBg: CommonDialog;
	private rankList: eui.List;
	private myRank: eui.Label;
	public m_Scroller: eui.Scroller;
	public m_Lan1: eui.Label;
	public m_Lan2: eui.Label;
	public m_Lan3: eui.Label;
	public m_Lan4: eui.Label;

	public constructor() {
		super()
	}

	initUI() {
		super.initUI()
		this.skinName = "AcrossLadderRankSkin"

		this.m_Lan1.text = GlobalConfig.jifengTiaoyueLg.st100400
		this.m_Lan2.text = GlobalConfig.jifengTiaoyueLg.st100401
		this.m_Lan3.text = GlobalConfig.jifengTiaoyueLg.st100333
		this.m_Lan4.text = GlobalConfig.jifengTiaoyueLg.st100306
	}

	open() {
		for (var e = [], t = 0; t < arguments.length; t++) e[t] = arguments[t];
		this.commonWindowBg.OnAdded(this);
		this.rankList.itemRenderer = AcrossLadderRankItem;
	}

	close() {
		for (var e = [], t = 0; t < arguments.length; t++) e[t] = arguments[t];
		this.commonWindowBg.OnRemoved();
		this.m_Scroller.stopAnimation();
	}

	public UpdateContent(): void {
		var dataList: Array<AcrossLadderRankItemData> = AcrossLadderPanelData.ins().rankList;
		this.rankList.dataProvider = new eui.ArrayCollection(dataList.sort(this.sort));
		let currentRank: number = AcrossLadderPanelData.ins().rank;
		let currentRankStr: string = (currentRank == AcrossLadderPanelData.DEFAULT_RANK) ? AcrossLadderPanelData.DEFAULT_RANK + GlobalConfig.jifengTiaoyueLg.st100874 : currentRank.toString();
		// this.myRank.text = "排名：" + currentRankStr;
		this.myRank.textFlow = <Array<egret.ITextElement>>[
			{ text: GlobalConfig.jifengTiaoyueLg.st100811 },
			{ text: currentRankStr + "" }
		]
	}

	private sort(a: AcrossLadderRankItemData, b: AcrossLadderRankItemData) {
		return a.rank - b.rank;
	}

}
ViewManager.ins().reg(AcrossLadderRank, LayerManager.UI_Popup);
window["AcrossLadderRank"] = AcrossLadderRank