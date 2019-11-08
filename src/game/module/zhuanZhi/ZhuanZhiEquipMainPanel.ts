class ZhuanZhiEquipMainPanel extends BaseView implements eui.UIComponent, ICommonWindowTitle, ICommonWindowRoleSelect {
	public constructor() {
		super();
		this.skinName = "ZhuanZhiEquipMainPanelSkin";
	}
	m_RoleSelectPanel: RoleSelectPanel;
	public powerLabel: PowerLabel;
	public equip0: ZhuanZhiEquipItem;
	public equip1: ZhuanZhiEquipItem;
	public equip2: ZhuanZhiEquipItem;
	public equip3: ZhuanZhiEquipItem;
	public equip4: ZhuanZhiEquipItem;
	public equip5: ZhuanZhiEquipItem;
	public replaceBtn: eui.Button;
	public attrLabel: AttrLabel;
	public addAttrLable: eui.Label;
	public openTips: eui.Label;
	public gotoLable: eui.Button;

	private m_EquipGroup: Array<ZhuanZhiEquipItem> = [];
	private static equipItemIndex: number = 0;
	public getItem: eui.Label;
	protected childrenCreated(): void {
		super.childrenCreated();
		// this.attrLabel.showBg();
		this.gotoLable.label = GlobalConfig.jifengTiaoyueLg.st101077;
		for (let i = 0; i < 6; ++i) {
			this.m_EquipGroup[i] = this["equip" + i];
			this.m_EquipGroup[i].mIndex = i;
		}

		this.m_EquipGroup[ZhuanZhiEquipMainPanel.equipItemIndex].selected = true;
		this.getItem.text = GlobalConfig.jifengTiaoyueLg.st100418;
		UIHelper.SetLinkStyleLabel(this.getItem);

	}

	public open(): void {
		this.observe(MessageDef.ZHUANZHI_EQUIP_ITEM_SELECT, this.onEquipItemChange);
		this.observe(MessageDef.CHANGE_EQUIP, this.UpdateContent);
		this.observe(ZhuanZhiModel.ins().postZhuanZhiEquipPower, this.updatePower);
		this.addTouchEvent(this, this.onClick, this.replaceBtn)
		this.addTouchEvent(this, this.onClick, this.gotoLable);
		this.AddClick(this.getItem, this.onClickGetLab1);
	}

	public close(): void {
		// this.removeEvents();
		// this.removeObserve();
	}

	private onClick(evt: egret.TouchEvent): void {
		let roleId: number = this.m_RoleSelectPanel.getCurRole();
		if (evt.currentTarget == this.replaceBtn)
			ViewManager.ins().open(ZhuanZhiEquipReplaceWin, roleId, ZhuanZhiEquipMainPanel.equipItemIndex);
		else
			ViewManager.ins().open(ZhuanZhiEquipWin, 0, roleId);
	}

	/**切换装备item*/
	private onEquipItemChange(index: number): void {
		this.m_EquipGroup[ZhuanZhiEquipMainPanel.equipItemIndex].selected = false;
		this.m_EquipGroup[index].selected = true;
		ZhuanZhiEquipMainPanel.equipItemIndex = index;
		this.updataEquipInfo();
	}

	public UpdateContent() {
		var role = SubRoles.ins().getSubRoleByIndex(this.m_RoleSelectPanel.getCurRole());
		var equipsData = role.equipsData;
		for (let i = 0; i < this.m_EquipGroup.length; i++) {
			let tfItem = this.m_EquipGroup[i]
			let obj: any = {};
			obj.equip = equipsData[i + EquipPos.MAX];
			obj.job = role.job;
			obj.roleIndex = this.m_RoleSelectPanel.getCurRole();
			tfItem.data = obj;
			if (obj.equip && obj.equip.item) {
				if (obj.equip.item.configID > 0)
					tfItem.setShowRedPoint(ZhuanZhiModel.ins().canReplaceZzEquipRedPoint(obj.equip.item));
				else
					tfItem.setShowRedPoint(ZhuanZhiModel.ins().canMountZzEquipRedPoint(i, role));
			}
		}
		this.updataEquipInfo();
		this.updatePower();
		this.updataRoleRedPoint();
	}

	private updataEquipInfo(): void {
		var role = SubRoles.ins().getSubRoleByIndex(this.m_RoleSelectPanel.getCurRole());
		var equipsData = role.equipsData;
		var currEquip: EquipsData = equipsData[ZhuanZhiEquipMainPanel.equipItemIndex + EquipPos.MAX];
		var equipId = ZhuanZhiModel.ins().getZhuanZhiEquipId(ZhuanZhiEquipMainPanel.equipItemIndex, role.job);

		if (currEquip.item && currEquip.item.configID > 0) {
			this.attrLabel.visible = true;
			this.addAttrLable.visible = true;
			let config1 = GlobalConfig.ins("TransferEquipGrowUpConfig")[equipId][currEquip.item.configID];
			let config2 = GlobalConfig.ins("TransferEquipStarConfig")[equipId][currEquip.item.configID];
			let attr1 = ZhuanZhiModel.ins().getZhuanZhiEquipAttr(config1, currEquip.num2, 5);
			let attr2 = ZhuanZhiModel.ins().getZhuanZhiEquipAttr(config2, currEquip.star, 4);
			var bassAttrs = ZhuanZhiModel.ins().getZhuanZhiEquipBaseAttr(currEquip.item);
			var addAttrs = AttributeData.AttrAddition(attr1, attr2);
			this.attrLabel.SetCurAttr(AttributeData.getAttStr(AttributeData.removeZeroAttr(AttributeData.AttrAddition(bassAttrs, addAttrs)), 1));

			var equipConfig = GlobalConfig.equipConfig[currEquip.item.configID];
			if (equipConfig) {
				let baseAttr = equipConfig.baseAttr ? equipConfig.baseAttr[0] : null;
				if (baseAttr) {
					this.addAttrLable.textFlow = TextFlowMaker.generateTextFlow(AttributeData.getAttrStrByType(baseAttr.type)
						+ StringUtils.addColor(AttributeData.getAttStrByType(baseAttr), Color.Green))
				}
				else {
					this.addAttrLable.text = "";
				}
			}

			this.openTips.visible = false;
			this.gotoLable.visible = false;
			this.replaceBtn.visible = true;
			this.replaceBtn.label = GlobalConfig.jifengTiaoyueLg.st100318;//"替换";
		}
		else {
			this.attrLabel.visible = false;
			this.addAttrLable.visible = false;
			var config = GlobalConfig.ins("TransferEquipConfig")[equipId];
			if (role.zhuanZhiJm.level >= config.activationLevel) {
				this.replaceBtn.label = GlobalConfig.jifengTiaoyueLg.st100665;//"装备";
				this.replaceBtn.visible = true;
				this.openTips.visible = false;
				this.gotoLable.visible = false;
			}
			else {
				this.gotoLable.visible = true;
				this.openTips.visible = true;
				let star = Math.floor(config.activationLevel / 8);
				let lev = config.activationLevel % 8;
				this.openTips.text = config.name + LanguageString.jifengTiaoyueCh(GlobalConfig.jifengTiaoyueLg.st100666, [star, lev]);//"需要转职经脉达到" + star + "阶" +　lev + "级";
				this.replaceBtn.visible = false;
			}
		}
	}

	private updatePower(): void {
		var role = SubRoles.ins().getSubRoleByIndex(this.m_RoleSelectPanel.getCurRole());
		this.powerLabel.text = role.hjPower;
	}

	/**更新角色头像红点*/
	private updataRoleRedPoint(): void {
		for (let i = 0, len = SubRoles.ins().subRolesLen; i < len; ++i) {
			this.m_RoleSelectPanel.showRedPoint(i, ZhuanZhiModel.ins().zhuanZhiEquipRoleRedPqoint(i));
		}
	}

	/**更新tab按钮红点*/
	public CheckRedPoint() {
		for (let i = 0, len = SubRoles.ins().subRolesLen; i < len; ++i) {
			if (ZhuanZhiModel.ins().zhuanZhiEquipRoleRedPqoint(i))
				return true;
		}
		return false;
	}

	public static openCheck() {
		return Deblocking.Check(DeblockingType.TYPE_31);
	};

	private onClickGetLab1() {
		UserWarn.ins().setBuyGoodsWarn(721001);
	}

}
window["ZhuanZhiEquipMainPanel"] = ZhuanZhiEquipMainPanel