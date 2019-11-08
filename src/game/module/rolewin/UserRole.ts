class UserRole {

	canChangeEquips
	public constructor() {

		//待改
		this.canChangeEquips = [[], [], []];
		// MessageCenter.addListener(UserBag.postItemChange, this.checkHaveCan, this); //道具变更
		// MessageCenter.addListener(UserBag.postItemAdd, this.checkHaveCan, this); //道具添加
		GameGlobal.MessageCenter.addListener(MessageDef.CHANGE_ITEM, this.checkHaveCan, this); //道具添加
		GameGlobal.MessageCenter.addListener(MessageDef.ADD_ITEM, this.checkHaveCan, this); //道具添加
		GameGlobal.MessageCenter.addListener(MessageDef.DELETE_ITEM, this.checkHaveCan, this); //道具删除
		// MessageCenter.addListener(UserWing.ins().postWingUpgrade,this.checkHaveCan,this);
		// MessageCenter.ins().addListener(MessagerEvent.LEVEL_CHANGE, this.checkHaveCan, this);
		MessageCenter.addListener(GameLogic.ins().postLevelChange, this.checkHaveCan, this);
		// MessageCenter.ins().addListener(MessagerEvent.SUB_ROLE_CHANGE, this.checkHaveCan, this);
		MessageCenter.addListener(GameLogic.ins().postSubRoleChange, this.checkHaveCan, this);
		// MessageCenter.ins().addListener(MessagerEvent.GOLD_CHANGE, this.showNavBtnRedPoint, this);
		MessageCenter.addListener(GameLogic.ins().postGoldChange, this.showNavBtnRedPoint, this);
		// MessageCenter.ins().addListener(MessagerEvent.SKILL_HINT, this.showNavBtnRedPoint, this);
		// MessageCenter.ins().addListener(MessagerEvent.CHANGE_EQUIP, this.showNavBtnRedPoint, this);
		GameGlobal.MessageCenter.addListener(MessageDef.WING_ACTIVATE, this.showNavBtnRedPoint, this);
		GameGlobal.MessageCenter.addListener(MessageDef.CHANGE_EQUIP, this.showNavBtnRedPoint, this);
		MessageCenter.addListener(Bless.ins().postBelssUpdate, this.showNavBtnRedPoint, this);
	}

	public static ins(): UserRole {
		let self = this as any
		if (self._ins == null) {
			self._ins = new UserRole
		}
		return self._ins
	}

	private _Invalid() {

	}

    /**
     * 检测是否有装备可以穿
     * @param isWear 是否要穿可以穿的装备
     * @param roleIndex 传装备的角色索引
     */
	checkHaveCan(isWear: boolean = false, roleIndex: number = -1) {
		if (GlobalConfig.testItemCheck) return;
		var i, j, equip, item, itemSubType, equipSubType;
		//记录处理的装备
		var tempEquips = [];
		//背包装备
		var equipItems = UserBag.ins().getBagEquipByType(0);
		if (!equipItems)
			return;
		var len = roleIndex >= 0 ? roleIndex + 1 : SubRoles.ins().subRolesLen;
		for (var index = roleIndex >= 0 ? roleIndex : 0; index < len; index++) {
			tempEquips.length = 0;
			//角色身上装备
			// let roleEquips: EquipsData[] = .equipsData;
			var role = SubRoles.ins().getSubRoleByIndex(index);
			var n = role.getEquipLen2();
			//优先处理没有装备的位置
			for (i = 0; i < n; i++) {
				equip = role.getEquipByIndex(i);
				//有装备跳过
				if (equip.item.handle != 0)
					continue;
				for (j = 0; j < equipItems.length; j++) {
					item = equipItems[j];
					if (!item.itemConfig || item.itemConfig.quality == 5)
						continue;
					if (tempEquips.indexOf(item) >= 0 //已经装备的就跳过
						|| (item.itemConfig.job != 0 //是通用职业装备
							&& item.itemConfig.job != SubRoles.ins().getSubRoleByIndex(index).job) //职业不符合的跳过
						|| UserZs.ins().lv < item.itemConfig.zsLevel //转生等级不足
						|| GameLogic.ins().actorModel.level < item.itemConfig.level //等级不足的跳过
					)
						continue;
					itemSubType = item.itemConfig.subType;
					//单件装备
					if (itemSubType == ForgeConst.EQUIP_POS_TO_SUB[i])
						tempEquips[i] = UserEquip.contrastEquip(item, tempEquips[i]);
				}
			}
			//对比有装备的
			for (i = 0; i < n; i++) {
				equip = role.getEquipByIndex(i);
				//无装备跳过
				if (equip.item.handle == 0)
					continue;
				equipSubType = equip.item.itemConfig.subType;
				for (j = 0; j < equipItems.length; j++) {
					item = equipItems[j];
					if (!item.itemConfig || item.itemConfig.quality == 5)
						continue;
					if (tempEquips.indexOf(item) >= 0 //已经装备的就跳过
						|| (item.itemConfig.job != 0 //是通用职业装备
							&& item.itemConfig.job != SubRoles.ins().getSubRoleByIndex(index).job) //职业不符合的跳过
						|| UserZs.ins().lv < item.itemConfig.zsLevel //转生等级不足
						|| GameLogic.ins().actorModel.level < item.itemConfig.level //等级不足的跳过
					)
						continue;
					itemSubType = item.itemConfig.subType;
					//装备类型相同
					if (equipSubType == itemSubType) {
						tempEquips[i] = UserEquip.contrastEquip(tempEquips[i] ? tempEquips[i] : equip.item, item);
					}
				}
			}
			for (i = 0; i < n; i++) {
				equip = role.getEquipByIndex(i);
				this.canChangeEquips[index][i] = false;
				if (tempEquips[i] && equip.item.handle != tempEquips[i].handle) {
					if (isWear && roleIndex == index) {
						UserEquip.ins().sendWearEquipment(tempEquips[i].handle, i, roleIndex);
						this.canChangeEquips[index][i] = false;
					}
					else {
						this.canChangeEquips[index][i] = true;
					}
				}
			}
			if (this.canChangeEquips[index].indexOf(true) < 0)
				this.canChangeEquips[index].length = 0;
		}
		MessageCenter.ins().dispatch(MessageDef.ROLE_HINT);
		return tempEquips;
	};

	/** 检查是否需要显示红点 */
	showNavBtnRedPoint(): boolean {
		//是否有装备可以穿戴
		var b;
		for (var i = 0; i < this.canChangeEquips.length; i++) {
			for (var j = 0; j < this.canChangeEquips[i].length; j++) {
				if (this.canChangeEquips[i][j]) {
					b = true;
					break;
				}
			}
			if (b)
				break;
		}
		if (b) {
			return true;
		}
		//转生是否有可以升级
		if (!b && UserZs.ins().canOpenZSWin() && !UserZs.ins().isMaxLv() && (UserZs.ins().canGetRedPoint() || UserZs.ins().canUpgrade())) {
			return true;
		}
		//羽翼是否有可以升级
		// if (!b && this.and(Wing.ins().canGradeupWing())) {
		if (!b && this.and(Wing.ins().mRedPoint.IsRed())) {
			return true;
		}
		//主宰装备
		if (!b && (ZhuzaiEquip.ins().canAllLevelup() || ZhuzaiEquip.ins().canAllAdvance())) {
			return true;
		}

		if (!b && DressModel.ins().mDressModelRedPoint.IsRed()) {
			return true;
		}

		if (!b && LongHun.ins().CheckRedPoint()) {
			return true;
		}

		//橙装红点判断
		if (!b && UserEquip.ins().checkOrangeRedPointZy()) {
			return true;
		}
		//**技能相关的 */
		if (!b && Deblocking.IsRedDotSkillBtn()) {
			return true;
		}

		//**翅膀 */
		if (!b && Wing.ins().mRedPoint.IsRed())
			return true;

		//**坐骑 */
		if (!b && MountModel.getInstance.checkAllRedPoint()) {
			return true;
		}

		//**神器*/
		if (!b && Deblocking.IsRedDotArtifactBtn()) {
			return true;
		}

		//**转职*/
		if (!b && Deblocking.IsRedDotZhuanZhiBtn()) {
			return true;
		}
		if (!b && TheGunModel.getInstance.checkAllRedPoint()) {
			return true;
		}
		return b;
	};

	and(list) {
		for (var k in list) {
			if (list[k] == true)
				return true;
		}
		return false;
	};
	seekRoleItem() {
		var isReturn = false;
		// var len = UserBag.ins().getBagItemNum(0);
		// for (var i = 0; i < len; i++) {
		// 	if (isReturn)
		// 		return isReturn;
		// 	var item = UserBag.ins().getBagGoodsByIndex(0, i);
		// 	switch (item.itemConfig.id) {
		// 		case 200001:
		// 			break;
		// 		case 200004:
		// 			isReturn = this.roleHint(4);
		// 			break;
		// 		case 200005:
		// 			isReturn = this.roleHint(2);
		// 			break;
		// 		case 200006:
		// 			isReturn = this.roleHint(3);
		// 			break;
		// 		case 200013:
		// 			isReturn = this.roleHint(0);
		// 			break;
		// 		case 200014:
		// 			isReturn = this.roleHint(1);
		// 			break;
		// 	}
		// }
		return isReturn;
	};
    /**
     * 查找角色提示
     */
	roleHintCheck(role: Role, type) {
		var lv = 1;
		var costNum = 0;
		var itemNum = 0;
		var itemId = 0;
		switch (type) {
			case 0:

				break;
			case 1:

				break;
			case 2:

				break;
			case 3:

				break;
			case 4:
				lv = role.jingMaiData.level;
				var jingMaiConfig = GlobalConfig.jingMaiLevelConfig[lv];
				if (jingMaiConfig) {
					costNum = jingMaiConfig.count;
					itemId = jingMaiConfig.itemId;
				}
				break;
		}
		if (costNum) {
			itemNum = UserBag.ins().getBagGoodsCountById(0, itemId);
			if (itemNum >= costNum)
				return true;
		}
		return false;
	};
	setCanChange() {
		this.roleWin.roleInfoPanel.setCanChange(this.canChangeEquips);
		this.roleWin.canChangeEquips = this.canChangeEquips;
	};
	get roleWin(): RoleWin {
		return <RoleWin>ViewManager.ins().getView(RoleWin);
	}

	// public mRoleEquipRedPoint = new RoleEquipRedPoint
}



