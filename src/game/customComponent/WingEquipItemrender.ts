class WingEquipItemrender extends eui.ItemRenderer {

	role
	itemConfig
	item0
	equipXuqiu
	equipName
	score
	private languageTxt:eui.Label;

	public constructor() {
		super()
		this.skinName = "WingEquipItemSkin";
		this.addEventListener(egret.TouchEvent.TOUCH_END, this.onClick, this);
	}

	dataChanged() {
		var model = this.data;
		var curRole = model["curRole"];
		var itemData = model["data"];
		this.role = SubRoles.ins().getSubRoleByIndex(curRole);
		this.itemConfig = itemData.itemConfig;
		this.item0.setData(itemData.itemConfig);
		this.equipXuqiu.text = LanguageString.jifengTiaoyueCh(GlobalConfig.jifengTiaoyueLg.st100708,[this.itemConfig.level + 1]);
		this.equipXuqiu.textColor = 0xf87372;
		this.equipName.text = itemData.itemConfig.name;
		this.score.text = GlobalConfig.jifengTiaoyueLg.st100070 + "：" + ItemConfig.calculateBagItemScore(itemData);
		this.languageTxt.text = `（${GlobalConfig.jifengTiaoyueLg.st100709}）`
	};
	descut() {
		this.removeEventListener(egret.TouchEvent.TOUCH_END, this.onClick, this);
	};
	onClick() {
		this.openEquipsTips();
	};
	openEquipsTips() {
		ViewManager.ins().open(EquipDetailedWin, 1, this.data.data.handle, this.itemConfig.id, this.data.data, this.role);
	};
}
window["WingEquipItemrender"]=WingEquipItemrender