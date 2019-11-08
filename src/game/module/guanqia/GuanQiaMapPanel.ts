class GuanQiaMapPanel extends BaseView implements ICommonWindowTitle {
	windowTitleIconName?: string;
	public constructor(data?: any) {
		super();
		this.skinName = "GuanQiaMapPanelSkin";
		this.touchEnabled = false;
	}
	public m_Scroller: eui.Scroller;
	public m_GuanQiaIconGroup: eui.Group;
	public m_BossBtn: eui.Group;
	public m_MainGroup: eui.Group;

	public iconGuide: GuanQiaMapIcon;
	private mainIcon: GuanQiaMapIcon;


	private isFirstOpen: boolean = true;

	private mapMaxHeight = 4157;
	private showHeight = 541;
	public m_StrongBtn: eui.Button;


	protected childrenCreated() {
		super.childrenCreated();
	};
	private addViewEvent() {
		this.m_BossBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onClickBoss, this);
		this.observe(UserFb.ins().postZhangJieAwardChange, this.initData);
		MessageCenter.ins().addListener(MessageDef.GUANQIA_CHANGE, this.initData, this);
		this.AddClick(this.iconGuide, this.onClickGuide);
		this.observe(GuanQiaEvt.GUANQIA_UPDATE_MSG, this.checkRedPoint);
	}
	private removeEvent() {
		this.m_BossBtn.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onClickBoss, this);
		MessageCenter.ins().removeListener(MessageDef.GUANQIA_CHANGE, this.initData, this);
	}
	public open() {
		this.iconGuide.visible = false;
		this.iconGuide.isGuide = true;
		this.addViewEvent();
		this.isFirstOpen = true;
		this.initData();
		this.checkGuide();
	};
	public close() {
		this.removeEvent();
	};

	public release() {
		this.m_Scroller.stopAnimation();
		this.removeEvent();
		let numChild = this.m_GuanQiaIconGroup.numChildren;
		for (var i = 0; i < numChild; i++) {
			let child = this.m_GuanQiaIconGroup.getChildAt(i);
			if (child instanceof GuanQiaMapIcon) {
				child.release();
			}
		}
	}

	private initData() {
		let chaptersRewardConfig = GlobalConfig.ins("ChaptersRewardConfig");
		let i = 0;
		for (let key in chaptersRewardConfig) {
			let child = this.m_GuanQiaIconGroup.getChildAt(i);
			if (child instanceof GuanQiaMapIcon) {
				child.setData(chaptersRewardConfig[key]);
				if (child.m_NowAttrImg.visible == true) {
					this.setScrollPoint(child.y);
				}
			}
			i++;
		}
		this.checkBossGuide()
		this.checkRedPoint();
	}

	private checkRedPoint() {
		this.m_StrongBtn["redPoint"].visible = GuanQiaModel.getInstance.checkSGQBossRedPoint();
	}

	private onClickBoss() {
		GuideUtils.ins().next(this.m_BossBtn)
		if (Deblocking.Check(DeblockingType.TYPE_80)) {
			ViewManager.ins().open(GuanQiaBossWin);
		}

	}

	public setScrollPoint(y: number) {
		if (this.isFirstOpen == true) {
			this.isFirstOpen = false;
			let topDistance = y - this.showHeight / 2;
			let blowDistance = y - (this.mapMaxHeight - (this.showHeight / 2));
			if (this.m_Scroller && this.m_Scroller.viewport) {
				if (topDistance <= 0) {
					this.m_Scroller.viewport.scrollV = 0;
				} else if (blowDistance >= 0) {
					this.m_Scroller.viewport.scrollV = this.mapMaxHeight - this.showHeight;
				} else {
					this.m_Scroller.viewport.scrollV = topDistance;
				}
			}

		}
	}
	private checkGuide() {
		let guanQiaModel = GuanQiaModel.getInstance;
		if (guanQiaModel.checkIsCanGoNextLayer()) {
			let dialogueSetConfig = GuanQiaModel.getInstance.guideConfig;
			if (dialogueSetConfig) {
				let mainIcon: GuanQiaMapIcon = this["icon" + GuanQiaModel.getInstance.getPoint(dialogueSetConfig)];
				this.mainIcon = mainIcon;
				this.iconGuide.setData(mainIcon.config);
				if (this.m_Scroller && this.m_Scroller.viewport) {
					this.iconGuide.y = mainIcon.y - this.m_Scroller.viewport.scrollV;
				}
				this.iconGuide.x = mainIcon.x + 15;
				this.iconGuide.visible = true;
				this.mainIcon.visible = false;
				GuideUtils.ins().show(this.iconGuide, dialogueSetConfig.groupId, 1);
			}
		}

	}

	private checkBossGuide() {
		// let guanQiaModel = GuanQiaModel.getInstance;
		// let dialogueSetConfig = GuanQiaModel.getInstance.guideConfig;
		// if (dialogueSetConfig && dialogueSetConfig.groupId == 10) {
		// 	GuideUtils.ins().show(this.m_BossBtn, dialogueSetConfig.groupId, 2)
		// }
		let dialogueSetConfig = GuanQiaModel.getInstance.guideConfig;
		if (dialogueSetConfig && dialogueSetConfig.groupId == 10) {
			let guanQiaMapWin = ViewManager.ins().getView(GuanQiaMapWin);
			if (guanQiaMapWin instanceof GuanQiaMapWin) {
				GuideUtils.ins().show(guanQiaMapWin.commonWindowBg.returnBtn, 10, 2);
			}
		}
	}


	private onClickGuide() {
		GuideUtils.ins().next(this.iconGuide);
		this.mainIcon.visible = true;
		this.iconGuide.visible = false;
	}
	UpdateContent(): void {

	}
}
window["GuanQiaMapPanel"] = GuanQiaMapPanel