enum PowerSkillState {
	LOADING = 0,
	USE = 1,
	INIT = 2,
}

class UserSkill extends BaseSystem {

	public static POWER_SKILL = 68001;
	private effectsConfig: any;

	public static EN_TIME = 200;
	public static ins(): UserSkill {
		return super.ins();
	}

	private skillsUpgradeConfig: any;

	public constructor() {
		super();
		this.sysId = PackageID.Skill;
		this.regNetMsg(S2cProtocol.sc_skill_use_result, this.doSkillResult);
		this.regNetMsg(S2cProtocol.sc_skill_deal_add_buff, this.doBuff);
		this.regNetMsg(S2cProtocol.sc_skill_deal_remove_buff, this.doRemoveBuff);
		this.regNetMsg(S2cProtocol.sc_skill_add_effect, this.doAddEffect);
		this.regNetMsg(S2cProtocol.sc_skill_remove_effect, this.doRemoveEffect);
		this.regNetMsg(S2cProtocol.sc_skill_upgrade_result, this.grewUpSkillResult);
		this.regNetMsg(S2cProtocol.sc_skill_all_upgrade_result, this.grewUpAllSkillResult);
		this.regNetMsg(S2cProtocol.sc_heji_skill_data, this._DoHejiSkill)
		this.regNetMsg(S2cProtocol.sc_skill_setfight_res, this.getSkillSetFight)
	}

	private _DoHejiSkill(rsp: Sproto.sc_heji_skill_data_request) {
		_Log("UserSkill:HejiSkill", rsp.skillID, rsp.show)
	}

	public CheckHejiSkill() {
		if (SubRoles.ins().subRolesLen < 2) {
			UserTips.ins().showTips(GlobalConfig.jifengTiaoyueLg.st101660)
			return false
		}
		return true
	}

    /**
     * 请求使用技能
     * 2-1
     * @param handle 目标唯一标识
     * @param skillID 使用的技能id
     */
	public sendUseSkill(suorceHandle, handle, skillID) {
		var bytes = this.getBytes(1);
		bytes.writeDouble(suorceHandle);
		bytes.writeDouble(handle);
		bytes.writeInt(skillID);
		this.sendToServer(bytes);
	};
    /**
     * 技能使用结果
     * 2-1
     * @param bytse
     */
	public doSkillResult(rsp: Sproto.sc_skill_use_result_request) {
		//施法者
		var sourceHandle = rsp.sourceHandle;
		var skillID = rsp.skillID;
		let isHeji = false
		let skillVo = GlobalConfig.skillsConfig[skillID];
		let hitCount = skillVo.hitCount;
		let sourceTarget = EntityManager.ins().getEntityByHandle(sourceHandle);
		if (sourceTarget instanceof CharRole) {
			sourceTarget.infoModel.setAtt(AttributeType.atMp, (rsp.mp / 100));
			sourceTarget.updateBlood();
		}
		if (skillID == UserSkill.POWER_SKILL) {
			isHeji = true
			if (sourceTarget) {
				if (sourceTarget.team == Team.My) {
					GameGlobal.MessageCenter.dispatch(MessageDef.GAME_SCENE_WORD, "comp_164_47_01_png")
				}
			}
			let view = ViewManager.ins().getView(UIView1);
			if (view && view instanceof UIView1) {
				view.nowHJCD = 0;
			}
		}
		// console.log("服务器使用技能:" + skillID);
		//目标者
		var targetHandle = rsp.targetHandle;
		var charSource = EntityManager.ins().getEntityByHandle(sourceHandle);
		if (!charSource) {
			//console.error(`找不到handle:${sourceHandle}的施法者`);
			return;
		}
		var charTarget = EntityManager.ins().getEntityByHandle(targetHandle);
		if (!charTarget) {
			//console.error(`找不到handle:${targetHandle}的目标者`);
			return;
		}
		if (!(charSource instanceof CharRole) || charSource.parent)
			this.userSkill(charSource, charTarget, GlobalConfig.skillsConfig[skillID]);
		charSource.atking = true;
		TimerManager.ins().doTimer(charSource.curPlayTime, 1, charSource.resetStand, charSource);
		var count = rsp.datas.length;
		var handle;
		var type; //0不显示，1命中，2暴击
		var value;
		let skillsConfig = GlobalConfig.ins("SkillsConfig")[skillID];
		for (var i = 0; i < count; i++) {
			handle = rsp.datas[i].handle;
			var damageTarget = EntityManager.ins().getEntityByHandle(handle);
			type = rsp.datas[i].type;
			value = rsp.datas[i].value;
			let damageType = rsp.datas[i].damageType;
			let damageValue = rsp.datas[i].damageEle;
			if (type == DamageTypes.BLANK)
				continue;
			if (damageTarget)
				TimerManager.ins().doTimer(charSource.curPlayTime / 2, 1, () => {
					GameLogic.ins().postEntityHpChange(damageTarget, charSource, isHeji ? DamageTypes.HEJI : type, value, hitCount, [null, skillsConfig.skillType]);
					egret.setTimeout(()=> {
						GameLogic.ins().postEntityHpChange(damageTarget, charSource, isHeji ? DamageTypes.HEJI : type, damageValue, hitCount, [damageType, skillsConfig.skillType]);
					}, this, UserSkill.EN_TIME);
				}, damageTarget)
		}
		if (count == 0 && isHeji) {
			var sceneView = ViewManager.ins().getView(GameSceneView) as GameSceneView;
			DisplayUtils.shakeIt(sceneView.map, 6, 150, 7)
		}

	}
	/**
     * 使用技能
     * @param self 技能使用者
     * @param enemy 技能作用者
     * @param skill 使用的技能
     * @return 是否造成伤害
     */
	public userSkill(self, enemy, skill) {
		if (self != enemy) {
			//计算方向
			self.dir = DirUtil.get8DirBy2Point(self, enemy);
		}
		//人物状态改变（触发从第一帧开始播放）
		self.playAction(skill.actionType);
		if (!skill)
			return false;
		//播放技能特效
		GameLogic.ins().playSkillEff(skill, self, enemy);
		return true;
	};

