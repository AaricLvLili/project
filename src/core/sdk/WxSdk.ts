
class WxSdk extends BaseClass {
    public static ins(...args: any[]): WxSdk {
        return super.ins();
    }
    public appid = "wx0dac204c9f71bc99";
    public js_code;
    public openid;//用户唯一标识符
    public pf = "android";//平台来源，登录获取的pf值 微信小游戏下目前应该总是android
    public session_key;//微信登录态 后给予的session_key
    public appkey = "70a3ed1d4df378f88c6f3561be1b2b63"
    public order: SdkParam;
    public scene //场景值 从我的小游戏进入为 '1104' 或 '1103'
    public loginscene //场景值
    public options
    public query //{heId:string,imgtag:string}//heId为分享者的id
    public imgURL;
    public payAppid = "wx29dcdbb2f113f761";//测试的appid  public payAppid = "wxe15b634eda90b334";
    public gameid = "nuhuoyidao20181101";
    public game_id = "59"
    public channel = "";
    public IsShowDrawer;//是否可以打开九宫格游戏
    public IsLoinged = false;
    public pay_type; //充值标识[如果是0 屏蔽ios相关充值，如果是1开启]
    public isShowLog;
    public shareTagList = [];
    public shareLinJoin = false;//切换到后台去点分享链接二次进入游戏的时候，3秒内不会断线重连，3秒后会断线重连，这个值用来判断断线重连的情况下发送分享协议
    public shareOffineReward = false;
    public showNavigateTo;

    public SDKVersion: string = "";

    //微信登录
    public wxLoging() {
        wx.login({
            success: function (scessRes) {
                WxSdk.ins().js_code = scessRes.code;
                StartGetUserInfo.urlData = Const.SERVER_LIST_URL + "get_player_serverinfo_xiangjiao?appid=" + WxSdk.ins().appid + "&js_code=" + WxSdk.ins().js_code;
                StartGetUserInfo.GetUserInfo();
            }
        })
    }

    /**判断ios环境下是否屏蔽充值*/
    public isHidePay(): boolean {
        return SdkMgr.isWxGame() && Main.wxsystemInfo && Main.wxsystemInfo.platform == "ios" && WxSdk.ins().pay_type == 0;
    }

    //游戏币（发起充值）购买游戏币的时候，buyQuantity 不可任意填写。需满足 buyQuantity * 游戏币单价 = 限定的价格等级。如：游戏币单价为 0.1 元，一次购买最少数量是 10。
    public wxRequestMidasPayment(orderInfo: SdkParam) {
        if (!SdkMgr.isWxGame())
            return;
        console.log(">>>>>>>>>>>>>>>>需要支付>>" + orderInfo.amount);
        var tempPrice = WxSdk.ins().wxBuyQuantity(parseInt(orderInfo.amount));
        console.log(">>>>>>>>>>>>>>>>转换有效价格等级,得到buyQuantity >>" + tempPrice * 10);
        wx.requestMidasPayment({
            mode: 'game',
            offerId: '1450022404',
            buyQuantity: tempPrice * 10,
            zoneId: 1,
            platform: WxSdk.ins().pf,
            env: 1,
            currencyType: 'CNY',
            success() {
                // 支付成功
                console.log(">>>>>>>>>>>>>支付成功");

                let data = {
                    openid: WxSdk.ins().openid,
                    orderId: WxSdk.ins().order.orderid,
                    payAmount: WxSdk.ins().order.amount,
                    payTradeNo: '',
                    payInfo: {}
                }
                WxSdk.ins().pay(WxSdk.ins().order, tempPrice);
            },
            fail({ errMsg, errCode }) {
                // 支付失败
                console.log(">>>>>>>>>>>>>支付失败");
                console.log(errMsg, errCode)
                if (errCode == 6) //6		虚拟支付接口错误码，其他错误
                {
                    WxSdk.ins().pay(WxSdk.ins().order, tempPrice);
                }
            }
        })
    }

