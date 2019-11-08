class GuideUtils extends BaseClass {
    configData
    triggered
    view: GuideView
    WelcomeWin: boolean = false;

    public constructor() {
        super();
        this.configData = GlobalConfig.ins("dialogueConfig");
    }
    public static ins(): GuideUtils {
        return super.ins();
    };
    /**
     * 下一步
     */
    next(obj) {
        if (this.triggered != obj)
            return;
        this.view.resetParent();
        if (this.view == null || this.view.parent == null) {
            return;
        }
        var currStep = Setting.currStep;
        var currPart = Setting.currPart;
        if (!this.configData[currPart]) {
            return
        }
        currStep++;
        if (!this.configData[currPart][currStep]) {
            //下一部分
            let isCompele: boolean = GuideLocalStorage.checkIdIsCompele(currPart);
            if (!isCompele) {
                GuideLocalStorage.addCompeleId(currPart);
            }
            currPart++;
            currStep = 0;
        }
        if (!this.configData[currPart]) {
            //所有引导结束
            currPart = 0;
            currStep = 0;
        }
        Setting.currStep = currStep;
        Setting.currPart = currPart;
        this.hide();
    };

    public checkHaveNext() {
        let isDo: boolean = true;
        var currStep = Setting.currStep;
        var currPart = Setting.currPart;
        currStep++;
        if (!this.configData[currPart][currStep]) {
            //下一部分
            isDo = false;
        }
        return isDo;
    }
    /**
     * 显示
     */
    show(obj, targetPart, targetStep) {
        let isCompele: boolean = GuideLocalStorage.checkIdIsCompele(targetPart);
        if (isCompele) {
            return;
        }
        if (obj.visible == false) {
            return;
        }
        if (!obj.parent) {
            return;
        }
        if (this.isShow()) return;
        var currStep = Setting.currStep;
        var currPart = Setting.currPart;
        if (currPart == targetPart && currStep == targetStep) {
            if (this.configData[currPart] && this.configData[currPart][currStep]) {
                var view: PlayFunView = <PlayFunView>ViewManager.ins().getView(PlayFunView);
                if (view && view.autoPkBoss.selected == true) {
                    view.autoPkBoss.selected = false;
                }
                this.triggered = obj;
                if (this.view == null) {
                    this.view = new GuideView();
                }
                StageUtils.ins().getUIStage().addChild(this.view);
                TimerManager.ins().doNext(
                    function () { this.view.setData(obj, this.configData[currPart][currStep]); }, this
                )


                if (GameLoadingView.m_Instance != null) {
                    if (GameLoadingView.m_Instance.parent != null) {
                        var num: number = StageUtils.ins().getStage().numChildren;
                        StageUtils.ins().getStage().setChildIndex(GameLoadingView.m_Instance, num - 1);
                    }
                }

                // egret.MainContext.instance.stage.addChild(this.view);
                this._closePlayFunAni()
                ViewManager.ins().close(ModulePrompt);
                ViewManager.ins().close(OmGifBagWin);
            }
        }
    };
    /**关闭战斗界面手指动画 */
    private _closePlayFunAni(): void {
        let view = ViewManager.ins().getView(PlayFunView) as PlayFunView
        if (view) {
            view._checkFinger(view.taskTraceBtn, false)
            view._checkFinger(view.guanqiaBtn, false)
        }
    }
    /**
     * 隐藏
     */
    hide() {
        if (this.view) {
            this.view.resetParent()
            DisplayUtils.removeFromParent(this.view);
        }
        this.triggered = null;
    };

    hideFinge() {
        if (this.view) {
            this.view.hideFinger();
        }
    }
    /**
     * 引导是否显示
     */
    isShow() {
        return this.view != null && this.view.parent != null || this.WelcomeWin;
    };
};
// egret.registerClass(GuideUtils,'GuideUtils');
/**激活的关卡 */
enum GuideQuanQiaType {
    // PET = 12,
    // SKILL = 7,
    // SKILL1 = 14,
    // SKILL2 = 23,
    // GAD = 15,
    // Artifact = 20,
    PET = 7,//调整引导条件，原来要求为11
    SKILL = 8,//调整引导条件，原来要求为7
    SKILL1 = 14,
    SKILL2 = 23,
    GAD = 12,//调整引导条件，原来要求为15
    Artifact = 20,
    OnHook = 15,
}
enum GuideArtifact {
    Artifact = 10,
}

enum GuideMissionType {
    PETSTAR = 100026
    ,
}

enum GuideJQType {
    /**左对话窗口1 */
    TYPE1 = 1,
    /**对话窗口2 */
    TYPE2 = 2,
    /**有人物提示窗口 */
    TYPE3 = 3,
    /**无人物提示窗口 */
    TYPE4 = 4,
    /**右对话窗口1 */
    TYPE5 = 5,
}
window["GuideUtils"] = GuideUtils