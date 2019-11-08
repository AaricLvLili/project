class PetSproto extends BaseSystem {
	public constructor() {
		super();
		this.regNetMsg(S2cProtocol.sc_pet_init_res, this.getPetInit);
		this.regNetMsg(S2cProtocol.sc_pet_uplevel_res, this.getPetUpLevel);
		this.regNetMsg(S2cProtocol.sc_pet_upstar_res, this.getPetUpStar);
		this.regNetMsg(S2cProtocol.sc_pet_activate_res, this.getPetActivate);
		this.regNetMsg(S2cProtocol.sc_pet_rename_res, this.getChangeName);
		this.regNetMsg(S2cProtocol.sc_pet_setfight_res, this.getFightPet);
		this.regNetMsg(S2cProtocol.sc_pet_skillup_res, this.getSkillUp);
		this.regNetMsg(S2cProtocol.sc_pet_wash_res, this.getPetWash);
		this.regNetMsg(S2cProtocol.sc_pet_attach_init_res, this.getAttachInit);
		this.regNetMsg(S2cProtocol.sc_pet_attach_unlock_res, this.getPetAttachUnlock);
		this.regNetMsg(S2cProtocol.sc_pet_attach_res, this.getPetAttach);
		this.regNetMsg(S2cProtocol.sc_pet_sync_attr, this.getPetAttr);
		this.regNetMsg(S2cProtocol.sc_pet_washlock_res, this.getWashlock);
		this.regNetMsg(S2cProtocol.sc_pet_washrep_res, this.getWashrep);
		this.regNetMsg(S2cProtocol.sc_pet_smelt_res, this.getSmelt);
		this.regNetMsg(S2cProtocol.sc_pet_compose_res, this.getPetCompose);
		this.regNetMsg(S2cProtocol.sc_petsSearch_record, this.getPetSearch);
		this.regNetMsg(S2cProtocol.sc_petsSearch_hunt_result, this.getPetSearchResult)
		this.regNetMsg(S2cProtocol.sc_pet_wake_res, this.getAwakening)
		this.regNetMsg(S2cProtocol.sc_pet_pack_res, this.getPetAllShowLVUP)
		this.regNetMsg(S2cProtocol.sc_pet_attr_res, this.chageAtt)
	}
	static ins(): PetSproto {
		return super.ins();
	}

	/**获取宠物初始化信息 */
	private getPetInit(bytes: Sproto.sc_pet_init_res_request) {
		let petModel: PetModel = PetModel.getInstance;
		let petFightData = [0, 0, 0]
		if (bytes.petlist) {
			for (var i = 0; i < bytes.petlist.length; i++) {
				petFightData[i] = bytes.petlist[i];
			}
		}

		petModel.battlePetList = petFightData;
		petModel.setPetDic(bytes.data);
		/**图鉴的 */
		petModel.petAllShowLv = bytes.star;
		GameGlobal.MessageCenter.dispatch(PetEvt.PET_DATAUPDATE_MSG);
		petModel.updataPetCharNameLv();

	}
	/**升级返回 */
	private getPetUpLevel(bytes: Sproto.sc_pet_uplevel_res_request) {
		let petModel: PetModel = PetModel.getInstance;
		let petData = petModel.petDic.get(bytes.petid);
		if (petData) {
			if (petData.level != bytes.level) {
				UserTips.ins().showTips(GlobalConfig.jifengTiaoyueLg.st100638);
				GameGlobal.MessageCenter.dispatch(PetEvt.PET_LVUP_MSG);
			}
			petData.level = bytes.level;
			petData.exp = bytes.exp;
			petModel.updataPetCharNameLv();
		}
		GameGlobal.MessageCenter.dispatch(PetEvt.PET_DATAUPDATE_MSG);
	}
	/**升星返回 */
	private getPetUpStar(bytes: Sproto.sc_pet_upstar_res_request) {
		let petModel: PetModel = PetModel.getInstance;
		let petData = petModel.petDic.get(bytes.petid);
		if (petData && !GuideUtils.ins().isShow()) {
			petData.star = bytes.star;
			ViewManager.ins().open(PetNewWin, petData);
		}
		UserTips.ins().showTips(GlobalConfig.jifengTiaoyueLg.st101652);
		GameGlobal.MessageCenter.dispatch(PetEvt.PET_DATAUPDATE_MSG);
		GameGlobal.MessageCenter.dispatch(PetEvt.PET_STARUPEFF_MSG);

	}
	/**激活返回 */
	private getPetActivate(bytes: Sproto.sc_pet_activate_res_request) {
		let petModel: PetModel = PetModel.getInstance;
		let petData = petModel.petDic.get(bytes.petid);
		if (petData) {
			petData.isActivate = true;
			petData.level = 1;
		}
		UserTips.ins().showTips(GlobalConfig.jifengTiaoyueLg.st101653);
		if (!GuideUtils.ins().isShow()) {
			ViewManager.ins().open(PetNewWin, petData);
		}
		GameGlobal.MessageCenter.dispatch(PetEvt.PET_DATAUPDATE_MSG);
	}
	/**改名 */
	private getChangeName(bytes: Sproto.sc_pet_rename_res_request) {
		switch (bytes.result) {
			case -1:
				UserTips.ins().showTips(GlobalConfig.jifengTiaoyueLg.st101654);
				return;
			case -2:
				UserTips.ins().showTips("id错误");
				return;
		}
		let petModel: PetModel = PetModel.getInstance;
		let petData = petModel.petDic.get(bytes.petid);
		if (petData) {
			petData.name = bytes.name;
			petModel.updataPetCharNameLv();
		}
		UserTips.ins().showTips(GlobalConfig.jifengTiaoyueLg.st101655);
		ViewManager.ins().close(PetNameWin);
		GameGlobal.MessageCenter.dispatch(PetEvt.PET_DATAUPDATE_MSG);
	}
	/**出战宠物返回 */
	private getFightPet(bytes: Sproto.sc_pet_setfight_res_request) {
		let petModel: PetModel = PetModel.getInstance;
		let petDatas: PetData[] = petModel.petDic.values;
		petModel.setBattlePetList(bytes.roleid, bytes.result == 1 ? bytes.petid : 0)
		let data = petModel.petDic.get(bytes.petid);
		if (bytes.result == 1) {//出战成功,有相同的就替换
			data.inRoleId = -1//取消附身状态
			data.inRoleSlot = -1;
			for (let i = 0, len = petModel.battlePetList.length; i < len; i++) {
				let item = petModel.battlePetList[i]
				if (bytes.petid != 0 && bytes.petid == item && bytes.roleid != i) {
					petModel.setBattlePetList(i, 0)
				}
			}
		}
		GameGlobal.MessageCenter.dispatch(PetEvt.PET_DATAUPDATE_MSG, bytes.roleid);
	}

	/**技能升级 */
	private getSkillUp(bytes: Sproto.sc_pet_skillup_res_request) {
		let petModel: PetModel = PetModel.getInstance;
		let petData: PetData = petModel.petDic.get(bytes.petid);
		if (petData) {
			petData.skill = bytes.result;
		}
		GameGlobal.MessageCenter.dispatch(PetEvt.PET_DATAUPDATE_MSG);
	}
	/**技能洗练 */
	private getPetWash(bytes: Sproto.sc_pet_wash_res_request) {
		let petModel: PetModel = PetModel.getInstance;
		let petData: PetData = petModel.petDic.get(bytes.petid);
		if (petData) {
			petData.wash = bytes.wash;
		}
		GameGlobal.MessageCenter.dispatch(PetEvt.PET_CHANGEWASHSKILL_MSG);
		GameGlobal.MessageCenter.dispatch(PetEvt.PET_CHANGEWASHSKILLEFF_MSG);
	}
	/**附身初始化 */
	private getAttachInit(bytes: Sproto.sc_pet_attach_init_res_request) {
		let petModel: PetModel = PetModel.getInstance;
		petModel.setPetAttachData(bytes.data);
		GameGlobal.MessageCenter.dispatch(PetEvt.PET_ATTACH_MSG);
	}

	/**附身解锁 */
	private getPetAttachUnlock(bytes: Sproto.sc_pet_attach_unlock_res_request) {
		let petModel: PetModel = PetModel.getInstance;
		let data: Sproto.pet_attch_data = petModel.petAttachData.get(bytes.roleid);
		data.petid[bytes.slot - 1] = 0;
		GameGlobal.MessageCenter.dispatch(PetEvt.PET_ATTACH_MSG);
	}
	/**宠物附身 */
	private getPetAttach(bytes: Sproto.sc_pet_attach_res_request) {
		let petModel: PetModel = PetModel.getInstance;
		let allAttachData: Sproto.pet_attch_data[] = petModel.petAttachData.values;
		for (var i = 0; i < allAttachData.length; i++) {
			for (var f = 0; f < allAttachData[i].petid.length; f++) {
				if (allAttachData[i].petid[f] == bytes.petid) {
					let petData = petModel.petDic.get(allAttachData[i].petid[f]);
					if (petData) {
						petData.inRoleId = -1;
						petData.inRoleSlot = -1;
					}
					allAttachData[i].petid[f] = 0;
				}
			}
		}
		let data: Sproto.pet_attch_data = petModel.petAttachData.get(bytes.roleid);

		let oldSlotPetId = data.petid[bytes.slot - 1];
		if (oldSlotPetId > 0) {
			let petData = petModel.petDic.get(oldSlotPetId);
			petData.inRoleId = -1;
			petData.inRoleSlot = -1;
		}
		data.petid[bytes.slot - 1] = bytes.petid;
		let newPetData = petModel.petDic.get(bytes.petid);
		if (newPetData) {//取消附身返回0
			newPetData.inRoleId = bytes.roleid;
			newPetData.inRoleSlot = bytes.slot - 1;
		}
		GameGlobal.MessageCenter.dispatch(PetEvt.PET_ATTACH_MSG);
	}
	/**更新宠物属性 */
	private getPetAttr(bytes: Sproto.sc_pet_sync_attr_request) {
		let petModel: PetModel = PetModel.getInstance;
		let petData = petModel.petDic.get(bytes.petid);
		if (petData) {
			petData.power = bytes.power;
			petData.attr = bytes.attr;
		}
		GameGlobal.MessageCenter.dispatch(PetEvt.PET_DATAUPDATE_MSG);
	}
	/**更新宠物锁 */
	private getWashlock(bytes: Sproto.sc_pet_washlock_res_request) {
		let petModel: PetModel = PetModel.getInstance;
		let petData = petModel.petDic.get(bytes.petid);
		if (petData) {
			if (bytes.status == false) {
				for (var i = 0; i < petData.lock.length; i++) {
					if (petData.lock[i] == bytes.skillid) {
						petData.lock.splice(i, 1);
					}
				}
			} else {
				petData.lock.push(bytes.skillid);
			}
		}
		GameGlobal.MessageCenter.dispatch(PetEvt.PET_CHANGEWASHSKILL_MSG);
	}
	/**替换技能 */
	private getWashrep(bytes: Sproto.sc_pet_washrep_res_request) {
		let petModel: PetModel = PetModel.getInstance;
		let petData = petModel.petDic.get(bytes.petid);
		if (petData) {
			petData.bskill = bytes.bskill;
		}
		petData.wash = [];
		petData.lock = [];
		GameGlobal.MessageCenter.dispatch(PetEvt.PET_DATAUPDATE_MSG);
		GameGlobal.MessageCenter.dispatch(PetEvt.PET_CHANGEWASHSKILL_MSG);
	}
	/**熔炼返回 */
	private getSmelt(bytes: Sproto.sc_pet_smelt_res_request) {
		GameGlobal.MessageCenter.dispatch(PetEvt.PET_SMELTSELECT_MSG);
	}

	private getPetCompose(bytes: Sproto.sc_pet_compose_res_request) {
		GameGlobal.MessageCenter.dispatch(PetEvt.PET_DEBRIS_MSG, bytes.itemid);
	}

	/**获得宠物探索的人物奖励列表 */
	private getPetSearch(bytes: Sproto.sc_petsSearch_record_request) {
		let petTreasureRoleList: Sproto.petsSearch_record[] = bytes.petsSearchRecord;
		PetModel.getInstance.setTreasureRoleList(petTreasureRoleList)
		GameGlobal.MessageCenter.dispatch(PetEvt.PET_TREASURE_ROLE_MSG);
	}
	/**获得宠物探索的奖励列表 */
	private getPetSearchResult(bytes: Sproto.sc_petsSearch_hunt_result_request) {
		let items: Sproto.petsSearch_item[] = bytes.items;
		PetModel.getInstance.setTreasureResultData(items)
		ViewManager.ins().open(PetTreasureResultWin);
		GameGlobal.MessageCenter.dispatch(PetEvt.PET_TREASURE_MSG);
	}

	/**获得宠觉醒 */
	private getAwakening(bytes: Sproto.sc_pet_wake_res_request) {
		let petModel = PetModel.getInstance;
		let petData = petModel.petDic.get(bytes.petid);
		petData.isAwakening = true;
		GameGlobal.MessageCenter.dispatch(PetEvt.PET_AWAKEING_MSG);
		GameGlobal.MessageCenter.dispatch(PetEvt.PET_AWAKEING_MSG_EFF);
	}
	/**宠物图鉴 */
	private getPetAllShowLVUP(bytes: Sproto.sc_pet_pack_res_request) {
		let petModel = PetModel.getInstance;
		petModel.petAllShowLv = bytes.star;
		GameGlobal.MessageCenter.dispatch(PetEvt.PET_ALLSHOWSTATE_MSG);
	}

	/**
	* 处理属性变化(战斗)
	* 0-8
	* @param bytes
	*/
	public chageAtt(rsp: Sproto.sc_pet_attr_res_request) {
		var handler = rsp.handler;
		let charMonster = EntityManager.ins().getEntityByHandle(handler);
		for (var i = 0; i < rsp.attr.length; i++) {
			if (rsp.attr[i] > 0) {
				charMonster.infoModel.setAtt(i, rsp.attr[i])
			}
		}
	};

	/**宠物初始化信息 */
	public sendGetPetInitMsg() {
		let rsp = new Sproto.cs_pet_init_req_request;
		this.Rpc(C2sProtocol.cs_pet_init_req, rsp);
	}

	/**宠物升级 */
	public sendPetUpLevelMsg(petid: number, isAuto: boolean) {
		let rsp = new Sproto.cs_pet_uplevel_req_request;
		rsp.petid = petid;
		rsp.isAuto = isAuto;
		this.Rpc(C2sProtocol.cs_pet_uplevel_req, rsp);
	}
	/**宠物升星 */
	public sendPetUpStarMsg(petid: number) {
		let rsp = new Sproto.cs_pet_upstar_req_request;
		rsp.petid = petid;
		this.Rpc(C2sProtocol.cs_pet_upstar_req, rsp);
	}
	/**宠物激活 */
	public sendPetActivate(petid: number) {
		let rsp = new Sproto.cs_pet_activate_req_request;
		rsp.petid = petid;
		this.Rpc(C2sProtocol.cs_pet_activate_req, rsp);
	}
	/**宠物改名 */
	public sendChangeName(petid: number, name: string) {
		let rsp = new Sproto.cs_pet_rename_req_request;
		rsp.petid = petid;
		rsp.name = name;
		this.Rpc(C2sProtocol.cs_pet_rename_req, rsp);
	}
	/**宠物出战 */
	public sendFightPet(petid: number, roleid: number) {
		let rsp = new Sproto.cs_pet_setfight_req_request;
		rsp.petid = petid;
		rsp.roleid = roleid
		this.Rpc(C2sProtocol.cs_pet_setfight_req, rsp);
	}
	/**技能升级 */
	public sendPetSkillUp(petid: number, isAuto: boolean) {
		let rsp = new Sproto.cs_pet_skillup_req_request;
		rsp.petid = petid;
		rsp.isAuto = isAuto;
		this.Rpc(C2sProtocol.cs_pet_skillup_req, rsp);
	}
	/**洗练技能 */
	public sendPetWash(petid: number, isAuto: boolean) {
		let rsp = new Sproto.cs_pet_wash_req_request;
		rsp.petid = petid;
		rsp.isAuto = isAuto;
		this.Rpc(C2sProtocol.cs_pet_wash_req, rsp);
	}
	/**确定更换技能 */
	public sendSurePetWash(petid: number) {
		let rsp = new Sproto.cs_pet_washrep_req_request;
		rsp.petid = petid;
		this.Rpc(C2sProtocol.cs_pet_washrep_req, rsp);
	}
	/**附身初始化 */
	public sendPetAttachInit() {
		let rsp = new Sproto.cs_pet_attach_init_req_request;
		this.Rpc(C2sProtocol.cs_pet_attach_init_req, rsp);
	}
	/**附身解锁 */
	public sendPetAttachUnlock(roleid: number, slot: number) {
		let rsp = new Sproto.cs_pet_attach_unlock_req_request;
		rsp.roleid = roleid;
		rsp.slot = slot;
		this.Rpc(C2sProtocol.cs_pet_attach_unlock_req, rsp);
	}
	/**附身 */
	public sendPetAttachMsg(roleid: number, petid: number, slot: number) {
		let rsp = new Sproto.cs_pet_attach_req_request;
		rsp.roleid = roleid;
		rsp.petid = petid;
		rsp.slot = slot;
		this.Rpc(C2sProtocol.cs_pet_attach_req, rsp);
	}
	/**洗练锁 */
	public sendPetWashLockMsg(petid: number, skillid: number, status: boolean) {
		let rsp = new Sproto.cs_pet_washlock_req_request;
		rsp.petid = petid;
		rsp.skillid = skillid;
		rsp.status = status;
		this.Rpc(C2sProtocol.cs_pet_washlock_req, rsp);
	}
	/**洗练替换 */
	public sendPetWashrepMsg(petid: number) {
		let rsp = new Sproto.cs_pet_washrep_req_request;
		rsp.petid = petid;
		this.Rpc(C2sProtocol.cs_pet_washrep_req, rsp);
	}
	/**宠物熔炼 */
	public sendPetSmelt(handler: number, num: number) {
		let rsp = new Sproto.cs_pet_smelt_req_request;
		rsp.handler = handler;
		rsp.num = num;
		this.Rpc(C2sProtocol.cs_pet_smelt_req, rsp);
	}

	/**宠物碎片合成 */
	public sendPetCompose(itemid: number) {
		let rsp = new Sproto.cs_pet_compose_req_request;
		rsp.itemid = itemid;
		this.Rpc(C2sProtocol.cs_pet_compose_req, rsp);
	}

	/**宠物探索 type 0 1次 1 10次 */
	public sendTreasure(type: number) {
		let rsp = new Sproto.cs_petsSearch_hunt_request;
		rsp.type = type;
		this.Rpc(C2sProtocol.cs_petsSearch_hunt, rsp);
	}

	/**宠物觉醒 */
	public sendAwakening(petid: number) {
		let rsp = new Sproto.cs_pet_wake_req_request;
		rsp.petid = petid;
		this.Rpc(C2sProtocol.cs_pet_wake_req, rsp);
	}

	/**宠物图鉴升级 */
	public sendPetAllShowLvUp() {
		let rsp = new Sproto.cs_pet_pack_req_request;
		this.Rpc(C2sProtocol.cs_pet_pack_req, rsp);
	}
}
window["PetSproto"] = PetSproto