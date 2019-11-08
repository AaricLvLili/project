class ArtifactEquData {
	public constructor() {
	}
	public id: number;
	/**强化等级 */
	public strenglv: number;
	/**升阶等级 */
	public level: number;

	public get isActivate(): boolean {
		let artifactModel = ArtifactModel.getInstance;
		if (this.id < artifactModel.curid || this.strenglv >= 0) {
			return true;
		}
		return false;
	}
	public get isNowActivate(): boolean {
		let artifactModel = ArtifactModel.getInstance;
		if (this.id == artifactModel.curid) {
			return true;
		}
		return false;
	}

	public get baseAttr(): { type: number, value: number }[] {
		let artifactModel = ArtifactModel.getInstance;
		let artifactsConfig = GlobalConfig.ins("ArtifactsConfig")[this.id];
		let allAttr = [];
		if (artifactsConfig) {
			for (var i = 0; i < artifactsConfig.length; i++) {
				let allList: { type: number, value: number }[] = [];
				for (var f = 0; f < artifactsConfig[i].attrs.length; f++) {
					let configList: { type: number, value: number } = artifactsConfig[i].attrs[f];
					let list = { type: configList.type, value: configList.value };
					allList.push(list);
				}
				allAttr.push(allList);
			}
		}
		let attr = AttributeData.getAttr(allAttr);
		return attr;
	}

	public get lvAttr(): { type: number, value: number }[] {
		let artifactsStrengConfig = GlobalConfig.ins("ArtifactsStrengConfig")[this.id];
		if (artifactsStrengConfig) {
			let needItme: number = 1 + Math.floor(this.strenglv / 5);
			let power = AttributeData.getNowPower(0, this.strenglv, 0, 5, artifactsStrengConfig.price, artifactsStrengConfig.basiccon, artifactsStrengConfig.increasecon, artifactsStrengConfig.slope, artifactsStrengConfig.revisecon);
			// let attr = AttributeData.getAttrByPower(artifactsStrengConfig.maxHp, artifactsStrengConfig.maxAtk, artifactsStrengConfig.maxDef, artifactsStrengConfig.maxMagDef, power);
			let attr = AttributeData.getAttrElementByPower(power, artifactsStrengConfig.elementValue1, artifactsStrengConfig.elementValue2, artifactsStrengConfig.maxElement1, artifactsStrengConfig.maxElement2);
			return attr;
		}
		return [];

	}

	public get layerlvAttr(): { type: number, value: number }[] {
		let artifactsRankConfig = GlobalConfig.ins("ArtifactsRankConfig")[this.id];
		if (artifactsRankConfig) {
			if (this.level > 0) {
				let num = this.level - 1;
				if (num < 0) {
					return AttributeData.getAttr([]);
				} else {
					let data = artifactsRankConfig[this.level - 1];
					return data.attrs;
				}
			}
		}
		return [];
	}

	public get allPower(): number {
		let power = 0;
		power += Math.floor(UserBag.getAttrPower(this.baseAttr));
		power += Math.floor(UserBag.getAttrPower(this.lvAttr));
		power += Math.floor(UserBag.getAttrPower(this.layerlvAttr));
		return power;
	}

	public get maxStrenglv() {
		return GlobalConfig.ins("ArtifactsStrengConfig")[this.id].maxLevel;
	}

	public get lvNeedLayer() {
		return Math.ceil((this.strenglv + 1) / 10);
	}

	public get layerNeedLv() {
		let config = GlobalConfig.ins("ArtifactsRankConfig")[this.id]
		if (config) {
			let artifactsRankConfig = config[this.level - 1];
			if (artifactsRankConfig) {
				return artifactsRankConfig.levelLimit;
			}
		}
		return 0;
	}

	public get type() {
		let artifactsConfig = GlobalConfig.ins("ArtifactsConfig")[this.id];
		return artifactsConfig[0].classification;
	}

}
window["ArtifactEquData"] = ArtifactEquData