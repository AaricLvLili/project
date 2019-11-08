/** 掠夺偷取提示界面*/
class MineRobWin extends BaseEuiPanel {

	static LAYER_LEVEL = LayerManager.UI_Popup
	private caiKuangConfig: any;

	public constructor() {
		super()
	}

	reward
	data: MineListInfo

	/** 掠夺按钮*/
	private rankBtn: eui.Button;
	/** 旷工雇佣者*/
	private ownName: eui.Label;
	/** 剩余掠夺次数*/
	private robNum: eui.Label;
	// mineType
	/** 雇佣者战力*/
	private ownAttr: eui.Label;
	/** 雇佣者公会*/
	// private ownGuild :eui.Label;

	/** 剩余偷取次数*/
	private stealNum: eui.Label;
	/** 偷取次数按钮*/
	private stealBtn: eui.Button;

	public headBG: eui.Image;
	public head: eui.Image;
	public m_ElementImg: eui.Image;


	//private dialogCloseBtn:eui.Button;
	initUI() {
		super.initUI()
		this.skinName = "KuangDongRobSkin"
		this.reward.itemRenderer = ItemBase

	}

	open() {
		this.m_bg.init(`MineRobWin`, GlobalConfig.jifengTiaoyueLg.st101776)
		for (var e = [], t = 0; t < arguments.length; t++) e[t] = arguments[t];
		this.data = e[0]
		//this.dialogCloseBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this._OnClick, this);
		this.rankBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTap, this);
		this.stealBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTap, this);
		this.refushInfo()
	}

	close() {

		//this.dialogCloseBtn.removeEventListener(egret.TouchEvent.TOUCH_TAP, this._OnClick, this)
		for (var e = [], t = 0; t < arguments.length; t++) e[t] = arguments[t];
		this.rankBtn.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onTap, this);
		this.stealBtn.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onTap, this);
	}
	private _OnClick(e: egret.TouchEvent) {
		ViewManager.ins().close(this);
	}

	refushInfo() {
		let kuangYuanConfig = GlobalConfig.ins("KuangYuanConfig")[this.data.type];
		if (kuangYuanConfig) {
			let showList = []
			for (var i = 0; i < kuangYuanConfig.stealaward.length; i++) {
				let showData = kuangYuanConfig.stealaward[i];
				let showListData = { type: showData.type, id: showData.id, count: showData.count };
				showList.push(showListData);
			}
			this.reward.dataProvider = new eui.ArrayCollection(showList);
		}
		// this.reward.dataProvider = new eui.ArrayCollection(MineModel.countRewardList(this.data.type, !0))
		this.ownName.text = GlobalConfig.jifengTiaoyueLg.st101777 + this.data.name
		this.ownAttr.text = GlobalConfig.jifengTiaoyueLg.st101733 + this.data.fightPow
		this.head.source = ResDataPath.GetHeadMiniImgName(this.data.job, this.data.sex);
		this.m_ElementImg.source = ResDataPath.GetElementImgName(this.data.mainEle);
		// this.ownGuild.text = "雇佣者公会：" + this.data.guildName;

		if (this.caiKuangConfig == null)
			this.caiKuangConfig = GlobalConfig.ins("CaiKuangConfig");

		var e = this.caiKuangConfig.maxrobotcount - GameGlobal.mineModel.robNum;
		this.robNum.text = GlobalConfig.jifengTiaoyueLg.st101734 + e + "/" + this.caiKuangConfig.maxrobotcount;
		var t = GameGlobal.mineModel.getCfgByType(this.data.type);
		// t && (this.mineType.text = t.name + "（可掠夺）")
		// this.commonDialog.title = t.name + "（可掠夺）";

		this.stealNum.text = GlobalConfig.jifengTiaoyueLg.st101778 + (this.caiKuangConfig.maxstealcount - MineModel.ins().stealCnt) + "/" + this.caiKuangConfig.maxstealcount;
	}

	private onTap(e) {
		var t = this;
		switch (e.target) {
			case this.rankBtn:
				if (this.data.fightPow > GameGlobal.actorModel.power) {
					WarnWin.show(GlobalConfig.jifengTiaoyueLg.st101735, function () {
						MineModel.ins().robOtherMine(t.data.acId), GameGlobal.mineModel.showType = t.data.type, ViewManager.ins().close(MineRobWin)
					}, this);
				}
				else {
					(MineModel.ins().robOtherMine(t.data.acId), GameGlobal.mineModel.showType = this.data.type, ViewManager.ins().close(MineRobWin))
				}
				break;
			case this.stealBtn:
				if ((this.data.stealcountmax - this.data.stealcount) == 0) {//已经穷的只剩下内裤了
					UserTips.ins().showTips(GlobalConfig.jifengTiaoyueLg.st101779);
					return;
				}
				//是否偷过该玩家，交给服务器判断

				WarnWin.show(GlobalConfig.jifengTiaoyueLg.st101900, function () {
					MineModel.ins().requestSteal(t.data.acId);
					ViewManager.ins().close(MineRobWin);
				}, this);
				break;
		}
	}
}
window["MineRobWin"] = MineRobWin