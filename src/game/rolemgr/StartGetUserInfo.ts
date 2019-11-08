class StartGetUserInfo {

    public static mServerTab: { type: number, name: string }[] = []
    public static mServerDict: { [key: number]: SelectServerItemData[] } = {}
    public static mServerData: SelectServerItemData;

    public static mAutoEnterGame = false

    // public static acount = ""
    public static username = ""
    /** 渠道返回的*/
    public static username2 = "";
    public static pwd = null
    /** 服务器返回的uid*/
    public static uid = ""
    /** 渠道返回的uid*/
    public static uid2 = "";
    public static gmLevel = 0

    private static channelId = ""
    /** 渠道返回的*/
    public static channelId2 = "";
    // private static token = ""

    public static notice_status = 0

    public static mResult: Function

    public static type1 = 0;//jssdk
    public static type2 = 1;//websdk

    /**sionid sdk*/
    public static sessid = "";
    public static time = 0;
    public static token = "111"
    /** 记录最新的服务器名字*/
    public static newServerName: string = '';

    /** 请求服务器的url*/
    public static urlData: string;
    /** 是否是美国进来用户*/
    public static isUsa: boolean = false;
    /** 是否变成单机游戏，游戏充值接口全部屏蔽*/
    public static isOne: boolean = false;

    public static set ServerId(id: number) {
        egret.localStorage.setItem("listIP", id + "");
        for (let key in this.mServerDict) {
            for (let data of this.mServerDict[key]) {
                if (data.id == id) {
                    this.mServerData = data
                    return;
                }
            }
        }
    }

    public constructor() {
    }

    public static GetUserInfo() {
        if (Main.isDebug) {
            var data: string[] = window['serverList'];
            let list = []
            let id = 0
            let lastId = parseInt(egret.localStorage.getItem("listIP")) || 0
            for (let value of data) {
                let str = value.split("|")
                let obj = { id: id--, name: str[0], ip: str[1], status: 1, version: 1 }
                list.push(obj)
                if (obj.id == lastId) {
                    this.mServerData = obj
                }
            }
            if (this.mServerData == null) {
                this.mServerData = list[0]
            }

            this.mServerTab = [{ type: -1, name: "最近登录" }]
            this.mServerDict[-1] = list
            this._LoginSuc()
        }
        else {
            egret.log("获取服务器列表") //这边是直接请求服务器的
            var request = new egret.HttpRequest();
            request.responseType = egret.HttpResponseType.TEXT;

            let url = StartGetUserInfo.urlData;

            egret.log("请求服务器" + url);
            // console.log("请求服务器2" + url);
            request.open(url, egret.HttpMethod.GET);
            request.send()
            request.addEventListener(egret.Event.COMPLETE, this.onPostComplete, this);
            request.addEventListener(egret.IOErrorEvent.IO_ERROR, this.onPostIOError, this);
            request.addEventListener(egret.ProgressEvent.PROGRESS, this.onPostProgress, this);
        }
    }

    private static onPostComplete(event: egret.Event): void {

        var request = <egret.HttpRequest>event.currentTarget;

        let str = JSON.stringify(request.response);

        let jsonObj = JSON.parse(request.response);
        egret.log("get_player_serverinfo = " + str);
        if (jsonObj.result != 1) {
            alert(jsonObj.result_msg)
            return
        }
        StartGetUserInfo.manageServerList(jsonObj);
    }

    public static manageServerList(jsonObj): void {
        //let jsonObj = JSON.parse(request.response)
        egret.log("返回服务器列表", jsonObj);
        let playerInfo = jsonObj.data.playerInfo;
        this.uid2 = jsonObj.data.uid;
        this.username2 = jsonObj.data.username;
        this.channelId2 = jsonObj.data.channelId;
        this.username
        if (jsonObj.data.platformid != null)
            SdkMgr.platformid = jsonObj.data.platformid;//如果服务器有发送，直接读服务器的
        this.uid = playerInfo.uid
        this.username = playerInfo.username
        if (SdkMgr.currSdk == 2) {//这个特殊处理，
            h5_sdk["Sdk_" + SdkMgr.currSdk].ins()["initSkd_" + SdkMgr.currSdk]();
        }
        this.token = playerInfo.token
        this.pwd = playerInfo.token;
        this.gmLevel = playerInfo.gm_level || 0

        //微信支付需要的字段==========start=====
        if (SdkMgr.isWxGame()) {
            WxSdk.ins().openid = jsonObj.data.openid;
            WxSdk.ins().session_key = jsonObj.data.session_key;
            //     // console.log(">>>>>>>>>>获取openid和sessionKey");
            //     // aladin.AladinSDK.report(aladin.AladinSDK.ReportTypes.OPEN_ID,WxSdk.ins().openid)
            //     // //获取到openid之后，立即做启动游戏的信息上报
            //     // WxSdk.applicationReport("2");

            WxSdk.ins().sdkInit();
        }
        //===========================end======

        this.notice_status = jsonObj.data.notice_status
        SdkMgr.channelid = jsonObj.data.channelid ? jsonObj.data.channelid : 0;
        let maxId = jsonObj.data.server_maxid;

        if (jsonObj.data.last_page.length == 0 || !(jsonObj.data.last_page instanceof Array)) {
            alert("last列表为空！");
        }
        var isThereAre: number = 0;
        for (var temp of jsonObj.data.last_page) {
            if (this.CanConnect(temp.status)) {
                egret.log("可以连接");
                isThereAre++;
            }
        }
        let tab = []
        var tempServer = jsonObj.data.last_page[0];
        var curPage = Math.ceil(parseInt(tempServer.serverid) / 100);
        let preType = -1;
        for (let id = 1; id <= maxId; ++id) {
            let type = Math.ceil(id / 100);
            if (preType == type) {
                continue
            }
            preType = type;
            let name = `${(type - 1) * 100 + 1}-${(type) * 100}服`
            egret.log("连接" + isThereAre);
            if (isThereAre > 0) //说明这个区组存在，
            {
                tab.push({ type: type, name: name });
                this.mServerDict[type] = [];
            }
            else if (curPage == preType) {//加个判断，如果服务器下发的区组，是对应的才进行里面判断（PS，last_page服务器会永远下发最新分页的区，100区为一个分页）

                if (this.gmLevel > 0) //白名单继续显示服务器区
                {
                    tab.push({ type: type, name: name });
                    this.mServerDict[type] = [];
                }
                else {
                    if (curPage > 1)
                        curPage = curPage - 1;//请求上一页
                    StartGameView.get_serverlist(curPage, (rsp) => {
                        let jo = JSON.parse(rsp);
                        jsonObj.data.last_page = jo.data;//改变数据
                        this.loginServer(tab, jsonObj);
                    });
                    return;
                }
            }
            else {
                tab.push({ type: type, name: name });
                this.mServerDict[type] = [];
            }
        }
        this.loginServer(tab, jsonObj);
    }


    private static loginServer(tab, jsonObj): void {
        tab.sort((lhs, rhs) => {
            return rhs.type - lhs.type
        })
        tab = [{ type: -1, name: "最近登录" }].concat(tab)
        this.mServerTab = tab

        let list = []

        for (var k: number = 0; k < jsonObj.data.recent_serverids.length; k++) {
            let obj = jsonObj.data.recent_serverids[k]
            let serverData: SelectServerItemData = StartGameView.ParserServerData(obj)
            if (serverData) {
                serverData["last_online_time_num"] = obj.last_online_time_num
                // StartGameView.get_server_addr(serverData.id, (rsp) => {

                //     if (rsp != null) {
                //         let jsonData = JSON.parse(rsp)
                //         serverData.status = jsonData.data.status
                //         // serverData.ip = jsonData.data.addr

                //         let sip: string = jsonData.data.addr;
                //         let ips = sip.split("|");
                //         if (GameSocket.httpsProtocol == GameSocket.HTTP)
                //             serverData.ip = ips[0];
                //         else
                //             serverData.ip = ips[1];

                //         console.log("serverData.ip == " + serverData.ip);
                //     }
                // })

                list.push(serverData)
            }
        }

        list.sort((lhs, rhs) => {
            return rhs.last_online_time_num - lhs.last_online_time_num
        })
        this.mServerData = list[0]
        this.mServerDict[-1] = list

        let lastList: SelectServerItemData[] = []

        for (var j: number = 0; j < jsonObj.data.last_page.length; j++) {
            let obj: SelectServerItemData = jsonObj.data.last_page[j]
            if (obj != null) {//目前出现个空数组也会执行进来，具体原因查不到，加个判断
                let serverData = StartGameView.ParserServerData(obj)
                if (serverData) {

                    // StartGameView.get_server_addr(serverData.id, (rsp) => {
                    //     console.log("服务器返回IP地址：" + rsp + "   info=" + JSON.stringify(rsp));

                    //     if (rsp != null) {
                    //         let jsonData = JSON.parse(rsp)
                    //         serverData.status = jsonData.data.status
                    //         // serverData.ip = jsonData.data.addr

                    //         let sip: string = jsonData.data.addr;
                    //         let ips = sip.split("|");
                    //         if (GameSocket.httpsProtocol == GameSocket.HTTP)
                    //             serverData.ip = ips[0];
                    //         else
                    //             serverData.ip = ips[1];
                    //         console.log("使用IP地址：" + serverData.ip);
                    //     }
                    // })

                    lastList.push(serverData)
                }
            }
        }
        if (tab[1] == null) {
            //服务器维护中！
            alert("服务器维护中");
            StatisticsUtils.loginErrorLogPhp("服务器维护中，没有区组");
            return;
        }
        lastList.sort((lhs, rhs) => {
            return rhs.id - lhs.id
        })
        this.mServerDict[tab[1].type] = lastList

        if (lastList != null && lastList.length == 0) {
            // console.log("最新的列表为空~~~")
            // StatisticsUtils.loginErrorLogPhp("最新的列表为空");
        }

        for (let data of lastList) {
            if (this.CanConnect(data.status)) {//找出最新的的服务器名字
                this.newServerName = data.name;
                break;
            }
        }

        // 如果没有最近登陆的列表，就给一个最近的服务器，直接进入游戏
        if (this.mServerData == null) {
            for (let data of lastList) {
                let status = data.status
                // 如果最近的登录列表可以连接
                if (data.version) {
                    if (this.CanConnect(status)) {
                        this.mServerData = data
                        this.mAutoEnterGame = true
                        break
                    }
                }

            }
            if (this.mServerData == null && lastList.length > 0) {
                egret.log("最新的服务器列表长度 " + lastList.length + " , 但是没有可以连接的服务器 ")
                StatisticsUtils.loginErrorLogPhp("最新的服务器列表长度 " + lastList.length + " , 但是没有可以连接的服务器");
                for (let data of lastList) {
                    egret.log(data.id + "_" + data.status)
                }
            }
        } else {
            this.mAutoEnterGame = false
        }

        if (this.mServerData == null) {
            // alert("获取服务器列表失败！！！")
            // alert("服务器维护中...");
            StatisticsUtils.loginErrorLogPhp("服务器维护中...");
            UserTips.ErrorTip("服务器维护中");
            this.mAutoEnterGame = false
        }

        this._LoginSuc();
        GameGlobal.MessageCenter.dispatch(MessageDef.START_GAME_SERVER_LIST);
    }

    private static _LoginSuc() {
        // StartGameView.loginSuc = true

        if (this.mResult) {
            this.mResult()
            egret.log("回调mresult");
        }
    }

    private static onPostIOError(event: egret.IOErrorEvent): void {
        egret.log("post error : " + event);
    }

    private static onPostProgress(event: egret.ProgressEvent): void {
        egret.log("post progress : " + Math.floor(100 * event.bytesLoaded / event.bytesTotal) + "%");
    }

    public static CanConnect(status: number) {
        if ((status == 0 || status == 3 || status == 4) && this.gmLevel == 0) {
            return false
        }
        return true
    }

    public static Login() {
        // let account = StartGetUserInfo.acount
        egret.log("准备连接服务器");
        let data = StartGetUserInfo.mServerData
        if (data) {
            var tempSIP: string = StartGameView.getServerIp();
            var tempSID: any = StartGameView.getServerId();
            if (Main.isDebug && tempSIP != null && tempSIP.length != 0) {
                data.ip = tempSIP;
                data.id = tempSID;
            }

            if (data.ip) {
                // if ((data.status == 0 || data.status == 3 || data.status == 4) && this.gmLevel == 0) {
                //     alert('服务器正在维护，请稍后重试!!!')
                //     return
                // }
                egret.log("已经有ip，直接登录")

                if (!this.CanConnect(data.status)) {
                    //服务器正在维护，请稍后重试!
                    alert("服务器正在维护，请稍后重试!")
                    UserTips.ErrorTip("服务器正在维护，请稍后重试!");
                    StatisticsUtils.loginErrorLogPhp("获取到服务器ip返回，status维护状态");
                    return
                }

                RoleMgr.ins().connectServer("", "", StartGetUserInfo.pwd, data.id, data.ip);
                GameServer.serverName = data.name;
            } else {

                StartGameView.get_server_addr(data.id, (rsp) => {
                    egret.log("服务器IP返回：id=" + data.id + "  rsp=" + rsp + " http=" + GameSocket.httpsProtocol);


                    if (rsp != null) {
                        let jsonData = JSON.parse(rsp)
                        egret.log("服务器IP数据返回：" + JSON.stringify(jsonData));
                        // if (jsonData.data.status)
                        // data.ip = jsonData.data.addr
                        let sip: string = jsonData.data.addr;
                        let ips = sip.split("|");
                        if (GameSocket.httpsProtocol == GameSocket.HTTP)
                            data.ip = ips[0];
                        else
                            data.ip = ips[1];

                        egret.log("获取服务器ip==" + data.ip + "  ips.length=" + ips.length)

                        if (!this.CanConnect(jsonData.data.status)) {
                            alert("服务器正在维护，请稍后重试!")
                            StatisticsUtils.loginErrorLogPhp("获取到服务器ip返回，status维护状态2");
                            return
                        }

                        if (data.ip != null && data.ip != "") {
                            RoleMgr.ins().connectServer("", "", StartGetUserInfo.pwd, data.id, data.ip);
                            GameServer.serverName = data.name;
                        } else {
                            alert("服务器维护中")
                            UserTips.ErrorTip("服务器维护中");
                            StatisticsUtils.loginErrorLogPhp("获取到服务器ip返回，服务器ip有问题");
                        }
                    } else {
                        alert("服务器维护中")
                        UserTips.ErrorTip("服务器维护中");
                        StatisticsUtils.loginErrorLogPhp("没有服务器ip");
                    }
                })
            }
        } else {
            alert("请选择服务器");
            UserTips.ErrorTip("请选择服务器");
            StatisticsUtils.loginErrorLogPhp("没有服务器信息");
        }
    }
}
window["StartGetUserInfo"] = StartGetUserInfo