    // public wxSdkPay() {
    //     var senSeverData = {
    //         appid: WxSdk.ins().appid, openid: WxSdk.ins().openid, goodsid: WxSdk.ins().order.goodsId,
    //         serverid: StartGetUserInfo.mServerData.id, total_fee: (parseInt(WxSdk.ins().order.amount)) * 1, channelid: WxSdk.ins().channel
    //     }
    //     //从服务器端获取参数
    //     HttpClient.get((getData) => {
    //         getData = JSON.parse(getData).data
    //         var info = {
    //             orderid: getData.orderid,
    //             server_num: GameServer.serverID,
    //             money: senSeverData.total_fee,
    //             actorid: GameLogic.ins().actorModel.actorID,
    //             extend: getData.extra,
    //             actorname: GameLogic.ins().actorModel.name
    //         }
    //         console.log(">>>>>>>>>>>>>>>>>>充值后端返回getData = ", getData);
    //         console.log(">>>>>>>>>>>>>>>>>>充值后端返回info = ", info);
    //         window["WXSDK"].pay(info, [
    //             () => {
    //                 console.log("。。。。。。。。。。。充值成功res = ");
    //             },
    //             () => {
    //                 console.log("。。。。。。。。。。。充值失败res = ");
    //             },
    //             () => { console.log("。。。。。。。。。。。充值取消res = "); }])
    //     },
    //         this, senSeverData, egret.HttpResponseType.TEXT, Const.SERVER_LIST_URL + "get_ordersign_youai");
    // }

    public priceCanArr = [1, 3, 6, 8, 12, 18, 25, 30, 40, 45, 50, 60, 68, 73, 78, 88, 98, 108, 118, 128, 148, 168, 188, 198, 328, 648];
    public wxBuyQuantity(price: number): number {
        if (!SdkMgr.isWxGame())
            return;
        var len = WxSdk.ins().priceCanArr.length;
        for (var i = 0; i < len; i++) {
            if (price <= WxSdk.ins().priceCanArr[i])
                return price = WxSdk.ins().priceCanArr[i]
        }
        return price;
    }

    /**微信环境下，设置保持常亮*/
    public setKeepScreenOn() {
        if (!Main.wxsystemInfo) {
            WxSdk.ins().getSystemInfo();
        }
        //该方法库版本为1.4.0开始支持
        var sdkverArr = Main.wxsystemInfo.SDKVersion.split(`.`);
        if (parseInt(sdkverArr[0]) < 1) {
            egret.log(`库主版本太低，不支持设置常亮，当前版本：${Main.wxsystemInfo.SDKVersion}`);
            return;
        }
        if (parseInt(sdkverArr[1]) < 4) {
            egret.log(`库版本低于1.4.0，不支持设置常亮，当前版本：${Main.wxsystemInfo.SDKVersion}`);
            return;
        }
        wx.setKeepScreenOn({
            keepScreenOn: true,//保持常亮
            success: () => { egret.log(`设置常亮成功`) },
            fail: () => { egret.log(`设置常亮失败`) }
        });
    }

