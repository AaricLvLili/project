class MineSettledWin extends BaseEuiPanel {

	static LAYER_LEVEL = LayerManager.UI_Popup

	public constructor() {
		super()
	}

	list
	sureBtn
	cfg
	type
	rewardDesc
	loseNum
	typeImg
	noDesc

	doubleRewardText: eui.Image

	//private dialogCloseBtn:eui.Button;
	public m_Lan1: eui.Label;

	initUI() {
		super.initUI()
		this.skinName = "KuangDongDoneSkin"
		this.list.itemRenderer = MineDoneItemrenderer;
		this.m_Lan1.text = GlobalConfig.jifengTiaoyueLg.st101835;
		this.noDesc.text = GlobalConfig.jifengTiaoyueLg.st101836;
		this.sureBtn.label = GlobalConfig.jifengTiaoyueLg.st100004;
	}

	open() {
		this.m_bg.init(`MineSettledWin`, GlobalConfig.jifengTiaoyueLg.st101901)
		//this.dialogCloseBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this._OnClick, this);
		for (var e = [], t = 0; t < arguments.length; t++) e[t] = arguments[t];
		this.sureBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTap, this)
		//this.commonDialog.dialogCloseBtn.visible=false;
		//this.commonDialog.dialogCloseBtn.touchEnabled=false;
		//this.commonDialog.dialogCloseBtn.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.commonDialog._OnClick, this)
		this.cfg = GameGlobal.mineModel.getCfgByType()
		this.refushInfo()
		GameGlobal.mineModel.exploitStatus = MineExploitType.NONE
		GameGlobal.mineModel.endTime = 0
		GameGlobal.mineModel.refushNum = 0
		GameGlobal.MessageCenter.dispatch(MessageDef.REFUSHMINE_RED_INFO)
	}

	refushInfo() {
		if (this.cfg) {
			this.type.source = "comp_74_21_0" + this.cfg.level+"_png"
			this.list.dataProvider = new eui.ArrayCollection(GameGlobal.mineModel.mineInfoList);
			var e = MineModel.countRewardList(GameGlobal.mineModel.mineType).concat(this.cfg.item);
			this.rewardDesc.textFlow = (new egret.HtmlTextParser).parser(MineSettledWin.makeDescStr(e))
			this.loseNum.textFlow = (new egret.HtmlTextParser).parser(this.countLostStr())
			this.typeImg.source = ResDataPath.GetMineNameByType(this.cfg.level)
			this.noDesc.visible = GameGlobal.mineModel.mineInfoList.length <= 0

			this.doubleRewardText.visible = MineModel.ins().isDoubleReward;
		}
	}

	private _OnClick(e: egret.TouchEvent) {
		ViewManager.ins().close(this);
	}

	static makeDescStr(e) {
		let b: number = MineModel.ins().isDoubleReward ? 2 : 1;
		var t, i = "";
		for (var n in e) {
			t = e[n],
				i += 0 == t.type ? MoneyManger.MoneyConstToName(t.id) + "x" + t.count * b + "\n" : GlobalConfig.itemConfig[t.id].name + "x" + t.count * b + "\n";
		}
		return i
	}

	countLostStr() {
		var e = GameGlobal.mineModel.mineInfoList,
			t = 0;
		for (var i in e) e[i].win && ++t;
		if (0 >= t) return "";
		var n = "";
		return n += "-" + this.cfg.losegold * t + "\n", n += "-" + this.cfg.losefeats * t + "\n"
	}

	close() {
		for (var e = [], t = 0; t < arguments.length; t++) e[t] = arguments[t];
		MineModel.ins().reportMineInfo(MineReportType.GET_REWARD)
		ViewManager.ins().close(MineSettledWin)
		this.sureBtn.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onTap, this)
		//this.dialogCloseBtn.removeEventListener(egret.TouchEvent.TOUCH_TAP, this._OnClick, this)
	}

	onTap(e) {
		switch (e.target) {
			case this.sureBtn:
				//MineModel.ins().reportMineInfo(MineReportType.GET_REWARD)
				ViewManager.ins().close(MineSettledWin)
		}
	}
}
window["MineSettledWin"] = MineSettledWin