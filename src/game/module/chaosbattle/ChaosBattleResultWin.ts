class ChaosBattleResultWin extends BaseEuiPanel {
	public constructor() {
		super()
		this.skinName = "ChaosBattleResultWinSkin";
	}
	public m_Lan0: eui.Label;
	public m_List: eui.List;
	public m_Cont: eui.Label;
	public m_EffGroup: eui.Group;
	public m_RankList: eui.List;
	public m_Lan1: eui.Label;
	public m_Lan2: eui.Label;
	public m_MyRank: eui.Label;
	public m_MyPoint: eui.Label;
	public m_MainBtn: eui.Button;

	public rankList: eui.ArrayCollection;
	public dataList: eui.ArrayCollection;

	public award: any = [];

	public time: number = 10;

	private _mc: MovieClip;
	public createChildren() {
		super.createChildren();
		this.m_Lan0.text = GlobalConfig.jifengTiaoyueLg.st102053;
		this.m_Lan1.text = GlobalConfig.jifengTiaoyueLg.st100403;
		this.m_Lan2.text = GlobalConfig.jifengTiaoyueLg.st100060;
		this.m_RankList.itemRenderer = ChaosBattleResultItem;
		this.rankList = new eui.ArrayCollection();
		this.m_RankList.dataProvider = this.rankList;

		this.m_List.itemRenderer = ItemBase;
		this.dataList = new eui.ArrayCollection();
		this.m_List.dataProvider = this.dataList;

	}
	initUI() {
		super.initUI();
	}
	open(...param: any[]) {
		ChaosBattleSproto.ins().sendRank();
		this.time = 10;
		this.award = param[0];
		this.addViewEvent();
		this.setData();
		this.addTick();
		this.playMc();
	}
	close() {
		this.removeTick();
		this.release();
		if (this._mc) {
			DisplayUtils.removeFromParent(this._mc)
			ObjectPool.ins().push(this._mc);
		}
	}
	public release() {
		this.removeViewEvent();
	}
	private addViewEvent() {
		this.AddClick(this.m_MainBtn, this.onClickClose);
		this.observe(ChaosBattleEvt.CHAOSBATTLE_DATAUPDATE_POINT, this.setData);
		this.observe(ChaosBattleEvt.CHAOSBATTLE_DATAUPDATE_MSG, this.setData);
	}
	private removeViewEvent() {
	}
	private setData() {
		let chaosBattleModel = ChaosBattleModel.getInstance;
		let rankData = [];
		for (var i = 0; i < 3; i++) {
			let data: ChaosBattleRankData = chaosBattleModel.rankDic.values[i];
			if (data) {
				rankData.push(data);
			}
		}
		this.rankList.replaceAll(rankData);
		this.dataList.replaceAll(this.award);
		this.m_MyRank.text = chaosBattleModel.myRankNum + "";
		this.m_MyPoint.text = chaosBattleModel.myPoint + "";
		this.m_Cont.text = LanguageString.jifengTiaoyueCh(GlobalConfig.jifengTiaoyueLg.st102055, [chaosBattleModel.maxLayer]);
	}

	private addTick() {
		this.removeTick();
		TimerManager.ins().doTimer(1000, 0, this.playTime, this);
		this.playTime();
	}

	private removeTick() {
		TimerManager.ins().remove(this.playTime, this);
	}

	private playTime() {
		this.m_MainBtn.label = GlobalConfig.jifengTiaoyueLg.st100962 + "(" + this.time + ")"
		this.time--;
		if (this.time <= 0) {
			this.onClickClose();
		}
	}
	public onMaskTap() {
		this.onClickClose();
	}

	private onClickClose() {
		ChaosBattleModel.getInstance.resultRelease();
		ViewManager.ins().close(this);
	}

	private playMc() {
		if (!this._mc) {
			this._mc = ObjectPool.ins().pop("MovieClip")
		}
		this._mc.loadUrl(ResDataPath.GetUIEffePath("eff_jiesuan"), true, -1)
		this.m_EffGroup.addChild(this._mc);
	}
}
ViewManager.ins().reg(ChaosBattleResultWin, LayerManager.UI_Popup);
window["ChaosBattleResultWin"] = ChaosBattleResultWin