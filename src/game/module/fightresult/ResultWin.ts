class ResultWin extends BaseEuiPanel {

	isQuit = true;

	listData: eui.ArrayCollection;
	private m_Scroller: eui.Scroller;
	private list: eui.List;

	// bg2
	// bg1
	// closeBtn
	s
	txt
	closeFunc
	defeat
	openRole
	openRole1

	bossmc: MovieClip

	img1
	img2
	img3
	img4
	img5
	public static item: ItemBase = null;
	// public groupEff:eui.Group;
	// private _mc:MovieClip

	private fightResultBg: FightResultPanel
	private btnStr: string = "";
	private lostTxt: eui.Label;
	private languageText: eui.Label;
	private languageText0: eui.Label;


	private get closeBtn(): eui.Button {
		return this.fightResultBg["closeBtn"]
	}

	private get closeBtn0(): eui.Button {
		return this.fightResultBg.closeBtn0;
	}

	private get closeBtn1(): eui.Button {
		return this.fightResultBg.closeBtn1;
	}

	public constructor() {
		super();
		this.layerLevel = VIEW_LAYER_LEVEL.MIDDLE
	}


	initUI() {
		super.initUI()
		this.skinName = "ResultSkin";
		this.list.itemRenderer = ItemBase
		this.listData = new eui.ArrayCollection();
		(this.closeBtn.labelDisplay as eui.Label).size = 18;
		this.lostTxt.text = GlobalConfig.jifengTiaoyueLg.st101863;
		this.languageText.text = GlobalConfig.jifengTiaoyueLg.st100795;
		this.languageText0.text = GlobalConfig.jifengTiaoyueLg.st100796;
		this.txt.text = GlobalConfig.jifengTiaoyueLg.st100797;
	};
	/** 货币排序 */
	sortFunc(a, b) {
		if (a.type == 1 && b.type == 1) {
			var aItem = GlobalConfig.itemConfig[a.id];
			var bItem = GlobalConfig.itemConfig[b.id];
			if (aItem.quality > bItem.quality)
				return -1;
			else if (aItem.quality < bItem.quality)
				return 1;
			else {
				if (aItem.level > bItem.level)
					return -1;
				else if (aItem.level < bItem.level)
					return 1;
			}
		}
		else {
			if (a.type < b.type)
				return -1;
			else if (a.type > b.type)
				return 1;
		}
		return 0;
	};
	open(...param: any[]) {
		super.open(param)
		var result = param[0];
		var rewards = param[1];
		let type = param[4];
		if (rewards) {
			rewards.sort(this.sortFunc);
		}

		this.currentState = result ? "win" : "lose"
		//this.fightResultBg.currentState = result ? "win" : "lose"
		this.fightResultBg.SetState(result ? "win" : "lose")
		// this.bg1.source = result ? "win" : "lose";
		// this.bg2.source = result ? "win_02" : "";
		//"领取奖励" : (param[4]) ? "立即复活" : "退出";
		egret.setTimeout(function () {
			if (type) {
				if (this.fightResultBg.m_TitleImg) {
					this.fightResultBg.m_TitleImg.visible = false;
					this.fightResultBg.m_TitileImg2.visible = true;
				}
			} else {
				if (this.fightResultBg.m_TitleImg) {
					this.fightResultBg.m_TitleImg.visible = true;
					this.fightResultBg.m_TitileImg2.visible = false;
				}
			}
		}, this, 100)
		this.btnStr = (result && rewards && rewards.length) ? GlobalConfig.jifengTiaoyueLg.st100004 : (param[4]) ? GlobalConfig.jifengTiaoyueLg.st100793 : GlobalConfig.jifengTiaoyueLg.st100962;
		if (GameMap.IsGuanQiaBoss() && OmGifBagModel.getInstance.isShow(1)) {
			this.fightResultBg.m_Double.visible = true;
			this.closeBtn.visible = false;
			UIHelper.SetBtnNormalEffe(this.closeBtn1, true);
			this.fightResultBg.closeBtn1.visible = !WxSdk.ins().isHidePay();
		} else {
			this.fightResultBg.m_Double.visible = false;
			this.closeBtn.visible = true;
		}
		this.s = 5;
		this.updateCloseBtnLabel();
		TimerManager.ins().doTimer(1000, 6, this.updateCloseBtnLabel, this);

		if (result) {
			this.listData.source = rewards;
			this.list.dataProvider = this.listData;
			this.list.validateNow()
			let len = this.list.numChildren;
			for (let i = 0; i < len; ++i) {
				if (rewards && rewards[i] && rewards[i].type == 1)//判断是否秘宝箱
				{
					(this.list.getChildAt(i) as ItemBase).isCheckEff = true;
					(this.list.getChildAt(i) as ItemBase).showItemEffect();
					ResultWin.item = new ItemBase;
					ResultWin.item.data = rewards[i].id;
				}
				else {
					ResultWin.item = null;
				}
				let child = this.list.getChildAt(i);
				if (child && child instanceof ItemBase) {
					child.nameTxt.strokeColor = Color.White;
					child.nameTxt.stroke = 1;
				}
			}
			// 	this._mc = new MovieClip
			// this._mc.x = this.groupEff.width >> 1
			// this._mc.y = this.groupEff.height >> 1
			// this._mc.loadUrl(ResDataPath.GetUIEffePath("eff_jiesuan"),true,-1)
			// this.groupEff.addChild(this._mc)
		}
		if (param[2])
			this.txt.text = param[2];
		this.isQuit = !param[4];
		if (param[3] instanceof Function) {
			this.closeFunc = param[3];
		}
		else {
			if (param[3] == false) {
				this.isQuit = param[3];
			}
		}
		if (rewards && rewards.length > 0) {
			this.txt.visible = true;
		}
		else {
			this.txt.visible = false;
			this.txt.text = "";
		}
		egret.setTimeout(function () {
			if (this.defeat) {
				this.defeat.visible = (result == 0);
			}
		}, this, 50);
		if (!result) {
			for (var i = 1; i < 6; i++) {
				this["img" + i].addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTap, this);
			}
		}

		this.closeBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTap, this);
		this.closeBtn0.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTap, this);
		this.closeBtn1.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTap, this);
		this.openRole.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTap, this);
		this.openRole1.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTap, this);
		this.openRole.visible = this.openRole1.visible = SubRoles.ins().subRolesLen < 3;
		// this.defeat.y = 210;
		// if (GameMap.fubenID != 0 && result == 0) {
		// 	this.defeat.y = 110;
		// }
	};
	close() {
		UIHelper.SetBtnNormalEffe(this.closeBtn1, false);
		this.m_Scroller.stopAnimation();
		// if (this.m_Scroller.stage)//不移除，在关闭时候还在缓动，会有bug报错卡死
		// 	this.m_Scroller.parent.removeChild(this.m_Scroller);
		TimerManager.ins().remove(this.updateCloseBtnLabel, this);
		if (!this.currentState) {
			for (var i = 1; i < 6; i++) {
				this["img" + i].removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onTap, this);
			}
		}

		this.closeBtn.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onTap, this);
		this.openRole.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onTap, this);
		this.openRole1.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onTap, this);
		if (GameMap.fubenID > 0) {
			if (this.isQuit) {
				// ControllerManager.ins().applyFunc(ControllerConst.Game, MapFunc.EXIT_FB);
				UserFb.ins().sendExitFb();
			}
		}
		if (this.closeFunc) {
			this.closeFunc();
			this.closeFunc = null;
		}
		if (this.bossmc) {
			DisplayUtils.removeFromParent(this.bossmc);
			ObjectPool.ins().push(this.bossmc);
		}
		// if (this._mc){
		//      DisplayUtils.removeFromParent(this._mc)
		//      DisplayUtils.dispose(this._mc)
		// }

		// this.m_Scroller.stopAnimation();
	};
	updateCloseBtnLabel() {
		this.s--;
		if (this.s <= 0) {
			if (GameMap.IsCityBoss()) {
				ViewManager.ins().open(GuanQiaBossWin);
			}
			if (GameMap.IsTeamFb()) {
				ViewManager.ins().open(FbWin, 2);
			}
			ViewManager.ins().close(this);
			TimerManager.ins().removeAll(this);
		}
		this.closeBtn.label = this.btnStr + "(" + this.s + "s)";
		this.closeBtn0.label = GlobalConfig.jifengTiaoyueLg.st101982 + "(" + this.s + "s)";

	};
	onTap(e) {
		switch (e.currentTarget) {
			case this.img1:
			case this.img2:
			case this.img3:
			case this.img4:
			case this.img5:
				this.openWin(e.currentTarget);
				break;
			case this.closeBtn:
			case this.closeBtn0:
				if (GameMap.IsCityBoss()) {
					ViewManager.ins().open(GuanQiaBossWin);
				}
				if (GameMap.IsTeamFb()) {
					ViewManager.ins().open(FbWin, 2);
				}
				ViewManager.ins().close(this);
				break;
			case this.closeBtn1:
				if (GameMap.IsCityBoss()) {
					ViewManager.ins().open(GuanQiaBossWin);
				}
				if (GameMap.IsTeamFb()) {
					ViewManager.ins().open(FbWin, 2);
				}
				if (GameMap.IsGuanQiaBoss() && !OmGifBagModel.getInstance.isBuy(1)) {
					ViewManager.ins().open(OmGifBagWin);
				}
				ViewManager.ins().close(this);
				break;
			case this.openRole:
			case this.openRole1:
				ViewManager.ins().close(this);
				ViewManager.ins().open(StrongWin);
				break;
		}
	};
	openWin(img) {
		ViewManager.ins().close(this);
		var t = egret.setTimeout(() => {
			switch (img) {
				case this.img1:
					// num[0] = egret.getQualifiedClassName(RoleWin);
					// num[1] = 1;
					ViewManager.ins().open(RoleWin)
					break;
				case this.img2:
					ViewManager.ins().open(ForgeWin, 0)
					// num[0] = egret.getQualifiedClassName(ForgeWin);
					// num[1] = 0;
					break;
				case this.img3:
					ViewManager.ins().open(PetWin)
					// num[0] = egret.getQualifiedClassName(ForgeWin);
					// num[1] = 1;
					break;
				case this.img4:
					ViewManager.ins().open(RoleWin, 1)
					//ViewManager.ins().open(XinFaWin)

					// num[0] = egret.getQualifiedClassName(LiLianWin);
					// num[1] = 0;
					break;
				case this.img5:

					//ViewManager.ins().open(RoleWin)
					ViewManager.ins().open(ForgeWin, 2)
					// ViewManager.ins().open(LoongSoulWin);
					// num[0] = egret.getQualifiedClassName(LoongSoulWin);
					// num[1] = 0;
					break;
			}
			// GameGuider.guidance(num);
			egret.clearTimeout(t);
		}, this, 200);
	};
	public onMaskTap(): void {
		// super.onMaskTap();
		// if (GameMap.IsCityBoss()) {
		// 	ViewManager.ins().open(GuanQiaBossWin);
		// }
	}
}

ViewManager.ins().reg(ResultWin, LayerManager.UI_Popup);

window["ResultWin"] = ResultWin