    public getSystemInfo() {
        if (!SdkMgr.isWxGame() || Main.wxsystemInfo)
            return;
        wx.getSystemInfo({
            success: (res) => {
                Main.wxsystemInfo = new WxSystemInfo();
                Main.wxsystemInfo.brand = res.brand;
                Main.wxsystemInfo.model = res.model;
                Main.wxsystemInfo.pixelRatio = res.pixelRatio;
                Main.wxsystemInfo.screenWidth = res.screenWidth;
                Main.wxsystemInfo.screenHeight = res.screenHeight;
                Main.wxsystemInfo.windowWidth = res.windowWidth;
                Main.wxsystemInfo.windowHeight = res.windowHeight;
                Main.wxsystemInfo.language = res.language;
                Main.wxsystemInfo.version = res.version;
                Main.wxsystemInfo.system = res.system;
                Main.wxsystemInfo.platform = res.platform;
                Main.wxsystemInfo.fontSizeSetting = res.fontSizeSetting;
                Main.wxsystemInfo.SDKVersion = res.SDKVersion;
                WxSdk.ins().SDKVersion = res.SDKVersion;
                Main.wxsystemInfo.benchmarkLevel = res.benchmarkLevel;
                Main.wxsystemInfo.battery = res.battery;
                Main.wxsystemInfo.wifiSignal = res.wifiSignal;
                console.log("输出手机型号等信息>>>>>>>");

                Main.instance.startBg.scaleX = 1.43;//闪图杠子那边缩小70%
                Main.instance.startBg.scaleY = 1.43;
                Main.instance.startBg.width = Main.instance.startBg.width * res.screenWidth / StageUtils.ins().getWidth();
                Main.instance.startBg.height = Main.instance.startBg.height * res.screenHeight / StageUtils.ins().getHeight();
                Main.instance.startBg.horizontalCenter = 0;
                Main.instance.startBg.verticalCenter = 0;
                Main.instance.addChildAt(Main.instance.startBg, 0)//确保在底层
                WxSdk.ins().SDKVersion = res.SDKVersion;
                StageUtils.ins().autoPos.x = Main.instance.startBg.x;
                StageUtils.ins().autoPos.y = Main.instance.startBg.y;
                StageUtils.ins().autoWidth = Main.instance.startBg.width;
                StageUtils.ins().autoHeight = Main.instance.startBg.height;
            },
            fail: () => {
                console.log("微信获取机型失败");
            },
            complete: () => {
                console.log(Main.wxsystemInfo);
            }
        });
    }

public pay(orderInfo: SdkParam, payPrice = 0) {
        if (!SdkMgr.isWxGame())
            return;
        if (!Main.wxsystemInfo) {
            WxSdk.ins().getSystemInfo();
        }

        // //===============模拟测试都用1分钱==========================
        orderInfo.amount = "0.01";
        // //===============模拟测试都用1分钱========end==================

        WxSdk.ins().order = orderInfo;
        //===================小游戏ios屏蔽充值==================================
        if (SdkMgr.isWxGame() && Main.wxsystemInfo && Main.wxsystemInfo.platform == "ios") {
            if (WxSdk.ins().pay_type == 0) {
                WarnWin.show(TextFlowMaker.generateTextFlow("受政策影响，充值暂未开放"), () => {
                }, this, null, null, "sure", {
                        btnName: "确定",
                        title: "L温馨提示R"
                    })
                return;
            }
            WxSdk.ins().wxRequestMidasPaymentForIos();
            return;
        }

        let req = new Sproto.cs_buy_xiaoyouxi_item_request;
        req.goodsid = orderInfo.goodsId;
        req.appid = WxSdk.ins().appid;
        req.openid = WxSdk.ins().openid;
        req.pf = WxSdk.ins().pf;
        req.session_key = WxSdk.ins().session_key;
        req.orderid = orderInfo.orderid;
        req.pay_amount = payPrice;//You can use the parseInt or parseFloat functions, or simply use the unary + operator:
        GameSocket.ins().Rpc(C2sProtocol.cs_buy_xiaoyouxi_item, req, WxSdk.ins().rpcRspHandler, WxSdk.ins());
    }

    public onError() {
        if (!SdkMgr.isWxGame())
            return;
        window['wx'].onError((res) => {
            // WxSdk.ins().mendanSdkReportAnalytics(2);
            // StatisticsUtils.debugInfoLogPhp(res.message + ">>>堆栈信息>>>" + res.stack);

            console.log("捕获错误:",res);
        });
    }

    public rpcRspHandler(bytes: Sproto.cs_buy_xiaoyouxi_item_response): void {
        //ret 	状态码 0：成功； 1.余额不足 2内部服务器错误,3 获取微信服务器信息失败。其他 参照微信api  midasGetBalance 的errcode返回值。
        if (!SdkMgr.isWxGame())
            return;
        if (bytes.ret == 0) {
            UserTips.ins().showTips("购买商品成功");
        }
        else if (bytes.ret == 1) {
            console.log(">>>>>>>>>>>>>>>余额不足，购买商品失败，重新发送支付请求");
            WxSdk.ins().order.orderid = bytes.orderid;
            WxSdk.ins().wxRequestMidasPayment(WxSdk.ins().order);
        }
        else if (bytes.ret == 2) {
            console.log(">>>>>>>>>>>>>>2，内部服务器错误");
        }
        else if (bytes.ret == 3) {
            console.log(">>>>>>>>>>>>>>3，获取微信服务器信息失败");
        }
    }

    /**设置是否可以转发 */
    public showOrHiedeShare(show: boolean) {
        if (show) {
            window["wx"].showShareMenu({
                withShareTicket: false
            });
            window["wx"].updateShareMenu({
                withShareTicket: false
            })
        }
        else
            window["wx"].hideShareMenu();
    }

