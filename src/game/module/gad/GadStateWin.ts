class GadStateWin extends BaseEuiPanel {
	public constructor() {
		super()
		this.skinName = "GadStateWinSkin";
	}

	public m_MainStateGroup: eui.Group;
	public m_StateGroup: eui.Group;
	public m_LvUpBtn: eui.Button;
	public m_ChangeBtn: eui.Button;
	public m_GadItem: GadItem;
	public m_NameLab: eui.Label;
	public m_ScoreLab: eui.Label;
	public m_PointLab: eui.Label;
	public m_ActivateTitle: eui.Label;
	// public m_ContLab: eui.Label;

	private gadData: GadData | GadBagData;

	public m_LvUpRedPoint: eui.Image;
	public m_ItemChangeRedPoint: eui.Image;
	public m_Title1: eui.Label;
	public m_ContLab1: eui.Label;
	public m_Title2: eui.Label;
	public m_ContLab2: eui.Label;
	public m_Title3: eui.Label;
	public m_ContLab3: eui.Label;
	public m_DataGroup: eui.Group;


	initUI() {
		super.initUI();
		this.m_ChangeBtn.label = GlobalConfig.jifengTiaoyueLg.st100318;
		this.m_LvUpBtn.label = GlobalConfig.jifengTiaoyueLg.st100317;
		this.m_bg.init(`GadStateWin`, GlobalConfig.jifengTiaoyueLg.st100319);
	}
	open(...param: any[]) {
		this.gadData = param[0];
		this.addViewEvent();
		this.setData();
	}
	close() {
		this.release();
	}
	public release() {
		this.removeViewEvent();
	}
	private addViewEvent() {
		this.AddClick(this.m_LvUpBtn, this.onClickLvUpBtn);
		this.AddClick(this.m_ChangeBtn, this.onClickChange);
	}
	private removeViewEvent() {
	}
	private setData() {
		this.m_LvUpBtn.visible = true;
		this.m_ChangeBtn.visible = true;
		this.m_LvUpRedPoint.visible = false;
		this.m_ItemChangeRedPoint.visible = false;
		let gadModel = GadModel.getInstance;
		let gadData = this.gadData;
		AttributeData.setAttrGroup(gadData.mainAttr, this.m_MainStateGroup, 18, Color.Red);
		AttributeData.setAttrGroup(gadData.lotAttr, this.m_StateGroup);
		this.m_GadItem.setData(gadData, false);
		this.m_NameLab.text = gadData.itemConfig.name + " +" + gadData.level;
		this.m_PointLab.text = GlobalConfig.jifengTiaoyueLg.st100315 + gadData.slot;
		let suitData: { type: number, haveNum: number };
		if (gadData instanceof GadData) {
			suitData = gadModel.getSuitNum(gadData.roleId, gadData.suit);
			this.setShowSuitData(suitData);
			this.checkIsCanChangeItem(gadData);
			this.checkIsCanLvUp(gadData);
		} else {
			suitData = { type: gadData.suit, haveNum: 0 };
			this.setShowSuitData(suitData);
			this.m_LvUpBtn.visible = false;
			this.m_ChangeBtn.visible = false;
		}

		let power = Math.floor(UserBag.getAttrPower(gadData.attr));
		this.m_ScoreLab.textFlow = <Array<egret.ITextElement>>[{ text: GlobalConfig.jifengTiaoyueLg.st100316, style: { "textColor": 0x535557 } }, { text: power.toString(), style: { "textColor": 0xFFBF26 } }];
		this.checkGuide();
	}
	private setShowSuitData(suitData: { type: number, haveNum: number }) {
		if (suitData) {
			this.m_DataGroup.visible = true;
			let coasuitConfig = GlobalConfig.ins("COAsuitConfig")[suitData.type];
			if (coasuitConfig) {
				let needNum = 0;
				let i = 0;
				let maxkey;
				for (let key in coasuitConfig) {
					if (coasuitConfig[key].Requirement <= suitData.haveNum) {
						needNum = i + 1;
					}
					let lab = this["m_ContLab" + (i + 1)];
					lab.text = coasuitConfig[key].name;
					lab.textColor = Color.Gray;
					let lab2 = this["m_Title" + (i + 1)];
					lab2.text = coasuitConfig[key].mainname + "(" + suitData.haveNum + "/" + coasuitConfig[key].Requirement + ")";
					lab2.textColor = Color.Gray;
					i++;
					maxkey = key;
				}
				if (!needNum) {
					needNum = 1;
				} else {
					let showLab = this["m_ContLab" + needNum];
					showLab.textColor = Color.Green;
					let showLab2 = this["m_Title" + needNum];
					showLab2.textColor = Color.Green;
				}
				this.m_ActivateTitle.text = coasuitConfig[maxkey].mainname + GlobalConfig.jifengTiaoyueLg.st101966 + "(" + suitData.haveNum + "/" + coasuitConfig[maxkey].Requirement + ")";
			} else {
				this.m_DataGroup.visible = false;
				this.m_ActivateTitle.text = "";
			}
		} else {
			this.m_DataGroup.visible = false;
			this.m_ActivateTitle.text = "";
		}
	}
	private onClickClose() {
		ViewManager.ins().close(this);
	}

	private onClickLvUpBtn() {
		ViewManager.ins().open(GadLvUpWin, this.gadData);
		this.onClickClose();
	}

	private onClickChange() {
		ViewManager.ins().open(GadSelectWin, this.gadData);
		this.onClickClose();
	}

	public checkIsCanLvUp(gadData: GadData) {
		let gadModel = GadModel.getInstance;
		let isCanLvUp: boolean = gadModel.checkIsCanLvUp(gadData.roleId, gadData.slot);
		if (isCanLvUp) {
			this.m_LvUpRedPoint.visible = true;
		} else {
			this.m_LvUpRedPoint.visible = false;
		}
	}

	public checkIsCanChangeItem(gadData: GadData) {
		let gadModel = GadModel.getInstance;
		let isChangeItem: boolean = gadModel.checkIsCanChangeItem(gadData.roleId, gadData.slot);
		if (isChangeItem) {
			this.m_ItemChangeRedPoint.visible = true;
		} else {
			this.m_ItemChangeRedPoint.visible = false;
		}
	}

	private checkGuide() {
		if (Setting.currPart == 20 && Setting.currStep == 5) {
			GuideUtils.ins().show(this.m_LvUpBtn, 20, 5);
			this.m_LvUpBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.nextGuide, this, true, 10);
		}
	}

	private nextGuide() {
		GuideUtils.ins().next(this.m_LvUpBtn);
		this.m_LvUpBtn.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.nextGuide, this, true);
	}

}
ViewManager.ins().reg(GadStateWin, LayerManager.UI_Popup);
window["GadStateWin"] = GadStateWin