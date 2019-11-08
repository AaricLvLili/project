class GrowUpRoadBtn extends eui.ItemRenderer {

    public constructor() {
        super();
        this.skinName = "GrowUpRoadBtnSkin"
    }
    public btn: eui.Button;
    public redDot: eui.Image;

    public createChildren() {
        super.createChildren();
        this.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onClick, this);
    }

    dataChanged() {
        if (this.data == null) {
            return
        }
        let idx = parseInt(this.data)
        this.btn.icon = GlobalConfig.funcNoticeConfig[idx].iconid + "_png"
        this.redDot.visible = FuncOpenModel.ins().GetRewardState(idx) == RewardState.CanGet
        if (GrowUpRoadWin.selectIndex == this.itemIndex) {
            this.btn["m_SelectImg"].visible = true;
        } else {
            this.btn["m_SelectImg"].visible = false;
        }
    }

    private onClick() {
        GrowUpRoadWin.selectIndex = this.itemIndex;
        MessageCenter.ins().dispatch(MessageDef.HEROWAY_MSG);
    }


}

window["GrowUpRoadBtn"] = GrowUpRoadBtn