class WarOrderPanel extends BaseView implements ICommonWindowTitle {
	windowTitleIconName?: string;
	public constructor(data?: any) {
		super();
		this.name = GlobalConfig.jifengTiaoyueLg.st101386;
		this.windowTitleIconName = GlobalConfig.jifengTiaoyueLg.st102071;
		this.skinName = "WarOrderPanelSkin";
		this.touchEnabled = false;
	}

	public m_GetBtn: eui.Button;
	public m_Lan0: eui.Label;
	public m_Lan1: eui.Label;
	public m_BuyLvBtn: eui.Button;
	public m_WarOrderJinJieBtn: eui.Button;
	public m_ExpBtn: eui.Button;
	public m_LvLab: eui.Label;
	public m_ExpBar: eui.ProgressBar; 
	public m_WarOrderShowItem: WarOrderShowItem;
	public m_Lan3: eui.Label;
	public m_TimeLab: eui.Label;
	public static isFirstOpen: boolean = true;

	protected childrenCreated() {
		super.childrenCreated();
		this.m_BuyLvBtn.label = GlobalConfig.jifengTiaoyueLg.st102073;
		this.m_WarOrderJinJieBtn.label = GlobalConfig.jifengTiaoyueLg.st102074;
		this.m_Lan1.text = GlobalConfig.jifengTiaoyueLg.st102088;

	};
	private addViewEvent() {
		this.AddClick(this.m_BuyLvBtn, this.onClickBuyBtn);
		this.AddClick(this.m_WarOrderJinJieBtn, this.onClickJinJieBtn);
		this.AddClick(this.m_ExpBtn, this.onClickExpBtn);
		this.AddClick(this.m_GetBtn, this.onClickGetBtn);
		this.observe(WarOrderEvt.WARORDEREVT_DATAUPDATE_MSG, this.initData)

	}
	private removeEvent() {
	}

	public open() {
		this.addTime();
		WarOrderPanel.isFirstOpen = true;
		this.addViewEvent();
		this.initData();
	};
	public close() {
		WarOrderPanel.isFirstOpen = false;
		this.removeEvent();
		this.removeTime();
	};

	public release() {
		this.removeEvent();
		this.removeTime();
	}

	private initData() {
		let warOrderModel = WarOrderModel.getInstance;
		this.m_WarOrderShowItem.setData();
		this.m_GetBtn["redPoint"].visible = warOrderModel.checkCanGet();

		this.setTopData();
	}

	private addTime() {
		this.removeTime();
		TimerManager.ins().doTimer(1000, 0, this.playTime, this);
		this.playTime;
	}

	private removeTime() {
		TimerManager.ins().remove(this.playTime, this);
	}

	private playTime() {
		let warOrderModel = WarOrderModel.getInstance;
		let endTime = warOrderModel.endTime - GameServer.serverTime;
		this.m_TimeLab.text = DateUtils.getFormatBySecond(endTime, DateUtils.TIME_FORMAT_5, 4)
	}

	private setTopData() {
		let warOrderModel = WarOrderModel.getInstance;
		this.m_ExpBtn["redPoint"].visible = warOrderModel.checkCanGetExpBag();
		let tokenBaseConfig = GlobalConfig.ins("TokenBaseConfig")[warOrderModel.mainId];
		if (tokenBaseConfig) {
			this.m_Lan0.text = tokenBaseConfig.activityTimeTips;
		}
		this.m_LvLab.text = warOrderModel.lv + "";
		this.m_ExpBar.value = warOrderModel.exp;
		this.m_ExpBar.maximum = warOrderModel.maxExp;
	}

	private onClickBuyBtn() {
		let warOrderModel = WarOrderModel.getInstance;
		if (warOrderModel.isLvMax()) {
			UserTips.ins().showTips(GlobalConfig.jifengTiaoyueLg.st102077)
		} else {
			ViewManager.ins().open(WarOrderLvUpWin);
		}

	}
	private onClickJinJieBtn() {
		ViewManager.ins().open(WarOrderJinJieWin);
	}
	private onClickExpBtn() {
		let warOrderModel = WarOrderModel.getInstance;
		if (!warOrderModel.isUpWarOrder) {
			ViewManager.ins().open(WarOrderJinJieWin);
			return
		}
		if (warOrderModel.checkCanGetExpBag()) {
			WarOrderSproto.ins().sendGetExpBag();
		} else {
			UserTips.ins().showTips(GlobalConfig.jifengTiaoyueLg.st102076)
		}
	}
	private onClickGetBtn() {
		let warOrderModel = WarOrderModel.getInstance;
		if (warOrderModel.checkCanGet()) {
			WarOrderSproto.ins().sendGetAllAward();
		}
	}
	UpdateContent(): void { }

}
window["WarOrderPanel"] = WarOrderPanel