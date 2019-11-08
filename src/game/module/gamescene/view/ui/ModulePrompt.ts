class ModulePrompt extends BaseEuiPanel {
    private mask_bg: eui.Image;
    private dec_label: eui.Label;
    private icon: eui.Image;
    private moduleConfig: any;
    private prompt_img: eui.Image;
    private ascription: number;
    private mc: MovieClip;


    public constructor() {
        super();
    }

    public initUI() {
        super.initUI();
        this.skinName = "ModulePromptSikn";
    }
    public open(...param: any[]) {
        let id: string = param[0] + "";
        this.icon.x = 190;
        this.icon.y = 329;
        this.icon.scaleX = this.icon.scaleY = 1;
        this.mask_bg.visible = true;
        this.dec_label.visible = true;
        this.prompt_img.visible = true;
        if (this.moduleConfig == null) {
            this.moduleConfig = GlobalConfig.ins("FuncOpenConfig");
        }
        this.AddClick(this, this.moveIcon);
        let data = this.moduleConfig[id];
        if (data == null) {
            console.error(`${id} moduleConfig not found`)
            ViewManager.ins().close(this)
            return
        }
        this.icon.source = data.iconid + "_png";
        this.dec_label.text = data.introduce;
        this.ascription = data.ascription;
        if (this.mc == null) {
            this.mc = new MovieClip();
            this.mc.loadUrl(ResDataPath.GetUIEffePath("eff_tips"), true, -1);
            this.mc.x = 245;
            this.mc.y = 310;
            this.addChildAt(this.mc, 1);
        }

    }

    //移动图标
    private moveIcon(e): void {
        if (this.mc) {
            DisplayUtils.dispose(this.mc);
            this.mc = null;
        }
        this.mask_bg.visible = false;
        this.dec_label.visible = false;
        this.prompt_img.visible = false;
        //this.icon.scaleX = this.icon.scaleY = 0.5;
        let tw = egret.Tween.get(this.icon);
        let point: egret.Point = this.getPoint(this.ascription);
        tw.to({ x: point.x, y: point.y, scaleX: 0.5, scaleY: 0.5 }, 1000).call(() => { egret.Tween.removeTweens(this.icon); this.close() }, this, null);
    }
    private getPoint(index: number): egret.Point {
        let point: egret.Point = null;
        var obj = <UIView2>ViewManager.ins().getView("UIView2");
        var objfun = <PlayFunView>ViewManager.ins().getView("PlayFunView");
        //let toggle = objfun.layout01Btn.selected;
        // if (index == 12 || index == 10 || index == 11) {
        //     // if (toggle) {
        //     //     point = this.getGlobalPoint(objfun.layout01Btn);
        //         point.x-=35;
        //         point.y -=30;
        //         return point;
        //     //}
        // }
        switch (index) {
            case 1: point = this.getGlobalPoint(obj.roleBtn); point.x += 20; point.y += 20; break;//角色
            //case 8: point = this.getGlobalPoint(obj.furnaceBtn);point.x+=20;point.y +=20; break;//技能
            //case 7: point = this.getGlobalPoint(obj.furnaceBtn); break;//背包
            //case 6: point = this.getGlobalPoint(obj.guildBtn); break;//公会
            //case 12: point = this.getGlobalPoint(objfun.ringIcon);point.x-=30;point.y -=30; break;//特戒
            // case 3: point = this.getGlobalPoint(objfun.ladderBtn); break;//竞技
            // case 4: point = this.getGlobalPoint(objfun.fbBtn); break;//副本
            //case 5: point = this.getGlobalPoint(objfun.arrowBtn); break;//收纳箭头
            case 9: point = this.getGlobalPoint(objfun.taskBtn); break;//日常
            case 10: point = this.getGlobalPoint(objfun.zhuanZhiTask); point.x += 20; point.y += 20; break;//转职任务
            //case 11: point = this.getGlobalPoint(objfun.treasureHuntBtn); point.x+=20;point.y +=20;break;//寻宝
            //case 13: point = this.getGlobalPoint(objfun.rankBtn); break;//排行榜
            //case 2: point = this.getGlobalPoint(objfun.bossBtn); break;//领主
        }
        if (point == null)
            point = new egret.Point();
        point.x = 30;
        point.y = 750;
        return point;
    }
    //获取全局坐标
    private getGlobalPoint(dis: egret.DisplayObject): egret.Point {
        let point: egret.Point = new egret.Point();
        point.x = dis.x;
        point.y = dis.y;
        var parentCon = dis.parent;
        while (parentCon) {
            if (parentCon instanceof eui.Component) {
                parentCon.validateNow();
            }
            if (parentCon instanceof egret.Stage) {
                return point;
            }
            point.x += parentCon.x;
            point.y += parentCon.y;
            parentCon = parentCon.parent;
        }
        return point;
    }
    public close() {
        egret.Tween.removeTweens(this.icon);
        ViewManager.ins().close(ModulePrompt);
        GameGlobal.MessageCenter.dispatch(MessageDef.MODULE_PROMPT_CLOSE);
    }
}
ViewManager.ins().reg(ModulePrompt, LayerManager.UI_Popup);
window["ModulePrompt"]=ModulePrompt