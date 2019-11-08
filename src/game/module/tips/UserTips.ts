class UserTips extends BaseSystem {

    public static ins(): UserTips {
        return super.ins()
    }

    public constructor() {
        super()
        MessageCenter.ins().addListener(MessageDef.POWER_BOOST, this.showBoostPower, this)
        this.regNetMsg(S2cProtocol.sc_error_code, this._ErrorTip)
    }

    private _ErrorTip(rsp: Sproto.sc_error_code_request) {
        let msg = rsp.msg
        if (msg) {
            this.showTips(msg)
        }
    }

    public static ErrorTip(str: string): void {
        UserTips.ins().showTips("|C:0xff0000&T:" + str + "|");
    }

    public static InfoTip(str: string): void {
        UserTips.ins().showTips("|C:0x535557&T:" + str + "|");
    }

    public static InfoTip2(str: string): void {
        UserTips.ins().showTips("|C:0x00ff00&T:" + str + "|");
    }

    public showTips(str) {
        //调试注释掉
        var view = (<TipsView>ViewManager.ins().open(TipsView));
        DelayOptManager.ins().addDelayOptFunction(view, view.showTips, str);
    }

    public showGoodEquipTips(itemData) {
        (<TipsView>ViewManager.ins().open(TipsView)).showGoodEquipTip(itemData);
    }

    public showBoostPower(currentValue, lastValue): void {
        // console.warn("showBoostPower");
        (<BoostPowerView>ViewManager.ins().open(BoostPowerView)).showBoostPower(currentValue, lastValue);
    }

    public showFuncNotice(lv) {
        console.warn("showFuncNotice");
        // ViewManager.ins().open(FuncNoticeWin).showWin(lv);
    }
}

MessageCenter.compile(UserTips);
window["UserTips"]=UserTips