class RoleEquipRedPoint extends IRedPoint {
	private m_Data: any[]

	public constructor() {
		super()
		this.m_Data = []
		for (let i = 0; i < SubRoles.MAX_COUNT; ++i) {
			let array = []
			for (let j = 0; j < EquipPos.MAX; ++j) {
				array.push(false)
			}
			this.m_Data.push(array)
		}
	}

	public GetMessageDef(): string[] {
		return [
			MessageDef.CHANGE_ITEM,
			MessageDef.ADD_ITEM,
			MessageDef.DELETE_ITEM,

			MessageDef.LEVEL_CHANGE,
			MessageDef.SUB_ROLE_CHANGE
		]
	}

	public DoUpdate(type: string): void {
		// switch (type) {
		// 	case MessageDef.CHANGE_ITEM:
		// 	case MessageDef.ADD_ITEM:
		// 	case MessageDef.DELETE_ITEM:
		// 		this.DoGradeupWing()
		// 		this.DoQuickUp()
		// 		this.DoUpdateEquip()
		// 	break
		// }
		// _Log("RedPoint Update RoleEquipRedPoint!!!")
	}

	public IsRed(): boolean {
		for (let i = 0; i < this.m_Data.length; ++i) {
			if (this.IsRedByRole(i)) {
				return true
			}
		}
		return false
	}

