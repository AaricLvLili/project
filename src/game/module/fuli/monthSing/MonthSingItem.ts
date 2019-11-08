class MonthSingItem extends eui.ItemRenderer {
	public m_TouchGroup: eui.Group;
	// public m_ItemBase: ItemBase;
	public m_ItemList: eui.DataGroup;
	public m_SelectImg: eui.Image;
	public m_VipTabBgImg: eui.Image;
	public m_VipLvLab: eui.Label;
	public m_BuQingImg: eui.Image;
	public m_DoubleImg: eui.Image;
	public m_CompleGroup: eui.Group;
	public m_VipGroup: eui.Group;
	private m_ListData: eui.ArrayCollection;
	public constructor() {
		super();
	}

	protected childrenCreated() {
		super.childrenCreated();
		this.m_ItemList.itemRenderer = ItemBase;
		this.m_ListData = new eui.ArrayCollection();
		this.m_ItemList.dataProvider = this.m_ListData;
		this.m_TouchGroup.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onClick, this);
	}

	public dataChanged() {
		super.dataChanged();
		this.m_SelectImg.visible = false;
		this.m_VipGroup.visible = false;
		this.m_BuQingImg.visible = false;
		this.m_DoubleImg.visible = false;
		this.m_CompleGroup.visible = false;
		let data = this.data;
		switch (data.siganInData) {
			case SingType.SINGTYPE0:
				break;
			case SingType.SINGTYPE1:
				this.m_BuQingImg.visible = true;
				break;
			case SingType.SINGTYPE2:
				this.m_CompleGroup.visible = true;
				break;
			case SingType.SINGTYPE3:
				this.m_SelectImg.visible = true;
				break;
		}
		// if (data.doubleaReward && data.doubleaReward == 2) {
		// 	this.m_DoubleImg.visible = true;
		// }
		if (data.vipLimit) {
			this.m_VipGroup.visible = true;
			this.m_VipLvLab.text = data.vipLimit;
		}
		this.m_ListData.removeAll();
		this.m_ListData.replaceAll(data.awardList);
		egret.setTimeout(function () {
			let child = this.m_ItemList.getChildAt(0);
			if (child && child instanceof ItemBase) {
				child.count.textAlign = "right";
			}
		}, this, 100);

	}
	private onClick() {
		if (this.data.siganInData == SingType.SINGTYPE3) {
			let rsp = new Sproto.cs_activity_send_reward_request;
			rsp.id = 201
			rsp.index = this.data.singIndex;
			GameSocket.ins().Rpc(C2sProtocol.cs_activity_send_reward, rsp);
		}
		else if (this.data.siganInData == SingType.SINGTYPE1) {
			let activityData: ActivityType20Data = <ActivityType20Data>GameGlobal.activityData[201];
			if (activityData.mondCnt > 0) {
				let LoginBaseConfig: any = GlobalConfig.ins("LoginBaseConfig");
				let cont = activityData.mondAllCnt;
				let price: number = 200;
				let configPrice: number = LoginBaseConfig.supplementPrice[cont];
				if (configPrice != null) {
					price = configPrice;
				}
				WarnWin.show(LanguageString.jifengTiaoyueCh(GlobalConfig.jifengTiaoyueLg.st100007, [price]), function () {
					let yb: number = GameLogic.ins().actorModel.yb;
					let LoginBaseConfig: any = GlobalConfig.ins("LoginBaseConfig");
					let cont = activityData.mondAllCnt;
					let price: number = 200;
					let configPrice: number = LoginBaseConfig.supplementPrice[cont];
					if (configPrice != null) {
						price = configPrice;
					}
					if (yb >= price) {
						let rsp = new Sproto.cs_mond_Sign_send_reward_request;
						rsp.id = 201
						rsp.index = this.data.singIndex;
						GameSocket.ins().Rpc(C2sProtocol.cs_mond_Sign_send_reward, rsp);
					} else {
						UserTips.ins().showTips(GlobalConfig.jifengTiaoyueLg.st100008);
					}
				}, this);
			} else {
				UserTips.ins().showTips(GlobalConfig.jifengTiaoyueLg.st100009);
			}
		} else {
			UserTips.ins().showTips(GlobalConfig.jifengTiaoyueLg.st100010);
		}

	}

}

enum SingType {
	/**未达成 */
	SINGTYPE0 = 0,
	/**可签到 */
	SINGTYPE1 = 1,
	/**已签到 */
	SINGTYPE2 = 2,
	/**今天的签到 */
	SINGTYPE3 = 3,
}
window["MonthSingItem"] = MonthSingItem