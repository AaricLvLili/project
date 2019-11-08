/**
 *
 * @author
 *
 */
class NoticeView extends BaseEuiView {
    list
    frame: eui.Image;
    staticFrame: eui.Image;
    staticLab: eui.Label
    public constructor() {
        super();
        this.list = [];
        this.touchEnabled = false;
        this.touchChildren = false;
    }
    initUI() {
        super.initUI();
        this.frame = new eui.Image;
        this.frame.source = "base_4_4_03_png";
        this.frame.width = 480;
        this.frame.height = 35;
        this.frame.y = 150;//177;
        this.addChild(this.frame);
        this.frame.touchEnabled = false;
        this.frame.visible = false;
        this.touchChildren = false;
        this.touchEnabled = false;

        this.staticFrame = new eui.Image;
        this.staticFrame.source = this.frame.source;
        this.staticFrame.x = 0;
        this.staticFrame.y = this.frame.y + this.frame.height + 1;
        this.staticFrame.width = this.frame.width - this.staticFrame.x;
        this.staticFrame.height = 30;
        this.staticFrame.alpha = 0.75
        this.addChild(this.staticFrame);
        this.staticFrame.visible = false;
        this.staticFrame.touchEnabled = false;

        this.staticLab = new eui.Label;
        this.staticLab.size = 20;
        this.staticLab.textAlign = "center"
        this.staticLab.textColor = 0xff8534;
        this.staticLab.width = this.staticFrame.width
        this.staticLab.fontFamily = "Microsoft YaHei";
        this.staticLab.x = this.staticFrame.x + 4;
        this.staticLab.y = this.staticFrame.y + 5;
        this.addChild(this.staticLab);
        this.staticLab.touchEnabled = false;
        this.staticLab.visible = false;
    };
    /**
     * 显示公告
     * @param str
     */
    showNotice(str) {
        this.frame.visible = true;
        var lab = new eui.Label;
        lab.size = 20;
        lab.textColor = 0xff8534;
        lab.fontFamily = "Microsoft YaHei";
        lab.x = this.frame.width;
        lab.y = this.frame.y + 7;
        lab.textFlow = TextFlowMaker.generateTextFlow(str);
        this.addChild(lab);
        this.list.push(lab);
        if (this.list.length == 1)
            this.tweenLab();
    };
    tweenLab() {
        var lab = this.list[0];
        if (!lab) return;
        var tweenX = 0 - lab.width;
        var t = egret.Tween.get(lab);
        t.to({ "x": tweenX }, lab.width * 25).call(function () {
            egret.Tween.removeTweens(lab);
            // this.removeChild(lab);
            DisplayUtils.removeFromParent(lab);
            this.list.shift();
            if (this.list.length < 1)
                this.frame.visible = false;
            else
                this.tweenLab();
        }, this);
    };
    // 静止公告
    showStaticNotice(str) {
        this.staticFrame.visible = true;
        this.staticLab.visible = true
        this.staticLab.textFlow = TextFlowMaker.generateTextFlow(str);
        // this.staticLab.x = (this.frame.width - this.staticLab.width) / 2;
        // this.staticFrame.x = this.staticLab.x - 4
        // this.staticFrame.width = this.staticLab.width + 8
        TimerManager.ins().doTimer(3000, 1, this.onTimerStopStaticNotice, this);
    }
    onTimerStopStaticNotice() {
        this.staticLab.visible = false
        this.staticFrame.visible = false
    }
};
ViewManager.ins().reg(NoticeView, LayerManager.UI_Tips);
window["NoticeView"] = NoticeView