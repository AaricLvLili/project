class PetAllShowBtn extends eui.ItemRenderer {
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
		let config = GlobalConfig.ins("PetFettersConfig")[data];
		for (let key in config) {
			let config2 = config[key];
			for (let key2 in config2) {
				let petFettersConfig = config2[key2];
				this.m_MainBtn.label = petFettersConfig.name;
				break;
			}
			break;
		}
		if (petModel.petAllShowIndex == this.itemIndex) {
			this.m_MainBtn.enabled = false;
		} else {
			this.m_MainBtn.enabled = true;
		}
	}
	private onClick() {
		let petModel: PetModel = PetModel.getInstance;
		petModel.petAllShowIndex = this.itemIndex;
		GameGlobal.MessageCenter.dispatch(PetEvt.PET_ALLSHOW_MSG);
	}

}
window["PetAllShowBtn"]=PetAllShowBtn