class MountEquipStarUpWin extends BaseEuiPanel {
	public constructor() {
		super()
		this.skinName = "MountEquipStarUpWinSkin";
	}
	public m_Power: PowerLabel;
	public m_LeftAttrGroup: eui.Group;
	public m_RightAttrGroup: eui.Group;
	public m_TitleLab: eui.Label;
	public m_CanUpStarGroup: eui.Group;
	public m_UpLvBtn: eui.Button;
	public m_ArrImg: eui.Image;
	public m_ArrImg1: eui.Image;
	public m_LvFullLab: eui.Label;
	public m_LeftGroup: eui.Group;
	public m_LeftMountEquipIcon: MountEquipIcon;
	public m_RightGroup: eui.Group;
	public m_RightMountEquipIcon: MountEquipIcon;
	public m_LeftStarGroup: eui.Group;
	public m_RightStarGroup: eui.Group;



	private m_NeedListData: eui.ArrayCollection;

	private needNum: number;
	private itemNum: number;
	private itemId: number;


	public m_NeedItem: MainNeedItem;

	public createChildren() {
		super.createChildren();
		this.m_NeedListData = new eui.ArrayCollection();
		this.m_LvFullLab.text = GlobalConfig.jifengTiaoyueLg.st100327;
		this.m_UpLvBtn.label = GlobalConfig.jifengTiaoyueLg.st100211;
		this.m_bg.init(`MountEquipStarUpWin`, GlobalConfig.jifengTiaoyueLg.st101908);
	}
	initUI() {
		super.initUI();
	}
	open(...param: any[]) {
		this.addViewEvent();
		this.setData();
	}
	close() {
		this.release();
	}
	public release() {
		DisplayUtils.dispose(this.m_NewEff);
		this.m_NewEff = null;
		DisplayUtils.dispose(this.m_ItemEff);
		this.m_ItemEff = null;
		this.removeViewEvent();
	}
	private addViewEvent() {
		this.m_NeedItem.addEvent();
		this.observe(MountEvt.MOUNT_DATAUPDATE_MSG, this.setData);
		this.AddClick(this.m_UpLvBtn, this.onClickUpLv);
	}
	private removeViewEvent() {
		this.m_NeedItem.removeEvent();
	}
	private setData() {
		let mountModel: MountModel = MountModel.getInstance;
		let mountData: MountData = mountModel.mountDic.get(mountModel.nowSelectRoldData.roleID);
		if (mountData) {
			let equipData: Sproto.ride_equip = mountData.equipList[mountModel.nowSelectEquipSlot - 1];
			let mountsEquipStarConfig = GlobalConfig.ins("MountsEquipStarConfig")[(mountModel.nowSelectRoldData.job) + "0" + mountModel.nowSelectEquipSlot];
			if (equipData) {
				let itemConfig = GlobalConfig.ins("ItemConfig")[equipData.itemid];
				if (itemConfig) {
					this.m_LeftMountEquipIcon.setData(equipData.itemid);
					this.m_RightMountEquipIcon.setData(equipData.itemid);
				}
				let lvConfig = mountsEquipStarConfig[equipData.itemid];
				let list = [{ type: 1, id: lvConfig.itemId1, count: 1 }]
				this.m_NeedListData.replaceAll(list);
				let needNum = 1 + Math.floor(equipData.star / 5);
				this.needNum = needNum;
				let itemNum = UserBag.ins().getBagGoodsCountById(0, lvConfig.itemId1);
				this.itemId = lvConfig.itemId1;
				this.itemNum = itemNum;
				mountModel.setStar(this.m_LeftStarGroup, equipData.star);
				mountModel.setStar(this.m_RightStarGroup, equipData.star + 1);
				this.m_NeedItem.setData(this.itemId, needNum);
				let nowStarAttr = mountModel.getEquipStarAttr(equipData, mountModel.nowSelectRoldData.job, mountModel.nowSelectEquipSlot);
				AttributeData.setAttrGroup(nowStarAttr, this.m_LeftAttrGroup);
				let power = Math.floor(UserBag.getAttrPower(nowStarAttr));
				this.m_Power.text = power;
				if (equipData.star < mountsEquipStarConfig[equipData.itemid].maxLevel) {
					let nextStarAttr = mountModel.getEquipStarAttr(equipData, mountModel.nowSelectRoldData.job, mountModel.nowSelectEquipSlot, equipData.star + 1);
					AttributeData.setAttrGroup(nextStarAttr, this.m_RightAttrGroup);
					this.m_ArrImg.visible = true;
					this.m_ArrImg1.visible = true;
					this.m_TitleLab.text = GlobalConfig.jifengTiaoyueLg.st101907;
					this.m_RightGroup.visible = true;
					this.m_CanUpStarGroup.visible = true;
					this.m_LeftGroup.horizontalCenter = -119;
					this.m_LeftAttrGroup.horizontalCenter = -127;
					this.m_LvFullLab.visible = false;
					this.m_LeftAttrGroup.visible = true;
					this.m_RightAttrGroup.visible = true;
				} else {
					this.m_ArrImg.visible = false;
					this.m_ArrImg1.visible = false;
					this.m_TitleLab.text = GlobalConfig.jifengTiaoyueLg.st100260;
					this.m_RightGroup.visible = false;
					this.m_CanUpStarGroup.visible = false;
					this.m_LeftGroup.horizontalCenter = 0;
					this.m_LeftAttrGroup.horizontalCenter = 0;
					this.m_LvFullLab.visible = true;
					this.m_LeftAttrGroup.visible = true;
					this.m_RightAttrGroup.visible = false;
				}

			}
		}
	}
	private onClickClose() {
		ViewManager.ins().close(this);
	}

	private onClickUpLv() {
		let mountModel: MountModel = MountModel.getInstance;
		if (this.itemNum >= this.needNum) {
			MountSproto.ins().sendGetMountEquipStarUp(mountModel.nowSelectRoldData.roleID, mountModel.nowSelectEquipSlot);
			this.playUpEff();
		} else {
			UserTips.ins().showTips(GlobalConfig.jifengTiaoyueLg.st100217);
		}
	}

	public m_EffGroup: eui.Group;
	public m_ItemEffGroup: eui.Group;
	private m_ItemEff: MovieClip;
	private m_NewEff: MovieClip;
	public playUpEff() {
		this.m_ItemEff = ViewManager.ins().createEff(this.m_ItemEff, this.m_ItemEffGroup, "eff_ui_icon");
		this.m_NewEff = ViewManager.ins().createEff(this.m_NewEff, this.m_EffGroup, "eff_ui_upgrade");
	}



	private onClickGetItem() {
		UserWarn.ins().setBuyGoodsWarn(this.itemId);
	}
}

ViewManager.ins().reg(MountEquipStarUpWin, LayerManager.UI_Popup);
window["MountEquipStarUpWin"] = MountEquipStarUpWin