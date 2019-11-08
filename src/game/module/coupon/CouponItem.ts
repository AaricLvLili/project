class CouponItem extends eui.ItemRenderer {
	public constructor() {
		super();
		this.skinName = "CouponItemSkin"
	}
	public m_Name: eui.Label;
	public imgIcon: eui.Image;
	itemConfig: any;
	private jingyanyuCommonConfig: any;
	public m_EffGroup: eui.Group;

	/**触摸事件 */
	public createChildren() {
		super.createChildren();
		this.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onClick, this);
	}

	public dataChanged() {
		super.dataChanged();
		if (!isNaN(this.data)) {
			this.itemConfig = GlobalConfig.itemConfig[this.data];
			if (this.itemConfig) {
				this.setDataByConfig(this.itemConfig);
			}
			else {
				this.imgIcon.source = MoneyManger.MoneyConstToSource(this.data);
				this.m_Name.text = MoneyManger.MoneyConstToName(this.data);
			}
		}
		else if (this.data instanceof ItemData) {
			//道具数据
			this.itemConfig = this.data.itemConfig;
			if (!this.itemConfig)
				return;
			this.setDataByConfig(this.itemConfig);
		}
		else {
			//奖励数据
			if (this.data.type == 0) {
				this.imgIcon.source = MoneyManger.MoneyConstToSource(this.data.id);
				this.m_Name.text = MoneyManger.MoneyConstToName(this.data.id);
			}
			else if (this.data.type == 1) {
				//道具奖励
				this.itemConfig = GlobalConfig.itemConfig[this.data.id];
				if (!this.itemConfig)
					return;
				this.setDataByConfig(this.itemConfig);
			}
		}
	}

	private setDataByConfig(itemConfig) {
		this.imgIcon.source = itemConfig.icon + "_png"
		this.m_Name.text = itemConfig.name;
	}
	public onClick() {
		this.showDetail();
	}

	public showDetail() {
		if (this.itemConfig != undefined && this.itemConfig && this.itemConfig.type != undefined) {
			if (this.jingyanyuCommonConfig == null)
				this.jingyanyuCommonConfig = GlobalConfig.ins("JingyanyuCommonConfig");
			if (this.itemConfig.id == this.jingyanyuCommonConfig.fullItemID) {
				ViewManager.ins().open(ExpjadePanel)
			} else if (this.itemConfig.type == ItemType.EQUIP || this.itemConfig.type == ItemType.ZHUANZHI || this.itemConfig.type == ItemType.WING || this.itemConfig.type == ItemType.FUWEN || this.itemConfig.type == ItemType.RINGSOUL || this.itemConfig.type == ItemType.MOUNTEQUIP) {
				this.openEquipsTips();
			} else if (this.itemConfig.type == ItemType.GAD) {
				let itemData = this.data;
				let gadData = GadModel.getInstance.gadBagDic.get(itemData.handle);
				if (gadData == null) {
					for (let item of GadModel.getInstance.gadBagDic.values) {
						if (item.configID == itemData.id) {
							gadData = item
							break;
						}
					}
				}
				if (gadData == null) {
					ViewManager.ins().open(ItemDetailedWin, 0, this.itemConfig.id);
				} else
					ViewManager.ins().open(GadStateWin, gadData);
			}
			else {
				ViewManager.ins().open(ItemDetailedWin, 0, this.itemConfig.id);
			}
		} else {
			if (isNaN(this.data)) {
				if (this.data && this.data.id) {
					ViewManager.ins().open(ItemDetailedWin, 0, null, null, this.data.id);
				}
			} else if (this.data < 100) {
				ViewManager.ins().open(ItemDetailedWin, 0, null, null, this.data);
			}

		}
	}
	public openEquipsTips() {
		ViewManager.ins().open(EquipDetailedWin, 1, this.data.handle, this.itemConfig.id, this.data);
	};
	private eff: MovieClip;
	public showEff(isShow: boolean) {
		if (isShow) {
			this.eff = ViewManager.ins().createEff(this.eff, this.m_EffGroup, "quaeff7", -1, ResAnimType.TYPE1);
		} else {
			DisplayUtils.dispose(this.eff);
			this.eff = null;
		}
	}

}
window["CouponItem"] = CouponItem
