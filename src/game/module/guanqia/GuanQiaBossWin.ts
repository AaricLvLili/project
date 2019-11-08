class GuanQiaBossWin extends BaseEuiPanel {
	public constructor() {
		super()
		this.skinName = "GuanQiaBossWinSkin";
	}
	public m_TabBar: eui.List;
	public m_TiliLab: eui.Label;
	public m_TimeLab: eui.Label;
	public m_GetTiliLab: eui.Label;
	public m_Scroller: eui.Scroller;
	public m_List: eui.List;

	public static groupId: number = 1;

	public listData: eui.ArrayCollection;

	public tabData: eui.ArrayCollection;
	public closeButtomGuideBtn: eui.Button;

	public createChildren() {
		super.createChildren();
		this.m_List.itemRenderer = GuanQiaBossItem;
		this.listData = new eui.ArrayCollection();
		this.m_List.dataProvider = this.listData;
		UIHelper.SetLinkStyleLabel(this.m_GetTiliLab, GlobalConfig.jifengTiaoyueLg.st100754);
		this.m_TabBar.itemRenderer = GuanQiaBossTab;
		this.tabData = new eui.ArrayCollection([1, 2, 3, 4]);
		this.m_TabBar.dataProvider = this.tabData;
		this.m_bg.init(`GuanQiaBossWin`, GlobalConfig.jifengTiaoyueLg.st100760);
	}
	initUI() {
		super.initUI();
	}
	open(...param: any[]) {
		this.closeButtomGuideBtn.visible = false;
		UserFb.ins().sendGetQuanQiaBossInit();
		this.addViewEvent();
		this.setData();
		this.checkGuide();
	}
	close() {
		this.release();
	}
	public release() {
		this.removeTick();
		this.removeViewEvent();
	}
	private addViewEvent() {
		this.m_TabBar.addEventListener(eui.ItemTapEvent.ITEM_TAP, this.onClickTabBar, this);
		this.m_GetTiliLab.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onClickGetTili, this);
		MessageCenter.ins().addListener(GuanQiaEvt.GUANQIA_UPDATE_MSG, this.setData, this);
		this.AddClick(this.closeButtomGuideBtn, this.onClickClose);
	}
	private removeViewEvent() {
		this.m_TabBar.removeEventListener(eui.ItemTapEvent.ITEM_TAP, this.onClickTabBar, this);
		this.m_GetTiliLab.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onClickGetTili, this);
		MessageCenter.ins().removeListener(GuanQiaEvt.GUANQIA_UPDATE_MSG, this.setData, this);
	}
	private setData() {
		let config = GlobalConfig.ins("ChaptersBossConfig")[GuanQiaBossWin.groupId];
		let data = [];
		for (let key in config) {
			let needData = { groupId: GuanQiaBossWin.groupId, mapId: config[key].mapid };
			data.push(needData);
		}
		this.listData.removeAll();
		this.listData.replaceAll(data);
		this.listData.refresh();
		let chaptersBossCommonConfig = GlobalConfig.ins("ChaptersBossCommonConfig");
		let tili = GuanQiaModel.getInstance.tiliNum;
		this.m_TiliLab.text = GlobalConfig.jifengTiaoyueLg.st100755 + "：" + tili + "/" + chaptersBossCommonConfig.maxCount;
		if (tili < chaptersBossCommonConfig.maxCount) {
			this.m_TimeLab.visible = true;
			this.addTick();
		} else {
			this.m_TimeLab.visible = false;
			this.removeTick();
		}
		this.tabData.refresh();
	}

	private addTick() {
		this.removeTick();
		TimerManager.ins().doTimer(1000, 0, this.playTime, this);
	}

	private removeTick() {
		TimerManager.ins().remove(this.playTime, this);
	}

	private playTime() {
		let time = GuanQiaModel.getInstance.time;
		let str = GameServer.GetSurplusTime(time);
		this.m_TimeLab.text = GlobalConfig.jifengTiaoyueLg.st100475 + "：（" + str + "）";
	}

	private onClickClose() {
		GuideUtils.ins().next(this.closeButtomGuideBtn)
		ViewManager.ins().close(this);
	}

	private onClickTabBar(evt: eui.ItemTapEvent) {
		GuanQiaBossWin.groupId = evt.itemIndex + 1;
		this.setData();
	}

	private onClickGetTili() {
		let guanQiaModel = GuanQiaModel.getInstance;
		let str = LanguageString.jifengTiaoyueCh(GlobalConfig.jifengTiaoyueLg.st100428, []);
		WarnWin.show("<font color='#787878'>" + GlobalConfig.jifengTiaoyueLg.st100756 +
			"<font color='#008f22'>" + guanQiaModel.buyTiliPrice + "</font>" + GlobalConfig.jifengTiaoyueLg.st100757 + "</font>\n"
			+ "<font color='#3b3b3b'>" + GlobalConfig.jifengTiaoyueLg.st100758 + "："
			+ guanQiaModel.tiliBuyNum + "/" + guanQiaModel.canBuyMaxNum + "</font>", () => {
				let yb: number = GameLogic.ins().actorModel.yb;
				if (guanQiaModel.tiliBuyNum >= guanQiaModel.canBuyMaxNum) {
					UserTips.ins().showTips(GlobalConfig.jifengTiaoyueLg.st100759);
				} else
					if (yb < guanQiaModel.buyTiliPrice) {
						UserTips.ins().showTips(GlobalConfig.jifengTiaoyueLg.st100008);
					} else {
						UserFb.ins().sendQuanQiaBuyTili();
					}
			}, this);
	}

	public checkGuide() {
		if (Setting.currStep == 4 && Setting.currPart == 10) {
			this.closeButtomGuideBtn.visible = true
			GuideUtils.ins().show(this.closeButtomGuideBtn, 10, 4);
		}
	}
}
ViewManager.ins().reg(GuanQiaBossWin, LayerManager.UI_Popup);
window["GuanQiaBossWin"] = GuanQiaBossWin