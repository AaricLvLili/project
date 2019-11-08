
class DartCarRobWin extends BaseEuiPanel {

	static LAYER_LEVEL = LayerManager.UI_Popup
	private biaoCheConfig: any;

	public constructor() {
		super()
	}

	reward
	data: DartCarListInfo

	/** 掠夺按钮*/
	private robBtn: eui.Button;
	/** 取消按钮*/
	private cancelBtn: eui.Button;

	/**商队雇佣者*/
	private ownName: eui.Label;
	/** 剩余掠夺次数*/
	private robNum: eui.Label;
	// mineType
	/** 雇佣者战力*/
	private ownAttr: eui.Label;
	/** 雇佣者公会*/
	// private ownGuild :eui.Label;
	private dialogCloseBtn: eui.Button;

	public headBG: eui.Image;
	public head: eui.Image;
	public m_ElementImg: eui.Image;


	initUI() {
		super.initUI()
		this.skinName = "DartCarRobWinSkin"
		this.reward.itemRenderer = ItemBase

	}

	open() {
		this.m_bg.init(`DartCarRobWin`, GlobalConfig.jifengTiaoyueLg.st101724)
		for (var e = [], t = 0; t < arguments.length; t++) e[t] = arguments[t];
		this.data = e[0]
		this.robBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTap, this);
		this.cancelBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTap, this);
		this.refushInfo()
	}

	close() {
		for (var e = [], t = 0; t < arguments.length; t++) e[t] = arguments[t];
		this.robBtn.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onTap, this);
		this.cancelBtn.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onTap, this);
	}

	refushInfo() {
		let biaoCheTypeConfig = GlobalConfig.ins("BiaoCheTypeConfig")[this.data.type];
		if (biaoCheTypeConfig) {
			let showList = []
			for (var i = 0; i < biaoCheTypeConfig.stealaward.length; i++) {
				let showData = biaoCheTypeConfig.stealaward[i];
				let showListData = { type: showData.type, id: showData.id, count: showData.count };
				showList.push(showListData);
			}
			this.reward.dataProvider = new eui.ArrayCollection(showList);
		}
		// this.reward.dataProvider = new eui.ArrayCollection(MineModel.countRewardList(this.data.type, !0))
		this.ownName.text = GlobalConfig.jifengTiaoyueLg.st101732 + this.data.name
		this.ownAttr.text = GlobalConfig.jifengTiaoyueLg.st101733 + CommonUtils.overLength(this.data.fightPow);
		this.head.source = ResDataPath.GetHeadMiniImgName(this.data.job, this.data.sex);
		this.m_ElementImg.source = ResDataPath.GetElementImgName(this.data.mainEle);
		// this.ownGuild.text = "雇佣者公会：" + this.data.guildName;

		if (this.biaoCheConfig == null)
			this.biaoCheConfig = GlobalConfig.ins("BiaoCheConfig");

		var e = this.biaoCheConfig.maxrobotcount - DartCarModel.ins().robNum;
		this.robNum.text = GlobalConfig.jifengTiaoyueLg.st101734 + e + "/" + this.biaoCheConfig.maxrobotcount;
	}
	private _OnClick(e: egret.TouchEvent) {
		ViewManager.ins().close(this);
	}

	private onTap(e) {
		var t = this;
		switch (e.target) {
			case this.robBtn:
				if (this.data.fightPow > GameGlobal.actorModel.power) {
					WarnWin.show(GlobalConfig.jifengTiaoyueLg.st101735, function () {
						DartCarModel.ins().sendRobDartCar(t.data.acId);
						ViewManager.ins().close(DartCarRobWin)
					}, this);
				}
				else {
					DartCarModel.ins().sendRobDartCar(t.data.acId);
					ViewManager.ins().close(DartCarRobWin)
				}
				break;
			case this.cancelBtn:
				ViewManager.ins().close(DartCarRobWin);
				break;
		}
	}
}
window["DartCarRobWin"] = DartCarRobWin