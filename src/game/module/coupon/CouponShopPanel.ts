class CouponShopPanel extends BaseView implements ICommonWindowTitle {
	windowTitleIconName?: string;
	public constructor(data?: any) {
		super();
		this.name = GlobalConfig.jifengTiaoyueLg.st102107;
		this.windowTitleIconName = GlobalConfig.jifengTiaoyueLg.st102107;
		this.skinName = "CouponShopPanelSkin";
		this.touchEnabled = false;
	}
	public m_List: eui.List;
	private data: eui.ArrayCollection;
	protected childrenCreated() {
		super.childrenCreated();
		this.data = new eui.ArrayCollection();
		this.m_List.itemRenderer = CouponShopItem;
		this.m_List.dataProvider = this.data;
	};
	private addViewEvent() {
		this.observe(CouponEvt.COUPON_SHOP_MSG, this.initData)
	}
	private removeEvent() {
	}

	public open() {
		this.addViewEvent();
		this.initData();
	};
	public close() {
		this.removeEvent();
	};

	public release() {
		this.removeEvent();
	}

	private initData() {
		let list = [];
		let cof = GlobalConfig.ins("ticketShopConfig");
		for (let key in cof) {
			list.push(key);
		}
		this.data.replaceAll(list);
	}
	UpdateContent(): void {

	}

}
window["CouponShopPanel"] = CouponShopPanel