class GamePersonItemPanel extends eui.ItemRenderer {

    public personbg: eui.Image;
    public groupMethod: eui.Group;
    public gameMethod: eui.Label;
    public groupDetail: eui.Group;
    public timeDetail: eui.Label;
    public groupLevel: eui.Group;
    public personLevel: eui.Label;


    public constructor() {
        super();
        this.skinName = "GamePersonItemSkin";
        this.gameMethod.textFlow = (new egret.HtmlTextParser).parser("<a href=\"event:\"><u>" + GlobalConfig.jifengTiaoyueLg.st100540 + "</u></a>")
        this.addEventListener(egret.TouchEvent.TOUCH_TAP, this._OnClick, this);
    }

    protected dataChanged(): void {
        this.personbg.source = this.data.bg + "_png";
        this.timeDetail.text = this.data.timetips;
        this.personLevel.text = this.data.opentips;
        this.groupMethod.visible = this.data.gametips > 0;
        this.groupLevel.visible = !GamePersonItemPanel.isOpen(this.data);
        this.groupDetail.visible = !!this.data.timetips
    }

    protected onTap(): void {
        ViewManager.ins().open(ZsBossRuleSpeak, this.data.gametips);
    }

    private _OnClick(e: egret.TouchEvent) {
        if (e.target == this.gameMethod) {
            ViewManager.ins().open(ZsBossRuleSpeak, this.data.gametips);
            return;
        }

        if (GamePersonItemPanel.isOpen(this.data, true)) {
            ViewManager.ins().close(GamePlay);
            ViewManager.Guide(this.data.controlTarget[0], this.data.controlTarget[1])
        }
    }

    public static isOpen(item, haveTips: boolean = false): boolean {
        //公会特殊拦截
        if (item.controlTarget[0] == ViewIndexDef.GuildActivityWin || item.controlTarget[0] == ViewIndexDef.GuildWarMainBgWin) {
            if (GameLogic.ins().actorModel.guildID == undefined || GameLogic.ins().actorModel.guildID == 0) {
                if (haveTips) UserTips.ins().showTips(GlobalConfig.jifengTiaoyueLg.st100541);
                return false;
            }

            //公会副本
            if (item.controlTarget[0] == ViewIndexDef.GuildActivityWin && item.controlTarget[1] == 1) {
                if (GameServer.serverOpenDay < GlobalConfig.guildfbconfig.openDay - 1) {
                    if (haveTips) UserTips.ins().showTips(GlobalConfig.jifengTiaoyueLg.st100542);
                    return false
                }
            }
        }

        if (!Deblocking.Check(item.funcopenId, !haveTips)) {
            return false
        }
        return true;
    }
}
window["GamePersonItemPanel"] = GamePersonItemPanel