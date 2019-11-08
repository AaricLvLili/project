class ShareWinMain extends BaseEuiPanel implements ICommonWindow {

    public static LAYER_LEVEL = LayerManager.UI_Main

    private commonWindowBg: CommonWindowBg
    /** 展示道具list*/
    private iconList: eui.List;
    t1: eui.Label
    t2: eui.Label
    t3: eui.Label
    public t0: eui.Label;
    btn: eui.Button
    G1: eui.Group
    cd: eui.Label
    public m_Lan1: eui.Label;

    public constructor() {
        super();

        this.skinName = "ShareWinMainSkin";//共用皮肤
        this.iconList.itemRenderer = ItemBase
        this.commonWindowBg.AddChildStack(new ShareWin1)
        this.commonWindowBg.AddChildStack(new ShareWin2)
        this.commonWindowBg.AddChildStack(new ShareWin3)
        if (ShareModel.ins().infos.newplayer != 2)
            this.commonWindowBg.AddChildStack(new ShareWin4);
        this.commonWindowBg.AddChildStack(new ShareWin5)

        this.m_Lan1.text=GlobalConfig.jifengTiaoyueLg.st101205;
        this.btn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.click, this);
    }

    open(...param: any[]) {
        super.open(param);
        // this.commonWindowBg.RemoveChildStack()
        this.commonWindowBg.OnAdded(this, param ? param[0] : 0)
        this.setRedPoint();
        //MessageCenter.ins().addListener(MessageDef.RING_BUFF_UPDATE, this.setRedPoint, this);
        MessageCenter.ins().addListener(ShareEvt.WX_SHARE, this.update, this);
        MessageCenter.ins().addListener(ShareEvt.WX_SHARECOIN, this.update, this);
        this.update();
    }

    click() {
        var dailyshare = ShareModel.ins().infos.dailyshare;
        if (dailyshare.reward == 1) {
            // if (this.c > 0) return
            if (SdkMgr.isWxGame())
                WxSdk.ins().shareAppMessage();//拉起分享
            // var cfgs = GlobalConfig.share2Config
            // var max = 0;
            // for (var i in cfgs) {
            //     max += 1;
            // }
            // if (dailyshare.count >= max) return true;
            // else if (this.c > 0) return /*UserTips.ErrorTip('分享游戏CD中')*/;
            // let req = new Sproto.cs_share_event_request;
            // GameSocket.ins().Rpc(C2sProtocol.cs_share_event, req, null, this);//
        }
        else if (dailyshare.reward == 0) {
            let req = new Sproto.cs_operate_share_request;
            req.actId = 2  //每日分享 reward
            req.subProto = "reward"
            GameSocket.ins().Rpc(C2sProtocol.cs_operate_share, req, null, this);//
        }
    }

    upBtn() {
        var dailyshare = ShareModel.ins().infos.dailyshare;
        if (dailyshare.reward == 1) {
            this.btn.label = GlobalConfig.jifengTiaoyueLg.st101201;
            this.btn['redPoint'].visible = false//
        }
        else if (dailyshare.reward == 0) {
            this.btn.label = GlobalConfig.jifengTiaoyueLg.st100004;
            this.btn['redPoint'].visible = true//
        }
    }

    updateT3() {
        var cfg = GlobalConfig.share7Config[1]
        this.t3.text = cfg.describe
    }

    update() {
        this.upBtn();
        this.updateCD();
        this.updateT3();

        var info = ShareModel.ins().infos.dailyshare
        var index = info.count + info.reward
        var cfgs = GlobalConfig.share2Config
        var max = 0;
        for (var i in cfgs) {
            max += 1;
        }
        if (index > max) {
            // this.btn.enabled = false
            this.btn.label = GlobalConfig.jifengTiaoyueLg.st101201;
            this.btn['redPoint'].visible = false//
        }
        index = index > max ? max : index
        this.iconList.dataProvider = new eui.ArrayCollection(cfgs[index].tbReward);

        this.t1.textFlow = TextFlowMaker.generateTextFlow(GlobalConfig.jifengTiaoyueLg.st101202);
        this.t0.textFlow = TextFlowMaker.generateTextFlow(LanguageString.jifengTiaoyueCh(GlobalConfig.jifengTiaoyueLg.st101203, [info.count, max]));

        this.t2.text = '' + GameLogic.ins().actorModel.sharecoin

        if (info.count > 0 && info.count <= max) {
            // var time = 0
            // if (info.cdtime > 0) time = info.cdtime;
            // if (info.cdtime == -1) time = cfgs[index].cdTime;
            // if (info.cdtime == 0) time = 0;
            // this.c = info.s + time - Math.floor(egret.getTimer() / 1000);
            // this.c = this.c < 0 ? 0 : this.c
            this.c = ShareModel.ins().getCd();
            this.timer();
        }
    }

    updateCD() {
        if (this.c < 0) this.c = 0;
        var cs = DateUtils.getFormatBySecond(Math.floor(this.c), 1)
        this.cd.textFlow = TextFlowMaker.generateTextFlow(LanguageString.jifengTiaoyueCh(GlobalConfig.jifengTiaoyueLg.st101204, [cs]));
    }

    c = 0 //s
    timer() {
        TimerManager.ins().remove(this.timer, this);
        if (this.timer2()) {
            TimerManager.ins().doTimer(1000, 0, this.timer, this);
        }
        this.updateCD();
    }
    timer2() {
        this.c--;
        if (this.c < 0) return false;
        else return true;
    }

    close() {
        super.close();
        TimerManager.ins().remove(this.timer, this);
        this.commonWindowBg.OnRemoved()
        MessageCenter.ins().removeAll(this)
    }

    setRedPoint() {
        this.commonWindowBg.CheckTabRedPoint()
    }

    OnOpenIndex?(openIndex: number): boolean {
        switch (openIndex) {
            case 1:
            case 2:
            case 4:
                this.G1.visible = true
                break;
            case 0:
            case 3:
                this.G1.visible = false
                break;
        }
        return true
    }
} window["ShareWinMain"] = ShareWinMain 
