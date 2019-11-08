class MountEquipWin extends BaseEuiPanel {
	public constructor() {
		super()
		this.skinName = "MountEquipWinSkin";
	}
	public m_DownBtn: eui.Button;
	public m_StarUpBtn: eui.Button;
	public m_ChangeBtn: eui.Button;
	public m_LvUpBtn: eui.Button;
	public m_NameLab: eui.Label;
	public m_ItemColor: eui.Label;
	public m_Score: eui.Label;
	public m_LvLab: eui.Label;
	public m_EquipTypeLab: eui.Label;
	public m_MainStateAttrGroup: eui.Group;
	public m_LvAttrGroup: eui.Group;
	public m_StarAllAttrGroup: eui.Group;
	public m_MountEquipStarIcon: MountEquipStarIcon;
	public m_Lan1: eui.Label;
	public m_Lan2: eui.Label;
	public m_Lan3: eui.Label;


	public createChildren() {
		super.createChildren();
		this.m_Lan1.text = GlobalConfig.jifengTiaoyueLg.st101905;
		this.m_Lan2.text = GlobalConfig.jifengTiaoyueLg.st100923;
		this.m_Lan3.text = GlobalConfig.jifengTiaoyueLg.st101910;
		this.m_DownBtn.label = GlobalConfig.jifengTiaoyueLg.st101911
		this.m_ChangeBtn.label = GlobalConfig.jifengTiaoyueLg.st101912;
		this.m_StarUpBtn.label = GlobalConfig.jifengTiaoyueLg.st100211;
		this.m_LvUpBtn.label = GlobalConfig.jifengTiaoyueLg.st100296;
		this.m_bg.init(`MountEquipWin`, GlobalConfig.jifengTiaoyueLg.st101909);
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
		this.removeViewEvent();
	}
	private addViewEvent() {
		this.observe(MountEvt.MOUNT_DATAUPDATE_MSG, this.setData);
		this.AddClick(this.m_ChangeBtn, this.onClickChangBtn);
		this.AddClick(this.m_DownBtn, this.onClickDown);
		this.AddClick(this.m_LvUpBtn, this.onClickLvUp);
		this.AddClick(this.m_StarUpBtn, this.onClickStarUp);
	}
	private removeViewEvent() {
	}
	private setData() {
		let mountModel = MountModel.getInstance;
		let mountData: MountData = mountModel.mountDic.get(mountModel.nowSelectRoldData.roleID);
		if (mountData) {
			let equipData: Sproto.ride_equip = mountData.equipList[mountModel.nowSelectEquipSlot - 1];
			if (equipData) {
				let itemConfig = GlobalConfig.ins("ItemConfig")[equipData.itemid];
				if (itemConfig) {
					this.m_ItemColor.text = mountModel.getEquipColor(itemConfig.quality);
					this.m_NameLab.text = itemConfig.name;
					this.m_LvLab.text = itemConfig.zsLevel + GlobalConfig.jifengTiaoyueLg.st100103;
				}
				this.m_EquipTypeLab.text = mountModel.getEquipTypeName(mountModel.nowSelectEquipSlot);
				this.m_MountEquipStarIcon.setData(equipData.itemid, equipData.star);
				let equipConfig = GlobalConfig.ins("EquipConfig")[equipData.itemid];
				var baseAttrList = [];
				var randAttrList = [];
				let maxAttrList = [];
				let addNum = 0;
				for (var k in AttributeData.translate) {
					if (equipConfig[k] <= 0)
						continue;
					if (equipData != undefined) {
						let attr = equipData.attr;
						for (var index = 0; index < attr.length; index++) {
							if (attr[index].type == AttributeData.translate[k]) {
								randAttrList.push(' +' + attr[index].value + "%");
								addNum = attr[index].value * 0.01;
								break;
							}
						}
					}
					let setType = AttributeData.translate[k];
					let setValue = equipConfig[k];
					let maxSetValue = setValue * addNum + equipConfig[k];
					let newAttrData = { type: setType, value: setValue };
					baseAttrList.push(newAttrData);
					let maxAttrData = { type: setType, value: maxSetValue };
					maxAttrList.push(maxAttrData);
					if (randAttrList[baseAttrList.length - 1] == null) {
						randAttrList[baseAttrList.length - 1] = "";
					}
				}
				AttributeData.setAttrGroup(baseAttrList, this.m_MainStateAttrGroup, 18, Color.FontColor, true, Color.Green, randAttrList);
				let power = Math.floor(UserBag.getAttrPower(maxAttrList));
				this.m_Score.textFlow = <Array<egret.ITextElement>>[{ text: GlobalConfig.jifengTiaoyueLg.st100316, style: { "textColor": 0x535557 } }, { text: power.toString(), style: { "textColor": 0xFFBF26 } }];
				let lvAttr = mountModel.getEquipLvAttr(equipData, mountModel.nowSelectRoldData.job, mountModel.nowSelectEquipSlot);
				AttributeData.setAttrGroup(lvAttr, this.m_LvAttrGroup);
				let starAttr = mountModel.getEquipStarAttr(equipData, mountModel.nowSelectRoldData.job, mountModel.nowSelectEquipSlot);
				AttributeData.setAttrGroup(starAttr, this.m_StarAllAttrGroup);
			}
		}
	}
	private onClickClose() {
		ViewManager.ins().close(this);
	}
	private onClickChangBtn() {
		ViewManager.ins().open(MountEquipChangeWin);
	}
	private onClickDown() {
		let mountModel = MountModel.getInstance;
		MountSproto.ins().sendGetMountEquipOff(mountModel.nowSelectRoldData.roleID, mountModel.nowSelectEquipSlot);
	}
	private onClickLvUp() {
		ViewManager.ins().open(MountEquipLvUpWin);
	}

	private onClickStarUp() {
		ViewManager.ins().open(MountEquipStarUpWin);
	}
}

ViewManager.ins().reg(MountEquipWin, LayerManager.UI_Popup);
window["MountEquipWin"] = MountEquipWin