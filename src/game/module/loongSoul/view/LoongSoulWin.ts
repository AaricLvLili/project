class LoongSoulWin extends BaseEuiPanel implements ICommonWindow, ICommonWindowTitle, ICommonWindowRoleSelect {

	static LAYER_LEVEL = LayerManager.UI_Main

	// mc: MovieClip;
	upgradeBtn;
	btnAutoUp: eui.Button;
	clearSelect: boolean = true;
	_lastJi = 0;
	_isAutoUp = false;
	public m_FullLab: eui.Label;
	private commonWindowBg: CommonWindowBg;
	private get index(): number {
		return this.commonWindowBg.GetSelectedIndex();
	}

	// private attrLabel: AttrLabel;
	private consumeLabel: ConsumeLabel;
	private powerLabel: PowerLabel;
	private longzhuangAttr: LongZhuangAttr;

	// private group: eui.Group;
	// private m_Item: eui.Component[] = [];
	private expBar: eui.ProgressBar;

	private longLine0: eui.Image;
	private longLine1: eui.Image;
	private longLine2: eui.Image;
	private longLine3: eui.Image;
	/** 特效背景*/
	private longW1: MovieClip;
	/** 珠子特效*/
	private mcBar: MovieClip;
	/** 身上龙特效*/
	private longMc: MovieClip;
	/** 龙纹特效*/
	private longW: MovieClip;
	/** 龙特效*/
	private long: MovieClip;



	public effect_one: eui.Group;
	public effect_two: eui.Group;
	public effect_three: eui.Group;
	public effect_four: eui.Group;

	private itemID = [200011, 200012, 200013, 200014];


	public constructor() {
		super();
		this.skinName = "ShenluSkin";
		// let mc = new MovieClip();
		// mc.loadUrl(ResDataPath.GetUIEffePath("eff_dragon"), true, -1);
		// mc.x = 200;
		// mc.y = 280;
		// this.addChild(mc);
	}


	initUI() {
		super.initUI();
		let tabList = [
			GlobalConfig.jifengTiaoyueLg.st100238,
			GlobalConfig.jifengTiaoyueLg.st100239,
			GlobalConfig.jifengTiaoyueLg.st100240,
			GlobalConfig.jifengTiaoyueLg.st100241,
		];
		this.commonWindowBg.SetTabDatas(new eui.ArrayCollection(tabList));
		this.btnAutoUp.label = GlobalConfig.jifengTiaoyueLg.st100245;
		this.m_FullLab.text = GlobalConfig.jifengTiaoyueLg.st100020;
	}
	//创建MC
	private createMc(path, x, y): MovieClip {
		let mc = new MovieClip();
		mc.loadUrl(ResDataPath.GetUIEffePath(path), true, -1);
		mc.x = x;
		mc.y = y;
		if (path == "eff_dragon_magic") {
			this.addChildAt(mc, 13);
		} else {
			this.addChild(mc);
		}
		return mc;
	}
	//物品特效
	private addMc(parent, index): void {
		var mc: MovieClip;
		if (parent.numChildren > 0) {
			mc = <MovieClip>(parent.getChildAt(0));
		}
		else {
			mc = new MovieClip();
			mc.x = 40;
			mc.y = 19;
			mc.scaleX = 1.3;
			mc.scaleY = 1.3;
			parent.addChild(mc);
		}
		if (index == 0) {
			mc.clearCache();
		}
		else {
			mc.loadUrl(ResDataPath.GetUIEffePath(this.colourEffect(index)), !0);
		}
	}

	private colourEffect(index: string) {
		if (index == "1") {
			return "eff_dragon_greenball";
		}
		if (index == "2") {
			return "eff_dragon_blueball";
		}
		if (index == "3") {
			return "eff_dragon_purpleball";
		}
	}


	//根据类型显示对应的效果
	private panelEffect(index): void {
		if (this.longW) {
			this.longW.stop();
			this.longW.visible = false;
		}
		if (this.longW1) {
			this.longW1.stop();
			this.longW1.visible = false;
		}
		if (this.mcBar) {
			this.mcBar.stop();
			this.mcBar.visible = false;
		}
		if (this.longMc) {
			this.longMc.stop();
			this.longMc.visible = false;
		}
		switch (index) {
			//龙珠
			case 0: if (this.mcBar) {
				this.mcBar.play();
				this.mcBar.visible = true;
			} else {
				this.mcBar = this.createMc("eff_dragon_ball", 172, 310);
			}
				break;
			//龙鳞
			case 1: if (this.longMc) {
				this.longMc.play();
				this.longMc.visible = true;
			} else {
				this.longMc = this.createMc("eff_dragon_body", 180, 245);
			}
				break;
			//龙纹
			case 2: if (this.longW) {
				this.longW.play();
				this.longW.visible = true;
			} else {
				this.longW = this.createMc("eff_dragon_hand", 215, 260);
			}
				break;
			//龙魂
			case 3: if (this.longW1) {
				this.longW1.play();
				this.longW1.visible = true;
			} else {
				this.longW1 = this.createMc("eff_dragon_magic", 200, 360);
			}
				break;
		}
	}
	private clearMc(parent): void {
		let mc: MovieClip;
		if (parent.numChildren > 0) {
			mc = <MovieClip>(parent.getChildAt(0));
			DisplayUtils.dispose(mc);
			mc = null;
		}
	}
	private removeMc(): void {
		if (this.longW) {
			DisplayUtils.dispose(this.longW);
			this.longW = null;
		}
		if (this.mcBar) {
			DisplayUtils.dispose(this.mcBar);
			this.mcBar = null;
		}
		if (this.longW1) {
			DisplayUtils.dispose(this.longW1);
			this.longW1 = null;
		}
		if (this.longMc) {
			DisplayUtils.dispose(this.longMc);
			this.longMc = null;
		}
		this.clearMc(this.effect_one);
		this.clearMc(this.effect_two);
		this.clearMc(this.effect_three);
		this.clearMc(this.effect_four);
	}

	open(...param: any[]) {
		this.upgradeBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTap, this);
		this.btnAutoUp.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTap, this);
		this.getShenzhuangLink.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTap, this);
		GameGlobal.MessageCenter.addListener(MessageDef.LOONGSOUL_LV_CHANGE, this.updateData, this);
		GameGlobal.MessageCenter.addListener(MessageDef.ADD_ITEM, this.updateData, this);
		GameGlobal.MessageCenter.addListener(MessageDef.CHANGE_ITEM, this.updateData, this);
		//删除道具不需要监听
		// GameGlobal.MessageCenter.addListener(MessageDef.DELETE_ITEM, this.updateData, this);
		let currentIndex = 0;
		for (let i = 1; i <= 4; ++i) {
			if (LongHun.ins().CheckRedPointByEquip(i)) {
				currentIndex = i - 1;
				break;
			}
		}
		this.commonWindowBg.OnAdded(this, param[0] ? param[0] : currentIndex);
		// (e.labelDisplay as eui.Label).textColor = 0xFFBF00;
		this.longLine0.visible = currentIndex == 0 ? true : false;
		this.longLine1.visible = currentIndex == 1 ? true : false;
		this.longLine2.visible = currentIndex == 2 ? true : false;
		this.longLine3.visible = currentIndex == 3 ? true : false;
		for (let i = 0; i < this.itemID.length; i++) {
			this.commonWindowBg.initItemImage(i, this.itemID[i]);
		}
	}
	close() {
		this.upgradeBtn.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onTap, this);
		this.btnAutoUp.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onTap, this);
		GameGlobal.MessageCenter.removeListener(MessageDef.LOONGSOUL_LV_CHANGE, this.updateData, this);
		GameGlobal.MessageCenter.removeListener(MessageDef.ADD_ITEM, this.updateData, this);
		GameGlobal.MessageCenter.removeListener(MessageDef.CHANGE_ITEM, this.updateData, this);
		// GameGlobal.MessageCenter.removeListener(MessageDef.DELETE_ITEM, this.updateData, this);
		this.removeMc();
		this.removeObserve();
	}
	onTap(e) {
		switch (e.currentTarget) {
			case this.upgradeBtn:
				if (GlobalConfig.jifengTiaoyueLg.st100208 == this.upgradeBtn.label)
					this.sendUpgrade();
				else if (GlobalConfig.jifengTiaoyueLg.st100242 == this.upgradeBtn.label)
					this.sendStageUpgrade();
				break
			case this.btnAutoUp:
				if (!Deblocking.Check(DeblockingType.TYPE_88)) {
					return;
				}
				let roleId = this.m_RoleSelectPanel.getCurRole();
				let longzhuangdata1 = GameGlobal.rolesModel[roleId].longzhuangdata[0];
				let lvConfig1 = GlobalConfig.longzhuangLevelConfig[1][longzhuangdata1.lv];
				let itemCount1 = UserBag.ins().getBagGoodsCountById(0, lvConfig1.itemId);

				let longzhuangdata2 = GameGlobal.rolesModel[roleId].longzhuangdata[1];
				let lvConfig2 = GlobalConfig.longzhuangLevelConfig[2][longzhuangdata2.lv];
				let itemCount2 = UserBag.ins().getBagGoodsCountById(0, lvConfig2.itemId);

				let longzhuangdata3 = GameGlobal.rolesModel[roleId].longzhuangdata[2];
				let lvConfig3 = GlobalConfig.longzhuangLevelConfig[3][longzhuangdata3.lv];
				let itemCount3 = UserBag.ins().getBagGoodsCountById(0, lvConfig3.itemId);

				let longzhuangdata4 = GameGlobal.rolesModel[roleId].longzhuangdata[3];
				let lvConfig4 = GlobalConfig.longzhuangLevelConfig[4][longzhuangdata4.lv];
				let itemCount4 = UserBag.ins().getBagGoodsCountById(0, lvConfig4.itemId);
				if (itemCount1 < lvConfig1.itemNum && itemCount2 < lvConfig2.itemNum && itemCount3 < lvConfig3.itemNum && itemCount4 < lvConfig4.itemNum) {
					this.openBuyGoods();
					return
				}
				/**一键强化协议 */
				WarnWin.show(GlobalConfig.jifengTiaoyueLg.st100243, () => {
					LongHun.ins().sendLongOneKey(roleId);
				}, this);
				break;
			case this.getShenzhuangLink:
				this.openBuyGoods();
				break;
		}
	}
	onTaps(e) {
		if (null != this._config) {
			var t = GlobalConfig.ins("VipConfig")[this.index > 2 ? 13 : 14].attrAddition.percent;
			let list = [];
			this._config.attr.forEach(function (e) {
				list.push(e.value * t / 100 >> 0);
			});
			ViewManager.ins().open(ForgeTipsWin, list, AttributeData.getAttStr(this._config.attr, 1, 1, ""));
		}
	}

	_config;
	_lvConfig;

	_missingNum;
	private longzhuangCommonConfig: any;
	private longzhuangStarConfig: any;
	/** 获得方式按钮 */
	private getShenzhuangLink: eui.Button;

	private updateEffect(): void {
		for (let i = 0; i < 4; i++) {
			var longzhuangdata = GameGlobal.rolesModel[this.m_RoleSelectPanel.getCurRole()].longzhuangdata[i];
			let lvConfig = GlobalConfig.longzhuangLevelConfig[i + 1][longzhuangdata.lv];
			if (i == 0) {
				if (lvConfig.quality > 0)
					this.addMc(this.effect_one, lvConfig.quality);
				else
					this.effect_one.removeChildren();
			}
			if (i == 1) {
				if (lvConfig.quality > 0)
					this.addMc(this.effect_two, lvConfig.quality);
				else
					this.effect_two.removeChildren();
			}
			if (i == 2) {
				if (lvConfig.quality > 0)
					this.addMc(this.effect_three, lvConfig.quality);
				else
					this.effect_three.removeChildren();
			}
			if (i == 3) {
				if (lvConfig.quality > 0)
					this.addMc(this.effect_four, lvConfig.quality);
				else
					this.effect_four.removeChildren();
			}
			this.commonWindowBg.loadIconBG(i, lvConfig.quality);
		}
	}

	updateData(t = false) {

		if (this.longzhuangCommonConfig == null) {
			this.longzhuangCommonConfig = GlobalConfig.ins("LongzhuangCommonConfig");
		}
		if (this.longzhuangStarConfig == null)
			this.longzhuangStarConfig = GlobalConfig.ins("LongzhuangStarConfig");
		for (let i = 1; i <= 4; ++i) {
			this.commonWindowBg.ShowTalRedPoint(i - 1, LongHun.ins().CheckRedPointByEquip(i));
		}
		for (let i = 0; i < SubRoles.ins().subRolesLen; ++i) {
			this.m_RoleSelectPanel.showRedPoint(i, LongHun.ins().CheckRedPointByRoleEquip(i, this.index + 1));
		}
		// this.updateEffect();暂时隐藏
		var longzhuangdata = GameGlobal.rolesModel[this.m_RoleSelectPanel.getCurRole()].longzhuangdata[this.index];
		this._config = this.longzhuangStarConfig[this.index + 1][longzhuangdata.star];
		this._lvConfig = GlobalConfig.longzhuangLevelConfig[this.index + 1][longzhuangdata.lv];
		this.consumeLabel.consumeType = GlobalConfig.itemConfig[this._lvConfig.itemId].name;
		var attr = AttributeData.AttrAddition(this._config.attr, this._lvConfig.attr);
		// this.attrLabel.SetCurAttr(AttributeData.getAttStr(attr, 0, 1, "："));
		this.longzhuangAttr.setCurrAttr(AttributeData.getAttStr(attr, 0, 1, "："));
		this.powerLabel.text = UserBag.getAttrPower(attr);
		let longzLv: String = "";
		//if(this._lvConfig.)
		//quality;
		var itemCount = UserBag.ins().getBagGoodsCountById(0, this._lvConfig.itemId);
		this.consumeLabel.curValue = itemCount;
		this.consumeLabel.consumeValue = this._lvConfig.itemNum;
		var nextLvConfig = void 0;
		var nextStarConfig = void 0;
		let bLevelUp = false;
		var curStar = longzhuangdata.star % this.longzhuangCommonConfig.starPerLevel;
		var eff_ui_lzs: string[] = ["eff_ui_lzui_005", "eff_ui_lzui_006", "eff_ui_lzui_007", "eff_ui_lzui_008"];
		if (longzhuangdata.star >= (longzhuangdata.lv + 1) * this.longzhuangCommonConfig.starPerLevel && curStar == 0) {
			nextLvConfig = GlobalConfig.longzhuangLevelConfig[this.index + 1][longzhuangdata.lv + 1];
			nextStarConfig = this._config;
			this.upgradeBtn.label = GlobalConfig.jifengTiaoyueLg.st100242;
			this.longzhuangAttr.nameTxt.text = this._lvConfig.name + "9" + GlobalConfig.jifengTiaoyueLg.st100093;
			this.upgradeBtn.x = 175;
			this.expBar.visible = false;
			bLevelUp = true;
			this.consumeLabel.visible = false;
		}
		else {
			nextLvConfig = this._lvConfig;
			nextStarConfig = this.longzhuangStarConfig[this.index + 1][longzhuangdata.star + 1];
			this.upgradeBtn.label = GlobalConfig.jifengTiaoyueLg.st100208;
			this.upgradeBtn.x = 271;
			this.longzhuangAttr.nameTxt.text = this._lvConfig.name + this._config.star % 9 + GlobalConfig.jifengTiaoyueLg.st100093;
			this.expBar.maximum = this._config.exp;
			this.expBar.value = longzhuangdata.exp;
			this.expBar.visible = true;
			this.consumeLabel.visible = true;
		}
		if (nextStarConfig) {
			this.longzhuangAttr.setNextAttr(AttributeData.getAttStr(AttributeData.AttrAddition(nextLvConfig.attr, nextStarConfig.attr), 0, 1, "："));
		} else {
			this.longzhuangAttr.setNextAttr(null);
		}
		if (this.longzhuangCommonConfig.starMax == longzhuangdata.star && longzhuangdata.star < (longzhuangdata.lv + 1) * this.longzhuangCommonConfig.starPerLevel) {
			this.setCountTxt(!1);
			this.btnAutoUp.visible = false;
			if (this.upgradeBtn.label == GlobalConfig.jifengTiaoyueLg.st100208)
				this.upgradeBtn.visible = false;
		}
		else {
			this.setCountTxt(!0);
			this.upgradeBtn.visible = true;
		}
		this.btnAutoUp.visible = this.canShow() && this.upgradeBtn.visible && !bLevelUp;
		this.updateLevel();
	}



	setCountTxt(e) {
		if (e) {
			//this.consumeLabel.consumeType = GlobalConfig.itemConfig[this._lvConfig.itemId].name;
			this.m_FullLab.visible = false;
			this.consumeLabel.visible = true;
		}
		else {
			this.m_FullLab.visible = true;
			this.consumeLabel.visible = false;
			//this.consumeLabel.x = 210;
		}
	}

	/**满足2转才能显示 */
	canShow() {
		if (this.longzhuangCommonConfig == null) {
			this.longzhuangCommonConfig = GlobalConfig.ins("LongzhuangCommonConfig");
		}

		var autoLv = this.longzhuangCommonConfig.autoLv;
		return GameGlobal.actorModel.level >= autoLv[0] || GameGlobal.actorModel.vipLv >= autoLv[1];
	};
	canShowAutoBuy() {
		return true;
	}

	updateLevel() {

		//this.consumeLabel.x = this.btnAutoUp.visible ? 362 : 210;
		this.upgradeBtn.x = this.btnAutoUp.visible ? 271 : 175;
	}

	sendUpgrade() {
		var itemCount = UserBag.ins().getBagGoodsCountById(0, this._lvConfig.itemId)
		if (itemCount < this._lvConfig.itemNum) {
			this.openBuyGoods();
			return
		}
		if (this.longzhuangCommonConfig == null) {
			this.longzhuangCommonConfig = GlobalConfig.ins("LongzhuangCommonConfig");
		}


		if (GameGlobal.actorModel.level >= this.longzhuangCommonConfig.openLevel)
			LongHun.ins().sendUpGrade(this.m_RoleSelectPanel.getCurRole(), this.index + 1, false);
		else
			UserTips.ins().showTips(LanguageString.jifengTiaoyueCh(GlobalConfig.jifengTiaoyueLg.st100244, [this.longzhuangCommonConfig.openLevel]));
	}

	sendStageUpgrade() {
		LongHun.ins().sendStageUpgrade(this.m_RoleSelectPanel.getCurRole(), this.index + 1);
	}

	openBuyGoods() {
		UserWarn.ins().setBuyGoodsWarn(this._lvConfig.itemId, this._missingNum);
	}

	setRedPoint() {
		for (var e = SubRoles.ins().rolesModel, i = 0; i < e.length; i++) {
			this.m_RoleSelectPanel.showRedPoint(i, GameGlobal.roleHintCheck(e[i], this.index));
		}
	}
	OnBackClick(clickType: number): number {
		return 0;
	}
	OnOpenIndex(openIndex: number): boolean {
		this.longLine0.visible = openIndex == 0 ? true : false;
		this.longLine1.visible = openIndex == 1 ? true : false;
		this.longLine2.visible = openIndex == 2 ? true : false;
		this.longLine3.visible = openIndex == 3 ? true : false;
		return true
	}
	windowTitleIconName?: string = GlobalConfig.jifengTiaoyueLg.st100237;
	UpdateContent(): void {
		// this.panelEffect(this.index);
		this.updateData();
	}
	m_RoleSelectPanel: RoleSelectPanel;
}
window["LoongSoulWin"] = LoongSoulWin