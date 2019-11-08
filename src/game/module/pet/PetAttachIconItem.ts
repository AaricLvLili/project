class PetAttachIconItem extends eui.ItemRenderer {
	public constructor() {
		super();
	}
	public m_PetIconBase: PetIconBase;
	public m_AddImg: eui.Image;
	public m_AttcahNumLab: eui.Label;
	public m_SelectImg: eui.Image;
	public m_AttcahTips: eui.Label;
	public m_RedPoint: eui.Image;

	public createChildren() {
		super.createChildren();
		this.addEvent();
	}

	private addEvent() {
		this.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onClick, this);
	}
	public dataChanged() {
		super.dataChanged();
		let petModel: PetModel = PetModel.getInstance;
		let data: number = this.data;
		this.m_AddImg.visible = false;
		this.m_AttcahTips.visible = false;
		let slot = this.itemIndex;
		let petAdhereConfig = GlobalConfig.ins("PetAdhereConfig")[petModel.attachSelectRoleId + 1];
		if (petAdhereConfig) {
			let dicConfigData = petAdhereConfig[slot];
			if (dicConfigData) {
				this.m_AttcahNumLab.text = `${dicConfigData.valuePercent * 100}%`+GlobalConfig.jifengTiaoyueLg.st101406;
				if (dicConfigData.conditionkind == 7) {
					this.m_AttcahTips.text = GlobalConfig.jifengTiaoyueLg.st101407
				} else if (dicConfigData.conditionkind == 2) {
					let str: string = dicConfigData.tips;
					let arr: string[] = str.split("%s", 2);
					let setStr: string;
					if (dicConfigData.conditionnum >= 1000) {
						setStr =LanguageString.jifengTiaoyueCh(GlobalConfig.jifengTiaoyueLg.st101367,[ (dicConfigData.conditionnum / 1000)]);
					} else {
						setStr = LanguageString.jifengTiaoyueCh(GlobalConfig.jifengTiaoyueLg.st101368,[ dicConfigData.conditionnum]);
					}
					this.m_AttcahTips.text = arr[0] + setStr + arr[1];
				} else {
					let str: string = dicConfigData.tips;
					let arr: string[] = str.split("%s", 2);
					this.m_AttcahTips.text = arr[0] + dicConfigData.conditionnum + arr[1];
				}
			}
		}
		if (data == 0) {
			this.m_PetIconBase.setNot();
			this.m_AddImg.visible = true;
			this.m_AttcahTips.visible = true;
			this.m_AttcahTips.text = GlobalConfig.jifengTiaoyueLg.st101156;
		} else if (data < 0) {
			this.m_PetIconBase.setShuo(true);
			this.m_AttcahTips.visible = true;
		} else if (data > 0) {
			let petdata = petModel.petDic.get(data);
			this.m_PetIconBase.setData(petdata.petid, petdata.level);
		}
		// this.m_AttcahNumLab.text = "附身" + (this.itemIndex + 1);
		if (petModel.attachSelectIndex == this.itemIndex) {
			this.m_SelectImg.visible = true;
		} else {
			this.m_SelectImg.visible = false;
		}
		let isShow = petModel.checkAttactRedPoint(petModel.attachSelectRoleId, this.itemIndex);
		if (isShow) {
			this.m_RedPoint.visible = true;
		} else {
			this.m_RedPoint.visible = false;
		}
	}

	private onClick() {
		let petModel: PetModel = PetModel.getInstance;
		petModel.attachSelectIndex = this.itemIndex;
		GameGlobal.MessageCenter.dispatch(PetEvt.PET_ATTACH_MSG);
	}
}
window["PetAttachIconItem"] = PetAttachIconItem