    public shareImg = {
        "6": {
            "tupian": "fenxiang_006",
            "Index": 6,
            "wenan": "成功捕获【橙宠·紫龙王】，横行全服无人能挡！"
        }
        ,
        "2": {
            "tupian": "fenxiang_002",
            "Index": 2,
            "wenan": "你的好友赠送你一只【火龙王】"
        }
        ,
        "3": {
            "tupian": "fenxiang_003",
            "Index": 3,
            "wenan": "四系转职，天赋技能，自由加点，超高自由度放置手游！"
        }
        ,
        "1": {
            "tupian": "fenxiang_001",
            "Index": 1,
            "wenan": "你的好友赠送你一只【火龙王】"
        }
        ,
        "4": {
            "tupian": "fenxiang_004",
            "Index": 4,
            "wenan": "谁说牧师只能奶？暴力加点全攻牧师颠覆你的想象！"
        }
        ,
        "5": {
            "tupian": "fenxiang_005",
            "Index": 5,
            "wenan": "不思议冒险正式开启！冒险天团C位就等你了！"
        }
        ,
        "7": {
            "tupian": "fenxiang_007",
            "Index": 7,
            "wenan": "成功捕获一只[风暴·冰霜巨龙]"
        }
    }

    //转发
    public onShareAppMessage() {
        if (!SdkMgr.isWxGame())
            return;
        // window["wx"].updateShareMenu({
        //     withShareTicket: true
        // });
        window["wx"].onShareAppMessage(function (res) {
            var n = Math.random()
            var cfg = GlobalConfig.share6Config
            var arr = [];
            if (!cfg) {
                cfg = WxSdk.ins().shareImg
                for (var i in cfg) {
                    if (cfg[i]) {
                        arr.push(cfg[i])
                    }
                }
                n = Math.floor(n * arr.length) % arr.length
                return {
                    title: arr[n].wenan, //WxSdk.shareTitle,
                    imageUrl: Const.RES_URL + "resource/assets/ress/share/" + arr[n].tupian + '.jpg' + "?v=" + Math.random()
                }
            }
            for (var i in cfg) {
                if (cfg[i]) {
                    arr.push(cfg[i])
                }
            }
            n = Math.floor(n * arr.length) % arr.length
            console.log(">>>>>>>>>>>>>>>>>跳转图片：" + Const.RES_URL + "resource/assets/ress/share/" + arr[n].tupian + '.jpg', arr[n])
            return {
                // title: '转发标题'
                title: arr[n].wenan, //WxSdk.shareTitle,
                imageUrl: Const.RES_URL + "resource/assets/ress/share/" + arr[n].tupian + '.jpg' + "?v=" + Math.random(),
                query: 'heId=' + RoleMgr.actorid + '&imgtag=' + arr[n].tupian + '.jpg' + '&shareTag=' + WxSdk.ins().getShareTag() + '&openid=' + WxSdk.ins().openid, //WxSdk.openid, //查询字符串，必须是 key1=val1&key2=val2 的格式。从这条转发消息进入后，可通过 wx.getLaunchOptionsSync() 或 wx.onShow() 获取启动参数中的 query。
                success: WxSdk.ins().shareSuccess,
                fail: function (res) {
                    console.log(res + '分享失败');
                    // 转发失败
                },
                complete: function (res) {
                    // 不管成功失败都会执行
                    console.log(res, 'shareAppMessage complete222');
                }
            }
        })
    }

    //切回前台，计算时间戳，如果大于30秒，重新发送登录请求--------------这个接口有问题，当游戏切还在后台竟然也出发了

    public wxOnShow() {
        if (!SdkMgr.isWxGame())
            return;
        window['wx'].onShow((res) => {
            console.log(">>>>>>>>游戏切换到》》前台>>res = " + res.scene, res)
            if (res.scene) WxSdk.ins().scene = res.scene;
            if (res.query) {
                WxSdk.ins().query = res.query;

                if (WxSdk.ins().query.shareTag && WxSdk.ins().query.heId)
                    WxSdk.ins().getShareCount(WxSdk.ins().query.shareTag, WxSdk.ins().query.heId);
            }
            //res.scene='1104' //从我的小游戏进入
            // res.scene='1103' //从我的小游戏进入
            if (!WxSdk.ins().IsLoinged) {
                WxSdk.ins().wxLoging();
            }
        });
    }
    /**微信内存预警*/
    public onMemoryWarning(): void {
        if (!SdkMgr.isWxGame())
            return;
        window['wx'].onMemoryWarning(() => {
            UserTips.ins().showTips(`微信内存不足`);
            egret.log(`微信内存不足，强制清理内存，可能导致显示问题`);
            ResMgr.ins().memoryWarning();
        });
    }

