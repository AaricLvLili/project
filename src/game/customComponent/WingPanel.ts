class WingPanel extends BaseView implements ICommonWindowTitle, ICommonWindowRoleSelect {

	public constructor() {
		super();
		this.skinName = "WingSkin";
	}

	private powerLabel: PowerLabel
	private wingCommonConfig: any;
	windowCommonBg = "pic_bj_20_png"
	_lastLv = 0;
	_lastStar = 0;
	_isAutoUp = false;


	danItemID
	starList: StarList
	boostPrice1: PriceIcon
	/** 升级特效*/
	mc: MovieClip
	boostPrice2: PriceIcon
	openStatusBtn: eui.Button
	notOpenBg: eui.Image;
	boostBtn1: eui.Button
	boostBtn2: eui.Button
	upgradeBtn: eui.Button
	wingEquip
	bigUpLevelBtn: eui.Button
	boostBtn0: eui.Button
	_isShowFrame

	_wingsData: WingsData

	expBar: eui.ProgressBar
	attrLabel: AttrLabel
	// nextAttrLabel
	warnLabel
	bigLevelLab: eui.Label;
	bigLevelLabBg
	wingImg: eui.Image;
	roleShowPanel: RoleShowPanel;
	wingName
	imageVip: eui.Label	//vip功能
	private powerEffe: MovieClip;	//战斗力特效
	_totalPower

	clearSelect: boolean = true;
	public m_BuyBtn: eui.Image;


	private _curCnt: number

	public m_RightArrImg: eui.Image;
	public m_LeftArrImg: eui.Image;
	public m_FightLab: eui.Image;
	public m_FightBtn: eui.Button;
	public m_HuanHuaGroup: eui.Group;

	public m_NowLv: number = 0;
	public m_Lv: number = 0;
	public m_AutoBuy: eui.CheckBox;

	private get curRole(): number {
		return this.m_RoleSelectPanel.getCurRole()
	}

	//战斗力特效
	public static AddPowerEff() {
		let powerEffe = new MovieClip
		powerEffe.x = 240
		powerEffe.y = 27
		powerEffe.loadUrl(ResDataPath.GetUIEffePath("effe_ui_role_power_floor"), true, -1)
		return powerEffe
	}

	protected childrenCreated(): void {
		super.childrenCreated()
		if (this.wingCommonConfig == null)
			this.wingCommonConfig = GlobalConfig.ins("WingCommonConfig");
		this.danItemID = this.wingCommonConfig.levelItemid;
		this.mc = new MovieClip();
		this.openStatusBtn.label = GlobalConfig.jifengTiaoyueLg.st100699;
		this.upgradeBtn.label = GlobalConfig.jifengTiaoyueLg.st101103;
		this.boostBtn0.label = GlobalConfig.jifengTiaoyueLg.st100245;
		this.boostBtn1.label = GlobalConfig.jifengTiaoyueLg.st100700;
		this.boostBtn2.label = GlobalConfig.jifengTiaoyueLg.st100701;
		this.imageVip.text = GlobalConfig.jifengTiaoyueLg.st100702;
		this.bigLevelLab.text = GlobalConfig.jifengTiaoyueLg.st100703;
		this.boostPrice1.setType(MoneyConst.gold);
		this.m_AutoBuy.label = GlobalConfig.jifengTiaoyueLg.st101147;
	};
	open() {
		this.openStatusBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTap, this);
		this.boostBtn1.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTap, this);
		this.boostBtn2.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTap, this);
		this.m_BuyBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTap, this);
		this.upgradeBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTap, this);
		this.wingEquip.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTap, this);
		this.bigUpLevelBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTap, this);
		this.boostBtn0.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTap, this);
		MessageCenter.addListener(Wing.ins().postBoost, this.showBoost, this);
		MessageCenter.addListener(Wing.ins().postWingUpgrade, this.setWingData, this);
		MessageCenter.addListener(Wing.ins().postActivate, this.setWingData, this);
		MessageCenter.addListener(Wing.ins().postWingEquipUpdate, this.setWingData, this);
		MessageCenter.addListener(UserBag.postItemChange, this.updateItemCount, this); //道具变更
		MessageCenter.addListener(UserBag.postItemAdd, this.updateItemCount, this); //道具添加
		GameGlobal.MessageCenter.addListener(MessageDef.DELETE_ITEM, this.updateItemCount, this); //道具删除
		MessageCenter.addListener(GameLogic.ins().postLevelChange, this.updateLevel, this);
		this.AddClick(this.m_LeftArrImg, this.onClickArrImg);
		this.AddClick(this.m_RightArrImg, this.onClickArrImg);
		this.observe(MessageDef.WING_CHANGESHOW_MSG, this.onChangeWinShow);
		this.AddClick(this.m_FightBtn, this.onClickFight);
	};
	close() {
		this.openStatusBtn.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onTap, this);
		this.boostBtn1.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onTap, this);
		this.boostBtn2.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onTap, this);
		this.m_BuyBtn.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onTap, this);
		this.upgradeBtn.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onTap, this);
		this.wingEquip.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onTap, this);
		this.bigUpLevelBtn.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onTap, this);
		this.boostBtn0.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onTap, this);
		MessageCenter.ins().removeAll(this);
		this.roleShowPanel.release();
	};

	/**满足2转才能显示 */
	canShow() {
		var zs = UserZs.ins() ? UserZs.ins().lv : 0;
		if (this.wingCommonConfig == null)
			this.wingCommonConfig = GlobalConfig.ins("WingCommonConfig");
		var autoLv = this.wingCommonConfig.autoLv;
		return GameGlobal.actorModel.level >= autoLv[0] || GameGlobal.actorModel.vipLv >= autoLv[1] || zs > 1;
	};

	updateLevel() {
		this.boostBtn1.x = 170;
	};
	onTap(e) {
		if (this.wingCommonConfig == null)
			this.wingCommonConfig = GlobalConfig.ins("WingCommonConfig");
		switch (e.currentTarget) {
			case this.openStatusBtn:

				if (GameLogic.ins().actorModel.level >= this.wingCommonConfig.openLevel)
					Wing.ins().sendActivate(this.curRole);
				else {
					UserTips.ins().showTips("|C:0xf87372&T:" + GlobalConfig.jifengTiaoyueLg.st100691 + "|");
				}
				break;
			case this.boostBtn1:
				if (GameLogic.ins().actorModel.gold >= GlobalConfig.wingLevelConfig[this._wingsData.lv].normalCost)
					Wing.ins().sendBoost(this.curRole, 0);
				else
					UserWarn.ins().setBuyGoodsWarn(1);
				break;
			case this.boostBtn2:
				this.useShenYu();
				break;
			case this.upgradeBtn:
				Wing.ins().sendUpgrade(this.curRole);
				break;
			case this.wingEquip:
				ViewManager.ins().open(WingEquipPanel, this.curRole, this.powerLabel.text);
				break;
			case this.bigUpLevelBtn:
				let itemConfig = GlobalConfig.itemConfig[this.danItemID];
				var itemName = itemConfig.name;
				let itemNum = UserBag.ins().getBagGoodsCountById(0, itemConfig.id);
				let str = LanguageString.jifengTiaoyueCh(GlobalConfig.jifengTiaoyueLg.st100692, [itemName, this.wingCommonConfig.levelItemidStage, this.wingCommonConfig.levelExpChange])
				WarnWin.show(str + "<font color='#C42525'>\n" + itemName + "：" + itemNum + "</font>", () => {
					Wing.ins().sendBigUpLevel(this.curRole);
				}, this);
				break;
			case this.boostBtn0:
				if (!Deblocking.Check(DeblockingType.TYPE_87)) {
					return;
				}
				var config = GlobalConfig.wingLevelConfig[this._wingsData.lv];
				var count = UserBag.ins().getBagGoodsCountById(0, config.itemId);
				if (count >= config.itemNum) {
					WarnWin.show(GlobalConfig.jifengTiaoyueLg.st100243, () => {
						Wing.ins().sendWingOneKey(this.curRole);
					}, this);
				}
				else {
					if (this.m_AutoBuy.selected) {
						let yb = Shop.ins().getShopPrice(config.itemId, config.itemNum);
						if (Checker.Money(MoneyConst.yuanbao, yb, Checker.YUNBAO_FRAME)) {
							if (WingPanel.isTips == false) {
								WingPanel.isTips = true;
								WarnWin.show(LanguageString.jifengTiaoyueCh(GlobalConfig.jifengTiaoyueLg.st102089, [yb, GlobalConfig.jifengTiaoyueLg.st100208]), function () {
									Wing.ins().sendBoost(this.curRole, 1, true);
								}, this)
							} else {
								Wing.ins().sendBoost(this.curRole, 1, true);
							}
						}
						return;
					}
					UserWarn.ins().setBuyGoodsWarn(config.itemId);
				}
				break;
			case this.m_BuyBtn:
				var config = GlobalConfig.wingLevelConfig[this._wingsData.lv];
				UserWarn.ins().setBuyGoodsWarn(config.itemId)
				break;
		}
	};
    /**
     * 未激活
     */
	notOpenStatus() {
		this.starList.visible = false;
		this.expBar.visible = false;
		this.attrLabel.visible = false;
		this.upgradeBtn.visible = false;
		this.boostBtn0.visible = false;
		this.boostBtn1.visible = false;
		this.boostBtn2.visible = false;
		this.m_AutoBuy.visible = false;
		this.m_BuyBtn.visible = false;
		this.boostPrice1.visible = false;
		this.boostPrice2.visible = false;
		this.powerLabel.visible = false;

		this.openStatusBtn.visible = true;
		this.notOpenBg.visible = true;
		this.imageVip.visible = false;

		this.warnLabel.visible = true;
		this.warnLabel.y = 335;
		this.warnLabel.text = GlobalConfig.jifengTiaoyueLg.st100693;//"58级可免费激活羽翼，提升角色属性";
		this.bigUpLevelBtn.visible = false;
		this.bigLevelLab.visible = false;
		this.bigLevelLabBg.visible = false;
		this.roleShowPanel.visible = false;
		this.m_HuanHuaGroup.visible = false;
		if (this._wingsData.lv >= this.wingCommonConfig.lvMax) {
			this.roleShowPanel.visible = true;
			this.m_HuanHuaGroup.visible = true;
		}

		if (this.wingCommonConfig == null)
			this.wingCommonConfig = GlobalConfig.ins("WingCommonConfig");

		if (this._wingsData.lv >= this.wingCommonConfig.lvMax)
			this.wingEquip.visible = true; //暂时屏蔽羽翼装备
		else
			this.wingEquip.visible = false;
	};
    /**
     * 已激活
     */
	openStatusOpen() {
		this.bigLevelLab.visible = true;
		this.bigLevelLabBg.visible = true;
		this.bigUpLevelBtn.visible = true;
		this.roleShowPanel.visible = true;
		this.m_HuanHuaGroup.visible = true;
		this.openStatusBtn.visible = false;
		this.notOpenBg.visible = false;
		this.imageVip.visible = true;

		this.warnLabel.visible = false;
		this.starList.visible = true;
		this.expBar.visible = true;
		this.attrLabel.visible = true;
		this.powerLabel.visible = true;
		this.wingEquip.visible = true; //暂时屏蔽羽翼装备
		this.wingImg.visible = false;//用动画后屏蔽翅膀
	};
    /**
     * 培养表现
     * @param crit 暴击（1=不暴击，2=两倍暴击，以此类推）
     * @param addExp 增加的经验
     */
	showBoost(param) {
		var crit = param[0];
		var addExp = param[1];
		var label = new eui.Label;
		label.size = 20;
		var str = "";
		if (crit > 1) {
			label.textColor = 0xf87372;
			str = GlobalConfig.jifengTiaoyueLg.st100694;//"暴击 羽翼经验 + ";
			label.x = 170;
		}
		else {
			label.textColor = 0xf87372;
			str = GlobalConfig.jifengTiaoyueLg.st100695;//"羽翼经验 + ";
			label.x = 190;
		}
		label.y = 326;
		label.text = str + addExp;
		label.horizontalCenter = 0;
		this.addChild(label);
		var t = egret.Tween.get(label);
		t.to({ "y": label.y - 45 }, 500).call(() => {
			if (label) {
				egret.Tween.removeTweens(label);
				DisplayUtils.dispose(label);
			}
		}, this);
		this.expBarChange();
		this.updateAtt();
		this.isShowUpGradeBtn();
		if (this._lastStar != this._wingsData.star && this._wingsData.star > 0) {
			this._lastStar = this._wingsData.star;
			this.playEff();
		}
	};
	setWingData() {
		/**改用动画后添加的 */
		let role = SubRoles.ins().getSubRoleByIndex(this.curRole);
		this.roleShowPanel.creatAnim(role);
		/******* */
		this._wingsData = SubRoles.ins().getSubRoleByIndex(this.curRole).wingsData;
		this.initAttrImg(this._wingsData.lv);
		this.wingImg.touchEnabled = false;
		this.wingName.text = "" + GlobalConfig.wingLevelConfig[this._wingsData.lv].name;
		if (this._wingsData.openStatus) {
			this.openStatusOpen();
		}
		else {
			this.notOpenStatus();
			return;
		}
		this.expBarChange();
		this.updateAtt();
		this.isShowUpGradeBtn();
		if (this._lastLv == 0)
			this._lastLv = this._wingsData.lv;
		if (this._lastLv != this._wingsData.lv) {
			this._lastLv = this._wingsData.lv;
			this.playEff();
		}
		this._lastStar = this._wingsData.star;
		this.updateRadPoint();
	};
	updateRadPoint() {
		UIHelper.ShowRedPoint(this.wingEquip, Wing.ins().mRedPoint.IsEquipState(this.curRole))

		for (let i = 0; i < SubRoles.ins().subRolesLen; ++i) {
			this.m_RoleSelectPanel.showRedPoint(i, Wing.ins().mRedPoint.IsRedByRole(i))
		}
	};
	public showLVbnt: boolean = true;  //判断升级按钮的点击 
	updateAtt() {
		if (this.wingCommonConfig == null)
			this.wingCommonConfig = GlobalConfig.ins("WingCommonConfig");

		var config = GlobalConfig.wingLevelConfig[this._wingsData.lv];
		var starConfig = GlobalConfig.wingStarConfig[this._wingsData.star];
		this.attrLabel.SetCurAttrByAddType(config, starConfig)
		this._totalPower = UserBag.getAttrPower(AttributeData.AttrAddition(config.attr, starConfig.attr));
		var power = 0;
		var len = this._wingsData.equipsLen;
		for (var i = 0; i < len; i++) {
			var equip = this._wingsData.getEquipByIndex(i);
			if (equip.itemConfig)
				power += ItemConfig.calculateBagItemScore(equip);
		}
		this._totalPower = this._totalPower + power;
		this.powerLabel.text = this._totalPower
		if (this._wingsData.lv < this.wingCommonConfig.lvMax) {
			var nextLvConfig = void 0;
			var nextStarConfig = void 0;

			if (this._wingsData.star > 0 && this._wingsData.star % 10 == 0 && this.showLVbnt) {    //如果星星等于10星
				nextLvConfig = GlobalConfig.wingLevelConfig[this._wingsData.lv + 1];   //显示下一级
				nextStarConfig = starConfig;
				this.showLVbnt = false;
			}
			else {
				if (this._wingsData.star % 10 == 0 && !this.showLVbnt) {       // 判断0星
					nextLvConfig = config;
					nextStarConfig = GlobalConfig.wingStarConfig[this._wingsData.star + 1];
				} else {                                                  // 1-9星
					nextLvConfig = config;
					nextStarConfig = GlobalConfig.wingStarConfig[this._wingsData.star + 1];
					this.showLVbnt = true;
				}
			}
			this.attrLabel.SetNextAttrByAddType(nextLvConfig, nextStarConfig)
		}
	};
	expBarChange() {
		var starConfig = GlobalConfig.wingStarConfig[this._wingsData.star];
		var maxExp = starConfig.exp;
		this.expBar.maximum = maxExp;
		this.expBar.value = this._wingsData.exp;
		if (Math.floor(this._wingsData.star / 10) - this._wingsData.lv > 0) {
			this.expBar.value = this.expBar.maximum = 1
			this.expBar.labelDisplay.visible = false
		} else {
			this.expBar.labelDisplay.visible = true
		}
	};
	isShowUpGradeBtn() {
		if (this.wingCommonConfig == null)
			this.wingCommonConfig = GlobalConfig.ins("WingCommonConfig");

		if (this._wingsData.lv >= this.wingCommonConfig.lvMax) {
			this.notOpenStatus();

			this.openStatusBtn.visible = false;
			this.notOpenBg.visible = false;
			this.imageVip.visible = true;

			this.powerLabel.visible = true;
			this.warnLabel.visible = true;
			this.warnLabel.y = 455;
			this.warnLabel.text = GlobalConfig.jifengTiaoyueLg.st100341;//"羽翼已达最高等级";
			this.attrLabel.visible = true;
			return;
		}
		var config = GlobalConfig.wingLevelConfig[this._wingsData.lv];
		let item = new RewardData;
		item.type = 1;
		item.count = config.itemNum;
		item.id = 200001;
		this.boostPrice2.setData(item);
		var num = this._wingsData.star / 10 - config.level;
		var starNum;
		var bLevelUp = false;
		if (this._wingsData.star > 0 && Math.floor(this._wingsData.star / 10) - this._wingsData.lv > 0 && this._wingsData.lv < this.wingCommonConfig.lvMax && num) {
			this.upgradeBtn.visible = true;
			this.boostBtn1.visible = false;
			this.boostBtn2.visible = false;
			this.m_BuyBtn.visible = false;
			this.boostPrice1.visible = false;
			this.boostPrice2.visible = false;
			starNum = 10;
			bLevelUp = true;
		}
		else {
			this.upgradeBtn.visible = false;
			this.boostBtn1.visible = true;
			this.boostBtn2.visible = true;
			this.m_BuyBtn.visible = true;
			this.boostPrice1.visible = true;
			this.boostPrice2.visible = true;
			this.boostPrice1.setPrice(config.normalCost);
			if (GameLogic.ins().actorModel.gold >= config.normalCost)
				this.boostPrice1.labelColor = 0x008f22;
			else
				this.boostPrice1.labelColor = 0xf87372;

			starNum = this._wingsData.star % 10;
		}
		this.updateItemCount();
		this.starList.starNum = starNum;
		this.boostBtn0.visible = this.boostBtn1.visible;
		this.m_AutoBuy.visible = this.boostBtn2.visible;
	};
	updateItemCount() {
		var config = GlobalConfig.wingLevelConfig[this._wingsData.lv];
		var num = UserBag.ins().getBagGoodsCountById(0, config.itemId);
		this.boostPrice2.setText(config.itemNum <= num ? "<font color=\"#008f22\">" + num + "/" + config.itemNum + "</font>" : "<font color=\"#f87372\">" + num + "/" + config.itemNum + "</font>");
		var count = UserBag.ins().getBagGoodsCountById(0, this.danItemID);
		this.bigUpLevelBtn['redPoint'].visible = count ? true : false;
		this.bigUpLevelBtn['txt'].text = count;

		this.updateRadPoint();
	};
	playEff() {
		var idx: number;
		if (this._lastStar > 0 && this._lastStar % 10 == 0) {
			return
		}
		else
			idx = this._lastStar % 10 - 1;
		var temp: any = this.starList.m_StarItem[idx];
		this.mc.visible = true
		this.mc.loadUrl(ResDataPath.GetUIEffePath("eff_wing_upgrade"), true, 1, () => {
			this.mc.visible = false
		});
		this.mc.x = temp.x + (temp.width >> 1) - 2;
		this.mc.y = temp.y + (temp.height >> 1) - 2;
		this.starList.addChild(this.mc);
	};
	private static isTips: boolean = false;
	useShenYu() {
		var config = GlobalConfig.wingLevelConfig[this._wingsData.lv];
		var count = UserBag.ins().getBagGoodsCountById(0, config.itemId);
		if (this.m_AutoBuy.selected && count < config.itemNum) {
			let yb = Shop.ins().getShopPrice(config.itemId, config.itemNum);
			if (Checker.Money(MoneyConst.yuanbao, yb, Checker.YUNBAO_FRAME)) {
				if (WingPanel.isTips == false) {
					WingPanel.isTips = true;
					WarnWin.show(LanguageString.jifengTiaoyueCh(GlobalConfig.jifengTiaoyueLg.st102089, [yb, GlobalConfig.jifengTiaoyueLg.st100208]), function () {
						Wing.ins().sendBoost(this.curRole, 1, true);
					}, this)
				} else {
					Wing.ins().sendBoost(this.curRole, 1, true);
				}
			}
			return;
		}
		if (count < config.itemNum) {
			UserWarn.ins().setBuyGoodsWarn(config.itemId)
		}
		else {
			Wing.ins().sendBoost(this.curRole, 1, false);
		}
	}
	warnShow() {
		var config = GlobalConfig.wingLevelConfig[this._wingsData.lv];
		var count = UserBag.ins().getBagGoodsCountById(0, config.itemId);
		if (count <= 0) {
			if (this._isShowFrame) {
				let str: string = GlobalConfig.itemConfig[config.itemId].name;
				str += GlobalConfig.jifengTiaoyueLg.st100696 + (config.itemNum * ItemStoreConfig.getStoreByItemID(config.itemId).price) + GlobalConfig.jifengTiaoyueLg.st100050 + "\n"
				str += "<font color='#B18A3D'>(" + GlobalConfig.jifengTiaoyueLg.st100697 + ")</font>"
				WarnWin.show(str, this.warnSure, this);
			} else if (GameLogic.ins().actorModel.yb >= ItemStoreConfig.getStoreByItemID(config.itemId).price * config.itemNum) {
				Wing.ins().sendBoost(this.curRole, 1, true);
			} else {
				UserTips.ins().showTips("|C:0xf87372&T:" + GlobalConfig.jifengTiaoyueLg.st100698 + "|");
			}
			return;
		}

		Wing.ins().sendBoost(this.curRole, 1, false);
	};
	warnSure() {
		var config = GlobalConfig.wingLevelConfig[this._wingsData.lv];
		if (GameLogic.ins().actorModel.yb >= ItemStoreConfig.getStoreByItemID(config.itemId).price * config.itemNum) {
			this._isShowFrame = false;
			Wing.ins().sendBoost(this.curRole, 1, true);
		}
		else {
			UserTips.ins().showTips("|C:0xf87372&T:" + GlobalConfig.jifengTiaoyueLg.st100698 + "|");
		}
	};

	public UpdateContent(): void {
		this.wingImg.visible = true;
		this._lastLv = 0
		this.setWingData();
		this._isShowFrame = true;
		this.updateLevel();
		let role = SubRoles.ins().getSubRoleByIndex(this.curRole);
		this.roleShowPanel.creatAnim(role);
		this.roleShowPanel.touchEnabled = false;
	}

	private initAttrImg(lv: number) {
		this.m_LeftArrImg.visible = true;
		this.m_RightArrImg.visible = true;
		this.m_Lv = lv;
		this.m_NowLv = lv;
		if (lv == 0) {
			this.m_LeftArrImg.visible = false;
		}
		let wingLevelConfig = GlobalConfig.ins("WingLevelConfig")[lv + 1];
		if (!wingLevelConfig) {
			this.m_RightArrImg.visible = false;
		}
		let _wingsData = SubRoles.ins().getSubRoleByIndex(this.curRole).wingsData;

		if (_wingsData.showLv == lv) {
			this.m_FightLab.visible = true;
			this.m_FightBtn.visible = false;
		} else {
			this.m_FightLab.visible = false;
			this.m_FightBtn.visible = true;
		}
	}

	private onClickArrImg(evt: egret.TouchEvent) {
		switch (evt.currentTarget) {
			case this.m_LeftArrImg:
				this.m_RightArrImg.visible = true;
				this.m_Lv -= 1;
				this.roleShowPanel.setCharRoleWing(null, this.m_Lv);
				break;
			case this.m_RightArrImg:
				if (this.m_Lv == this.m_NowLv) {
					this.m_RightArrImg.visible = false;
				}
				// this.m_MountAnim.changeAnimLv(this.m_MountAnim.m_Lv += 1);
				this.m_Lv += 1;
				this.roleShowPanel.setCharRoleWing(null, this.m_Lv);
				break;
		}
		this.setArrImg();
	}

	private setArrImg() {
		// let mountModel = MountModel.getInstance;
		// let curRole = this.m_RoleSelectPanel.getCurRole();
		// var role = SubRoles.ins().getSubRoleByIndex(curRole);
		// let mountData: MountData = mountModel.mountDic.get(role.roleID);
		let wingsData = SubRoles.ins().getSubRoleByIndex(this.curRole).wingsData;
		let wingCommonConfig = GlobalConfig.ins("WingCommonConfig");
		if (this.m_Lv == 0) {
			this.m_LeftArrImg.visible = false;
		} else {
			this.m_LeftArrImg.visible = true;
		}
		if (this.m_Lv == wingCommonConfig.lvMax || this.m_Lv > this.m_NowLv) {
			this.m_RightArrImg.visible = false;
		} else {
			this.m_RightArrImg.visible = true;
		}
		if (wingsData.lv == this.m_Lv) {
			this.m_FightLab.visible = true;
		} else {
			this.m_FightLab.visible = false;
		}
		if (wingsData.showLv == this.m_Lv) {
			this.m_FightLab.visible = true;
			this.m_FightBtn.visible = false;
		} else {
			this.m_FightLab.visible = false;
			if (this.m_Lv > this.m_NowLv) {
				this.m_FightBtn.visible = false;
			} else {
				this.m_FightBtn.visible = true;
			}
		}
	}

	private onChangeWinShow() {
		let _wingsData = SubRoles.ins().getSubRoleByIndex(this.curRole).wingsData;
		if (_wingsData.showLv == this.m_Lv) {
			this.m_FightLab.visible = true;
			this.m_FightBtn.visible = false;
		} else {
			this.m_FightLab.visible = false;
			if (this.m_Lv > this.m_NowLv) {
				this.m_FightBtn.visible = false;
			} else {
				this.m_FightBtn.visible = true;
			}
		}
	}

	private onClickFight() {
		Wing.ins().sendWingChangeShow(this.curRole, this.m_Lv)
	}
	m_RoleSelectPanel: RoleSelectPanel
}
window["WingPanel"] = WingPanel