class GadSelectItem extends eui.ItemRenderer {
	public constructor() {
		super();
	}
	public m_GadItem: GadItem;
	public m_Lab: eui.Label;
	public m_PointLab: eui.Label;
	public m_StateGroup: eui.Group;
	public m_StateMainGroup: eui.Group;

	public m_ScoreLab: eui.Label;
	public m_MainBtn: eui.Button;

	private slot: number;

	public createChildren() {
		super.createChildren();
		this.addEvent();
		this.m_MainBtn.label = GlobalConfig.jifengTiaoyueLg.st100314;
	}
	private addEvent() {
		this.m_MainBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onClick, this);
	}
	private removeEvent() {
		this.m_MainBtn.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onClick, this);
	}
	public dataChanged() {
		super.dataChanged();
		let data: GadBagData = this.data;
		let coawordproduceConfig = GlobalConfig.ins("COAwordproduceConfig")[data.configID];
		if (coawordproduceConfig) {
			if (data.handle == -1) {
				this.m_MainBtn.label = GlobalConfig.jifengTiaoyueLg.st100313;
			} else {
				this.m_MainBtn.label = GlobalConfig.jifengTiaoyueLg.st100314;
			}
			this.m_Lab.text = data.itemConfig.name + " +" + data.level;
			this.m_PointLab.text = GlobalConfig.jifengTiaoyueLg.st100315 + coawordproduceConfig.site;
			this.slot = coawordproduceConfig.site;
			AttributeData.setAttrGroup(data.mainAttr, this.m_StateMainGroup, 18, Color.Red);
			AttributeData.setAttrGroup(data.lotAttr, this.m_StateGroup);
			this.m_GadItem.setData(data, false);
			let power = Math.floor(UserBag.getAttrPower(data.attr));
			this.m_ScoreLab.textFlow = <Array<egret.ITextElement>>[{ text: GlobalConfig.jifengTiaoyueLg.st100316, style: { "textColor": 0x535557 } }, { text: power.toString(), style: { "textColor": 0xFFBF26 } }];
		}
		if (this.itemIndex == 0) {
			this.checkGuide();
		}
	}
	private onClick() {
		if (Setting.currPart == 20 && Setting.currStep == 3) {
			GuideUtils.ins().next(this.m_MainBtn);
			MessageCenter.ins().dispatch(GadEvent.GAD_GUIDE_MSG);
		}
		let data: ItemData = this.data;
		let gadModel = GadModel.getInstance;
		if (data.handle == -1) {
			if (this.slot) {
				GadSproto.ins().sendGadEquipOff(gadModel.nowSelectRoleId, this.slot);
			}
		} else {
			if (this.slot) {
				GadSproto.ins().sendGadEquipChange(gadModel.nowSelectRoleId, this.slot, data.handle);
			}
		}
	}

	private checkGuide() {
		if (Setting.currPart == 20 && Setting.currStep == 3) {
			GuideUtils.ins().show(this.m_MainBtn, 20, 3);
		}
	}

}
window["GadSelectItem"] = GadSelectItem