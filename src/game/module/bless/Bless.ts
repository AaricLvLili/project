class Bless extends BaseSystem {

	public static ins(): Bless {
		return super.ins()
	}

	level = 0; //等级
	exp = 0; //经验
	public constructor() {
		super()

		this.sysId = PackageID.strongthen;
		this.regNetMsg(S2cProtocol.sc_forge_belss_update, this.postBelssUpdate);
		this.regNetMsg(S2cProtocol.sc_forge_back_goods_success, this.doBackGoodsSuccess);
		this.regNetMsg(S2cProtocol.sc_forge_bless_ronglu_success, this.postBlessRongluSuccess);
		this.regNetMsg(S2cProtocol.sc_forge_bless_boost_res, this.getBoostMsg);
		this.regNetMsg(S2cProtocol.sc_forge_bless_upgrade_res, this.getUpgradeMsg);
		this.regNetMsg(S2cProtocol.sc_forge_bless_smelt_res, this.getSmelt);

	}

	/**锻造数据变更*/
	postBelssUpdate(bytes: Sproto.sc_forge_belss_update_request) {
		var roleId = bytes.roleId;
		var role = SubRoles.ins().getSubRoleByIndex(roleId);
		role.parseForgeChange(bytes, 1100);
	};
	doBackGoodsSuccess(bytes: Sproto.sc_forge_back_goods_success_request) {
		if (bytes.result == 1)
			Bless.postBlessSuccess();
	};
	/**派发成功回收 */
	public static postBlessSuccess() {
	};
	/*熔炉属性变更*/
	postBlessRongluSuccess(bytes: Sproto.sc_forge_bless_ronglu_success_request) {
		this.level = bytes.level;
		this.exp = bytes.exp;
	};
    /**
     * 提升请求
     * @param roleId 角色
     * @param pos 部位
     */
	sendUpBlessLevel(roleId, pos) {
		var cs_forge_upgrade_bless = new Sproto.cs_forge_upgrade_bless_request();
		cs_forge_upgrade_bless.roleId = roleId;
		cs_forge_upgrade_bless.pos = pos;
		GameSocket.ins().Rpc(C2sProtocol.cs_forge_upgrade_bless, cs_forge_upgrade_bless);
		// var bytes = this.getBytes(3);
		// bytes.writeShort(roleId);
		// bytes.writeShort(pos);
		// this.sendToServer(bytes);
	};
    /**
     * 提升 回收启灵道具
     * @param num 回收数量
     */
	sendBackUpGoods(num) {
		var cs_forge_back_upgrade_goods = new Sproto.cs_forge_back_upgrade_goods_request();
		cs_forge_back_upgrade_goods.num = num;
		GameSocket.ins().Rpc(C2sProtocol.cs_forge_back_upgrade_goods, cs_forge_back_upgrade_goods);
		// var bytes = this.getBytes(4);
		// bytes.writeShort(num);
		// this.sendToServer(bytes);
	};
    /**
     * 熔炉熔炼
     * @param num 数量
     * @param item 物品
     */
	sendRonglu(item) {
		var cs_forge_bless_ronglu_success = new Sproto.cs_forge_bless_ronglu_success_request();
		cs_forge_bless_ronglu_success.handles = new Array();
		// var bytes = this.getBytes(5);
		// //记录当前位置，跳过数组长度的写入
		// var pos = bytes.position;
		// bytes.position += 2;
		// var n = 0;
		for (var i = 0; i < item.length; i++) {
			if (item[i] != null) {
				cs_forge_bless_ronglu_success.handles.push(item[i].handle);
				// item[i].handle.writeByte(bytes);
				// bytes.writeDouble(item[i].handle);
				// ++n;
			}
		}
		if (cs_forge_bless_ronglu_success.handles.length > 0)
			GameSocket.ins().Rpc(C2sProtocol.cs_forge_bless_ronglu_success, cs_forge_bless_ronglu_success);
		// if (n == 0)
		// 	return;
		// //回到之前记录的位置，并写入数组长度
		// bytes.position = pos;
		// bytes.writeShort(n);
		// this.sendToServer(bytes);
	};

	private BlessCostConfig: any;
    /**
 * 检查升级材料是否足够
 */
	checkIsEnough() {
		if (this.BlessCostConfig == null)
			this.BlessCostConfig = GlobalConfig.ins("BlessCostConfig");
		var info = this.BlessCostConfig["1"];
		var curNum = UserBag.ins().getBagGoodsCountById(0, info.stoneId);
		return curNum >= info.stoneNum;
	};
	checkIsHaveUp() {
		var role0 = this.checkRoleIsShowRed(0);
		var role1 = this.checkRoleIsShowRed(1);
		var role2 = this.checkRoleIsShowRed(2);
		var result = role0 || role1 || role2;
		return result;
	};
	checkRoleIsShowRed(index) {
		if (index >= SubRoles.ins().subRolesLen) {
			return false;
		}
		// let equips:EquipsData[] = SubRoles.ins().getSubRoleByIndex(index).equipsData;
		var role = SubRoles.ins().getSubRoleByIndex(index);
		var equipLen = role.getEquipLen();
		if (equipLen > 0) {
			var len = 8;
			var data = void 0;
			for (var i = 0; i < len; i++) {
				data = role.getEquipByIndex(i);
				if (data.bless <= 0 && Bless.ins().checkIsEnough()) {
					return true;
				} else if (data.bless >= 1) {
					let isCan = this.checkBlessUpLv(i, data);
					if (isCan) {
						return isCan;
					}
				}
			}
		}
		return false;
	};

	public checkBlessUpLv(pot, data) {
		let equipBlessStarConfig = GlobalConfig.ins("EquipBlessStarConfig")[pot][data.blessstar];
		if (equipBlessStarConfig.exp == 0) {
			return false;
		}
		let equipBlessLevelConfig = GlobalConfig.ins("EquipBlessLevelConfig")[pot][data.blesslv - 1];
		for (var f = 0; f < equipBlessLevelConfig.cost.length; f++) {
			let itemData = equipBlessLevelConfig.cost[f];
			if (itemData.id == 1) {
				if (GameLogic.ins().actorModel.gold < itemData.count) {
					return false;
				}
			} else {
				let haveItemNum = UserBag.ins().getBagGoodsCountById(0, itemData.id);
				if (haveItemNum < itemData.count) {
					return false;
				}
			}
		}
		return true;
	}
	isCanBack() {
		//角色有未开启的
		if (SubRoles.ins().subRolesLen < 3) {
			return false;
		}
		for (var index = 0; index < 3; index++) {
			// let equips:EquipsData[] = SubRoles.ins().getSubRoleByIndex(index).equipsData;
			var role = SubRoles.ins().getSubRoleByIndex(index);
			var equipLen = role.getEquipLen();
			if (equipLen > 0) {
				var len = 8;
				for (var i = 0; i < len; i++) {
					var data = role.getEquipByIndex(i);
					if (data.bless <= 0) {
						return false;
					}
				}
			}
		}
		return true;
	};
	/**器灵升级(升星) */
	private getBoostMsg(bytes: Sproto.sc_forge_bless_boost_res_request) {
		let role: Role = SubRoles.ins().getSubRoleByIndex(bytes.roleId);
		let equipsData: EquipsData = role.getEquipByIndex(bytes.pos);
		equipsData.blessexp = bytes.blessexp;
		equipsData.blessstar = bytes.blessstar;
		Bless.postBlessSuccess();
	}
	/**器灵升阶 */
	private getUpgradeMsg(bytes: Sproto.sc_forge_bless_upgrade_res_request) {
		let role: Role = SubRoles.ins().getSubRoleByIndex(bytes.roleId);
		let equipsData: EquipsData = role.getEquipByIndex(bytes.pos);
		equipsData.blesslv = bytes.blesslv;
		Bless.postBlessSuccess();
	}
	/**分解 */
	private getSmelt(bytes: Sproto.sc_forge_bless_smelt_res_request) {
		Bless.postBlessSuccess();
	}
	/**器灵升级(升星) */
	public sendBoostMsg(roleId: number, pos: number, isAuto: boolean) {
		var bytes = new Sproto.cs_forge_bless_boost_req_request();
		bytes.roleId = roleId;
		bytes.pos = pos;
		bytes.isAuto = isAuto;
		GameSocket.ins().Rpc(C2sProtocol.cs_forge_bless_boost_req, bytes);
	}
	/**器灵升阶 */
	public sendUpgradeMsg(roleId: number, pos: number) {
		var bytes = new Sproto.cs_forge_bless_upgrade_req_request();
		bytes.roleId = roleId;
		bytes.pos = pos;
		GameSocket.ins().Rpc(C2sProtocol.cs_forge_bless_upgrade_req, bytes);
	}
	/**圣器分解 */
	public sendSmelt(handler: number, num: number) {
		var bytes = new Sproto.cs_forge_bless_smelt_req_request();
		bytes.handler = handler;
		bytes.num = num;
		GameSocket.ins().Rpc(C2sProtocol.cs_forge_bless_smelt_req, bytes);
	}
}
MessageCenter.compile(Bless);
window["Bless"] = Bless