    /**
     * 处理技能buff
     * @2-2
     * @param bytes
     */
	public doBuff(rsp: Sproto.sc_skill_deal_add_buff_request) {
		var handle = rsp.handle;
		var char = EntityManager.ins().getEntityByHandle(handle);
		if (char) {
			var buff = ObjectPool.ins().pop('EntityBuff');
			if (this.effectsConfig == null)
				this.effectsConfig = GlobalConfig.ins("EffectsConfig");
			buff.effConfig = this.effectsConfig[rsp.buffID];
			buff.value = 0;
			buff.addTime = egret.getTimer();
			char.addBuff(buff);
		}
	};
    /**
     * 处理删除技能buff
     * @2-3
     * @param bytes
     */
	public doRemoveBuff(rsp: Sproto.sc_skill_deal_remove_buff_request) {
		var handle = rsp.handle;
		var char = EntityManager.ins().getEntityByHandle(handle);
		if (char) {
			if (this.effectsConfig == null)
				this.effectsConfig = GlobalConfig.ins("EffectsConfig");
			if (this.effectsConfig[rsp.buffID] == null) {
				Main.errorBack("不存在buffid--doRemoveBuff函数" + rsp.buffID);
				return;
			}
			var id = this.effectsConfig[rsp.buffID].group;
			if (char.hasBuff(id))
				char.removeBuff(char.buffList[id]);
		}
	};
    /**
     * 添加特效
     * 2-6
     * @param bytse
     */
	public doAddEffect(rsp: Sproto.sc_skill_add_effect_request) {
		var handle = rsp.handle;
		var char = EntityManager.ins().getEntityByHandle(handle);
		if (char)
			char.addEffect(rsp.effectID);
	};
    /**
     * 删除特效
     * 2-7
     * @param bytse
     */
	public doRemoveEffect(rsp: Sproto.sc_skill_remove_effect_request) {
		var handle = rsp.handle;
		var char = EntityManager.ins().getEntityByHandle(handle);
		if (char)
			char.removeEffect(rsp.effectID);
	};
    /**
    * 请求升级技能
    * 2-4
    * @param roleId 角色目标唯一标识
    * @param skillID 要升级的技能id
    */
	public sendGrewUpSkill(roleId, skillID) {
		var cs_skill_upgrade = new Sproto.cs_skill_upgrade_request();
		cs_skill_upgrade.roleID = roleId;
		cs_skill_upgrade.skillID = skillID;
		GameSocket.ins().Rpc(C2sProtocol.cs_skill_upgrade, cs_skill_upgrade);
	};
    /**
    * 技能升级结果
    * 2-4
    * @param bytse
    */
	public grewUpSkillResult(rsp: Sproto.sc_skill_upgrade_result_request) {
		var roleId = rsp.roleID;
		var skillID = rsp.skillID;
		var level = rsp.level;

		var role = SubRoles.ins().getSubRoleByIndex(roleId)

		var skillsData = role.skillsData;
		let upLevel = level - skillsData[skillID - 1]
		skillsData[skillID - 1] = level;
		MessageCenter.ins().dispatch(MessageDef.SKILL_UPGRADE, roleId, skillID, level, upLevel)

	};
    /**
    * 请求单个技能一键升级
    * 2-5
    * @param roleId 角色目标唯一标识
    * @param skillID 技能ID
    */
	public sendGrewUpAllSkill(roleId, skillID) {
		var cs_skill_upgrade_all = new Sproto.cs_skill_upgrade_all_request();
		cs_skill_upgrade_all.roleID = roleId;
		GameSocket.ins().Rpc(C2sProtocol.cs_skill_upgrade_all, cs_skill_upgrade_all);
	};

