declare var wx;
declare var require;
declare var canvas;
if (SdkMgr.isWxGame()) {
    window['alert'] = function (str) {
        wx.showModal({ title: str })
    }
    window['xiangjiaoSDK'] = require('../wx_xj_sdk.min.js'); //只用于微信
}

class Main extends eui.UILayer {
    public static isDebug: boolean;
    public static isRelease: boolean;
    public static isPlatform: boolean
    public static instance: Main
    public static wxsystemInfo: WxSystemInfo
    public static isLiuhai;

    public constructor() {
        super();
        Main.instance = this;
        this.addEventListener(egret.Event.ADDED_TO_STAGE, this.onAddToStageFun, this);
    }

    private onAddToStageFun(event: egret.Event) {
        this.removeEventListener(egret.Event.ADDED_TO_STAGE, this.onAddToStageFun, this);
        Main.isLiuhai = (2.05 < window.innerHeight / window.innerWidth);
        //监听全局错误事件
        if (SdkMgr.isWxGame())
            WxSdk.ins().onError();
        else {
            Main.isDebug = window["isDebug"];
            Main.isRelease = window["isRelease"];
            LocationProperty.init();
            StartGetUserInfo.isOne = LocationProperty.urlParam["isOne"] ? Boolean(LocationProperty.urlParam["isOne"]) : false;
            egret.log("debug" + Main.isDebug + "isOne" + StartGetUserInfo.isOne);
            SdkMgr.currSdk = LocationProperty.urlParam["currSdk"];
            SdkMgr.tag = LocationProperty.urlParam["tag"];
            SdkMgr.serverUrl = LocationProperty.urlParam["serverUrl"];
            SdkMgr.functionUrl = LocationProperty.urlParam["functionName"];
            if (window.location.href.indexOf("1109022409") > 0 && SdkMgr.currSdk == null) {//因为玩吧特殊性，不能拼接参数，所以改成写死先
                SdkMgr.currSdk = SdkMgr.P_TYPE_8;
                SdkMgr.serverUrl = "bsymx_busiyi_wanba";
            }
            if (SdkMgr.currSdk == SdkMgr.P_TYPE_9) {
                SdkMgr.serverUrl = "bsymx_baoyu_ppl_xiaoqi";
                SdkMgr.tag = "bsymx_baoyu_zxdl_h5";
                SdkMgr.functionUrl = "bsymx/baoyuzxdl/xqH5Verify";
                Main.isLiuhai = false;
            }
            if (SdkMgr.currSdk == SdkMgr.P_TYPE_10) {
                SdkMgr.serverUrl = "bsymx_baoyu_jfty_h5";
                SdkMgr.tag = "bsymx_baoyu_jfty_h5";
                SdkMgr.functionUrl = "bsymx/baoyujfty/h5Verify";
            }
            if (window["qg"] && SdkMgr.currSdk == null) {
                window['alert'] = function (str) {
                    window["qg"].showToast({
                        message: str
                    })
                }
                egret.log("vivo小游戏");
                Main.isDebug = false;
                SdkMgr.currSdk = SdkMgr.P_TYPE_11;
                SdkMgr.serverUrl = "bsymx_vivomini";
                SdkMgr.tag = "bsymx_vivomini";
                SdkMgr.functionUrl = "Bsymx/Baoyujfty/vivoVerify";
                SdkMgr.requestType = 2;
                require('../js/language.js');
            }
            if (window["qq"] && SdkMgr.currSdk == null) {
                window['alert'] = function (str) {
                    window["qq"].showModal({ title: str })
                }
                egret.log("qq小游戏");
                SdkMgr.serverUrl = "bsymx_qqgame";
                SdkMgr.currSdk = SdkMgr.P_TYPE_12;
                require('../js/language.js');
                Main.isDebug = true;
            }
            SdkMgr.deviceModel = LocationProperty.urlParam["deviceModel"];
        }
        //记录登录使用的资源
        ResMgr.ins().saveLoadingRes("pic_bj_22_png");
        ResMgr.ins().saveLoadingRes("comp_500_433_04_png");
        ResMgr.ins().saveLoadingRes("comp_500_433_01_png");
        ResMgr.ins().saveLoadingRes("comp_500_433_03_png");
        ResMgr.ins().saveLoadingRes("comp_500_433_05_png");
        ResMgr.ins().saveLoadingRes("comp_500_433_06_png");

        if (Main.isDebug || SdkMgr.isWxGame()) {
            this.addDefault();
        }
        else {
            this.getServerUrl();
            this.intervalID = setInterval(() => {
                this.getServerUrl()
            }, 3000);
        }
    }
    private intervalID: any;
    private getServerUrl() {
        var url: string = "";
        url = "https://ro-api.h5aiwan.com/api/server/getGameUrl?ver=" + SdkMgr.serverUrl;
        var requestServer: egret.HttpRequest = new egret.HttpRequest();
        requestServer.responseType = egret.HttpResponseType.TEXT;
        requestServer.open(url, egret.HttpMethod.GET);
        requestServer.send();
        requestServer.addEventListener(egret.Event.COMPLETE, this.sendServerUrl, this);
        egret.log("请求服务器地址：" + url);
    }
    /** php后台返回服务器请求登录地址*/
    private sendServerUrl(e: egret.Event): void {
        var serverRequest: egret.HttpRequest = <egret.HttpRequest>e.currentTarget;
        serverRequest.removeEventListener(egret.Event.COMPLETE, this.sendServerUrl, this);
        var jsonObj: any = JSON.parse(serverRequest.response);
        egret.log("返回服务器地址信息》》" + serverRequest.response);
        if (jsonObj.code == 200) {
            clearInterval(this.intervalID);
            egret.log("请求成功，清除定时器" + this.intervalID);
            Const.SERVER_LIST_URL = jsonObj.data.url;
            Const.RES_URL = jsonObj.data.resource;
            SdkMgr.version = jsonObj.data.version;
            this.addDefault();
        }
        else {
            alert("请求地址结果：" + jsonObj.message);
        }
    }

