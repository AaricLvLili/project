class ChaosBattleAwardWin extends BaseEuiPanel {
	public constructor() {
		super()
		this.skinName = "ChaosBattleAwardWinSkin";
	}
	public m_bg: CommonPopBg;
	public m_GetPlayer: eui.Label;
	public m_Time: eui.Label;
	public m_Cont: eui.Label;
	public m_ItemBase: ItemBase;
	public m_Name: eui.Label;

	private type: number = 1;
	public createChildren() {
		super.createChildren();
		let la = GlobalConfig.jifengTiaoyueLg
		this.m_bg.init(`ChaosBattleAwardWin`, la.st102033);
		this.m_GetPlayer.text = la.st102029;
		this.m_bg.closeButtomBtn.visible = false;
	}
	initUI() {
		super.initUI();
	}
	open(...param: any[]) {
		this.type = param[0];
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
	}
	private removeViewEvent() {
	}
	private setData() {
		let la = GlobalConfig.jifengTiaoyueLg
		let chaosBattleModel = ChaosBattleModel.getInstance;
		switch (this.type) {
			case 1:
				this.m_bg.txtTitle.text = la.st102033;
				this.m_Cont.text = la.st102031;
				if (chaosBattleModel.firstTopPlayer) {
					this.m_Name.text = chaosBattleModel.firstTopPlayer;
				} else {
					this.m_Name.text = la.st102035;
				}
				let extraAward = GlobalConfig.ins("CompetitionConst").extraAward;
				this.m_ItemBase.data = extraAward[0];
				this.m_ItemBase.dataChanged();
				break;
			default:
				this.m_bg.txtTitle.text = la.st102034; 
				this.m_Cont.text = la.st102032;
				if (chaosBattleModel.firstTopKillBoss) {
					this.m_Name.text = chaosBattleModel.firstTopKillBoss;
				} else {
					this.m_Name.text = la.st101034;
				}
				let specialAward = GlobalConfig.ins("CompetitionConst").specialAward;
				this.m_ItemBase.data = specialAward[0];
				this.m_ItemBase.dataChanged();
				break;
		}
		this.playTime();
	}

	public playTime() {
		this.m_Time.text = GlobalConfig.jifengTiaoyueLg.st102030 + DateUtils.GetFormatSecond(ChaosBattleModel.getInstance.endTime - GameServer.serverTime, DateUtils.TIME_FORMAT_1)
	}

	private onClickClose() {
		ViewManager.ins().close(this);
	}


}
ViewManager.ins().reg(ChaosBattleAwardWin, LayerManager.UI_Popup);
window["ChaosBattleAwardWin"] = ChaosBattleAwardWin