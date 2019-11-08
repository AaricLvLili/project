class TheGunModel {
	private static s_instance: TheGunModel;
	public static get getInstance(): TheGunModel {
		if (!TheGunModel.s_instance) {
			TheGunModel.s_instance = new TheGunModel();
		}
		return TheGunModel.s_instance;
	}
	public constructor() {
		this.testData();
	}
	public theGunDic: Dictionary<TheGunData> = new Dictionary<TheGunData>();
	private m_SkillSoltUnlockDic: Dictionary<{ slot: number, lv: number, skillId: number }> = new Dictionary<{ slot: number, lv: number, skillId: number }>();
	public nowSelectRoldData: Role;
	public achieve: number[] = [];
	public skillSelect: number = -1;

	public getAllPower(theGunData: TheGunData) {
		let power: number = 0;
		let starLvAttr = this.getTheGunStarLvAllAttr(theGunData);
		let attr = starLvAttr;
		let data: { slot: number, lv: number, skillId: number }[] = this.skillSoltDic.values;
		for (var i = 0; i < theGunData.skill.values.length; i++) {
			/**双key是个数组所以索引0开始所以要-1 */
			let spearSkillsUpgradeConfig = GlobalConfig.ins("SpearSkillsUpgradeConfig")[data[i].skillId][theGunData.skill.values[i] - 1];
			if (spearSkillsUpgradeConfig) {
				attr = AttributeData.getAttr([attr, spearSkillsUpgradeConfig.attrs]);
			}
		}
		power += Math.floor(UserBag.getAttrPower(attr));
		power += theGunData.danPower;
		return power;
	}
    /**获取技能属性 */
	public getSkillAttr(theGunData: TheGunData) {
		let attr = [];
		let data: { slot: number, lv: number, skillId: number }[] = this.skillSoltDic.values;
		for (var i = 0; i < theGunData.skill.values.length; i++) {
			/**双key是个数组所以索引0开始所以要-1 */
			let spearSkillsUpgradeConfig = GlobalConfig.ins("SpearSkillsUpgradeConfig")[data[i].skillId][theGunData.skill.values[i] - 1];
			if (spearSkillsUpgradeConfig) {
				attr = AttributeData.getAttr([attr, spearSkillsUpgradeConfig.attrs]);
			}
		}
		return attr;
	}

	public checkRoleRedPoint(role: Role): boolean {
		if (this.checkRoleSkillUp(role) || this.checkRoleTheGunLvUpRedPoint(role) || this.checkAllDanUp()) {
			return true;
		}
		return false;
	}

	/**检查角色技能是否可以升级 */
	public checkRoleSkillUp(role: Role): boolean {
		let theGunData: TheGunData = this.theGunDic.get(role.roleID);
		if (theGunData) {
			let skillData = [0, 0, 0, 0];
			for (var i = 0; i < theGunData.skill.values.length; i++) {
				skillData[i] = theGunData.skill.values[i];
				let skillSoltData: { slot: number, lv: number, skillId: number } = this.skillSoltDic.get(i + 1);
				let isCanUp = this.checkSkillUp(skillSoltData.skillId, skillData[i]);
				if (isCanUp) {
					return true;
				}
			}
		}
		return false;
	}

	/**检查技能是否可以升级 */
	public checkSkillUp(skillId: number, skillLv: number): boolean {
		let skillData = GlobalConfig.ins("SpearSkillsUpgradeConfig")[skillId][skillLv];
		let nextskillData = GlobalConfig.ins("SpearSkillsUpgradeConfig")[skillId][skillLv + 1];
		if (skillData && nextskillData) {
			let itemId = skillData.cost.id;
			let needNum = skillData.cost.count;
			let itemNum = UserBag.ins().getBagGoodsCountById(0, itemId);
			if (itemNum >= needNum && skillLv > 0) {
				return true;
			}
		}
		return false;
	}

	public get skillSoltDic() {
		if (this.m_SkillSoltUnlockDic.length <= 0) {
			let spearLevelConfig = GlobalConfig.ins("SpearLevelConfig");
			for (let key in spearLevelConfig) {
				let slot = spearLevelConfig[key].skill_limit;
				if (slot) {
					let data = { slot: spearLevelConfig[key].skill_limit[0], lv: spearLevelConfig[key].level, skillId: spearLevelConfig[key].skill_limit[1] }
					this.m_SkillSoltUnlockDic.set(data.slot, data);
				}
			}
		}
		return this.m_SkillSoltUnlockDic;
	}

	public checkRoleTheGunLvUpRedPoint(role: Role) {
		let theGunData: TheGunData = this.theGunDic.get(role.roleID);
		if (theGunData) {
			if (theGunData.isCanLvUp) {
				return true;
			}
		}
	}

	public checkTheGunLvUpAwardRedPoint() {
		for (var i = 0; i < this.achieve.length; i++) {
			if (this.achieve[i] == 1) {
				return true;
			}
		}
		return false;
	}

	public getTheGunStarLvAllAttr(theGunData: TheGunData): { type: number, value: number }[] {
		let dic: Dictionary<{ type: number, value: number }> = new Dictionary<{ type: number, value: number }>();
		let spearStarConfig = GlobalConfig.ins("SpearStarConfig")[theGunData.star];
		let starAttr = [];
		let lvAttr = [];
		if (spearStarConfig) {
			for (var i = 0; i < spearStarConfig.attr.length; i++) {
				let star = { type: spearStarConfig.attr[i].type, value: spearStarConfig.attr[i].value };
				starAttr.push(star);
			}
		}
		let spearLevelConfig = GlobalConfig.ins("SpearLevelConfig")[theGunData.level];
		if (spearLevelConfig) {
			for (var i = 0; i < spearLevelConfig.attr.length; i++) {
				let lv = { type: spearLevelConfig.attr[i].type, value: spearLevelConfig.attr[i].value };
				lvAttr.push(lv);
			}
		}
		for (var i = 0; i < starAttr.length; i++) {
			let type = starAttr[i].type;
			let data: { type: number, value: number } = dic.get(type);
			if (data) {
				data.value += starAttr[i].value;
			} else {
				dic.set(type, starAttr[i]);
			}
		}
		for (var i = 0; i < lvAttr.length; i++) {
			let type = lvAttr[i].type;
			let data: { type: number, value: number } = dic.get(type);
			if (data) {
				data.value += lvAttr[i].value;
			} else {
				dic.set(type, lvAttr[i]);
			}
		}
		return dic.values;
	}

	/**圣枪全红点 */
	public checkAllRedPoint(): boolean {
		if (Deblocking.Check(DeblockingType.TYPE_92, true)) {
			if (this.checkAllSkillCanUp() || this.checkAllTheGunLvUpRedPoint() || this.checkTheGunLvUpAwardRedPoint() || this.checkAllDanUp()) {
				return true;
			}
		}
		return false;
	}

	/**检查全部技能是否可以升级 */
	public checkAllSkillCanUp(): boolean {
		let roleList = SubRoles.ins().rolesModel;
		for (var i = 0; i < roleList.length; i++) {
			let isCanUp = this.checkRoleSkillUp(roleList[i]);
			if (isCanUp) {
				return true;
			}
		}
		return false;
	}

	public checkAllTheGunLvUpRedPoint() {
		for (var i = 0; i < 3; i++) {
			let theGunData: TheGunData = this.theGunDic.get(i);
			if (theGunData) {
				if (theGunData.isCanLvUp) {
					return true;
				}
			}
		}
		return false;
	}

	public checkAllDanUp() {
		let configData = GlobalConfig.ins("SpearShuXingDanjcConfig");
		for (let key in configData) {
			let data = configData[key];
			let isCan = this.checkDanUp(data.id);
			if (isCan) {
				return true;
			}
		}
		return false;
	}

	public checkDanUp(id: number) {
		let num = UserBag.ins().getBagGoodsCountById(0, id);
		if (num > 0) {
			return true;
		}
		return false;
	}

	public testData() {
		let skillids = GlobalConfig.ins("SpearCommonConfig").skill;
		if (this.theGunDic.values.length <= 0) {
			for (var i = 0; i < 3; i++) {
				let data = new Sproto.holygun_data();
				data.roleid = i;
				data.scala = 1;
				data.exp = 0;
				data.star = 0;
				data.power = 0;
				let testSkillData = [];
				for (var f = 0; f < 4; f++) {
					let skillData = new Sproto.skillinfo;
					skillData.skillid = skillids[f];
					skillData.level = 0;
					testSkillData.push(skillData);
					data.skill = testSkillData;
				}
				let testDanYaoData = [];
				let config = GlobalConfig.ins("SpearShuXingDanjcConfig");
				if (config) {
					for (let key in config) {
						let configData = config[key];
						if (configData) {
							let danYaoData = new Sproto.dan_info
							danYaoData.id = configData.id;
							danYaoData.num = 0;
							testDanYaoData.push(danYaoData);
							data.danyao = testDanYaoData
						}
					}
				}
				let theGunData: TheGunData = new TheGunData(data);
				this.theGunDic.set(data.roleid, theGunData);
			}
		}
	}


}