    public static errorBack(strErr: any): void {
        if (Main.isDebug) return;
        var str: string = '';
        if (GameLogic.ins() && GameLogic.ins().actorModel) {
            if (GameLogic.ins().actorModel.name == null)
                str += "玩家账号：" + StartGetUserInfo.uid + ">>>";
            else
                str += "玩家名字：" + GameLogic.ins().actorModel.name + ">>>";
        }

        str += "服务器id" + GameServer.serverID + ">>>";
        str += strErr;
        StatisticsUtils.debugInfoLogPhp(str);
    }

    private Init2() {
        // GameSocket.httpsProtocol = document.location.protocol;
        if (SdkMgr.isWxGame()) {
            GameSocket.httpsProtocol = GameSocket.HTTPS
        }
        else if (SdkMgr.currSdk == SdkMgr.P_TYPE_11 || SdkMgr.currSdk == SdkMgr.P_TYPE_12) {
            GameSocket.httpsProtocol = GameSocket.HTTPS;
        }
        else GameSocket.httpsProtocol = GameSocket.HTTP;
        if (SdkMgr.isWxGame()) {
            WxSdk.ins().getLaunchOptionsSync()
            WxSdk.ins().showOrHiedeShare(true);
            WxSdk.ins().onShareAppMessage();
            WxSdk.ins().onMemoryWarning();
            WxSdk.ins().wxOnShow();
            // WxSdk.ins().exitMiniProgram();
            // WxSdk.ins().getUserWx()
        }

        if (Main.isDebug) {
            Main.isPlatform = window["isPlatform"];
        } else {
            Main.isPlatform = true;
        }
        egret.TextField.default_fontFamily = "Microsoft YaHei,SimSun,Arial"
        egret.DisplayObject.defaultTouchEnabled = false

        StageUtils.ins().startFullscreenAdaptation(480, 800, null);

        Sproto.SprotoCore.Init();
        Sproto.SprotoSender.Init(new C2sProtocol().GetProtocol());
        Sproto.SprotoReceiver.Init(new S2cProtocol().GetProtocol());

        this.initModule()
        egret.ImageLoader.crossOrigin = "anonymous";
        RES.setMaxLoadingThread(4);

        if (Main.isDebug) {
            var arr2 = window['resList'];
            if (arr2 && arr2.length && arr2.length > 0) {
                euiextension.DropDownList.resData = arr2[0]
            }
        }
        ResVersionManager.ins();
        this.mStartView = new StartGameView(this);//改成每次都初始化StartGameView

        if (Const.IsLoadType01) {
            StartGetUserInfo.mResult = () => {
                Main.instance.addChild(Main.instance.mStartView);
                egret.log("添加startgame");
                if (StartGetUserInfo.mAutoEnterGame) {
                    StartGetUserInfo.Login();
                } else {
                    Main.instance.mStartView.callbackFun = (thisObj) => {
                        // 连接中  
                        if (GameSocket.ins().GetSocketState() == GameSocket.STATUS_CONNECTING) {
                            egret.log("正在连接")
                            return
                        }
                        if (RoleMgr.Checking) {

                            egret.log("正在检查账号")
                            return
                        }
                        // 关闭现有的连接
                        GameSocket.ins().close()
                        StartGetUserInfo.Login()
                    };
                }
            }

            if (Main.isDebug) {
                StartGetUserInfo.GetUserInfo();
            }
            else {//走这边，就是进入sdk
                if (SdkMgr.isWxGame()) {
                    WxSdk.ins().getUserWx()
                    WxSdk.ins().wxLoging();
                }
                else SdkMgr.getParam();
            }
        }
        else {
            StartGetUserInfo.mServerData = {
                id: LocationProperty.urlParam["serverid"],
                name: LocationProperty.urlParam["name"],
                version: LocationProperty.urlParam["version"],
                ip: LocationProperty.urlParam["url"],
                status: LocationProperty.urlParam["status"],
            }
            Main.LoadResVersionComplate();
        }

        // RedPointMgr.Init();
        egret.log("运行引擎:" + navigator.userAgent);
    }

