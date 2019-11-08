class FightResultPanel extends eui.Component {

    public groupEff: eui.Group;
    public closeBtn: eui.Button;

    public m_Double: eui.Group;
    public closeBtn0: eui.Button;
    public closeBtn1: eui.Button;


    private _mc: MovieClip
    public m_TitleImg: eui.Image;
    public m_TitileImg2: eui.Image;
    public createChildren() {
        super.createChildren();
        this.skinName = "FightResultBg"
        //this.closeBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this._closeView, this)
        this.m_Double.visible = false;
        this.closeBtn1.label = GlobalConfig.jifengTiaoyueLg.st101997;
    }

    public SetState(state: string): void {
        this.currentState = state
        if (state == "win") {
            this._mc = ObjectPool.ins().pop("MovieClip")
            this._mc.x = this.groupEff.width >> 1
            this._mc.y = this.groupEff.height >> 1
            this._mc.loadUrl(ResDataPath.GetUIEffePath("eff_jiesuan"), true, -1)
            this.groupEff.addChild(this._mc)
        }
    }
    open() {

    }

    close() {

    }
    $onRemoveFromStage() {
        //this.closeBtn.removeEventListener(egret.TouchEvent.TOUCH_TAP, this._closeView, this)
        DisplayUtils.removeFromParent(this._mc)
        ObjectPool.ins().push(this._mc)
    }

}

window["FightResultPanel"] = FightResultPanel