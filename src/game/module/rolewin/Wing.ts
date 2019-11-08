class Wing extends BaseSystem {

	private wingCommonConfig: any;
	public static readonly WING_EQUIP_COUNT = 4
	canChangeWingEquips

	private bAutoBuyShenyu = false;
	canChange = true;
	public constructor() {
		super()

		this.canChangeWingEquips = [[], [], []];
		this.sysId = PackageID.Wing;
		this.regNetMsg(1, this.doUpDataWing);
		//this.regNetMsg(2, this.doBoost);
		this.regNetMsg(S2cProtocol.sc_wing_boost, this.doBoost);
		this.regNetMsg(S2cProtocol.sc_wing_upgrade, this.doGrade);
		//this.regNetMsg(3, this.doGrade);
		//this.regNetMsg(4, this.doActivate);
		this.regNetMsg(11, this.doWingEquip);
		//this.regNetMsg(12, this.doBigUpLevel);
		this.regNetMsg(S2cProtocol.sc_wing_extend, this.getWingChangeShow);
	}


	static ins(): Wing {
		return super.ins();
	};
    /**
     * 培养请求
     * @param roleId 角色
     * @param type  培养类型
     */
	sendBoost(roleId, type, useyb = false) {
		var cs_wing_boost = new Sproto.cs_wing_boost_request();
		cs_wing_boost.roleId = roleId;
		cs_wing_boost.type = type;
		cs_wing_boost.canUseYuanbao = useyb;
		GameSocket.ins().Rpc(C2sProtocol.cs_wing_boost, cs_wing_boost);
		// var bytes = this.getBytes(2);
		// bytes.writeShort(roleId);
		// bytes.writeShort(type);
		// this.sendToServer(bytes);
	};
    /**
     * 升级请求
     * @param roleId 角色
     */
	sendUpgrade(roleId) {
		var cs_wing_upgrade = new Sproto.cs_wing_upgrade_request();
		cs_wing_upgrade.roleId = roleId;
		GameSocket.ins().Rpc(C2sProtocol.cs_wing_upgrade, cs_wing_upgrade);
		// var bytes = this.getBytes(3);
		// bytes.writeShort(roleId);
		// this.sendToServer(bytes);
	};
    /**
     * 激活请求
     * @param roleId 角色
     */
	sendActivate(roleId) {
		var cs_wing_activate = new Sproto.cs_wing_activate_request();
		cs_wing_activate.roleId = roleId;
		GameSocket.ins().Rpc(C2sProtocol.cs_wing_activate, cs_wing_activate, this.doActivate, this);
		// var bytes = this.getBytes(4);
		// bytes.writeShort(roleId);
		// this.sendToServer(bytes);
	};
    /**
     * 羽翼装备穿戴请求
     * @param roleId 角色
     * @param itemId 物品
     * @param dressIndex 位置
     */
	dressWingEquip(roleId, itemhandle, dressIndex) {
		var cs_wing_equip = new Sproto.cs_wing_equip_request();
		cs_wing_equip.itemHandle = itemhandle;
		cs_wing_equip.roleId = roleId;
		cs_wing_equip.dressIndex = dressIndex;
		GameSocket.ins().Rpc(C2sProtocol.cs_wing_equip, cs_wing_equip, this.doWingEquip, this);
		// var bytes = this.getBytes(11);
		// bytes.writeDouble(itemhandle);
		// bytes.writeShort(roleId);
		// bytes.writeShort(dressIndex);
		// this.sendToServer(bytes);
	};
    /**
     * 发送直升一阶
     * @param role 角色索引
     *
     * 6-12
     */
	sendBigUpLevel(roleId) {
		var cs_wing_evolution = new Sproto.cs_wing_evolution_request();
		cs_wing_evolution.roleId = roleId;
		GameSocket.ins().Rpc(C2sProtocol.cs_wing_evolution, cs_wing_evolution, this.doBigUpLevel, this);
		// var bytes = this.getBytes(12);
		// bytes.writeInt(roleId);
		// this.sendToServer(bytes);
	};
	doBigUpLevel(req: Sproto.cs_wing_evolution_response) {
		var result = req.result;
		var str;
		if (!result) {
			var type = req.type;
			if (!type) {
				str = GlobalConfig.jifengTiaoyueLg.st101668;
			}
			else {
				if (this.wingCommonConfig == null)
					this.wingCommonConfig = GlobalConfig.ins("WingCommonConfig");
				str = LanguageString.jifengTiaoyueCh(GlobalConfig.jifengTiaoyueLg.st101669, [this.wingCommonConfig.levelExpChange]);
			}

		}
		else {
			str = GlobalConfig.jifengTiaoyueLg.st100217;
		}
		UserTips.ins().showTips(str);
	};
    /**
     * 羽翼数据同步
     * @param bytes
     */
	doUpDataWing(bytes) {
		var index = bytes.readShort();
		SubRoles.ins().getSubRoleByIndex(index).wingsData.parser(bytes);
		;
	};
    /**
     * 培养回调
     * @param bytes
     */
	doBoost(req: Sproto.sc_wing_boost_request) {
		var index = req.roleId;
		SubRoles.ins().getSubRoleByIndex(index).wingsData.parserBoost(req);
		var crit = req.crit;
		var addExp = req.addExp;
		this.postBoost(crit, addExp);

		GameGlobal.MessageCenter.dispatch(MessageDef.WING_BOOST, crit, addExp)
	};
	/**派发培养回调 */
	postBoost(crit, addExp) {
		return [crit, addExp];
	};
    /**
     * 升级回调
     * @param bytes
     */
	doGrade(req: Sproto.sc_wing_upgrade_request) {
		var index = req.roleId;
		let nowLv = SubRoles.ins().getSubRoleByIndex(index).wingsData.lv
		SubRoles.ins().getSubRoleByIndex(index).wingsData.parserUpgrade(req);
		var role = EntityManager.ins().getMainRole(index);
		if (role)
			role.updateModel();
		// MessageCenter.ins().dispatch(MessagerEvent.WING_UPGRADE);
		this.postWingUpgrade();

		GameGlobal.MessageCenter.dispatch(MessageDef.WING_UPGRADE)
		if (nowLv < req.lv) {
			ViewManager.ins().open(MainNewWin, ResAnimType.TYPE4, index, [null, (req.lv + 1) + GlobalConfig.jifengTiaoyueLg.st100103 + GlobalConfig.jifengTiaoyueLg.st100339], 2)
		}
	};
	/** 派发羽翼等级提升消息*/
	postWingUpgrade() {
	};
    /**
     * 激活回调
     * @param bytes
     */
	doActivate(rep: Sproto.cs_wing_activate_response) {
		var index = rep.roleId;
		SubRoles.ins().getSubRoleByIndex(index).wingsData.parserOpenStatus(rep);
		//更新羽翼显示
		var role = EntityManager.ins().getMainRole(index);
		if (role)
			role.updateModel();
		this.postActivate();
		GameGlobal.MessageCenter.dispatch(MessageDef.WING_ACTIVATE)
		ViewManager.ins().open(MainNewWin, ResAnimType.TYPE4, index, [null, 1 + GlobalConfig.jifengTiaoyueLg.st100103 + GlobalConfig.jifengTiaoyueLg.st100339], 3)
	};
	/**派发激活消息 */
	postActivate() {
	};
    /**
     * 更新羽翼装备
     * @param bytes
     */
	doWingEquip(bytes: Sproto.cs_wing_equip_response) {
		if (!bytes.itemData) return;
		var roleId = bytes.roleId;
		var index = bytes.index;
		var item = new ItemData;
		item.parser(bytes.itemData);
		SubRoles.ins().getSubRoleByIndex(roleId).wingsData.setEquipByIndex(index, item);
		var role = EntityManager.ins().getMainRole(roleId);
		if (role)
			role.updateModel();
		this.postWingEquipUpdate();
	};
	/**派发羽翼装备更新 */
	postWingEquipUpdate() {
	};
	/*检查羽翼装备是否可以换*/
	checkWingEquip(roleid = -1, isWear = false) {
		var i, j, equip, item, itemSubType, equipSubType;
		//记录处理的装备
		var tempEquips = [];
		//背包装备
		var equipItems = UserBag.ins().getBagEquipByType(4);
		if (!equipItems)
			return;
		var len = roleid >= 0 ? roleid + 1 : SubRoles.ins().subRolesLen;
		for (var index = roleid >= 0 ? roleid : 0; index < len; index++) {
			tempEquips.length = 0;
			//角色身上装备
			var wingsData = SubRoles.ins().getSubRoleByIndex(index).wingsData;
			var equipCount = wingsData.equipsLen;
			for (i = 0; i < equipCount; i++) {
				equip = wingsData.getEquipByIndex(i);
				//有装备跳过
				if (equip.handle != 0)
					continue;
				for (j = 0; j < equipItems.length; j++) {
					item = equipItems[j];
					if (!item.itemConfig)
						continue;
					if (tempEquips.indexOf(item) >= 0 //已经装备的就跳过
						|| SubRoles.ins().getSubRoleByIndex(index).wingsData.lv < item.itemConfig.level //等级不足的跳过
					)
						continue;
					itemSubType = item.itemConfig.subType;
					//单件装备
					if (itemSubType == i)
						tempEquips[i] = UserEquip.contrastEquip(item, tempEquips[i]);
				}
			}
			//对比有装备的
			for (i = 0; i < equipCount; i++) {
				equip = wingsData.getEquipByIndex(i);
				//无装备跳过
				if (equip.handle == 0)
					continue;
				if (equip.itemConfig)
					equipSubType = equip.itemConfig.subType;
				for (j = 0; j < equipItems.length; j++) {
					item = equipItems[j];
					if (!item.itemConfig)
						continue;
					if (tempEquips.indexOf(item) >= 0 //已经装备的就跳过
						|| SubRoles.ins().getSubRoleByIndex(index).wingsData.lv < item.itemConfig.level //等级不足的跳过
					)
						continue;
					itemSubType = item.itemConfig.subType;
					//装备类型相同
					if (equipSubType == itemSubType) {
						tempEquips[i] = UserEquip.contrastEquip(tempEquips[i] ? tempEquips[i] : equip, item);
					}
				}
			}
			for (i = 0; i < 4; i++) {
				equip = wingsData.getEquipByIndex(i);
				this.canChangeWingEquips[index][i] = false;
				if (tempEquips[i] && equip.handle != tempEquips[i].handle) {
					if (isWear && roleid == index) {
						this.dressWingEquip(roleid, tempEquips[i].handle, i);
						this.canChangeWingEquips[index][i] = false;
					}
					else {
						this.canChangeWingEquips[index][i] = true;
					}
				}
			}
			if (this.canChangeWingEquips[index].indexOf(true) < 0)
				this.canChangeWingEquips[index].length = 0;
		}
		// this.showNavBtnRedPoint();
	};

	setCanWingEquipChange() {
		// if (this.wingEquipPanel)
		// 	this.wingEquipPanel.setCanChange(this.canChangeWingEquips);
		this.roleWin.canChangeWingEquips = this.canChangeWingEquips;
		// this.roleWin.wingPanel.canChangeWingEquips = this.canChangeWingEquips;
	};
	// get wingEquipPanel(): WingEquipPanel {
	// 	return <WingEquipPanel>ViewManager.ins().getView(WingEquipPanel);
	// }
	get roleWin(): RoleWin {
		return <RoleWin>ViewManager.ins().getView(RoleWin);
	}
    /** TODO hepeiye
     * 是否可以提升羽翼
     */
	// canGradeupWing() {
	// 	var boolList = [false, false, false];
	// 	var lvMax = GlobalConfig.ins("WingCommonConfig").lvMax;
	// 	var len = SubRoles.ins().subRolesLen;
	// 	for (var i = 0; i < len; i++) {
	// 		var curlevel = SubRoles.ins().getSubRoleByIndex(i).wingsData.lv;
	// 		if (curlevel < lvMax)
	// 			boolList[i] = GameLogic.ins().actorModel.gold >= GlobalConfig.wingLevelConfig[curlevel].normalCostTip;
	// 		else
	// 			boolList[i] = false;
	// 	}
	// 	return boolList;
	// };
	get isAutoBuy() {
		return this.bAutoBuyShenyu;
	}
	set isAutoBuy(value) {
		if (this.bAutoBuyShenyu != value) {
			this.bAutoBuyShenyu = value;
			//this.canChange = false;
			//TimerManager.ins().doTimer(1000, 10, this.overDealy, this, this.dealyOver, this);
		}
	}
	dealyOver() {
		//TimerManager.ins().remove(this.overDealy, this);
		//this.canChange = true;
	};
	/**羽翼一键强化 */
	public sendWingOneKey(roleId: number) {
		let rsp = new Sproto.cs_wing_onekey_request;
		rsp.roleId = roleId;
		this.Rpc(C2sProtocol.cs_wing_onekey, rsp);
	}
	/**改变翅膀当前显示 */
	public sendWingChangeShow(id: number, showLevel: number) {
		let rsp = new Sproto.cs_wing_exten_request;
		rsp.roleId = id;
		rsp.lv = showLevel;
		this.Rpc(C2sProtocol.cs_wing_exten, rsp);
	}
	public getWingChangeShow(bytes: Sproto.sc_wing_extend_request) {
		var index = bytes.roleId;
		let wingsData: WingsData = SubRoles.ins().getSubRoleByIndex(index).wingsData;
		wingsData.showLv = bytes.lv;
		var role = EntityManager.ins().getMainRole(index);
		if (role)
			role.updateModel();
		GameGlobal.MessageCenter.dispatch(MessageDef.WING_CHANGESHOW_MSG)
	}
	overDealy() {
	}
	public mRedPoint: WingModelRedPoint = new WingModelRedPoint()
}

