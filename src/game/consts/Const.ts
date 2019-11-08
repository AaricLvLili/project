// var RES_DIR = "res/"
// var RES_DIR_BLOOD = RES_DIR + "blood/"
// var RES_DIR_BODY = RES_DIR + "body/"
// var RES_DIR_EFF = RES_DIR + "eff/"
// var RES_DIR_ITEM = RES_DIR + "item/"
// var RES_DIR_MONSTER = RES_DIR + "monster/"
// var RES_DIR_SKILL = RES_DIR + "skill/"
// var RES_DIR_SKILLEFF = RES_DIR + "skillEff/"
// var RES_DIR_WARSPIRIT = RES_DIR + "warspirit/"
// var RES_DIR_WEAPON = RES_DIR + "weapon/"
// var RES_DIR_WING = RES_DIR + "wing/"
// var RES_DIR_FOOTSTEP = RES_DIR + "footstep/"


var RES_DIR = ""
var RES_DIR_BLOOD = RES_DIR + ""
var RES_DIR_BODY = RES_DIR + ""
var RES_DIR_EFF = RES_DIR + ""
var RES_DIR_ITEM = RES_DIR + ""
var RES_DIR_MONSTER = RES_DIR + ""
var RES_DIR_SKILL = RES_DIR + ""
var RES_DIR_SKILLEFF = RES_DIR + ""
var RES_DIR_WARSPIRIT = RES_DIR + ""
var RES_DIR_WEAPON = RES_DIR + ""
var RES_DIR_WING = RES_DIR + ""
var RES_DIR_FOOTSTEP = RES_DIR + ""

var WIDTH = 480;//舞台宽度
var HEIGHT = 800;//舞台高度

class Const {
    private static LOAD_TYPE = 1

    // 加载主程序 =》 加载登录界面 =》 连接服务器 =》 加载主资源 =》 进入游戏
    public static get IsLoadType01(): boolean {
        return this.LOAD_TYPE == 1
    }

    // 加载登录界面 =》 加载主程序 =》 加载主资源 =》连接服务器 =》 进入游戏
    public static get IsLoadType02(): boolean {
        return this.LOAD_TYPE == 2
    }

    // public static _RES_URL = "https://wdwsfile.h5aiwan.com/wdws2/";//测试cdn"http://lhxcfile.dianfengwan.com/";//"http://lyxcfile.kingcheergame.com/kingcheer/";

    public static _RES_URL = "";
    public static _BG_SERVER_URL = "https://ro-bg.h5aiwan.com/";
    public static PRODUCT_CODE = "362788327978525856751 62453706540";

    public static _SERVER_LIST_URL = "https://xmsy-platform.shouyougu.cn/";

    public static wxServerUrl = "";

    public static get RES_URL(): string {
        if (SdkMgr.isWxGame()) {//微信环境
            return Const._RES_URL = "https://wdwsfile.h5aiwan.com/wxgame_q5/jifeng1.8.9/";
            // return Const._RES_URL = "https://nhyd-static.boomegg.cn/wxgame_yhxy/v110/"

        }else if (SdkMgr.currSdk == SdkMgr.P_TYPE_11 || SdkMgr.currSdk == SdkMgr.P_TYPE_12) {
            return Const._RES_URL = "https://wdwsfile.h5aiwan.com/qb_by_vivo/";
        } else
            return Const._RES_URL;
    }
    /** 服务器访问地址*/
    public static get SERVER_LIST_URL(): string {
        if (SdkMgr.isWxGame())//微信环境
        {
            //测试
            // return Const._SERVER_LIST_URL = "https://lhxc-sdktest-platform.shouyougu.cn/";
            //正式
            // return Const._SERVER_LIST_URL = "https://wdws2-weixin-platform.h5aiwan.com/";

            return Const.wxServerUrl;
        } else
            return Const._SERVER_LIST_URL;
    }

    public static set RES_URL(url) {
        Const._RES_URL = url;
    }


    public static set SERVER_LIST_URL(url) {
        Const._SERVER_LIST_URL = url;
    }

    public static get BG_SERVER_URL(): string {
        return Const._BG_SERVER_URL;
    }

    public static set BG_SERVER_URL(url) {
        Const._BG_SERVER_URL = url;
    }
    /** 客服QQ*/
    public static get QQ(): string {
        switch (SdkMgr.currSdk) {
            // case SdkMgr.P_TYPE_4:
            //     return "2060412573\tQQ群：563455375";
            default:
                return "";
        }
    }

    /** 玩家信息改变是否通知平台*/
    public static get isInfoUpPlatform(): boolean {
        return false;
        // return (SdkMgr.currSdk == 3);
        // return (SdkMgr.currSdk == SdkMgr.P_TYPE_1) || (SdkMgr.currSdk == SdkMgr.P_TYPE_4) || (SdkMgr.currSdk == SdkMgr.P_TYPE_9);
    }

    /** 是否需要显示分享图标*/
    public static get isShare(): boolean {
        return (SdkMgr.currSdk == SDKTYPE.Wanba || SdkMgr.currSdk == SdkMgr.P_TYPE_8 || (SdkMgr.currSdk == SdkMgr.P_TYPE_10 && StartGetUserInfo.channelId2 == "4179"));

        // return (SdkMgr.currSdk == SdkMgr.P_TYPE_3) || (SdkMgr.currSdk == SdkMgr.P_TYPE_4)// && (ldgame && ldgame.isshowshare())));
    }

    /** 是否需要显示关注二维码*/
    public static get isQrcode(): boolean {
        return (Main.isDebug || SdkMgr.currSdk == SDKTYPE.Wanba || SdkMgr.currSdk == SdkMgr.P_TYPE_8);
    }

    // 熔炼个数
    public static SMELT_COUNT = 50

    public static CELL_SIZE: number = 64

    // 地图坐标到像素坐标的转换
    public static PosToPixel(val: number): number {
        return val * 64
    }

    public static PixelToPos(val: number): number {
        return Math.floor(val / 64)
    }



    public static get IsTestIpList(): boolean {
        return window["IsTestIpList"]
    }

    public static readonly zidanBuff: number = 30003;
}

enum GuildSkillType {
    NORMAL = 1,
    PRACTICE = 2,
}

enum EffectAddType {
    EFF_TYPE_SKILL = 1,
    EFF_TYPE_UI = 2
}

enum EffectAdd {
    NORMAL = 1,
    ADD = 2,
    ERASE = 3
}

enum GuildRobberState {
    NORMAL = 1,
    FIGHT = 2,
    DEAD = 3,
}
window["Const"] = Const