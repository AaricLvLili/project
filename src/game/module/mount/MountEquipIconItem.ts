class MountEquipIconItem extends eui.ItemRenderer {
	public constructor() {
		super();
	}
	public m_MianGroup: eui.Group;
	public m_Bg: eui.Image;
	public m_Icon: eui.Image;
	public m_UnLockLab: eui.Label;
	public m_LvLab: eui.Label;
	public m_StarGroup: eui.Group;
	public m_ItemLvLab: eui.Label;
	public m_RedPoint: eui.Image;

	public createChildren() {
		super.createChildren();
		this.addEvent();
	}

	private addEvent() {
		this.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onClick, this);
	}
	public dataChanged() {
		super.dataChanged();
		let mountModel = MountModel.getInstance;
		let data: Sproto.ride_equip = this.data;
		this.m_Bg.source = "pf_black_01_png"
		this.m_UnLockLab.text = "";
		this.m_LvLab.text = "";
		this.m_ItemLvLab.text = "";
		if (!data) {
			let lv = mountModel.equipSoltUnlockDic.get(this.itemIndex + 1);
			this.m_Icon.source = "pf_suotou_01_png";
			this.m_UnLockLab.text = lv + GlobalConfig.jifengTiaoyueLg.st100674;//"阶解锁";
			mountModel.setStar(this.m_StarGroup, 0);
		} else {
			if (data.itemid > 0) {
				let itemConfig = GlobalConfig.ins("ItemConfig")[data.itemid];
				if (itemConfig) {
					this.m_Icon.source = itemConfig.icon + "_png";
					this.m_LvLab.text = data.level + GlobalConfig.jifengTiaoyueLg.st100093;//"级";
					this.m_Bg.source = ResDataPath.GetItemQualityName(itemConfig.quality);
					this.m_ItemLvLab.text = itemConfig.zsLevel + GlobalConfig.jifengTiaoyueLg.st100103;//"级";
				}
				mountModel.setStar(this.m_StarGroup, data.star);
			} else {
				this.m_Icon.source = "pf_orange_02_png";
				mountModel.setStar(this.m_StarGroup, 0);
			}
		}
		if (mountModel.checkEquipRedPoint(data, mountModel.nowSelectRoldData)) {
			this.m_RedPoint.visible = true;
		} else {
			this.m_RedPoint.visible = false;
		}
	}

	private onClick() {
		let data: Sproto.ride_equip = this.data;
		let slot = this.itemIndex + 1;
		let mountModel = MountModel.getInstance;
		mountModel.nowSelectEquipSlot = slot;
		if (data != null && data.itemid > 0) {
			ViewManager.ins().open(MountEquipWin);
		} else if (data != null && data.itemid == 0) {
			ViewManager.ins().open(MountEquipChangeWin);
		} else {
			UserTips.ins().showTips(GlobalConfig.jifengTiaoyueLg.st100675);
		}
	}
}
window["MountEquipIconItem"] = MountEquipIconItem