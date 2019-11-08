class WildBossJoinWin extends BaseEuiPanel {

	public static LAYER_LEVEL = LayerManager.UI_Popup

	private list: eui.List

	//private dialogCloseBtn:eui.Button;
	private id: number

	initUI() {
		super.initUI();
		this.skinName = "ZSBossJoinSkin";
		this.list.itemRenderer = WildBossJoinItem

	};
	open(...param: any[]) {
		this.m_bg.init(`WildBossJoinWin`, GlobalConfig.jifengTiaoyueLg.st100484)
		let id = param[0]
		this.id = id
		UserBoss.ins().sendRank(id);
		//if(this.dialogCloseBtn) this.dialogCloseBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this._OnClick, this);
		this.observe(MessageDef.PUBLIC_BOSS_RANK_UPDATE, this.refushListInfo);
		this.refushListInfo();
	};
	close() {
		//	this.dialogCloseBtn.removeEventListener(egret.TouchEvent.TOUCH_TAP, this._OnClick, this)
	};
	refushListInfo() {
		this.list.dataProvider = new eui.ArrayCollection(UserBoss.ins().GetRankData(this.id));
	};
	private _OnClick(e: egret.TouchEvent) {
		ViewManager.ins().close(this);
	}

}

window["WildBossJoinWin"]=WildBossJoinWin