    /**
    * 全部技能升级结果
    * 2-5
    * @param bytse
    */
	public grewUpAllSkillResult(rsp: Sproto.sc_skill_all_upgrade_result_request) {
		var roleId = rsp.roleID;
		let role = SubRoles.ins().getSubRoleByIndex(roleId)
		let skillsData = role.skillsData;
		var skills = [];
		let upSkills = []
		for (var i = 0; i < rsp.level.length; i++) {
			let lv = rsp.level[i]
			upSkills[i] = lv - skillsData[i]
			// skillsData[i] = lv
			role.setSkillsDataByIndex(i, lv);
			skills.push(rsp.level[i]);
		}
		MessageCenter.ins().dispatch(MessageDef.SKILL_GREWUPALL, roleId, skills, upSkills);
	};
    /** TODO hepeiye
     * 获取当前技能最高等级限制
     */
	public getSkillLimitLevel() {
		return UserZs.ins().lv > 0 ? 80 + UserZs.ins().lv * 10 : (GameLogic.ins().actorModel.level > 80 ? 80 : GameLogic.ins().actorModel.level);
	};

	private getSkillSetFight(rsp: Sproto.sc_skill_setfight_res_request) {
		var subRole = SubRoles.ins().getSubRoleByIndex(rsp.roleID);
		subRole.skillsDataIndex = rsp.skillID;
		GameGlobal.MessageCenter.dispatch(MessageDef.SKILL_UPDATE);
	}


	public sendSkillSetFight(roleId: number, skillID: number[]) {
		let isHaveMainSkill = this.checkListHaveMainSkill(skillID, roleId);
		if (!isHaveMainSkill) {
			UserTips.ins().showTips(GlobalConfig.jifengTiaoyueLg.st101661);
			return
		}
		var data = new Sproto.cs_skill_setfight_req_request();
		data.roleID = roleId;
		data.skillID = skillID;
		GameSocket.ins().Rpc(C2sProtocol.cs_skill_setfight_req, data);
	}
	private _maxLv

	public get maxLv() {
		if (this._maxLv > 0) {
			return this._maxLv;
		}
		let config = GlobalConfig.ins("SkillsUpgradeConfig");
		let maxLv = 0;
		for (let key in config) {
			maxLv += 1;
		}
		this._maxLv = maxLv;
		return this._maxLv;
	}

	public getskillLv(roleId: number, index: number) {
		var subRole = SubRoles.ins().getSubRoleByIndex(roleId);
		let skillLv = subRole.skillsData[index - 1];
		if (skillLv <= 0 || !skillLv) {
			skillLv = 0;
		}
		return skillLv;
	}

	public getSkillId(job: number, index: number, lv) {
		let fKeyConfig = GlobalConfig.ins("SkillsOpenConfig");
		let sKeyConfig = fKeyConfig[job];
		let skillOpneIds: number = 0;
		for (let key in sKeyConfig) {
			if (sKeyConfig[key].index == index) {
				skillOpneIds = sKeyConfig[key].skillId - sKeyConfig[key].initialLevel;
				break;
			}
		}
		let skillId: number = skillOpneIds + lv;
		return skillId;
	}

