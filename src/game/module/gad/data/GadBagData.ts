class GadBagData {
	public handle: number; // tag 0
	public configID: number; // tag 1
	public attr: Sproto.attribute_data[]; // tag 2
	public level: number; // tag 3
	public exp: number; // tag 4
	/**权重根据排序需求变动 */
	public weight: number;
	public mainId: number;

	public get itemConfig() {
		let config = GlobalConfig.ins("ItemConfig")[this.configID];
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

	public get star() {
		if (this.itemConfig) {
			return this.itemConfig.quality;
		}
		return null;
	}

	public get slot() {
		let coaAwordproduceConfig = GlobalConfig.ins("COAwordproduceConfig")[this.configID];
		if (coaAwordproduceConfig) {
			return coaAwordproduceConfig.site;
		}
		return null;
	}

	public get power() {
		let power = Math.floor(UserBag.getAttrPower(this.attr));
		return power;
	}

	public get suit(): number {
		let coaAwordproduceConfig = GlobalConfig.ins("COAwordproduceConfig")[this.configID];
		if (coaAwordproduceConfig) {
			return coaAwordproduceConfig.suit;
		}
		return null;
	}

	public get supexp() {
		let config = GlobalConfig.ins("COAlevelConfig")[this.star];
		if (config) {
			let cOAlevelConfig = config[this.level];
			return cOAlevelConfig.supexp;
		}
		return 0;
	}
}
window["GadBagData"] = GadBagData