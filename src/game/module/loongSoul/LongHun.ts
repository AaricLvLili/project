class LongHun extends BaseSystem {

	static TYPE_LONG_HUN = 2
	static TYPE_HU_DUN = 3
	static TYPE_XUE_YU = 4

	private bAutoBuyCailiao = false;
	canChange = true;

	public constructor() {
		super();
		this.sysId = PackageID.LoongSoul;
		//this.regNetMsg(1, LongHun.postDateUpdate);
		this.regNetMsg(S2cProtocol.sc_longzhuang_boost_ret, this.DoDateUpdate);
		this.regNetMsg(S2cProtocol.sc_longzhuang_upgrade_ret, this.postStageUpgrade)
	}

	static ins(): LongHun {
		return super.ins()
	}

	sendUpGrade(roleID, id, canyb = false) {
		var cs_longzhuang_boost = new Sproto.cs_longzhuang_boost_request();
		cs_longzhuang_boost.roleId = roleID;
		cs_longzhuang_boost.id = id;
		cs_longzhuang_boost.canUseYuanbao = canyb;
		GameSocket.ins().Rpc(C2sProtocol.cs_longzhuang_boost, cs_longzhuang_boost);
		// var bytes = this.getBytes(1);
		// bytes.writeShort(roleID);
		// bytes.writeShort(type);
		// this.sendToServer(bytes);
	};
	DoDateUpdate(bytes: Sproto.sc_longzhuang_boost_ret_request) {
		var roleIndex = bytes.roleId
		var type = bytes.id
		var lv = bytes.star
		var exp = bytes.exp
		var ci = bytes.crit
		var addExp = bytes.addExp
		// console.log("返回龙魂护盾提升结果：等级--" + lv + "  经验--" + exp + "  暴击倍率--" + ci);
		var longzhuangdata = SubRoles.ins().getSubRoleByIndex(roleIndex).longzhuangdata[type - 1];
		longzhuangdata.star = bytes.star;
		longzhuangdata.exp = bytes.exp;
		GameGlobal.MessageCenter.dispatch(MessageDef.LOONGSOUL_LV_CHANGE, true);

		// if (!ErrorLog.Assert(null != model, "获取角色异常")) {
		// 	model.longzhuangdata[type].stage =
		// 	switch (type + 1) {
		// 		case LongHun.TYPE_LONG_HUN:
		// 			model.loongSoulData.level = lv
		// 			model.loongSoulData.exp = 0
		// 			break;
		// 		case LongHun.TYPE_HU_DUN:
		// 			model.shieldData.level = lv
		// 			model.shieldData.exp = 0
		// 			break;
		// 		case LongHun.TYPE_XUE_YU:
		// 			model.xueyuData.level = lv
		// 			model.xueyuData.exp = 0
		// 			break;
		// 	}
		// }
	};
	sendStageUpgrade(t, e) {
		var cs_longzhuang_upgrade = new Sproto.cs_longzhuang_upgrade_request();
		cs_longzhuang_upgrade.roleId = t;
		cs_longzhuang_upgrade.id = e;
		GameSocket.ins().Rpc(C2sProtocol.cs_longzhuang_upgrade, cs_longzhuang_upgrade);
	}

	postStageUpgrade(bytes: Sproto.sc_longzhuang_upgrade_ret_request) {
		var roleIndex = bytes.roleId
		var type = bytes.id
		// var role = SubRoles.ins().getSubRoleByIndex(roleIndex);
		var longzhuangdata = SubRoles.ins().getSubRoleByIndex(roleIndex).longzhuangdata[type - 1];
		longzhuangdata.lv = bytes.lv;
		longzhuangdata.star = bytes.star;
		longzhuangdata.exp = bytes.exp;
		GameGlobal.MessageCenter.dispatch(MessageDef.LOONGSOUL_LV_CHANGE, true);
		// if (!ErrorLog.Assert(null != role, "获取角色异常")) {
		// 	switch (type + 1) {
		// 		case LongHun.TYPE_LONG_HUN:
		// 			role.loongSoulData.stage = stage;
		// 			break;
		// 		case LongHun.TYPE_HU_DUN:
		// 			role.shieldData.stage = stage;
		// 			break;
		// 		case LongHun.TYPE_XUE_YU:
		// 			role.xueyuData.stage = stage
		// 	}
		// }
	}
	get isAutoBuy() {
		return this.bAutoBuyCailiao;
	}
	set isAutoBuy(value) {
		if (this.bAutoBuyCailiao != value) {
			this.bAutoBuyCailiao = value;
			//this.canChange = false;
			//TimerManager.ins().doTimer(1000, 10, this.overDealy, this, this.dealyOver, this);
		}
	}
	dealyOver() {
		//TimerManager.ins().remove(this.overDealy, this);
		//this.canChange = true;
	};
	overDealy() {
	}
	// canUpgradeByType(roleIndex, type) {
	// 	var s = SubRoles.ins().getSubRoleByIndex(roleIndex);
	// 	if (this.assert(s, "获取角色异常")) {
	// 		return false;
	// 	}
	// 	var loongSoulData = null
	// 	var nextloongSoulData = null
	// 	switch (type) {
	// 		case LongHun.TYPE_LONG_HUN:
	// 			loongSoulData = GlobalConfig.ins("LoongSoulConfig")[s.loongSoulData.level],
	// 				nextloongSoulData = GlobalConfig.ins("LoongSoulConfig")[s.loongSoulData.level + 1];
	// 			break;
	// 		case LongHun.TYPE_HU_DUN:
	// 			loongSoulData = GlobalConfig.ins("ShieldConfig")[s.shieldData.level],
	// 				nextloongSoulData = GlobalConfig.ins("ShieldConfig")[s.shieldData.level + 1]
	// 	}
	// 	if (nextloongSoulData) {
	// 		if (this.assert(loongSoulData, "获取当前配置异常")) {
	// 			return false
	// 		}
	// 		var r = UserBag.ins().getBagGoodsCountById(0, loongSoulData.itemId);
	// 		return r >= loongSoulData.cost
	// 	}
	// 	return false
	// }

	// canUpgradeinAll() {
	// 	for (var t = [LongHun.TYPE_LONG_HUN, LongHun.TYPE_HU_DUN], i = 0; 3 > i; i++)
	// 		for (var s = 0, n = t; s < n.length; s++) {
	// 			var a = n[s];
	// 			if (this.canUpgradeByType(i, a)) return true
	// 		}
	// 	return false
	// }

	// canUpgradeinAllByCur(t) {
	// 	for (var i = [LongHun.TYPE_LONG_HUN, LongHun.TYPE_HU_DUN], s = 0, n = i; s < n.length; s++) {
	// 		var a = n[s];
	// 		if (this.canUpgradeByType(t, a)) { return true }
	// 	}
	// 	return false
	// }

	assert(t, e) {
		return Assert(t, "[" + egret.getQualifiedClassName(this) + "] " + e)
	}

	public CheckRedPoint(): boolean {
		for (let i = 0; i < SubRoles.ins().subRolesLen; ++i) {
			if (this.CheckRedPointByRole(i)) {
				return true
			}
		}
		return false
	}

	public CheckRedPointByRole(roleIndex: number): boolean {
		for (let i = 1; i <= 4; ++i) {
			if (this.CheckRedPointByRoleEquip(roleIndex, i)) {
				return true
			}
		}
		return false
	}

	public CheckRedPointByEquip(equipIndex: number): boolean {
		for (let i = 0; i < SubRoles.ins().subRolesLen; ++i) {
			if (this.CheckRedPointByRoleEquip(i, equipIndex)) {
				return true
			}
		}
	}

	private longzhuangCommonConfig: any;
	private longzhuangStarConfig: any;

	public CheckRedPointByRoleEquip(roleIndex: number, equipIndex: number): boolean {
		var longzhuangdata = GameGlobal.rolesModel[roleIndex].longzhuangdata[equipIndex - 1];
		if (this.longzhuangCommonConfig == null) {
			this.longzhuangCommonConfig = GlobalConfig.ins("LongzhuangCommonConfig");
		}

		if (this.longzhuangCommonConfig.starMax <= longzhuangdata.star) {
			return false
		}

		if (this.longzhuangStarConfig == null)
			this.longzhuangStarConfig = GlobalConfig.ins("LongzhuangStarConfig");
		var longzhuangdata = GameGlobal.rolesModel[roleIndex].longzhuangdata[equipIndex - 1]
		let _config = this.longzhuangStarConfig[equipIndex][longzhuangdata.star]
		let _lvConfig = GlobalConfig.longzhuangLevelConfig[equipIndex][longzhuangdata.lv]
		var itemCount = UserBag.ins().getBagGoodsCountById(0, _lvConfig.itemId)

		var nextLvConfig = void 0;
		var nextStarConfig = void 0;

		var curStar = longzhuangdata.star % this.longzhuangCommonConfig.starPerLevel
		if (longzhuangdata.star >= (longzhuangdata.lv + 1) * this.longzhuangCommonConfig.starPerLevel && curStar == 0) {
			return true
		}
		else {
			if (itemCount < _lvConfig.itemNum) {
				return false
			}
		}
		return true
	}

	/**一键升级 */
	public sendLongOneKey(roleId: number) {
		let rsp = new Sproto.cs_longzhuang_onekey_request;
		rsp.roleId = roleId;
		this.Rpc(C2sProtocol.cs_longzhuang_onekey, rsp);
	}

}

MessageCenter.compile(LongHun);
window["LongHun"] = LongHun