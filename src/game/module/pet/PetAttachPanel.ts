class PetAttachPanel extends BaseView implements ICommonWindowTitle, ICommonWindowRoleSelect {
	windowTitleIconName?: string;
	m_RoleSelectPanel: RoleSelectPanel
	public constructor(data?: any) {
		super();
		this.name = GlobalConfig.jifengTiaoyueLg.st101090;
		this.windowTitleIconName = GlobalConfig.jifengTiaoyueLg.st101090;
		this.skinName = "PetAttachPanelSkin";
		this.touchEnabled = false;
	}
	public m_AttrGroup: eui.Group;
	public m_NoActivate: eui.Image;
	public m_MainBtn: eui.Button;
	public m_Scroller: eui.Scroller;
	public m_List: eui.List;
	private m_ListData: eui.ArrayCollection;
	private petId: number;

	public m_NeedLab: eui.Label;
	public m_NeedItemGroup: eui.Group;
	public m_ItemNum: eui.Label;
	public m_ItemImg: eui.Image;
	public m_MainAttrGroup: eui.Group;
	public m_NoAddLab: eui.Label;
	private m_tipsTxt: eui.Label

	public getItem: eui.Label;

	private getItemId: number;
	public m_Lan1: eui.Label;
	public m_Lan2: eui.Label;


	protected childrenCreated() {
		super.childrenCreated();
		this.m_List.itemRenderer = PetAttachIconItem;
		this.m_ListData = new eui.ArrayCollection();
		this.m_List.dataProvider = this.m_ListData;
		this.getItem.text = GlobalConfig.jifengTiaoyueLg.st100418;
		UIHelper.SetLinkStyleLabel(this.getItem);
		this.m_NoAddLab.text = GlobalConfig.jifengTiaoyueLg.st101156;
		this.m_Lan1.text = GlobalConfig.jifengTiaoyueLg.st101157;
		this.m_Lan2.text = GlobalConfig.jifengTiaoyueLg.st100218;
		this.m_NeedLab.text = GlobalConfig.jifengTiaoyueLg.st101158;
		this.m_MainBtn.label = GlobalConfig.jifengTiaoyueLg.st101155;

	};
	private addViewEvent() {
		this.observe(PetEvt.PET_ATTACH_MSG, this.initData);
		this.observe(MessageDef.BAG_HAS_ITEM_CAN_USE, this.initData);
		this.AddClick(this.m_MainBtn, this.onClickMainBtn);
		this.AddClick(this.getItem, this.onClickGetLab1);
	}
	private removeEvent() {
	}
	public open() {
		this.m_Scroller.stopAnimation();
		if (this.m_Scroller && this.m_Scroller.viewport) {
			this.m_Scroller.viewport.scrollV = 0;
		}
		this.addViewEvent();
		this.m_RoleSelectPanel.y = 130;
		this.initData();
	};
	public close() {
		this.removeEvent();
		this.m_RoleSelectPanel.y = 158;
	};

	public release() {
		DisplayUtils.dispose(this.m_NewEff);
		this.m_NewEff = null;
		DisplayUtils.dispose(this.m_ItemEff);
		this.m_ItemEff = null;
		DisplayUtils.dispose(this.m_SkillEff);
		this.m_SkillEff = null;
		this.removeEvent();
	}

	private onClickGetLab1() {
		if (this.getItemId) {
			UserWarn.ins().setBuyGoodsWarn(this.getItemId);
		}
	}

	private itemNum: number;
	private needItemNum: number;
	private needType: number;
	private initData() {
		let petModel: PetModel = PetModel.getInstance;
		let curRole = this.m_RoleSelectPanel.getCurRole();
		var role = SubRoles.ins().getSubRoleByIndex(curRole);
		let data: Sproto.pet_attch_data = petModel.petAttachData.get(role.roleID);
		petModel.attachSelectRoleId = role.roleID;
		this.m_NeedLab.visible = false;
		this.m_NeedItemGroup.visible = false;
		this.getItem.visible = false;
		this.m_MainBtn.visible = false;
		this.m_MainAttrGroup.visible = false;
		this.m_NoAddLab.visible = false;
		this.m_NoActivate.visible = false;
		if (data) {
			let newPetId = [];
			for (var i = 0; i < data.petid.length; i++) {
				newPetId.push(data.petid[i]);
			}
			this.m_ListData.replaceAll(newPetId);
			let petId = data.petid[petModel.attachSelectIndex];
			this.petId = petId;
			let petAdhereConfig = GlobalConfig.ins("PetAdhereConfig")[role.roleID + 1];
			let dicConfigData = petAdhereConfig[petModel.attachSelectIndex];
			this.m_tipsTxt.text = LanguageString.jifengTiaoyueCh(GlobalConfig.jifengTiaoyueLg.st101152, [dicConfigData.valuePercent * 100]);
			if (petId < 0) {
				this.m_NoActivate.visible = true;
				this.m_MainBtn.label = GlobalConfig.jifengTiaoyueLg.st101153;
				//let petAdhereConfig = GlobalConfig.ins("PetAdhereConfig")[role.roleID + 1];
				if (petAdhereConfig) {
					//let dicConfigData = petAdhereConfig[petModel.attachSelectIndex];
					if (dicConfigData) {
						this.needType = dicConfigData.conditionkind;
						if (dicConfigData.conditionkind == 7) {
							this.m_NeedItemGroup.visible = true;
							this.getItem.visible = true;
							this.m_MainBtn.visible = true;
							let itemConfig = GlobalConfig.ins("ItemConfig")[dicConfigData.conditionnum.id];
							this.getItemId = dicConfigData.conditionnum.id;
							if (itemConfig) {
								this.m_ItemImg.source = itemConfig.icon + "_png";
							}
							let itemNum = UserBag.ins().getBagGoodsCountById(0, dicConfigData.conditionnum.id);
							this.m_ItemNum.text = itemNum + "/" + dicConfigData.conditionnum.count;
							this.itemNum = itemNum;
							this.needItemNum = dicConfigData.conditionnum.count;
						} else if (dicConfigData.conditionkind == 2) {
							this.m_NeedLab.visible = true;
							let str: string = dicConfigData.tips;
							let arr: string[] = str.split("%s", 2);
							let setStr: string;
							if (dicConfigData.conditionnum >= 1000) {
								setStr = (dicConfigData.conditionnum / 1000) + GlobalConfig.jifengTiaoyueLg.st100067;
							} else {
								setStr = dicConfigData.conditionnum + GlobalConfig.jifengTiaoyueLg.st100093;
							}
							this.m_NeedLab.text = arr[0] + setStr + arr[1];
						} else {
							this.m_NeedLab.visible = true;
							let str: string = dicConfigData.tips;
							let arr: string[] = str.split("%s", 2);
							this.m_NeedLab.text = arr[0] + dicConfigData.conditionnum + arr[1];
						}
					}
				}
			} else if (petId == 0) {
				this.m_NoAddLab.visible = true;
				this.m_MainBtn.label = GlobalConfig.jifengTiaoyueLg.st101154;
				this.m_MainBtn.visible = true;
			} else {
				this.m_MainAttrGroup.visible = true;
				this.m_MainBtn.label = GlobalConfig.jifengTiaoyueLg.st100318;
				this.m_MainBtn.visible = true;

			}
			let petData = PetModel.getInstance.petDic.get(petId);
			let attNewData = [];
			if (petData) {
				for (var f = 0; f < petData.attr.length; f++) {
					let newData = { type: petData.attr[f].type, value: Math.floor(petData.attr[f].value * dicConfigData.valuePercent) }
					attNewData.push(newData);
				}
				AttributeData.setAttrGroup(attNewData, this.m_AttrGroup);
			}
			// let allAttachDic: Dictionary<Sproto.attribute_data> = new Dictionary<Sproto.attribute_data>();
			// for (var i = 0; i < data.petid.length; i++) {
			// 	if (data.petid[i] > 0) {
			// 		let petData: PetData = petModel.petDic.get(data.petid[i]);
			// 		if (petData) {
			// 			for (var f = 0; f < petData.attr.length; f++) {
			// 				let attachAttrData = allAttachDic.get(petData.attr[f].type)
			// 				if (attachAttrData) {
			// 					attachAttrData.value += petData.attr[f].value;
			// 				} else {
			// 					let newAttachAttrData = new Sproto.attribute_data();
			// 					newAttachAttrData.type = petData.attr[f].type;
			// 					newAttachAttrData.value = petData.attr[f].value;
			// 					allAttachDic.set(petData.attr[f].type, newAttachAttrData);
			// 				}
			// 			}
			// 		}
			// 	}
			// }
			// if (allAttachDic.values.length > 0) {
			// AttributeData.setAttrGroup(allAttachDic.values, this.m_AttrGroup);
			// }
		}
		this.setRoleRedPoint();
	}

	private setRoleRedPoint() {
		let petModel: PetModel = PetModel.getInstance;
		let curRole = this.m_RoleSelectPanel.getCurRole();
		var roleList = SubRoles.ins().rolesModel;
		for (var i = 0; i < roleList.length; i++) {
			let role: Role = roleList[i]
			this.m_RoleSelectPanel.showRedPoint(role.roleID, petModel.checkRoleAttactRedPoint(role.roleID));
		}
	}
	UpdateContent(): void {
		this.initData();
	}
	private onClickMainBtn() {
		let petModel: PetModel = PetModel.getInstance;
		if (this.petId < 0) {
			if (this.needType == 7) {
				if (this.itemNum >= this.needItemNum) {
					let curRole = this.m_RoleSelectPanel.getCurRole();
					var role = SubRoles.ins().getSubRoleByIndex(curRole);
					PetSproto.ins().sendPetAttachUnlock(role.roleID, petModel.attachSelectIndex + 1);
					this.playUpEff();
				} else {
					UserTips.ins().showTips(GlobalConfig.jifengTiaoyueLg.st100217);
				}
			}
		} else {
			let curRole = this.m_RoleSelectPanel.getCurRole();
			petModel.attachSelectRoleId = curRole;
			ViewManager.ins().open(PetAttachWin);
		}
	}


	public m_EffGroup: eui.Group;
	public m_ItemEffGroup: eui.Group;
	private m_ItemEff: MovieClip;
	private m_NewEff: MovieClip;
	public m_SkillEff: MovieClip;
	public m_MianEffGroup: eui.Group;
	public m_EffGroup1: eui.Group;
	public m_EffGroup0: eui.Group;
	public m_EffGroup2: eui.Group;
	public m_EffGroup3: eui.Group;
	public m_EffGroup4: eui.Group;
	public m_EffGroup5: eui.Group;
	public m_EffGroup6: eui.Group;
	public m_EffGroup7: eui.Group;
	public playUpEff() {
		let child = this.m_MianEffGroup.getChildAt(PetModel.getInstance.attachSelectIndex);
		if (child && child instanceof eui.Group) {
			this.m_SkillEff = ViewManager.ins().createEff(this.m_SkillEff, child, "eff_ui_iconUpgrade");
		}
		this.m_ItemEff = ViewManager.ins().createEff(this.m_ItemEff, this.m_ItemEffGroup, "eff_ui_icon");
		this.m_NewEff = ViewManager.ins().createEff(this.m_NewEff, this.m_EffGroup, "eff_ui_success");

	}




}
window["PetAttachPanel"] = PetAttachPanel