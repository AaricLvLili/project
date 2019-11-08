class GadPanel extends BaseView implements ICommonWindowTitle, ICommonWindowRoleSelect {
	windowTitleIconName?: string;
	m_RoleSelectPanel: RoleSelectPanel
	public m_GetItem: eui.Label;
	public constructor(data?: any) {
		super();
		this.name = GlobalConfig.jifengTiaoyueLg.st100305;
		this.windowTitleIconName = GlobalConfig.jifengTiaoyueLg.st100305;
		this.skinName = "GadPanelSkin";
		this.touchEnabled = false;
		this.m_GetItem.text = GlobalConfig.jifengTiaoyueLg.st100418;
		UIHelper.SetLinkStyleLabel(this.m_GetItem);
	}
	public m_Power: PowerLabel;

	public m_GadItemGroup: eui.Group;
	public m_GadShowItem1: GadShowItem;
	public m_GadShowItem2: GadShowItem;
	public m_GadShowItem3: GadShowItem;
	public m_GadShowItem4: GadShowItem;
	public m_GadShowItem5: GadShowItem;
	public m_GadShowItem6: GadShowItem;
	public m_AttrGroup: eui.Group;
	public m_ArrImg: eui.Image;
	// public m_ActivateTitle: eui.Label;

	public m_PowerGroup: eui.Group;
	public m_GadBagBtn: eui.Image;

	public m_RedPointGroup: eui.Group;
	public m_RedPoint1: eui.Image;
	public m_RedPoint2: eui.Image;
	public m_RedPoint3: eui.Image;
	public m_RedPoint4: eui.Image;
	public m_RedPoint5: eui.Image;
	public m_RedPoint6: eui.Image;

	public m_Lan2: eui.Label;
	public m_Lan1: eui.Label;
	public m_ContLab1: eui.Label;
	public m_ContLab2: eui.Label;
	public m_ContLab3: eui.Label;

	public m_RightArrImg: eui.Image;
	public m_LeftArrImg: eui.Image;
	private attrState: number = 0;

	protected childrenCreated() {
		super.childrenCreated();
		this.m_Lan1.text = GlobalConfig.jifengTiaoyueLg.st100307;
		this.m_Lan2.text = GlobalConfig.jifengTiaoyueLg.st100308;
	};
	private addViewEvent() {
		this.observe(GadEvent.GAD_DATAUPDATE_MSG, this.initData);
		this.observe(GadEvent.GAD_GUIDE_MSG, this.checkNextGuide);
		this.observe(GadEvent.GAD_LVUP_MSG, this.initData);
		this.AddClick(this.m_GadBagBtn, this.onClick);
		this.AddClick(this.m_GetItem, this.onClickGetLab1);
		this.AddClick(this.m_RightArrImg, this.onClickAttr);
		this.AddClick(this.m_LeftArrImg, this.onClickAttr);
	}
	private removeEvent() {
	}

	public open() {
		this.addViewEvent();
	};
	public close() {
		this.removeEvent();
	};

	public release() {
		this.removeEvent();
	}
	private initData() {
		let gadModel = GadModel.getInstance;
		let curRole = this.m_RoleSelectPanel.getCurRole();
		var role = SubRoles.ins().getSubRoleByIndex(curRole);
		let gadRoleData: Dictionary<GadData> = gadModel.gadDic.get(role.roleID);
		gadModel.nowSelectRoleId = role.roleID;
		if (gadRoleData) {
			let attr: any[] = [];
			for (var i = 0; i < 6; i++) {
				let slot = i + 1;
				let child = this["m_GadShowItem" + (slot)];
				if (child && child instanceof GadShowItem) {
					let gadData: GadData = gadRoleData.get(slot);
					child.setData(gadData, slot);
					attr.push(gadData.attr);
					let bg: eui.Image = this["m_Bg" + (slot)]
					if (bg) {
						if (gadData && gadData.itemid > 0) {
							let itemConfig = GlobalConfig.ins("ItemConfig")[gadData.itemid];
							if (itemConfig) {
								bg.source = "wz_bg_85_100_0" + itemConfig.quality + "_png";
							}
							else {
								bg.source = "comp_86_100_1_png";
							}
						} else {
							bg.source = "comp_86_100_1_png";
						}
					}
				}
				let gadAttr = AttributeData.getAttr(attr);
				this.checkAttrState(gadAttr);
				let power = Math.floor(UserBag.getAttrPower(gadAttr));
				this.m_Power.text = power;
				let nextAttr = gadAttr.splice(8, gadAttr.length);
				if (this.attrState == 0) {
					AttributeData.setAttrGroup(gadAttr, this.m_AttrGroup);
				} else {
					AttributeData.setAttrGroup(nextAttr, this.m_AttrGroup);
				}


				let suitDatas: { type: number, haveNum: number, quality: number, id: number, weight: number }[] = gadModel.getShowSuitByRole(role.roleID);
				this.setShowSuitData(suitDatas[0], this.m_ContLab1);
				this.setShowSuitData(suitDatas[1], this.m_ContLab2);
				this.setShowSuitData(suitDatas[2], this.m_ContLab3);
			}
			this.checkRedPoint();
			this.checkGuide();
		}
	}
	private onClickAttr(e: egret.TouchEvent) {
		switch (e.currentTarget) {
			case this.m_RightArrImg:
				this.attrState = 1;
				break;
			case this.m_LeftArrImg:
				this.attrState = 0;
				break;
		}
		this.changeShowAttr()
	}

	private changeShowAttr() {
		let gadModel = GadModel.getInstance;
		let curRole = this.m_RoleSelectPanel.getCurRole();
		var role = SubRoles.ins().getSubRoleByIndex(curRole);
		let gadRoleData: Dictionary<GadData> = gadModel.gadDic.get(role.roleID);
		if (gadRoleData) {
			let attr: any[] = [];
			for (var i = 0; i < 6; i++) {
				let slot = i + 1;
				let gadData: GadData = gadRoleData.get(slot);
				attr.push(gadData.attr);
				let gadAttr = AttributeData.getAttr(attr);
				this.checkAttrState(gadAttr);
				let nextAttr = gadAttr.splice(8, gadAttr.length);
				if (this.attrState == 0) {
					AttributeData.setAttrGroup(gadAttr, this.m_AttrGroup);
				} else {
					AttributeData.setAttrGroup(nextAttr, this.m_AttrGroup);
				}
			}
		}
	}

	private checkAttrState(attr: any[]) {
		this.m_LeftArrImg.visible = false;
		this.m_RightArrImg.visible = false;
		if (attr.length <= 8) {
			return;
		}
		if (this.attrState == 0 && attr.length > 8) {
			this.m_RightArrImg.visible = true
		} else if (this.attrState == 1 && attr.length > 8) {
			this.m_LeftArrImg.visible = true
		}
	}

	private setShowSuitData(suitData: { type: number, haveNum: number, quality: number, id: number, weight: number }, label: eui.Label) {
		if (suitData) {
			let coasuitConfig = GlobalConfig.ins("COAsuitConfig")[suitData.type];
			if (coasuitConfig) {
				let needConfig: any;
				let i;
				for (let key in coasuitConfig) {
					if (coasuitConfig[key].Requirement <= suitData.haveNum) {
						needConfig = coasuitConfig[key];
					}
					if (!i) {
						i = key;
					}
				}
				if (!needConfig) {
					label.textColor = Color.Gray;
					needConfig = coasuitConfig[i];
				} else {
					label.textColor = Color.Green;
				}
				label.text = needConfig.mainname + "(" + suitData.haveNum + "/" + needConfig.Requirement + ")     " + needConfig.name
			}
		} else {
			label.text = "";
		}
	}
	UpdateContent(): void {
		this.initData();
	}

	private onClick() {
		ViewManager.ins().open(BagWin, 2);
	}

	private checkRedPoint() {
		let gadModel = GadModel.getInstance;
		let curRole = this.m_RoleSelectPanel.getCurRole();
		var role = SubRoles.ins().getSubRoleByIndex(curRole);
		for (var i = 0; i < this.m_RedPointGroup.numChildren; i++) {
			let child = this.m_RedPointGroup.getChildAt(i);
			if (child && child instanceof eui.Image) {
				child.visible = false;
				let isCanLvUp: boolean = gadModel.checkIsCanLvUp(role.roleID, i + 1);
				if (isCanLvUp) {
					child.visible = true;
					continue;
				}
				let isCanChangeItem: boolean = gadModel.checkIsCanChangeItem(role.roleID, i + 1);
				if (isCanChangeItem) {
					child.visible = true;
					continue;
				}
			}
		}
	}

	private checkGuide() {
		if (Setting.currPart == 20 && Setting.currStep == 2) {
			GuideUtils.ins().show(this.m_GadShowItem1, 20, 2);
			this.m_GadShowItem1.addEventListener(egret.TouchEvent.TOUCH_TAP, this.nextGuide, this, true, 10);
		}
	}

	private checkNextGuide() {
		if (Setting.currPart == 20 && Setting.currStep == 4) {
			GuideUtils.ins().show(this.m_GadShowItem1, 20, 4);
			this.m_GadShowItem1.addEventListener(egret.TouchEvent.TOUCH_TAP, this.nextGuide, this, true, 10);
		}
	}

	private nextGuide() {
		GuideUtils.ins().next(this.m_GadShowItem1);
		this.m_GadShowItem1.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.nextGuide, this, true);
	}

	private onClickGetLab1() {
		UserWarn.ins().setBuyGoodsWarn(400127);
	}

}
window["GadPanel"] = GadPanel