	public getSkillDataById(skillId: number): { job: number, index: number, lv: number } {
		let skillData = { job: 0, index: 0, lv: 0 };
		skillData.lv = parseInt(skillId.toString().slice(3, 6));
		let config = GlobalConfig.ins("SkillsOpenConfig");
		for (let key in config) {
			let configDatas = config[key];
			for (var i = 0; i < configDatas.length; i++) {
				let minLvId = configDatas[i].skillId - configDatas[i].initialLevel;
				let nowMinLvId = skillId - skillData.lv;
				if (minLvId == nowMinLvId) {
					skillData.job = configDatas[i].roletype;
					skillData.index = configDatas[i].index;
					break;
				}
			}

		}
		return skillData;
	}


	public getSkillTypeStr(skillType: SkillType) {
		let str = "";
		switch (skillType) {
			case SkillType.TYPE1:
				str = GlobalConfig.jifengTiaoyueLg.st101662;
				break;
			case SkillType.TYPE2:
				str = GlobalConfig.jifengTiaoyueLg.st101663;
				break;
			case SkillType.TYPE7:
			case SkillType.TYPE3:
				str = GlobalConfig.jifengTiaoyueLg.st101664;
				break;
			case SkillType.TYPE4:
				str = GlobalConfig.jifengTiaoyueLg.st101665;
				break;
			case SkillType.TYPE5:
				str = GlobalConfig.jifengTiaoyueLg.st101666;
				break;
		}
		return str;
	}
	/**检查数组列表里面有没有普攻 */
	public checkListHaveMainSkill(list: number[], roleId: number): boolean {
		var subRole = SubRoles.ins().getSubRoleByIndex(roleId);
		let skillLvList = subRole.skillsData;
		for (var i = 0; i < list.length; i++) {
			let index = list[i];
			if (index <= 0) {
				continue;
			}
			let skillLv = skillLvList[index - 1]
			let skillId = this.getSkillId(subRole.job, index, skillLv);
			let skillsConfig = GlobalConfig.ins("SkillsConfig")[skillId];
			if (skillsConfig) {
				if (skillsConfig.skillType == SkillType.TYPE1) {
					return true;
				}
			}
		}
		return false;
	}

	public cutListHaveModMainSkill(list: number[], roleId: number, skillIndex: number): number[] {
		if (!this.checkListHaveMainSkill([skillIndex], roleId)) {
			return list;
		}
		var subRole = SubRoles.ins().getSubRoleByIndex(roleId);
		let skillLvList = subRole.skillsData;
		for (var i = 0; i < list.length; i++) {
			let index = list[i];
			if (index <= 0 || index == skillIndex) {
				continue;
			}
			let skillLv = skillLvList[index - 1]
			let skillId = this.getSkillId(subRole.job, index, skillLv);
			let skillsConfig = GlobalConfig.ins("SkillsConfig")[skillId];
			if (skillsConfig) {
				if (skillsConfig.skillType == SkillType.TYPE1) {
					list[i] = -1;
					UserTips.ins().showTips(GlobalConfig.jifengTiaoyueLg.st101667);
				}
			}
		}
		return list;
	}

	public checkAllSkillRedPoint() {
		if (this.checkAllRoleSkillCanLvUp() == true || this.checkAllAddSkillRedPoint() == true) {
			return true;
		}
		return false;
	}


	public checkAllRoleSkillCanLvUp() {
		let roleList = SubRoles.ins().rolesModel;
		for (var i = 0; i < roleList.length; i++) {
			let roleCanLvUp = this.checkRoleSkillCanLvUp(roleList[i].roleID);
			if (roleCanLvUp) {
				return true;
			}
		}
		return false;
	}
	public checkRoleSkillCanLvUp(roleId: number) {
		var subRole = SubRoles.ins().getSubRoleByIndex(roleId);
		if (subRole) {
			for (var i = 0; i < subRole.skillsData.length; i++) {
				let isCanUp = this.checkSkillCanLvUp(roleId, i + 1);
				if (isCanUp) {
					return true;
				}
			}
		}
		return false;
	}

