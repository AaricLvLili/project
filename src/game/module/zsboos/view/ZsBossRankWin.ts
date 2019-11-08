class ZsBossRankWin extends BaseEuiPanel {

	public static LAYER_LEVEL = LayerManager.UI_Popup

	private list: eui.List

	//private dialogCloseBtn:eui.Button;

	initUI() {
		super.initUI();
		this.skinName = "ZSBossJoinSkin";
		this.list.itemRenderer = WildBossJoinItem

	};

	private index: number
	open(...param: any[]) {
		this.index = param[0]
		this.m_bg.init(`ZsBossRankWin`, GlobalConfig.jifengTiaoyueLg.st101893)
		//this.dialogCloseBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this._OnClick, this);
		MessageCenter.addListener(ZsBoss.ins().postRankInfo, this.refushListInfo, this);
		ZsBoss.ins().sendRequstBossRank(this.index);
		this.refushListInfo();
	};
	close() {
		//this.dialogCloseBtn.removeEventListener(egret.TouchEvent.TOUCH_TAP, this._OnClick, this)
	};
	refushListInfo() {
		this.list.dataProvider = new eui.ArrayCollection(ZsBoss.ins().GetBossRankList(this.index));
	};
	private _OnClick(e: egret.TouchEvent) {
		ViewManager.ins().close(this);
	}
}


window["ZsBossRankWin"]=ZsBossRankWin