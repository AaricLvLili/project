
class ZhuanZhiEquipReplaceItem extends eui.ItemRenderer{
	public constructor() {
		super();
        this.skinName = "ZhuanZhiEquipReplaceItemSkin";
		this.item.isShowName(false);
		this.replaceBtn.addEventListener(egret.TouchEvent.TOUCH_END,this.replaceHandle,this);
	}

	public item:ItemBase;
	public replaceBtn:eui.Button;
	public equipName:eui.Label;
	public dec:eui.Label;

    private replaceHandle(evt:egret.TouchEvent):void
    {
		UserEquip.ins().sendWearEquipment(this.data.handle,ZhuanZhiEquipReplaceWin.equipPos,ZhuanZhiEquipReplaceWin.roleId);
		ViewManager.ins().close(ZhuanZhiEquipReplaceWin);
    }

    protected dataChanged(): void
	{
		var itemData:ItemData = this.data;
		this.item.data = itemData;
		let itemConfig:any = GlobalConfig.itemConfig[itemData.configID];
 		this.dec.text =  GlobalConfig.jifengTiaoyueLg.st100809 + ItemConfig.calculateBagItemScore(itemData);

		let lvStr:string = itemConfig.zsLevel > 0 ? " " + itemConfig.zsLevel + GlobalConfig.jifengTiaoyueLg.st100067 : " LV" + itemConfig.level;
		this.equipName.text = itemConfig.name + lvStr;
		this.equipName.textColor = ItemBase.QUALITY_COLOR[itemConfig.quality];

		var role = SubRoles.ins().getSubRoleByIndex(ZhuanZhiEquipReplaceWin.roleId);
		var currEquip:EquipsData = role.equipsData[ZhuanZhiEquipReplaceWin.equipPos];
		if(currEquip && currEquip.item.configID > 0)
			this.replaceBtn.label = GlobalConfig.jifengTiaoyueLg.st101148;//"更换";
		else
			this.replaceBtn.label = GlobalConfig.jifengTiaoyueLg.st100665;//"装备";
	}

}
window["ZhuanZhiEquipReplaceItem"]=ZhuanZhiEquipReplaceItem