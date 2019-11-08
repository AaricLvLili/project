class PetSmeltSelectItem extends eui.ItemRenderer {
	public constructor() {
		super();
	}
	public m_Name: eui.Label;
	public m_GetLab: eui.Label;
	public m_SmeltBtn: eui.Button;
	public m_ItemList: eui.List;
	public m_AddGroup: eui.Group;
	public m_NumLabel: eui.TextInput;
	public m_CutBtn: eui.Image;
	public m_AddBtn: eui.Image;
	public m_MaxBtn: eui.Button;
	public m_MinBtn: eui.Button;

	private listData: eui.ArrayCollection;

	public m_Lan1: eui.Label;

	public createChildren() {
		super.createChildren();
		this.m_ItemList.itemRenderer = ItemBase;
		this.listData = new eui.ArrayCollection();
		this.m_ItemList.dataProvider = this.listData;
		this.addEvent();
		this.m_Lan1.text = GlobalConfig.jifengTiaoyueLg.st101112 + "：";
		this.m_MaxBtn.label = GlobalConfig.jifengTiaoyueLg.st101113;
		this.m_MinBtn.label = GlobalConfig.jifengTiaoyueLg.st101114;
		this.m_SmeltBtn.label = GlobalConfig.jifengTiaoyueLg.st101115;
	}

	private addEvent() {
		this.m_SmeltBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onClickSmeltBtn, this);
		this.m_CutBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onClick, this);
		this.m_AddBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onClick, this);
		this.m_MaxBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onClick, this);
		this.m_MinBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onClick, this);
		this.m_NumLabel.addEventListener(egret.Event.CHANGE, this.onLabChange, this);
	}

	public release() {
		DisplayUtils.dispose(this.m_ItemEff);
		this.m_ItemEff = null;
	}
	public dataChanged() {
		let data: any = this.data;
		this.m_Name.text = data.itemConfig.name;
		let itemList = { type: 1, id: data.configID, count: data.count }
		let itemData = [];
		itemData.push(itemList);
		this.listData.replaceAll(itemData);
		if (data["smeltSelectNum"] > data.cont) {
			data["smeltSelectNum"] = data.cont;
		}
		this.m_NumLabel.text = data["smeltSelectNum"];
		let petResolveConfig = GlobalConfig.ins("PetResolveConfig")[data.configID];
		if (petResolveConfig) {
			this.m_GetLab.text = "";
			for (var i = 0; i < petResolveConfig.materials.length; i++) {
				// let itemConfig = GlobalConfig.ins("ItemConfig")[petResolveConfig.materials[i].id];
				this.m_GetLab.text = this.m_GetLab.text + MoneyManger.MoneyConstToName(petResolveConfig.materials[i].id) + "x" + (petResolveConfig.materials[i].count * data["smeltSelectNum"]) + " ";
			}
		} else {
			this.m_GetLab.text = "";
		}
	}
	private onClick(evt: egret.TouchEvent) {
		let data: any = this.data;
		switch (evt.currentTarget) {
			case this.m_CutBtn:
				if (data["smeltSelectNum"] > 1) {
					data["smeltSelectNum"] -= 1;
				}
				break;
			case this.m_AddBtn:
				if (data["smeltSelectNum"] < data.count) {
					data["smeltSelectNum"] += 1;
				}
				break;
			case this.m_MaxBtn:
				if (data["smeltSelectNum"] < data.count) {
					data["smeltSelectNum"] = data.count;
				}
				break;
			case this.m_MinBtn:
				if (data["smeltSelectNum"] > 1) {
					data["smeltSelectNum"] = 1;
				}
				break;
		}
		this.m_NumLabel.text = data["smeltSelectNum"];
		let petResolveConfig = GlobalConfig.ins("PetResolveConfig")[data.configID];
		if (petResolveConfig) {
			this.m_GetLab.text = "";
			for (var i = 0; i < petResolveConfig.materials.length; i++) {
				// let itemConfig = GlobalConfig.ins("ItemConfig")[petResolveConfig.materials[i].id];
				this.m_GetLab.text = this.m_GetLab.text + MoneyManger.MoneyConstToName(petResolveConfig.materials[i].id) + "x" + (petResolveConfig.materials[i].count * data["smeltSelectNum"]) + " ";
			}
		} else {
			this.m_GetLab.text = "";
		}
	}
	private onLabChange() {
		let data: any = this.data;
		let str = this.m_NumLabel.text;
		let num = parseInt(str);
		if (num <= 0) {
			data["smeltSelectNum"] = 0;
			num = 0;
		} else if (num > data.count) {
			data["smeltSelectNum"] = data.count;
			num = data.count;
		} else {
			data["smeltSelectNum"] = num;
		}
		this.m_NumLabel.text = num + "";
	}

	private onClickSmeltBtn() {
		let data: any = this.data;
		let num = data["smeltSelectNum"]
		if (num > 0) {
			PetSproto.ins().sendPetSmelt(data.handle, num);
			this.playUpEff();
		}
	}
	public m_ItemEffGroup: eui.Group;
	private m_ItemEff: MovieClip;
	public playUpEff() {
		this.m_ItemEff = ViewManager.ins().createEff(this.m_ItemEff, this.m_ItemEffGroup, "eff_ui_icon");
	}



}
window["PetSmeltSelectItem"] = PetSmeltSelectItem