    public static AddCreateRoleView() {
        if (Main.instance == null) {
            return
        }
        Main.instance.createRoleView = new CreateRoleView()
        Main.instance.addChild(Main.instance.createRoleView);
        if (Main.instance.mStartView) {
            DisplayUtils.disposeAll(Main.instance.mStartView);
            Main.instance.mStartView = null
        }
    }

    private createRoleView: CreateRoleView
    public mStartView: StartGameView

    // 关闭界面
    public static CloseView() {
        if (Main.instance == null) {
            return
        }
        if (Main.instance.mStartView == null) {
            return
        }
        egret.log("新用户，加载创角资源");
        Main.instance.mStartView["close"] && Main.instance.mStartView["close"]();
        DisplayUtils.disposeAll(Main.instance.mStartView);
        Main.instance.mStartView = null
    }

    // 开始加载资源文件
    static LoadResVersionComplate() {
        if (Main.instance == null) {
            console.log("main is null")
            return
        }
        if (Main.instance.createRoleView) {
            Main.instance.createRoleView.close();
            DisplayUtils.disposeAll(Main.instance.createRoleView);
            Main.instance.createRoleView = null
        }
        var loadingView: GameLoadingView;
        if (Const.IsLoadType01) {
            loadingView = new GameLoadingView(Main.instance.onThemeLoadComplete);

        }
        if (SdkMgr.isWxGame())
            return;
        SdkMgr.getActorCreateTime();
    };

    private addDefault(): void {
        //注入自定义的素材解析器
        this.stage.registerImplementation("eui.IAssetAdapter", new AssetAdapter());
        this.stage.registerImplementation("eui.IThemeAdapter", new ThemeAdapter());

        ResourceUtils.ins().addConfig(Const.RES_URL + "resource/default.res.json" + "?v=" + Math.random(), Const.RES_URL + "resource/");
        if (SdkMgr.isWxGame()) {
            ResourceUtils.ins().loadConfig(Main.instance.configLoadComp, Main.instance);
        } else
            ResourceUtils.ins().loadConfig(Main.instance.onConfigComplete, Main.instance);
    }

    private configLoadComp(): void {
        RES.getResAsync("conf_json", this.selectServer, this);
    }

    private selectServer(data, url): void {
        Const.wxServerUrl = data.isTest ? data.testpath : data.path;
        WxSdk.ins().isShowLog = data.isLog;
        egret.log(`调试输出信息:${data.isLog ? '开启' : '关闭'} 连接[${data.isTest ? '测试服' : '正式服'}]=${Const.wxServerUrl}`);
        WxSdk.ins().showNavigateTo = data.showNavigateTo;
        WxSdk.ins().pay_type = data.payType;
        Main.instance.onConfigComplete();
    }

