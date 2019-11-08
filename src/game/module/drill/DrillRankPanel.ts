class DrillRankPanel extends BaseEuiPanel implements ICommonWindow, ICommonWindowTitle {
    public constructor() {
        super();
        this.skinName = "DrillRankPanelSkin"
    }
    windowTitleIconName: string
    private commonWindowBg: CommonWindowBg

    public self_rank: eui.Label;
    public list: eui.List;


    UpdateContent(): void {

    }
    open(...param: any[]) {
        this.windowTitleIconName = GlobalConfig.jifengTiaoyueLg.st101738;
        this.commonWindowBg.OnAdded(this)
        var rankModel = Rank.ins().rankModel[param[0]];
        //this.rank.text = 0 < rankModel.selfPos && rankModel.selfPos <= 1000 ? rankModel.selfPos + '' : "未上榜";
        this.list.itemRenderer = DrillRankItem;
        this.list.dataProvider = new eui.ArrayCollection(DrillModel.ins().tryroad_rank.data);
        if (DrillModel.ins().tryroad_rank.rank == 0) {
            this.self_rank.text = GlobalConfig.jifengTiaoyueLg.st100086;
        } else {

            this.self_rank.text = GlobalConfig.jifengTiaoyueLg.st100403 + DrillModel.ins().tryroad_rank.rank;
        }

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
ViewManager.ins().reg(DrillRankPanel, LayerManager.UI_Popup);
window["DrillRankPanel"] = DrillRankPanel