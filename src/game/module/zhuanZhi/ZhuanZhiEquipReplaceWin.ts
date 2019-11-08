class ZhuanZhiEquipReplaceWin extends BaseEuiPanel {
	public constructor() {
		super();
	}

	public tips: eui.Label;
	public currGroup: eui.Group;
	public item: ItemBase;
	public equipName: eui.Label;
	public dec: eui.Label;
	public itemScroller: eui.Scroller;
	public itemList: eui.List;
	public static roleId: number = 0;
	public static equipPos: number = 0;
	private languageTxt:eui.Label;

	initUI() {
		super.initUI();
		this.skinName = "ZhuanZhiEquipReplaceSkin";
		this.item.isShowName(false);
		this.itemList.itemRenderer = ZhuanZhiEquipReplaceItem;
		this.tips.text = GlobalConfig.jifengTiaoyueLg.st100667;
		this.languageTxt.text = GlobalConfig.jifengTiaoyueLg.st100668;
	}

	public open(...param: any[]) {
		this.m_bg.init(`ZhuanZhiEquipReplaceWin`, GlobalConfig.jifengTiaoyueLg.st101148)
		ZhuanZhiEquipReplaceWin.roleId = param[0];
		ZhuanZhiEquipReplaceWin.equipPos = param[1] + EquipPos.MAX;
		var subType = ZhuanZhiModel.ins().posToSubType[param[1]];

		var role = SubRoles.ins().getSubRoleByIndex(ZhuanZhiEquipReplaceWin.roleId);
		var currEquip: EquipsData = role.equipsData[ZhuanZhiEquipReplaceWin.equipPos];
		if (currEquip && currEquip.item.configID > 0) {
			this.currGroup.visible = true;
			this.tips.visible = false;

			this.item.data = currEquip.item;
			let itemConfig: any = GlobalConfig.itemConfig[currEquip.item.configID];
			let lvStr: string = itemConfig.zsLevel > 0 ? " " + itemConfig.zsLevel + GlobalConfig.jifengTiaoyueLg.st100067 : " LV" + itemConfig.level;
			this.equipName.text = itemConfig.name + lvStr;
			this.equipName.textColor = ItemBase.QUALITY_COLOR[itemConfig.quality];
			this.dec.text = GlobalConfig.jifengTiaoyueLg.st100809 + ItemConfig.calculateBagItemScore(currEquip.item);
		}
		else {
			this.currGroup.visible = false;
			this.tips.visible = true;
		}

		var arr = UserBag.ins().getBagGoodsByZhuanZhi(ItemType.ZHUANZHI, subType, role.job);
		arr.sort(UserBag.ins().sort1);
		this.itemList.dataProvider = new eui.ArrayCollection(arr);
	}

	public close() {
		//this.dialogCloseBtn.removeEventListener(egret.TouchEvent.TOUCH_TAP, this._OnClick, this)
	}
	private _OnClick(e: egret.TouchEvent) {
		ViewManager.ins().close(this);
	}
}
ViewManager.ins().reg(ZhuanZhiEquipReplaceWin, LayerManager.UI_Popup);
window["ZhuanZhiEquipReplaceWin"]=ZhuanZhiEquipReplaceWin