class PetSkillPanel extends BaseView implements ICommonWindowTitle {
	windowTitleIconName?: string;
	public constructor(data?: any) {
		super();
		this.name = GlobalConfig.jifengTiaoyueLg.st101137;
		this.windowTitleIconName = GlobalConfig.jifengTiaoyueLg.st101137;
		this.skinName = "PetSkillPanelSkin";
		this.touchEnabled = false;
	}
	public m_Scroller: eui.Scroller;
	public m_List: eui.List;
	windowCommonBg = "pic_bj_20_png"
	public m_RightBtn: eui.Button;
	public m_RightBtnRedPoint: eui.Image;
	public m_LeftBtn: eui.Button;
	public m_LeftBtnRedPoint: eui.Image;
	public m_PetAnim: PetAnim;
	public m_PetStateBtn: eui.Image;
	public m_ScrollerSkill: eui.Scroller;
	public m_ListSkill: eui.List;
	public m_SkillChangBtn: eui.Button;
	private m_ListData: eui.ArrayCollection;
	private m_ListSkillData: eui.ArrayCollection;
	private m_PetMainSkill: PetSkillItem;
	private m_PetMainSkillCont: eui.Label;
	public m_MainSkillGroup: eui.Group;
	public m_SkillBtnRedPoint: eui.Image;
	public m_SkillChangeRedPoint: eui.Image;
	public m_PetSmeltBtn: eui.Button;
	public m_PetAllShowBtn: eui.Button;

	private isShowRedPoint: boolean = true;
	public m_Lan1: eui.Label;

	protected childrenCreated() {
		super.childrenCreated();
		this.m_List.itemRenderer = PetIconItem;
		this.m_ListData = new eui.ArrayCollection();
		this.m_List.dataProvider = this.m_ListData;

		this.m_ListSkill.itemRenderer = PetSkillIconItem;
		this.m_ListSkillData = new eui.ArrayCollection();
		this.m_ListSkill.dataProvider = this.m_ListSkillData;

		this.m_PetMainSkill.removeEvent();
		MessageCenter.ins().addListener(PetEvt.PET_SKILLCHANG_CLOSE, this.initData, this);
		this.m_Lan1.text = GlobalConfig.jifengTiaoyueLg.st101131;
		this.m_SkillChangBtn.label = GlobalConfig.jifengTiaoyueLg.st101139;
	};
	private addViewEvent() {
		this.m_Scroller.addEventListener(egret.Event.CHANGE, this.onSaveScrData, this);

		this.AddClick(this.m_PetStateBtn, this.onClickState);
		this.AddClick(this.m_SkillChangBtn, this.onClickSkillChange);
		this.AddClick(this.m_MainSkillGroup, this.onClickMainSkill);
		this.AddClick(this.m_PetSmeltBtn, this.onClickSmeltBtn);
		this.AddClick(this.m_PetAllShowBtn, this.onClickAllShowBtn);
		this.AddClick(this.m_LeftBtn, this.onClickLeftBtn);
		this.AddClick(this.m_RightBtn, this.onClickRightBtn);
		this.observe(PetEvt.PET_DATAUPDATE_MSG, this.initData);
		this.observe(MessageDef.BAG_HAS_ITEM_CAN_USE, this.upRedpoint);
	}
	private removeEvent() {
		this.m_Scroller.removeEventListener(egret.Event.CHANGE, this.onSaveScrData, this);
	}
	public open() {
		this.isShowRedPoint = true;
		this.addViewEvent();
		this.initData();
	};
	public close() {
		this.removeEvent();
	};

	public release() {
		this.removeEvent();
		this.m_PetAnim.release();
	}
	private onSaveScrData() {
		if (this.m_Scroller && this.m_Scroller.viewport) {
			PetModel.getInstance.scrollH = this.m_Scroller.viewport.scrollH;
		}
		this.setListRedPoint();
	}

	private onClickState() {
		let petModel = PetModel.getInstance;
		let petData = petModel.getNowSelectPetData();
		ViewManager.ins().open(PetStateWin, petData);
	}

	private initData() {
		this.setPetListData();
		this.setPetData();
	}

	private setPetData() {
		let petModel = PetModel.getInstance;
		let petData = petModel.getNowSelectPetData();
		let petConfig = GlobalConfig.ins("PetConfig")[petData.petid];
		if (petData && petConfig) {
			this.m_PetAnim.setPetData(petData.petid);
			let allSkillList = [];
			for (var i = 0; i < petData.bskill.length; i++) {
				let petSkillData = { id: petData.bskill[i], type: 2 };
				allSkillList.push(petSkillData);
			}
			this.m_ListSkillData.replaceAll(allSkillList);
			if (this.m_ScrollerSkill && this.m_ScrollerSkill.viewport) {
				this.m_ScrollerSkill.viewport.scrollH = 0;
			}

			this.m_PetMainSkill.setData(petData.skill, 1);
			let skillsConfig = GlobalConfig.ins("SkillsConfig")[petData.skill];
			if (skillsConfig) {
				this.m_PetMainSkillCont.text = skillsConfig.desc;
			}
			this.upRedpoint();
		}
		this.setListRedPoint();
	}

