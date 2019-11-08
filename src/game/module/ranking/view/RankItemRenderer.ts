class RankItemRenderer extends eui.ItemRenderer {
	public constructor() {
		super()
		this.touchEnabled = true;
		this.touchChildren = false;
	}

	childrenCreated() {
		let g = new eui.Group
		g.percentWidth = 100
		g.percentHeight = 100
		this.addChild(g)
	}

	t10
	lv: eui.Component


	dataChanged() {
		this.SetDefualtPos()
		if (this.data != null) {
			for (var key in this.data) {
				this.updateValue(this[key], key, this.data[key])
				// var component = this[key];
				// if (component)
				// 	this.updateValue(component, key, this.data[key]);
			}

			if (this.data.challgeLevel != null && this.data.challgeId != null) {
				let levelIcon = this["levelIcon"]
				if (levelIcon && levelIcon.SetRank) {
					levelIcon.SetRank(this.data.challgeLevel, this.data.challgeId)
				}
			}

			this.t10.source = this.data[RankDataType.DATA_POS] >= 1 && this.data[RankDataType.DATA_POS] <= 10 ? RankItemRenderer.dataFormat['t10'] : '';
			//前2，3名背景标志
			if (this.data[RankDataType.DATA_POS] <= 3) {
				this.lv["bg"].source = `comp_68_67_0${this.data[RankDataType.DATA_POS]}_png`;
			}
			else {
				this.lv["bg"].source = '';
			}

		}
		this.visible = this.data != null;
	};

	private SetDefualtPos() {
		if (this.lv["vipLab"]) {
			this.lv["vipLab"].visible = false
			this.lv["vipLab"].text = '';
		}
		// if (this.lv["bg"]) {
		// 	this.lv["bg"].visible = false
		// }
		// if (this.lv["pos"]) {
		// 	this.lv["pos"].text = '';
		// }
		if (this.lv["vipbg"]) {
			this.lv["vipbg"].visible = false
		}
	}

    /**
     * 更新数据
     */
	updateValue(component, key, value) {
		let self = this
		switch (key) {
			case RankDataType.DATA_VIP:
				if (value > 0) {
					// this.lv["vip"].source = value ? "rank_0" + (10 > 8 + value ? "0" + (8 + value) : 8 + value) : ""
					self.lv["vipLab"].text = GlobalConfig.jifengTiaoyueLg.st100092 + value;
					self.lv["vipLab"].visible = true
					//self.lv["bg"].visible = true
					self.lv["vipbg"].visible = true
					//this.lv["pos"].y = 16
				} else {
					this.SetDefualtPos()
				}
				break;
			case RankDataType.DATA_MONTH:
				// component.visible = value == 1;
				break;
			case RankDataType.DATA_LEVEL:
				value = (self.data[RankDataType.DATA_ZHUAN] ? self.data[RankDataType.DATA_ZHUAN] + GlobalConfig.jifengTiaoyueLg.st100067 : "") + value + GlobalConfig.jifengTiaoyueLg.st100093;
				break;
			case RankDataType.DATA_POS:
				self.lv["pos"].text = value
				break
			case RankDataType.DATA_VIP:
				self.lv["vipLab"].text = value
				break
		}
		if (component instanceof eui.Label) {
			if (typeof value == 'number')
				value = CommonUtils.overLength(value);
			component.text = key in RankItemRenderer.dataFormat ? RankItemRenderer.dataFormat[key].replace('{value}', value) : value;
		}
		else if (component instanceof eui.Image) {
			component.source = key in RankItemRenderer.dataFormat ? RankItemRenderer.dataFormat[key].replace('{value}', value) : value;
		}
	};


	static dataFormat
}
window["RankItemRenderer"] = RankItemRenderer