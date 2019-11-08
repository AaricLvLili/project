
class ZhuanZhiEquipUpLevelPanel extends BaseView implements eui.UIComponent, ICommonWindowTitle, ICommonWindowRoleSelect {
	public constructor() {
		super();
		this.skinName = "ZhuanZhiEquipUpLevelPanelSkin";
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
	public upLevelBtn: eui.Button;
	public attrLabel: AttrLabel;
	public openTips: eui.Label;
	public consumeLabel: ConsumeLabel;
	public getLable: eui.Button;
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

		this.m_EquipGroup[ZhuanZhiEquipUpLevelPanel.equipItemIndex].selected = true;
		this.putOnBtn.label = GlobalConfig.jifengTiaoyueLg.st100665;
		this.replaceBtn.label = GlobalConfig.jifengTiaoyueLg.st100318;
		this.upLevelBtn.label = GlobalConfig.jifengTiaoyueLg.st100208;
		this.gotoLable.label = GlobalConfig.jifengTiaoyueLg.st101077;
	}

	public open(): void {
		this.observe(MessageDef.ZHUANZHI_EQUIP_ITEM_SELECT, this.onEquipItemChange);
		this.observe(MessageDef.CHANGE_EQUIP, this.UpdateContent);
		this.observe(ZhuanZhiModel.ins().postZhuanZhiEquipUpLevel, this.UpdateContent);
		this.observe(MessageDef.ITEM_COUNT_CHANGE, this.UpdateContent);
		this.observe(ZhuanZhiModel.ins().postZhuanZhiEquipPower, this.updatePower);

		this.addTouchEvent(this, this.onClick, this.replaceBtn);
		this.addTouchEvent(this, this.onClick, this.upLevelBtn);
		this.addTouchEvent(this, this.onClick, this.putOnBtn);
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
			case this.upLevelBtn:
				ZhuanZhiModel.ins().sendZhuanZhiEquipUpLevel(roleId, ZhuanZhiEquipUpLevelPanel.equipItemIndex + EquipPos.MAX);
				break;
			case this.getLable:
				ViewManager.ins().open(BreakDownListview, 760001, 1000);
				break;
			case this.gotoLable:
				ViewManager.ins().open(ZhuanZhiEquipWin, 0, roleId);
				break;
			case this.putOnBtn:
			case this.replaceBtn:
				ViewManager.ins().open(ZhuanZhiEquipReplaceWin, roleId, ZhuanZhiEquipUpLevelPanel.equipItemIndex);
				break;
		}
	}

	/**切换装备item*/
	private onEquipItemChange(index: number): void {
		this.m_EquipGroup[ZhuanZhiEquipUpLevelPanel.equipItemIndex].selected = false;
		this.m_EquipGroup[index].selected = true;
		ZhuanZhiEquipUpLevelPanel.equipItemIndex = index;
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
			tfItem.setShowRedPoint(ZhuanZhiModel.ins().canLevelZzEquipRedPoint(obj.equip));
		}

		this.updataEquipInfo();
		this.updatePower();
		this.updataRoleRedPoint();
	}

	private updataEquipInfo(): void {
		var role = SubRoles.ins().getSubRoleByIndex(this.m_RoleSelectPanel.getCurRole());
		var equipsData = role.equipsData;
		var currEquip: EquipsData = equipsData[ZhuanZhiEquipUpLevelPanel.equipItemIndex + EquipPos.MAX];
		var equipId = ZhuanZhiModel.ins().getZhuanZhiEquipId(ZhuanZhiEquipUpLevelPanel.equipItemIndex, role.job);
		if (currEquip.item && currEquip.item.configID > 0) {
			this.attrLabel.visible = true;
			var growUpConfig = GlobalConfig.ins("TransferEquipGrowUpConfig")[equipId][currEquip.item.configID];
			let currAttr = ZhuanZhiModel.ins().getZhuanZhiEquipAttr(growUpConfig, currEquip.num2, 5);
			currAttr = AttributeData.removeZeroAttr(currAttr);
			this.attrLabel.SetCurAttr(AttributeData.getAttStr(currAttr, 1));

			if (currEquip.num2 < growUpConfig.maxLevel) {
				let nextAttr = ZhuanZhiModel.ins().getZhuanZhiEquipAttr(growUpConfig, currEquip.num2 + 1, 5);
				nextAttr = AttributeData.removeZeroAttr(nextAttr);
				this.attrLabel.SetNextAttr(AttributeData.getAttStr(nextAttr, 1));
			}

			this.consumeLabel.visible = true;
			this.consumeLabel.consumeType = GlobalConfig.itemConfig[growUpConfig.itemId1].name;
			this.consumeLabel.curValue = UserBag.ins().getBagGoodsCountById(0, growUpConfig.itemId1);
			this.consumeLabel.consumeValue = 1 + Math.floor(currEquip.num2 / 5);

			this.getLable.visible = true;
			this.openTips.visible = false;
			this.gotoLable.visible = false;
			this.putOnBtn.visible = false;
			this.replaceBtn.visible = true;
			this.upLevelBtn.visible = true;
		}
		else {
			this.attrLabel.visible = false;
			this.replaceBtn.visible = false;
			this.upLevelBtn.visible = false;
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

	private updatePower(): void {
		var role = SubRoles.ins().getSubRoleByIndex(this.m_RoleSelectPanel.getCurRole());
		this.powerLabel.text = role.hjPower;
	}

	/**更新角色头像红点*/
	private updataRoleRedPoint(): void {
		for (let i = 0, len = SubRoles.ins().subRolesLen; i < len; ++i) {
			this.m_RoleSelectPanel.showRedPoint(i, ZhuanZhiModel.ins().zZEquipUpLevelRoleRedPqoint(i));
		}
	}

	/**更新tab按钮红点*/
	public CheckRedPoint() {
		for (let i = 0, len = SubRoles.ins().subRolesLen; i < len; ++i) {
			if (ZhuanZhiModel.ins().zZEquipUpLevelRoleRedPqoint(i))
				return true;
		}
		return false;
	}

	public static openCheck() {
		return Deblocking.Check(DeblockingType.TYPE_31);
	};
}
window["ZhuanZhiEquipUpLevelPanel"] = ZhuanZhiEquipUpLevelPanel