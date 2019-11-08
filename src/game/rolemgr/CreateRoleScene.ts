class CreateRoleScene extends BaseScene {
	public constructor() {
		super();
	}

    /**
     * 进入Scene调用
     */
	public onEnter() {
		super.onEnter();
		this.addLayer(LayerManager.UI_Main);
		this.addLayer(LayerManager.UI_Tips);
		ViewManager.ins().open(CreateRoleView);
		//播放背景音乐
		// SoundManager.ins().playBg("login_mp3");
		RoleMgr.ins().hideLabel();
	};
    /**
     * 退出Scene调用
     */
	public onExit() {
		super.onExit();
	};
}
window["CreateRoleScene"]=CreateRoleScene