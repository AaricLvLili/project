class PetTreasureIcon extends eui.ItemRenderer {
	public constructor() {
		super();
	}
	public createChildren() {
		super.createChildren();
		this.addEvent();
	}

	public m_IconBase: PetIconBase;
	public m_Name: eui.Label;
	public m_FightImg: eui.Image;
	public m_SelectImg: eui.Image;
	public m_RedPoint: eui.Image;


	public checkRedPointType: number = 1;

	private petId: number = -1;

	private addEvent() {
		this.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onClick, this);
		this.m_FightImg.visible = false;
		this.m_RedPoint.visible = false;
	}

	public dataChanged() {
		super.dataChanged();
		let petModel = PetModel.getInstance;
		let id = this.data;
		let petTreasureHuntPoolConfig = GlobalConfig.ins("petTreasureHuntPoolConfig")[id];
		if (petTreasureHuntPoolConfig) {
			this.m_IconBase.setData(petTreasureHuntPoolConfig.petID);
			let petConfig = GlobalConfig.ins("PetConfig")[petTreasureHuntPoolConfig.petID];
			this.petId = petTreasureHuntPoolConfig.petID;
			if (petConfig) {
				this.m_Name.text = petConfig.name;
			}
		}
		if (this.itemIndex == petModel.petTreasureSelectIndex) {
			this.m_SelectImg.visible = true;
		} else {
			this.m_SelectImg.visible = false;
		}
	}

	private onClick() {
		let petModel: PetModel = PetModel.getInstance;
		if (petModel.petTreasureSelectIndex != this.itemIndex) {
			petModel.petTreasureSelectIndex = this.itemIndex;
			GameGlobal.MessageCenter.dispatch(PetEvt.PET_TREASURE_MSG);
		} else if (this.petId != -1) {
			let petData = petModel.petDic.get(this.petId);
			if (petData) {
				ViewManager.ins().open(PetStateWin, petData);
			}
		}
	}
}
window["PetTreasureIcon"] = PetTreasureIcon