class WingModelRedPoint extends IRedPoint {
	private m_Data: {
		mEquip: boolean[]
		mUpgrade: boolean
	}[]

	private mQuickUp: boolean
	private wingCommonConfig: any;

	public GetEquipState(roleIndex: number): boolean[] {
		let data = this.m_Data[roleIndex]
		if (data) {
			return data.mEquip
		}
		return []
	}

	public IsEquipState(roleIndex: number): boolean {
		return this.GetEquipState(roleIndex).indexOf(true) != -1
	}

	public constructor() {
		super()
		this.m_Data = []
		for (let i = 0; i < SubRoles.MAX_COUNT; ++i) {
			this.m_Data.push({
				mEquip: [],
				mUpgrade: false,
			})
		}
	}

	public GetMessageDef(): string[] {
		return [
			MessageDef.CHANGE_ITEM,
			MessageDef.ADD_ITEM,
			MessageDef.DELETE_ITEM,

			MessageDef.WING_BOOST,
			MessageDef.WING_UPGRADE,
			MessageDef.WING_ACTIVATE,
			// MessageDef.GOLD_CHANGE,
		]
	}

	public DoUpdate(type: string): void {
		switch (type) {
			case MessageDef.CHANGE_ITEM:
			case MessageDef.ADD_ITEM:
			case MessageDef.DELETE_ITEM:
				this.DoGradeupWing()
				this.DoQuickUp()
				this.DoUpdateEquip()
				break

			// case MessageDef.GOLD_CHANGE:
			// 	this.DoGradeupWing()
			// break
		}
		// _Log("Update Wing RedPoing!!!")
	}

