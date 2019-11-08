class BaseEuiPanel extends BaseEuiView {

    public rect: eui.Rect;
    public imgMask: eui.Image;
    public m_bg: CommonPopBg
    public constructor() {
        super(true);
        this.verticalCenter = 0;
        this.horizontalCenter = 0;
        this.rect = new eui.Rect();
        this.rect.fillColor = 0x0;
        this.rect.alpha = 0.85;
        this.rect.percentHeight = 100;
        this.rect.percentWidth = 100;
        this.rect.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onMaskTap, this);

        this.imgMask = new eui.Image("pic_bj_45_jpg");
        this.imgMask.percentHeight = 100;
        this.imgMask.percentWidth = 100;
        this.imgMask.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onMaskTap, this);
    }

    public onMaskTap(): void {
        // this.rect.removeEventListener(egret.TouchEvent.TOUCH_TAP,this.onMaskTap,this);
        // this.imgMask.removeEventListener(egret.TouchEvent.TOUCH_TAP,this.onMaskTap,this);
        ViewManager.ins().close(this);
    }

    /**
     * 添加到父级
     */
    public addToParent(parent: egret.DisplayObjectContainer) {
        if (parent == LayerManager.UI_Popup || parent == LayerManager.UI_Top)
            parent.addChild(this.rect);
        else
            parent.addChild(this.imgMask);
        super.addToParent(parent);
    }
    /**
     * 从父级移除
     */
    public removeFromParent() {
        super.removeFromParent();
        DisplayUtils.removeFromParent(this.rect);
        DisplayUtils.removeFromParent(this.imgMask);
        // DisplayUtils.removeFromParent(this.m_bg);
    }
}
window["BaseEuiPanel"] = BaseEuiPanel