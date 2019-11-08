class OrangeBreakItem extends eui.ItemRenderer {
	public constructor() {
		super();
		this.skinName = "OrangeBreakItemSkin"
	}
	public m_ItemIcon: ItemBase;
	public m_Lan1: eui.Label;
	public m_NumLab: eui.Label;
	public m_Lan2: eui.Label;
	public m_ContLab: eui.Label;
	public m_SmeltBtn: eui.Button;
	public m_AddGroup: eui.Group;
	public m_NumLabel: eui.TextInput;
	public m_CutBtn: eui.Image;
	public m_AddBtn: eui.Image;
	public m_MaxBtn: eui.Button;
	public m_MinBtn: eui.Button;

	private itemId: number;
	public m_CantLab: eui.Label;

	protected createChildren() {
		super.createChildren();
		this.m_Lan1.text = GlobalConfig.jifengTiaoyueLg.st101867;
		this.m_Lan2.text = GlobalConfig.jifengTiaoyueLg.st101868;
		this.m_MinBtn.label = GlobalConfig.jifengTiaoyueLg.st101114;
		this.m_MaxBtn.label = GlobalConfig.jifengTiaoyueLg.st101113;
		this.m_MaxBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onClick, this);
		this.m_MinBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onClick, this);
		this.m_AddBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onClick, this);
		this.m_CutBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onClick, this);
		this.m_SmeltBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onClickSmeltBtn, this)
		this.m_NumLabel.addEventListener(egret.Event.CHANGE, this.onLabChange, this);
		this.m_ItemIcon.count.visible = false;
	}

	protected dataChanged() {
		super.dataChanged();
		let id = this.data.id;
		let legendRecycleConfig = GlobalConfig.ins("LegendRecycleConfig")[id];
		if (legendRecycleConfig) {
			let isCanRe: boolean = false;
			if (legendRecycleConfig.condition >= 1000) {
				let playerzs = UserZs.ins() ? UserZs.ins().lv : 0;
				if (playerzs * 1000 >= legendRecycleConfig.condition) {
					isCanRe = true;
				} else {
					this.m_CantLab.text = LanguageString.jifengTiaoyueCh(GlobalConfig.jifengTiaoyueLg.st101870, [(legendRecycleConfig.condition / 1000)]);
				}
			} else {
				let playerlv = GameLogic.ins().actorModel.level;
				if (playerlv >= legendRecycleConfig.condition) {
					isCanRe = true;
				} else {
					this.m_CantLab.text = LanguageString.jifengTiaoyueCh(GlobalConfig.jifengTiaoyueLg.st101871, [legendRecycleConfig.condition]);
				}
			}
			if (isCanRe) {
				this.m_AddGroup.visible = true;
				this.m_SmeltBtn.visible = true;
				this.m_CantLab.visible = false;
			} else {
				this.m_AddGroup.visible = false;
				this.m_SmeltBtn.visible = false;
				this.m_CantLab.visible = true;

			}
			let itemId = legendRecycleConfig.itemId;
			this.itemId = itemId;
			let haveNum = UserBag.ins().getBagGoodsCountById(0, itemId);
			this.m_NumLab.text = haveNum + "";
			let itemConfig = GlobalConfig.ins("ItemConfig")[itemId];
			this.m_ItemIcon.data = itemConfig;
			this.m_ItemIcon.dataChanged();
			this.m_NumLabel.text = this.data["smeltSelectNum"] + "";
			this.onLabChange();
		}

	}

	private setGetNum() {
		let id = this.data.id;
		let legendRecycleConfig = GlobalConfig.ins("LegendRecycleConfig")[id];
		if (legendRecycleConfig) {
			let num = this.data["smeltSelectNum"];
			if (!num) {
				num = 1;
			}
			this.m_ContLab.text = legendRecycleConfig.itemName + "x" + (num * legendRecycleConfig.recycle.count);
		}
	}

	private onClick(evt: egret.TouchEvent) {
		let data: any = this.data;
		let id = this.data.id;
		let haveNum;
		let legendRecycleConfig = GlobalConfig.ins("LegendRecycleConfig")[id];
		if (legendRecycleConfig) {
			let itemId = legendRecycleConfig.itemId;
			haveNum = UserBag.ins().getBagGoodsCountById(0, itemId);
		}
		switch (evt.currentTarget) {
			case this.m_CutBtn:
				if (data["smeltSelectNum"] > 1) {
					data["smeltSelectNum"] -= 1;
				}
				break;
			case this.m_AddBtn:
				if (data["smeltSelectNum"] < haveNum) {
					data["smeltSelectNum"] += 1;
				}
				break;
			case this.m_MaxBtn:
				if (data["smeltSelectNum"] < haveNum) {
					data["smeltSelectNum"] = haveNum;
				}
				break;
			case this.m_MinBtn:
				if (data["smeltSelectNum"] > 1) {
					data["smeltSelectNum"] = 1;
				}
				break;
		}
		this.m_NumLabel.text = data["smeltSelectNum"] + "";
		this.setGetNum();
	}

	private onLabChange() {
		let data: any = this.data;
		let id = this.data.id;
		let legendRecycleConfig = GlobalConfig.ins("LegendRecycleConfig")[id];
		if (legendRecycleConfig) {
			let itemId = legendRecycleConfig.itemId;
			let haveNum = UserBag.ins().getBagGoodsCountById(0, itemId);
			let str = this.m_NumLabel.text;
			let num = parseInt(str);
			if (num <= 0) {
				data["smeltSelectNum"] = 0;
				num = 0;
			} else if (num > haveNum) {
				data["smeltSelectNum"] = haveNum;
				num = haveNum;
			} else {
				data["smeltSelectNum"] = num;
			}
			this.m_NumLabel.text = num + "";
		}
		this.setGetNum();
	}

	private onClickSmeltBtn() {
		let data: any = this.data;
		let num = data["smeltSelectNum"]
		if (num > 0) {
			// let itemData = UserBag.ins().getBagGoodsByTypeAndId(0, this.itemId);
			// if (itemData && itemData.handle && itemData.count > 0) {
			// PetSproto.ins().sendPetSmelt(itemData.handle, num);
			UserEquip.ins().sendEquipItemResolve(this.itemId, num, data.id)
			// } else {
			// 	UserTips.ins().showTips(GlobalConfig.languageConfig.st100217);
			// 	return
			// }
			// let legendRecycleConfig = GlobalConfig.ins("LegendRecycleConfig")[this.data.id];
			// if (legendRecycleConfig) {
			// 	let itemId = legendRecycleConfig.itemId;
			// 	let haveNum = UserBag.ins().getBagGoodsCountById(0, itemId);
			// 	if (haveNum > 0) {
			this.playUpEff();
			// }
			// }
		} else {
			UserTips.ins().showTips(GlobalConfig.jifengTiaoyueLg.st100217);
		}
	}

	public playUpEff() {
		this.m_ItemEff = ViewManager.ins().createEff(this.m_ItemEff, this.m_ItemEffGroup, "eff_ui_icon");
	}
	public m_ItemEffGroup: eui.Group;
	private m_ItemEff: MovieClip;
}
window["OrangeBreakItem"] = OrangeBreakItem