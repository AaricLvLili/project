class LegendEquipPanel extends BaseView implements ICommonWindowTitle, ICommonWindowRoleSelect {
	private curIndex
	executeBtn: eui.Button

	curEquipConfigId
	mixAttributes
	grewupAttributes

	private group: eui.Group
	private m_EquipGroup: LegendEquipItem[] = []

	private consumeLabel: ConsumeLabel
	private topLevel: eui.Label
	// private getwayLabel: GetwayLabel
	private getShenzhuangLink: eui.Button;
	private suitAttr: eui.Button
	private suitAttr0: eui.Button
	windowTitleIconName: string = GlobalConfig.jifengTiaoyueLg.st101855
	public m_AttrComp: AttrComp;

	public constructor() {
		super();
		this.skinName = "LegendEquipSkin";
	}

	public static GetLegendEquipId(index: number): number {
		return Number(`1${ForgeConst.EQUIP_POS_TO_SUB[index]}1500`)
	}

	public static GetMaxRank() {
		let max = 1
		for (let key in GlobalConfig.ins("LegendSuitConfig")) {
			if (Number(key) > max) {
				max = Number(key)
			}
		}
		return max
	}

	protected childrenCreated() {
		for (let i = 0; i < this.group.numChildren; ++i) {
			this.m_EquipGroup[i] = new LegendEquipItem(ForgeConst.EQUIP_POS_TO_SUB[i], i, this.group.getChildAt(i), this._Select, this)
		}

		this.consumeLabel.consumeType = GlobalConfig.jifengTiaoyueLg.st100631;//"神装碎片"
		this.curIndex = 0; //0武器，2甲
		this.topLevel.text = GlobalConfig.jifengTiaoyueLg.st100234;
	};
	open() {
		this.getShenzhuangLink.addEventListener(egret.TouchEvent.TOUCH_TAP, this.openSmeltView, this);

		for (let item of this.m_EquipGroup) {
			item.addEventListener()
		}

		this.executeBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.executeCB, this);
		MessageCenter.addListener(UserEquip.ins().postMixGodEquip, this.mixCB, this);
		MessageCenter.addListener(UserBag.postItemAdd, this.UpdateContent, this); //道具添加
		GameGlobal.MessageCenter.addListener(MessageDef.DELETE_ITEM, this.UpdateContent, this); //道具删除
		MessageCenter.addListener(UserBag.postItemChange, this.UpdateContent, this); //道具变更
		this.observe(MessageDef.LEGEND_UPDATE_DRESS, this.UpdateDress)
		this.suitAttr.addEventListener(egret.TouchEvent.TOUCH_TAP, this.ShowSuitAttr, this);
		this.suitAttr0.addEventListener(egret.TouchEvent.TOUCH_TAP, this.ShowSuitAttr0, this);
		MessageCenter.addListener(UserEquip.ins().postSmeltEquipComplete, this.checkHaveLegend, this)
		// this.updateView();
		for (let item of this.m_EquipGroup) {
			item.SetSelect(this.curIndex)
		}
		this.checkHaveLegend();
	};
	close() {
		this.getShenzhuangLink.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.openSmeltView, this);
		for (let item of this.m_EquipGroup) {
			item.removeEventListener()
		}
		this.executeBtn.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.executeCB, this);
		this.suitAttr.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.ShowSuitAttr, this);
		this.suitAttr0.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.ShowSuitAttr0, this);
		MessageCenter.ins().removeAll(this);
	};

	private checkHaveLegend() {
		let itemData = UserBag.ins().getBagEquipByOrangeSplit(5);
		UIHelper.SetBtnJumpEffe(this.getShenzhuangLink, itemData.length > 0);
		this.getShenzhuangLink["redPoint"].visible = itemData.length > 0
	}

	ShowSuitAttr(e) {
		ViewManager.ins().open(GodSuitAttrPanel, SubRoles.ins().getSubRoleByIndex(this._roleId));
	}
	ShowSuitAttr0(e) {
		ViewManager.ins().open(LegendShowPanel, this._roleId);
	}
	executeCB(e) {
		if (this.executeBtn.label == GlobalConfig.jifengTiaoyueLg.st100296) {//升级
			if (this.consumeLabel.curValue < this.consumeLabel.consumeValue) {
				UserTips.ins().showTips("|C:0xf87372&T:" + GlobalConfig.jifengTiaoyueLg.st100632 + "|");//神装装备碎片不足
				return;
			}
			this.grewup();
		} else if (this.executeBtn.label == GlobalConfig.jifengTiaoyueLg.st100613) {
			// this.mix();
			let handle = UserEquip.ins().canEquipHandler[this.curIndex]
			let item = UserBag.ins().getBagGoodsByHandle(UserBag.BAG_TYPE_EQUIP, handle)
			if (item) {
				if (Checker.Level(item.itemConfig.zsLevel, item.itemConfig.level, false)) {
					UserEquip.ins().sendWearEquipment(UserEquip.ins().canEquipHandler[this.curIndex], this.curIndex, this._roleId);
				} else {
					// //wjh,针对原来的做对比处理，之前是有可能玩家2个相同属性装备，会导致这里筛选出做好的装备又穿不上去,在去查找一次
					handle = UserEquip.ins().checkContrast(this.curIndex);
					if (handle) {
						UserEquip.ins().sendWearEquipment(handle, this.curIndex, this._roleId);
					} else {
						UserTips.ins().showTips(LanguageString.jifengTiaoyueCh(GlobalConfig.jifengTiaoyueLg.st100633, [item.itemConfig.zsLevel]))//"达到{0}转可以穿戴"
					}
				}
			}
		} else if (this.executeBtn.label == GlobalConfig.jifengTiaoyueLg.st100640) {//"获 取"
			let id = LegendEquipPanel.GetLegendEquipId(this.curIndex)
			if (id && id > 0) {
				UserWarn.ins().setBuyGoodsWarn(id)
			}
		}
	};
	grewup() {
		var nextEquipConfig = GlobalConfig.itemConfig[this.curEquipConfigId + 1];
		if (nextEquipConfig.level > GameLogic.ins().actorModel.level || nextEquipConfig.zsLevel > UserZs.ins().lv) {
			UserTips.ins().showTips("|C:0xf87372&T:" + GlobalConfig.jifengTiaoyueLg.st100634 + "|");//升级后超过角色等级，无法升级
			return;
		}
		UserEquip.ins().sendGrewupEquip(this._roleId, this.curIndex, true);
	};

	mix() {
		var id = UserEquip.ins().getEquipConfigIDByPosAndQuality(ForgeConst.EQUIP_POS_TO_SUB[this.curIndex], 5, 1, this._roleId, this.curIndex);
		var config = GlobalConfig.itemConfig[id];
		if (config.level <= GameLogic.ins().actorModel.level && config.zsLevel <= UserZs.ins().lv) {
			UserEquip.ins().sendMixEquip(this._roleId, this.curEquipConfigId, this.curIndex);
		}
		else {
			UserTips.ins().showTips("|C:0xf87372&T:" + GlobalConfig.jifengTiaoyueLg.st100635 + "|");//等级不满足，无法合成
		}
	};
	mixCB(roleId, result, configID) {
		if (result == 1) {
			UserTips.ins().showTips("|C:0xf87372&T:" + GlobalConfig.jifengTiaoyueLg.st100636 + "|");//合成失败
			return;
		} else if (result == 0) {
			UserTips.ins().showTips("|C:0xf87372&T:" + GlobalConfig.jifengTiaoyueLg.st100637 + "|");//升级失败
			return;
		} else if (result == 2) {
			UserTips.ins().showTips(GlobalConfig.jifengTiaoyueLg.st100638);//升级成功
			this.UpdateContent();
			return;
		}
		UserTips.ins().showTips(GlobalConfig.jifengTiaoyueLg.st100639);//合成成功,已自动穿戴至角色身上
		this.UpdateContent();
	};
	openSmeltView(e) {
		ViewManager.ins().open(BreakDownListview, ItemConst.LEGEND_FRAGMENT, 5);
	};

	private _Select(index: number) {
		this.curIndex = index
		for (let item of this.m_EquipGroup) {
			item.SetSelect(index)
		}
		this.UpdateContent()

	}

	UpdateContent() {
		UserEquip.ins().updateEquipHandler();
		this.updateAttrPanel();
		this.updateIconAndDesc();
		for (let i = 0; i < SubRoles.ins().subRolesLen; ++i) {
			this.m_RoleSelectPanel.showRedPoint(i, LegendModel.ins().IsRedPointByRole(i))
		}
		UIHelper.SetCircleEffe(this.suitAttr0, LegendModel.ins().IsNewDress(this.m_RoleSelectPanel.curRole), 36, 33)
		this.UpdateDress()
	};

	public UpdateDress() {
		let role = SubRoles.ins().getSubRoleByIndex(this.m_RoleSelectPanel.curRole)
		let showRedPoint = false
		if (role.legendDress == null) {
			let [maxStage, maxFullStage] = LegendModel.GetFullStageByRoleIndex(this.m_RoleSelectPanel.curRole)
			if (maxFullStage > 0) {
				showRedPoint = true
			}
		}
		UIHelper.ShowRedPoint(this.suitAttr0, showRedPoint)
	}

	static _GetConfigIDByNumber(index, num = 0) {
		return 100000 + num + (ForgeConst.EQUIP_POS_TO_SUB[index]) * 10000 + 5 * 100 + 1000 * 1;
	}
	updateAttrPanel() {
		var equipData = SubRoles.ins().getSubRoleByIndex(this._roleId).getEquipByIndex(this.curIndex);
		var nextEquipData = GlobalConfig.itemConfig[equipData.goditem.configID + 1];
		var needNum = null
		var costID = 0;

		this.getShenzhuangLink.visible = true
		this.topLevel.visible = false
		if (nextEquipData == undefined && equipData.goditem.handle != 0 && GlobalConfig.itemConfig[equipData.goditem.configID].quality == 5) {
			this.mixAttributes.visible = true;
			this.grewupAttributes.visible = false;
			this.curEquipConfigId = this.updateMixPanel(5);
			this.executeBtn.visible = false;
			this.consumeLabel.visible = false
			this.topLevel.visible = true
			this.m_AttrComp.setLeftLab(GlobalConfig.jifengTiaoyueLg.st101858);
		} else {
			if (nextEquipData != undefined && equipData.goditem.handle != 0 && GlobalConfig.itemConfig[equipData.goditem.configID].quality == 5) {
				this.mixAttributes.visible = false;
				this.grewupAttributes.visible = true;
				this.curEquipConfigId = this.updateGrewupPanel();
				this.executeBtn.label = GlobalConfig.jifengTiaoyueLg.st100296;//升级
				var grewupConfig = GlobalConfig.legendLevelupConfig[this.curEquipConfigId];
				needNum = grewupConfig.count;
				costID = grewupConfig.itemId;
			} else {
				this.mixAttributes.visible = true;
				this.grewupAttributes.visible = false;
				this.curEquipConfigId = this.updateMixPanel();
				this.executeBtn.label = UserEquip.ins().canEquipHandler[this.curIndex] > 0 ? GlobalConfig.jifengTiaoyueLg.st100613 : GlobalConfig.jifengTiaoyueLg.st100640;//"穿 戴":"获 取"
				this.m_AttrComp.setLeftLab(GlobalConfig.jifengTiaoyueLg.st101859);
			}
			this.executeBtn.visible = true;
			if (needNum) {
				var curNum = UserBag.ins().getBagGoodsCountById(0, costID);
				this.consumeLabel.curValue = curNum
				this.consumeLabel.consumeValue = needNum
				this.consumeLabel.visible = true
			} else {
				this.consumeLabel.visible = false
			}
		}
	};

	updateMixPanel(configNumber: number = 0) {
		var level = GameLogic.ins().actorModel.level;
		var configID = LegendEquipPanel._GetConfigIDByNumber(this.curIndex, configNumber);
		var config = GlobalConfig.equipConfig[configID];
		var baseAttrList = [];
		for (var k in AttributeData.translate) {
			if (config[k] <= 0)
				continue;
			if (config[k]) {
				let newAttrData = { type: AttributeData.translate[k], value: config[k] };
				baseAttrList.push(newAttrData)
			}
		}
		if (config.baseAttr) {
			for (var i = 0; i < config.baseAttr.length; i++) {
				let baseAttr = { type: config.baseAttr[i].type, value: config.baseAttr[i].value };
				baseAttrList.push(baseAttr);
			}
		}
		this._SetAttrIcon01(this.mixAttributes['icon'], configID, configNumber == 5)
		this.m_AttrComp.setState("state2");
		this.m_AttrComp.setLeftAttr(baseAttrList);
		return configID;
	};
	updateGrewupPanel() {
		var equipData = SubRoles.ins().getSubRoleByIndex(this._roleId).getEquipByIndex(this.curIndex);
		var configID = equipData.goditem.configID;
		var curItemData = GlobalConfig.itemConfig[configID];
		var nextItemData = GlobalConfig.itemConfig[configID + 1];
		if (nextItemData == undefined) {
		}
		else {
			var nameList = [];
			var baseAttrList = [];
			var randAttrList = [];
			var nextBaseAttrList = [];
			var nextRandAttrList = [];
			var curEquipData = GlobalConfig.equipConfig[configID];
			var nextEquipData = GlobalConfig.equipConfig[configID + 1];
			var data = equipData.goditem;
			for (var k in AttributeData.translate) {
				if (curEquipData[k] <= 0)
					continue;
				if (data != undefined) {
					var attr = data.att;
					for (var index = 0; index < attr.length; index++) {
						if (attr[index].type == AttributeData.translate[k]) {
							randAttrList.push(' +' + attr[index].value + "%");
							break;
						}
					}
				}
				//  else {
				// 	randAttrList.push(" +?%");
				// }
				let newAttrData = { type: AttributeData.translate[k], value: curEquipData[k] };
				let nextAttrData = { type: AttributeData.translate[k], value: nextEquipData[k] };
				baseAttrList.push(newAttrData);
				nextBaseAttrList.push(nextAttrData);
				// nextRandAttrList.push(" +?%");
				nameList.push(AttributeData.getAttrStrByType(AttributeData.translate[k]));
			}
			if (curEquipData.baseAttr) {
				for (var i = 0; i < curEquipData.baseAttr.length; i++) {
					let baseAttr = { type: curEquipData.baseAttr[i].type, value: curEquipData.baseAttr[i].value };
					baseAttrList.push(baseAttr);
				}
			}
			if (nextEquipData.baseAttr) {
				for (var i = 0; i < nextEquipData.baseAttr.length; i++) {
					let nextgbaseAttr = { type: nextEquipData.baseAttr[i].type, value: nextEquipData.baseAttr[i].value };
					nextBaseAttrList.push(nextgbaseAttr);
				}
			}
			this._SetAttrIcon01(this.grewupAttributes["curIcon"], configID)
			this._SetAttrIcon01(this.grewupAttributes["nextIcon"], configID + 1)
			this.m_AttrComp.setState("state1")
			this.m_AttrComp.setLeftLab(GlobalConfig.jifengTiaoyueLg.st101858);
			this.m_AttrComp.setRightLab(GlobalConfig.jifengTiaoyueLg.st101859);
			this.m_AttrComp.setLeftAttr(baseAttrList, randAttrList);
			this.m_AttrComp.setRightAttr(nextBaseAttrList, nextRandAttrList);
		}
		return configID;
	};

	private _SetOtherAttr(label, config, notName = false) {
		if (label == null) {
			return
		}
		if (config.baseAttr != null) {
			label.visible = true
			label.text = AttributeData.getAttStrByType(config.baseAttr[0], 0, "+", false, !notName)
		} else {
			label.visible = false
		}
	}

	private _SetAttrIcon01(comp, itemId, notGray = true) {
		let config = GlobalConfig.itemConfig[itemId]
		comp["icon"].source = notGray ? ResDataPath.GetItemFullName(config.icon) : LegendEquipItem.DEACTIVATE_IMG[config.subType]
		comp["nameTxt"].text = config.name
		comp["level"].text = `${config.zsLevel}${GlobalConfig.jifengTiaoyueLg.st100067}`
	}

	updateIconAndDesc() {
		for (let item of this.m_EquipGroup) {
			item.UpdateItem(SubRoles.ins().getSubRoleByIndex(this._roleId))
		}
	}

	m_RoleSelectPanel: RoleSelectPanel

	private get _roleId(): number {
		return this.m_RoleSelectPanel.getCurRole()
	}
}

