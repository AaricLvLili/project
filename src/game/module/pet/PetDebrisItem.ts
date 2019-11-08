class PetDebrisItem extends eui.ItemRenderer {
	public constructor() {
		super();
	}
	public m_ItemBase: ItemBase;
	public m_Name: eui.Label;
	public m_Num: eui.Label;
	public m_MainBtn: eui.Button;
	public bg: eui.Image;
	public m_ItemEffGroup: eui.Group;

	public createChildren() {
		super.createChildren();
		this.addEvent();
		this.m_ItemBase.setRight();
		this.m_MainBtn.label = GlobalConfig.jifengTiaoyueLg.st101124;
	}
	private addEvent() {
		this.m_MainBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onClick, this);
		MessageCenter.ins().addListener(PetEvt.PET_DEBRIS_MSG, this.playEff, this);
	}
	public dataChanged() {
		super.dataChanged();
		let debrisId = this.data;
		let petComposeConfig = GlobalConfig.ins("PetComposeConfig")[debrisId];
		let itemId = petComposeConfig.itemId;
		let itemData = GlobalConfig.ins("ItemConfig")[itemId];
		let itemCount = UserBag.ins().getBagGoodsCountById(0, itemId);
		let itemSetData = { type: 1, id: itemId, count: itemCount };
		this.m_ItemBase.data = itemSetData;
		this.m_ItemBase.dataChanged();
		this.m_ItemBase.isShowName(false);
		this.m_Name.text = itemData.name;
		let itemDebrisCount = UserBag.ins().getBagGoodsCountById(0, debrisId);
		this.m_Num.text = LanguageString.jifengTiaoyueCh(GlobalConfig.jifengTiaoyueLg.st101125, [itemDebrisCount, petComposeConfig.count]);
		if (itemDebrisCount >= petComposeConfig.count) {
			this.m_MainBtn.enabled = true;
		} else {
			this.m_MainBtn.enabled = false;
		}
	}
	private onClick() {
		PetSproto.ins().sendPetCompose(this.data);
	}

	private playEff(data: any) {
		if (this.data == data) {
			this.playBodyEff();
		}
	}

	private m_ItemEff: MovieClip;
	private playBodyEff() {
		this.m_ItemEff = ViewManager.ins().createEff(this.m_ItemEff, this.m_ItemEffGroup, "eff_ui_iconUpgrade");
	}
}
window["PetDebrisItem"] = PetDebrisItem