class OmGifBagWin extends BaseEuiPanel {
	public constructor() {
		super()
		this.skinName = "OmGifBagWinSkin";
	}
	public m_MainBtn: eui.Button;
	public m_Cont: eui.Label;
	public m_Lan1: eui.Label;
	public m_Lan2: eui.Label;
	public m_Num: eui.Label;
	public m_CloseTopBtn: eui.Button;
	public m_List: eui.List;
	private listData: eui.ArrayCollection;
	public m_Cont2: eui.Label;
	public m_Cont3: eui.Label;

	public createChildren() {
		super.createChildren();
		this.m_Cont.text = GlobalConfig.jifengTiaoyueLg.st101995;
		this.m_Cont2.text = GlobalConfig.jifengTiaoyueLg.st102000;
		this.m_Cont3.text = GlobalConfig.jifengTiaoyueLg.st102001;
		this.m_Lan1.text = GlobalConfig.jifengTiaoyueLg.st101996;
		this.m_Lan2.text = GlobalConfig.jifengTiaoyueLg.st101998;
		this.m_List.itemRenderer = OmGifBagItem;
		this.listData = new eui.ArrayCollection();
		this.m_List.dataProvider = this.listData;
		let data = [];
		let activitySuperiorGiftConfig = GlobalConfig.ins("ActivitySuperiorGiftConfig")[1];
		let rewards = activitySuperiorGiftConfig.rewards
		for (var i = 0; i < rewards.length; i++) {
			let rewardsData = { type: rewards[i].type, id: rewards[i].id, count: rewards[i].count, itemTips: activitySuperiorGiftConfig["itemTips" + (i + 1)] };
			data.push(rewardsData);
		}
		this.listData.replaceAll(data);
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
		this.AddClick(this.m_MainBtn, this.onClick);
		this.AddClick(this.m_CloseTopBtn, this.onClickClose);
		this.observe(OmgGifBagEvt.OMGGIFBAG_UPDATE, this.setData);
	}
	private removeViewEvent() {

	}
	private setData() {
		let needNum = UserFb.ins().guanqiaID - 1;
		if (needNum < 0) {
			needNum = 0;
		}
		this.m_Num.text = (needNum * 5) + "";
		let omGifBagModel = OmGifBagModel.getInstance;
		if (!omGifBagModel.isBuy(1)) {
			this.m_MainBtn.label = GlobalConfig.jifengTiaoyueLg.st100069;
		} else if (omGifBagModel.isCanGetAward) {
			this.m_MainBtn.label = GlobalConfig.jifengTiaoyueLg.st100004;
		} else {
			this.m_MainBtn.label = GlobalConfig.jifengTiaoyueLg.st100981;
		}
	}

	private onClick() {
		let omGifBagModel = OmGifBagModel.getInstance;
		if (!omGifBagModel.isBuy(1)) {
			let activitySuperiorGiftConfig = GlobalConfig.ins("ActivitySuperiorGiftConfig")[1];
			if (Main.isDebug) {
				OmGifBagSproto.ins().sendText(1);
			} else {
				Recharge.ins().TestOmGifBag(activitySuperiorGiftConfig);
			}
		} else if (omGifBagModel.isCanGetAward) {
			OmGifBagSproto.ins().sendGetRewar(1);
		}
	}

	public onClickClose() {
		ViewManager.ins().close(this);
	}
}
ViewManager.ins().reg(OmGifBagWin, LayerManager.UI_Popup);
window["OmGifBagWin"] = OmGifBagWin