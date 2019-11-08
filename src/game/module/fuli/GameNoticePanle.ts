class GameNoticePanle extends eui.Component {
    public constructor() {
        super()
        this.skinName = "gameNoticeSkin"
    }

    title
    desc



    open() {
        for (var e = [], t = 0; t < arguments.length; t++) e[t] = arguments[t];
        var i = GlobalConfig.ins("HelpInfoConfig")[5].text,
            n = i.split("_");
        this.title.textFlow = TextFlowMaker.generateTextFlow(n[0])

        this.desc.textFlow = TextFlowMaker.generateTextFlow(n[1]);


        var request = new egret.HttpRequest();
        request.responseType = egret.HttpResponseType.TEXT
        var url: string = "";
        if (SdkMgr.isWxGame() || SdkMgr.requestType == 1) {
            url = Const.SERVER_LIST_URL + "get_total_notice?platformid=" + SdkMgr.platformid + "&channelid=" + SdkMgr.channelid;
        }
        else {
            url = Const.SERVER_LIST_URL + "api/server/getnoticecontent?platformid=" + SdkMgr.platformid + "&channelid=" + SdkMgr.channelid + "&ver=" + SdkMgr.ver;
        }
        request.open(url, egret.HttpMethod.GET);
        request.send()
        request.addEventListener(egret.Event.COMPLETE, this.onPostComplete, this);
        request.addEventListener(egret.IOErrorEvent.IO_ERROR, this.onPostIOError, this);
        request.addEventListener(egret.ProgressEvent.PROGRESS, this.onPostProgress, this);
        // this.desc.textFlow = TextFlowMaker.generateTextFlow(GameNoticePanle.test_decs)
        // MoneyTreeModel.ins().isOpenNotice && (GameGlobal.moneyTreeModel.isOpenNotice = !1, App.MessageCenter.dispatch(MessagerEvent.GAME_NOTICE_OPEN), App.ControllerManager.applyFunc(ControllerConst.Notice, NoticeFunc.SEND_NOTICE_OPEN))
    }

    private onPostComplete(event: egret.Event): void {
        var request = <egret.HttpRequest>event.currentTarget;
        try {
            let jsonObj = JSON.parse(request.response)
            //兼容服务器和庆亮的要求
            if (jsonObj.result == 1 || jsonObj.code == 200) {
                if (jsonObj.data != null && jsonObj.data.length > 0) {
                    this.desc.textFlow = TextFlowMaker.generateTextFlow(jsonObj.data.replace(new RegExp("/n", "gm"), "\n"));

                }
            }
        } catch (e) {
            console.log(e)
        }
    }

    private onPostIOError(event: egret.IOErrorEvent): void {
        egret.log("post error : " + event);
    }

    private onPostProgress(event: egret.ProgressEvent): void {
        egret.log("post progress : " + Math.floor(100 * event.bytesLoaded / event.bytesTotal) + "%");
    }

    close() {

    }

}
window["GameNoticePanle"]=GameNoticePanle