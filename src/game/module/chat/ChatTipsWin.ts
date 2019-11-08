class ChatTipsWin extends BaseEuiPanel {

	time = 0
	sureBtn
	cancelBtn
	checkbox
	callback
	descTF
	public constructor() {
		super()

		this.layerLevel = VIEW_LAYER_LEVEL.TOP
	}

	initUI() {
		this.skinName = "ChatTipsWinSkin"
	}
	open(...param: any[]) {
		this.addTouchEvent(this, this.onTouch, this.sureBtn)
		this.addTouchEvent(this, this.onTouch, this.cancelBtn)
		this.addTouchEvent(this, this.onTouch, this.checkbox)
		this.time = param[0],
			this.callback = param[1],
			this.update()
	}
	onTouch(t) {
		var e = GlobalConfig.ins("ChatConstConfig");
		switch (t.currentTarget) {
			case this.sureBtn:
				GameLogic.ins().actorModel.yb < e.cost ? UserTips.ins().showTips(GlobalConfig.jifengTiaoyueLg.st100014) : this.callback && this.callback()
				ViewManager.ins().close(this)
				break;
			case this.cancelBtn:
				Chat.ins().isNoShowTipsPanel = !1
				ViewManager.ins().close(this)
				break;
			case this.checkbox:
				Chat.ins().isNoShowTipsPanel = this.checkbox.selected
		}
	}
	update() {
		this.time > 0 && (TimerManager.ins().isExists(this.updateCD, this) || TimerManager.ins().doTimer(1e3, this.time, this.updateCD, this), this.show())
	}
	show() {
		var t = GlobalConfig.ins("ChatConstConfig");
		this.descTF.textFlow = TextFlowMaker.generateTextFlow1(LanguageString.jifengTiaoyueCh(GlobalConfig.jifengTiaoyueLg.st101714, [t.worldChatCd, this.time, t.cost]))
	}
	updateCD() {
		this.time--
		this.time <= 0 && (TimerManager.ins().remove(this.updateCD, this), ViewManager.ins().close(this))
		this.show()
	}
	close() {
		TimerManager.ins().remove(this.updateCD, this)
	}
}

ViewManager.ins().reg(ChatTipsWin, LayerManager.UI_Popup);

window["ChatTipsWin"] = ChatTipsWin