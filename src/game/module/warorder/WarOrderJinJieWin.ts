class WarOrderJinJieWin extends BaseEuiPanel {
	public constructor() {
		super()
		this.skinName = "WarOrderJinJieWinSkin";
	}
	public m_WarOrderUpBtn: eui.Button;
	public m_List1: eui.List;
	public m_List2: eui.List;
	public m_Lan1: eui.Label;
	public m_Lan2: eui.Label;
	public m_CloseBtn2: eui.Button;
	public m_UnLockLab: eui.Label;

	private listData1: eui.ArrayCollection;
	private listData2: eui.ArrayCollection;
	public groupEff: eui.Group;

	public createChildren() {
		super.createChildren();
		this.m_List1.itemRenderer = ItemBase;
		this.m_List2.itemRenderer = ItemBase;
		this.listData1 = new eui.ArrayCollection;
		this.listData2 = new eui.ArrayCollection;
		this.m_List1.dataProvider = this.listData1;
		this.m_List2.dataProvider = this.listData2;
		this.m_Lan1.text = GlobalConfig.jifengTiaoyueLg.st102078;
		this.m_Lan2.text = GlobalConfig.jifengTiaoyueLg.st102079;
		this.m_UnLockLab.text = GlobalConfig.jifengTiaoyueLg.st102080;
	}
	initUI() {
		super.initUI();
	}
	open(...param: any[]) {
		this.addViewEvent();
		this.setData();
		this.playEff();
	}
	close() {
		this.release();
	}
	public release() {
		this.removeViewEvent();
		if (this.mc) {
			DisplayUtils.dispose(this.mc);
			this.mc = null;
		}
	}
	private addViewEvent() {
		this.observe(WarOrderEvt.WARORDEREVT_DATAUPDATE_MSG, this.setData)
		this.AddClick(this.m_WarOrderUpBtn, this.onClick);
		this.AddClick(this.m_CloseBtn2, this.onMaskTap);
	}
	private removeViewEvent() {

	}

	private setData() {
		let warOrderModel = WarOrderModel.getInstance;
		let tokenBaseConfig = GlobalConfig.ins("TokenBaseConfig")[warOrderModel.mainId];
		if (tokenBaseConfig) {
			this.m_WarOrderUpBtn.label = "￥" + tokenBaseConfig.tokenPrice;
			this.listData1.replaceAll(tokenBaseConfig.extraAward);
			this.listData2.replaceAll(tokenBaseConfig.showAward);
		}
		if (warOrderModel.isUpWarOrder) {
			this.m_WarOrderUpBtn.visible = false;
			this.m_UnLockLab.visible = true;
		} else {
			this.m_WarOrderUpBtn.visible = true;
			this.m_UnLockLab.visible = false;
		}
	}

	private onClick() {
		let warOrderModel = WarOrderModel.getInstance;
		let tokenBaseConfig = GlobalConfig.ins("TokenBaseConfig")[warOrderModel.mainId];
		if (tokenBaseConfig) {
			Recharge.ins().commonTopUp(tokenBaseConfig.id, tokenBaseConfig.tokenPrice, tokenBaseConfig.payItem[0], GlobalConfig.jifengTiaoyueLg.st102071);
		}
		WarOrderSproto.ins().sendUpWarOrdetJinJie();
	}
	private mc: MovieClip;
	private playEff() {
		this.mc = ViewManager.ins().createEff(this.mc, this.groupEff, "eff_jiesuan", -1);
	}

}
ViewManager.ins().reg(WarOrderJinJieWin, LayerManager.UI_Popup);
window["WarOrderJinJieWin"] = WarOrderJinJieWin