class GameAnnounce extends BaseEuiView {

    public constructor() {
        super()
        this.skinName = "AnnounceSkin";
        // EXML.load(StartGameView.ROOT + "assets/atlas_ui/start_game/AnnounceSkin.exml", this.onLoaded, this);
        this.onLoaded();
        StageUtils.ins().getUIStage().addChild(this);
        this.m_bg.init(`GameAnnounce`, "游戏公告", true, this._Close.bind(this))
    }

    // private dialogCloseBtn: eui.Button
    private dialogMask: eui.Rect;
    private label: eui.Label
    private m_bg: CommonPopBg

    private static m_Instance: SelectServerView

    public open() {
       // this.m_bg.init(`GameAnnounce`, `游戏公告`, false, this._Close.bind(this))
    }

    public onLoaded() {//clazz, url) {
        // this.skinName = clazz

        // this.dialogCloseBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this._Close, this)
        this.dialogMask.addEventListener(egret.TouchEvent.TOUCH_TAP, this._Close, this)
        var url: string;
        if (SdkMgr.isWxGame() || SdkMgr.requestType ==1) {
            url = Const.SERVER_LIST_URL + "get_total_notice?platformid=" + SdkMgr.platformid + "&channelid=" + SdkMgr.channelid;
        }
        else {
            url = Const.SERVER_LIST_URL + "api/server/getnoticecontent?platformid=" + SdkMgr.platformid + "&channelid=" + SdkMgr.channelid + "&ver=" + SdkMgr.ver;
        }
        this.label.text = "";
        var request = new egret.HttpRequest();
        request.responseType = egret.HttpResponseType.TEXT;
        request.open(url, egret.HttpMethod.GET);
        //  Main.errorBack(Const.SERVER_LIST_URL + "get_total_notice?platformid=" + StartGameView.platformid + "channelid" + SdkMgr.channelId + "sd"  + SdkMgr.channelid2 +"ver" + CySdk.ins()._ver) ;
        request.send()
        request.addEventListener(egret.Event.COMPLETE, this.onPostComplete, this);
        request.addEventListener(egret.IOErrorEvent.IO_ERROR, this.onPostIOError, this);
        request.addEventListener(egret.ProgressEvent.PROGRESS, this.onPostProgress, this);
        // this.label.text = this.msg
    }

    private onPostComplete(event: egret.Event): void {
        var request = <egret.HttpRequest>event.currentTarget;
        try {
            let jsonObj = JSON.parse(request.response);
            // egret.log(jsonObj);
            if (jsonObj.result == 1 || jsonObj.code == 200) {
                if (jsonObj.data != null) {
                    // this.label.textFlow = (new egret.HtmlTextParser).parser(jsonObj.data);
                    // this.label.text = (jsonObj.data).replace("<br/>", "\n")
                    this.label.text = jsonObj.data.replace(new RegExp("/n", "gm"), "\n")
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

    private _Close() {
        // StageUtils.ins().getStage().removeChild(this)

        // this.dialogCloseBtn.removeEventListener(egret.TouchEvent.TOUCH_TAP, this._Close, this)
        this.dialogMask.removeEventListener(egret.TouchEvent.TOUCH_TAP, this._Close, this)

        this.removeChildren();
        this.label = null;
        // this.dialogCloseBtn = null;
        this.dialogMask = null;

        this.parent.removeChild(this);
    }
}

window["GameAnnounce"]=GameAnnounce