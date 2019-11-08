class EasyLoading extends BaseClass {

    // averageUtils: AverageUtils;
    // content: egret.Sprite;
    // uiImageContainer: egret.DisplayObjectContainer;
    // speed: number;
    public m_ItemEffGroup: eui.Group = new eui.Group();
    public m_Img: eui.Rect = new eui.Rect();
    private m_ItemEff: MovieClip;
    public constructor() {
        super();
        // this.content = null;
        // this.speed = 10 / (1000 / 60);
        this.init();
    }

    public static ins(): EasyLoading {
        return super.ins();
    };
    public init() {
        this.m_ItemEffGroup.addChild(this.m_Img);
        this.m_ItemEffGroup.width = 20;
        this.m_ItemEffGroup.height = 20;
        this.m_Img.alpha = 0.5;
        this.m_ItemEffGroup.anchorOffsetX = this.m_ItemEffGroup.width / 2;
        this.m_ItemEffGroup.anchorOffsetY = this.m_ItemEffGroup.height / 2;
        // this.averageUtils = new AverageUtils();
        // this.content = new egret.Sprite();
        // this.content.graphics.beginFill(0x000000, 0.2);
        // this.content.graphics.drawRect(0, 0, StageUtils.ins().getWidth(), StageUtils.ins().getHeight());
        // this.content.graphics.endFill();
        // this.content.touchEnabled = true;
        // this.uiImageContainer = new egret.DisplayObjectContainer();
        // this.uiImageContainer.x = this.content.width * 0.5;
        // this.uiImageContainer.y = this.content.height * 0.5;
        // this.content.addChild(this.uiImageContainer);
        // RES.getResByUrl(ResDataPath.GetAssets("ress/component/comp_82_83_01"), function (texture) {
        //     var img = new egret.Bitmap();
        //     img.texture = texture;
        //     img.x = -img.width * 0.5;
        //     img.y = -img.height * 0.5;
        //     this.uiImageContainer.addChild(img);
        // }, this, RES.ResourceItem.TYPE_IMAGE);
        GameSocket.ins().setOnClose(this.showLoading, this);
        GameSocket.ins().setOnConnected(this.hideLoading, this);
    };
    public showLoading() {
        // StageUtils.ins().getStage().addChild(this.content);
        // TimerManager.ins().doTimer(30, 0, this.enterFrame, this);
        this.m_ItemEffGroup.y = StageUtils.ins().getHeight() / 2;
        this.m_ItemEffGroup.x = StageUtils.ins().getWidth() / 2;
        this.m_Img.width = StageUtils.ins().getWidth() + 500;
        this.m_Img.height = StageUtils.ins().getHeight() + 500;
        this.m_Img.anchorOffsetX = this.m_Img.width / 2;
        this.m_Img.anchorOffsetY = this.m_Img.height / 2;
        StageUtils.ins().getStage().addChild(this.m_ItemEffGroup);
        this.playUpEff();
    };
    public hideLoading() {
        // if (this.content && this.content.parent) {
        //     StageUtils.ins().getStage().removeChild(this.content);
        //     this.uiImageContainer.rotation = 0;
        // }
        // TimerManager.ins().remove(this.enterFrame, this)
        DisplayUtils.removeFromParent(this.m_ItemEffGroup);
        DisplayUtils.dispose(this.m_ItemEff);
        this.m_ItemEff = null;
    };
    // public enterFrame(time: number) {
    //     this.averageUtils.push(this.speed * time);
    //     this.uiImageContainer.rotation += this.averageUtils.getValue();
    // };
    public playUpEff() {
        this.initEffData1();
        this.m_ItemEff.visible = true;
        this.m_ItemEff.loadUrl(ResDataPath.GetUIEffePath("eff_circle"), true, -1);
    }
    private initEffData1() {
        if (!this.m_ItemEff) {
            this.m_ItemEff = new MovieClip();
            this.m_ItemEff.touchEnabled = false;
            this.m_ItemEffGroup.addChild(this.m_ItemEff);
            this.m_ItemEff.x = this.m_ItemEffGroup.width / 2;
            this.m_ItemEff.y = this.m_ItemEffGroup.height / 2;
        }
    }
}
window["EasyLoading"] = EasyLoading