    /**
    * 配置文件加载完成,开始预加载preload资源组。
    */
    public onConfigComplete() {
        if (SdkMgr.isWxGame()) {
            RES.getResByUrl('lunchLoad.jpg', this.addBackBg, this, RES.ResourceItem.TYPE_IMAGE) //登录图片//RES.getResByUrl还未初始化不能用
            ResMgr.ins().saveLoadingRes("lunchLoad.jpg");
        }
        var theme = new eui.Theme("resource/default.thm.json", this.stage);
        theme.addEventListener(eui.UIEvent.COMPLETE, () => {
            this.Init2();
        }, this);
    };
    /**
     * 主题文件加载完成
     */
    public onThemeLoadComplete() {
        var gameApp = new GameApp(this);
        gameApp.callbackFun = (thisObj: Main) => {
            egret.log("请求进入游戏");
            // GameLoadingView.ShowLoadProgress(92, "进入游戏")
            // 游戏资源加载完成，登陆游戏socket
            // thisObj.deBugStartGameView.gameResComplete();
            if (Const.IsLoadType01) {
                // 加载完成直接进入游戏
                RoleMgr.EnterGame()
                if (SdkMgr.isWxGame())
                    WxSdk.ins().sdkLoad();
            } else {
                // 加载完成连接游戏服务器
                StartGetUserInfo.Login()

            }
        };
    };

    startBg: eui.Image;
    public addBackBg(da, key) {
        let texture: egret.Texture = da
        if (!texture) return
        this.startBg = new eui.Image();

        this.startBg.texture = texture;
        Main.instance.addChildAt(this.startBg, 0)//确保在底层

        if (!Main.wxsystemInfo) {
            WxSdk.ins().getSystemInfo();
        }
    }

    public removeBackBg() {
        if (this.startBg && -1 < Main.instance.getChildIndex(this.startBg)) {
            var temp = Main.instance.removeChild(this.startBg);
            ResMgr.ins().saveLoadingRes(`${this.startBg.source}`);
        }
    }

    // private initButtonEvt() {
    //     // StageUtils.ins().getStage().removeEventListener(egret.TouchEvent.TOUCH_BEGIN, this.onTap, this);
    //     // StageUtils.ins().getStage().addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.onTap, this);
    // }
    // private onTap(evt): void {
    //     if (evt.target instanceof eui.Button) {
    //         let flg = SoundSetPanel.getSoundLocalData("btnSoundEff");
    //         if (flg) {
    //             SoundUtils.getInstance().playSound(GlobalConfig.soundConfig[4].id);
    //         }
    //     }
    // }

    /**
     * 初始化所有模块
     */
    public initModule() {

        StageUtils.ins()
        NewFunNotice.ins();
        GameLogic.ins();
        UserBag.ins();
        Bless.ins();
        UserBoss.ins();
        Chat.ins();
        Encounter.ins();
        UserFb.ins();
        UserForge.ins();
        UserGem.ins();
        UserZhuLing.ins();
        Guild.ins();
        GuildFB.ins();
        GuildRobber.ins();
        GuildStore.ins();
        UserJingMai.ins();
        Ladder.ins();
        LongHun.ins();
        PlayFun.ins();
        Rank.ins();
        Recharge.ins();
        UserEquip.ins();
        UserRole.ins();
        UserSkill.ins();
        Wing.ins();
        Setting.ins();
        Shop.ins();
        SpecialRing.ins();
        UserTask.ins();
        UserTips.ins();
        Title.ins();
        Hunt.ins();
        UserVip.ins();
        UserWarn.ins();
        ZhuzaiEquip.ins();
        UserZs.ins();
        ZsBoss.ins();
        UserFb2.ins();
        MineModel.ins()
        MoneyTreeModel.ins()
        MailModel.ins()
        ActivityModel.ins()
        PrestigeModel.ins()
        GameServer.ins();
        Notice.ins();
        FuwenModel.ins();
        FindAssetsModel.ins();
        ExpjadeModel.ins()
        DressModel.ins()
        LegendModel.ins()
        YbTurntableModel.ins()
        FuncOpenModel.ins()
        RaidMgr.ins()
        GuildWar.ins()
        GuildReward.ins()
        GuildBoss.ins()
        EggBroken.ins()
        DrillModel.ins();
        DartCarModel.ins();
        DayOneActivityController.ins();
        ZhuanZhiModel.ins();
        RingSoulModel.ins();
        TenKillSproto.ins();
        OnlineRewardsModel.ins();
        PetSproto.ins();
        MountSproto.ins();
        ArtifactSproto.ins();
        ClimbTowerSproto.ins();
        GadSproto.ins();
        SyBossSproto.ins();
        ShareModel.ins();
        Activity303Sproto.ins();
        RoleAddAttrPointModel.ins();
        ShareMissionSproto.ins();
        NeiGongControl.ins();
        EasyLoading.ins();
        TeamFbSproto.ins();
        OmGifBagSproto.ins();
        ChaosBattleSproto.ins();
        TheGunSproto.ins();
        ActivityType31Model.ins();
        WarOrderSproto.ins();
        CouponSproto.ins();
    };
}

window["Main"] = Main
