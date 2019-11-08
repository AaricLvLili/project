class SmeltSelectItem extends eui.ItemRenderer {

	translate
	nameLabel
	gradeLabel
	// attrLabel
	checkBoxs

	public constructor() {
		super();

		this.translate = {
			'hp': AttributeType.atMaxHp,
			'atk': AttributeType.atAttack,
			'def': AttributeType.atDef,
			'res': AttributeType.atRes,
			'crit': AttributeType.atCrit,
			'tough': AttributeType.atTough
		};
		this.skinName = "SmeltSeletctItemSkin";
		this.touchChildren = false;
	}
	itemConfig
	arrowIcon
	itemIcon: ItemIcon
	lvLabel
	dataChanged() {
		if (this.data instanceof ItemData) {
			var data = this.data;
			//道具数据
			this.itemConfig = data.itemConfig;
			this.arrowIcon.visible = false;
			if (!this.itemConfig)
				return;
			this.itemIcon.isShowJob(true)
			this.itemIcon.setData(this.itemConfig);
			if (this.itemConfig.type == 4) {
				this.updateWingEquip(); //比较羽翼装备
				this.lvLabel.text = this.itemConfig.name;
			}
			else if (this.itemConfig.type == 0) {
				this.lvLabel.text = ((this.itemConfig.zsLevel) ? this.itemConfig.zsLevel + "转" : "lv." + this.itemConfig.level);
			}
			else {
				this.lvLabel.text = '';
			}
			this.nameLabel.textColor = ItemBase.QUALITY_COLOR[this.itemConfig.quality];
			this.nameLabel.text = this.itemConfig.name;
			this.gradeLabel.text = "评分：" + ItemConfig.calculateBagItemScore(data);
			// this.attrLabel.text = AttributeData.getAttrInfoByItemData(data);
		}
	};
	//对比下羽翼装备
	updateWingEquip() {
		var len = SubRoles.ins().subRolesLen;
		for (var i = 0; i < len; i++) {
			var wingsData = SubRoles.ins().getSubRoleByIndex(i).wingsData;
			var equipLen = wingsData.equipsLen;
			for (var k = 0; k < equipLen; k++) {
				var equdata = wingsData.getEquipByIndex(k);
				if (equdata.configID != 0) {
					if (this.data.itemConfig.subType == equdata.itemConfig.subType
						&& ItemConfig.calculateBagItemScore(this.data) > ItemConfig.calculateBagItemScore(equdata)) {
						//这件装备比身上的号。就显示个↑图标
						this.arrowIcon.visible = true;
						return;
					}
				}
				else if (this.data.itemConfig.subType == k) {
					this.arrowIcon.visible = true;
					return;
				}
			}
		}
	};
}
window["SmeltSelectItem"]=SmeltSelectItem