    public exitMiniProgram(): void {
        if (!SdkMgr.isWxGame())
            return;
        window['wx'].exitMiniProgram({
            success: (res) => {

            },
            fail: (res) => { },
            complete: (res) => { }
        });
    }

    //分享生成tag，用来防止用1个分享链接多次登录刷分享次数
    public getShareTag() {
        var temp = Math.random();
        WxSdk.ins().shareTagList.push(temp);
        return temp;
    }

    //从哪个分享链接二次进入游戏
    public getShareCount(tag, heid) {

        if (RoleMgr.actorid != heid) return;
        console.log(">>>>>>>>>>>>>>>进入分享次数匹配tag = " + tag + "//count=" + WxSdk.ins().shareTagList.length + "//////WxSdk.ins().shareTagList=", WxSdk.ins().shareTagList)
        var temp = WxSdk.ins().shareTagList;
        for (var i = 0; i < temp.length; i++) {
            if (tag == temp[i]) {
                console.log(">>>>>>>>>>>>>>>tag=" + tag + '///temp[i]=' + temp[i]);
                WxSdk.ins().shareTagList.splice(i, 1);

                console.log("**************GameSocket.ins().GetSocketState() = " + GameSocket.ins().GetSocketState());
                if (GameSocket.STATUS_COMMUNICATION == GameSocket.ins().GetSocketState()) {//如果链接正常，直接发送分享协议，如果是断开链接状态，则等重连之后再发送
                    WxSdk.ins().shareSend();
                }
                else {
                    WxSdk.ins().shareLinJoin = true;
                }
                break;
            }
        }
        // if (5 <= WxSdk.ins().shareCount)//每日分享上限是5次,5次之后清掉内存
        //     WxSdk.ins().shareTagList = [];
        console.log(">>>>>>>>>>>>>>>进入分享次数匹配count=", WxSdk.ins().shareTagList);
    }

    public shareSend() {
        //首次分享逻辑
        console.log("*******************发送分享协议前分享数据", ShareModel.ins().infos);
        var state = ShareModel.ins().infos.firstshare;
        if (state == 0) {
            let req = new Sproto.cs_share_event_request;
            GameSocket.ins().Rpc(C2sProtocol.cs_share_event, req, null, this);//
            console.log(">>>>>>>>发送首次分享>>>>>>>>>>C2sProtocol.cs_share_event")
        } else {
            //每日分享逻辑
            var dailyshare = ShareModel.ins().infos.dailyshare;
            if (dailyshare.reward == 1) {
                // if (SdkMgr.isWxGame())
                //     WxSdk.ins().shareAppMessage();//拉起分享
                var cfgs = GlobalConfig.share2Config
                var max = Object.keys(cfgs).length;
                if (dailyshare.count >= max) {
                    console.log(">>>>>>>>每日分享不能超过总次数>>>>>>>>>dailyshare.count = " + dailyshare.count + "//max = " + max + "//cfgs=", cfgs)
                    return true;
                }
                if (0 < ShareModel.ins().getCd())
                    return true;

                let req = new Sproto.cs_share_event_request;
                GameSocket.ins().Rpc(C2sProtocol.cs_share_event, req, null, this);//
                console.log(">>>>>>>>发送每日分享>>>>>>>>>>C2sProtocol.cs_share_event")
            }
        }

        //如果离线经验点了分享获取双倍经验
        if (WxSdk.ins().shareOffineReward) {
            // //type	#1普通2:双倍
            // let req = new Sproto.cs_offline_apply_req_request;
            // req.type = 2;
            // GameSocket.ins().Rpc(C2sProtocol.cs_offline_apply_req, req, null, this);
            // WxSdk.ins().shareOffineReward = false;
            console.log(">>>>>>获取双倍经验>>>>>>>>>>Sproto.cs_offline_apply_req_request")
            GameGlobal.MessageCenter.dispatch(MessageDef.OFFLIN_SHAREJONIN_SUCCESS)
        }
    }

    // 分享 转发成功
    shareSuccess(res) {
        console.log(res.shareTickets + '分享成功');
    }

