/** 首次分享*/
class ShareFirstWin extends BaseEuiPanel {
    static LAYER_LEVEL = LayerManager.UI_Popup
    public constructor() {
        super();
    }
    public initUI(): void {
        super.initUI();
        this.skinName = "ShareFirstSkin";

        this.iconList.itemRenderer = ItemBase;
    }

    /** 关闭按钮*/
    public dialogClose: eui.Button;
    /** 展示道具list*/
    private iconList: eui.List;
    /** 领取奖励*/
    private awardBtn: eui.Button;
    wing: eui.Group
    mc: MovieClip

    /** 窗口打开基类调用*/
    public open(...param: any[]): void {
        super.open(param);
        GameGlobal.MessageCenter.addListener(ShareEvt.WX_SHARE, this.update, this)
        this.dialogClose.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTap, this);
        this.awardBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.awardClick, this);
        this.update();
    }

    update() {
        var cfg = GlobalConfig.share1Config[1]
        this.iconList.dataProvider = new eui.ArrayCollection(cfg.tbReward);
        var state = ShareModel.ins().infos.firstshare;
        if (state == 0) {
            this.awardBtn.skinName = "btnJumpSkin";
            this.awardBtn.label = GlobalConfig.jifengTiaoyueLg.st101200;
            this.awardBtn['redPoint'].visible = false//
        }
        else if (state == 1) {
            this.awardBtn.skinName = "Btn1Skin";
            this.awardBtn.label = GlobalConfig.jifengTiaoyueLg.st100004;
            this.awardBtn['redPoint'].visible = true//
        }
        else if (state == 2) {
            this.awardBtn.skinName = "Btn1Skin";
            this.awardBtn.label = GlobalConfig.jifengTiaoyueLg.st100981;
            this.awardBtn['redPoint'].visible = false//
            this.awardBtn.enabled = false
        }

        if (!this.mc) {
            this.mc = new MovieClip
            this.mc.loadUrl(ResDataPath.GetRoleWingPath("wing13_0s"), true, -1)
            this.wing.addChild(this.mc)
            this.mc.y = 100
        }
    }

    /** 窗口关闭基类调用*/
    public close(): void {
        super.close();
        this.dialogClose.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onTap, this);
    }

    /** 触摸抬起事件调用*/
    private onTap(e: egret.TouchEvent): void {
        ViewManager.ins().close(this);
    }

    /** 领取奖励*/
    private awardClick(e: egret.TouchEvent): void {
        var state = ShareModel.ins().infos.firstshare;
        if (state == 0) {
            if (SdkMgr.isWxGame())
                WxSdk.ins().shareAppMessage();
            // let req = new Sproto.cs_share_event_request;
            // GameSocket.ins().Rpc(C2sProtocol.cs_share_event, req, null, this);//
        }
        else if (state == 1) {
            let req = new Sproto.cs_operate_share_request;
            req.actId = 1
            req.subProto = "reward"
            // req.subData =
            GameSocket.ins().Rpc(C2sProtocol.cs_operate_share, req, null, this);//请求奖励
        }
    }
}
window["ShareFirstWin"] = ShareFirstWin 
