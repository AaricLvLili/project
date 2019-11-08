class ZhuanZhiTaskConWin extends BaseEuiPanel {
	public constructor() {
		super();
	}

	//private dialogCloseBtn:eui.Button;
	public item: ItemBase;
	public desc: eui.Label;
	public info: eui.Label;
	public btn: eui.Button;
	private config: any;
	private roldId: number;

	initUI() {
		super.initUI()
		this.skinName = "ZhuanZhiTaskConWinSkin";
		this.item.isShowName(false);

	}

	open(...param: any[]) {
		this.m_bg.init(`ZhuanZhiTaskConWin`, GlobalConfig.jifengTiaoyueLg.st101895)
		//this.dialogCloseBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this._OnClick, this);
		this.addTouchEvent(this, this.onTap, this.btn);
		this.config = param[0];
		this.roldId = param[1];
		this.desc.text = this.config.desc;

		var vaule: number = 0;
		if (MoneyConst.gold == this.config.param) {
			vaule = GameLogic.ins().actorModel.gold;
			this.item.data = { id: this.config.param, type: 0 };
		}
		else if (MoneyConst.yuanbao == this.config.param) {
			vaule = GameLogic.ins().actorModel.yb;
			this.item.data = { id: this.config.param, type: 0 };
		}
		else {
			vaule = UserBag.ins().getBagGoodsCountById(0, this.config.param);
			this.item.data = this.config.param;
		}

		this.info.text = GlobalConfig.jifengTiaoyueLg.st101894 + vaule;
		this.btn.enabled = vaule >= this.config.target;
	}

	close() {
		//this.dialogCloseBtn.removeEventListener(egret.TouchEvent.TOUCH_TAP, this._OnClick, this)
		this.removeEvents();
	}

	onTap(e) {
		ZhuanZhiModel.ins().sendZhuanZhiDonate(this.config.param, this.config.target, this.roldId);
		ViewManager.ins().close(ZhuanZhiTaskConWin);
	}
	private _OnClick(e: egret.TouchEvent) {
		ViewManager.ins().close(this);
	}
}

ViewManager.ins().reg(ZhuanZhiTaskConWin, LayerManager.UI_Popup);

window["ZhuanZhiTaskConWin"]=ZhuanZhiTaskConWin