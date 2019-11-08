class FbAndLevelsRankWin extends BaseEuiPanel implements ICommonWindowTitle {
    public constructor() {
        super();

        this.skinName = "FbRankSkin";
    }

    windowTitleIconName?: string

    UpdateContent(): void {

    }

    private rank
    private list
    private m_Lan1: eui.Label;
    private m_Lan2: eui.Label;
    private m_Lan3: eui.Label;
    private m_Lan4: eui.Label;
    private m_Lan5: eui.Label;
    private commonWindowBg: CommonWindowBg

    initUI() {
        super.initUI();
        this.list.itemRenderer = FbAndLevelsRankItem;
        this.m_Lan1.text = GlobalConfig.jifengTiaoyueLg.st100400;
        this.m_Lan2.text = GlobalConfig.jifengTiaoyueLg.st100401;
        this.m_Lan3.text = GlobalConfig.jifengTiaoyueLg.st100306;
        this.m_Lan4.text = GlobalConfig.jifengTiaoyueLg.st100402;
        this.m_Lan5.text = GlobalConfig.jifengTiaoyueLg.st100403;
    }
    open(...param: any[]) {
        this.windowTitleIconName = param[0] == 3 ? GlobalConfig.jifengTiaoyueLg.st100380 : GlobalConfig.jifengTiaoyueLg.st100388;//"关卡排名" : "通关排名"
        this.commonWindowBg.OnAdded(this)
        var rankModel = Rank.ins().rankModel[param[0]];
        this.rank.text = 0 < rankModel.selfPos && rankModel.selfPos <= 1000 ? rankModel.selfPos + '' : GlobalConfig.jifengTiaoyueLg.st100086;//"未上榜";
        this.list.dataProvider = new eui.ArrayCollection(rankModel.getDataList());
    };

    close() {
        this.commonWindowBg.OnRemoved()
    };

    OnBackClick(clickType: number): number {
        return 0
    }

    OnOpenIndex(openIndex: number): boolean {
        return true
    }
}

ViewManager.ins().reg(FbAndLevelsRankWin, LayerManager.UI_Main);

window["FbAndLevelsRankWin"] = FbAndLevelsRankWin