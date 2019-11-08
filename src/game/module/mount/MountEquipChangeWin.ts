class MountEquipChangeWin extends BaseEuiPanel {
	public constructor() {
		super()
		this.skinName = "MountEquipChangeWinSkin";
	}
	public m_Scroller: eui.Scroller;
	public m_List: eui.List;
	private listData: eui.ArrayCollection;

	public m_NameLab: eui.Label;
	public m_ItemColor: eui.Label;
	public m_Score: eui.Label;
	public m_LvLab: eui.Label;
	public m_MountEquipIcon: MountEquipIcon;
	public m_AttrGroup: eui.Group;
	public m_LabGroup: eui.Group;
	public m_noChangeLab: eui.Label;

	public m_Lab1: eui.Label;
	public m_Lab2: eui.Label;
	public m_Lab3: eui.Label;
	public m_MainBg: eui.Image;
	public getItem: eui.Label;


	public createChildren() {
		super.createChildren();
		this.m_List.itemRenderer = MountEquipChangeItem;
		this.listData = new eui.ArrayCollection();
		this.m_List.dataProvider = this.listData;
		this.m_Lab1.text = GlobalConfig.jifengTiaoyueLg.st101905;
		this.m_Lab2.text = GlobalConfig.jifengTiaoyueLg.st101906;
		this.m_Lab3.text = GlobalConfig.jifengTiaoyueLg.st100923;
		this.getItem.text = GlobalConfig.jifengTiaoyueLg.st101091;
		UIHelper.SetLinkStyleLabel(this.getItem);
		this.m_bg.init(`MountEquipChangeWin`, GlobalConfig.jifengTiaoyueLg.st101904);
	}
	initUI() {
		super.initUI();
	}
	open(...param: any[]) {
		let mountModel = MountModel.getInstance;
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
		this.AddClick(this.getItem, this.onClickGetLab1);
	}
	private removeViewEvent() {
	}
	private setData() {
		let mountModel = MountModel.getInstance;
		let mountData: MountData = mountModel.mountDic.get(mountModel.nowSelectRoldData.roleID);
		let itemDatas: ItemData[] = UserBag.ins().getBagGoodsByMountEquip(ItemType.MOUNTEQUIP, mountModel.nowSelectEquipSlot, mountModel.nowSelectRoldData.job);
		for (var i = 0; i < itemDatas.length; i++) {
			let itemData = itemDatas[i];
			if (itemData.weight <= 0) {
				let maxAttrList = [];
				let addNum = 0;
				let equipConfig = GlobalConfig.ins("EquipConfig")[itemData.configID];
				let itemConfig = GlobalConfig.ins("ItemConfig")[itemData.configID];
				for (var k in AttributeData.translate) {
					if (equipConfig[k] <= 0)
						continue;
					if (itemData != undefined) {
						let attr = itemData.att;
						for (var index = 0; index < attr.length; index++) {
							if (attr[index].type == AttributeData.translate[k]) {
								addNum = attr[index].value * 0.01;
								break;
							}
						}
					}
					let setType = AttributeData.translate[k];
					let setValue = equipConfig[k];
					let maxSetValue = setValue * addNum + equipConfig[k];
					let maxAttrData = { type: setType, value: maxSetValue };
					maxAttrList.push(maxAttrData);
				}
				let canChangeNum = 0;
				if (mountData) {
					if (mountData.level >= itemConfig.zsLevel) {
						canChangeNum += 10000000000;
					}
				}
				itemData.weight = Math.floor(UserBag.getAttrPower(maxAttrList)) + canChangeNum;
			}
		}
		itemDatas.sort(this.sorLvUp);
		this.listData.removeAll();
		this.listData.replaceAll(itemDatas);
		this.listData.refresh();
		this.m_noChangeLab.visible = false;
		this.m_LabGroup.visible = true;
		this.m_MainBg.visible = true;
		if (mountData) {
			let equipData: Sproto.ride_equip = mountData.equipList[mountModel.nowSelectEquipSlot - 1];
			if (equipData && equipData.itemid > 0) {
				let itemConfig = GlobalConfig.ins("ItemConfig")[equipData.itemid];
				if (itemConfig) {
					this.m_ItemColor.text = mountModel.getEquipColor(itemConfig.quality);
					this.m_NameLab.text = itemConfig.name;
					this.m_LvLab.text = itemConfig.zsLevel + GlobalConfig.jifengTiaoyueLg.st100103;
				}
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
				AttributeData.setAttrGroup(baseAttrList, this.m_AttrGroup, 18, Color.FontColor, true, Color.Green, randAttrList);
				let power = Math.floor(UserBag.getAttrPower(maxAttrList));
				this.m_Score.textFlow = <Array<egret.ITextElement>>[{ text: GlobalConfig.jifengTiaoyueLg.st100316, style: { "textColor": 0x535557 } }, { text: power.toString(), style: { "textColor": 0xFFBF26 } }];
				this.m_MountEquipIcon.setData(equipData.itemid);
			} else {
				this.m_NameLab.text = "";
				this.m_ItemColor.text = "";
				this.m_LvLab.text = "";
				AttributeData.setAttrGroup([], this.m_AttrGroup);
				this.m_Score.text = "";
				this.m_MountEquipIcon.noItem();
			}
			if (equipData.itemid <= 0 && itemDatas.length <= 0) {
				this.m_noChangeLab.visible = true;
				this.m_LabGroup.visible = false;
				this.m_MainBg.visible = false;
			}
		}
	}
	/**关联排序 */
	private sorLvUp(item1: { weight: number }, item2: { weight: number }): number {
		return item2.weight - item1.weight;
	}
	private onClickClose() {
		ViewManager.ins().close(this);
	}
	private onClickGetLab1() {
		UserWarn.ins().setBuyGoodsWarn(801001);
	}
}

ViewManager.ins().reg(MountEquipChangeWin, LayerManager.UI_Popup);
window["MountEquipChangeWin"] = MountEquipChangeWin