	private upRedpoint() {
		let petModel = PetModel.getInstance;
		let petData = petModel.getNowSelectPetData();
		if (petData.isCanSkillUp) {
			this.m_SkillBtnRedPoint.visible = true;
		} else {
			this.m_SkillBtnRedPoint.visible = false;
		}
		if (petData.isCanSkillChange && this.isShowRedPoint) {
			this.m_SkillChangeRedPoint.visible = true;
		} else {
			this.m_SkillChangeRedPoint.visible = false;
		}
	}
	private setPetListData() {
		let petModel = PetModel.getInstance;
		// let petDatas: PetData[] = petModel.petDic.values
		let petDatas = petModel.getSoltPetData();
		this.m_ListData.replaceAll(petDatas);
		if (this.m_Scroller && this.m_Scroller.viewport) {
			this.m_Scroller.viewport.scrollH = petModel.scrollH;
		}
	}
	private onClickSkillChange() {
		this.isShowRedPoint = false;
		let petModel = PetModel.getInstance;
		let petData = petModel.getNowSelectPetData();
		if (petData.isActivate) {
			ViewManager.ins().open(PetSkillChangeWin, petData);
		} else {
			UserTips.ins().showTips(GlobalConfig.jifengTiaoyueLg.st101138);
		}
	}
	private onClickMainSkill() {
		let petModel = PetModel.getInstance;
		let petData = petModel.getNowSelectPetData();
		if (petData.isActivate) {
			ViewManager.ins().open(PetSkillMainWin, petData);
		} else {
			UserTips.ins().showTips(GlobalConfig.jifengTiaoyueLg.st101138);
		}
	}
	private onClickSmeltBtn() {
		ViewManager.ins().open(PetDebrisWin, 1);
	}

	private onClickAllShowBtn() {
		ViewManager.ins().open(PetAllShowWin);
	}

	private oneIconWidth: number = 68;
	private setListRedPoint() {
		let oneIconWidth = this.oneIconWidth;
		let petModel = PetModel.getInstance;
		if (petModel.scrollH > oneIconWidth) {
			this.m_LeftBtn.visible = true;
		} else {
			this.m_LeftBtn.visible = false;
		}
		let len = petModel.petDic.values.length;
		if (petModel.scrollH < ((len - 6) * oneIconWidth)) {
			this.m_RightBtn.visible = true;
		} else {
			this.m_RightBtn.visible = false;
		}
		let petDatas = petModel.getSoltPetData();
		let leftLen = Math.ceil(petModel.scrollH / oneIconWidth);
		this.m_LeftBtnRedPoint.visible = false;
		for (var i = 0; i < leftLen; i++) {
			let petData = petDatas[i];
			if (petData) {
				if (petData.isCanSkillUp) {
					this.m_LeftBtnRedPoint.visible = true;
					break;
				}
			}
		}
		let maxWidth = (len - 6) * oneIconWidth;
		this.m_RightBtnRedPoint.visible = false;
		let righeLen = len - Math.floor((maxWidth - petModel.scrollH) / oneIconWidth);
		for (var i = righeLen - 1; i < len; i++) {
			let petData = petDatas[i];
			if (petData) {
				if (petData.isCanSkillUp) {
					this.m_RightBtnRedPoint.visible = true;
					break;
				}
			}
		}
	}
	UpdateContent(): void {

	}
	private onClickLeftBtn() {
		let nowPoint = PetModel.getInstance.scrollH;
		let nextPoibt = nowPoint - (6 * 68);
		if (nextPoibt <= 0) {
			nextPoibt = 0;
		}
		if (this.m_Scroller && this.m_Scroller.viewport) {
			this.m_Scroller.viewport.scrollH = PetModel.getInstance.scrollH = nextPoibt;
		}
	}

	private onClickRightBtn() {
		let petModel = PetModel.getInstance;
		let petDatas = petModel.getSoltPetData();
		let maxWidth = (petDatas.length - 6) * 68 - 6;
		let nowPoint = PetModel.getInstance.scrollH;
		let nextPoibt = nowPoint + (6 * 68);
		if (nextPoibt > maxWidth) {
			nextPoibt = maxWidth;
		}
		if (this.m_Scroller && this.m_Scroller.viewport) {
			this.m_Scroller.viewport.scrollH = PetModel.getInstance.scrollH = nextPoibt;
		}
	}

}
window["PetSkillPanel"] = PetSkillPanel