class LayerManager {
	/**
     * 游戏背景层
     * @type {BaseSpriteLayer}
     */
    public static Game_Bg = new BaseEuiLayer();
    /**
     * 主游戏层
     * @type {BaseSpriteLayer}
     */
    public static Game_Main = new BaseEuiLayer();

    public static UI_HUD = new BaseEuiLayer();
    public static UI_USER_INFO = new BaseEuiLayer();
    /**
     * UI主界面
     * @type {BaseEuiLayer}
     */
    public static UI_Main = new BaseEuiLayer();
    /**
     * UI导航栏界面
     */
    public static UI_NAVIGATION = new BaseEuiLayer()
    public static UI_Main_2 = new BaseEuiLayer();
    /**
     * UI弹出框层
     * @type {BaseEuiLayer}
     */
    public static UI_Popup = new BaseEuiLayer();
    /**
     * UI警告消息层
     * @type {BaseEuiLayer}
     */
    public static UI_Message = new BaseEuiLayer();
    /**
     * UITips层
     * @type {BaseEuiLayer}
     */
    public static UI_Tips = new BaseEuiLayer();
    /**
    * UITop层
    * @type {BaseEuiLayer}
    */
    public static UI_Top = new BaseEuiLayer();
}
window["LayerManager"] = LayerManager