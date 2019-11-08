class BreakDownItemRenderer extends eui.ItemRenderer {

	configID = 0;
	itemIcon: ItemBase;
	equipName: eui.Label;
	desc
	private tip: eui.Label
	private tip2: eui.Label
	private breakDown: eui.Button

	childrenCreated() {
		super.childrenCreated()
		this.itemIcon.isShowJob(false);
		this.itemIcon.isShowName(false)
	};
	dataChanged() {
		var itemConfig = this.data.itemConfig;
		var lv = "";
		if (itemConfig.zsLevel > 0) {
			lv = itemConfig.zsLevel + GlobalConfig.jifengTiaoyueLg.st100067;//"转";
		}
		else {
			lv = "Lv." + itemConfig.level;
		}
		this.itemIcon.data = this.data;
		this.equipName.textFlow = TextFlowMaker.generateTextFlow(itemConfig.name + StringUtils.addColor(lv, Color.Green));
		/**熔炼表 */
		let key = itemConfig.level * 10 + itemConfig.zsLevel * 10000 + itemConfig.quality + itemConfig.type * 1000;
		if (itemConfig.type == 6) {
			key = itemConfig.id;
		}
		let newSmeltdata = GlobalConfig.ins("SmeltConfig")[key];
		let stoneId = newSmeltdata.stoneId;
		let smeltItem = GlobalConfig.ins("ItemConfig")[stoneId]
		if (itemConfig.type == ItemType.ZHUANZHI)//转职装备特殊处理
		{
			this.desc.text = GlobalConfig.jifengTiaoyueLg.st100771 + " x" + newSmeltdata.stoneNum;
			this.desc.textColor = 0xc5281d;
			this.tip.visible = false;
			this.configID = this.data.handle;
			return
		}
		if (itemConfig.quality == 4) {
			this.breakDown.label = GlobalConfig.jifengTiaoyueLg.st100775;//"出  售"
			this.tip.text = GlobalConfig.jifengTiaoyueLg.st100776;// `推荐出售`
			this.tip2.text = GlobalConfig.jifengTiaoyueLg.st100772;//`出售获得`
		} else {
			this.breakDown.label = GlobalConfig.jifengTiaoyueLg.st100777;//"分  解"
			this.tip.text = GlobalConfig.jifengTiaoyueLg.st100778;//`推荐分解`
			this.tip2.text = GlobalConfig.jifengTiaoyueLg.st101112;//`分解获得`
		}

		if (itemConfig.quality == 5) {
			this.desc.text = GlobalConfig.jifengTiaoyueLg.st100496 + " x" + BreakDownItemRenderer.getSmeltConfig(itemConfig).stoneNum;
			this.desc.textColor = 0xc5281d;
		}
		else {
			var stoneNum = BreakDownItemRenderer.getSmeltConfig(itemConfig).stoneNum;
			var smeltVo = BreakDownItemRenderer.getSmeltConfig(itemConfig);
			//只针对橙装修改  夏坤需求
			if (itemConfig.subType == 0)//武器
			{
				this.desc.text = smeltItem.name + " x" + (stoneNum + smeltVo.weaponStone);
			}
			else if (itemConfig.subType == 2)// 衣服
			{
				this.desc.text = smeltItem.name + " x" + (stoneNum + smeltVo.clotheStone);
			}
			else {
				this.desc.text = smeltItem.name + " x" + stoneNum;
			}

			this.desc.textColor = 0xFF6A21;
		}
		var level = GameLogic.ins().actorModel.level;
		var id = UserEquip.ins().getEquipConfigIDByPosAndQuality(itemConfig.subType, itemConfig.quality);
		var fitConfig = GlobalConfig.itemConfig[id];
		var L = itemConfig.zsLevel * 10000 + itemConfig.level;
		var fitL = fitConfig.zsLevel * 10000 + fitConfig.level;
		if (itemConfig.quality != 5 && fitL > L) {
			this.tip.visible = true;
			//this.tip.x = this.equipName.x + this.equipName.width;
		}
		else {
			this.tip.visible = false;
		}
		this.configID = this.data.handle;
	};
	static getSmeltConfig(itemConfig) {
		var smeltConfig = GlobalConfig.ins("SmeltConfig");
		return smeltConfig[itemConfig.level * 10 + itemConfig.zsLevel * 10000 + itemConfig.quality];
	};
}
window["BreakDownItemRenderer"] = BreakDownItemRenderer