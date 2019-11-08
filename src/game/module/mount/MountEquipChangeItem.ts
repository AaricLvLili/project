class MountEquipChangeItem extends eui.ItemRenderer {
	public constructor() {
		super();
	}
	public m_NameLab: eui.Label;
	public m_ItemColor: eui.Label;
	public m_Score: eui.Label;
	public m_LvLab: eui.Label;
	public m_AddEquipBtn: eui.Button;
	public m_AttrGroup: eui.Group;
	public m_MountEquipIcon: MountEquipIcon;

	public m_NoLvLab: eui.Label;
	public m_Lan1: eui.Label;
	public m_Lan2: eui.Label;

	public createChildren() {
		super.createChildren();
		this.addEvent();
		this.m_Lan1.text = GlobalConfig.jifengTiaoyueLg.st101905;
		this.m_Lan2.text = GlobalConfig.jifengTiaoyueLg.st100923;
		this.m_AddEquipBtn.label = GlobalConfig.jifengTiaoyueLg.st100665;
	}

	private addEvent() {
		this.m_AddEquipBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onClickBtn, this);
	}
	public dataChanged() {
		super.dataChanged();
		let mountModel = MountModel.getInstance;
		let itemData: ItemData = this.data;
		let itemConfig = GlobalConfig.ins("ItemConfig")[itemData.configID];
		if (itemConfig) {
			this.m_ItemColor.text = mountModel.getEquipColor(itemConfig.quality);
			this.m_NameLab.text = itemConfig.name;
		}
		let equipConfig = GlobalConfig.ins("EquipConfig")[itemData.configID];
		var baseAttrList = [];
		var randAttrList = [];
		let maxAttrList = [];
		let addNum = 0;
		for (var k in AttributeData.translate) {
			if (equipConfig[k] <= 0)
				continue;
			if (itemData != undefined) {
				var attr = itemData.att;
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
		this.m_LvLab.text = itemConfig.zsLevel + GlobalConfig.jifengTiaoyueLg.st100103;
		AttributeData.setAttrGroup(baseAttrList, this.m_AttrGroup, 18, Color.FontColor, true, Color.Green, randAttrList);
		this.m_MountEquipIcon.setData(itemData.configID);
		let power = Math.floor(UserBag.getAttrPower(maxAttrList));
		this.m_Score.textFlow = <Array<egret.ITextElement>>[{ text: GlobalConfig.jifengTiaoyueLg.st100316, style: { "textColor": 0x535557 } }, { text: power.toString(), style: { "textColor": 0xFFBF26 } }];
		let mountData: MountData = mountModel.mountDic.get(mountModel.nowSelectRoldData.roleID);
		if (mountData) {
			if (mountData.level >= itemConfig.zsLevel) {
				this.m_NoLvLab.visible = false;
				this.m_AddEquipBtn.visible = true;
			} else {
				this.m_NoLvLab.visible = true;
				this.m_NoLvLab.text = itemConfig.zsLevel + GlobalConfig.jifengTiaoyueLg.st101903;
				this.m_AddEquipBtn.visible = false;
			}
		}
	}

	private onClickBtn() {
		let mountModel = MountModel.getInstance;
		MountSproto.ins().sendGetMountEquipChange(mountModel.nowSelectRoldData.roleID, mountModel.nowSelectEquipSlot, this.data.handle);
	}

}
window["MountEquipChangeItem"] = MountEquipChangeItem