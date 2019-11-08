/** 微信 添加到我的小游戏界面*/
class AddMiniGame extends BaseEuiPanel {
    public constructor() {
        super();
    }
    public initUI(): void {
        super.initUI();
        this.skinName = "AddMiniGameSkin";

        this.iconList.itemRenderer = ItemBase;
    }

    commonWindowBg: CommonWindowBg
    t1: eui.Label
    /** 展示道具list*/
    private iconList: eui.List;
    /** 领取奖励*/
    private awardBtn: eui.Button;
    /**wx添加小程序，奖励状态*/
    static listener() {
        Sproto.SprotoReceiver.AddHandler(S2cProtocol.sc_add_small_routine_state, AddMiniGame.changeState, AddMiniGame) //wx添加小程序，奖励状态
    }
    static isShow() {
        if (AddMiniGame.state == 2 || (!Main.isDebug && !SdkMgr.isWxGame()))
            return false;
        else return true;
    }
    //添加小程序，奖励状态 #0为未添加、1为可领取、2为已领取，同时控制入口是否隐藏
    static state = 2
    /**0为未添加、1为可领取、2为已领取，同时控制入口是否隐藏*/
    static changeState(bytes: Sproto.sc_add_small_routine_state_request) {
        AddMiniGame.state = bytes.state
        var view = ViewManager.ins().getView(AddMiniGame) as AddMiniGame
        if (view) view.update()
    }

    /** 窗口打开基类调用*/
    public open(...param: any[]): void {
        super.open(param);
        this.commonWindowBg.title = GlobalConfig.jifengTiaoyueLg.st101940
        this.commonWindowBg.OnAdded(this)
        this.awardBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.awardClick, this);
        this.update();
    }

    update() {
        var cfg = GlobalConfig.ins("ChongZhi1Config")[100][0][0]
        this.iconList.dataProvider = new eui.ArrayCollection(cfg.awardList);
        if (AddMiniGame.state == 2) {
            this.awardBtn.visible = false//
            this.t1.visible = true
        }
        else {
            this.awardBtn.visible = true//
            this.t1.visible = false
        }
    }

    /** 窗口关闭基类调用*/
    public close(): void {
        super.close();
        this.commonWindowBg.OnRemoved()
    }

    /** 领取奖励*/
    private awardClick(e: egret.TouchEvent): void {
        if (AddMiniGame.state != 2) {
            if (WxSdk.ins().loginscene == '1104' || WxSdk.ins().loginscene == '1103' || WxSdk.ins().scene == '1104' || WxSdk.ins().scene == '1103' || !SdkMgr.isWxGame()) {
                let req = new Sproto.cs_small_routine_gain_request;
                GameSocket.ins().Rpc(C2sProtocol.cs_small_routine_gain, req, null, this);//请求奖励
            }
            else {
                UserTips.ErrorTip(GlobalConfig.jifengTiaoyueLg.st101941);
            }
        }
    }
}

ViewManager.ins().reg(AddMiniGame, LayerManager.UI_Main); window["AddMiniGame"] = AddMiniGame 
