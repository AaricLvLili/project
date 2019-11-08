class TheGunData {
	public constructor(data: Sproto.holygun_data) {
		this.roleid = data.roleid;
		if (data.scala) {
			this.level = data.scala;
		} else {
			this.level = 1
		}
		this.exp = data.exp;
		this.star = data.star;
		this.power = data.power;
		this.init();
		for (var i = 0; i < data.skill.length; i++) {
			if (data.skill[i]) {
				this.skill.set(i + 1, data.skill[i].level)
			}
		}
		for (var i = 0; i < data.danyao.length; i++) {
			this.danYao.set(data.danyao[i].id, data.danyao[i].num);
		}
	}
	public roleid: number; // tag 0
	public level: number; // tag 1
	public exp: number; // tag 2
	public star: number; // tag 3
	public power: number; // tag 4
	public skill: Dictionary<number> = new Dictionary<number>();
	public danYao: Dictionary<number> = new Dictionary<number>();
	public init() {
		this.skill.clear();
		let skillids = GlobalConfig.ins("SpearCommonConfig").skill;
		for (var i = 0; i < 4; i++) {
			let skillId = skillids[i];
			this.skill.set(i + 1, 0);
		}
		this.danYao.clear();
		let config = GlobalConfig.ins("SpearShuXingDanjcConfig");
		if (config) {
			for (let key in config) {
				let configData = config[key];
				if (configData) {
					this.danYao.set(configData.id, 0);
				}
			}
		}
	}
	public get isCanLvUp(): boolean {
		let spearStarConfig = GlobalConfig.ins("SpearStarConfig")[this.star];
		if (spearStarConfig == null && spearStarConfig.exp == 0) {
			return false;
		}
		let spearLevelConfig = GlobalConfig.ins("SpearLevelConfig")[this.level];
		let itemNum = UserBag.ins().getBagGoodsCountById(0, spearLevelConfig.cost[0].id);
		let gold: number = GameLogic.ins().actorModel.gold;
		if (itemNum >= spearLevelConfig.cost[0].count && gold >= spearLevelConfig.cost[1].count) {
			return true;
		}
		return false;
	}

	public get allDanAttr() {
		let spearShuXingDanjcConfig = GlobalConfig.ins("SpearShuXingDanjcConfig");
		let data = [];
		for (let key in spearShuXingDanjcConfig) {
			data.push(spearShuXingDanjcConfig[key]);
		}
		if (this.danYao) {
			let allAttrData = [];
			for (var i = 0; i < this.danYao.values.length; i++) {
				let danYaoNum = this.danYao.values[i];
				let allDanYaoData = [];
				let attrDatas = data[i].value
				for (var f = 0; f < attrDatas.length; f++) {
					let danYaoData = { type: attrDatas[f].type, value: attrDatas[f].value * danYaoNum };
					allDanYaoData.push(danYaoData);
				}
				allAttrData.push(allDanYaoData);
			}
			let reData = AttributeData.getAttr(allAttrData);
			return reData;
		}
		return [];
	}

	public get danPower() {
		let attr = this.allDanAttr;
		return Math.floor(UserBag.getAttrPower(attr));
	}
}