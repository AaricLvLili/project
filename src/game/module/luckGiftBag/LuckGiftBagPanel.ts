class LuckGiftBagPanel extends BaseView implements ICommonWindowTitle {
	public m_GiftBagNameLab: eui.Label;
	public m_Scroller: eui.Scroller;
	public m_List: eui.List;
	public m_LastBuyNumLab: eui.Label;
	public m_TimeLab: eui.Label;
	public m_PriceLab: eui.Label;
	public m_BuyBtn: eui.Button;
	windowTitleIconName: string = GlobalConfig.jifengTiaoyueLg.st101761
	public m_Lan1: eui.Label;
	public m_Lan2: eui.Label;

	public configDataId: number;
	private m_luckData: Sproto.luckypackage_row;
	private m_ListData: eui.ArrayCollection;
	public constructor() {
		super();
		this.skinName = "LuckGiftPanelSkin";
		this.m_List.itemRenderer = ItemBase;
		this.m_ListData = new eui.ArrayCollection();
		this.m_List.dataProvider = this.m_ListData;
		this.m_Lan1.text = GlobalConfig.jifengTiaoyueLg.st101762;
		this.m_Lan2.text = GlobalConfig.jifengTiaoyueLg.st100025;
		this.m_BuyBtn.label = GlobalConfig.jifengTiaoyueLg.st100069;
	}
	protected childrenCreated() {
		super.childrenCreated();

	};
	private addViewEvent() {
		this.m_BuyBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onClickBuy, this);
		MessageCenter.ins().addListener(MessageDef.LUCKGIFTBAG_DATA_UPDATE, this.initData, this);
	}
	private removeEvent() {
		this.m_BuyBtn.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onClickBuy, this);
		MessageCenter.ins().removeListener(MessageDef.LUCKGIFTBAG_DATA_UPDATE, this.initData, this);
	}
	public open() {
		LuckGiftBagModel.getInstance.isModelOpen = true;
		this.initData();
		this.addTiemr();
		this.addViewEvent();
	};
	public close() {
		LuckGiftBagModel.getInstance.isModelOpen = false;
		this.removeEvent();
		this.removeTiemr();
	};

	public release() {
		this.m_Scroller.stopAnimation();
		this.removeTiemr();
		this.removeEvent();
	}

	private addTiemr() {
		this.removeTiemr();
		TimerManager.ins().doTimer(1000, 0, this.setTiem, this);
		this.setTiem();
	}

	private removeTiemr() {
		TimerManager.ins().remove(this.setTiem, this);
	}


	private initData() {
		this.m_luckData = LuckGiftBagModel.getInstance.luckGiftData.get(this.configDataId);
		let configData = GlobalConfig.ins("ActivityGiftConfig")[this.configDataId];
		if (configData && this.m_luckData) {
			this.m_ListData.removeAll();
			this.m_ListData.replaceAll(configData.showReward);
			this.m_GiftBagNameLab.text = configData.itemtName;
			this.m_PriceLab.text = configData.price + "";
			let buyNum = configData.limitTimes - this.m_luckData.num;
			this.m_LastBuyNumLab.text = buyNum + "/" + configData.limitTimes;
			if (buyNum <= 0) {
				this.m_BuyBtn.enabled = false;
				this.m_BuyBtn.label = GlobalConfig.jifengTiaoyueLg.st101342;
			}
		}

	}

	private setTiem() {
		if (this.m_luckData) {
			let tiemText: string = GameServer.GetSurplusTime(this.m_luckData.time, DateUtils.TIME_FORMAT_1);
			this.m_TimeLab.text = tiemText;
		}
	}

	private onClickBuy() {
		let getTime: number = this.m_luckData.time;
		let t = Math.max(0, (getTime || 0) - GameServer.serverTime);
		if (t <= 0) {
			UserTips.ins().showTips(GlobalConfig.jifengTiaoyueLg.st101763);
			return;
		}
		let id = this.configDataId;
		let configData = GlobalConfig.ins("ActivityGiftConfig")[id];
		if (configData) {
			WarnWin.show(LanguageString.jifengTiaoyueCh(GlobalConfig.jifengTiaoyueLg.st101764, [configData.price, configData.itemtName]), function () {
				let yb: number = GameLogic.ins().actorModel.yb;
				let t = Math.max(0, (getTime || 0) - GameServer.serverTime);
				if (t <= 0) {
					UserTips.ins().showTips(GlobalConfig.jifengTiaoyueLg.st101763);
					return;
				}
				if (configData) {
					if (yb >= configData.price) {
						ActivityModel.ins().luckypackagebuy(id);
					} else {
						UserTips.ins().showTips(GlobalConfig.jifengTiaoyueLg.st100008);
					}
				}
			}, this);
		}
	}


	UpdateContent(): void {

	}

}


window["LuckGiftBagPanel"] = LuckGiftBagPanel