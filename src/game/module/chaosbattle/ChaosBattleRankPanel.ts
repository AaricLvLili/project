class ChaosBattleRankPanel extends BaseView implements ICommonWindowTitle {
	windowTitleIconName?: string;
	public constructor(data?: any) {
		super();
		this.name = GlobalConfig.jifengTiaoyueLg.st100819;
		this.windowTitleIconName = GlobalConfig.jifengTiaoyueLg.st102018;
		this.skinName = "ChaosBattleRankPanelSkin";
	}
	public m_Lan0: eui.Label;
	public m_Lan1: eui.Label;
	public m_Lan2: eui.Label;
	public m_Lan3: eui.Label;
	public list: eui.List;

	public m_NoRankLab: eui.Label;
	public m_MyRankLab: eui.Label;
	public m_MyRankNumLab: eui.Label;
	public m_MyPointLab: eui.Label;
	public m_MyPointNumLab: eui.Label;

	private listData: eui.ArrayCollection;
	protected childrenCreated() {
		super.childrenCreated();
		this.m_Lan0.text = GlobalConfig.jifengTiaoyueLg.st100400;
		this.m_Lan1.text = GlobalConfig.jifengTiaoyueLg.st100401;
		this.m_Lan2.text = GlobalConfig.jifengTiaoyueLg.st100896;
		this.m_Lan3.text = GlobalConfig.jifengTiaoyueLg.st101037;
		this.m_NoRankLab.text = GlobalConfig.jifengTiaoyueLg.st102017;
		this.m_MyRankLab.text = GlobalConfig.jifengTiaoyueLg.st100403;
		this.m_MyPointLab.text = GlobalConfig.jifengTiaoyueLg.st100060;
		this.list.itemRenderer = ChaosBattleRankItem;
		this.listData = new eui.ArrayCollection();
		this.list.dataProvider = this.listData;
	};
	private addViewEvent() {
		this.observe(ChaosBattleEvt.CHAOSBATTLE_DATAUPDATE_MSG, this.initData);
	}
	private removeEvent() {
	}

	public open() {
		this.addViewEvent();
		this.initData();
	};
	public close() {
		this.removeEvent();
	};

	public release() {
		this.removeEvent();
	}

	private initData() {
		let chaosBattleModel = ChaosBattleModel.getInstance;
		if (chaosBattleModel.myRankNum) {
			this.m_MyRankNumLab.text = chaosBattleModel.myRankNum + "";
		} else {
			this.m_MyRankNumLab.text = GlobalConfig.jifengTiaoyueLg.st100378;
		}
		this.m_MyPointNumLab.text = chaosBattleModel.myPoint + "";
		if (chaosBattleModel.rankDic.values.length <= 0) {
			this.m_NoRankLab.visible = true;
		} else {
			this.m_NoRankLab.visible = false;
		}
		this.listData.replaceAll(chaosBattleModel.rankDic.values);
	}

	UpdateContent(): void {

	}
}
window["ChaosBattleRankPanel"] = ChaosBattleRankPanel