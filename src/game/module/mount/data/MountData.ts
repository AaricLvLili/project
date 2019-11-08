class MountData {
	public constructor(data: Sproto.ride_data) {
		this.roleid = data.roleid;
		this.level = data.level;
		this.exp = data.exp;
		this.star = data.star;
		this.power = data.power;
		this.attr = data.attr;
		this.skill = data.skill;
		this.equipList = data.equipList;
		this.showLv = data.showLevel;
	}
	public roleid: number; // tag 0
	public level: number; // tag 1
	public exp: number; // tag 2
	public star: number; // tag 3
	public power: number; // tag 4
	public attr: Sproto.attribute_data[]; // tag 5
	public skill: number[]; // tag 6
	public equipList: Sproto.ride_equip[]; // tag 7
	public showLv: number = 1;

	public get isCanLvUp(): boolean {
		let mountsStarConfig = GlobalConfig.ins("MountsStarConfig")[this.star];
		if (mountsStarConfig == null && mountsStarConfig.exp == 0) {
			return false;
		}
		let mountsLevelConfig = GlobalConfig.ins("MountsLevelConfig")[this.level];
		let itemNum = UserBag.ins().getBagGoodsCountById(0, mountsLevelConfig.cost[0].id);
		let gold: number = GameLogic.ins().actorModel.gold;
		if (itemNum >= mountsLevelConfig.cost[0].count && gold >= mountsLevelConfig.cost[1].count) {
			return true;
		}
		return false;
	}

	public get equipAllPower() {
		let mountModel = MountModel.getInstance;
		var role = SubRoles.ins().getSubRoleByIndex(this.roleid);
		let power = 0;
		for (var i = 0; i < this.equipList.length; i++) {
			if (this.equipList[i].itemid > 0) {
				let attr = mountModel.getEquipLvAttr(this.equipList[i], role.job, i + 1);
				let starAttr = mountModel.getEquipStarAttr(this.equipList[i], role.job, i + 1);
				power += Math.floor(UserBag.getAttrPower(this.equipList[i].attr));
				power += Math.floor(UserBag.getAttrPower(attr));
				power += Math.floor(UserBag.getAttrPower(starAttr));
			}
		}
		return power;
	}

	public get equipLvAttr() {
		let mountModel = MountModel.getInstance;
		let attrs = [];
		var role = SubRoles.ins().getSubRoleByIndex(this.roleid);
		for (var i = 0; i < this.equipList.length; i++) {
			if (this.equipList[i].itemid > 0) {
				let attr = mountModel.getEquipLvAttr(this.equipList[i], role.job, i + 1);
				attrs.push(attr);
			}
		}
		for (var i = 0; i < this.equipList.length; i++) {
			if (this.equipList[i].itemid > 0) {
				let attr = mountModel.getEquipStarAttr(this.equipList[i], role.job, i + 1);
				attrs.push(attr);
			}
		}
		let newAttr = AttributeData.getAttr(attrs);
		return newAttr;
	}

	public get equipStarAttr() {
		let mountModel = MountModel.getInstance;
		let attrs = [];
		var role = SubRoles.ins().getSubRoleByIndex(this.roleid);
		for (var i = 0; i < this.equipList.length; i++) {
			if (this.equipList[i].itemid > 0) {
				let attr = mountModel.getEquipStarAttr(this.equipList[i], role.job, i + 1);
				attrs.push(attr);
			}
		}
		let newAttr = AttributeData.getAttr(attrs);
		return newAttr;
	}


}
window["MountData"] = MountData