class LegendEquipItem {
	private m_Item: {
		title: eui.Label,
		icon: eui.Image,
		select: eui.Image,
		redPoint: eui.Image,
		level: eui.Label,

		currentState: any,
	}

	private m_EquipType
	private m_EquipIndex
	private m_Callback
	private m_ThisObject

	public constructor(equipType: number, equipIndex: number, comp, click, thisObject) {
		this.m_EquipType = equipType
		this.m_EquipIndex = equipIndex
		this.m_Item = comp

		this.m_Callback = click
		this.m_ThisObject = thisObject
	}

	public SetSelect(index: number) {
		this.m_Item.select.visible = this.m_EquipIndex == index
	}

	static ACTIVATE_IMG = {
		[EquipType.WEAPON]: "101501_png",
		[EquipType.HEAD]: "111501_png",
		[EquipType.CLOTHES]: "121501_png",
		[EquipType.NECKLACE]: "131501_png",
		[EquipType.BRACELET]: "141501_png",
		[EquipType.RING]: "151501_png",
	}

	static DEACTIVATE_IMG = {
		// [EquipPos.WEAPON]: "treasure_legend_01",
		// [EquipPos.CLOTHES]: "treasure_legend_02",

		[EquipType.WEAPON]: "101501_1_png",
		[EquipType.HEAD]: "111501_1_png",
		[EquipType.CLOTHES]: "121501_1_png",
		[EquipType.NECKLACE]: "131501_1_png",
		[EquipType.BRACELET]: "141501_1_png",
		[EquipType.RING]: "151501_1_png",
	}

