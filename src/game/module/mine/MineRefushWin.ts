class MineRefushWin extends BaseEuiPanel implements ICommonWindow {

	static LAYER_LEVEL = LayerManager.UI_Main

	get yuanbaoNum(): number {
		return MineModel.ins().refreshCost
	}

	itemCount = 0

	data
	private list: eui.List;
	starBtn
	refushBtn
	openNum
	// yuanbao
	costNum
	selectItem
	private bar: eui.ProgressBar

	private commonWindowBg: CommonWindowBg;
	private caiKuangConfig: any;

	private static isTips: boolean = false;
	public m_Lan1: eui.Label;
	public m_Lan2: eui.Label;

	public constructor() {
		super()
	}

	initUI() {
		super.initUI()
		this.skinName = "KuangDongUpdataSkin"
		this.list.itemRenderer = MineItemRenderer
		this.list.dataProvider = new eui.ArrayCollection([])
		this.bar.labelDisplay.visible = false;

		this.refushBtn.label = GlobalConfig.jifengTiaoyueLg.st100842;
		this.starBtn.label = GlobalConfig.jifengTiaoyueLg.st100864;
		this.m_Lan1.text = GlobalConfig.jifengTiaoyueLg.st100840;
		this.m_Lan2.text = GlobalConfig.jifengTiaoyueLg.st100841;
	}

	open() {
		this.commonWindowBg.OnAdded(this);
		this.starBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTap, this)
		this.refushBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTap, this)
		GameGlobal.MessageCenter.addListener(MessageDef.REFUSH_MINE_SUCCESS, this.setSelectItem, this)
		GameGlobal.MessageCenter.addListener(MessageDef.FUBEN_CHANGE, MineRefushWin.mapChange, this)
		GameGlobal.MessageCenter.addListener(MessageDef.MINE_STATU_CHANGE, this.refreshBar, this)
		GameGlobal.MessageCenter.addListener(MessageDef.REFUSH_MINE_SUCCESS, this.refreshBar, this)
		this.refushList()
		this.refreshBar()
	}


	refushList() {
		if (!this.data) {
			this.data = [];
			var e = GlobalConfig.ins("KuangYuanConfig");
			for (var t in e) this.data.push(e[t])
		}
		this.list.dataProvider = new eui.ArrayCollection(this.data);

		if (this.caiKuangConfig == null)
			this.caiKuangConfig = GlobalConfig.ins("CaiKuangConfig");
		var i = this.caiKuangConfig.maxcaikuangcount - GameGlobal.mineModel.exploitCnt;
		this.openNum.text = GlobalConfig.jifengTiaoyueLg.st100861 + i + "/" + this.caiKuangConfig.maxcaikuangcount, TimerManager.ins().doTimer(200, 1, this.setSelectItem, this)
	}

	setSelectItem() {
		if (this.caiKuangConfig == null)
			this.caiKuangConfig = GlobalConfig.ins("CaiKuangConfig");

		var e = GameGlobal.mineModel.refreshType;
		var cfg = this.caiKuangConfig.refreshkuangyuanyuanbao;
		e >= cfg.length && (e = cfg.length - 1)//, this.yuanbaoNum = cfg[e];
		var t = "",
			i = UserBag.ins().getBagGoodsById(0, this.caiKuangConfig.refreshkuangitem);
		this.itemCount = 0, i ? (this.itemCount = i.count, t = GlobalConfig.jifengTiaoyueLg.st100022 + i.itemConfig.name + "(" + i.count + "/1)") : (t = GameGlobal.actorModel.yb >= (this.yuanbaoNum) ? GlobalConfig.jifengTiaoyueLg.st100845 + this.yuanbaoNum : GlobalConfig.jifengTiaoyueLg.st100845 + "<font color = '#f87372'>" + this.yuanbaoNum + "</font>"), this.costNum.textFlow = (new egret.HtmlTextParser).parser(t);

		var indexNum = this.list.numChildren;
		var count = GameGlobal.mineModel.refreshType - 1;
		if (count >= 0 && (indexNum > count)) {
			var n = this.list.getChildAt(GameGlobal.mineModel.refreshType - 1);
			this.selectItem && (this.selectItem.sign.visible = !1, this.selectItem.selectBg.visible = !1, this.selectItem.lightBg.visible = !1)
			n && (this.selectItem = n, this.selectItem.sign.visible = !0, this.selectItem.selectBg.visible = !0, this.selectItem.lightBg.visible = !0)
		}

		UIHelper.SetBtnNormalEffe(this.starBtn, GameGlobal.mineModel.refreshType == this.data.length)
	}

	refreshBar() {
		var e = GameGlobal.mineModel.refreshType,
			t = GlobalConfig.ins("KuangYuanConfig")[e].maxTimes,
			i = GameGlobal.mineModel.refreshNum;
		//this.yuanbaoNum = GlobalConfig.ins("CaiKuangConfig").refreshkuangyuanyuanbao[e + 1]
		this.bar.maximum = t
		if (e < 5 && i != 0) {
			this.bar.value = i
		} else {
			this.bar.value = 0
		}
		//		5 > e && 0 != i ? this.bar.width = 20 + (this.barBG.width - 15) * i / (1.5 * t) : this.bar.width = 0
	}

	static mapChange() {
		ViewManager.ins().close(MineRefushWin)
	}

	close() {
		for (var e = [], i = 0; i < arguments.length; i++) e[i] = arguments[i];
		// this.closeBtn.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onTap, this), this.closeBtn0.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onTap, this)

		this.starBtn.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onTap, this), this.refushBtn.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onTap, this), GameGlobal.MessageCenter.removeListener(MessageDef.FUBEN_CHANGE, MineRefushWin.mapChange, this), GameGlobal.MessageCenter.removeListener(MessageDef.REFUSH_MINE_SUCCESS, this.setSelectItem, this), GameGlobal.MessageCenter.removeListener(MessageDef.MINE_STATU_CHANGE, this.refreshBar, this), GameGlobal.MessageCenter.removeListener(MessageDef.REFUSH_MINE_SUCCESS, this.refreshBar, this)

		//  this.btnEff.stop(), DisplayUtils.removeFromParent(this.btnEff)
	}

	onTap(e) {
		switch (e.target) {
			case this.starBtn:
				var t = GameGlobal.mineModel.getFreshCfgByType(),
					i = t ? t.name : "";
				GameGlobal.mineModel.refreshType < this.data.length ? WarnWin.show(LanguageString.jifengTiaoyueCh(GlobalConfig.jifengTiaoyueLg.st100862, [i]), function () {
					// MineModel.ins().reportMineInfo(3)
					MineModel.ins().reportMineInfo(MineReportType.SURE_MINE)
				}, this) : MineModel.ins().reportMineInfo(MineReportType.SURE_MINE)
				break;
			case this.refushBtn:
				if (GameGlobal.mineModel.refreshType == this.data.length) {
					return UserTips.ins().showTips(GlobalConfig.jifengTiaoyueLg.st100863);
				}
				if (this.yuanbaoNum > 0 && this.itemCount <= 0 && MineRefushWin.isTips == false) {
					WarnWin.show(LanguageString.jifengTiaoyueCh(GlobalConfig.jifengTiaoyueLg.st100848, [this.yuanbaoNum]), function () {
						MineRefushWin.isTips = true;
						GameGlobal.actorModel.yb >= (this.yuanbaoNum) || this.itemCount > 0 ? MineModel.ins().reportMineInfo(MineReportType.UPGRADE) : UserTips.ins().showTips(GlobalConfig.jifengTiaoyueLg.st100008)
					}, this)
				} else {
					GameGlobal.actorModel.yb >= (this.yuanbaoNum) || this.itemCount > 0 ? MineModel.ins().reportMineInfo(MineReportType.UPGRADE) : UserTips.ins().showTips(GlobalConfig.jifengTiaoyueLg.st100008)
				}
				break;

		}
	}

	OnBackClick(clickType: number): number { return 0; }

	OnOpenIndex(openIndex: number): boolean { return true }
}
window["MineRefushWin"] = MineRefushWin