class ClimbResultWin extends BaseEuiPanel {
	public static LAYER_LEVEL = LayerManager.UI_Popup

	private list0: eui.List
	private list1: eui.List
	private nextLabel: eui.Label
	private exitBtn: eui.Button
	private fightResultBg: FightResultPanel
	public award_label: eui.Label;

	private get closeBtn(): eui.Button {
		return this.fightResultBg["closeBtn"]
	}
	private m_Time: number
	private m_CloseFunc: Function
	private m_HasNext = true

	private type: ClimbType;

	public constructor() {
		super()

		this.skinName = "ChallengeResultSkin";
		this.award_label.text = GlobalConfig.jifengTiaoyueLg.st101297;
		this.list0.itemRenderer = ItemBase
		this.list1.itemRenderer = ItemBase
		this.nextLabel.text=GlobalConfig.jifengTiaoyueLg.st101837;
		this.exitBtn.label=GlobalConfig.jifengTiaoyueLg.st100962;
	}

	public open(...param: any[]) {
		this.m_CloseFunc = param[0];
		let type = param[1];
		this.fightResultBg.SetState("win")
		this.AddClick(this.exitBtn, this._OnClick)
		this.AddClick(this.closeBtn, this._ContinueChallenge)
		let climbModel = ClimbTowerModel.getInstance;
		let isNext: boolean = true;
		let config1;
		this.type = type;
		switch (type) {
			case ClimbType.PET:
				let config0 = GlobalConfig.ins("PetTowerConfig")[climbModel.petBattleId];
				if (climbModel.ClimbTowerPetData) {
					if (climbModel.ClimbTowerPetData.maxlevel <= climbModel.petBattleId) {
						if (config0) {
							this.list0.dataProvider = new eui.ArrayCollection(config0.firstAward)
						}
						config1 = GlobalConfig.ins("PetTowerConfig")[climbModel.petBattleId + 1];
						isNext = climbModel.getIsBattle(climbModel.ClimbTowerPetData.pass, climbModel.petBattleId + 1);
						if (config1) {
							this.list1.dataProvider = new eui.ArrayCollection(config1.firstAward)
						}
					} else {
						if (config0) {
							this.list0.dataProvider = new eui.ArrayCollection(config0.sweepAward)
						}
						config1 = GlobalConfig.ins("PetTowerConfig")[climbModel.petBattleId + 1];
						isNext = climbModel.getIsBattle(climbModel.ClimbTowerPetData.pass, climbModel.petBattleId + 1);
						if (config1) {
							this.list1.dataProvider = new eui.ArrayCollection(config1.sweepAward)
						}
					}
				} else {
					this.list1.dataProvider = new eui.ArrayCollection([]);
				}

				break;
			case ClimbType.MOUNT:
				if (climbModel.ClimbTowerMountData) {
					let config = GlobalConfig.ins("MountsTowerConfig")[climbModel.mountBattleId];
					if (config) {
						this.list0.dataProvider = new eui.ArrayCollection(config.sweepAward)
					}
					config1 = GlobalConfig.ins("MountsTowerConfig")[climbModel.mountBattleId + 1];
					isNext = climbModel.getIsBattle(climbModel.ClimbTowerMountData.pass, climbModel.mountBattleId + 1);
					if (config1) {
						this.list1.dataProvider = new eui.ArrayCollection(config1.sweepAward)
					}
				}
				else {
					this.list1.dataProvider = new eui.ArrayCollection([]);
				}
				break;
			default:
				this.award_label.text = GlobalConfig.jifengTiaoyueLg.st101500
				isNext = false;
				this.list0.dataProvider = new eui.ArrayCollection(climbModel.reward);
				break;
		}
		if (config1 && isNext) {
			this.closeBtn.x = 95
			this.closeBtn.name = GlobalConfig.jifengTiaoyueLg.st101602;
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

	public onMaskTap(): void {
	}

	private _OnClick() {
		if (this.type == ClimbType.PET || this.type == ClimbType.MOUNT) {
			UserFb.ins().sendExitFb();
		}
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
			let climbModel = ClimbTowerModel.getInstance;
			switch (this.type) {
				case ClimbType.PET:
					let petTowerConfig = GlobalConfig.ins("PetTowerConfig")[climbModel.petBattleId + 1];
					if (petTowerConfig.zsLv > 0) {
						if (petTowerConfig.zsLv > GameLogic.ins().actorModel.zsLv) {
							UserFb.ins().sendExitFb();
							UserTips.ins().showTips(GlobalConfig.jifengTiaoyueLg.st100219);
							return;
						}
					} else {
						if (petTowerConfig.lv > GameLogic.ins().actorModel.level) {
							UserFb.ins().sendExitFb();
							UserTips.ins().showTips(GlobalConfig.jifengTiaoyueLg.st100220);
							return;
						}
					}
					ClimbTowerSproto.ins().sendTowerEnter(ClimbType.PET, climbModel.petBattleId + 1);
					break;
				case ClimbType.MOUNT:
					let mountsTowerConfig = GlobalConfig.ins("MountsTowerConfig")[climbModel.mountBattleId + 1];
					if (mountsTowerConfig.zsLv > 0) {
						if (mountsTowerConfig.zsLv > GameLogic.ins().actorModel.zsLv) {
							UserFb.ins().sendExitFb();
							UserTips.ins().showTips(GlobalConfig.jifengTiaoyueLg.st100219);
							return;
						}
					} else {
						if (mountsTowerConfig.lv > GameLogic.ins().actorModel.level) {
							UserFb.ins().sendExitFb();
							UserTips.ins().showTips(GlobalConfig.jifengTiaoyueLg.st100220);
							return;
						}
					}
					ClimbTowerSproto.ins().sendTowerEnter(ClimbType.MOUNT, climbModel.mountBattleId + 1);
					break;
			}
		} else {
			this._OnClick()
		}
	}
}
window["ClimbResultWin"] = ClimbResultWin