	public IsRedByRole(roleIndex: number): boolean {
		if (this.mInValid) {
			this.DoUpdateEquip()
			this.mInValid = false
		}

		let data = this.m_Data[roleIndex]
		if (!data) {
			return false
		}
		for (let value of data) {
			if (value) {
				return value
			}
		}
		return false
		// for (let i = 0, len = Wing.WING_EQUIP_COUNT; i < len; ++i) {
		// 	let state = data.mEquip[i]
		// 	if (state) {
		// 		return true
		// 	}
		// }
		// if (data.mUpgrade) {
		// 	return true
		// }
		// return this.mQuickUp
	}

	public DoUpdateEquip() {
		var i, j, equip, item, itemSubType, equipSubType;
		//记录处理的装备
		var tempEquips = [];
		//背包装备
		var equipItems = UserBag.ins().getBagEquipByType(0);
		if (!equipItems)
			return;

		for (let index = 0, len = SubRoles.ins().subRolesLen; index < len; ++index) {
			tempEquips.length = 0;
			//角色身上装备
			// let roleEquips: EquipsData[] = .equipsData;
			var role = SubRoles.ins().getSubRoleByIndex(index);
			var n = role.getEquipLen2();
			//优先处理没有装备的位置
			for (i = 0; i < n; i++) {
				equip = role.getEquipByIndex(i);
				//有装备跳过
				if (equip.item.handle != 0)
					continue;
				for (j = 0; j < equipItems.length; j++) {
					item = equipItems[j];
					if (!item.itemConfig)
						continue;
					if (tempEquips.indexOf(item) >= 0 //已经装备的就跳过
						|| (item.itemConfig.job != 0 //是通用职业装备
							&& item.itemConfig.job != SubRoles.ins().getSubRoleByIndex(index).job) //职业不符合的跳过
						|| UserZs.ins().lv < item.itemConfig.zsLevel //转生等级不足
						|| GameLogic.ins().actorModel.level < item.itemConfig.level //等级不足的跳过
					)
						continue;
					itemSubType = item.itemConfig.subType;
					//单件装备
					if (itemSubType == ForgeConst.EQUIP_POS_TO_SUB[i])
						tempEquips[i] = UserEquip.contrastEquip(item, tempEquips[i]);
				}
			}
			//对比有装备的
			for (i = 0; i < n; i++) {
				equip = role.getEquipByIndex(i);
				//无装备跳过
				if (equip.item.handle == 0)
					continue;
				equipSubType = equip.item.itemConfig.subType;
				for (j = 0; j < equipItems.length; j++) {
					item = equipItems[j];
					if (!item.itemConfig)
						continue;
					if (tempEquips.indexOf(item) >= 0 //已经装备的就跳过
						|| (item.itemConfig.job != 0 //是通用职业装备
							&& item.itemConfig.job != SubRoles.ins().getSubRoleByIndex(index).job) //职业不符合的跳过
						|| UserZs.ins().lv < item.itemConfig.zsLevel //转生等级不足
						|| GameLogic.ins().actorModel.level < item.itemConfig.level //等级不足的跳过
					)
						continue;
					itemSubType = item.itemConfig.subType;
					//装备类型相同
					if (equipSubType == itemSubType) {
						tempEquips[i] = UserEquip.contrastEquip(tempEquips[i] ? tempEquips[i] : equip.item, item);
					}
				}
			}
			for (i = 0; i < n; i++) {
				this.m_Data[index][i] = false
				if (tempEquips[i] && equip.item.handle != tempEquips[i].handle) {
					this.m_Data[index][i] = true;
				}
			}
			// for (i = 0; i < n; i++) {
			// 	equip = role.getEquipByIndex(i);
			// 	this.canChangeEquips[index][i] = false;
			// 	if (tempEquips[i] && equip.item.handle != tempEquips[i].handle) {
			// 		if (isWear && roleIndex == index) {
			// 			UserEquip.ins().sendWearEquipment(tempEquips[i].handle, i, roleIndex);
			// 			this.canChangeEquips[index][i] = false;
			// 		}
			// 		else {
			// 			this.canChangeEquips[index][i] = true;
			// 		}
			// 	}
			// }
			// if (this.canChangeEquips[index].indexOf(true) < 0)
			// 	this.canChangeEquips[index].length = 0;
		}
	}
}

window["UserRole"] = UserRole
window["RoleEquipRedPoint"] = RoleEquipRedPoint