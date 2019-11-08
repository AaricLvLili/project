class PetData {
	public constructor() {
	}
	public petid: number; // tag 0
	public name: string; // tag 1
	public level: number; // tag 2
	public exp: number; // tag 3
	public star: number; // tag 4
	public _power: number; // tag 5
	public attr: Sproto.attribute_data[] = []; // tag 6
	public skill: number; // tag 7
	public bskill: number[] = []; // tag 8
	public isActivate: boolean = false;
	public isFight: boolean = false;
	public wash: number[] = [];
	public lock: number[] = [];
	public inRoleId: number = -1;
	/**数据由0开始 */
	public inRoleSlot: number = -1;
	public isAwakening: boolean = false;

	public attachWeight = 0;
	/**显示权重 */
	public point: number;

	public get isCanActivate(): boolean {
		if (this.isActivate == false) {
			let petConfig = GlobalConfig.ins("PetConfig")[this.petid];
			if (petConfig) {
				let itemNum = UserBag.ins().getBagGoodsCountById(0, petConfig.activationItem);
				if (itemNum >= 1) {
					return true;
				}
			}
		}
		return false;
	}

	public get isCanLvUp() {
		if (this.isActivate == true) {
			if (this.level < GameLogic.ins().actorModel.level) {
				let petLevelExpConfig = GlobalConfig.ins("PetLevelExpConfig")[this.level];
				let nextpetLevelExpConfig = GlobalConfig.ins("PetLevelExpConfig")[this.level + 1];
				if (petLevelExpConfig && nextpetLevelExpConfig) {
					let itemNum = UserBag.ins().getBagGoodsCountById(0, petLevelExpConfig.itemId);
					if (itemNum >= petLevelExpConfig.itemNum) {
						return true;
					}
				}
			}
		}
		return false;
	}

	public get isCanStarUp() {
		if (this.isActivate == true) {
			let petConfig = GlobalConfig.ins("PetConfig")[this.petid];
			if (petConfig) {
				let itemNum = UserBag.ins().getBagGoodsCountById(0, petConfig.starItem);
				let itemNum2 = UserBag.ins().getBagGoodsCountById(0, petConfig.activationItem);
				let petStarLevelExpConfig = GlobalConfig.ins("PetStarLevelExpConfig")[this.star + 1];
				if (petStarLevelExpConfig && this.star < petConfig.maxstarLevel) {
					if (itemNum >= petStarLevelExpConfig.itemNum || itemNum2 >= petStarLevelExpConfig.itemNum2) {
						return true;
					}
				}
			}
		}
		return false;
	}

	public get isCanCarStarUp() {
		if (this.isActivate == true) {
			let petConfig = GlobalConfig.ins("PetConfig")[this.petid];
			if (petConfig) {
				let itemNum2 = UserBag.ins().getBagGoodsCountById(0, petConfig.activationItem);
				let petStarLevelExpConfig = GlobalConfig.ins("PetStarLevelExpConfig")[this.star + 1];
				if (petStarLevelExpConfig && this.star < petConfig.maxstarLevel) {
					if (itemNum2 >= petStarLevelExpConfig.itemNum2) {
						return true;
					}
				}
			}
		}
		return false;
	}

	public get isCanSkillUp() {
		if (this.isActivate == true) {
			let skillstr = this.skill.toString();
			let skillLvStr = skillstr.slice(skillstr.length - 3, skillstr.length);
			let skillLv = parseInt(skillLvStr);
			let nowPetSkillsUpgradeConfig = GlobalConfig.ins("PetSkillsUpgradeConfig")[skillLv];
			let nextPetSkillsUpgradeConfig = GlobalConfig.ins("PetSkillsUpgradeConfig")[skillLv + 1];
			if (nowPetSkillsUpgradeConfig && nextPetSkillsUpgradeConfig) {
				let itemData = GlobalConfig.ins("ItemConfig")[nowPetSkillsUpgradeConfig.cost.id];
				let needItemId = nowPetSkillsUpgradeConfig.cost.id;
				let itemNum = UserBag.ins().getBagGoodsCountById(0, nowPetSkillsUpgradeConfig.cost.id);
				if (itemNum >= nowPetSkillsUpgradeConfig.cost.count) {
					return true;
				}
			}
		}
		return false;
	}

	public get petMonsterId() {
		let petConfig = GlobalConfig.ins("PetConfig")[this.petid];
		if (petConfig) {
			return petConfig.monsterId;
		}
		return null;
	}

	public get isCanSkillChange(): boolean {
		if (this.isActivate) {
			let petBasicConfig = GlobalConfig.ins("PetBasicConfig");
			if (petBasicConfig) {
				let num = UserBag.ins().getBagGoodsCountById(0, petBasicConfig.cost.id);
				if (num >= petBasicConfig.cost.count) {
					return true;
				}
			}
		}
		return false;
	}

	public get fightAttr() {
		let fightAttr = [];
		if (this.isFight) {
			fightAttr = AttributeData.getAttr([this.attr, PetModel.getInstance.petNowAllShowAttr()]);
		} else {
			fightAttr = this.attr;
		}
		return fightAttr;
	}

	public get power() {
		let fightAddPower = 0;
		if (this.isFight) {
			fightAddPower = Math.floor(UserBag.getAttrPower(PetModel.getInstance.petNowAllShowAttr()));
		}
		let nowPower = this._power + fightAddPower;
		return nowPower;
	}

	public set power(value: number) {
		this._power = value;
	}

	/**是否备战 */
	public get isBeiZhan(): boolean {
		let petModel = PetModel.getInstance;
		if (this.isFight) {
			for (var i = 1; i < petModel.battlePetList.length; i++) {
				if (petModel.battlePetList[i] == this.petid) {
					return true;
				}
			}
		}
		return false;
	}

	public get isCanAwakening() {
		if (this.isActivate == true) {
			if (!this.isAwakening) {
				let petConfig = GlobalConfig.ins("PetConfig")[this.petid];
				if (petConfig.elementValue) {
					let yb: number = GameLogic.ins().actorModel.yb;
					if (yb >= petConfig.awakenCost.count) {
						return true;
					}
				}
			}
		}
		return false;
	}
}
window["PetData"] = PetData