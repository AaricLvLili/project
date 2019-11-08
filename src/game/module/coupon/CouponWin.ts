class CouponWin extends BaseEuiPanel implements ICommonWindow {

    public static LAYER_LEVEL = LayerManager.UI_Main

    private commonWindowBg: CommonWindowBg
    public static openIndex: number = 0;
    private couponPanel 
    private couponTrePanel 
    private couponShopPanel 
    public constructor() {
        super();
        this.skinName = "MainWinSkin";
    }

    public createChildren() {
        super.createChildren();
        this.couponPanel = new CouponPanel();
        this.couponTrePanel = new CouponTrePanel();
        this.couponShopPanel = new CouponShopPanel();
        this.commonWindowBg.AddChildStack(this.couponPanel);
        this.commonWindowBg.AddChildStack(this.couponTrePanel);
        this.commonWindowBg.AddChildStack(this.couponShopPanel);
    }

    destoryView() {
        super.destoryView();
    }

    open(...param: any[]) {
        CouponSproto.ins().sendTreasureRoleList();
        CouponSproto.ins().sendShopInfo();
        this.commonWindowBg.OnAdded(this, param ? param[0] : 0)
        this.setRedPoint();
        this.observe(CouponEvt.COUPON_TREASURE_UPDATE, this.setRedPoint)
    }

    close() {
        this.commonWindowBg.OnRemoved()
    }

    setRedPoint() {
        this.commonWindowBg.CheckTabRedPoint();
        this.commonWindowBg.ShowTalRedPoint(1, CouponModel.getInstance.checkAllRedPoint())
    }

    OnOpenIndex?(openIndex: number): boolean {
        // if (openIndex == 2) {
        //     return Deblocking.Check(DeblockingType.TYPE_24)
        // }
        return true
    }

}

window["CouponWin"] = CouponWin