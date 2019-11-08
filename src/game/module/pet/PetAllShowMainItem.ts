class PetAllShowMainItem extends eui.ItemRenderer {
	public constructor() {
		super();
	}
	public m_Activate: eui.Image;
	public m_AttrGroup: eui.Group;
	public m_Scroller: eui.Scroller;
	public m_List: eui.List;
	public m_PetTipsLab: eui.Label;
	public m_LookBtn: eui.Button;

	private listData: eui.ArrayCollection;

	private m_PetAllShowData: any;
	public m_Lan1: eui.Label;

	public createChildren() {
		super.createChildren();
		this.m_List.itemRenderer = PetAllShowItem;
		this.listData = new eui.ArrayCollection();
		this.m_List.dataProvider = this.listData;
		this.addViewEvent();
		this.m_Lan1.text = GlobalConfig.jifengTiaoyueLg.st101118;
		this.m_LookBtn.label = GlobalConfig.jifengTiaoyueLg.st101119;
	}

	private addViewEvent() {
		this.m_LookBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onClickLook, this);
	}
	public dataChanged() {
		super.dataChanged();
		this.m_Activate.visible = false;
		this.m_LookBtn.visible = false;
		this.m_PetTipsLab.visible = false;
		let petModel = PetModel.getInstance;
		let data: number = this.data;
		let config = GlobalConfig.ins("PetFettersConfig")[PetModel.getInstance.petAllShowIndex + 1][data];
		let keyList = [];
		for (let key in config) {
			keyList.push(parseInt(key));
		}
		let petFettersConfig = config[keyList[0]];
		if (petFettersConfig) {
			let petIdList = [];
			for (var i = 0; i < petFettersConfig.pack.length; i++) {
				petIdList.push(petFettersConfig.pack[i]);
			}
			this.listData.replaceAll(petIdList);
			let isActivate: boolean = true;
			let petAllStar = 0;
			for (var i = 0; i < petFettersConfig.pack.length; i++) {
				let petData: PetData = petModel.petDic.get(petFettersConfig.pack[i]);
				if (petData.isActivate == false) {
					isActivate = false;
				}
				petAllStar = petData.star + petAllStar;
			}

			let starConfig: any;
			for (var i = 0; i < config.length; i++) {
				let checkStarConfig = config[keyList[i]];
				if (petAllStar < checkStarConfig.condition) {
					starConfig = config[keyList[i - 1]];
					this.m_PetTipsLab.visible = true;
					this.m_PetTipsLab.text = LanguageString.jifengTiaoyueCh(GlobalConfig.jifengTiaoyueLg.st101120, [checkStarConfig.condition]);
					this.m_PetTipsLab.textColor = Color.Green;
					break;
				}
			}
			if (!starConfig) {
				this.m_PetTipsLab.visible = true;
				this.m_PetTipsLab.text = GlobalConfig.jifengTiaoyueLg.st101121;
				this.m_PetTipsLab.textColor = Color.FontColor;
				starConfig = config[keyList[keyList.length - 1]];
			}
			this.m_PetAllShowData = starConfig;
			if (isActivate == false) {
				this.m_PetTipsLab.visible = true;
				this.m_PetTipsLab.text = LanguageString.jifengTiaoyueCh(GlobalConfig.jifengTiaoyueLg.st101122, [petIdList.length]);
				this.m_PetTipsLab.textColor = Color.Red;
				this.m_Activate.visible = true;
				AttributeData.setAttrGroup(config[0].attr, this.m_AttrGroup);
			} else {
				this.m_LookBtn.visible = true;
				AttributeData.setAttrGroup(starConfig.attr, this.m_AttrGroup);
			}
		}
	}
	private onClickLook() {
		ViewManager.ins().open(PetFetterWin, this.m_PetAllShowData);
	}
}
window["PetAllShowMainItem"] = PetAllShowMainItem