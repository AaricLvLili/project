
class DrillChallengeResultWin extends BaseEuiPanel {
	public static LAYER_LEVEL = LayerManager.UI_Popup

	private list0: eui.List
	private list1: eui.List
	private nextLabel: eui.Label
	private exitBtn: eui.Button
	private fightResultBg: FightResultPanel
	private award_label: eui.Label;
	private get closeBtn(): eui.Button {
		return this.fightResultBg["closeBtn"]
	}

	private m_Time: number
	private m_CloseFunc: Function
	private m_HasNext = true

	public constructor() {
		super()

		this.skinName = "ChallengeResultSkin";

		this.list0.itemRenderer = ItemBase
		this.list1.itemRenderer = ItemBase
		this.exitBtn.label = GlobalConfig.jifengTiaoyueLg.st100962;
		this.nextLabel.text = GlobalConfig.jifengTiaoyueLg.st101837;
		this.award_label.text = GlobalConfig.jifengTiaoyueLg.st101838;
	}

	public open(...param: any[]) {
		this.m_CloseFunc = param[0];
		this.award_label.text = GlobalConfig.jifengTiaoyueLg.st100399;
		this.AddClick(this.exitBtn, this._OnClick)
		this.AddClick(this.closeBtn, this._ContinueChallenge)

		// 结算的时候id已经改变，所以这里要-1
		// let fbId = UserFb2.ins().fbChallengeId - 1
		let fbId = UserFb2.ins().fbChallengeId
		this.fightResultBg.SetState("win")

		//GlobalConfig.ins("ChallengeRoad")[(DrillModel.ins().sc_tryroad_datas.id + 1)]["award"];
		let config0 = GlobalConfig.ins("ChallengeRoad")[(DrillModel.ins().sc_tryroad_datas.id)];
		if (config0) {
			config0 = config0["award"];
		}

		if (config0)
			this.list0.dataProvider = new eui.ArrayCollection(config0)
		else
			Main.errorBack("ChallengeResultWin fbChallengeConfig = null fubenID:" + fbId);

		let config1 = GlobalConfig.ins("ChallengeRoad")[(DrillModel.ins().sc_tryroad_datas.id + 1)];
		if (config1) {
			config1 = config1["award"];
		}

		if (config1 && !Checker.Level(config1.zsLv, config1.lv)) {
			config1 = null
		}
		if (config1) {
			this.closeBtn.x = 95
			this.closeBtn.name = GlobalConfig.jifengTiaoyueLg.st101602;
			this.list1.dataProvider = new eui.ArrayCollection(config1)
		} else {
			this.list1.visible = false
			this.nextLabel.visible = false
			this.closeBtn.name = GlobalConfig.jifengTiaoyueLg.st100962;
			this.exitBtn.visible = false
			this.m_HasNext = false
		}

		this.m_Time = 5
		this._UpdateCloseBtnLabel();
		TimerManager.ins().doTimer(1000, this.m_Time, this._UpdateCloseBtnLabel, this);
	}

	public close() {
		TimerManager.ins().remove(this._UpdateCloseBtnLabel, this);
	}

	private _OnClick() {
		UserFb.ins().sendExitFb();
		ViewManager.ins().close(this)
		if (this.m_CloseFunc) {
			this.m_CloseFunc();
			this.m_CloseFunc = null;
		}
	}

	private _UpdateCloseBtnLabel() {
		if (--this.m_Time <= 0) {
			this._ContinueChallenge()
		}
		this.closeBtn.label = this.closeBtn.name + "(" + Math.max(this.m_Time, 0) + "s)";
	}

	private _ContinueChallenge() {
		if (this.m_HasNext) {
			ViewManager.ins().close(this)
			DrillModel.ins().enterCopy(DrillModel.ins().sc_tryroad_datas.id);
			//UserFb2.ins().sendChallenge();
		} else {
			this._OnClick()
		}
	}

	public onMaskTap() {

	}
}
window["DrillChallengeResultWin"] = DrillChallengeResultWin