class MineWinInfo extends BaseView implements ICommonWindowTitle, eui.UIComponent {

	private caiKuangConfig: any;
	mineList
	model: MineModel
	paymoney
	public m_Lan1: eui.Label;

	public constructor() {
		super()
	}

	protected childrenCreated() {
		this.mineList = []
		this.name = GlobalConfig.jifengTiaoyueLg.st100851
		this.skinName = "KuangDongSkin"
		this.model = GameGlobal.mineModel
		// this.btnEff = new MovieClip
		if (this.openBtn == null)
			return;
		this.paymoney.touchEnabled = !0
		this.paymoney.textFlow = (new egret.HtmlTextParser).parser("<u>" + GlobalConfig.jifengTiaoyueLg.st100852 + "</u>")
		this.openBtn.label = GlobalConfig.jifengTiaoyueLg.st100859;
		this.m_Lan1.text = GlobalConfig.jifengTiaoyueLg.st100860;
	}

	leftBtn
	rightBtn
	openBtn: eui.Button
	vipBtn
	redPoint0
	robNum
	// timeBg2
	outTime
	timeLabel
	typeDesc
	/** 开采次数*/
	private openNum: eui.Label
	timeBg
	mapIndex
	bgImg
	/** 剩余偷取次数*/
	private stealNum: eui.Label;

