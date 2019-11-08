class StartGameView extends BaseEuiView {

    main: any;

    public bg: eui.Image;
    public image3: eui.Image;
    public image0: eui.Image;
    public image1: eui.Image;
    public image2: eui.Image;
    public image4: eui.Image;
    public image: eui.Image;
    public m_DbGroup: eui.Group;
    public loginGroup: eui.Group;
    public start: eui.Button;
    public announce: eui.Button;
    public versionLabel: eui.Label;
    public accountBg: eui.Image;
    public m_serverIp: eui.EditableText;
    public account: eui.EditableText;
    public newServerBg: eui.Image;
    public selectGroup: eui.Group;
    public curServer_new: eui.Label;
    public curServer: eui.Label;
    public selectServer: eui.Label;
    public groupBtn: eui.Group;
    private tips: eui.Label;
    public static m_Instance: StartGameView
    private _mc: MovieClip
    public tips0: eui.Label;

    public constructor(thisObj: any) {
        super();
        this.skinName = "StartGameSkin";
        this.account.prompt = "请输入账号";
        StartGameView.m_Instance = this
        // this.cacheAsBitmap = true;
        this.main = thisObj;
        this.addEventListener(egret.Event.ADDED_TO_STAGE, this.onAddToStage, this);


        GameGlobal.MessageCenter.addListener(MessageDef.START_GAME_SERVER_LIST, this.showIPListView, this)

    }

    // static ROOT = "resource/"//assets/atlas_ui/start_game/"
    // static ROO2 = "assets/atlas_ui/start_game/";
    public childrenCreated(): void {
        super.childrenCreated();
        // this.createAnim("loginBg");
        if (!SdkMgr.isWxGame()) {
             this.tips0.text = "审批文号：科技与数字[2012]661号   出版物号：ISBN 978-7-89989-416-5\n 著作权人：深圳市汉之云网络科技有限公司   适龄提示：16岁以上\n 备案文号：文网游备字（2018）M-RPG1396号";
            if (SdkMgr.tag == "bsymx_baoyu_jfty_h5" || SdkMgr.tag == "bsymx_baoyu_jfty_android" 
            || SdkMgr.tag == "bsymx_baoyu_jfty_huawei" || SdkMgr.tag == "bsymx_baoyu_jfty_bilibili"
            || SdkMgr.tag == "bsymx_baoyu_ppl_xiaoqi") {
                this.tips0.text = "新广出审[2017]5723号    ISBN 978-7-7979-8966-4\n广州汉正信息科技有限公司   2017SR094425";
            }
        } else {
            this.tips0.text = "";
        }
        if (!SdkMgr.isWxGame() && this.bg) {
            var source: string = "pic_bj_22_png";
            switch (LocationProperty.urlParam["tag"]) {
                case "wdws_lezhong_ios_wdws"://刀剑仙魔录-改成万道武神
                    source = "wdws_lezhong_ios_djxml_startgame_jpg";
                    break;
                case "wdws_lezhong_android_wdws"://硬盒
                case "wdws_lezhong_ios_wdws_breakout"://越狱也算硬盒
                    source = "yinghe_start_bg_jpg";
                    break;
            }
            this.bg.source = source;
            this._playBgAni()
        } else {
            this.bg.source = ""
            this.image.visible = this.image0.visible = this.image1.visible = this.image2.visible = this.image3.visible = this.image4.visible = false
        }
        ResMgr.ins().saveLoadingRes(`${this.bg.source}`);
        ResMgr.ins().saveLoadingRes(`${this.image.source}`);
        ResMgr.ins().saveLoadingRes(`${this.image0.source}`);
        // ResMgr.ins().saveLoadingRes(`${this.image1.source}`);这个放在图集，不能释放
        ResMgr.ins().saveLoadingRes(`${this.image2.source}`);  
        ResMgr.ins().saveLoadingRes(`${this.image3.source}`);
        ResMgr.ins().saveLoadingRes(`${this.image4.source}`);
        ResMgr.ins().saveLoadingRes(`${this.newServerBg.source}`);
        ObjectPool.ins().create();

    }
    private _playBgAni(): void {
        egret.Tween.get(this.image, { loop: true })
            .to({ x: -114, y: 193, }, 0)
            .to({ y: 180 }, 2000)
            .to({ y: 193 }, 2000)
        egret.Tween.get(this.image0, { loop: true })
            .to({ x: 0, y: 0, }, 0)
            .to({ x: 0, y: 20 }, 2000)
            .to({ x: 0, y: 0, }, 2000)
        egret.Tween.get(this.image1, { loop: true })
            .to({ x: 496, y: 142, alpha: .5, scaleX: 1, scaleY: 1 }, 0)
            .to({ x: 170, y: 119, scaleX: .15, scaleY: .15 }, 9000)
            .to({ x: 226 }, 8000)
            .wait(50)
            .to({ x: 89, y: 111, scaleX: 0, scaleY: 0, alpha: 0 }, 2950)
        egret.Tween.get(this.image2, { loop: true })
            .to({ x: -270, y: 315, alpha: .5 }, 0)
            .to({ x: 9 }, 8000)
            .to({ x: 226, alpha: 0 }, 8000)
        egret.Tween.get(this.image3, { loop: true })
            .to({ x: -147, y: 638, alpha: .5 }, 0)
            .to({ x: 491, y: 651 }, 16000)
        egret.Tween.get(this.image4, { loop: true })
            .to({ x: -140, y: 200, alpha: .5 }, 0)
            .to({ x: 496 }, 16000)
    }
    private _resetAniElement(): void {
        let self = this
        egret.Tween.removeTweens(self.image)
        egret.Tween.removeTweens(self.image0)
        // self.image1.x = 496
        // self.image1.y = 141
        // self.image1.alpha = .5
        egret.Tween.removeTweens(self.image1)
        // self.image2.x = -270
        // self.image2.y = 315
        // self.image2.alpha = .5
        egret.Tween.removeTweens(self.image2)
        // self.image3.x = -147
        // self.image3.y = 638
        // self.image3.alpha = .5
        egret.Tween.removeTweens(self.image3)
        // self.image4.x = -140
        // self.image4.y = 200
        // self.image4.alpha = .5
        egret.Tween.removeTweens(self.image4)
    }

    public onAddToStage(event) {
        this.removeEventListener(egret.Event.ADDED_TO_STAGE, this.onAddToStage, this);

        //配置文件加载
        // ResourceUtils.ins().addConfig("startgame/default.res.json", "startgame/");
        // ResourceUtils.ins().addConfig(StartGameView.ROOT + StartGameView.ROO2 + "default.res.json", StartGameView.ROOT);
        // ResourceUtils.ins().loadConfig(this.onConfigComplete, this);
        if (window["__RemoveBg"])
            window["__RemoveBg"]();
        this.onConfigComplete();
        // this._GetServerList()
    };

    public static getServerIp(): string {
        if (StartGameView.m_Instance == null || StartGameView.m_Instance.m_serverIp == null)
            return "";
        var arr: string[] = StartGameView.m_Instance.m_serverIp.text.split("|");
        // return StartGameView.m_Instance.m_serverIp.text;
        return arr[0];
    }

    public static getServerId() {
        if (StartGameView.m_Instance.m_serverIp == null)
            return "";
        var arr: string[] = StartGameView.m_Instance.m_serverIp.text.split("|");
        return arr[1] ? arr[1] : "";
    }

    public static ParserServerData(obj): SelectServerItemData {
        if (obj.status == 0 && StartGetUserInfo.gmLevel == 0) {
            return null;
        }
        let serverId = obj.serverid;

        let testIp = null
        let serverName: string = obj.name ? obj.name : "双线" + serverId + "服";
        // alert("有数据的" + serverName + serverId + obj.name);
        return { id: serverId, name: serverName, ip: testIp, status: obj.status, version: obj.version };
    }

    /**
  * 输出堆栈信息
  * @param [int] [count=10]
  */
    public static trace(count = 10) {
        var caller = arguments.callee.caller;
        var i = 0;
        count = count || 10;
        var s = "";
        while (caller && i < count) {
            s += caller.toString() + "\n";
            caller = caller.caller;
            i++;
        }
        return s;
    }

    /**
     * 配置文件加载完成
     */
    public onConfigComplete() {
        // ResourceUtils.ins().pilfererLoadGroup("preload", []);
        // //加载皮肤
        // EXML.load(StartGameView.ROOT + StartGameView.ROO2 + "StartGameSkin.exml", this.onLoaded, this);
        this.onLoaded();


    };
    /**
     * 皮肤加载完成
     */
    public onLoaded() {//clazz, url) {
        SdkMgr.setExtData(SdkMgr.extDataType_5);
        // if(clazz == null || clazz == undefined)
        // {
        //     this.skinName = StartGameView.ROOT + StartGameView.ROO2 + "StartGameSkin.exml";
        // }
        // else
        //     this.skinName = clazz;


        // this.selectServer.textFlow = (new egret.HtmlTextParser).parser('<u>' + this.curServer.text + '</u>');
        // if (this.m_serverIp) this.m_serverIp.visible = Main.isDebug;
        this.selectServer.text = "点击换服" + ">>";
        this.tips.text = "抵制不良游戏，拒绝盗版游戏，注意自我保护，谨防受骗上当。\n适度游戏益脑，沉迷游戏伤身，合理安排时间，享受健康生活。";
        if (this.m_serverIp) {
            // this.m_serverIp.visible = this.m_serverIpBg.visible = window["isRelease"] == false && Main.isDebug
            if (SdkMgr.isWxGame())
                this.m_serverIp.visible = false;
            else
                this.m_serverIp.visible = Window["IsOpenInputServer"];
        }

        if (Const.IsTestIpList == true) {
            this.account.visible = this.accountBg.visible = false
        } else {
            this.account.text = egret.localStorage.getItem("account");
            // this.m_serverIp.text = egret.localStorage.getItem("m_serverIp");
            this.account.visible = this.accountBg.visible = !Main.isPlatform
        }
        // this.account.text = "kree";
        //显示ip列表
        this.showIPListView();

        if (this.versionLabel) {
            this.versionLabel.text = "v" + SdkMgr.version + "8";
        }


        // this.m_PreLoad = new StartGamePreload()
        // this.addChildAt(this.m_PreLoad, 0)
        this.open();

        egret.setTimeout(() => {
            if (StartGetUserInfo.notice_status) {
                new GameAnnounce()
            }
        }, this, 500)


    };

    /** 显示ip列表 */
    public showIPListView() {
        if (!this.curServer) {
            return
        }
        // this.loginGroup.visible = StartGameView.loginSuc
        let data = StartGetUserInfo.mServerData
        if (data) {
            this.curServer.text = data.name
        }
        else {
            this.curServer.text = ""
        }

        if (!this.curServer_new) return;
        let newData = StartGetUserInfo.newServerName;
        if (newData) {
            this.curServer_new.text = "最新服" + "：" + newData;
            this.newServerBg.visible = true
        } else {
            this.newServerBg.visible = false
            this.curServer_new.text = ""
        }
    };

    private resCount = 0
    private resList: any[] = []

    public open(...param: any[]) {
        this.start.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onClick, this);
        this.selectGroup.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onClick, this);
        this.announce.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onClick, this);

        // this.m_PreLoad.AddComplete(this.bg)
        if (!this._mc) {
            this._mc = new MovieClip
        }
        this._mc.x = this.groupBtn.width >> 1
        this._mc.y = this.groupBtn.height >> 1
        this._mc.loadUrl(ResDataPath.GetUIEffePath("eff_btn_star"), true, -1)//eff_jiesuan.png
        this.groupBtn.addChild(this._mc)

    };

    public close(...param: any[]) {
        GameGlobal.MessageCenter.removeAll(this)
        if (this.start)
            this.start.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onClick, this);
        if (this.selectGroup)
            this.selectGroup.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onClick, this);
        if (this.announce)
            this.announce.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onClick, this);

        if (this._mc) {
            DisplayUtils.dispose(this._mc)
            this._mc = null;
        }
        this._resetAniElement()
        // if (this.m_PreLoad) this.m_PreLoad.Close()
        StartGetUserInfo.notice_status = 0
        // if (this.m_pDBObj) {
        //     this.m_pDBObj.destroy();
        //     this.m_pDBObj = null;
        // }
    };

    public onClick(e) {

        switch (e.currentTarget) {
            case this.announce:
                new GameAnnounce()
                break
            case this.start:

                if ((this.account.visible) && (this.account.text == null || this.account.text.trim() == "" || this.account.text.length == 0)) {
                    break;
                }
                StartGameView.Start()
                break;
            case this.selectGroup:
                new SelectServerView()
                break;
        }
    };

    public static Start() {
        let self = this.m_Instance
        if (!self) {
            alert("启动界面未初始化")//启动界面未初始化
            return
        }

        let data = StartGetUserInfo.mServerData
        if (Const.IsTestIpList != true) {
            if (!Main.isPlatform) {
                StartGetUserInfo.pwd = self.account.text
            }

            egret.localStorage.setItem("account", self.account.text);
            egret.localStorage.setItem("m_serverIp", self.m_serverIp.text);
        }
        self.callbackFun(self.main)
    }

    public callbackFun(thisObj) {
    };

    public static get_serverlist(type: number, func: Function) {
        var request = new egret.HttpRequest();
        request.responseType = egret.HttpResponseType.TEXT
        if (SdkMgr.appid == null || SdkMgr.appid == NaN) SdkMgr.appid = 0;
        var url: string = "";
        if (SdkMgr.isWxGame() || SdkMgr.requestType == 1) {
            url = Const.SERVER_LIST_URL + "get_serverlist?platformid=" + SdkMgr.platformid + "&page=" + type + "&appid=" + SdkMgr.appid + "&channelid=" + SdkMgr.channelid;
        }
        else {
            url = Const.SERVER_LIST_URL + "api/server/getserverlist?platformid=" + SdkMgr.platformid + "&page=" + type + "&appid=" + SdkMgr.appid + "&channelid=" + SdkMgr.channelid + "&ver=" + SdkMgr.ver;
        }
        StatisticsUtils.debugInfoLogPhp("serverlist==" + url);
        request.open(url, egret.HttpMethod.GET);
        request.send()
        request.addEventListener(egret.Event.COMPLETE, (event) => {
            var request = <egret.HttpRequest>event.currentTarget;
            if (func) {
                func(request.response)
            }
        }, this);
        request.addEventListener(egret.IOErrorEvent.IO_ERROR, (event: egret.IOErrorEvent) => {
            alert("请求数据失败 => get_serverlist")
        }, this);
        request.addEventListener(egret.ProgressEvent.PROGRESS, (event: egret.ProgressEvent) => {
            console.log("进度 => get_serverlist" + Math.floor(100 * event.bytesLoaded / event.bytesTotal))
        }, this);
    }

    public static get_server_addr(serverId: number, func: Function) {
        if (serverId == null) return;
        var request = new egret.HttpRequest();

        request.responseType = egret.HttpResponseType.TEXT

        let url;
        if (SdkMgr.isWxGame() || SdkMgr.requestType == 1) {
            url = Const.SERVER_LIST_URL + "get_server_addr?platformid=" + SdkMgr.platformid + "&serverid=" + serverId;
        }
        else {
            url = Const.SERVER_LIST_URL + "api/server/getserveradd?platformid=" + SdkMgr.platformid + "&serverid=" + serverId + "&ver=" + SdkMgr.ver;
        }

        request.open(url, egret.HttpMethod.GET);
        request.send()
        request.addEventListener(egret.Event.COMPLETE, (event) => {
            var request = <egret.HttpRequest>event.currentTarget;
            if (func) {
                func(request.response)
            }
        }, this);

        request.addEventListener(egret.IOErrorEvent.IO_ERROR, (event: egret.IOErrorEvent) => {
            alert("请求数据失败 => get_server_addr")
        }, this);
        request.addEventListener(egret.ProgressEvent.PROGRESS, (event: egret.ProgressEvent) => {
            egret.log("进度 => get_server_addr" + Math.floor(100 * event.bytesLoaded / event.bytesTotal))
        }, this);
        egret.log("请求addr=" + url);
    }

    /**龙骨 */
    // public m_pDBObj: DBObject;
    // private createAnim(name: string) {
    //     DBCharacterMgr.getIns().createDragonBone(name, (dbData) => {
    //         if (dbData.name != name || !this.m_DbGroup) return;
    //         this.m_DbGroup.removeChildren();
    //         if (this.m_pDBObj) {
    //             this.m_pDBObj.destroy();
    //             this.m_pDBObj = null;
    //         }
    //         this.m_pDBObj = new DBObject(name);
    //         this.m_pDBObj.playAnimation("1", 0);
    //         this.m_DbGroup.addChild(this.m_pDBObj);
    //         this.m_pDBObj.x = this.m_DbGroup.width / 2;
    //         this.m_pDBObj.y = this.m_DbGroup.height;
    //     }, this);
    // }
}

ViewManager.ins().reg(StartGameView, LayerManager.UI_Main);
window["StartGameView"] = StartGameView