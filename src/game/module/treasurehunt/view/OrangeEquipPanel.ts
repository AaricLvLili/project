class OrangeEquipPanel extends BaseView implements ICommonWindowTitle, ICommonWindowRoleSelect {

	private CONST_GREWUP = "state1";/**升级 */
	private CONST_MIX = "state2";/**合成 */
	private state = "state1";
	public grewupPanel: eui.Component;
	public mixPanel: eui.Component;

	public equip0: eui.Component;
	public equip2: eui.Component;
	public equip4: eui.Component;
	public equip6: eui.Component;
	public equip1: eui.Component;
	public equip3: eui.Component;
	public equip5: eui.Component;
	public equip7: eui.Component;

	public num_label: eui.Label;


	public executeBtn: eui.Button;
	public getTreasureBtn: eui.Button;
	public topLevel: eui.Label;

	private EquipConfig: any;
	private curEquipConfigId: any;
	private curIndex: any;
	private needNum = 0;
	private currentNum = 0;
	private dec_label: eui.Label;

	public m_EffGroup0: eui.Group;
	public m_EffGroup1: eui.Group;

	windowTitleIconName: string = GlobalConfig.jifengTiaoyueLg.st100630;
	public m_AttrComp: AttrComp;
	public m_GetLab: eui.Label;

	public constructor() {
		super();
		this.skinName = "OrangeEquipSkin";
		this.dec_label.text = GlobalConfig.jifengTiaoyueLg.st101844;
		this.topLevel.text = GlobalConfig.jifengTiaoyueLg.st101857;
		this.executeBtn.label = GlobalConfig.jifengTiaoyueLg.st101856;
		this.m_GetLab.textFlow = <Array<egret.ITextElement>>[
			{ text: GlobalConfig.jifengTiaoyueLg.st101865, style: { "underline": true } }];
	}
	protected childrenCreated() {
		this.name = GlobalConfig.jifengTiaoyueLg.st100630;
		this.curIndex = 1;//0;
		this.getTreasureBtn.touchEnabled = true;
	};
	open() {
		this.AddClick(this.m_GetLab, this.onClickGet);
		this.AddClick(this.getTreasureBtn, this.openSmeltView)
		for (var i = 0; i < 8; i++) {

			var equipItem = this["equip" + i];
			equipItem.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onSelect, this);
			equipItem.mixBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onSelect, this);
		}
		this.executeBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.executeCB, this);
		MessageCenter.addListener(UserEquip.ins().postMixEquip, this.mixCB, this);
		MessageCenter.addListener(UserBag.postItemAdd, this.UpdateContent, this); //道具添加
		GameGlobal.MessageCenter.addListener(MessageDef.DELETE_ITEM, this.UpdateContent, this); //道具删除
		MessageCenter.addListener(UserBag.postItemChange, this.UpdateContent, this); //道具变更
		this.curIndex = this.computerCurIndex();

	};
	close() {

		for (var i = 0; i < 8; i++) {

			var equipItem = this["equip" + i];
			equipItem.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onSelect, this);
			equipItem.mixBtn.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onSelect, this);
		}
		this.executeBtn.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.executeCB, this);
		MessageCenter.ins().removeAll(this);
	};
	onSelect(e) {
		var level = GameLogic.ins().actorModel.level;
		switch (e.currentTarget) {
			case this.equip0:
			case this.equip0['mixBtn']:
				this.curIndex = 0;
				break;
			case this.equip1:
			case this.equip1['mixBtn']:
				this.curIndex = 1;
				break;
			case this.equip2:
			case this.equip2['mixBtn']:
				this.curIndex = 2;
				break;
			case this.equip3:
			case this.equip3['mixBtn']:
				this.curIndex = 3;
				break;
			case this.equip4:
			case this.equip4['mixBtn']:
				this.curIndex = 4;
				break;
			case this.equip5:
			case this.equip5['mixBtn']:
				this.curIndex = 5;
				break;
			case this.equip6:
			case this.equip6['mixBtn']:
				this.curIndex = 6;
				break;
			case this.equip7:
			case this.equip7['mixBtn']:
				this.curIndex = 7;
				break;
		}

		this.UpdateContent(false);
	};

	executeCB(e) {
		this.UpdateContent();


		if (this.currentNum < this.needNum) {
			UserTips.ins().showTips(GlobalConfig.jifengTiaoyueLg.st100217);
			return;
		}

		if (this.state == this.CONST_GREWUP) {
			this.grewup();
		}
		else if (this.state == this.CONST_MIX) {
			var equipData = SubRoles.ins().getSubRoleByIndex(this._roleId).getEquipByIndex(this.curIndex);
			var configID = equipData.item.configID;
			var curItemData = GlobalConfig.itemConfig[configID];
			if (curItemData != undefined && curItemData.quality == 5) {
				var config = GlobalConfig.itemConfig[equipData.item.configID];
				var str = config.zsLevel > 0 ? (LanguageString.jifengTiaoyueCh(GlobalConfig.jifengTiaoyueLg.st101367, [config.zsLevel])) : (LanguageString.jifengTiaoyueCh(GlobalConfig.jifengTiaoyueLg.st101368, [config.level]));
				WarnWin.show(LanguageString.jifengTiaoyueCh(GlobalConfig.jifengTiaoyueLg.st101843, [str]), () => {
					this.mix();
				}, this);
			}
			else {
				this.mix();
			}
		}
	};
	grewup() {
		var nextEquipConfig = GlobalConfig.itemConfig[this.curEquipConfigId + 1];
		if (nextEquipConfig.level > GameLogic.ins().actorModel.level || nextEquipConfig.zsLevel > UserZs.ins().lv) {
			UserTips.ins().showTips(GlobalConfig.jifengTiaoyueLg.st101677);
			return;
		}
		UserEquip.ins().sendGrewupEquip(this._roleId, this.curIndex);
	};

	mix() {
		UserEquip.ins().sendMixEquip(this._roleId, this.curEquipConfigId, this.curIndex);
	};
	mixCB(roleId, result, configID) {
		if (result == 1) {
			UserTips.ins().showTips(GlobalConfig.jifengTiaoyueLg.st101678);
			return;
		} else if (result == 0) {
			UserTips.ins().showTips(GlobalConfig.jifengTiaoyueLg.st101679);
			return;
		} else if (result == 2) {
			this.playBodyEff();
			UserTips.ins().showTips(GlobalConfig.jifengTiaoyueLg.st100638);
			this.UpdateContent(false);
			return;
		}
		this.playBodyEff();
		UserTips.ins().showTips(GlobalConfig.jifengTiaoyueLg.st100639);
		// egret.setTimeout(function () {
		this.UpdateContent(false);
		// }, this, 300);

	};
	openSmeltView(e) {
		ViewManager.ins().open(BreakDownListview, 200007, 4);
	};

	private legendComposeConfig: any;
	updateDetailPanel() {
		var equipData = SubRoles.ins().getSubRoleByIndex(this._roleId).getEquipByIndex(this.curIndex);
		if (equipData == null)
			return;
		var nextEquipData = GlobalConfig.itemConfig[equipData.item.configID + 1];
		//var needNum = 0;
		var costID = 0;
		if (nextEquipData == undefined && equipData.item.handle != 0 && GlobalConfig.itemConfig[equipData.item.configID].quality == 4) {
			this.mixPanel.visible = true;
			this.grewupPanel.visible = false;
			this.curEquipConfigId = this.updateMixPanel(true);
			this.topLevel.visible = true;
			this.executeBtn.visible = false;
			this.dec_label.visible = false;
			this.num_label.text = "";
			this.mixPanel["m_ImgBg"].visible = false;
			this.mixPanel["m_NowItem"].visible = false;
			this.mixPanel["m_ItemGroup"].y = 162;
			this.mixPanel['equipName0'].visible = false;
			this.m_AttrComp.setLeftLab(GlobalConfig.jifengTiaoyueLg.st101858);
		}
		else {
			if (nextEquipData != undefined && equipData.item.handle != 0 && equipData.item.itemConfig.quality == 4) {
				this.mixPanel.visible = false;
				this.grewupPanel.visible = true;
				this.curEquipConfigId = this.updateGrewupPanel();
				this.state = this.CONST_GREWUP;
				var grewupConfig = GlobalConfig.legendLevelupConfig[this.curEquipConfigId];

				this.needNum = grewupConfig.count;
				costID = grewupConfig.itemId;
				let config = GlobalConfig.ins("ItemConfig")[costID];
				this.dec_label.text = GlobalConfig.jifengTiaoyueLg.st100218 + config.name + ":"
				this.upDataGrewupItme(grewupConfig);
			}
			else {
				this.mixPanel.visible = true;
				this.grewupPanel.visible = false;
				this.curEquipConfigId = this.updateMixPanel(false);
				this.state = this.CONST_MIX;
				if (this.legendComposeConfig == null)
					this.legendComposeConfig = GlobalConfig.ins("LegendComposeConfig");

				var mixConfig = this.legendComposeConfig[this.curEquipConfigId];
				this.needNum = mixConfig.count;
				costID = mixConfig.itemId;
				let config = GlobalConfig.ins("ItemConfig")[costID];
				this.dec_label.text = GlobalConfig.jifengTiaoyueLg.st100218 + config.name + ":"
				this.upDateMixItemData(mixConfig);
				this.m_AttrComp.setLeftLab(GlobalConfig.jifengTiaoyueLg.st101859);
			}
			this.currentNum = UserBag.ins().getBagGoodsCountById(0, costID);

			if (this.currentNum >= this.needNum) {
				this.num_label.textFlow = (new egret.HtmlTextParser).parse("<font color='0x2ECA22'>" + this.currentNum + "</font>/" + this.needNum);
			} else {
				this.num_label.textFlow = (new egret.HtmlTextParser).parse("<font color='0xf87372'>" + this.currentNum + "</font>/" + this.needNum);
			}

			this.topLevel.visible = false;
			this.executeBtn.visible = true;
			this.dec_label.visible = true;

		}
	};

	private upDateMixItemData(mixConfig: any) {
		this.mixPanel["m_ItemGroup"].y = 223;
		this.mixPanel["m_ImgBg"].visible = true;
		let config = GlobalConfig.ins("ItemConfig")[mixConfig.itemId];
		this.mixPanel['m_NowItem'].visible = true;
		this.mixPanel['m_NowItem'].setData(config);
		this.mixPanel['equipName0'].visible = true;
		this.mixPanel['equipName0'].text = config.name;
	}
	private upDataGrewupItme(grewupConfig: any) {
		let needItemConfig = GlobalConfig.ins("ItemConfig")[grewupConfig.itemId];
		let equipItemConfig = GlobalConfig.ins("ItemConfig")[grewupConfig.oldEquipId];
		this.grewupPanel['m_NowName'].text = equipItemConfig.name + "";
		if (equipItemConfig.zsLevel > 0) {
			this.grewupPanel['m_NowLv'].text = LanguageString.jifengTiaoyueCh(GlobalConfig.jifengTiaoyueLg.st101367, [equipItemConfig.zsLevel]);
		}
		else {
			this.grewupPanel['m_NowLv'].text = "Lv." + equipItemConfig.level;
		} this.grewupPanel['m_NowItem'].setData(equipItemConfig);
		this.grewupPanel['m_NeedItem'].setData(needItemConfig);
		this.grewupPanel['m_NowName0'].text = needItemConfig.name;
	}

	updateMixPanel(isFull: boolean) {
		var level = GameLogic.ins().actorModel.level;
		var itemData;
		var configID;
		if (level >= 1) {
			// let id = "1";
			var pos = this.curIndex;
			if (pos == 4 || pos == 5)
				pos = 4;
			if (pos == 6 || pos == 7)
				pos = 5;
			var role = SubRoles.ins().getSubRoleByIndex(this._roleId);
			configID = UserEquip.ins().getEquipConfigIDByPosAndQuality(pos, 4, role.job, role.roleID, this.curIndex);
			itemData = GlobalConfig.itemConfig[configID];
		}
		if (itemData != undefined) {
			if (itemData.zsLevel > 0) {
				this.mixPanel['level'].text = LanguageString.jifengTiaoyueCh(GlobalConfig.jifengTiaoyueLg.st101367, [itemData.zsLevel]);
			}
			else {
				this.mixPanel['level'].text = "Lv." + itemData.level;
			}
			this.mixPanel['equipName'].text = itemData.name;
			this.mixPanel['itemIcon'].imgJob.visible = false;
			this.mixPanel['itemIcon'].setData(itemData);
		}
		// detail
		var nameList = [];
		var baseAttrList = [];
		var randAttrList = [];
		if (this.EquipConfig == null)
			this.EquipConfig = GlobalConfig.equipConfig;
		let config = this.EquipConfig[configID];
		var equipData = SubRoles.ins().getSubRoleByIndex(this._roleId).getEquipByIndex(this.curIndex);
		for (var k in AttributeData.translate) {
			if (config[k] <= 0)
				continue;
			if (isFull) {
				var data = equipData.item;
				if (data != undefined) {
					var attr = data.att;
					for (var index = 0; index < attr.length; index++) {
						if (attr[index].type == AttributeData.translate[k]) {
							randAttrList.push(' +' + attr[index].value + "%");
							break;
						}
					}
				}
			} else {
				randAttrList.push(" +?%");
			}
			let newAttrData = { type: AttributeData.translate[k], value: config[k] };
			baseAttrList.push(newAttrData);
			nameList.push(AttributeData.getAttrStrByType(AttributeData.translate[k]));
		}
		this.m_AttrComp.setState("state2");
		this.m_AttrComp.setLeftAttr(baseAttrList, randAttrList);
		return configID;
	};

	updateGrewupPanel() {
		var equipData = SubRoles.ins().getSubRoleByIndex(this._roleId).getEquipByIndex(this.curIndex);
		var configID = equipData.item.configID;
		var curItemData = GlobalConfig.itemConfig[configID];
		var nextItemData = GlobalConfig.itemConfig[configID + 1];
		if (nextItemData == undefined) {
		}
		else {
			this.grewupPanel['nextName'].text = nextItemData.name + "";
			if (nextItemData.zsLevel > 0) {
				this.grewupPanel['nextLevel'].text = LanguageString.jifengTiaoyueCh(GlobalConfig.jifengTiaoyueLg.st101367, [nextItemData.zsLevel]);
			}
			else {
				this.grewupPanel['nextLevel'].text = "Lv." + nextItemData.level;
			}
			this.grewupPanel['nextItemIcon'].imgJob.visible = false;
			this.grewupPanel['nextItemIcon'].setData(nextItemData);
			var nameList = [];
			var baseAttrList = [];
			var randAttrList = [];
			var nextBaseAttrList = [];
			var nextRandAttrList = [];
			if (this.EquipConfig == null)
				this.EquipConfig = GlobalConfig.equipConfig;
			var curEquipData = this.EquipConfig[configID];
			var nextEquipData = this.EquipConfig[configID + 1];
			var data = equipData.item;
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
				let newAttrData = { type: AttributeData.translate[k], value: curEquipData[k] };
				let nextAttrData = { type: AttributeData.translate[k], value: nextEquipData[k] };
				baseAttrList.push(newAttrData);
				nextBaseAttrList.push(nextAttrData);
				nextRandAttrList.push(" +?%");
				nameList.push(AttributeData.getAttrStrByType(AttributeData.translate[k]));
			}
			this.m_AttrComp.setState("state1")
			this.m_AttrComp.setLeftLab(GlobalConfig.jifengTiaoyueLg.st101858);
			this.m_AttrComp.setRightLab(GlobalConfig.jifengTiaoyueLg.st101859);
			this.m_AttrComp.setLeftAttr(baseAttrList, randAttrList);
			this.m_AttrComp.setRightAttr(nextBaseAttrList, nextRandAttrList);
		}
		return configID;
	};
	updateAllEquipItem() {
		for (var i = 0; i < 8; i++) {
			this.updateEquipItem(i);
		}
	};
	updateEquipItem(index) {
		var equipItem = this["equip" + index];
		if (equipItem == null)
			return;
		var equipData = SubRoles.ins().getSubRoleByIndex(this._roleId).getEquipByIndex(index);
		var itemIcon = equipItem.itemIcon;
		itemIcon.imgJob.visible = false;
		if (equipData.item.handle == 0 || equipData.item.itemConfig.quality < 4) {
			itemIcon.setData(null);
			itemIcon.imgIcon.source = ResDataPath.GetEquipDefaultIcon(index)// OrangeEquipPanel.defaultEquipIcon[index];
			equipItem.level.text = "";

		}
		else {
			equipItem.mixBtn.visible = false;
			if (equipData.item.itemConfig.zsLevel > 0) {
				equipItem.level.text = LanguageString.jifengTiaoyueCh(GlobalConfig.jifengTiaoyueLg.st101367, [equipData.item.itemConfig.zsLevel]);
			}
			else {
				equipItem.level.text = "Lv." + equipData.item.itemConfig.level;
			}
			itemIcon.setData(equipData.item.itemConfig);
		}
		if (this.curIndex == index) {
			equipItem.select.visible = true;
		}
		else {
			equipItem.select.visible = false;
		}

	};
	setItemRedPoint() {
		for (var i = 0; i < EquipPos.MAX; i++) {
			var equipItem = this["equip" + i];
			equipItem["redPoint"].visible = UserEquip.ins().setOrangeEquipItemState(i, SubRoles.ins().getSubRoleByIndex(this._roleId));
		}
		for (let i = 0; i < SubRoles.ins().subRolesLen; ++i) {
			this.m_RoleSelectPanel.showRedPoint(i, UserEquip.ins().CheckOrangeRedPointByRoleIndex(i))
		}
	};
	computerCurIndex() {
		let role: Role = SubRoles.ins().getSubRoleByIndex(this._roleId)
		for (let i = 0; i < EquipPos.MAX; ++i) {
			if (UserEquip.ins().setOrangeEquipItemState(i, role)) {
				return i
			}
		}
		return 1;
	};

	static defaultEquipIcon = [
		"xb_10",
		"xb_11",
		"xb_12",
		"xb_13",
		"xb_14",
		"xb_14",
		"xb_15",
		"xb_15",
	];


	UpdateContent(flg: boolean = true): void {

		// 2018.1.26 zy橙色装备自动选中可合成item逻辑
		if (flg) {
			let role: Role = SubRoles.ins().getSubRoleByIndex(this._roleId)
			for (let i = 0; i < EquipPos.MAX; ++i) {
				let index = (this.curIndex + i) % EquipPos.MAX
				if (UserEquip.ins().setOrangeEquipItemState(index, role)) {
					this.curIndex = index;
					break
				}
			}
		}

		this.updateAllEquipItem();
		this.updateDetailPanel();
		this.setItemRedPoint();
		this.updateGetTreasureBtnState();
		this.getTreasureBtn["redPoint"].visible = UserBag.ins().getBagEquipByOrangeSplit(4).length > 0
	}

	m_RoleSelectPanel: RoleSelectPanel

	get _roleId(): number {
		return this.m_RoleSelectPanel.getCurRole()
	}

	/**更新获得橙装碎片特效*/
	private updateGetTreasureBtnState(): void {
		let itemList = UserBag.ins().getBagEquipByOrangeSplit(4);
		UIHelper.SetBtnJumpEffe(this.getTreasureBtn, itemList.length > 0);
	}

	private m_MainEff1: MovieClip;
	private m_MainEff2: MovieClip;
	private m_Eff1: MovieClip;
	private m_Eff2: MovieClip;
	private m_Eff3: MovieClip;
	private m_Eff4: MovieClip;
	private m_Eff5: MovieClip;
	private playBodyEff() {
		this.m_MainEff1 = ViewManager.ins().createEff(this.m_MainEff1, this.mixPanel["m_MianEffGroup"], "eff_ui_iconUpgrade");
		this.m_MainEff2 = ViewManager.ins().createEff(this.m_MainEff2, this.grewupPanel["m_MianEffGroup"], "eff_ui_iconUpgrade");
		this.m_Eff1 = ViewManager.ins().createEff(this.m_Eff1, this.mixPanel["m_EffGroup"], "eff_ui_icon");
		this.m_Eff2 = ViewManager.ins().createEff(this.m_Eff2, this.grewupPanel["m_EffGroup"], "eff_ui_icon");
		this.m_Eff3 = ViewManager.ins().createEff(this.m_Eff3, this.grewupPanel["m_EffGroup0"], "eff_ui_icon");
		this.m_Eff4 = ViewManager.ins().createEff(this.m_Eff4, this.m_EffGroup0, "eff_ui_upgrade");
		this.m_Eff5 = ViewManager.ins().createEff(this.m_Eff5, this.m_EffGroup1, "eff_ui_success");
	}
	private onClickGet() {
		ViewManager.ins().open(OrangeBreakWin);
	}


}
window["OrangeEquipPanel"] = OrangeEquipPanel