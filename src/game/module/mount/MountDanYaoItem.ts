class MountDanYaoItem extends eui.ItemRenderer {
	public constructor() {
		super();
	}

	public m_GetBtn: eui.Button;
	public m_ItemList: eui.List;
	public m_Name: eui.Label;
	public m_AttrGroup: eui.Group;

	private listData: eui.ArrayCollection;
	public m_CountLab: eui.Label;

	public createChildren() {
		super.createChildren();
		this.m_ItemList.itemRenderer = ItemBase;
		this.listData = new eui.ArrayCollection();
		this.m_ItemList.dataProvider = this.listData;
		this.m_GetBtn.label = GlobalConfig.jifengTiaoyueLg.st100683;
		this.addEvent();
	}

	private addEvent() {
		this.m_GetBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onClick, this);
	}
	public dataChanged() {
		super.dataChanged();
		let data: ItemData = this.data;
		let dest = [{ type: 1, id: data.configID, count: 1 }];
		this.m_CountLab.text = data.count + "";
		this.listData.removeAll();
		this.listData.replaceAll(dest);
		this.listData.refresh();
		this.m_Name.text = data.itemConfig.name;
		this.m_GetBtn["redPoint"].visible = UserBag.ins().getBagItemById(data.configID) != null
		AttributeData.setAttrGroup(data.itemConfig.useArg, this.m_AttrGroup);
	}
	private onClick() {
		ViewManager.ins().open(MountDanYaoUseWin, this.data, ItemType.TYPE11);
	}
}
window["MountDanYaoItem"] = MountDanYaoItem