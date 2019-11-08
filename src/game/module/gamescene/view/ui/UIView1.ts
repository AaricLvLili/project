class UIView1 extends BaseEuiView {

	public static LAYER_LEVEL = LayerManager.UI_NAVIGATION;

	ft = new FrameTick;
	goldTxt
	ybTxt
	nameTxt
	recharge
	recharge11

	recharge0
	recharge00
	lvTxt
	private powLabel: eui.Label
	private txtVipLevel: eui.Label
	private vipRedPoint: eui.Image
	private imgRole: eui.Image//头像
	public groupVip: eui.Group;
	private _mc: MovieClip
	// vipGroup
	// vipLv
	// vipBtn
	// nameGroup

	// vipNumOriginalX
	public m_MainGroup: eui.Group;

	public expBar: eui.ProgressBar;
	public expBarLabel: eui.Label;
	private expConfig: any;
	private headGroup: eui.Group;
	public m_HJGroup: eui.Group;

	private m_HejiMc: MovieClip
	private m_UserHejiMc: MovieClip
	public couponTxt: eui.Label;
	public recharge1: eui.Group;
	public m_CouponBtn: eui.Button;


	public constructor() {
		super();
		//this.imgMask.visible =false
	}

	initUI() {
		super.initUI()
		this.skinName = "MainTopPanelSkin";
		this.touchEnabled = false;
		if (Main.isLiuhai) {
			this.m_MainGroup.top = 40
		}
		this.expBar.slideDuration = 0;
		// this.vipLv = BitmapNumber.ins().createNumPic(0, "5")
		// this.vipLv.x = this.vipBtn.x + (32 - this.vipLv.width / 2) + 40
		// this.vipNumOriginalX = this.vipLv.x
		// this.vipLv.y = this.vipBtn.y + 7
		// this.vipLv.touchEnabled = false
		// this.vipGroup.addChild(this.vipLv)
	};
	initData() {
		if (this.ft.checkAndTick(0))
			return;
		this.updateData()

	};
	open(...param: any[]) {
		this.observe(GameLogic.ins().postSubRoleChange, this.initData)
		this.observe(GameLogic.ins().postGoldChange, this.initData)
		this.observe(GameLogic.ins().postYbChange, this.initData)
		this.observe(GameLogic.ins().postNameChange, this.initData)
		this.observe(GameLogic.ins().postCouponChange, this.initData)
		MessageCenter.ins().addListener(MessageDef.POWER_CHANGE, this.initData, this)
		this.observe(MessageDef.EXP_CHANGE, this.updataExp);
		this.observe(GameLogic.ins().postExpChange, this.expChange);
		GameGlobal.MessageCenter.addListener(MessageDef.UPDATA_VIP_AWARDS, this.showVipRedPoint, this);
		GameGlobal.MessageCenter.addListener(MessageDef.UPDATA_VIP_EXP, this.changeExp, this);
		GameGlobal.MessageCenter.addListener(MessageDef.SUB_ROLE_CHANGE, this._roleChange, this);
		// GameGlobal.MessageCenter.addListener(MessageDef.GETUSERINFO_UPDATE_HEADICON, this.refreshHeadIcon, this);
		this.observe(MessageDef.UPDATA_VIP_EXP, this.changeExpBtn)
		this.observe(MessageDef.UPDATA_VIP_AWARDS, this.upDataVipBtnRedPoint)
		this.observe(MessageDef.POWER_CHANGE, this._updatePower)
		this.observe(GameLogic.ins().postLevelChange, this.expChange)
		this.observe(GameLogic.ins().postInitActorInfo, this.updateData)
		this.addTouchEvent(this, this.onClick, this.recharge)
		this.addTouchEvent(this, this.onClick, this.recharge0)
		this.addTouchEvent(this, this.onClick, this.recharge00)
		this.addTouchEvent(this, this.onClick, this.recharge11)
		this.addTouchEvent(this, this.onClick, this.txtVipLevel)
		this.addTouchEvent(this, this.onClick, this.headGroup)
		this.addTouchEvent(this, this.onClick, this.recharge1)
		this.observe(MessageDef.CHANGE_MAP_MSG, this.onChangeMap);
		// this.addTouchEvent(this, this.onClick, this.vipBtn)
		this.initData()
		this.changeExp()
		this.upDataVipBtnRedPoint()
		this.txtVipLevel.visible = StartGetUserInfo.isOne == false;//针对单机屏蔽；
		this._initMc()

		newAI.ins().mPowerSkillAction = (state, value) => {
			this.setHJAnim(state, value);
		}
		this.heJIMaxCD = GlobalConfig.ins("SkillsConfig")[68001].cd;
	};

	private heJIMaxCD: number = 0;
	public nowHJCD: number = 0;
	private playTime: number = 200;
	private setHJAnim(state, value) {
		switch (state) {
			case PowerSkillState.INIT:
			case PowerSkillState.USE:
				if (GameMap.IsNoramlLevel()) {
					// this.SetHejiProgress(0)
					this._RemovehejiMc()
					this._RemovehejiMc2();
				}
				break
			case PowerSkillState.LOADING:
				let p = 100 * value / 0.9
				// this.hejiProgress.value = p
				// egret.log("合击值：" + p)
				let angle = p * 3.6;
				if (angle > 360) {
					angle = 360
				}
				this.drawRoundness(angle);
				this._LoadHejiMc()
				if (p >= 100) {
					this._LoadHejiMc2();
				} else {
					this._RemovehejiMc2();
				}
				break
		}
	}

	private onChangeMap() {
		this._RemovehejiMc()
		this._RemovehejiMc2();
		this.removeTimer();
		if (!GameMap.IsNoramlLevel() && EntityManager.ins().CanUseHeji()) {
			this.nowHJCD = 0;
			this.setTimer();
		}
	}

	private setTimer() {
		this.removeTimer();
		TimerManager.ins().doTimer(this.playTime, 0, this.fpRunHeji, this);
	}

	private removeTimer() {
		TimerManager.ins().remove(this.fpRunHeji, this);
	}

	private fpRunHeji() {
		this.nowHJCD += this.playTime;
		let cd = this.nowHJCD / this.heJIMaxCD;
		this.setHJAnim(PowerSkillState.LOADING, cd);
	}

	private _RemovehejiMc(): void {
		if (this.m_HejiMc && this.m_HejiMc.parent) {
			this.m_HejiMc.parent.removeChild(this.m_HejiMc);
		}
		// this.m_HejiMc = null;
	}
	private _RemovehejiMc2(): void {
		if (this.m_UserHejiMc && this.m_UserHejiMc.parent) {
			this.m_UserHejiMc.parent.removeChild(this.m_UserHejiMc);
		}
		// this.m_UserHejiMc = null;
	}
	private _LoadHejiMc(): void {
		if (this.m_HejiMc && this.m_HejiMc.parent) {
			return
		}
		if (!this.m_HejiMc) {
			this.m_HejiMc = new MovieClip
			// this.m_HejiMc.blendMode = egret.BlendMode.ADD
		}
		this.m_HejiMc.loadUrl(ResDataPath.GetUIEffePath("eff_main_energy1"), true, -1)
		this.m_HejiMc.x = this.m_HJGroup.width / 2;
		this.m_HejiMc.y = this.m_HJGroup.height / 2;
		this.m_HJGroup.addChildAt(this.m_HejiMc, -1);
		this.initShape(this.m_pShape, this.m_HJGroup);
	}

	private _LoadHejiMc2(): void {
		if (this.m_UserHejiMc && this.m_UserHejiMc.parent) {
			return
		}
		if (!this.m_UserHejiMc) {
			this.m_UserHejiMc = new MovieClip
			// this.m_UserHejiMc.blendMode = egret.BlendMode.ADD
		}
		this.m_UserHejiMc.loadUrl(ResDataPath.GetUIEffePath("eff_main_energy"), true, -1)
		this.m_UserHejiMc.x = this.m_HJGroup.width / 2;
		this.m_UserHejiMc.y = this.m_HJGroup.height / 2;
		this.m_HJGroup.addChildAt(this.m_UserHejiMc, 10);
	}
	/**遮罩 */
	public m_pShape: egret.Shape = new egret.Shape();
	/**圈的色值 */
	public m_pMaskColor: number = 0xffffff;
	/**半径 */
	public m_pRadius: number = 37;
	/**初始技能CD遮罩 */
	private initShape(shape: egret.Shape, group: eui.Group) {
		shape.x = group.width * 0.5;
		shape.y = group.height * 0.5;
		shape.rotation = -90;
		// shape.alpha = 0.7;
		this.m_HejiMc.mask = shape;
		group.addChildAt(shape, 2);
	}
	/**画圆
	 * @angle 角度
	 * 
	 */
	public drawRoundness(angle: number) {
		let shape = this.m_pShape
		if (shape) {
			shape.graphics.clear();
			shape.graphics.beginFill(this.m_pMaskColor);
			shape.graphics.drawArc(0, 0, this.m_pRadius, (angle % 360) * Math.PI / 180, 360 * Math.PI / 180, true);
			shape.graphics.lineTo(0, 0);
			shape.graphics.endFill();
		}
	}
	updateData() {
		CommonUtils.labelIsOverLenght(this.goldTxt, GameLogic.ins().actorModel.gold)
		CommonUtils.labelIsOverLenght(this.ybTxt, GameLogic.ins().actorModel.yb)
		CommonUtils.labelIsOverLenght(this.couponTxt, GameLogic.ins().actorModel.coupon)
		this.nameTxt.text = GameLogic.ins().actorModel.name;
		this.changeExpBtn()
		this.expChange()
	}

	//微信小游戏用微信头像做玩家头像
	private drawCircle(maskX, maskY, gral, parentContain, targetObj) {
		var mask: egret.Shape = new egret.Shape();
		mask.x = maskX;
		mask.y = maskY;
		mask.graphics.beginFill(0xffffff, 15);
		mask.graphics.drawCircle(0, 0, gral);
		mask.graphics.endFill();
		targetObj.mask = mask;

		mask.blendMode = egret.BlendMode.ERASE;
		parentContain.addChild(mask);
	}

	private refreshHeadIcon() {
		console.log(">>>>>>>>>>>>>>>>>>>>获取到了用户信息，收到事件");
		this.imgRole.source = WxSdk.ins().imgURL;
		this.imgRole.scaleX = this.imgRole.scaleY = 0.6;
		var banjing = 37;
		// this.drawCircle(this.imgRole.x+banjing,this.imgRole.y+banjing,banjing,this.imgRole.parent,this.imgRole);
		this.drawCircle(37, 37, 37, this.imgRole.parent, this.imgRole);
	}

	private _roleChange() {
		let role = SubRoles.ins().getSubRoleByIndex(0)
		if (role == null) return
		if (SdkMgr.isWxGame() && WxSdk.ins().imgURL) {
			this.refreshHeadIcon();
		} else {
			this.imgRole.source = ResDataPath.GetHeadMiniImgName(role.job, role.sex)
		}
		GameGlobal.MessageCenter.removeListener(MessageDef.SUB_ROLE_CHANGE, this._roleChange, this);
	}
	private changeExp(): void {
		this.txtVipLevel.text = LanguageString.jifengTiaoyueCh(GlobalConfig.jifengTiaoyueLg.st101366, [UserVip.ins().lv]);
	}
	public close(...param: any[]) {
		super.close(param);
		MessageCenter.ins().removeAll(this);
		DisplayUtils.removeFromParent(this._mc)
		this._mc = null
	};
	public showVipRedPoint() {
		this.vipRedPoint.visible = UserVip.ins().CheckRedPoint();
		this.changeExp()
	}
	showNameOrVIP(t) {
		// this.nameGroup.visible = t
		// this.vipGroup.visible = !t
	}
	private _updatePower(): void {
		this.powLabel.text = GlobalConfig.jifengTiaoyueLg.st101117 + `${GameLogic.ins().actorModel.power}`
	}
	upDataVipBtnRedPoint() {
		// this.vipBtn.redPoint.visible = UserVip.ins().getVipState()
	}
	changeExpBtn() {
		// UserVip.ins().lv <= 0 || void 0 == UserVip.ins().lv || (BitmapNumber.ins().changeNum(this.vipLv, UserVip.ins().lv, "5", 2), this.vipLv.x = UserVip.ins().lv >= 10 ? this.vipNumOriginalX - 4 : this.vipNumOriginalX)
	}
	onClick(e) {
		switch (e.currentTarget) {
			case this.recharge1:
				if (!WxSdk.ins().isHidePay())
					ViewManager.ins().open(CouponWin);
				break;
			case this.recharge:
			case this.recharge11:
				if (!WxSdk.ins().isHidePay())
					ViewManager.ins().open(ChargeFirstWin);
				break;
			case this.recharge0:
			case this.recharge00:
				if (MoneyTreeModel.CheckOpen(true)) {
					ViewManager.ins().open(FuliWin, 1, 2);
				}
				break;
			case this.txtVipLevel:
				ViewManager.ins().open(VipWin, UserVip.ins().lv);
				break;
			case this.headGroup:
				// if(SdkMgr.isWxGame() && !WxSdk.ins().imgURL)
				// {
				// 	WxSdk.ins().getUserWx();
				// }
				ViewManager.ins().open(SoundSetPanel);
				// WxSdk.ins().getUserWx();
				break;
		}
	};
	private _initMc(): void {
		if (this._mc == null) {
			this._mc = new MovieClip
			this._mc.x = this.groupVip.width / 2
			this._mc.y = this.groupVip.height / 2
			// this._mc.scaleX = this._mc.scaleY = .6
			this.groupVip.addChild(this._mc)
			this._mc.loadUrl(ResDataPath.GetUIEffePath("eff_vip01"), true, -1);
		}
	}
	private updataExp() {
		if (this.expConfig == null)
			this.expConfig = GlobalConfig.ins("ExpConfig");
		this.expBar.maximum = this.expConfig[GameLogic.ins().actorModel.level].exp;
		this.expBar.value = GameLogic.ins().actorModel.exp;
		MessageCenter.ins().removeListener(MessageDef.EXP_CHANGE, this.updataExp, this);
	}
	public expChange() {
		var lv = GameLogic.ins().actorModel.level;
		if (lv == 0) {
			lv = 1;
		}
		var zs = UserZs.ins() ? UserZs.ins().lv : 0;
		this.lvTxt.text = (zs ? LanguageString.jifengTiaoyueCh(GlobalConfig.jifengTiaoyueLg.st101367, [zs]) : "") + LanguageString.jifengTiaoyueCh(GlobalConfig.jifengTiaoyueLg.st101368, [lv]);
		if (this.expConfig == null)
			this.expConfig = GlobalConfig.ins("ExpConfig");

		let maxExp = this.expConfig[lv].exp;
		this.expBarLabel.text = GameLogic.ins().actorModel.exp + "/" + maxExp;
		egret.Tween.removeTweens(this.expBar);
		var tween = egret.Tween.get(this.expBar);
		//		this.expBar.labelDisplay.
		if (this.expBar.maximum != maxExp) {
			tween.to({ "value": this.expBar.maximum }, 500).wait(200).call(() => {
				this.expBar.maximum = maxExp;
				this.expBar.value = 0;
				// this._SetExpProgresMax(maxExp)
				this.expChange();
			}, this).call(() => {
				egret.Tween.removeTweens(this.expBar);
			});
			return;
		}
		else {
			tween.to({ "value": GameLogic.ins().actorModel.exp }, 500);
		}
	};

}

window["UIView1"] = UIView1