	public IsRed(): boolean {
		if (Deblocking.Check(DeblockingType.TYPE_35, true)) {
			for (let i = 0; i < this.m_Data.length; ++i) {
				if (this.IsRedByRole(i)) {
					return true
				}
			}
		}
		return false
	}

	public IsRedByRole(roleIndex: number): boolean {
		if (this.wingCommonConfig == null)
			this.wingCommonConfig = GlobalConfig.ins("WingCommonConfig");
		var Lv: number = GameLogic.ins().actorModel.level;
		if (Lv < this.wingCommonConfig.openLevel) { //判断是否达到激活等级
			return false
		}
		let role = SubRoles.ins().getSubRoleByIndex(roleIndex);
		if (role) {
			if (role.wingsData.lv >= this.wingCommonConfig.lvMax) {
				return false;
			}
			var curStatus = role.wingsData.openStatus;//判断是否激活
			if (Lv > this.wingCommonConfig.openLevel && !curStatus) {
				return true;
			}
		}


		// if (this.mInValid) {
		this.DoGradeupWing()
		this.DoQuickUp()
		this.DoUpdateEquip()
		// this.mInValid = false
		// }

		let data = this.m_Data[roleIndex]   //达到激活等级红点显示
		if (!data) {
			return false;
		}
		for (let i = 0, len = Wing.WING_EQUIP_COUNT; i < len; ++i) {
			let state = data.mEquip[i]
			if (state) {
				return true
			}
		}
		if (data.mUpgrade) {
			return true
		}
		return this.mQuickUp
	}

