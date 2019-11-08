class CouponPanelItem extends eui.ItemRenderer {
	public constructor() {
		super();
		this.skinName = "CouponPanelItemSkin"
	}
	public m_Cont: eui.Label;
	public m_Cont0: eui.Label;

	public dataChanged() {
		super.dataChanged();
		let id = this.data;
		let ticketBaseConfig = GlobalConfig.ins("ticketBaseConfig")[id];
		this.m_Cont.text = ticketBaseConfig.tips;
		this.m_Cont0.text = ticketBaseConfig.count;
	}
}

window["CouponPanelItem"] = CouponPanelItem