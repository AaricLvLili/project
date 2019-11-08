
class VitalityListItem extends eui.ItemRenderer {

    private label: eui.Label
    // private getway: GetwayLabel
    private count: eui.Label
    private count0: eui.Label
    private getway: eui.Button;
    private finish: eui.Image;
    private funcOpenConfig: any;

    public constructor() {
        super()
        this.skinName = "VitalityListItemSkin";
        this.getway.label = GlobalConfig.jifengTiaoyueLg.st101245;
    }

    public childrenCreated() {
        // this.getway.label.width = 128
        // this.getway.label.verticalAlign = "center"
        // this.getway.label.horizontalCenter = "right"
        // UIHelper.SetLinkStyleLabel(this.getway);
        this.getway.addEventListener(egret.TouchEvent.TOUCH_TAP, this._OnClick, this)
    }

    private _OnClick() {
        let taskData = this.data as TaskData
        if (taskData.state == 0) {
            let configData = GlobalConfig.ins("DailyConfig")[taskData.id]
            if (!configData) {
                return
            }
            if (!this._CheckOpen(false)) {
                return
            }
            ViewManager.ins().close(LiLianWin)
            ViewManager.Guide(configData.controlTarget[0], configData.controlTarget[1])
        } else if (taskData.state == 1) {
            UserTask.ins().sendGetAwak(taskData.id);
        }
    }

    private _CheckOpen(flg: boolean): boolean {
        let configData = GlobalConfig.ins("DailyConfig")[this.data.id]
        if (!configData) {
            return false
        }
        if (configData.funcopenId == null) {
            return true
        }
        return Deblocking.Check(configData.funcopenId, flg)
    }

    protected dataChanged(): void {
        let taskData = this.data as TaskData
        let configData = GlobalConfig.ins("DailyConfig")[taskData.id]
        if (!configData) {
            return
        }
        this.label.text = configData.desc + ""
        // this.count.text = ` ${taskData.value}/${configData.target} `
        // if (taskData.value >= configData.target) {
        //     this.count.textColor = 0xB0AA0E
        // } else {
        //     this.count.textColor = 0xEF2B2A
        // }
        ViewManager.ins().setLab(this.count,taskData.value,configData.target)
        this.count0.text = GlobalConfig.jifengTiaoyueLg.st102096 + "+" + configData.activeValue;
        this.finish.visible = false;
        this.getway.visible = false;
        if (!this._CheckOpen(true) && taskData.state == 0) {
            if (this.funcOpenConfig == null)
                this.funcOpenConfig = GlobalConfig.ins("FuncOpenConfig");
        } else {
            switch (taskData.state) {
                case 0:
                    this.getway.label = GlobalConfig.jifengTiaoyueLg.st101245;
                    this.getway.visible = true;
                    break;
                case 1:
                    this.getway.label = GlobalConfig.jifengTiaoyueLg.st101210;
                    this.getway.visible = true;
                    break;
                default:
                    this.finish.visible = true;
                    break;
            }
        }
    }
}
window["VitalityListItem"] = VitalityListItem