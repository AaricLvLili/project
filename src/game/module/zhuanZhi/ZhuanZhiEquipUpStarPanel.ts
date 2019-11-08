class ZhuanZhiEquipUpStarPanel extends BaseView implements eui.UIComponent, ICommonWindowTitle, ICommonWindowRoleSelect {
	public constructor() {
		super();
		this.skinName = "ZhuanZhiEquipUpStarPanelSkin";
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
	public putOnBtn: eui.Button;
	public upStarBtn: eui.Button;
	public attrLabel: AttrLabel;
	public openTips: eui.Label;
	public consumeLabel: ConsumeLabel;
	public getLable: eui.Label;
	public gotoLable: eui.Button;

	private m_EquipGroup: Array<ZhuanZhiEquipItem> = [];
	private static equipItemIndex: number = 0;

	protected childrenCreated(): void {
		super.childrenCreated();
		this.attrLabel.showBg();

		for (let i = 0; i < 6; ++i) {
			this.m_EquipGroup[i] = this["equip" + i];
			this.m_EquipGroup[i].mIndex = i;
		}

		this.m_EquipGroup[ZhuanZhiEquipUpStarPanel.equipItemIndex].selected = true;
		this.putOnBtn.label = GlobalConfig.jifengTiaoyueLg.st100665;
		this.replaceBtn.label = GlobalConfig.jifengTiaoyueLg.st100318;
		this.upStarBtn.label = GlobalConfig.jifengTiaoyueLg.st101107;
		this.gotoLable.label = GlobalConfig.jifengTiaoyueLg.st101077;
	}

	public open(): void {
		this.observe(MessageDef.ZHUANZHI_EQUIP_ITEM_SELECT, this.onEquipItemChange);
		this.observe(MessageDef.CHANGE_EQUIP, this.UpdateContent);
		this.observe(ZhuanZhiModel.ins().postZhuanZhiEquipUpStar, this.UpdateContent);
		this.observe(ZhuanZhiModel.ins().postZhuanZhiEquipPower, this.updatePower);

		this.addTouchEvent(this, this.onClick, this.replaceBtn)
		this.addTouchEvent(this, this.onClick, this.upStarBtn)
		this.addTouchEvent(this, this.onClick, this.putOnBtn)
		this.addTouchEvent(this, this.onClick, this.getLable);
		this.addTouchEvent(this, this.onClick, this.gotoLable);
	}

	public close(): void {
		// this.removeEvents();
		// this.removeObserve();
	}

	private onClick(evt: egret.TouchEvent): void {
		let roleId: number = this.m_RoleSelectPanel.getCurRole();
		switch (evt.currentTarget) {
			case this.upStarBtn:
				ZhuanZhiModel.ins().sendZhuanZhiEquipUpStar(roleId, ZhuanZhiEquipUpStarPanel.equipItemIndex + EquipPos.MAX);
				break;
			case this.getLable:
				UserWarn.ins().setBuyGoodsWarn(760002);
				break;
			case this.gotoLable:
				ViewManager.ins().open(ZhuanZhiEquipWin, 0, roleId);
				break;
			case this.putOnBtn:
			case this.replaceBtn:
				ViewManager.ins().open(ZhuanZhiEquipReplaceWin, roleId, ZhuanZhiEquipUpStarPanel.equipItemIndex);
				break;
		}
	}

	/**切换装备item*/
	private onEquipItemChange(index: number): void {
		this.m_EquipGroup[ZhuanZhiEquipUpStarPanel.equipItemIndex].selected = false;
		this.m_EquipGroup[index].selected = true;
		ZhuanZhiEquipUpStarPanel.equipItemIndex = index;
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
			tfItem.setShowRedPoint(ZhuanZhiModel.ins().canStarZzEquipRedPoint(obj.equip));
		}

		this.updataEquipInfo();
		this.updatePower();
		this.updataRoleRedPoint();
	}

	private updatePower(): void {
		var role = SubRoles.ins().getSubRoleByIndex(this.m_RoleSelectPanel.getCurRole());
		this.powerLabel.text = role.hjPower;
	}

	private updataEquipInfo(): void {
		var role = SubRoles.ins().getSubRoleByIndex(this.m_RoleSelectPanel.getCurRole());
		var equipsData = role.equipsData;
		var currEquip: EquipsData = equipsData[ZhuanZhiEquipUpStarPanel.equipItemIndex + EquipPos.MAX];
		var equipId = ZhuanZhiModel.ins().getZhuanZhiEquipId(ZhuanZhiEquipUpStarPanel.equipItemIndex, role.job);
		if (currEquip.item && currEquip.item.configID > 0) {
			this.attrLabel.visible = true;
			var starConfig = GlobalConfig.ins("TransferEquipStarConfig")[equipId][currEquip.item.configID];
			let currAttr = ZhuanZhiModel.ins().getZhuanZhiEquipAttr(starConfig, currEquip.star, 4);
			currAttr = AttributeData.removeZeroAttr(currAttr);
			this.attrLabel.SetCurAttr(AttributeData.getAttStr(currAttr, 1));

			if (currEquip.star < starConfig.maxLevel) {
				let nextAttr = ZhuanZhiModel.ins().getZhuanZhiEquipAttr(starConfig, currEquip.star + 1, 4);
				nextAttr = AttributeData.removeZeroAttr(nextAttr);
				this.attrLabel.SetNextAttr(AttributeData.getAttStr(nextAttr, 1));
			}

			this.consumeLabel.visible = true;
			this.consumeLabel.consumeType = GlobalConfig.itemConfig[starConfig.itemId1].name;
			this.consumeLabel.curValue = UserBag.ins().getBagGoodsCountById(0, starConfig.itemId1);
			this.consumeLabel.consumeValue = 1 + Math.floor((currEquip.star + 1) / 4);

			this.getLable.visible = true;
			this.openTips.visible = false;
			this.gotoLable.visible = false;
			this.putOnBtn.visible = false;
			this.replaceBtn.visible = true;
			this.upStarBtn.visible = true;
		}
		else {
			this.attrLabel.visible = false;
			this.replaceBtn.visible = false;
			this.upStarBtn.visible = false;
			this.consumeLabel.visible = false;
			this.getLable.visible = false;

			var config = GlobalConfig.ins("TransferEquipConfig")[equipId];
			if (role.zhuanZhiJm.level >= config.activationLevel) {
				this.putOnBtn.visible = true;
				this.openTips.visible = false;
				this.gotoLable.visible = false;
			}
			else {
				this.putOnBtn.visible = false;
				this.gotoLable.visible = true;
				this.openTips.visible = true;
				let star = Math.floor(config.activationLevel / 8);
				let lev = config.activationLevel % 8;
				this.openTips.text = config.name + LanguageString.jifengTiaoyueCh(GlobalConfig.jifengTiaoyueLg.st100666, [star, lev]);//"需要转职经脉达到" + star + "阶" + lev + "级";
			}
		}
	}

	/**更新角色头像红点*/
	private updataRoleRedPoint(): void {
		for (let i = 0, len = SubRoles.ins().subRolesLen; i < len; ++i) {
			this.m_RoleSelectPanel.showRedPoint(i, ZhuanZhiModel.ins().zZEquipUpStarRoleRedPoint(i));
		}
	}

	/**更新tab按钮红点*/
	public CheckRedPoint() {
		for (let i = 0, len = SubRoles.ins().subRolesLen; i < len; ++i) {
			if (ZhuanZhiModel.ins().zZEquipUpStarRoleRedPoint(i))
				return true;
		}
		return false;
	}

	public static openCheck() {
		return Deblocking.Check(DeblockingType.TYPE_31);
	};
}
window["ZhuanZhiEquipUpStarPanel"] = ZhuanZhiEquipUpStarPanel