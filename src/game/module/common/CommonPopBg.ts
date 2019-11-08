class CommonPopBg extends eui.Component {

    public closeButtomBtn: eui.Button;
    public closeTopBtn: eui.Button;
    public txtTitle: eui.Label;

    private _cls: string
    private _callBack: Function

    initUI() {
        //  super.initUI()
        this.skinName = "CommonPopBgSkin";

        this.closeButtomBtn.label = "关闭";
    };
    public init(cls: string, title: string, showButtomClose: boolean = true, callBack: () => void = null, showTopClose: boolean = true): void {
        this.initUI();
        this._cls = cls
        this._callBack = callBack
        this.txtTitle.text = title
        this.closeTopBtn.visible = showTopClose
        this.closeButtomBtn.visible = showButtomClose
        this.closeTopBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this._closeView, this)
        this.closeButtomBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this._closeView, this)
    }
    open() {

    }
    private _closeView(): void {
        ViewManager.ins().close(this._cls);
        if (this._callBack) {
            this._callBack()
        }
        this.close()
    }
    close() {
        //   super.close();
        this.closeTopBtn.removeEventListener(egret.TouchEvent.TOUCH_TAP, this._closeView, this)
        this.closeButtomBtn.removeEventListener(egret.TouchEvent.TOUCH_TAP, this._closeView, this)
        if (this._callBack) {
            this._callBack = null
        }
        this._cls = null
    }
}
//ViewManager.ins().reg(GuildCreateWin, LayerManager.UI_Popup);
window["CommonPopBg"] = CommonPopBg