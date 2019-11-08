class PetDebrisBtnItem extends eui.ItemRenderer {
	public constructor() {
		super();
	}
	public m_MainBtn: eui.Button;
	public m_RedPoint: eui.Image;

	public createChildren() {
		super.createChildren();
		this.addEvent();
	}
	private addEvent() {
		this.m_MainBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onClick, this);
	}
	public dataChanged() {
		super.dataChanged();
		let data: number = this.data;
		let petModel: PetModel = PetModel.getInstance;
		switch (data) {
			case 1:
				this.m_MainBtn.label = GlobalConfig.jifengTiaoyueLg.st101913;
				break;
			case 2:
				this.m_MainBtn.label = GlobalConfig.jifengTiaoyueLg.st101914;
				break;
			case 3:
				this.m_MainBtn.label = GlobalConfig.jifengTiaoyueLg.st101915;
				break;
			case 4:
				this.m_MainBtn.label = GlobalConfig.jifengTiaoyueLg.st101916;
				break;
			case 5:
				this.m_MainBtn.label = GlobalConfig.jifengTiaoyueLg.st101917;
				break;
		}
		if (petModel.petDebrisBtnIndex == this.itemIndex + 1) {
			this.m_MainBtn.enabled = false;
		} else {
			this.m_MainBtn.enabled = true;
		}
		let isShow = petModel.checkPetDebrisRedPointByQuality(this.data);
		if (isShow) {
			this.m_RedPoint.visible = true;
		} else {
			this.m_RedPoint.visible = false;
		}
	}
	private onClick() {
		let petModel: PetModel = PetModel.getInstance;
		petModel.petDebrisBtnIndex = this.itemIndex + 1;
		GameGlobal.MessageCenter.dispatch(PetEvt.PET_DEBRIS_MSG);
	}

}
window["PetDebrisBtnItem"] = PetDebrisBtnItem