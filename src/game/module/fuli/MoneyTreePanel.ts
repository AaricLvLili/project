class MoneyTreePanel extends eui.Component implements ICommonWindowTitle {
	public descBtn: eui.Image;
	public goUpBtn: eui.Button;
	public groupExp: eui.Group;
	public addPoint: eui.Label;
	public add: eui.Label;
	public bar: eui.ProgressBar;
	public image1: eui.Image;
	public image2: eui.Image;
	public image3: eui.Image;
	public m_Lan1: eui.Label;
	public m_Lan2: eui.Label;
	public m_Lan3: eui.Label;
	public image_1: eui.Image;
	public image_2: eui.Image;
	public image_3: eui.Image;
	public playNum: eui.Label;
	public depictLabel1: eui.Label;
	public cost: PriceIcon;
	public getNum: eui.Label;
	public depictLabel0: eui.Label;
	public depictLabel2: eui.Label;
	public abc: eui.Group;

	posY
	mc1
	mc2
	mc3
	expMc: MovieClip
	rect
	baojiMc
	movieExp

	private costNum: number;
	private starMc: MovieClip;




	windowTitleIconName: string = GlobalConfig.jifengTiaoyueLg.st100012;
	public UpdateContent() {

	}

	public constructor() {
		super()

		this.posY = 110
		let posY2 = 447
		this.skinName = "MoneyTreeSkin"
		this.expMc = new MovieClip
		this.expMc.x = this.groupExp.width >> 1
		this.expMc.y = this.groupExp.height >> 1
		this.expMc.scaleX = 1;
		this.expMc.scaleY = 1;
		this.rect = new egret.Rectangle(-65, -30, 120, 130)
		this.groupExp.addChild(this.expMc)
		this.baojiMc = new MovieClip
		this.baojiMc.x = 240
		this.baojiMc.y = 380
		this.movieExp = new MovieClip
		UIHelper.SetLinkStyleLabel(this.depictLabel2, GlobalConfig.jifengTiaoyueLg.st100013);
		this.starMc = new MovieClip;
		this.starMc.loadUrl(ResDataPath.GetUIEffePath("eff_moneytree_bg"), true);
		this.addChild(this.starMc);
		this.starMc.x = 240;
		this.starMc.y = 200;
		// this.depictLabel2.textFlow = (new egret.HtmlTextParser).parser("<font color = '0x09c709'><u>提升VIP</u></font>")
		this.depictLabel0.text = GlobalConfig.jifengTiaoyueLg.st100021;
		this.depictLabel1.text = GlobalConfig.jifengTiaoyueLg.st100022;
		this.goUpBtn.label = GlobalConfig.jifengTiaoyueLg.st100023;
		this.m_Lan1.text = 5 + GlobalConfig.jifengTiaoyueLg.st100024;
		this.m_Lan2.text = 20 + GlobalConfig.jifengTiaoyueLg.st100024;
		this.m_Lan3.text = 50 + GlobalConfig.jifengTiaoyueLg.st100024;
	}

	open() {
		this.depictLabel2.visible = !WxSdk.ins().isHidePay();
		for (var e = [], t = 0; t < arguments.length; t++) e[t] = arguments[t];
		if (this.mc1 == null) {
			this.mc1 = new MovieClip
			this.mc1.x = this.image1.x - 29;
			this.mc1.y = this.image1.y - 27;
			this.mc2 = new MovieClip
			this.mc2.x = this.image2.x - 29;
			this.mc2.y = this.image2.y - 27;
			this.mc3 = new MovieClip
			this.mc3.x = this.image3.x - 29;
			this.mc3.y = this.image3.y - 27;
		}


		GameGlobal.MessageCenter.addListener(MessageDef.MONEY_INFO_CHANGE, this.refushInfo, this), this.goUpBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTap, this), this.image1.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTap, this), this.image2.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTap, this), this.image3.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTap, this), this.depictLabel2.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTap, this), this.descBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTap, this), this.refushInfo(!0), this.expMc.loadUrl(ResDataPath.GetUIEffePath("eff_moneytree_ball"), !0)
		this.bar.labelDisplay.visible = false
	}

	close() {
		for (var e = [], t = 0; t < arguments.length; t++) e[t] = arguments[t];
		this.goUpBtn.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onTap, this), this.image1.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onTap, this), this.image2.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onTap, this), this.image3.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onTap, this), this.depictLabel2.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onTap, this), this.descBtn.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onTap, this), GameGlobal.MessageCenter.removeListener(MessageDef.MONEY_INFO_CHANGE, this.refushInfo, this)
		DisplayUtils.dispose(this.starMc);
		this.starMc = null;
		DisplayUtils.dispose(this.expMc);
		this.expMc = null;
		DisplayUtils.dispose(this.baojiMc);
		this.baojiMc = null;
		DisplayUtils.dispose(this.mc1);
		this.mc1 = null;
		DisplayUtils.dispose(this.mc2);
		this.mc2 = null;
		DisplayUtils.dispose(this.mc3);
		this.mc3 = null;
	}

	onTap(e) {
		switch (e.currentTarget) {
			case this.goUpBtn:
				if (MoneyTreeModel.ins().playNum >= MoneyTreeModel.ins().cruMaxNum)
					return void (GameGlobal.actorModel.vipLv >= MoneyTreeModel.ins().maxNum ? UserTips.ins().showTips(GlobalConfig.jifengTiaoyueLg.st101612) : UserTips.ins().showTips(GlobalConfig.jifengTiaoyueLg.st101613));
				if (GameGlobal.actorModel.yb >= (this.costNum))
					return void MoneyTreeModel.ins().sendPlayYaoYao();
				UserTips.ins().showTips(GlobalConfig.jifengTiaoyueLg.st100014);
				break;
			case this.image1:
				ViewManager.ins().open(MoneyTreeBoxWin, 1);
				break;
			case this.image2:
				ViewManager.ins().open(MoneyTreeBoxWin, 2);
				break;
			case this.image3:
				ViewManager.ins().open(MoneyTreeBoxWin, 3);
				break;
			case this.depictLabel2:
				ViewManager.ins().open(VipWin);
				break;
			case this.descBtn:
			// App.ViewManager.open(ViewConst.ZsBossRuleSpeak, 5)
		}
	}


	refushInfo(e = false, t = 0) {

		var i = MoneyTreeModel.ins();
		let n = i.getIndexCost();
		let r = i.getNowCoefficientinfo();
		let o = i.getNowCoefficientinfo(1);
		// this.bar.maximum = i.maxNum
		this.bar.maximum = 50;
		if (i.playNum == i.maxNum) {
			this.depictLabel1.visible = !1;
			this.playNum.visible = !1;
			this.cost.visible = !1;
			this.getNum.text = GlobalConfig.jifengTiaoyueLg.st100015;
		} else {
			this.depictLabel1.visible = !0;
			this.playNum.visible = !0;
			this.cost.visible = !0;
			this.playNum.text = LanguageString.jifengTiaoyueCh(GlobalConfig.jifengTiaoyueLg.st100016, [i.playNum, i.cruMaxNum])
			if (n) {
				this.costNum = n.yuanbao, this.cost.setText(n.yuanbao + "");
				this.getNum.textFlow = (new egret.HtmlTextParser).parser(GlobalConfig.jifengTiaoyueLg.st100017 + "<font color = '#bfcd00' stroke='1' strokeColor='#535557'>" + CommonUtils.overLength(Math.floor(n.gold * r.rate / 100)) + "(+" + (r.rate - 100) + "%)</font> " + GlobalConfig.jifengTiaoyueLg.st100018);
			}
		}

		this.add.text = GlobalConfig.jifengTiaoyueLg.st100019 + (r.rate - 100) + "%"
		this.bar.value = i.playNum
		e || this.moveExpMc();
		var s = 0;
		null == o
			? this.addPoint.text = GlobalConfig.jifengTiaoyueLg.st100020
			: (this.addPoint.text = i.exp + "/" + o.needExp, s = 85 * (.5 - i.exp / o.needExp))
		this.rect.y = s
		this.expMc.mask = this.rect
		this.refushBoxInfo()

		t > 1 && (this.baojiMc.loadUrl(ResDataPath.GetUIEffePath("eff_critical"), !0, 1, () => { if (this.baojiMc.parent) { this.baojiMc.parent.removeChild(this.baojiMc) } }), this.addChild(this.baojiMc))
	}

	moveExpMc() {
		this.movieExp.x = 360, this.movieExp.y = 300, this.movieExp.loadUrl(ResDataPath.GetUIEffePath("eff_moneytree_star"), !0, 1), this.addChild(this.movieExp);
		var e = egret.Tween.get(this.movieExp);
		e.to({
			y: 435,
			x: 100,
		}, 420).call(() => {
			egret.Tween.removeTweens(this.movieExp);
		});
	}

	refushBoxInfo() {
		var moneyTree = MoneyTreeModel.ins();
		//this.image_1.visible = moneyTree.getOrderByIndex(0) >= 1, this.image_2.visible = moneyTree.getOrderByIndex(1) >= 1, this.image_3.visible = moneyTree.getOrderByIndex(2) >= 1;
		for (var t = 1; 4 > t; t++) {
			var i = this["mc" + t];
			moneyTree.checkBoxIsCanget(t) ? this.playEffect(i) : i.parent && DisplayUtils.removeFromParent(i)
		}
	}

	playEffect(e) {
		e.loadUrl(ResDataPath.GetUIEffePath("eff_task_box"), !0, 100), this.image1.parent.addChild(e)
	}
}
window["MoneyTreePanel"] = MoneyTreePanel