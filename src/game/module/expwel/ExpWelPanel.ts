class ExpWelPanel extends BaseView implements ICommonWindowTitle {
	windowTitleIconName?: string;
	public constructor(data?: any) {
		super();
		this.name = GlobalConfig.jifengTiaoyueLg.st101259;
		this.windowTitleIconName = GlobalConfig.jifengTiaoyueLg.st101259;
		this.skinName = "ExpWelPanelSkin";
	}
	public m_TimeBar: eui.ProgressBar;
	public m_Cont: eui.Label;
	public m_AllBtn: eui.Button;
	public m_MianBtn: eui.Button;
	public m_BtnGroup: eui.Group;
	public m_TimeLab: eui.Label;

	private nowHaveId: number;

	protected childrenCreated() {
		super.childrenCreated();
		this.m_TimeBar["labelDisplay"].visible = false;
		this.m_MianBtn.label = GlobalConfig.jifengTiaoyueLg.st101266;
		this.m_AllBtn.label = GlobalConfig.jifengTiaoyueLg.st101267;
	};
	private addViewEvent() {
		OnlineRewardsModel.ins().sendExpWelExpInitMsg();
		MessageCenter.ins().addListener(MessageDef.EXPWEL_INIT_MSG, this.initData, this);
		this.m_MianBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onClickMainBtn, this);
		this.m_AllBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onClickAllBtn, this);
	}
	private removeEvent() {
		MessageCenter.ins().removeListener(MessageDef.EXPWEL_INIT_MSG, this.initData, this);
		this.m_MianBtn.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onClickMainBtn, this);
		this.m_AllBtn.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onClickAllBtn, this);
	}
	public open() {
		this.addViewEvent();
	};
	public close() {
		OnlineRewardsModel.ins().expSelectIndex = 1;
		this.removeTimer();
		this.removeEvent();
	};

	public release() {
		this.removeEvent();
	}

	private initData() {
		let config = GlobalConfig.ins("ExpWelfareConfig");
		let i = 0;
		this.nowHaveId = 0;
		let expDic = OnlineRewardsModel.ins().expDic;
		for (let key in config) {
			let expWelfareConfig = config[key];
			let child = this.m_BtnGroup.getChildAt(i);
			if (child && child instanceof ExpWelSelectIcon) {
				child.setData(expWelfareConfig);
			}
			if (expWelfareConfig.ID == OnlineRewardsModel.ins().expSelectIndex) {
				this.m_Cont.text = LanguageString.jifengTiaoyueCh(GlobalConfig.jifengTiaoyueLg.st101260, [expWelfareConfig.multiple]);
				let expDat = expDic.get(expWelfareConfig.ID);
				if (expDat && expDat.time < 0) {
					this.m_TimeLab.text = LanguageString.jifengTiaoyueCh(GlobalConfig.jifengTiaoyueLg.st101261, [expWelfareConfig.multiple, GameServer.GetSurplusTime(0)])
				} else {
					this.m_TimeLab.text = LanguageString.jifengTiaoyueCh(GlobalConfig.jifengTiaoyueLg.st101261, [expWelfareConfig.multiple, GameServer.GetSurplusTime(expWelfareConfig.multipleTime + GameServer.serverTime)])
				}

			}
			i++;
		}
		let expDatas = expDic.values;
		let isHave: boolean = false;
		for (var f = 0; f < expDatas.length; f++) {
			if (expDatas[f].time > 0) {
				isHave = true;
				this.nowHaveId = expDatas[f].id;
				break;
			}
		}
		if (isHave == true) {
			this.addTimer();
			this.m_MianBtn.enabled = false;
			this.m_AllBtn.enabled = true;
		} else {
			this.m_TimeBar.value = 0;
			this.removeTimer();
			this.m_MianBtn.enabled = true;
			this.m_AllBtn.enabled = false;
		}
	}

	private addTimer() {
		this.removeTimer();
		TimerManager.ins().doTimer(1000, 0, this.refTime, this);
		this.refTime();
	}
	private removeTimer() {
		TimerManager.ins().remove(this.refTime, this);
	}

	private refTime() {
		let config = GlobalConfig.ins("ExpWelfareConfig");
		let expWelfareConfig = config[this.nowHaveId];
		if (expWelfareConfig) {
			let expData = OnlineRewardsModel.ins().expDic.get(this.nowHaveId);
			this.m_TimeLab.text = LanguageString.jifengTiaoyueCh(GlobalConfig.jifengTiaoyueLg.st101261, [expWelfareConfig.multiple, GameServer.GetSurplusTime(expData.time)])
			let time = Math.max(0, (expData.time || 0) - GameServer.serverTime);
			if (time <= 0) {
				time = 0
				this.removeTimer();
				expData.time = -1;
				OnlineRewardsModel.ins().isHave = false;
				GameGlobal.MessageCenter.dispatch(MessageDef.EXPWEL_INIT_MSG);
			}
			this.m_TimeBar.value = expWelfareConfig.multipleTime - time;
			this.m_TimeBar.maximum = expWelfareConfig.multipleTime;
		}
	}

	private onClickMainBtn() {
		let id = OnlineRewardsModel.ins().expSelectIndex
		let expData = OnlineRewardsModel.ins().expDic.get(id)
		if (expData.time == 0) {
			OnlineRewardsModel.ins().sendExpWelExpApplyMsg(id);
		} else {
			UserTips.ins().showTips(GlobalConfig.jifengTiaoyueLg.st101262);
		}
	}

	private onClickAllBtn() {
		if (this.nowHaveId > 0) {
			let config = GlobalConfig.ins("ExpWelfareConfig");
			let expWelfareConfig = config[this.nowHaveId];
			if (expWelfareConfig) {
				let expData = OnlineRewardsModel.ins().expDic.get(this.nowHaveId);
				let time = Math.max(0, (expData.time || 0) - GameServer.serverTime);
				let needYB = Math.floor(time / 60) * expWelfareConfig.completeCost;
				let yb: number = GameLogic.ins().actorModel.yb;
				WarnWin.show(LanguageString.jifengTiaoyueCh(GlobalConfig.jifengTiaoyueLg.st101263, [needYB]), function () {
					if (yb >= needYB) {
						OnlineRewardsModel.ins().sendExpWelExpFinishMsg();
					} else {
						UserTips.ins().showTips(GlobalConfig.jifengTiaoyueLg.st100008);
					}
				}, this);
			}
		} else {
			UserTips.ins().showTips(GlobalConfig.jifengTiaoyueLg.st101264);
		}
	}


	UpdateContent(): void {

	}

	public CheckRedPoint() {
		return OnlineRewardsModel.ins().checkRedPoint();
	}
}
window["ExpWelPanel"] = ExpWelPanel