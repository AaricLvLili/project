class PriceIcon extends eui.Component {

	private _labelColor
	priceLabel: eui.Label;
	private _price
	iconImg: eui.Image
	private _type

    /**
     * 价格
     */
	getPrice() {
		return this._price;
	}

	get price() {
		return this._price;
	}

	setPrice(value) {
		if (value == this._price)
			return;
		this._price = value;
		this.priceLabel.text = CommonUtils.overLength(this._price) + "";
	};

	set price(value: number) {
		this.setPrice(value)
	}

	set text(str) {
		this.priceLabel.textFlow = new egret.HtmlTextParser().parser(str);
	}

	setText(str) {
		this.priceLabel.textFlow = new egret.HtmlTextParser().parser(str);
	}

	setData(data) {
		var str = "";
		if (egret.is(data, "RewardData")) {
			var awards = data;
			if (awards.type == 0) {
				str = MoneyManger.MoneyConstToSource(awards.id)
			}
			else if (awards.type == 1) {
				switch (awards.id) {
					case 200001:
						str = "little_icon_04_png";
						break;
					case 200002:
						str = "forge";
						break;
					case 200003:
						str = "gem";
						break;
					case 200004:
						str = "spirit";
						break;
					case 200005:
						str = "vigor";
						break;
					case 200006:
						str = "shield";
						break;
					case 200015:
						str = "200015_png"
						break
				}
			}
			this._type = awards.id;
			this.setPrice(awards.count);
		}
		else if (data) {
			var itemData = data;
			switch (itemData.itemConfig.id) {
				case 200001:
					str = "little_icon_04_png";
					break;
				case 200002:
					str = "yuanbao";
					break;
				case 200003:
					str = "yuanbao";
					break;
				case 200004:
					str = "yuanbao";
					break;
				case 200005:
					str = "yuanbao";
					break;
				case 200006:
					str = "yuanbao";
					break;
				case 200015:
					str = "200015_png"
					break
			}
			this._type = itemData.itemConfig.id;
			this.setPrice(itemData.count);
		}
		this.iconImg.source = str;
	};

	get type() {
		return this._type
	}

	set type(value: MoneyConst) {
		this.setType(value)
	}

	getType() {
		return this._type;
	};
	setType(value: MoneyConst) {
		if (this._type == value)
			return;
		this._type = value;
		var str = MoneyManger.MoneyConstToSource(this._type)
		this.iconImg.source = str;
	};
	get labelColor() {
		return this._labelColor;
	}
	set labelColor(value) {
		if (this._labelColor != value) {
			this._labelColor = value;
			this.priceLabel.textColor = this._labelColor;
		}
	}

} window["PriceIcon"] = PriceIcon 
