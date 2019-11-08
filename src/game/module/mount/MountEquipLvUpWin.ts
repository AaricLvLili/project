class MountEquipLvUpWin extends BaseEuiPanel {
	public constructor() {
		super()
		this.skinName = "MountEquipLvUpWinSkin";
	}
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
	public m_LeftLvLab: eui.Label;
	public m_RightGroup: eui.Group;
	public m_RightMountEquipIcon: MountEquipIcon;
	public m_RightLvLab: eui.Label;
	public m_Power: PowerLabel;



	private needNum: number;
	private itemNum: number;
	private itemId: number;


	public m_NeedItem: MainNeedItem;

	public createChildren() {
		super.createChildren();
		this.m_LvFullLab.text = GlobalConfig.jifengTiaoyueLg.st100327;
		this.m_UpLvBtn.label = GlobalConfig.jifengTiaoyueLg.st100296;
		this.m_bg.init(`MountEquipLvUpWin`, GlobalConfig.jifengTiaoyueLg.st101651);
	}
	initUI() {
		super.initUI();
	}
	open(...param: any[]) {
		this.setData();
		this.addViewEvent();
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
		this.observe(MessageDef.ITEM_COUNT_CHANGE, this.setData);
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
			let mountsEquipGrowUpConfig = GlobalConfig.ins("MountsEquipGrowUpConfig")[(mountModel.nowSelectRoldData.job) + "0" + mountModel.nowSelectEquipSlot];
			if (equipData) {
				let itemConfig = GlobalConfig.ins("ItemConfig")[equipData.itemid];
				if (itemConfig) {
					this.m_LeftMountEquipIcon.setData(equipData.itemid);
					this.m_RightMountEquipIcon.setData(equipData.itemid);
				}
				let lvConfig = mountsEquipGrowUpConfig[equipData.itemid];
				let needNum = 1 + Math.floor(equipData.level / 5);
				this.needNum = needNum;
				let itemNum = UserBag.ins().getBagGoodsCountById(0, lvConfig.itemId1);
				this.itemId = lvConfig.itemId1;
				this.itemNum = itemNum;
				this.m_NeedItem.setData(this.itemId, this.needNum);
				this.m_LeftLvLab.text = LanguageString.jifengTiaoyueCh(GlobalConfig.jifengTiaoyueLg.st101368, [equipData.level]);
				this.m_RightLvLab.text = LanguageString.jifengTiaoyueCh(GlobalConfig.jifengTiaoyueLg.st101368, [equipData.level + 1]);
				let nowLvAttr = mountModel.getEquipLvAttr(equipData, mountModel.nowSelectRoldData.job, mountModel.nowSelectEquipSlot);
				let power = Math.floor(UserBag.getAttrPower(nowLvAttr));
				this.m_Power.text = power
				AttributeData.setAttrGroup(nowLvAttr, this.m_LeftAttrGroup);
				if (equipData.level < mountsEquipGrowUpConfig[equipData.itemid].maxLevel) {
					let nextLvAttr = mountModel.getEquipLvAttr(equipData, mountModel.nowSelectRoldData.job, mountModel.nowSelectEquipSlot, equipData.level + 1);
					AttributeData.setAttrGroup(nextLvAttr, this.m_RightAttrGroup);
					this.m_ArrImg.visible = true;
					this.m_ArrImg1.visible = true;
					this.m_TitleLab.text = GlobalConfig.jifengTiaoyueLg.st100263;
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
			MountSproto.ins().sendGetMountEquipLvUp(mountModel.nowSelectRoldData.roleID, mountModel.nowSelectEquipSlot);
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

ViewManager.ins().reg(MountEquipLvUpWin, LayerManager.UI_Popup);
window["MountEquipLvUpWin"] = MountEquipLvUpWin