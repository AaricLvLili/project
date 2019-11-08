class EquipChang extends eui.Component {
	public constructor() {
		super();
		this.skinName = "EquipChangeSkin";
	}
	public m_ItemBase: ItemBase;
	public m_MainBtn: eui.Button;
	public m_Title: eui.Label;
	private time: number = 8;

	private index = 0;
	private roleIndex = 0;
	private handle = 0;
	public m_LvLab: eui.BitmapLabel;

	public createChildren() {
		super.createChildren();
		this.visible = false;
		MessageCenter.ins().addListener(MessageDef.BAG_HAS_ITEM_CAN_USE, this.setData, this);
		this.m_MainBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onClickMain, this);
	}

	private setData() {
		if (UserFb.ins().guanqiaID < 3) {
			return;
		}
		if (this.visible == false) {
			let tempEquips: ItemData[] = [];
			for (var i = 0; i < SubRoles.ins().subRolesLen; i++) {
				let role = SubRoles.ins().getSubRoleByIndex(i)
				tempEquips = UserRole.ins().checkHaveCan(false, i);
				for (var f = 0; f < tempEquips.length; f++) {
					let equip = role.getEquipByIndex(f);
					let itemData = tempEquips[f];
					if (itemData && itemData.handle != equip.item.handle) {
						this.roleIndex = i;
						this.index = f;
						this.visible = true;
						this.handle = itemData.handle;
						this.m_ItemBase.data = itemData;
						this.m_ItemBase.dataChanged();
						this.m_Title.text = itemData.itemConfig.name;
						// this.m_Title.textColor = ItemBase.QUALITY_COLOR2[itemData.itemConfig.quality];
						this.m_LvLab.text = this.m_ItemBase.nameTxt.text;
						this.m_ItemBase.isShowName(false);
						this.addTime();
						return;
					}
				}
			}
		}
	}

	private addTime() {
		this.removeTime();
		TimerManager.ins().doTimer(1000, 0, this.changeBtnText, this);
		this.changeBtnText();
	}

	private removeTime() {
		TimerManager.ins().remove(this.changeBtnText, this);
	}

	private changeBtnText() {
		this.m_MainBtn.label = GlobalConfig.jifengTiaoyueLg.st100665 + "(" + this.time + ")";
		if (this.time <= 0) {
			this.onClickMain();
		}
		this.time--;
	}

	private onClickMain() {
		this.removeTime();
		this.visible = false;
		UserEquip.ins().sendWearEquipment(this.handle, this.index, this.roleIndex);
		egret.setTimeout(this.setData, this, 1000);
		this.time = 8;
	}

}
window["EquipChang"] = EquipChang