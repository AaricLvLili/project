/**
 * 欢迎面板
 */
class WelcomeWin extends BaseEuiPanel {
    public constructor() {
        super();
    }
    public static isOpen = false;
    initUI() {
        super.initUI();
        this.skinName = "welcomePanelSkin";
    };
    open() {
        WelcomeWin.isOpen = true;
        var param = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            param[_i - 0] = arguments[_i];
        }
        this.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTap, this);
    };
    close() {
        WelcomeWin.isOpen = false;
        var param = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            param[_i - 0] = arguments[_i];
        }
        this.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onTap, this);
    };
    onTap(e) {
        ViewManager.ins().close(WelcomeWin);

    };
};
ViewManager.ins().reg(WelcomeWin, LayerManager.UI_Popup);
window["WelcomeWin"] = WelcomeWin;