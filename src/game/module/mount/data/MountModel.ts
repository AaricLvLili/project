class MountModel {
	private static s_instance: MountModel;
	public static get getInstance(): MountModel {
		if (!MountModel.s_instance) {
			MountModel.s_instance = new MountModel();
		}
		return MountModel.s_instance;
	}
	public constructor() {
		this.mountDic = new Dictionary<MountData>();
		this.m_SkillSoltUnlockDic = new Dictionary<number>();
		this.m_EquipSoltUnlockDic = new Dictionary<number>();
	}
	public mountDic: Dictionary<MountData>;
	public achieve: number[]=[];
	private m_SkillSoltUnlockDic: Dictionary<any>;
	private m_EquipSoltUnlockDic: Dictionary<number>;

	public skillSelect: number = -1;
	public nowSelectRoldData: Role;
	public nowSelectEquipSlot: number;

	public nowDanYaoSelectRoleData: Role;

	public setStar(group: eui.Group, star: number) {
		let numChild = group.numChildren;
		for (var i = 0; i < numChild; i++) {
			group.removeChildAt(0);
		}
		if (star == 0) {
			return;
		}
		let bigStarNum = Math.floor(star / 5);
		let littleStarNum = star % 5;
		for (var i = 0; i < bigStarNum; i++) {
			let img: eui.Image = new eui.Image;
			img.source = "comp_23_23_1_png";
			img.scaleX = 0.8;
			img.scaleY = 0.8;
			group.addChild(img);
		}
		for (var i = 0; i < littleStarNum; i++) {
			let img: eui.Image = new eui.Image;
			img.source = "comp_23_23_3_png";
			img.scaleX = 0.8;
			img.scaleY = 0.8;
			group.addChild(img);
		}
	}

	private m_LvMaxStarNum: number = null

	public get lvMaxStarNum() {
		if (this.m_LvMaxStarNum == null) {
			this.m_LvMaxStarNum = GlobalConfig.ins("MountsCommonConfig").starPerLevel;
		}
		return this.m_LvMaxStarNum;
	}

	public get skillSoltDic() {
		if (this.m_SkillSoltUnlockDic.length <= 0) {
			let mountsLevelConfig = GlobalConfig.ins("MountsLevelConfig");
			for (let key in mountsLevelConfig) {
				let slot = mountsLevelConfig[key].skill_limit;
				if (slot) {
					let data = { slot: mountsLevelConfig[key].skill_limit[0], lv: mountsLevelConfig[key].level, skillId: mountsLevelConfig[key].skill_limit[1] }
					this.m_SkillSoltUnlockDic.set(data.slot, data);
				}
			}
		}
		return this.m_SkillSoltUnlockDic;
	}

	public get equipSoltUnlockDic() {
		if (this.m_EquipSoltUnlockDic.length <= 0) {
			let mountsLevelConfig = GlobalConfig.ins("MountsLevelConfig");
			for (let key in mountsLevelConfig) {
				let solt = mountsLevelConfig[key].equip_limit;
				if (solt) {
					this.m_EquipSoltUnlockDic.set(solt, mountsLevelConfig[key].level);
				}
			}
		}
		return this.m_EquipSoltUnlockDic;
	}

	public getEquipColor(qualuty: number): string {
		let data = GlobalConfig.jifengTiaoyueLg;
		let list = [data.st101641, data.st101642, data.st101643, data.st101644, data.st101645, data.st101646];
		return list[qualuty];
	}

	public getEquipTypeName(type: MountEquipType) {
		let name = "";
		let data = GlobalConfig.jifengTiaoyueLg;
		switch (type) {
			case MountEquipType.TYPE1:
				name = data.st101647;
				break;
			case MountEquipType.TYPE2:
				name = data.st101648;
				break;
			case MountEquipType.TYPE3:
				name = data.st101649;
				break;
			case MountEquipType.TYPE4:
				name = data.st101650;
				break;
		}
		return name;
	}

	public getAllPower(mountData: MountData): number {
		let power: number = 0;
		power += mountData.equipAllPower;
		let starLvAttr = this.getMountStarLvAllAttr(mountData);
		let attr = starLvAttr;
		let data: { slot: number, lv: number, skillId: number }[] = this.skillSoltDic.values;
		for (var i = 0; i < mountData.skill.length; i++) {
			let mountsSkillsUpgradeConfig = GlobalConfig.ins("MountsSkillsUpgradeConfig")[data[i].skillId][mountData.skill[i] - 1];
			if (mountsSkillsUpgradeConfig) {
				attr = AttributeData.getAttr([attr, mountsSkillsUpgradeConfig.attrs]);
			}
		}
		power += Math.floor(UserBag.getAttrPower(attr));
		return power;
	}


	public getMountAllEquipAttr(mountData: MountData): { type: number, value: number }[] {
		let dic: Dictionary<{ type: number, value: number }> = new Dictionary<{ type: number, value: number }>();
		for (var i = 0; i < mountData.equipList.length; i++) {
			let equipData = mountData.equipList[i]
			for (var f = 0; f < equipData.attr.length; f++) {
				let type = equipData.attr[f].type;
				let data: { type: number, value: number } = dic.get(type);
				if (data) {
					data.value += equipData.attr[f].value;
				} else {
					dic.set(type, equipData.attr[f]);
				}
			}
		}
		if (dic.values.length > 0) {
			return dic.values;
		} else {
			return this.minAttr();
		}

	}

	public getMountStarLvAllAttr(mountData: MountData): { type: number, value: number }[] {
		let dic: Dictionary<{ type: number, value: number }> = new Dictionary<{ type: number, value: number }>();
		let mountsStarConfig = GlobalConfig.ins("MountsStarConfig")[mountData.star];
		let starAttr = [];
		let lvAttr = [];
		if (mountsStarConfig) {
			for (var i = 0; i < mountsStarConfig.attr.length; i++) {
				let star = { type: mountsStarConfig.attr[i].type, value: mountsStarConfig.attr[i].value };
				starAttr.push(star);
			}
		}
		let mountsLevelConfig = GlobalConfig.ins("MountsLevelConfig")[mountData.level];
		if (mountsLevelConfig) {
			for (var i = 0; i < mountsLevelConfig.attr.length; i++) {
				let lv = { type: mountsLevelConfig.attr[i].type, value: mountsLevelConfig.attr[i].value };
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

	public getMountSkinAttr(): { type: number, value: number }[] {
		let dic: Dictionary<{ type: number, value: number }> = new Dictionary<{ type: number, value: number }>();
		return this.minAttr();
	}

	private minAttr(): { type: number, value: number }[] {
		let listData = [];
		let list = { type: 2, value: 0 };
		let list2 = { type: 4, value: 0 };
		let list3 = { type: 5, value: 0 };
		let list4 = { type: 6, value: 0 };
		listData.push(list, list2, list3, list4);
		return listData;
	}

	public getEquipLvAttr(equipData: Sproto.ride_equip, job: number, slot: number, lv?: number): { type: number, value: number }[] {
		let mountsEquipGrowUpConfig = GlobalConfig.ins("MountsEquipGrowUpConfig")[job + "0" + slot][equipData.itemid];
		let equipLv: number;
		if (lv) {
			equipLv = lv
		} else {
			equipLv = equipData.level;
		}
		let needItemNum = 1 + Math.floor(equipLv / 5);
		let power = AttributeData.getNowPower(0, equipLv, 0, 5, mountsEquipGrowUpConfig.price, mountsEquipGrowUpConfig.basiccon, mountsEquipGrowUpConfig.increasecon, mountsEquipGrowUpConfig.slope, mountsEquipGrowUpConfig.revisecon);
		let attr = AttributeData.getAttrByPower(mountsEquipGrowUpConfig.maxHp, mountsEquipGrowUpConfig.maxAtk, mountsEquipGrowUpConfig.maxDef, mountsEquipGrowUpConfig.maxMagDef, power);
		return attr;
	}

	public getEquipStarAttr(equipData: Sproto.ride_equip, job: number, slot: number, star?: number): { type: number, value: number }[] {
		let mountsEquipStarConfig = GlobalConfig.ins("MountsEquipStarConfig")[job + "0" + slot][equipData.itemid];
		let equipStar: number
		if (star) {
			equipStar = star;
		} else {
			equipStar = equipData.star;
		}
		let needItemNum = 1 + Math.floor(equipStar / 5);
		let power = AttributeData.getNowPower(0, equipStar, 0, 5, mountsEquipStarConfig.price, mountsEquipStarConfig.basiccon, mountsEquipStarConfig.increasecon, mountsEquipStarConfig.slope, mountsEquipStarConfig.revisecon);
		let attr = AttributeData.getAttrByPower(mountsEquipStarConfig.maxHp, mountsEquipStarConfig.maxAtk, mountsEquipStarConfig.maxDef, mountsEquipStarConfig.maxMagDef, power);
		return attr;
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
	/**检查角色技能是否可以升级 */
	public checkRoleSkillUp(role: Role): boolean {
		let mountData: MountData = this.mountDic.get(role.roleID);
		if (mountData) {
			let skillData = [0, 0, 0, 0];
			for (var i = 0; i < mountData.skill.length; i++) {
				skillData[i] = mountData.skill[i];
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
		let skillData = GlobalConfig.ins("MountsSkillsUpgradeConfig")[skillId][skillLv];
		let nextskillData = GlobalConfig.ins("MountsSkillsUpgradeConfig")[skillId][skillLv + 1];
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
	/**装备孔开了 */
	public checkEquipIsOpen(data: Sproto.ride_equip): boolean {
		if (data != null && data.itemid == 0) {
			return true;
		}
		return false;
	}
	/**装备孔装了东西 */
	public checkEquipIsHaveItem(data: Sproto.ride_equip): boolean {
		if (data != null && data.itemid > 0) {
			return true;
		}
		return false;
	}
	/**装备能孔升级 */
	public checkEquipIsLvUp(data: Sproto.ride_equip, role: Role): boolean {
		if (this.checkEquipIsHaveItem(data)) {
			let mountsEquipGrowUpConfig = GlobalConfig.ins("MountsEquipGrowUpConfig")[(role.job) + "0" + data.slot];
			let lvConfig = mountsEquipGrowUpConfig[data.itemid];
			let itemNum = UserBag.ins().getBagGoodsCountById(0, lvConfig.itemId1);
			let needNum = 1 + Math.floor(data.level / 5);
			if (itemNum >= needNum && data.level != lvConfig.maxLevel) {
				return true;
			}
		}
		return false;
	}
	/**装备能孔升星 */
	public checkEquipIsStarUp(data: Sproto.ride_equip, role: Role): boolean {
		if (this.checkEquipIsHaveItem(data)) {
			let mountsEquipStarConfig = GlobalConfig.ins("MountsEquipStarConfig")[(role.job) + "0" + data.slot];
			let lvConfig = mountsEquipStarConfig[data.itemid];
			let itemNum = UserBag.ins().getBagGoodsCountById(0, lvConfig.itemId1);
			let needNum = 1 + Math.floor(data.star / 5);
			if (itemNum >= needNum && data.star != lvConfig.maxLevel) {
				return true;
			}
		}
		return false;
	}
	/**装备孔没有装备时有否可以装的装备 */
	public checkEquipIsCanChange(data: Sproto.ride_equip, role: Role): boolean {
		if (this.checkEquipIsOpen(data)) {
			let itemDatas: ItemData[] = UserBag.ins().getBagGoodsByMountEquip(ItemType.MOUNTEQUIP, data.slot, role.job);
			if (itemDatas.length > 0) {
				return true;
			}
		}
		return false;
	}
	/**装备是否显示红点 */
	public checkEquipRedPoint(data: Sproto.ride_equip, role: Role): boolean {
		if (this.checkEquipIsCanChange(data, role) || this.checkEquipIsLvUp(data, role) || this.checkEquipIsStarUp(data, role)) {
			return true;
		}
		return false;
	}
	/**角色的装备是否显示红点 */
	public checkRoleEquipRedPoint(role: Role): boolean {
		let mountData: MountData = this.mountDic.get(role.roleID);
		if (mountData) {
			for (var i = 0; i < 4; i++) {
				if (mountData.equipList[i]) {
					let isShow = this.checkEquipRedPoint(mountData.equipList[i], role);
					if (isShow) {
						return true;
					}
				}
			}
		}
		return false;
	}
	/**全部装备是否显示红点 */
	public checkAllEquipRedPoint(): boolean {
		let roleList = SubRoles.ins().rolesModel;
		for (var i = 0; i < roleList.length; i++) {
			let role: Role = roleList[i];
			let isShow = this.checkRoleEquipRedPoint(role);
			if (isShow) {
				return true;
			}
		}
		return false;
	}
	/**坐骑全红点 */
	public checkAllRedPoint(): boolean {
		if (Deblocking.Check(DeblockingType.TYPE_63, true)) {
			if (this.checkAllSkillCanUp() || this.checkAllEquipRedPoint() || this.checkAllMountLvUpRedPoint() || this.checkMountSkinAllRedPoint() || this.checkMoutnLvUpAwardRedPoint() ) {
				return true;
			}
		}
		return false;
	}
	/**坐骑角色红点 */
	public checkRoleRedPoint(role: Role): boolean {
		if (this.checkRoleEquipRedPoint(role) || this.checkRoleSkillUp(role) || this.checkRoleMountLvUpRedPoint(role)) {
			return true;
		}
		return false;
	}

	public checkAllMountLvUpRedPoint() {
		for (var i = 0; i < 3; i++) {
			let mountData: MountData = this.mountDic.get(i);
			if (mountData) {
				if (mountData.isCanLvUp) {
					return true;
				}
			}
		}
		return false;
	}

	public checkRoleMountLvUpRedPoint(role: Role) {
		let mountData: MountData = this.mountDic.get(role.roleID);
		if (mountData) {
			if (mountData.isCanLvUp) {
				return true;
			}
		}
	}
	/**检查坐骑皮肤有没有红点 */
	public checkMountSkinAllRedPoint() {
		let roleList = SubRoles.ins().rolesModel;
		for (var i = 0; i < roleList.length; i++) {
			let role: Role = roleList[i];
			let isShow = this.checkMountSkinRedPoint(role.roleID);
			if (isShow) {
				return true;
			}
		}
		return false;
	}

	public checkMountSkinRedPoint(roleId: number) {
		let zhuangBanId = GlobalConfig.ins("ZhuangBanId");
		let pos = 5;
		for (var t in zhuangBanId) {
			if (GameGlobal.rolesModel[roleId].job == zhuangBanId[t].roletype && pos == zhuangBanId[t].pos) {
				let itemId = zhuangBanId[t].cost.itemId;
				let num = zhuangBanId[t].cost.num;
				var n = GameGlobal.dressmodel.getinfoById(zhuangBanId[t].id);
				if (n) {
					if (UserBag.ins().getBagGoodsCountById(0, itemId) >= num && n.dressLevel < 5) //&& GameGlobal.actorModel.level > 16
					{
						return true;
					}
				} else {
					if (UserBag.ins().getBagGoodsCountById(0, itemId) >= num) //&& GameGlobal.actorModel.level <= 16
					{
						return true;
					}
				}
			}
		}
		return false;
	}

	public checkMoutnLvUpAwardRedPoint() {
		for (var i = 0; i < this.achieve.length; i++) {
			if (this.achieve[i] == 0) {
				return true;
			}
		}
		return false;
	}


}


enum MountEquipType {
	/**头盔 */
	TYPE1 = 1,
	/**项圈 */
	TYPE2 = 2,
	/**鞍具 */
	TYPE3 = 3,
	/**蹄甲 */
	TYPE4 = 4,
}
window["MountModel"] = MountModel