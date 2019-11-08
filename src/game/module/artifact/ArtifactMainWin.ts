class ArtifactMainWin extends BaseEuiPanel implements ICommonWindow {

    public static LAYER_LEVEL = LayerManager.UI_Main

    private commonWindowBg: CommonWindowBg
    public static openIndex: number = 0;

    private artifactPanel1: ArtifactPanel;
    private artifactPanel2: ArtifactPanel;

    public constructor() {
        super();

        this.skinName = "MainWinSkin";
        this.artifactPanel1 = new ArtifactPanel(1);
        this.commonWindowBg.AddChildStack(this.artifactPanel1);

        this.artifactPanel2 = new ArtifactPanel(2);
        this.commonWindowBg.AddChildStack(this.artifactPanel2);
        // this.artifactLayerPanel = new ArtifactLayerPanel;
        // this.commonWindowBg.AddChildStack(this.artifactLayerPanel);
        // this.shenQiFBPanel = new ShenQiFBPanel;//神器副本
        // this.commonWindowBg.AddChildStack(this.shenQiFBPanel)


    }

    destoryView() {
        super.destoryView();
    }

    open(...param: any[]) {
        this.observe(ArtifactEvt.ARTIFACT_INIT_MSG, this.setRedPoint);
        this.observe(ArtifactEvt.ARTIFACT_GUIDEEND, this.checkGuide);
        this.commonWindowBg.OnAdded(this, param ? param[0] : 0)
        this.setRedPoint();
    }

    close() {
        this.artifactPanel1.release();
        this.artifactPanel2.release();
        // this.artifactLayerPanel.release();
        ArtifactModel.getInstance.scrollV = 0;
        ArtifactModel.getInstance.setIndex(1, 0);
        ArtifactModel.getInstance.setIndex(2, 0);
        this.commonWindowBg.OnRemoved()
    }

    setRedPoint() {
        this.commonWindowBg.CheckTabRedPoint();
        let artifactModel = ArtifactModel.getInstance;
        this.commonWindowBg.ShowTalRedPoint(0, artifactModel.checkAllLvUpAndActivateByType(1) || artifactModel.checkAllLayerUpBuyType(1))/**改了要判断层级 */
        this.commonWindowBg.ShowTalRedPoint(1, artifactModel.checkAllLvUpAndActivateByType(2) || artifactModel.checkAllLayerUpBuyType(2))
        // this.commonWindowBg.ShowTalRedPoint(1, artifactModel.checkAllLayerUp())
    }

    OnOpenIndex?(openIndex: number): boolean {
        if (openIndex == 2) {
            return Deblocking.Check(DeblockingType.TYPE_24)
        }
        return true
    }

    private checkGuide() {
        if (Setting.currPart == 21 && Setting.currStep == 5) {
            GuideUtils.ins().show(this.commonWindowBg.returnBtn, 21, 5);
            this.commonWindowBg.returnBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onClickGuide, this);
        }
    }

    private onClickGuide() {
        GuideUtils.ins().next(this.commonWindowBg.returnBtn);
        this.commonWindowBg.returnBtn.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onClickGuide, this);
    }
}

window["ArtifactMainWin"] = ArtifactMainWin