	public DoGradeupWing() {
		if (this.wingCommonConfig == null)
			this.wingCommonConfig = GlobalConfig.ins("WingCommonConfig");

		var lvMax = this.wingCommonConfig.lvMax;
		var len = SubRoles.ins().subRolesLen;
		// let gold = GameLogic.ins().actorModel.gold
		let cfg = GlobalConfig.wingLevelConfig
		let item = UserBag.ins().getBagItemById(cfg[0].itemId);
		let gold: number = GameLogic.ins().actorModel.gold;
		for (var i = 0; i < len; i++) {
			var curlevel = SubRoles.ins().getSubRoleByIndex(i).wingsData.lv;
			if (curlevel != null && curlevel < lvMax) {
				var config = GlobalConfig.wingLevelConfig[curlevel];
				if (item && item.count >= config.itemNum || gold >= config.normalCost) {
					this.m_Data[i].mUpgrade = true;
				} else {
					this.m_Data[i].mUpgrade = false;
				}
			}
			else {
				this.m_Data[i].mUpgrade = false;
			}
		}
	}

	public DoQuickUp() {
		let item = UserBag.ins().getBagItemById(200102)
		this.mQuickUp = item ? item.count > 0 : false
		// } else {
		// 	this.mQuickUp = false
		// }
	}

