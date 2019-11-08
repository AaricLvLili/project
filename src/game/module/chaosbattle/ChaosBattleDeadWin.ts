class ChaosBattleDeadWin extends BaseEuiPanel {
	public constructor() {
		super()
		this.skinName = "ChaosBattleDeadWinSkin";
	}
	public m_bg: CommonPopBg;
	public m_NeedItemGroup: eui.Group;
	public m_NumLab: eui.Label;
	public m_SureBtn: eui.Button;
	public m_NowBtn: eui.Button;
	public m_DeadLab: eui.Label;
	public m_Lan: eui.Label;
	public m_Lan1: eui.Label;

	public createChildren() {
		super.createChildren();
		this.m_bg.init(`ChaosBattleDeadWin`, GlobalConfig.jifengTiaoyueLg.st102022);
		let la = GlobalConfig.jifengTiaoyueLg
		this.m_SureBtn.label = la.st102024;
		this.m_NowBtn.label = la.st102025;
		this.m_Lan1.text = la.st102028;
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
		this.AddClick(this.m_SureBtn, this.onClickClose);
		this.AddClick(this.m_NowBtn, this.onClickNow);
	}
	private removeViewEvent() {
	}
	private setData() {
		let chaosBattleModel = ChaosBattleModel.getInstance;
		this.m_DeadLab.textFlow = new egret.HtmlTextParser().parser(LanguageString.jifengTiaoyueCh(GlobalConfig.jifengTiaoyueLg.st102023, [`<font color=${Color.Red}>` + chaosBattleModel.killName + "</font>"]))
		if (chaosBattleModel.nowLayer > 1) {
			this.m_Lan.text = GlobalConfig.jifengTiaoyueLg.st102027;
		} else {
			this.m_Lan.text = GlobalConfig.jifengTiaoyueLg.st102026;
		}
		let configData = GlobalConfig.ins("CompetitionConst").rebornCost
		UserBag.ins().setNeedItem(configData, this.m_NeedItemGroup);
	}

	private onClickClose() {
		ViewManager.ins().close(this);
	}

	private onClickNow() {
		let configData = GlobalConfig.ins("CompetitionConst").rebornCost;
		for (var i = 0; i < configData.length; i++) {
			let data = configData[i];
			if (data.type == 0) {
				if (data.id == 2) {
					let yb: number = GameLogic.ins().actorModel.yb;
					if (yb < data.count) {
						return UserTips.ins().showTips(GlobalConfig.jifengTiaoyueLg.st100008);
					} else {
						ChaosBattleSproto.ins().sendRevive(1);
					}
				}
			}
		}
		this.onClickClose();
	}

	public onMaskTap() {

	}



}
ViewManager.ins().reg(ChaosBattleDeadWin, LayerManager.UI_Popup);
window["ChaosBattleDeadWin"] = ChaosBattleDeadWin