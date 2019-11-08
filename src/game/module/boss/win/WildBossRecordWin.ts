class WildBossRecordWin extends BaseEuiPanel {
	public constructor() {
		super();
	}
	public static LAYER_LEVEL = LayerManager.UI_Popup

	private list: eui.List

	//private dialogCloseBtn:eui.Button;

	private id: number
	initUI() {
		super.initUI()
		this.skinName = "WildBossRecordSkin";
		this.list.itemRenderer = WildBossJoinItem;

	};

	open(...param: any[]) {
		this.m_bg.init(`WildBossRecordWin`,GlobalConfig.jifengTiaoyueLg.st101695)
		this.id = param[0]
		//this.dialogCloseBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this._OnClick, this);
		UserBoss.ins().sendChallengeRecord(this.id);

		this.observe(MessageDef.PUBLIC_BOSS_RECORD_UPDATE, this.updateRank);

	};
	close() {
		//this.dialogCloseBtn.removeEventListener(egret.TouchEvent.TOUCH_TAP, this._OnClick, this)
	};
	private _OnClick(e: egret.TouchEvent) {
		ViewManager.ins().close(this);
	}
	updateRank() {
		this.list.dataProvider = new eui.ArrayCollection(UserBoss.ins().GetRecordData(this.id))
	};

}

window["WildBossRecordWin"]=WildBossRecordWin