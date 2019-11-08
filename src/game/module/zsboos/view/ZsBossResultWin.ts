class ZsBossResultWin extends BaseEuiPanel {
	public constructor() {
		super();
	}
	// closeBtn
	first
	kill
	myrank
	list
	s

	private fightResultBg: FightResultPanel
	private get closeBtn(): eui.Button {
		return this.fightResultBg["closeBtn"]
	}

	initUI() {
		super.initUI();
		this.skinName = "ZsBossResultSkin";
		this.fightResultBg.currentState = "result"
		// this.closeBtn.name = "领取奖励";
		this.layerLevel = VIEW_LAYER_LEVEL.TOP;
		(this.closeBtn.labelDisplay as eui.Label).size = 18;
	};
	open(...params: any[]) {
		this.first.text = params[0][0];
		this.kill.text = params[0][1];
		this.myrank.text = GlobalConfig.jifengTiaoyueLg.st100403+ params[0][2];
		this.list.dataProvider = new eui.ArrayCollection(params[1]);
		this.s = 10;
		this.updateCloseBtnLabel();
		TimerManager.ins().doTimer(1000, 10, this.updateCloseBtnLabel, this);
		this.AddClick(this.closeBtn, this.onTap);
		this.fightResultBg.SetState("win")
	};
	close() {
		TimerManager.ins().remove(this.updateCloseBtnLabel, this);
		// this.closeBtn.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onTap, this);
		if (GameMap.fubenID > 0) {
			UserFb.ins().sendExitFb();
		}
	};
	onTap() {
		ViewManager.ins().close(this);
	};
	updateCloseBtnLabel() {
		this.s--;
		if (this.s <= 0)
			ViewManager.ins().close(this);
		this.closeBtn.label = this.closeBtn.name + "(" + this.s + "s)";
	}
}


ViewManager.ins().reg(ZsBossResultWin, LayerManager.UI_Popup);

window["ZsBossResultWin"]=ZsBossResultWin