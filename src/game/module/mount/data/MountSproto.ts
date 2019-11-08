class MountSproto extends BaseSystem {
	public constructor() {
		super();
		this.regNetMsg(S2cProtocol.sc_ride_init_res, this.getMountInit);
		this.regNetMsg(S2cProtocol.sc_ride_uplevel_res, this.getMountLvUp);
		this.regNetMsg(S2cProtocol.sc_ride_upstar_res, this.getMountStarUp);
		this.regNetMsg(S2cProtocol.sc_ride_skillup_res, this.getMountSkillUp);
		this.regNetMsg(S2cProtocol.sc_ride_equip_uplevel_res, this.getMountEquipLvUp);
		this.regNetMsg(S2cProtocol.sc_ride_equip_upstar_res, this.getMountEquipStarUp);
		this.regNetMsg(S2cProtocol.sc_ride_equipchange_res, this.getMountEquipChange);
		this.regNetMsg(S2cProtocol.sc_ride_equipoff_res, this.getMountEquipOff);
		this.regNetMsg(S2cProtocol.sc_ride_eat_res, this.getMountDanYaoEat);
		this.regNetMsg(S2cProtocol.sc_ride_getaward_res, this.getMountGetaward);
		this.regNetMsg(S2cProtocol.sc_ride_change_res, this.getMountChangeShow);
	}
	static ins(): MountSproto {
		return super.ins();
	}

	/**获取坐骑初始化信息 */
	private getMountInit(bytes: Sproto.sc_ride_init_res_request) {
		let mountModel = MountModel.getInstance;
		for (var i = 0; i < bytes.data.length; i++) {
			let mountData: MountData = new MountData(bytes.data[i]);
			mountModel.mountDic.set(bytes.data[i].roleid, mountData);
		}
		mountModel.achieve = bytes.achieve;
		GameGlobal.MessageCenter.dispatch(MountEvt.MOUNT_DATAUPDATE_MSG);
	}
	/**获取坐骑初升级信息 */
	private getMountLvUp(bytes: Sproto.sc_ride_uplevel_res_request) {
		let mountModel = MountModel.getInstance;
		let mountData: MountData = mountModel.mountDic.get(bytes.roleid);
		if (mountData) {
			mountData.level = bytes.level;
		}
		this.sendGetMountInitMsg();
		ViewManager.ins().open(MountNewWin, mountData);
		GameGlobal.MessageCenter.dispatch(MountEvt.MOUNT_DATAUPDATE_MSG);
		var role = EntityManager.ins().getMainRole(bytes.roleid);
		if (role) {
			role.infoModel.mountsLevel = bytes.level;
			role.infoModel.mountsShowLv = bytes.level;
			role.updateModel();
		}
	}
	/**获取坐骑升星信息 */
	private getMountStarUp(bytes: Sproto.sc_ride_upstar_res_request) {
		let mountModel = MountModel.getInstance;
		let mountData: MountData = mountModel.mountDic.get(bytes.roleid);
		if (mountData) {
			mountData.star = bytes.star;
			mountData.exp = bytes.exp;
		}
		GameGlobal.MessageCenter.dispatch(MountEvt.MOUNT_DATAUPDATE_MSG);
	}
	/**获取坐骑技能升级信息 */
	private getMountSkillUp(bytes: Sproto.sc_ride_skillup_res_request) {
		let mountModel = MountModel.getInstance;
		let mountData: MountData = mountModel.mountDic.get(bytes.roleid);
		if (mountData) {
			let skillId = mountData.skill[bytes.id - 1];
			if (skillId) {
				mountData.skill[bytes.id - 1] = bytes.level
			} else {
				mountData.skill.push(bytes.level);
			}
		}
		GameGlobal.MessageCenter.dispatch(MountEvt.MOUNT_DATAUPDATE_MSG);
		GameGlobal.MessageCenter.dispatch(MountEvt.MOUNT_SKILLDATAUPDATE_MSG);
	}
	/**获取坐骑装备升级信息 */
	private getMountEquipLvUp(bytes: Sproto.sc_ride_equip_uplevel_res_request) {
		let mountModel = MountModel.getInstance;
		let mountData: MountData = mountModel.mountDic.get(bytes.roleid);
		if (mountData) {
			for (var i = 0; i < mountData.equipList.length; i++) {
				if (mountData.equipList[i].slot == bytes.slot) {
					mountData.equipList[i].level = bytes.level;
				}
			}
		}
		GameGlobal.MessageCenter.dispatch(MountEvt.MOUNT_DATAUPDATE_MSG);
	}
	/**获取坐骑装备升星信息 */
	private getMountEquipStarUp(bytes: Sproto.sc_ride_equip_upstar_res_request) {
		let mountModel = MountModel.getInstance;
		let mountData: MountData = mountModel.mountDic.get(bytes.roleid);
		if (mountData) {
			for (var i = 0; i < mountData.equipList.length; i++) {
				if (mountData.equipList[i].slot == bytes.slot) {
					mountData.equipList[i].star = bytes.star;
				}
			}
		}
		GameGlobal.MessageCenter.dispatch(MountEvt.MOUNT_DATAUPDATE_MSG);
	}
	/**获取坐骑装备更换信息 */
	private getMountEquipChange(bytes: Sproto.sc_ride_equipchange_res_request) {
		let mountModel = MountModel.getInstance;
		let mountData: MountData = mountModel.mountDic.get(bytes.roleid);
		if (mountData) {
			for (var i = 0; i < mountData.equipList.length; i++) {
				if (mountData.equipList[i].slot == bytes.slot) {
					mountData.equipList[i].itemid = bytes.itemid;
					mountData.equipList[i].attr = bytes.attr;
				}
			}
		}
		GameGlobal.MessageCenter.dispatch(MountEvt.MOUNT_DATAUPDATE_MSG);
	}
	/**获取坐骑装备卸下信息 */
	private getMountEquipOff(bytes: Sproto.sc_ride_equipoff_res_request) {
		let mountModel = MountModel.getInstance;
		let mountData: MountData = mountModel.mountDic.get(bytes.roleid);
		if (mountData) {
			for (var i = 0; i < mountData.equipList.length; i++) {
				if (mountData.equipList[i].slot == bytes.slot) {
					mountData.equipList[i].itemid = 0;
					mountData.equipList[i].attr = [];
				}
			}
		}
		ViewManager.ins().close(MountEquipWin);
		GameGlobal.MessageCenter.dispatch(MountEvt.MOUNT_DATAUPDATE_MSG);
	}
	/**获取坐骑丹药信息 */
	private getMountDanYaoEat(bytes: Sproto.sc_ride_eat_res_request) {
		let mountModel = MountModel.getInstance;
		let mountData: MountData = mountModel.mountDic.get(bytes.roleid);
		if (mountData) {
			mountData.attr = bytes.attr;
		}
		ViewManager.ins().close(MountDanYaoUseWin);
		GameGlobal.MessageCenter.dispatch(MountEvt.MOUNT_DANYAO_MSG);
	}
	/**获取坐骑升阶奖励信息 */
	private getMountGetaward(bytes: Sproto.sc_ride_getaward_res_request) {
		let mountModel = MountModel.getInstance;
		mountModel.achieve[bytes.id - 1] = bytes.status;
		GameGlobal.MessageCenter.dispatch(MountEvt.MOUNT_AWARD_MSG);
	}
	/**修改坐骑幻化信息 */
	private getMountChangeShow(bytes: Sproto.sc_ride_change_res_request) {
		let mountModel = MountModel.getInstance;
		let mountData = mountModel.mountDic.get(bytes.roleid);
		mountData.showLv = bytes.showLevel;
		var role = EntityManager.ins().getMainRole(bytes.roleid);
		if (role) {
			role.infoModel.mountsShowLv = bytes.showLevel;
			role.updateModel();
		}
		GameGlobal.MessageCenter.dispatch(MountEvt.MOUNT_CHANGESHOUW_MSG);
	}




	/**坐骑初始化信息 */
	public sendGetMountInitMsg() {
		let rsp = new Sproto.cs_ride_init_req_request;
		this.Rpc(C2sProtocol.cs_ride_init_req, rsp);
	}

	/**坐骑升级 */
	public sendGetMountLvUp(roleId: number) {
		let rsp = new Sproto.cs_ride_uplevel_req_request;
		rsp.roleid = roleId;
		this.Rpc(C2sProtocol.cs_ride_uplevel_req, rsp);
	}

	/**坐骑升星信息 */
	public sendGetMountStarUp(roleId: number, isAuto: boolean) {
		let rsp = new Sproto.cs_ride_upstar_req_request;
		rsp.roleid = roleId;
		rsp.isAuto = isAuto;
		this.Rpc(C2sProtocol.cs_ride_upstar_req, rsp);
	}

	/**坐骑技能升级信息 */
	public sendGetMountSkillUp(roleId: number, skillid: number, isAuto: boolean) {
		let rsp = new Sproto.cs_ride_skillup_req_request;
		rsp.roleid = roleId;
		rsp.id = skillid;
		rsp.isAuto = isAuto;
		this.Rpc(C2sProtocol.cs_ride_skillup_req, rsp);
	}

	/**坐骑装备升级信息 */
	public sendGetMountEquipLvUp(roleId: number, slot: number) {
		let rsp = new Sproto.cs_ride_equip_uplevel_req_request;
		rsp.roleid = roleId;
		rsp.slot = slot;
		this.Rpc(C2sProtocol.cs_ride_equip_uplevel_req, rsp);
	}

	/**坐骑装备升星信息 */
	public sendGetMountEquipStarUp(roleId: number, slot: number) {
		let rsp = new Sproto.cs_ride_equip_upstar_req_request;
		rsp.roleid = roleId;
		rsp.slot = slot;
		this.Rpc(C2sProtocol.cs_ride_equip_upstar_req, rsp);
	}

	/**坐骑装备更换信息 */
	public sendGetMountEquipChange(roleId: number, slot: number, handler: number) {
		let rsp = new Sproto.cs_ride_equipchange_req_request;
		rsp.roleid = roleId;
		rsp.slot = slot;
		rsp.handler = handler;
		this.Rpc(C2sProtocol.cs_ride_equipchange_req, rsp);
	}

	/**坐骑装备卸下信息 */
	public sendGetMountEquipOff(roleId: number, slot: number) {
		let rsp = new Sproto.cs_ride_equipoff_req_request;
		rsp.roleid = roleId;
		rsp.slot = slot;
		this.Rpc(C2sProtocol.cs_ride_equipoff_req, rsp);
	}

	/**吃丹药 */
	public sendGetMountEatDanYao(roleId: number, itemid: number, count: number) {
		let rsp = new Sproto.cs_ride_eat_req_request;
		rsp.roleid = roleId;
		rsp.itemid = itemid;
		rsp.count = count;
		this.Rpc(C2sProtocol.cs_ride_eat_req, rsp);
	}

	/**领奖 */
	public sendGetMountGetAward(id: number) {
		let rsp = new Sproto.cs_ride_getaward_req_request;
		rsp.id = id;
		this.Rpc(C2sProtocol.cs_ride_getaward_req, rsp);
	}
	/**发送修改坐骑显示 */
	public sendChageMountShow(id: number, showLevel: number) {
		let rsp = new Sproto.cs_ride_change_req_request;
		rsp.roleid = id;
		rsp.lv = showLevel;
		this.Rpc(C2sProtocol.cs_ride_change_req, rsp);
	}






}
window["MountSproto"] = MountSproto