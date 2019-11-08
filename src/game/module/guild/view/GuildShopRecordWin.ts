class GuildShopRecordWin extends BaseEuiPanel {
    public static LAYER_LEVEL = LayerManager.UI_Popup
    public constructor() {
        super()
    }

    list;
    arrList;
    //private dialogCloseBtn:eui.Button;
    initUI() {
        this.skinName = "GuildStoreInfoSkin";
        this.list.itemRenderer = GuildShopRecordItemRender;
        this.arrList = new eui.ArrayCollection();

    }
    open() {
        this.m_bg.init(`GuildShopRecordWin`, GlobalConfig.jifengTiaoyueLg.st101209)
        // this.dialogCloseBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this._OnClick, this);
        this.arrList.replaceAll(GuildStore.ins().GetRecordInfos());
        this.list.dataProvider = this.arrList;
    };
    close() {
        //this.dialogCloseBtn.removeEventListener(egret.TouchEvent.TOUCH_TAP, this._OnClick, this)
    };
    private _OnClick(e: egret.TouchEvent) {
        ViewManager.ins().close(this);
    }
}
window["GuildShopRecordWin"]=GuildShopRecordWin