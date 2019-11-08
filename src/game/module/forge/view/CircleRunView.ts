class ForgeItemView {

	private m_Items: ForgeItem[] = [];
	public currentIdx: number = 0;
	public _type

	public mPanel: ForgeBasePanel

	public constructor(panel: ForgeBasePanel, items: ForgeItem[]) {
		this.mPanel = panel
		this.m_Items = items
		for (let i = 0; i < 8; ++i) {
			this.m_Items[i].item.source = ResDataPath.GetEquipDefaultIcon(i)
		}
	}


	set type(value) {
		this._type = value;
		for (var i = 0; i < this.m_Items.length; i++) {
			this.m_Items[i].setType(this._type);
		}
		// this.setValue();
	}

	setPos(pos: number) {
		for (var i = 0; i < this.m_Items.length; i++) {
			this.m_Items[i].setState(pos == i);
		}
	}

	/**
     * 格子显示数值
     */
	setValue() {
		var model = SubRoles.ins().getSubRoleByIndex(this.mPanel.curRole());
		var n = this.m_Items.length;
		for (var i = 0; i < n; i++) {
			var num = 0;
			switch (this._type) {
				case 0:
					num = model.getEquipByIndex(i).strengthen;
					break;
				case 1:
					num = model.getEquipByIndex(i).gem;
					break;
				case 2:
					num = model.getEquipByIndex(i).zhuling;
					break;
				case 3:
					num = model.getEquipByIndex(i).tupo;
					break;
			}
			this.m_Items[i].setValue(num);
			if (num > 0)
				this.m_Items[i].setSource(ResDataPath.GetEquipDefaultPIcon(i));
			else
				this.m_Items[i].setSource(ResDataPath.GetEquipDefaultIcon(i));

			let config = UserForge.ins().getForgeConfigByPos(i, num, this._type);
			if (config) {
				this.m_Items[i].setBgSource(ResDataPath.GetItemQualityName(config.quality));
				this.m_Items[i].showItemEffect(config.quality);
			}
			else {
				this.m_Items[i].setBgSource(ResDataPath.GetItemQualityName(0));
				this.m_Items[i].showItemEffect(0);
			}
		}
	};

	public clear() {
		if (this.m_Items == null) return;
		var len = this.m_Items.length;
		for (var i = 0; i < len; i++) {
			this.m_Items[i].clear();
		}
	}

	public get itemList(): ForgeItem[] {
		return this.m_Items;
	}
}

class CircleRunView extends eui.Component implements eui.UIComponent {

	// itemLocation = [
	// 	{ x: 180, y: 280 },
	// 	{ x: 286, y: 239 },
	// 	{ x: 356, y: 147 },
	// 	{ x: 286, y: 48 },
	// 	{ x: 180, y: 10 },
	// 	{ x: 78, y: 48 },
	// 	{ x: 10, y: 147 },
	// 	{ x: 78, y: 239 }
	// ];
	// itemList: ForgeItem[] = [];

	// curRole
	aperture

	private m_ForgeItemView: ForgeItemView;

	public set mPanel(value) {
		this.m_ForgeItemView.mPanel = value
	}

	public constructor() {
		super()
		this.skinName = "CircleRunSkin";
	}

	protected childrenCreated(): void {
		let itemList = []
		for (var i = 0; i < 8; ++i) {
			itemList[i] = this['item' + i];
		}
		this.m_ForgeItemView = new ForgeItemView(null, itemList)
		// this["item0"].item.source = "propIcon_021";
		// this["item1"].item.source = "propIcon_019";
		// this["item2"].item.source = "propIcon_007";
		// this["item3"].item.source = "propIcon_009";
		// this["item4"].item.source = "propIcon_015";
		// this["item5"].item.source = "propIcon_015";
		// this["item6"].item.source = "propIcon_011";
		// this["item7"].item.source = "propIcon_011";
	}


	// get type() {
	// 	return this.m_ForgeItemView._type;
	// }

	//格子显示数字类型  0强化 1宝石 2注灵 3突破
	set type(value) {
		this.m_ForgeItemView.type = value
	}
    /**
     * 格子显示数值
     */
	setValue() {
		this.m_ForgeItemView.setValue()
	};
	setPos(value) {
		this.m_ForgeItemView.setPos(value)
	}
	turnItem(pos) {

	};

	public clear() {
		this.m_ForgeItemView.clear();
	}
}
window["ForgeItemView"]=ForgeItemView
window["CircleRunView"]=CircleRunView