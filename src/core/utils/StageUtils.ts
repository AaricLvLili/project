class StageUtils extends BaseClass {

    private static _uiStage: eui.UILayer
    public autoWidth = 800;
    public autoHeight = 1386;

    public autoPos: egret.Point = new egret.Point();
    public constructor() {
        super();
        if (StageUtils._uiStage == null) {
            StageUtils._uiStage = new eui.UILayer();
            StageUtils._uiStage.touchEnabled = false;
            StageUtils._uiStage.percentHeight = 100;
            StageUtils._uiStage.percentWidth = 100;
            // StageUtils._uiStage.scaleX = StageUtils._uiStage.scaleY = 2.25
            this.getStage().addChild(StageUtils._uiStage);
        }
    }

    public static ins(): StageUtils {
        return super.ins();
    }

    public getHeight(): number {
        return this.getStage().stageHeight;
    }

    /**
     * 获取游戏宽度
     * @returns {number}
     */
    public getWidth(): number {
        return this.getStage().stageWidth;
    }

    /**
     * 指定此对象的子项以及子孙项是否接收鼠标/触摸事件
     * @param value
     */
    public setTouchChildren(value: boolean): void {
        this.getStage().touchChildren = value;
    }

    /**
     * 设置同时可触发几个点击事件，默认为2
     * @param value
     */
    public setMaxTouches(value: number): void {
        this.getStage().maxTouches = value;
    }

    /**
     * 设置帧频
     * @param value
     */
    public setFrameRate(value: number): void {
        this.getStage().frameRate = value;
    }

    /**
     * 设置适配方式
     * @param value
     */
    public setScaleMode(value: string): void {
        this.getStage().scaleMode = value;
    }

    public getStage(): egret.Stage {
        return egret.MainContext.instance.stage;
    }

    /**
     * 获取唯一UIStage
     * @returns {eui.UILayer}
     */
    public getUIStage(): eui.UILayer {
        return StageUtils._uiStage;
    }

    /**
 * 开启全屏适配方案
 */
    private designWidth: number;
    private designHeight: number;
    private resizeCallback: Function;

    public startFullscreenAdaptation(designWidth: number, designHeight: number, resizeCallback: Function): void {
        this.designWidth = designWidth;
        this.designHeight = designHeight;
        this.resizeCallback = resizeCallback;
        this.stageOnResize();
    }

    private stageOnResize(): void {
        this.getStage().removeEventListener(egret.Event.RESIZE, this.stageOnResize, this);

        var agent = navigator.userAgent
        // if(agent.indexOf("Mi") != -1){//临时针对小米处理
        //      StageUtils.ins().setScaleMode(egret.StageScaleMode.EXACT_FIT);
        // }
        // if(1==1) return;
        var designWidth: number = this.designWidth;
        var designHeight: number = this.designHeight;
        var clientWidth: number = window.innerWidth;
        var clientHeight: number = window.innerHeight;
        var a: number = clientWidth / clientHeight;
        var b: number = designWidth / designHeight;
        var c: number = a / b;
        if (a > b) {
            var c1 = c;
            var c2 = c;
            designWidth = Math.floor(designWidth * c1);
            designHeight = Math.floor(designHeight * c2);
        }

        console.log(a, b, c);
        console.log(designWidth, designHeight);

        this.resizeCallback && this.resizeCallback();

        if (this.IsPC()) {
            StageUtils.ins().setScaleMode(egret.StageScaleMode.SHOW_ALL);
            StageUtils.ins().getStage().orientation = egret.OrientationMode.AUTO;
        }
        else {
            StageUtils.ins().setScaleMode(egret.StageScaleMode.FIXED_WIDTH);
            this.getStage().setContentSize(designWidth, designHeight);
            this.getUIStage().setContentSize(designWidth, designHeight);
        }
        this.getStage().addEventListener(egret.Event.RESIZE, this.stageOnResize, this);
    }

    IsPC() {
        var userAgentInfo = navigator.userAgent;
        var Agents = ["Android", "iPhone",
            "SymbianOS", "Windows Phone",
            "iPad", "iPod"];
        var flag = true;
        for (var v = 0; v < Agents.length; v++) {
            if (userAgentInfo.indexOf(Agents[v]) > 0) {
                flag = false;
                break;
            }
        }
        return flag;
    }
}
window["StageUtils"]=StageUtils