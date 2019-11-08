class YbTurntableWin extends BaseEuiPanel implements ICommonWindow, ICommonWindowTitle {

	// 定义view对象的层级
	public static LAYER_LEVEL = LayerManager.UI_Main
	windowTitleIconName = GlobalConfig.jifengTiaoyueLg.st101079;
	public constructor() {
		super()
		this.skinName = "YbTurntableView"
		this.btn_start.m_Lan1.text = GlobalConfig.jifengTiaoyueLg.st101078
		this.m_Lan1.text = GlobalConfig.jifengTiaoyueLg.st100025;
		this.label_remainTime0.text = GlobalConfig.jifengTiaoyueLg.st101087;
	}

	btn_start
	label_needCharge
	label_needChargeBg
	label_remainTime
	public img_level: eui.Label;
	price_cost
	label_record
	scroller_record
	group_table
	rewardEff: MovieClip
	redPoint
	group_rewardEff

	private m_RollUpdate = true

	private commonWindowBg: CommonWindowBg
	public m_Lan1: eui.Label;
	public label_remainTime0: eui.Label;


	open() {
		for (var e = [], t = 0; t < arguments.length; t++) e[t] = arguments[t];
		this.commonWindowBg.OnAdded(this)
		this.btn_start.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTap, this)
		GameGlobal.MessageCenter.addListener(MessageDef.YB_TURNTABLE_UPDATE, this.update, this)
		GameGlobal.MessageCenter.addListener(MessageDef.YBTURNTABLE_START, this.onRollStart, this)
		GameGlobal.MessageCenter.addListener(MessageDef.YBTURNTABLE_RECORD_MSG, this.updateRecord, this)
		this.onRollReset()
		this.update()
		this.updateRecord()
		// GameGlobal.ybTurntableModel.isBuyed && YbTurntableModel.ins().sendRollStart(GameGlobal.ybTurntableModel.activityId),
		YbTurntableModel.ins().sendGetInfo(GameGlobal.ybTurntableModel.activityId);
	}

	close() {
		for (var e = [], t = 0; t < arguments.length; t++) e[t] = arguments[t];
		this.btn_start.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onTap, this)
		GameGlobal.MessageCenter.removeListener(MessageDef.YBTURNTABLE_START, this.onRollStart, this)
		GameGlobal.MessageCenter.removeListener(MessageDef.YBTURNTABLE_RECORD_MSG, this.updateRecord, this)
		GameGlobal.MessageCenter.removeListener(MessageDef.YB_TURNTABLE_UPDATE, this.update, this);
		this.commonWindowBg.OnRemoved();
	}

	update() {
		if (!this.m_RollUpdate) {
			return true
		}
		var e = GameGlobal.ybTurntableModel.remainTime(),
			t = Math.floor(e / 86400),
			i = Math.floor(e % 86400 / 3600),
			n = Math.floor(e % 3600 / 60);
		this.label_remainTime.text = LanguageString.jifengTiaoyueCh(GlobalConfig.jifengTiaoyueLg.st101080, [t, i, n]);
		this.img_level.text = LanguageString.jifengTiaoyueCh(GlobalConfig.jifengTiaoyueLg.st101081, [Math.min(GameGlobal.ybTurntableModel.level, GameGlobal.ybTurntableModel.maxLevel)]);
		for (var config = GameGlobal.ybTurntableModel.config, i = 0; i < config.info.length; i++) {
			var s = config.info[i],
				a = config.info1[i],
				imgRate = this["img_rate_" + i],
				img = this["img_" + i];
			s && a && (imgRate && (imgRate.text = LanguageString.jifengTiaoyueCh(GlobalConfig.jifengTiaoyueLg.st101082, [s.multiple])),
				img && (img.source = a.img + "_png"))
		}
		if (this.price_cost.price = config.yuanBao, GameGlobal.ybTurntableModel.level > GameGlobal.ybTurntableModel.maxLevel) this.label_needCharge.text = GlobalConfig.jifengTiaoyueLg.st101083, this.label_needCharge.textColor = 4313895;
		else {
			var p = config.recharge - GameGlobal.ybTurntableModel.chargeRecord;
			this.label_needCharge.text = p > 0 ? LanguageString.jifengTiaoyueCh(GlobalConfig.jifengTiaoyueLg.st101084, [p]) : GlobalConfig.jifengTiaoyueLg.st101085, this.label_needCharge.textColor = p > 0 ? Color.Black : Color.Yellow
			// if (p > 0) {
			// 	this.label_needCharge.text = p
			// }			
			// this.label_needCharge.visible = p > 0
			// this.label_needChargeBg.visible = p > 0
		}
		GameGlobal.ybTurntableModel.level > GameGlobal.ybTurntableModel.maxLevel || GameGlobal.ybTurntableModel.chargeRecord < config.recharge || config.yuanBao > parseInt(GameGlobal.actorModel.yb + "") ? this.redPoint.visible = !1 : this.redPoint.visible = !0
	}

	updateRecord() {
		for (var e = "", t = 0, i = GameGlobal.ybTurntableModel.msgList; t < i.length; t++) {
			var n = i[t];
			e += n, GameGlobal.ybTurntableModel.msgList.indexOf(n) < GameGlobal.ybTurntableModel.msgList.length - 1 && (e += "\n")
		}
		var r = new egret.HtmlTextParser;
		this.label_record.textFlow = r.parser(e);
		if (this.scroller_record && this.scroller_record.viewport) {
			this.scroller_record.viewport.scrollV = Math.max(this.label_record.height - this.scroller_record.height + 10, 0)
		}

	}

	onTap(e) {
		switch (e.currentTarget) {
			case this.btn_start:
				this.onBtnStartTouchTap()
		}
	}
	UpdateContent(): void {

	}
	onRollReset() {
		this.m_RollUpdate = true
		egret.Tween.removeTweens(this.group_table), this.group_table.rotation = 0, this.group_table.scaleX = this.group_table.scaleY = 1, this.rewardEff && (this.rewardEff.visible = !1)
	}

	onRollStart(e) {
		e ? (this.onRollReset(), this.btn_start.touchEnabled = !1, egret.Tween.get(this.group_table).to({
			rotation: -1440
		}, 1200, egret.Ease.quartIn).to({
			rotation: -1 * (2160 + 45 * (e - 1))
		}, 3600, egret.Ease.quartOut).call(this.onRollStop, this)) : egret.log("转盘index为空")
	}

	onRollStop() {
		egret.Tween.removeTweens(this.group_table);
		var e = this;
		null == this.rewardEff && (this.rewardEff = new MovieClip, this.group_rewardEff.addChild(this.rewardEff), this.rewardEff.loadUrl(ResDataPath.GetUIEffePath("eff_turntable_result"), !0, -1))
		this.rewardEff.visible = !0
		//   YbTurntableModel.ins().sendRollFinish(GameGlobal.ybTurntableModel.activityId)
		this.m_RollUpdate = false
		YbTurntableModel.ins().sendGetInfo(GameGlobal.ybTurntableModel.activityId)
		TimerManager.ins().doTimer(3e3, 1, function () {
			e.onRollReset(), e.update(), egret.Tween.get(e.group_table).to({
				scaleX: 0,
				scaleY: 0
			}, 200).to({
				scaleX: 1,
				scaleY: 1
			}, 200).call(() => {
				egret.Tween.removeTweens(e.group_table)
			}), e.btn_start.touchEnabled = !0
		}, this)
	}

	onBtnStartTouchTap() {
		var config = GameGlobal.ybTurntableModel.config;
		if (GameGlobal.ybTurntableModel.level > GameGlobal.ybTurntableModel.maxLevel) {
			UserTips.ins().showTips(GlobalConfig.jifengTiaoyueLg.st101086)
			return
		}
		if (GameGlobal.ybTurntableModel.chargeRecord < config.recharge) {
			Checker.YunbaoTip(this.label_needCharge.text);
			return
		}
		if (!Checker.Money(MoneyConst.yuanbao, config.yuanBao, Checker.YUNBAO_FRAME)) {
			return
		}
		// if (GameGlobal.ybTurntableModel.isBuyed) {
		// 	UserTips.ins().showTips("轮盘转动中，请稍后")
		// } else {
		this.redPoint.visible = false
		YbTurntableModel.ins().sendRollStart(GameGlobal.ybTurntableModel.activityId)
		// }
	}

	OnBackClick(clickType: number): number {
		return 0
	}
	OnOpenIndex(openIndex: number): boolean {
		return true
	}
}
window["YbTurntableWin"] = YbTurntableWin