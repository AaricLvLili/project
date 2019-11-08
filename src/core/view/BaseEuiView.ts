class BaseEuiView extends BaseView 
{
    // 定义view对象的层级
    public static LAYER_LEVEL = null
    // 定义view对象的名称
    public static LAYER_NAME = null
    mWindowHelpId = 0;
    _resources: any = null;
    _isInit: boolean = false;

    // layerLevel = VIEW_LAYER_LEVEL.BOTTOM
    layerLevel = VIEW_LAYER_LEVEL.MIDDLE
    
    public constructor(unZoom?:boolean) 
    {
        super();

        this._resources = null;
        this._isInit = false;
        if(!unZoom)
        {
            this.percentHeight = 100;
            this.percentWidth = 100;
        }
    }

    public isInit(): boolean 
    {
        return this._isInit;
    }
    
    public isShow()
    {
        return this.stage != null && this.visible;
    }
    /**
     * 添加到父级
     */
    public addToParent(parent: egret.DisplayObjectContainer)
    {
        parent.addChild(this);
        // TimerManager.ins().remove(this.destoryView, this);
    }
    /**
     * 从父级移除
     */
    public removeFromParent()
    {
        DisplayUtils.removeFromParent(this);
        // TimerManager.ins().doTimer(10 * 1000, 1, this.destoryView, this);
        this.destoryView();
    }
    /**
     *对面板进行显示初始化，用于子类继承
     *
     */
    public initUI() {
        this._isInit = true;
    }
    /**
     *对面板数据的初始化，用于子类继承
     *
     */
    public initData() {
    }
    /**
     * 销毁
     */
    public destroy(){
    }
    public destoryView() {
        TimerManager.ins().removeAll(this);
        ViewManager.ins().destroy(this.hashCode);
    }

    /**
     * 加载面板所需资源
     */
    public loadResource(loadComplete, initComplete) {
        if (this._resources && this._resources.length > 0) {
            ResourceUtils.ins().loadResource(this._resources, [], loadComplete, null, this);
            this.addEventListener(eui.UIEvent.CREATION_COMPLETE, initComplete, this);
        }
        else {
            loadComplete();
            initComplete();
        }
    }
    /**
     * 设置是否隐藏
     * @param value
     */
    public setVisible(value) {
        this.visible = value;
    }

    public static openCheck(...param: any[]) {
        return true;
    }

    public GetLayerLevel() {
        return null
    }


    public SetTableIndex(index: number) {
        let window = this["commonWindowBg"];
        if (window) {
            window.SetTabIndex(index)
        }
	}
}
window["BaseEuiView"]=BaseEuiView