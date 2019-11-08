class DartCarCompleteWin extends BaseEuiPanel {

	static LAYER_LEVEL = LayerManager.UI_Popup

	public constructor() {
		super()
	}

	list
	cfg
	type
	rewardDesc
	loseNum
	typeImg
	noDesc

	doubleRewardText: eui.Label
	//private dialogCloseBtn:eui.Button;
	public sureBtn: eui.Button;
	public m_Lan1: eui.Label;

	initUI() {
		super.initUI()
		this.skinName = "DartCarCompleteWinSkin";
		this.list.itemRenderer = DartCarCompleteItem;
		this.sureBtn.label = GlobalConfig.jifengTiaoyueLg.st100004;
		this.noDesc.text = GlobalConfig.jifengTiaoyueLg.st101834;
		this.m_Lan1.text = GlobalConfig.jifengTiaoyueLg.st101835;
	}

	open() {
		this.m_bg.init(`DartCarCompleteWin`, GlobalConfig.jifengTiaoyueLg.st101724)
		//this.dialogCloseBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this._OnClick, this);
		for (var e = [], t = 0; t < arguments.length; t++) e[t] = arguments[t];
		this.sureBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTap, this)
		this.cfg = GlobalConfig.ins("BiaoCheTypeConfig")[DartCarModel.ins().DartCarType];
		this.refushInfo()
		DartCarModel.ins().exploitStatus = MineExploitType.NONE
		DartCarModel.ins().endTime = 0
		// GameGlobal.MessageCenter.dispatch(MessageDef.REFUSHMINE_RED_INFO)
	}

	refushInfo() {
		if (this.cfg) {
			this.type.text = this.cfg.name;
			this.list.dataProvider = new eui.ArrayCollection(DartCarModel.ins().DartRobInfoList);
			var e = DartCarModel.countRewardList(DartCarModel.ins().DartCarType).concat(this.cfg.item);
			this.rewardDesc.textFlow = (new egret.HtmlTextParser).parser(DartCarCompleteWin.makeDescStr(e))
			this.loseNum.textFlow = (new egret.HtmlTextParser).parser(this.countLostStr())
			this.typeImg.source = ResDataPath.GetDartCarNameByType(this.cfg.level)
			this.noDesc.visible = DartCarModel.ins().DartRobInfoList.length <= 0
			this.doubleRewardText.visible = DartCarModel.ins().isDoubleReward;
		}
	}

	static makeDescStr(e) {
		let b: number = DartCarModel.ins().isDoubleReward ? 2 : 1;
		var t, i = "";
		for (var n in e) {
			t = e[n],
				i += 0 == t.type ? MoneyManger.MoneyConstToName(t.id) + "x" + t.count * b + "\n" : GlobalConfig.itemConfig[t.id].name + "x" + t.count * b + "\n";
		}
		return i
	}

	countLostStr() {
		var e = DartCarModel.ins().DartRobInfoList,
			t = 0;
		for (var i in e) e[i].win && ++t;
		if (0 >= t) return "";
		var n = "";
		return n += "-" + this.cfg.losegold * t + "\n", n += "-" + this.cfg.losefeats * t + "\n"
	}

	close() {
		//this.dialogCloseBtn.removeEventListener(egret.TouchEvent.TOUCH_TAP, this._OnClick, this)
		for (var e = [], t = 0; t < arguments.length; t++) e[t] = arguments[t];
		DartCarModel.ins().sendGetDartCarReward();
		ViewManager.ins().close(DartCarCompleteWin)
		this.sureBtn.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onTap, this)
	}
	private _OnClick(e: egret.TouchEvent) {
		ViewManager.ins().close(this);
	}

	onTap(e) {
		switch (e.target) {
			case this.sureBtn:
				ViewManager.ins().close(DartCarCompleteWin)
		}
	}
}
window["DartCarCompleteWin"] = DartCarCompleteWin