	open() {
		for (var e = [], t = 0; t < arguments.length; t++) e[t] = arguments[t];

		GameGlobal.MessageCenter.addListener(MessageDef.UPDATE_MINE_LIST, this.refushMine, this)
		MineModel.ins().reportMineMapInfo(1, 1)
		GameGlobal.MessageCenter.addListener(MessageDef.MINE_STATU_CHANGE, this.refushPanelInfo, this)
		GameGlobal.MessageCenter.addListener(MessageDef.REFUSHMINE_RED_INFO, this.refushRed, this)
		this.vipBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTap, this)
		this.leftBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTap, this)
		this.rightBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTap, this)
		this.openBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTap, this)
		this.paymoney.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTap, this)
		// this.btnEff.x = this.openBtn.x + 62;
		// this.btnEff.y = this.openBtn.y + 16;
		this.refushPanelInfo()

		// this.refushMine()
	}

	close() {
		for (var e = [], t = 0; t < arguments.length; t++) e[t] = arguments[t];
		GameGlobal.MessageCenter.removeListener(MessageDef.UPDATE_MINE_LIST, this.refushMine, this);
		GameGlobal.MessageCenter.removeListener(MessageDef.MINE_STATU_CHANGE, this.refushPanelInfo, this);
		GameGlobal.MessageCenter.removeListener(MessageDef.REFUSHMINE_RED_INFO, this.refushRed, this);
		this.vipBtn.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onTap, this);
		this.leftBtn.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onTap, this);
		this.rightBtn.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onTap, this);
		this.openBtn.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onTap, this);
		this.paymoney.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onTap, this);
		// TimerManager.ins().remove(this.refushTime, this), this.btnEff.stop(), DisplayUtils.dispose(this.btnEff);
		for (var i = 0; 6 > i; i++) this.mineList[i] && this.mineList[i].destruct()
	}

	refushRed() {
		this.redPoint0.visible = GameGlobal.mineModel.robNews
	}

	public CheckRedPoint() {
		return MineModel.ins().mRedPoint.IsRed();
	}

	refushTime() {
		--this.outTime, this.timeLabel.text = this.typeDesc + DateUtils.getFormatBySecond(this.outTime, 9)
	}

	refushPanelInfo() {
		if (this.caiKuangConfig == null)
			this.caiKuangConfig = GlobalConfig.ins("CaiKuangConfig");

		this.stealNum.text = GlobalConfig.jifengTiaoyueLg.st100853 + (this.caiKuangConfig.maxstealcount - MineModel.ins().stealCnt) + "/" + this.caiKuangConfig.maxstealcount;


		var count = this.caiKuangConfig.maxrobotcount - this.model.robNum;
		count > 0
			? this.robNum.text = GlobalConfig.jifengTiaoyueLg.st100827 + count + "/" + this.caiKuangConfig.maxrobotcount
			: this.robNum.textFlow = (new egret.HtmlTextParser).parser(GlobalConfig.jifengTiaoyueLg.st100827 + "<font color = '#f87372'>" + count + "/" + this.caiKuangConfig.maxrobotcount + "</font>")

		count = this.caiKuangConfig.maxcaikuangcount - this.model.exploitCnt, count > 0
			? this.openNum.text = GlobalConfig.jifengTiaoyueLg.st100854 + count + "/" + this.caiKuangConfig.maxcaikuangcount
			: this.openNum.textFlow = (new egret.HtmlTextParser).parser(GlobalConfig.jifengTiaoyueLg.st100854 + "<font color = '#f87372'>" + count + "/" + this.caiKuangConfig.maxcaikuangcount + "</font>")
		UIHelper.SetBtnNormalEffe(this.openBtn, true)
		if (this.model.endTime > 0 && MineExploitType.EXPLOIT == this.model.exploitStatus) {
			this.timeBg.visible = !0, this.timeLabel.visible = !0;
			// var t = DateUtils.formatMiniDateTime(this.model.endTime),
			var t = this.model.endTime,
				i = this.model.getCfgByType();
			this.outTime = Math.ceil(t - GameServer.serverTime);
			//this.outTime = Math.ceil((t - GameServer.serverTime) / 1e3) + (i ? i.needtime : 0)
			//this.outTime = t;
			this.typeDesc = i.name + GlobalConfig.jifengTiaoyueLg.st100855;
			this.timeLabel.text = this.typeDesc + DateUtils.getFormatBySecond(this.outTime, 9)
			TimerManager.ins().doTimer(1e3, this.outTime, this.refushTime, this)
			UIHelper.SetBtnNormalEffe(this.openBtn, false)
			this.paymoney.visible = !0
		} else this.timeBg.visible = !1, this.timeLabel.visible = !1, this.paymoney.visible = !1, TimerManager.ins().remove(this.refushTime, this), count > 0 ? (UIHelper.SetBtnNormalEffe(this.openBtn, true)) : (UIHelper.SetBtnNormalEffe(this.openBtn, false));

		// 隐藏按钮特效 特效的名字
		MineExploitType.FINISH == this.model.exploitStatus && ViewManager.ins().open(MineSettledWin), this.refushRed()
	}

	refushMine() {
		//fightPow 战斗力
		//type 矿的种类
		//post 位置
		//this.onder();
		this.mapIndex = this.model.curIndex
		this.leftBtn.visible = this.model.curIndex > 1
		this.rightBtn.visible = this.model.curIndex <= this.model.mineMapNum - 1;
		// var e = GlobalConfig.ins("KuangDiTuConfig")[this.model.mapId];
		// e && (this.bgImg.source = e.res);//取消换成一张地图
        /*for (var t: MineListInfo, i, n: MinePeopleItem, r = this.model.mapMineList.length, o = 0; 6 > o; o++) {
		this.mineList[i]||(this.mineList[o] = new MinePeopleItem)
		 o > r - 1 
		 ?DisplayUtils.removeFromParent(this.mineList[o]) 
		 :t = this.model.mapMineList[o],n = this.mineList[o], i = this.model.countPosition(t.post), n.setMineInfo(t), n.x = i.x, n.y = i.y, this.addChild(n)
		}*/
		//if(this.model.mapMineList!=null){		  
		for (var t: MineListInfo, i, n: MinePeopleItem, r = this.model.mapMineList.length, o = 0; 6 > o; o++) {
			this.mineList[o] || (this.mineList[o] = new MinePeopleItem)
			this.mineList[o].destruct()
			o > r - 1
				? DisplayUtils.removeFromParent(this.mineList[o])
				: (t = this.model.mapMineList[o], 0 != t.acId
					? (n = this.mineList[o], i = this.model.countPosition(t.post), n.setMineInfo(t), n.x = i.x, n.y = i.y, this.addChild(n))
					: DisplayUtils.removeFromParent(this.mineList[o]))
		}

	}

	payMoneyOver() {
		if (this.caiKuangConfig == null)
			this.caiKuangConfig = GlobalConfig.ins("CaiKuangConfig");

		var e = Math.ceil(this.outTime / 60) * this.caiKuangConfig.finishyuanbao;
		if (MineModel.ins().isTipsFlag) //本次登录不需要弹确认框了
		{
			GameGlobal.actorModel.yb >= (e) ? MineModel.ins().reportMineInfo(MineReportType.QUICK_FINISH) : UserTips.ins().showTips(GlobalConfig.jifengTiaoyueLg.st100014)
		}
		else {
			let tips = LanguageString.jifengTiaoyueCh(GlobalConfig.jifengTiaoyueLg.st100856, [e]);
			WarnWin.show(tips, function () {
				MineModel.ins().isTipsFlag = true;
				GameGlobal.actorModel.yb >= (e) ? MineModel.ins().reportMineInfo(MineReportType.QUICK_FINISH) : UserTips.ins().showTips(GlobalConfig.jifengTiaoyueLg.st100014)
			}, this)
		}
	}

	onTap(e) {
		switch (e.target) {
			case this.vipBtn:
				ViewManager.ins().open(MineReportInfoWin);
				break;
			case this.leftBtn:
				--this.mapIndex, MineModel.ins().reportMineMapInfo(this.mapIndex)
				break;
			case this.rightBtn:
				++this.mapIndex, MineModel.ins().reportMineMapInfo(this.mapIndex)
				break;
			case this.openBtn:
				if (this.model.endTime > 0) return void UserTips.ins().showTips(GlobalConfig.jifengTiaoyueLg.st100857);
				if (this.caiKuangConfig == null)
					this.caiKuangConfig = GlobalConfig.ins("CaiKuangConfig");

				this.model.exploitCnt < this.caiKuangConfig.maxcaikuangcount ? ViewManager.ins().open(MineRefushWin) : UserTips.ins().showTips(GlobalConfig.jifengTiaoyueLg.st100858);
				break;
			case this.paymoney:
				this.payMoneyOver();
				break;
		}
	}

	windowTitleIconName: string = GlobalConfig.jifengTiaoyueLg.st100851;

	UpdateContent(): void {

	}

	public static openCheck() {
		return Deblocking.Check(DeblockingType.TYPE_08)
	}
}
window["MineWinInfo"] = MineWinInfo