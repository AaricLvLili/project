class PetFetterWin extends BaseEuiPanel {
	public constructor() {
		super()
		this.skinName = "PetFetterWinSkin";
	}

	public m_NowArttrGroup: eui.Group;
	public m_AllStarLab: eui.Label;
	public m_NextGroup: eui.Group;
	public m_LVUPTips: eui.Label;
	public m_LVMAXLab: eui.Label;

	private petFetterData: any;
	public m_NextAttrGroup: eui.Group;

	initUI() {
		super.initUI();
		this.m_bg.init(`PetFetterWin`, GlobalConfig.jifengTiaoyueLg.st101119);
	}
	open(...param: any[]) {
		this.petFetterData = param[0];
		this.setData();
		this.addViewEvent();
	}
	close() {
		this.release();
	}
	public release() {
	}
	private addViewEvent() {
	}
	private setData() {
		let petModel = PetModel.getInstance;
		let config = GlobalConfig.ins("PetFettersConfig");
		let petFetterData = this.petFetterData;
		let config2 = config[petFetterData.id];
		let nextPetFetterData: any;
		let petList = petFetterData.pack;
		for (let key in config2) {
			let config3 = config2[key];
			if (config3[0].type == petFetterData.type) {
				for (var i = 0; i < config3.length; i++) {
					if (config3[i].level == petFetterData.level + 1) {
						nextPetFetterData = config3[i];
						break;
					}
				}
				break;
			}
		}
		let petStar: number = 0;
		for (var i = 0; i < petList.length; i++) {
			let petData: PetData = petModel.petDic.get(petList[i]);
			if (petData) {
				petStar += petData.star;
			}
		}
		this.m_AllStarLab.text = "X" + petStar + "";
		AttributeData.setAttrGroup(petFetterData.attr, this.m_NowArttrGroup);
		if (nextPetFetterData) {
			AttributeData.setAttrGroup(nextPetFetterData.attr, this.m_NextAttrGroup);
			this.m_NextGroup.visible = true;
			this.m_LVMAXLab.visible = false;
			this.m_LVUPTips.text = LanguageString.jifengTiaoyueCh(GlobalConfig.jifengTiaoyueLg.st101918,[nextPetFetterData.condition])
		} else {
			this.m_NextGroup.visible = false;
			this.m_LVMAXLab.visible = true;
		}

	}
	private onClickClose() {
		ViewManager.ins().close(this);
	}
}

ViewManager.ins().reg(PetFetterWin, LayerManager.UI_Popup);
window["PetFetterWin"] = PetFetterWin