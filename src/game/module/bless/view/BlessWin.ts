class BlessWin extends BaseView implements ICommonWindowTitle, ICommonWindowRoleSelect {
	public constructor() {
		super();
		this.skinName = "EquipBlessSkin";
	}

	public bapowerLabel: PowerLabel;
	public bamaxLvTF: eui.Label;
	public baBOTTON_GROUP_FULL: eui.Group;
	public babtnAutoUp: eui.Button;
	public baconsumeLabel: ConsumeLabel;
	public baupGradeBtn: eui.Button;
	public bagetItem: eui.Label;

	blessItem0: BlessItem
	blessItem1: BlessItem
	blessItem2: BlessItem
	blessItem3: BlessItem
	blessItem4: BlessItem
	blessItem5: BlessItem
	blessItem6: BlessItem
	blessItem7: BlessItem
	public blessItem8: BlessItem;


	mc: MovieClip
	getItemTxt: eui.Button;
	back: eui.Label;
	public back0: eui.Label;
	private powerLabel: PowerLabel
	private consumeLabel: ConsumeLabel
	private attrLabel: AttrLabel

	upGradeBtn: eui.Button;
	selectItem: BlessItem;

	selectIndex: number = 0;

	public m_ExpGroup: eui.Group;
	public starList: StarList;
	public m_ExpBar: eui.ProgressBar;
	public m_lvLab: eui.Label;
	public m_LvLab1: eui.Image;


	public m_ActivateGroup: eui.Group;
	public m_AutoUpLvBtn: eui.Button;
	public m_MainBtnGroup: eui.Group;
	public m_UpLvBtn: eui.Button;
	public m_NeedItemGroup: eui.Group;
	public m_AutoBuyBox: eui.CheckBox;
	public m_GetItemBtn: eui.Button;



	public m_NoActivateGroup: eui.Group;
	public m_FullLvLab: eui.Label;
	public m_UpLayerBtn: eui.Button;
	_isAutoUp: boolean = false



	public m_Lan1: eui.Label;

	private itemId: number;
	childrenCreated() {
		super.childrenCreated();
		this.m_Lan1.text = GlobalConfig.jifengTiaoyueLg.st100218;
		this.m_AutoBuyBox.label = GlobalConfig.jifengTiaoyueLg.st101147;
		this.m_FullLvLab.text = GlobalConfig.jifengTiaoyueLg.st101182;
		this.back.text = GlobalConfig.jifengTiaoyueLg.st101183;
		this.back0.text = GlobalConfig.jifengTiaoyueLg.st101183;
		this.m_UpLvBtn.label = GlobalConfig.jifengTiaoyueLg.st100296;
		this.m_UpLayerBtn.label = GlobalConfig.jifengTiaoyueLg.st100242;
		this.m_AutoUpLvBtn.label = GlobalConfig.jifengTiaoyueLg.st101104;
		this.upGradeBtn.label = GlobalConfig.jifengTiaoyueLg.st100212;
	};

	public setComp(bapowerLabel: PowerLabel, bamaxLvTF: eui.Label, group: eui.Group) {
		this.bapowerLabel = bapowerLabel;
		this.bamaxLvTF = bamaxLvTF;
		this.baBOTTON_GROUP_FULL = group;
	}

	private BlessCostConfig: any;
	onGetItem(e) {
		if (this.BlessCostConfig == null)
			this.BlessCostConfig = GlobalConfig.ins("BlessCostConfig");
		UserWarn.ins().setBuyGoodsWarn(this.BlessCostConfig["1"].stoneId, 1);
	};

	setRedPointVisible() {
		this["redPoint0"].visible = false;
	};
	open() {
		/**由于要放到强化那里 */
		if (this.bapowerLabel) {
			this.bapowerLabel.visible = false;
			this.bamaxLvTF.visible = false;
			this.baBOTTON_GROUP_FULL.visible = false;
		}
		for (let i = 0; i < 8; ++i) {
			this["blessItem" + i].setSource(ResDataPath.GetEquipDefaultIcon(i));
			this.addChild(this["blessItem" + i]);
		}
		this.back.textFlow = (new egret.HtmlTextParser).parser("<a href=\"event:\"><u>" + this.back.text + "</u></a>");
		this.back.visible = true;
		this.back0.textFlow = (new egret.HtmlTextParser).parser("<a href=\"event:\"><u>" + this.back0.text + "</u></a>");
		this.back0.visible = true;
		this.m_AutoUpLvBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.btnAutoUpClick, this);
		this.m_UpLvBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onClickUpLvBtn, this);
		this.m_UpLayerBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onClickUpLayer, this);
		this.upGradeBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouch, this);
		this.back.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouch, this);
		this.back0.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouch, this);
		this.getItemTxt.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onGetItem, this);
		this.m_GetItemBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouch, this);
		MessageCenter.addListener(Bless.postBlessSuccess, this.UpdateContent, this);
		MessageCenter.addListener(Bless.ins().postBelssUpdate, this.onEvent, this);
		this.observe(MessageDef.BAG_HAS_ITEM_CAN_USE, this.UpdateContent);
		for (var i = 0; i <= 7; i++) {
			this["blessItem" + i].addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouch, this);
		}
	};
	close() {
		this.m_AutoUpLvBtn.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.btnAutoUpClick, this);
		this.m_UpLvBtn.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onClickUpLvBtn, this);
		this.m_UpLayerBtn.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onClickUpLayer, this);
		this.upGradeBtn.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouch, this);
		this.back.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouch, this);
		this.back0.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouch, this);
		this.m_GetItemBtn.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouch, this);
		MessageCenter.ins().removeAll(this);
		for (var i = 0; i <= 7; i++) {
			this["blessItem" + i].removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouch, this);
		}
		this.selectItem.setIsSelected(false);
		this.stopAutoUp();
	};
    /**
    * 提升后的回调
    */
	onEvent() {
		//lxh资源回收
		if (this.mc == null) {
			this.mc = new MovieClip;
			this.mc.x = 240;
			this.mc.y = 330;
			this.mc.loadUrl(ResDataPath.GetUIEffePath("eff_success_strengthen"), true, 1, () => {
				DisplayUtils.dispose(this.mc);
				this.mc = null;
			});
		}
		else {
			this.mc.play();
		}
		if (this.mc.parent == null)
			this.addChild(this.mc);

		this.UpdateContent();
	};
	setData() {

		var role = SubRoles.ins().getSubRoleByIndex(this.m_RoleSelectPanel.getCurRole());
		this.blessItem0.setData(role.getEquipByIndex(0), 0);
		this.blessItem1.setData(role.getEquipByIndex(1), 1);
		this.blessItem2.setData(role.getEquipByIndex(2), 2);
		this.blessItem3.setData(role.getEquipByIndex(3), 3);
		this.blessItem4.setData(role.getEquipByIndex(4), 4);
		this.blessItem5.setData(role.getEquipByIndex(5), 5);
		this.blessItem6.setData(role.getEquipByIndex(6), 6);
		this.blessItem7.setData(role.getEquipByIndex(7), 7);
	};

	private currole: number = 0;
	UpdateContent() {
		if (this.currole != this.m_RoleSelectPanel.getCurRole()) {
			this.currole = this.m_RoleSelectPanel.getCurRole();
			this.stopAutoUp();
		}
		if (this.selectItem) {
			this.selectItem.setIsSelected(false);
			this.selectItem = null;
		}
		this.setData();
		this.setSelect();
		this.refushCost();
		this.setRoleListRedPoint();
		this.setExp();
	};
	setRoleListRedPoint() {
		this.m_RoleSelectPanel.showRedPoint(0, Bless.ins().checkRoleIsShowRed(0));
		this.m_RoleSelectPanel.showRedPoint(1, Bless.ins().checkRoleIsShowRed(1));
		this.m_RoleSelectPanel.showRedPoint(2, Bless.ins().checkRoleIsShowRed(2));
	};
	refushCost() {
		if (this.BlessCostConfig == null)
			this.BlessCostConfig = GlobalConfig.ins("BlessCostConfig");
		var info = this.BlessCostConfig["1"];
		var itemData = GlobalConfig.itemConfig[info.stoneId];
		this.consumeLabel.consumeType = itemData.name
		var curNum = UserBag.ins().getBagGoodsCountById(0, info.stoneId);
		this.consumeLabel.curValue = curNum
		this.consumeLabel.consumeValue = info.stoneNum
	};
	setSelect(item = null) {
		if (item == null) {
			if (this.selectItem == undefined) {
				// for (var i = 0; i <= 7; i++) {
				// 	if (this["blessItem" + i].getData().bless == 0) {
				// 		this.selectItem = this["blessItem" + i];
				// 		this.selectIndex = i;
				// 		break;
				// 	}
				// 	if (i == 7) {
				// 		this.selectItem = this["blessItem0"];
				// 		this.selectIndex = 0;
				// 	}
				// }
				this.selectItem = this["blessItem" + this.selectIndex];
			}
		}
		else {
			for (var i = 0; i <= 7; i++) {
				this["blessItem" + i].setIsSelected(false);
				if (item == this["blessItem" + i]) {
					this.selectItem = this["blessItem" + i];
					this.selectIndex = i;

				}
			}
		}
		var role = SubRoles.ins().getSubRoleByIndex(this.m_RoleSelectPanel.getCurRole());
		this.blessItem8.setData(role.getEquipByIndex(this.selectIndex), this.selectIndex);
		this.selectItem.setIsSelected(true);
		this.refushProList();
	};
	refushProList() {
		var role = SubRoles.ins().getSubRoleByIndex(this.m_RoleSelectPanel.getCurRole());
		let equipsData: EquipsData = role.getEquipByIndex(this.selectIndex);
		let attr = this.getAllAttr(this.selectIndex, equipsData.blessstar, equipsData.bless > 0);
		this.attrLabel.SetCurAttr(AttributeData.getAttStr(attr, 1))

		let equipBlessStarConfig = GlobalConfig.ins("EquipBlessStarConfig")[this.selectIndex][equipsData.blessstar + 1];
		if (equipBlessStarConfig) {
			let attr1
			if (equipsData.bless > 0) {
				attr1 = this.getAllAttr(this.selectIndex, equipsData.blessstar + 1, true);
			} else {
				attr1 = this.getAllAttr(this.selectIndex, equipsData.blessstar, true);
			}
			this.attrLabel.SetNextAttr(AttributeData.getAttStr(attr1, 1))
		}
		this.powerLabel.text = this.calculateAllPower()
	};
	onTouch(e) {
		switch (e.target) {
			case this.upGradeBtn:
				if (this.selectItem.getData().bless > 0) {
					UserTips.ins().showTips(GlobalConfig.jifengTiaoyueLg.st101184);
					return;
				}
				if (Bless.ins().checkIsEnough()) {
					Bless.ins().sendUpBlessLevel(this.m_RoleSelectPanel.getCurRole(), this.selectIndex);
				}
				else {
					if (this.BlessCostConfig == null)
						this.BlessCostConfig = GlobalConfig.ins("BlessCostConfig");
					var itemData = GlobalConfig.itemConfig[this.BlessCostConfig["1"].stoneId];
					UserTips.ins().showTips(LanguageString.jifengTiaoyueCh(GlobalConfig.jifengTiaoyueLg.st101185, itemData.name));
				}
				break;
			case this.m_GetItemBtn:
				UserWarn.ins().setBuyGoodsWarn(this.itemId);
				break;
			case this.back:
			case this.back0:
				// if (!Bless.ins().isCanBack()) {
				// 	UserTips.ins().showTips("|C:0xf87372&T:三角色所有部位已启灵才能回收圣器之灵|");
				// 	return;
				// }
				let blessCostConfig = GlobalConfig.ins("BlessCostConfig")[1];
				if (blessCostConfig) {
					ViewManager.ins().open(BlessBackGoodsWin, blessCostConfig.stoneId);
				}
				break;
			default:
				this.setSelect(e.target.parent);
				this.setExp();
				break;
		}
	};
	calculateAllPower() {
		var point = 0;
		var list;
		var role = SubRoles.ins().getSubRoleByIndex(this.m_RoleSelectPanel.getCurRole());
		for (var i = 0; i < 8; i++) {
			let equipsData: EquipsData = role.getEquipByIndex(i);
			if (equipsData.bless > 0) {
				let attr = this.getAllAttr(i, equipsData.blessstar, equipsData.bless > 0)
				point += UserBag.getAttrPower(attr);
			}
		}
		return point;
	};

	public setExp() {
		var role = SubRoles.ins().getSubRoleByIndex(this.m_RoleSelectPanel.getCurRole());
		let equipsData: EquipsData = role.getEquipByIndex(this.selectIndex);
		this.m_ExpGroup.visible = false;
		this.m_ActivateGroup.visible = false;
		this.m_NoActivateGroup.visible = false;
		this.m_UpLayerBtn.visible = false;
		this.m_FullLvLab.visible = false;
		this.m_lvLab.visible = true;
		this.m_LvLab1.visible = true;
		if (equipsData.bless > 0) {
			this.m_lvLab.text = equipsData.blesslv + GlobalConfig.jifengTiaoyueLg.st100103;
			this.starList.starNum = equipsData.blessstar % 10;
			let equipBlessStarConfig = GlobalConfig.ins("EquipBlessStarConfig")[this.selectIndex][equipsData.blessstar];
			if (equipBlessStarConfig) {
				this.m_ExpBar.maximum = equipBlessStarConfig.exp;
				this.m_ExpBar.value = equipsData.blessexp;
				if (equipBlessStarConfig.exp == 0) {
					this.m_FullLvLab.visible = true;
				}
				else if (equipsData.blessstar >= equipsData.blesslv * 10) {
					this.starList.starNum = 10;
					this.m_ExpBar.value = this.m_ExpBar.maximum;
					this.m_UpLayerBtn.visible = true;
					this.m_ExpGroup.visible = true;
					this.stopAutoUp();
				} else {
					this.m_ExpGroup.visible = true;
					this.m_ActivateGroup.visible = true;
					let equipBlessLevelConfig = GlobalConfig.ins("EquipBlessLevelConfig")[this.selectIndex][equipsData.blesslv - 1];
					this.itemId = equipBlessLevelConfig.cost[0].id;
					UserBag.ins().setNeedItem(equipBlessLevelConfig.cost, this.m_NeedItemGroup);
				}
			}
		} else {
			this.m_lvLab.visible = false;
			this.m_LvLab1.visible = false;
			this.m_NoActivateGroup.visible = true;
		}

	}

	private onClickUpLayer() {
		var role = SubRoles.ins().getSubRoleByIndex(this.m_RoleSelectPanel.getCurRole());
		Bless.ins().sendUpgradeMsg(role.roleID, this.selectIndex);
	}

	private btnAutoUpClick() {
		if (this._isAutoUp) {
			this.stopAutoUp();
		}
		else {
			this._isAutoUp = true;
			this.m_AutoUpLvBtn.label = GlobalConfig.jifengTiaoyueLg.st101096;
			TimerManager.ins().doTimer(150 * 4, 0, this.autoUpStar, this);
		}
	}
	stopAutoUp() {
		this._isAutoUp = false;
		this.m_AutoUpLvBtn.label = GlobalConfig.jifengTiaoyueLg.st101097;
		TimerManager.ins().remove(this.autoUpStar, this);
	};

	autoUpStar() {
		var role = SubRoles.ins().getSubRoleByIndex(this.m_RoleSelectPanel.getCurRole());
		let equipsData: EquipsData = role.getEquipByIndex(this.selectIndex);
		let equipBlessStarConfig = GlobalConfig.ins("EquipBlessStarConfig")[this.selectIndex][equipsData.blessstar];
		if (equipBlessStarConfig == null && equipBlessStarConfig.exp == 0) {
			this._isAutoUp = false;
			this.m_AutoUpLvBtn.label = GlobalConfig.jifengTiaoyueLg.st101097;
			TimerManager.ins().remove(this.autoUpStar, this);
			UserTips.ins().showTips(GlobalConfig.jifengTiaoyueLg.st101098);
			return;
		}
		let equipBlessLevelConfig = GlobalConfig.ins("EquipBlessLevelConfig")[this.selectIndex][equipsData.blesslv - 1];
		let itemNum = UserBag.ins().getBagGoodsCountById(0, equipBlessLevelConfig.cost[0].id);
		let gold: number = GameLogic.ins().actorModel.gold;
		if (itemNum >= equipBlessLevelConfig.cost[0].count && gold >= equipBlessLevelConfig.cost[1].count) {
			Bless.ins().sendBoostMsg(role.roleID, this.selectIndex, false);
		}
		else {
			if (gold < equipBlessLevelConfig.cost[1].count) {
				UserTips.ins().showTips(GlobalConfig.jifengTiaoyueLg.st100323);
			} else
				//勾选了自动购买材料，先去用钻石购买材料
				if (this.m_AutoBuyBox.selected == true) {
					let lastitemNum = equipBlessLevelConfig.cost[0].count - itemNum;
					if (Checker.Money(MoneyConst.yuanbao, ItemStoreConfig.getStoreByItemID(equipBlessLevelConfig.cost[0].id).price * equipBlessLevelConfig.cost[0].count, Checker.YUNBAO_FRAME)) {
						Bless.ins().sendBoostMsg(role.roleID, this.selectIndex, true);
						return;
					}
				}
				else {
					UserWarn.ins().setBuyGoodsWarn(equipBlessLevelConfig.cost[0].id, equipBlessLevelConfig.cost[0].count - itemNum);
				}
			this._isAutoUp = false;
			this.m_AutoUpLvBtn.label = GlobalConfig.jifengTiaoyueLg.st101097;
			TimerManager.ins().remove(this.autoUpStar, this);
		}
	};

	private onClickUpLvBtn() {
		var role = SubRoles.ins().getSubRoleByIndex(this.m_RoleSelectPanel.getCurRole());
		let equipsData: EquipsData = role.getEquipByIndex(this.selectIndex);
		let equipBlessStarConfig = GlobalConfig.ins("EquipBlessStarConfig")[this.selectIndex][equipsData.blessstar];
		if (equipBlessStarConfig == null && equipBlessStarConfig.exp == 0) {
			UserTips.ins().showTips(GlobalConfig.jifengTiaoyueLg.st101098);
			return;
		}
		let equipBlessLevelConfig = GlobalConfig.ins("EquipBlessLevelConfig")[this.selectIndex][equipsData.blesslv - 1];
		let itemNum = UserBag.ins().getBagGoodsCountById(0, equipBlessLevelConfig.cost[0].id);
		let gold: number = GameLogic.ins().actorModel.gold;
		if (itemNum >= equipBlessLevelConfig.cost[0].count && gold >= equipBlessLevelConfig.cost[1].count) {
			Bless.ins().sendBoostMsg(role.roleID, this.selectIndex, false);
		} else {
			if (gold < equipBlessLevelConfig.cost[1].count) {
				UserTips.ins().showTips(GlobalConfig.jifengTiaoyueLg.st100323);
			} else
				//勾选了自动购买材料，先去用钻石购买材料
				if (this.m_AutoBuyBox.selected == true) {
					let lastitemNum = equipBlessLevelConfig.cost[0].count - itemNum;
					if (Checker.Money(MoneyConst.yuanbao, ItemStoreConfig.getStoreByItemID(equipBlessLevelConfig.cost[0].id).price * equipBlessLevelConfig.cost[0].count, Checker.YUNBAO_FRAME)) {
						Bless.ins().sendBoostMsg(role.roleID, this.selectIndex, true);
						return;
					}
				}
				else {
					UserWarn.ins().setBuyGoodsWarn(equipBlessLevelConfig.cost[0].id, equipBlessLevelConfig.cost[0].count - itemNum);
				}
		}

	}

	private getAllAttr(pos: number, star: number, bless: boolean): { type: number, value: number }[] {
		let mainAttrList = [];
		let attr = [];
		if (bless) {
			var baseAttr = GlobalConfig.ins("BlessAttrConfig")[pos][0].attr;
			for (var i = 0; i < baseAttr.length; i++) {
				let data = { type: baseAttr[i].type, value: baseAttr[i].value };
				mainAttrList.push(data)
			}
			let level = Math.ceil(star / 10);
			if (level == 0) {
				level = 1;
			}
			let equipBlessLevelConfig = GlobalConfig.ins("EquipBlessLevelConfig")[pos][level - 1];
			let levelAttr = equipBlessLevelConfig.attr;
			for (var i = 0; i < levelAttr.length; i++) {
				let data = { type: levelAttr[i].type, value: levelAttr[i].value };
				mainAttrList.push(data);
			}
			let euipBlessStarConfig = GlobalConfig.ins("EquipBlessStarConfig")[pos][star];
			let starAttr = euipBlessStarConfig.attr
			for (var i = 0; i < starAttr.length; i++) {
				let data = { type: starAttr[i].type, value: starAttr[i].value };
				mainAttrList.push(data);
			}
			attr = AttributeData.getAttr([mainAttrList]);
		} else {
			var baseAttr = GlobalConfig.ins("BlessAttrConfig")[pos][0].attr;
			for (var i = 0; i < baseAttr.length; i++) {
				let data = { type: baseAttr[i].type, value: 0 };
				mainAttrList.push(data)
			}
			attr = mainAttrList;
		}
		return attr;
	}

	m_RoleSelectPanel: RoleSelectPanel
}


window["BlessWin"] = BlessWin