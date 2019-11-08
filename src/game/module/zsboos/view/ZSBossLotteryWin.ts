class ZSBossLotteryWin extends BaseEuiPanel {

	static LAYER_LEVEL = LayerManager.UI_Popup
	layerLevel = VIEW_LAYER_LEVEL.MIDDLE

	public constructor() {
		super()
	}
	bar
	point: eui.Label
	play
	giveUp
	maxPoint
	times
	goods: ItemBase
	timeLabel
	statu
	languageTxt: eui.Label;
	languageTxt0: eui.Label;
	languageTxt1: eui.Label;
	languageTxt2: eui.Label;

	initUI() {
		super.initUI()
		this.skinName = "ZSBossLotterySkin"
		this.bar.labelFunction = function () {
			return ""
		}
		this.languageTxt.text = GlobalConfig.jifengTiaoyueLg.st101578;
		this.languageTxt0.text = GlobalConfig.jifengTiaoyueLg.st101579;
		this.languageTxt1.text = GlobalConfig.jifengTiaoyueLg.st101580;
		this.languageTxt2.text = GlobalConfig.jifengTiaoyueLg.st101581;
	}

	open(...param: any[]) {
		this.maxPoint.text=GlobalConfig.jifengTiaoyueLg.st101861;
		this.m_bg.init(`ZSBossLotteryWin`, GlobalConfig.jifengTiaoyueLg.st101575)
		this.AddClick(this.play, this.onTap)
		this.AddClick(this.giveUp, this.onTap)
		MessageCenter.ins().addListener(MessageDef.ZS_BOSS_GETMY_LOTTERY_POINT, this.getMyPoint, this)
		MessageCenter.ins().addListener(MessageDef.ZS_BOSS_LOTTERY_MAX_POINT, this.getMaxPoint, this)
		this.statu = param[0] ? param[0] : 0
		this.bar.maximum = 100
		this.refushInfo()
		this.currentState = "select"
	}

	close() {
		MessageCenter.ins().removeListener(MessageDef.ZS_BOSS_GETMY_LOTTERY_POINT, this.getMyPoint, this)
		MessageCenter.ins().removeListener(MessageDef.ZS_BOSS_LOTTERY_MAX_POINT, this.getMaxPoint, this)
		TimerManager.ins().remove(this.refushBar, this)
	}

	private _OnClick(e: egret.TouchEvent) {
		ViewManager.ins().close(this);
	}

	refushInfo() {
		this.times = 0
		this.goods.data = ZsBoss.ins().lotteryItemId
		TimerManager.ins().doTimer(100, 100, this.refushBar, this, this.TimeOver, this), this.timeLabel.text = "10秒"
	}

	refushBar() {
		this.times++ , this.bar.value = 100 - this.times, this.timeLabel.text = Math.floor(10 - this.times / 10) + "秒"
	}

	TimeOver() {
		"select" == this.currentState && ViewManager.ins().close(ZSBossLotteryWin)
	}

	getMyPoint(point: number) {
		if (!point) {
			console.error("BossLottery:MyPoint Is Null!!!")
			return
		}
		this.currentState = "play"
		this.point.text = "(" + point + ")"
	}

	getMaxPoint(name: string, point: number) {
		this.maxPoint.textFlow = (new egret.HtmlTextParser).parser("<font color = '#FFB82A'>" + name + "</font>" + GlobalConfig.jifengTiaoyueLg.st101576 + "<font color = '#FFB82A'>" + point + "</font>" + GlobalConfig.jifengTiaoyueLg.st101577)
	}

	onTap(e) {
		switch (e.currentTarget) {
			case this.giveUp:
				ViewManager.ins().close(ZSBossLotteryWin);
				break;
			case this.play:
				if (this.statu == 0) {
					ZsBoss.ins().sendJoinChoujiang()
				} else if (this.statu == 1) {
					GuildWar.ins().SendLotteryStart()
				}
				// 0 == this.statu ? App.ControllerManager.applyFunc(ControllerConst.ZsBoss, ZsBossFuns.JION_CHOUJIANG) : 1 == this.statu && App.ControllerManager.applyFunc(ControllerConst.Guild, GuildFunc.REQUEST_GUILDWAR_LOTTERINFO);
				break;
		}
	}
}

window["ZSBossLotteryWin"] = ZSBossLotteryWin