    shareTitle = '山海大陆传送门就此打开，修仙炼们响应传唤吧'

    //分享
    public shareAppMessage() {
        if (!SdkMgr.isWxGame())
            return;
        var n = Math.random()
        var cfg = GlobalConfig.share6Config
        var arr = [];
        for (var i in cfg) {
            if (cfg[i]) {
                arr.push(cfg[i])
            }
        }
        n = Math.floor(n * arr.length) % arr.length
        console.log(">>>>>>>>>>>>>>>>>跳转图片：" + Const.RES_URL + "resource/assets/ress/share/" + arr[n].tupian + '.jpg' + "?v=" + Math.random(), arr[n])
        window["wx"].shareAppMessage({
            // title: '转发标题'
            title: arr[n].wenan, //WxSdk.shareTitle,
            imageUrl: Const.RES_URL + "resource/assets/ress/share/" + arr[n].tupian + '.jpg' + "?v=" + Math.random(),
            query: 'heId=' + RoleMgr.actorid + '&imgtag=' + arr[n].tupian + '.jpg' + '&shareTag=' + WxSdk.ins().getShareTag() + '&openid=' + WxSdk.ins().openid,//WxSdk.openid, //查询字符串，必须是 key1=val1&key2=val2 的格式。从这条转发消息进入后，可通过 wx.getLaunchOptionsSync() 或 wx.onShow() 获取启动参数中的 query。
            success: WxSdk.ins().shareSuccess,
            fail: function (res) {
                console.log(res + '分享失败');
                // 转发失败
            },
            complete: function (res) {
                // 不管成功失败都会执行
                console.log(res, 'shareAppMessage complete222');
            }
        })

    }
    //查询字符串
    public getLaunchOptionsSync() {
        if (!SdkMgr.isWxGame())
            return;
        var res = wx.getLaunchOptionsSync()
        WxSdk.ins().options = res;
        if (res.scene) WxSdk.ins().loginscene = res.scene;
        if (res.query) {
            WxSdk.ins().query = res.query;
            if (WxSdk.ins().query.channel)
                WxSdk.ins().channel = WxSdk.ins().query.channel;
            console.log('>>>>>>>>>>>>>>>启动页面的参数: channel = ' + WxSdk.ins().query.channel, WxSdk.ins().query, res, res.shareTicket)
        }
    }

    private sendHeadImg(imageUrl) {
        let req = new Sproto.UpdateHead_request();
        req.imgurl = imageUrl;
        GameSocket.ins().Rpc(C2sProtocol.UpdateHead, req, null, this);
    }

    /**获取微信用户信息*/
    public getUserWx() {
        wx.getUserInfo({
            withCredentials: true,
            success: function (res) {
                console.log('getUserWx success', res)
            },
            fail: function (res) {
                // console.log('getUserWx fail', res)
                // WxSdk.creatUserButton();
            },
            complete: function (res) {
                console.log('getUserWx complete', res)
                if (res.errMsg == 'getUserInfo:ok') {
                    if (res.userInfo && res.userInfo.avatarUrl) {
                        WxSdk.ins().imgURL = res.userInfo.avatarUrl;
                        WxSdk.ins().sendHeadImg(res.userInfo.avatarUrl);
                        // GameGlobal.MessageCenter.dispatch(MessageDef.GETUSERINFO_UPDATE_HEADICON)
                        console.log(">>>>>>>>>>>>>>>>>>>>获取到了用户信息，抛出更新头像事件");
                    }
                }
                else {
                    if (!WxSdk.ins().wxUserButton) WxSdk.ins().creatUserButton();
                }
            },
        })
    }
    public creatUserButton() {
        WxSdk.ins().wxUserButton = wx.createUserInfoButton({
            type: 'image',
            // text: '是否授权，让邀请者知道您的加入！',
            image: "../GetUserInfoBtn.png",
            style: {
                left: 0,    //对应屏幕真实的坐标x
                top: 0,     //对应屏幕真实的坐标y
                width: window.innerWidth,   //对应屏幕真实的宽
                height: window.innerHeight,  //对应屏幕真实的高
                lineHeight: 40,
                backgroundColor: '',
                color: '',
                textAlign: 'center',
                fontSize: 16,
                borderRadius: 4
            }
        })
        WxSdk.ins().wxUserButton.onTap(function (res) {
            console.log('wxUserButton', res)
            if (res.errMsg == 'getUserInfo:ok') {
                if (res.userInfo && res.userInfo.avatarUrl) {
                    WxSdk.ins().imgURL = res.userInfo.avatarUrl;
                    WxSdk.ins().sendHeadImg(res.userInfo.avatarUrl);
                    // GameGlobal.MessageCenter.dispatch(MessageDef.GETUSERINFO_UPDATE_HEADICON)
                    console.log(">>>>>>>>>>>>>>>>>>>>获取到了用户信息，抛出更新头像事件");
                }

                console.log('wxuser授权success')
                WxSdk.ins().wxUserButton.destroy();//
                WxSdk.ins().wxUserButton = null;
                // StartGameView.Start(); //
                WxSdk.ins().sdkLogin();
            }
            else {
                console.log('wxuser拒绝授权')
            }
        })
    }

