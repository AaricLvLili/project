class GadData {
	public constructor() {
	}
	public slot: number; // tag 0
	public itemid: number; // tag 1
	public level: number; // tag 2
	public exp: number; // tag 3
	public attr: Sproto.attribute_data[]; // tag 4
	public roleId: number;
	public mainId: number;

	public get itemConfig() {
		let config = GlobalConfig.ins("ItemConfig")[this.itemid];
		if (config) {
			return config;
		}
		return null;
	}


	public get mainAttr() {
		let attr = this.attr[0];
		if (attr) {
			return [attr];
		}
		return [];
	}

	public get lotAttr() {
		let attr = [];
		for (var i = 1; i < this.attr.length; i++) {
			attr.push(this.attr[i]);
		}
		return attr;
	}

	public get suit() {
		let coawordproduceConfig = GlobalConfig.ins("COAwordproduceConfig")[this.itemid];
		if (coawordproduceConfig) {
			return coawordproduceConfig.suit;
		}
		return null;
	}

	public get star() {
		if (this.itemConfig) {
			return this.itemConfig.quality;
		}
		return null;
	}

	public get isHaveItem() {
		if (this.itemid > 0) {
			return true;
		}
		return false;
	}

	public get isLvMax() {
		let coalevelConfig = GlobalConfig.ins("COAlevelConfig")[this.star][this.level + 1];
		if (coalevelConfig) {
			return false;
		}
		return true;
	}

	public get maxLvNeedExp() {
		let needExp = 0;
		let config = GlobalConfig.ins("COAlevelConfig")[this.star];
		if (config) {
			let cOAlevelConfig = config[this.level];
			if (cOAlevelConfig) {
				needExp = cOAlevelConfig.exp - this.exp;
				for (let key in config) {
					if (this.level + 1 <= parseInt(key)) {
						needExp += config[key].exp;
					}
				}
			}
		}
		return needExp;
	}
}

window["GadData"] = GadData