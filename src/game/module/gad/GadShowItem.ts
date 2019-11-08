class GadShowItem extends eui.Component {
	public constructor() {
		super();
	}
	public m_Icon: eui.Image;
	public m_LockGroup: eui.Group;
	public m_ContLab: eui.Label;

	public gadData: GadData;
	public slot: number;

	public m_LvLab: eui.Label;
	public m_StarGroup: eui.Group;

	public createChildren() {
		super.createChildren();
		this.addEvent();
	}

	private addEvent() {
		this.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onClick, this);
	}

	public setData(gadData: GadData, slot: number) {
		this.m_Icon.source = "wz_54_54_0_png";
		this.m_LockGroup.visible = false;
		this.gadData = gadData;
		this.slot = slot;
		this.m_LvLab.visible = false;
		this.m_StarGroup.visible = false;
		let coaConfig = GlobalConfig.ins("COAConfig")[slot];
		if (coaConfig) {
			switch (coaConfig.conditionkind) {
				case 2:
					let lv = GameLogic.ins().actorModel.level;
					if (lv < coaConfig.conditionnum) {
						this.m_LockGroup.visible = true;
						this.m_ContLab.text = coaConfig.conditionnum + GlobalConfig.jifengTiaoyueLg.st100310;
					} else {
						this.setGadIcon(gadData);
					}
					break;
				case 1:
					if (UserFb.ins().guanqiaID < coaConfig.conditionnum) {
						this.m_LockGroup.visible = true;
						this.m_ContLab.text = coaConfig.conditionnum + GlobalConfig.jifengTiaoyueLg.st102095;
					} else {
						this.setGadIcon(gadData);
					}
					break;
			}
		}
	}

	private setGadIcon(gadData: GadData) {
		if (gadData.itemid > 0) {
			let coawordproduceConfig = GlobalConfig.ins("COAwordproduceConfig")[gadData.itemid];
			this.m_Icon.source = "wz_54_54_" + coawordproduceConfig.suit + "_png";
			this.m_LvLab.text = "+" + gadData.level;
			this.m_LvLab.visible = true;
			this.m_StarGroup.visible = true;
			GadModel.getInstance.setStarNum(gadData.star, this.m_StarGroup);
		}
	}

	private onClick() {
		let gadData = this.gadData;
		let slot = this.slot;
		let coaConfig = GlobalConfig.ins("COAConfig")[slot];
		if (coaConfig) {
			switch (coaConfig.conditionkind) {
				case 2:
					let lv = GameLogic.ins().actorModel.level;
					this.clickResult(lv < coaConfig.conditionnum, gadData)
					break;
				case 1:
					this.clickResult(UserFb.ins().guanqiaID < coaConfig.conditionnum, gadData)
					break;
			}
		}
	}
	private clickResult(isCan, gadData) {
		if (isCan) {
			UserTips.ins().showTips(this.m_ContLab.text);
		} else {
			if (gadData.itemid > 0) {
				ViewManager.ins().open(GadStateWin, gadData);
			} else {
				ViewManager.ins().open(GadSelectWin, gadData);
			}
		}
	}
}
window["GadShowItem"] = GadShowItem