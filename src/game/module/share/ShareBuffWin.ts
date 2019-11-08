/**分享buff*/
class ShareBuffWin extends BaseEuiPanel {
    public constructor() {
        super();
    }
    public initUI(): void {
        super.initUI();
        this.skinName = "ShareBuffSkin";
    }

    btn: eui.Button
    text: eui.Label
    text2: eui.Label
    text3: eui.Label
    s = 0

    /** 窗口打开基类调用*/
    public open(...param: any[]): void {
        super.open(param);
        this.btn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.click, this);
        this.update();
    }

    update() {
        var cfg = GlobalConfig.share7Config[1]
        this.m_bg.init(`ShareBuffWin`, cfg.name);
        this.text.text = GlobalConfig.jifengTiaoyueLg.st101942 + cfg.name
        var str = AttributeData.getAttStr(cfg.attrs, 0, 1, ":") as string;
        var s1 = str.split('\n')
        var s2
        var s0 = ''
        for (var i in s1) {
            s2 = s1[i].split(':')
            s0 += s2[0] + ': <font color=#ffe117>' + s2[1] + '</font>\n'
        }
        s0 += '<font color=#ffe117>(' + cfg.name + GlobalConfig.jifengTiaoyueLg.st101943 + ')</font>'
        this.text2.textFlow = TextFlowMaker.generateTextFlow(s0)
        var time = ShareModel.ins().bufftime + ShareModel.ins().bufftime2 - Math.floor(egret.getTimer() / 1000);
        this.s = time >= 0 ? time : 0
        var cs = DateUtils.getFormatBySecond(Math.floor(this.s), 1)
        this.text3.text = '(' + GlobalConfig.jifengTiaoyueLg.st101944 + ' ' + cs + ')'
        this.timer();
    }

    click() {
        ViewManager.ins().close(this)
    }

    updateCD() {
        if (this.s < 0) this.s = 0;
        var cs = DateUtils.getFormatBySecond(Math.floor(this.s), 1)
        this.text3.text = '(' + GlobalConfig.jifengTiaoyueLg.st101944 + ' ' + cs + ')'
    }
    timer() {
        TimerManager.ins().remove(this.timer, this);
        if (this.timer2()) {
            TimerManager.ins().doTimer(1000, 0, this.timer, this);
        }
        this.updateCD();
    }
    timer2() {
        this.s--;
        if (this.s < 0) return false;
        else return true;
    }
    /** 窗口关闭基类调用*/
    public close(): void {
        super.close();
        TimerManager.ins().remove(this.timer, this);
    }

}

ViewManager.ins().reg(ShareBuffWin, LayerManager.UI_Popup); window["ShareBuffWin"] = ShareBuffWin 