class TitleInfo {
	config
	_attrsText
	private _power: number
	endTime
	attrsTotal

	public constructor(config) {
		this.config = config;
	}


	get attrsText() {
		if (!this._attrsText) {
			//第一个是稀有度
			var attrs = [];
			//属性文字
			var n = this.config.attrs.length;
			while (n--) {
				attrs[n] = TitleInfo.formatAttr(this.config.attrs[n].type, this.config.attrs[n].value);
			}
			this._attrsText = new eui.ArrayCollection(attrs);
			//战斗力
			this._power = UserBag.getAttrPower(this.config.attrs);
		}
		return this._attrsText;
	}

	get power(): number {
		let v = this.attrsText
		return this._power
	}

    /**
     * 格式属性
     */
	static formatAttr(type, value) {
		//皮肤里的富文本读取格式
		return {
			h: AttributeData.getAttrStrByType(type) + '：',
			t: String(value),
			textColor: 0x00ff00
		};
	};
}
window["TitleInfo"]=TitleInfo