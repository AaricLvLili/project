class GuanQiaTipsWin extends BaseEuiPanel {
	public constructor() {
		super()
		this.skinName = "GuanQiaTipsWinSkin";
	}

	public m_MapNameLab: eui.Label;
	public m_ConditionLab: eui.Label;
	public m_ConditionLab2: eui.Label;
	public m_ItemList: eui.List;
	public m_MainBtn: eui.Button;
	public m_CheckInLab: eui.Label;
	public m_GetLab: eui.Label;
	public id: number = 1;
	private listData: eui.ArrayCollection;
	private languageTxt: eui.Label;
	private languageTxt0: eui.Label;

	public createChildren() {
		super.createChildren();
		this.m_ItemList.itemRenderer = ItemBase;
		this.listData = new eui.ArrayCollection;
		this.m_ItemList.dataProvider = this.listData;
		this.languageTxt.text = GlobalConfig.jifengTiaoyueLg.st100750 + "：";
		this.languageTxt0.text = GlobalConfig.jifengTiaoyueLg.st100399 + "：";
		this.m_CheckInLab.text = GlobalConfig.jifengTiaoyueLg.st100751 + "...";
		this.m_GetLab.text = GlobalConfig.jifengTiaoyueLg.st100981;
		this.m_bg.init(`GuanQiaTipsWin`, GlobalConfig.jifengTiaoyueLg.st100367);
	}
	initUI() {
		super.initUI();
	}
	open(...param: any[]) {
		this.id = param[0];
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
		this.m_MainBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onClick, this);
	}
	private removeViewEvent() {
		this.m_MainBtn.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onClick, this);
	}
	private setData() {
		this.m_MainBtn.visible = false;
		this.m_CheckInLab.visible = false;
		this.m_GetLab.visible = false;
		let guanqiaID = UserFb.ins().guanqiaID;
		let [chaptersRewardConfig, isReward] = GuanQiaModel.getInstance.checkCanGetAward(this.id)
		let chaptersConfig = GlobalConfig.ins("ChaptersConfig")[guanqiaID];
		let nowChaptersRewardConfig = GlobalConfig.ins("ChaptersRewardConfig")[chaptersConfig.mapid];
		if (nowChaptersRewardConfig.needLevel == chaptersRewardConfig.needLevel && guanqiaID <= nowChaptersRewardConfig.needLevel) {
			this.m_CheckInLab.visible = true;
		} else if (isReward) {
			this.m_MainBtn.visible = true;
			this.m_MainBtn.label = GlobalConfig.jifengTiaoyueLg.st101210;//"领取";
		} else {
			if (guanqiaID > chaptersRewardConfig.needLevel) {
				this.m_GetLab.visible = true;
			} else {
				this.m_MainBtn.visible = true;
				this.m_MainBtn.label = GlobalConfig.jifengTiaoyueLg.st100040;//"确定";
			}
		}
		this.listData.replaceAll(chaptersRewardConfig.rewards);
		this.m_MapNameLab.text = chaptersRewardConfig.name;
		this.m_ConditionLab.textFlow = TextFlowMaker.generateTextFlow(chaptersRewardConfig.tips);
	}

	private onClickClose() {
		ViewManager.ins().close(this);
	}

	private onClick() {
		if (this.m_MainBtn.label == GlobalConfig.jifengTiaoyueLg.st101210) {
			UserFb.ins().sendGetAward(this.id);
			this.onClickClose();
		} else {
			this.onClickClose();
		}
	}

}
ViewManager.ins().reg(GuanQiaTipsWin, LayerManager.UI_Popup);
window["GuanQiaTipsWin"] = GuanQiaTipsWin