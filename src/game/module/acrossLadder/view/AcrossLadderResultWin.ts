class AcrossLadderResultWin extends BaseEuiPanel {
	public constructor() {
		super();
	}

	public fightResultBg:FightResultPanel;
	public winOldRankLB:eui.Label;
	public winRankChangeImg:eui.Image;
	public winNewRankLB:eui.Label;
	public rewardList:eui.List;

	private seconds:number;
	
	private get closeBtn(): eui.Button {
		return this.fightResultBg["closeBtn"]
	}

	public initUI() {
		super.initUI();
		this.skinName = "AcrossLadderResultSkin";
		this.layerLevel = VIEW_LAYER_LEVEL.TOP;
		(this.closeBtn.labelDisplay as eui.Label).size = 18;
	};
	public open(...params: any[]) {
		this.rewardList.dataProvider = new eui.ArrayCollection(params[0]);
		this.winOldRankLB.text = (params[1] == 0) ? AcrossLadderPanelData.DEFAULT_RANK+"名外" : params[1];
		this.winNewRankLB.text = params[2];
		this.seconds = 5;
		this.updateCloseBtnLabel();
		TimerManager.ins().doTimer(1000, 10, this.updateCloseBtnLabel, this);
		this.closeBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTap, this);
		this.fightResultBg.SetState("win")
	};
	public close() {
		TimerManager.ins().remove(this.updateCloseBtnLabel, this);
		this.closeBtn.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onTap, this);
		if (GameMap.fubenID > 0) {
			UserFb.ins().sendExitFb();
		}
		if(!ViewManager.ins().isShow(LadderWin))
		{
			ViewManager.ins().open(LadderWin,5);
		}
	};
	private onTap() {
		ViewManager.ins().close(this);
	};
	public updateCloseBtnLabel() {
		this.seconds --;
		if (this.seconds <= 0)
			ViewManager.ins().close(this);
		this.closeBtn.label = this.closeBtn.name + "(" + this.seconds + "s)";
	}
}


ViewManager.ins().reg(AcrossLadderResultWin, LayerManager.UI_Popup);

window["AcrossLadderResultWin"]=AcrossLadderResultWin