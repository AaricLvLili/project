class GuildBuildItemRender extends eui.ItemRenderer {


	_maxLevel = 0;
	_curLevel = 0;
	_nextMoney = 0;
	upBtn
	nameLab
	upLevelLab
	// money
	bar: eui.ProgressBar
	buildingLab
	public m_Lan1: eui.Label;

	public constructor() {
		super();

		this.skinName = "GuildManageItemSkin";
		this.m_Lan1.text=GlobalConfig.jifengTiaoyueLg.st100955;
		this.upBtn.label=GlobalConfig.jifengTiaoyueLg.st100296;
	}


	onTap(e) {
		switch (e) {
			case this.upBtn:
				var type = this.data; //建筑类型从1开始
				if (Guild.ins().myOffice < GuildOffice.GUILD_FUBANGZHU) {
					UserTips.ins().showTips(GlobalConfig.jifengTiaoyueLg.st100954);
					return;
				}
				else if (type == GuildBuilding.GUILD_HALL && this._curLevel >= this._maxLevel) {
					UserTips.ins().showTips(GlobalConfig.jifengTiaoyueLg.st100327);
					return;
				}
				else if (type != GuildBuilding.GUILD_HALL && this._curLevel >= Guild.ins().guildLv) {
					UserTips.ins().showTips(GlobalConfig.jifengTiaoyueLg.st100956);
					return;
				}
				else if (Guild.ins().money < this._nextMoney) {
					UserTips.ins().showTips(GlobalConfig.jifengTiaoyueLg.st100957);
					return;
				}
				Guild.ins().sendUpBuilding(type);
				break;
		}
	};
	dataChanged() {
		var type: number = this.data; //建筑类型从1开始
		//建筑当前等级
		this._curLevel = Guild.ins().getBuildingLevels(type - 1);
		var glc = GlobalConfig.ins("GuildLevelConfig")[type];
		var dp = null;
		var dpNext = null;
		for (var key in glc) {
			if (glc.hasOwnProperty(key)) {
				var element = glc[key];
				this._maxLevel = element.level > this._maxLevel ? element.level : this._maxLevel;
				if (element.level == this._curLevel)
					dp = element;
				if (element.level == this._curLevel + 1)
					dpNext = element;
			}
		}
		if (dp || dpNext || (type == GuildBuilding.GUILD_LIANGONGFANG)) {
			let text = (this._curLevel == null ? 0 : this._curLevel) + GlobalConfig.jifengTiaoyueLg.st100093 + GlobalConfig.ins("GuildConfig").buildingNames[type - 1];
			this.upLevelLab.visible = type != GuildBuilding.GUILD_HALL;
			if (this._curLevel == null || this._curLevel < this._maxLevel) {
				this._nextMoney = dpNext.upFund;
				this.upLevelLab.text = LanguageString.jifengTiaoyueCh(GlobalConfig.jifengTiaoyueLg.st101533,[this._curLevel + 1]);//"升级要求：管理大厅达到" + (this._curLevel + 1) + "级";
				this.bar.maximum = dpNext.upFund;
				this.bar.value = Guild.ins().money
			}
			else {
				this.upLevelLab.text = GlobalConfig.jifengTiaoyueLg.st100327;
				if (dp) {
					this.bar.maximum = dp.upFund;
					this.bar.value = Guild.ins().money
				} else {
					this.bar.value = this.bar.maximum = 1
					this.bar.labelDisplay.text = GlobalConfig.jifengTiaoyueLg.st100020;
				}
			}
			text += ` ${GlobalConfig.ins("GuildConfig").buildingTips[type - 1]}`
			this.nameLab.text = text
		}
	};
}
window["GuildBuildItemRender"] = GuildBuildItemRender