	public DoUpdateEquip() {
		var equipItems = UserBag.ins().getBagEquipByType(4);
		if (!equipItems)
			return;

		// let index = 0

		for (let index = 0, len = SubRoles.ins().subRolesLen; index < len; ++index) {
			var tempEquips = [];

			var wingsData = SubRoles.ins().getSubRoleByIndex(index).wingsData;
			var equipCount = wingsData.equipsLen;
			for (let i = 0; i < equipCount; i++) {
				let equip = wingsData.getEquipByIndex(i);
				//有装备跳过
				if (equip.handle != 0)
					continue;
				for (let j = 0; j < equipItems.length; j++) {
					let item = equipItems[j];
					if (!item.itemConfig)
						continue;
					if (tempEquips.indexOf(item) >= 0 //已经装备的就跳过
						|| SubRoles.ins().getSubRoleByIndex(index).wingsData.lv < item.itemConfig.level //等级不足的跳过
					)
						continue;
					let itemSubType = item.itemConfig.subType;
					//单件装备
					if (itemSubType == i)
						tempEquips[i] = UserEquip.contrastEquip(item, tempEquips[i]);
				}
			}
			//对比有装备的
			for (let i = 0; i < equipCount; i++) {
				let equip = wingsData.getEquipByIndex(i);
				//无装备跳过
				if (equip.handle == 0)
					continue;
				let equipSubType = equip.itemConfig ? equip.itemConfig.subType : null
				for (let j = 0; j < equipItems.length; j++) {
					let item = equipItems[j];
					if (!item.itemConfig)
						continue;
					if (tempEquips.indexOf(item) >= 0 //已经装备的就跳过
						|| SubRoles.ins().getSubRoleByIndex(index).wingsData.lv < item.itemConfig.level //等级不足的跳过
					)
						continue;
					let itemSubType = item.itemConfig.subType;
					//装备类型相同
					if (equipSubType == itemSubType) {
						tempEquips[i] = UserEquip.contrastEquip(tempEquips[i] ? tempEquips[i] : equip, item);
					}
				}
			}
			let equipRedPoint = this.m_Data[index].mEquip
			for (let i = 0, len = Wing.WING_EQUIP_COUNT; i < len; i++) {
				let equip = wingsData.getEquipByIndex(i);
				equipRedPoint[i] = tempEquips[i] && equip.handle != tempEquips[i].handle
				// this.m_Data[index].mEquip[i]
				// this.canChangeWingEquips[index][i] = false;
				// if (tempEquips[i] && equip.handle != tempEquips[i].handle) {
				// 	if (isWear && roleid == index) {
				// 		this.dressWingEquip(roleid, tempEquips[i].handle, i);
				// 		this.canChangeWingEquips[index][i] = false;
				// 	}
				// 	else {
				// 		this.canChangeWingEquips[index][i] = true;
				// 	}
				// }
			}
		}
	}


}

MessageCenter.compile(Wing);
window["Wing"] = Wing
window["WingModelRedPoint"] = WingModelRedPoint