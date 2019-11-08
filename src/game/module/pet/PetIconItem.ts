class PetIconItem extends eui.ItemRenderer {
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

	private addEvent() {
		this.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onClick, this);
	}

	public dataChanged() {
		super.dataChanged();
		let data: PetData = this.data;
		let petModel: PetModel = PetModel.getInstance;
		let petConfig = GlobalConfig.ins("PetConfig");
		let configData = petConfig[data.petid];
		if (data.name) {
			this.m_Name.text = data.name;
		} else {
			this.m_Name.text = configData.name;
		}
		this.m_IconBase.setData(data.petid, data.level);
		if (data.petid == petModel.selectIndex) {
			this.m_SelectImg.visible = true;
		} else {
			this.m_SelectImg.visible = false;
		}
		if (data.isFight || data.inRoleId >= 0) {
			this.m_FightImg.visible = true;
			if (data.isFight) {
				if (data.isBeiZhan) {
					this.m_FightImg.source = `comp_46_37_02_png`;
				} else {
					this.m_FightImg.source = `comp_46_37_01_png`;
				}
			} else {
				this.m_FightImg.source = `comp_46_37_03_png`;
			}
		} else {
			this.m_FightImg.visible = false;
		}
		if (data.isActivate) {
			this.m_IconBase.m_Mask.visible = false;
		} else {
			this.m_IconBase.m_Mask.visible = true;
		}
		this.checkRedPoint();
		this.checkGuide();
	}

	private onClick() {
		let petModel: PetModel = PetModel.getInstance;
		// petModel.selectIndex = this.itemIndex;
		let data: PetData = this.data;
		petModel.selectIndex = data.petid;
		GameGlobal.MessageCenter.dispatch(PetEvt.PET_DATAUPDATE_MSG);
	}

	public checkRedPoint() {
		let data: PetData = this.data;
		/**名字在皮肤里 */
		if (data && this.parent && this.parent.name == "state") {
			if (data.isCanActivate || data.isCanLvUp || data.isCanStarUp||data.isCanAwakening) {
				this.m_RedPoint.visible = true;
				return;
			}
		}
		if (data && this.parent && this.parent.name == "skill") {
			if (data.isCanSkillUp || data.isCanSkillChange) {
				this.m_RedPoint.visible = true;
				return;
			}
		}
		this.m_RedPoint.visible = false;
	}
	/**检查引导相关的执行操作 */
	private checkGuide() {
		let data: PetData = this.data;
		let petModel: PetModel = PetModel.getInstance;
		if (data.petid == petModel.guidePeiId && UserFb.ins().guanqiaID == GuideQuanQiaType.PET) {
			petModel.guidePeiIdIndex = this.itemIndex;
			let isGuide = petModel.checkGuideFirstPet();
			if (isGuide && petModel.selectIndex != data.petid && PetWin.isSaveGuide == true) {
				PetWin.isSaveGuide = false;
				this.onClick();
				return;
			} else if (petModel.checkGuideFirstPet() && !GuideLocalStorage.checkIdIsCompele(17) && petModel.selectIndex != data.petid && PetWin.isSaveGuide == true) {
				PetWin.isSaveGuide = false;
				this.onClick();
				return;
			}
		}
		if (data.petid == petModel.guidePeiId && petModel.checkGuideStar() && petModel.selectIndex != data.petid && PetWin.isSaveGuide == true) {
			PetWin.isSaveGuide = false;
			this.onClick();
			return;
		}
	}



}
window["PetIconItem"] = PetIconItem