class CouponShowWin extends BaseEuiPanel {
	public constructor() {
		super()
		this.skinName = "CouponShowWinSkin";
	}
	public m_bg: CommonPopBg;
	public m_List1: eui.List;
	public m_List2: eui.List;

	private listData1: eui.ArrayCollection = new eui.ArrayCollection();
	private listData2: eui.ArrayCollection = new eui.ArrayCollection();
	public m_Lan0: eui.Label;
	public m_Lan1: eui.Label;

	public createChildren() {
		super.createChildren();
		this.m_bg.init(`CouponShowWin`, GlobalConfig.jifengTiaoyueLg.st100431);
		this.m_List1.dataProvider = this.listData1;
		this.m_List2.dataProvider = this.listData2;
		this.m_Lan0.text = GlobalConfig.jifengTiaoyueLg.st102109;
		this.m_Lan1.text = GlobalConfig.jifengTiaoyueLg.st102110;
	}
	initUI() {
		super.initUI();
	}
	open(...param: any[]) {
		this.addViewEvent();
		this.setData();
	}
	close() {
		this.release();
	}
	public release() {
		this.removeViewEvent();
	}
	private addViewEvent() {
	}
	private removeViewEvent() {
	}
	private setData() {
		let cof = GlobalConfig.ins("ticketTreasureHuntConfig");
		if (cof.rareReward) {
			this.listData1.removeAll();
			this.listData1.replaceAll(cof.rareReward);
		}
		if (cof.otherAward) {
			this.listData2.removeAll();
			this.listData2.replaceAll(cof.otherAward);
		}
	}
}
ViewManager.ins().reg(CouponShowWin, LayerManager.UI_Popup);
window["CouponShowWin"] = CouponShowWin