	public UpdateItem(role: Role) {
		this.m_Item.currentState = "normal"

		// if (this.m_EquipType != EquipType.RING) {
		this.m_Item.redPoint.visible = UserEquip.ins().setLegendEquipItemState(this.m_EquipIndex, role)
		// }

		let equipData = role.getEquipByIndex(this.m_EquipIndex)

		var configID = equipData.goditem.configID != 0 ? equipData.goditem.configID : LegendEquipPanel._GetConfigIDByNumber(this.m_EquipIndex);
		// var configID = UserEquip.ins().getEquipConfigIDByPosAndQuality(this.m_EquipType, 5, 1, roleIndex, this.m_EquipIndex);
		let configData = GlobalConfig.itemConfig[configID]
		this.m_Item.title.text = configData.name.split("(")[0]

		var zhuan = GlobalConfig.itemConfig[configID].zsLevel;
		if (equipData.goditem.handle != 0 && GlobalConfig.itemConfig[equipData.goditem.configID].quality == 5) {
			var itemConfig = GlobalConfig.itemConfig[equipData.goditem.configID];

			// this.m_Item.icon.source = LegendEquipItem.ACTIVATE_IMG[this.m_EquipIndex]
			this.m_Item.icon.source = itemConfig.icon + "_png"
			// this.m_Item.level.text = `${itemConfig.zsLevel}转`
			this.m_Item.level.text = `${LegendModel.GetStage(equipData.goditem.configID)}${GlobalConfig.jifengTiaoyueLg.st100103}`

		} else {
			this.m_Item.icon.source = LegendEquipItem.DEACTIVATE_IMG[this.m_EquipType]
			// this.m_Item.level.text = `${zhuan}转`
			// this.m_Item.level.text = `${LegendModel.GetStage(configID)}阶`
			this.m_Item.level.text = ""
		}
	};

	private _Click() {
		if (this.m_Callback) {
			this.m_Callback.call(this.m_ThisObject, this.m_EquipIndex)
		}
	}

	public addEventListener() {
		(<any>this.m_Item).addEventListener(egret.TouchEvent.TOUCH_TAP, this._Click, this)
	}

	public removeEventListener() {
		(<any>this.m_Item).removeEventListener(egret.TouchEvent.TOUCH_TAP, this._Click, this)
	}
}
window["LegendEquipPanel"] = LegendEquipPanel
window["LegendEquipItem"] = LegendEquipItem