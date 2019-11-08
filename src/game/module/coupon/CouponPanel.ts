class CouponPanel extends BaseView implements ICommonWindowTitle {
	windowTitleIconName?: string;
	public constructor(data?: any) {
		super();
		this.name = GlobalConfig.jifengTiaoyueLg.st102102;
		this.windowTitleIconName = GlobalConfig.jifengTiaoyueLg.st102102;
		this.skinName = "CouponPanelSkin";
		this.touchEnabled = false;
	}
	public m_Cont: eui.Label;
	public m_MainBtn: eui.Button;
	public m_List: eui.List;
	private listData: eui.ArrayCollection;
	protected childrenCreated() {
		super.childrenCreated();
		this.listData = new eui.ArrayCollection();
		this.m_List.itemRenderer = CouponPanelItem;
		this.m_List.dataProvider = this.listData;
	};
	private addViewEvent() {
		this.AddClick(this.m_MainBtn, this.onClick);
		this.observe(GameLogic.ins().postCouponChange, this.initData)
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
		let config = GlobalConfig.ins("ticketBaseConfig");
		let list = [];
		for (let key in config) {
			list.push(key);
		}
		this.listData.replaceAll(list);
		this.m_Cont.text = GlobalConfig.jifengTiaoyueLg.st102108 + GameLogic.ins().actorModel.maxCoupon;
	}
	UpdateContent(): void {

	}

	private onClick() {
		ViewManager.ins().open(ChargeFirstWin);
	}

}
window["CouponPanel"] = CouponPanel