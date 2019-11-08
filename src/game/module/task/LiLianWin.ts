/**
 * 历练
 */
class LiLianWin extends BaseEuiPanel implements ICommonWindow {

    // artifactWin
    private commonWindowBg: CommonWindowBg
    private expWelPanel: ExpWelPanel;
    // private prestige: PrestigeWin;
    public gamePersonPanel: GamePersonPanel;
    initUI() {
        super.initUI();
        this.skinName = "MainWinSkin";


        this.commonWindowBg.AddChildStack(new VitalityNewPanel)
        // let prestige = new PrestigeWin
        // this.prestige = prestige;
        // this.commonWindowBg.AddChildStack(prestige)

        // this.expWelPanel = new ExpWelPanel();
        // this.commonWindowBg.AddChildStack(this.expWelPanel)

        let config = GlobalConfig.ins("BianQiangMethodConfig");

        for (let i in config) {
            let bianQiangMethodConfig = config[i];
            let strongPanel = new StrongPanel();
            let list = [];
            for (let f in bianQiangMethodConfig) {
                if (!strongPanel.name) {
                    strongPanel.name = bianQiangMethodConfig[f].typeName;
                }
                list.push(bianQiangMethodConfig[f])
            }
            strongPanel.config = list;
            this.commonWindowBg.AddChildStack(strongPanel);
        }

        this.gamePersonPanel = new GamePersonPanel();
        this.gamePersonPanel.name = GlobalConfig.jifengTiaoyueLg.st100537;
        this.commonWindowBg.AddChildStack(this.gamePersonPanel);
    };
    destoryView() {
        super.destoryView();
        // this.artifactWin.destructor();
    };
    static openCheck(...param: any[]) {
        var index = param[0] == undefined ? 0 : param[0];
        // if (index == 1) {
        //     return Deblocking.Check(DeblockingType.TYPE_89)
        // }
        return true;
    };
    open(...param: any[]) {
        this.observe(UserTask.postTaskChangeData, this.setRedPoint);
        this.observe(MessageDef.UPDATE_VITALITY, this.setRedPoint);
        this.observe(MessageDef.EXPWEL_INIT_MSG, this.setRedPoint);
		this.observe(MessageDef.UPDATA_TASK, this.setRedPoint);
        var index = param[0] == undefined ? 0 : param[0];
        this.commonWindowBg.OnAdded(this, index)

        this.setRedPoint();
    };
    close() {
        // this.expWelPanel.release();
        // this.prestige.release();
        MessageCenter.ins().removeAll(this);

        this.commonWindowBg.OnRemoved()
        // this.artifactWin.close();
    };

    setRedPoint() {
        this.commonWindowBg.CheckTabRedPoint()
    };
    checkIsOpen(e) {

    };

    OnBackClick(clickType: number): number {
        return 0
    }

    OnOpenIndex(openIndex: number): boolean {
        return true
    }
};

ViewManager.ins().reg(LiLianWin, LayerManager.UI_Main);
window["LiLianWin"] = LiLianWin