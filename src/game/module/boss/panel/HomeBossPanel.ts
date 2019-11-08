class HomeBossPanel extends BaseView implements ICommonWindowTitle {
	public windowTitleIconName?: string = GlobalConfig.jifengTiaoyueLg.st100467;
	public m_HomeBoss: HomeBoss;
	public m_SurfaceGroup: eui.Group;

	private m_Scroller: eui.Scroller;
	private m_MainGroup: eui.Group;
	private m_HomeBossPanelItem1: HomeBossPanelItem;
	private m_HomeBossPanelItem2: HomeBossPanelItem;
	private m_HomeBossPanelItem3: HomeBossPanelItem;
	private hepleBtn: eui.Button;//提示帮助按钮

	public mWindowHelpId = 26;

	public constructor() {
		super();
		this.skinName = "HomeBossPanelSkin";

	}
	protected childrenCreated() {
		super.childrenCreated();
		this.initData();
		HomeBossModel.getInstance.initTypeData();

	};
	private removeEvent() {
		MessageCenter.ins().removeListener(MessageDef.HOMEBOSS_PANEL_CHANGE, this.onChangeUI, this);
		// this.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onCLick, this);
	}
	public open() {
		MessageCenter.ins().addListener(MessageDef.HOMEBOSS_PANEL_CHANGE, this.onChangeUI, this);
		// this.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onCLick, this);
		this.addTimer();
	};

	public close() {
		this.removeEvent();
		this.removeTimer();
	};
	public release() {
		this.removeEvent();
		this.removeTimer();
		this.m_HomeBoss.release();
	}

	private addTimer() {
		this.removeTimer();
		TimerManager.ins().doTimer(1000, 0, this.refTime, this);
		this.refTime();
		TimerManager.ins().doTimer(10000, 0, this.refBossData, this);
		this.refBossData();
	}
	private removeTimer() {
		TimerManager.ins().remove(this.refBossData, this);
		TimerManager.ins().remove(this.refTime, this);
	}

	private initData() {
		this.m_HomeBoss.visible = false;
		this.m_SurfaceGroup.visible = true;
		this.m_HomeBossPanelItem1.initData(HomeBossLayerType.LAYERTYPE1);
		this.m_HomeBossPanelItem2.initData(HomeBossLayerType.LAYERTYPE2);
		this.m_HomeBossPanelItem3.initData(HomeBossLayerType.LAYERTYPE3);
	}

	private onChangeUI(e) {
		this.m_HomeBoss.setData(e);
		this.m_HomeBoss.visible = true;
		this.m_SurfaceGroup.visible = false;
	}
	private refTime() {
		let homeModel = HomeBossModel.getInstance;
		let layerBossRefCD1: string = GameServer.GetSurplusTime(homeModel.layerBossRefCD1);
		let layerBossRefCD2: string = GameServer.GetSurplusTime(homeModel.layerBossRefCD2);
		let layerBossRefCD3: string = GameServer.GetSurplusTime(homeModel.layerBossRefCD3);
		let time1 = Math.max(0, (homeModel.layerBossRefCD1 || 0) - GameServer.serverTime)
		let time2 = Math.max(0, (homeModel.layerBossRefCD2 || 0) - GameServer.serverTime)
		let time3 = Math.max(0, (homeModel.layerBossRefCD3 || 0) - GameServer.serverTime)
		if (time1 <= 0) {
			if (this.m_HomeBossPanelItem1.m_NextRefTiemLab.visible) {
				this.m_HomeBossPanelItem1.m_NextRefTiemLab.visible = !this.m_HomeBossPanelItem1.m_NextRefTiemLab.visible;
				UserBoss.ins().sendGetVipBossMsg();
			}
		} else {
			if (!this.m_HomeBossPanelItem1.m_NextRefTiemLab.visible) {
				this.m_HomeBossPanelItem1.m_NextRefTiemLab.visible = !this.m_HomeBossPanelItem1.m_NextRefTiemLab.visible;
			}
			this.m_HomeBossPanelItem1.m_NextRefTiemLab.text = layerBossRefCD1;
		}
		if (time2 <= 0) {
			if (this.m_HomeBossPanelItem2.m_NextRefTiemLab.visible) {
				this.m_HomeBossPanelItem2.m_NextRefTiemLab.visible = !this.m_HomeBossPanelItem2.m_NextRefTiemLab.visible;
				UserBoss.ins().sendGetVipBossMsg();
			}
		} else {
			if (!this.m_HomeBossPanelItem2.m_NextRefTiemLab.visible) {
				this.m_HomeBossPanelItem2.m_NextRefTiemLab.visible = !this.m_HomeBossPanelItem2.m_NextRefTiemLab.visible;
			}
			this.m_HomeBossPanelItem2.m_NextRefTiemLab.text = layerBossRefCD2;
		}
		if (time3 <= 0) {
			if (this.m_HomeBossPanelItem3.m_NextRefTiemLab.visible) {
				this.m_HomeBossPanelItem3.m_NextRefTiemLab.visible = !this.m_HomeBossPanelItem3.m_NextRefTiemLab.visible;
				UserBoss.ins().sendGetVipBossMsg();
			}
		} else {
			if (!this.m_HomeBossPanelItem3.m_NextRefTiemLab.visible) {
				this.m_HomeBossPanelItem3.m_NextRefTiemLab.visible = !this.m_HomeBossPanelItem3.m_NextRefTiemLab.visible;
			}
			this.m_HomeBossPanelItem3.m_NextRefTiemLab.text = layerBossRefCD3;
		}
		let homeBoss: HomeBoss = this.m_HomeBoss;
		switch (homeBoss.homeBossLayer) {
			case HomeBossLayerType.LAYERTYPE1:
				homeBoss.refCDLab = layerBossRefCD1;
				break;
			case HomeBossLayerType.LAYERTYPE2:
				homeBoss.refCDLab = layerBossRefCD2;
				break;
			case HomeBossLayerType.LAYERTYPE3:
				homeBoss.refCDLab = layerBossRefCD3;
				break;
		}
		let battleTime: string = GameServer.GetSurplusTime(homeModel.cdJoin);
		let time4 = Math.max(0, (homeModel.cdJoin || 0) - GameServer.serverTime)
		if (time4 > 0) {
			if (!homeBoss.m_BattleTimeLab.visible) {
				homeBoss.m_BattleTimeLab.visible = !homeBoss.m_BattleTimeLab.visible;
				homeBoss.m_BattleTimeMLab.visible = homeBoss.m_BattleTimeLab.visible;
				homeBoss.m_ClearLab.visible = homeBoss.m_BattleTimeLab.visible;
			}
			homeBoss.m_BattleTimeLab.text = battleTime;
		} else {
			if (homeBoss.m_BattleTimeLab.visible) {
				homeBoss.m_BattleTimeLab.visible = !homeBoss.m_BattleTimeLab.visible;
				homeBoss.m_BattleTimeMLab.visible = homeBoss.m_BattleTimeLab.visible;
				homeBoss.m_ClearLab.visible = homeBoss.m_BattleTimeLab.visible;
			}
		}
	}

	private refBossData() {
		UserBoss.ins().sendGetVipBossMsg();
	}


	UpdateContent(): void {

	}

}

window["HomeBossPanel"] = HomeBossPanel