	public checkSkillCanLvUp(roleId: number, index: number): boolean {
		var subRole = SubRoles.ins().getSubRoleByIndex(roleId);
		let config = GlobalConfig.ins("SkillsOpenConfig")[subRole.job];
		let skillsOpenConfig = null;
		let zzLv = ZhuanZhiModel.ins().getZhuanZhiLevel(roleId);
		let skillLv = UserSkill.ins().getskillLv(roleId, index);
		let skillId = UserSkill.ins().getSkillId(subRole.job, index, skillLv);
		let isCanLvUp: boolean = false;
		let nextSkillsConfig: any;
		nextSkillsConfig = GlobalConfig.ins("SkillsConfig")[skillId + 1];
		if (nextSkillsConfig) {
			let needLv = nextSkillsConfig.upgradeLimit;
			let playerlv = GameLogic.ins().actorModel.level;
			let playerzs = UserZs.ins() ? UserZs.ins().lv : 0;
			if (needLv >= 1000) {
				needLv = needLv / 1000;
				if (playerzs >= needLv) {
					isCanLvUp = true;
				}
			} else {
				if (playerlv >= needLv) {
					isCanLvUp = true;
				}
			}
			for (var i = 0; i < config.length; i++) {
				if (config[i].index == index) {
					skillsOpenConfig = config[i];
					break;
				}
			}
			if (isCanLvUp && skillLv < UserSkill.ins().maxLv && zzLv >= skillsOpenConfig.level) {
				let skillsUpgradeConfig = GlobalConfig.ins("SkillsUpgradeConfig")[skillLv + 1];
				if (skillsUpgradeConfig) {
					let needItemId = skillsOpenConfig.levelUpCost;
					let itemNum = UserBag.ins().getBagGoodsCountById(0, needItemId);
					if (itemNum >= skillsUpgradeConfig.cost) {
						return true;
					}
				}
			}
		}
		return false;
	}
	public checkAllAddSkillRedPoint(): boolean {
		let roleList = SubRoles.ins().rolesModel;
		for (var i = 0; i < roleList.length; i++) {
			let roleCanUser = this.checkAddSkillRedPoint(roleList[i].roleID);
			if (roleCanUser) {
				return true;
			}
		}
		return false;
	}
	public checkAddSkillRedPoint(roleId: number): boolean {
		var subRole = SubRoles.ins().getSubRoleByIndex(roleId);
		let canUserNum = 0;
		let skillLvs = subRole.skillsData;
		for (var i = 0; i < skillLvs.length; i++) {
			if (skillLvs[i] > 0) {
				let skillId = this.getSkillId(subRole.job, i + 1, skillLvs[i]);
				let skillsConfig = GlobalConfig.ins("SkillsConfig")[skillId];
				if (skillsConfig.skillType != SkillType.TYPE4) {
					canUserNum += 1;
				}
			}
		}
		let canAddNum = 0;
		let skillIndexs = subRole.skillsDataIndex;
		for (var i = 0; i < 7; i++) {
			if (!skillIndexs[i] || skillIndexs[i] <= 0) {
				canAddNum += 1;
			}
		}
		if (canUserNum - (7 - canAddNum) > 0 && canAddNum > 0) {
			return true;
		}
		return false;

	}

	public checkSkillGuide(skillIndex: number): boolean {
		let skillLv = UserSkill.ins().getskillLv(0, skillIndex);
		if (skillLv == 0) {
			return true;
		}
		return false;
	}

	public checkSkillAddGuide(guideId: number, skillIndex: number): boolean {
		let skillLv = UserSkill.ins().getskillLv(0, skillIndex);
		if (skillLv == 1 && GuideLocalStorage.checkIdIsCompele(guideId) == false) {
			return true;
		}
		return false;
	}
}
MessageCenter.compile(UserSkill);

enum SkillType {
	/**普攻 */
	TYPE1 = 1,
	/**技能 */
	TYPE2 = 2,
	/**奥义 */
	TYPE3 = 3,
	/**被动 */
	TYPE4 = 4,
	/**非角色技能 */
	TYPE5 = 5,
	/**转职技能 */
	TYPE6 = 6,
	/**随机技能 */
	TYPE7 = 7,
}
window["UserSkill"] = UserSkill