    public destroyUserButton() {
        if (!SdkMgr.isWxGame())
            return;
        WxSdk.ins().wxUserButton.destroy();//
    }
    /**获取微信用户信息Button*/
    wxUserButton = null

    //小游戏跳转
    public navigateToMiniProgram(appid, naviPath = null) {
        if (!SdkMgr.isWxGame())
            return;

        window["wx"].navigateToMiniProgram({
            appId: appid,
            path: naviPath,
            extraData: {},
            envVersion: "",
            success: function () {
                console.log(">>>>>>>>>>>>>跳转成功");
            },
            fail: function () {
                console.log(">>>>>>>>>>>>>跳转失败");
            },
            complete: function () { }
        })
    }

    //==============================香蕉SDK==============================================
    public sdkInit() {
        var callback = function (res) {
            console.log(res)
        }
        window['xiangjiaoSDK'].init(WxSdk.ins().appkey, WxSdk.ins().openid, WxSdk.ins().options, callback);
        console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>上报 sdkInit");
    }

    public sdkLogin() {
        window['xiangjiaoSDK'].login();
        console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>上报 sdkLogin");
    }

    public sdkLoad() {
        window['xiangjiaoSDK'].load();
        console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>上报 sdkLoad");
    }

    public sdkRole() {
        window['xiangjiaoSDK'].role();
        console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>上报 sdkRole");
    }

    //自定义上报
    public sdkReportCustomEvent() {

    }

    /**ios支付 */
    public gameUserPay(out_trade_no, total_fee, goods_id, goods_name, notify_url, extra) {
        // var tempR = window['xiangJiao'].default.gameUserPay(
        //     WxSdk.ins().openid, out_trade_no, total_fee, goods_id, goods_name, notify_url, extra
        // );
        //===============模拟测试都用1分钱==========================
        var tempR = window['xiangjiaoSDK'].gameUserPay(
            WxSdk.ins().openid, out_trade_no, 1, goods_id, goods_name, notify_url, extra
        );
        window["wx"].openCustomerServiceConversation({
            showMessageCard: true,
            sessionFrom: "game",
            sendMessagePath: "gift",
            sendMessageTitle: "充值",
            sendMessageImg: Const.RES_URL + "resource/assets/ress/wxgame/xiangjiaoIos.jpg" + "?v=" + Math.random(),
            success: () => { console.log("打开客服成功！") }
        });
    }

    public wxRequestMidasPaymentForIos() {
        if (!SdkMgr.isWxGame())
            return;
        var senSeverData = {
            appid: WxSdk.ins().appid, openid: WxSdk.ins().openid, goodsid: WxSdk.ins().order.goodsId,
            serverid: StartGetUserInfo.mServerData.id, total_fee: (parseInt(WxSdk.ins().order.amount)) * 100,
            channelid: WxSdk.ins().channel, goods_name: ((parseInt(WxSdk.ins().order.amount)) * 100) + "元宝"
        }
        //从服务器端获取参数
        HttpClient.get((getData) => {
            getData = JSON.parse(getData).data
            console.log();
            WxSdk.ins().gameUserPay(getData.out_trade_no, getData.total_fee, getData.goods_id,
                getData.goods_name, getData.notify_url, getData.extra);
        },
            this, senSeverData, egret.HttpResponseType.TEXT, Const.SERVER_LIST_URL + "get_ordersign_xiangjiao");
    }
}

window["WxSdk"] = WxSdk