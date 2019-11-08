class ArtifactPanel extends BaseView implements ICommonWindowTitle {
	windowTitleIconName?: string;
	public constructor(data?: any) {
		super();
		// this.name = GlobalConfig.languageConfig.st100317;
		this.type = data;
		this.name = GlobalConfig.jifengTiaoyueLg.st100409;
		this.windowTitleIconName = GlobalConfig.jifengTiaoyueLg.st100409;
		if (this.type == 2) {
			this.name = GlobalConfig.jifengTiaoyueLg.st102099;
			this.windowTitleIconName = GlobalConfig.jifengTiaoyueLg.st102099;
		}
		this.skinName = "ArtifactPanelSkin";
		this.touchEnabled = false;
	}
	private type: number;
	public m_ArtifactAnim: ArtifactAnim;
	public m_MainBtnGroup: eui.Group;
	public m_UpLvBtn: eui.Button;
	public m_LvUpItemNum0: eui.Label;
	public m_LvUpItemNum2: eui.Label;
	public m_LvUpItemImg0: eui.Image;
	public m_LvUpItemImg2: eui.Image;
	public m_ProActivateGroup: eui.Group;
	public m_MianBtn: eui.Button;
	public m_DebrisGroup: eui.Group;
	public m_NoActivateStateGroup: eui.Group;
	public m_StateGroup: eui.Group;
	public m_LvStateGroup: eui.Group;
	public m_LvLeftAttrGroup: eui.Group;
	public m_LvRightAttrGroup: eui.Group;
	public m_ActivateStateGroup: eui.Group;
	public m_StateGroup1: eui.Group;
	public m_Scroller: eui.Scroller;
	public m_List: eui.List;
	public m_TopArrImg: eui.Image;
	public m_LotArrImg: eui.Image;

	public m_RedPoint0: eui.Image;
	public m_RedPoint1: eui.Image;


	private listData: eui.ArrayCollection;
	public m_NeedItemGroup: eui.Group;
	private m_LvBtnState: number = 1;

	public m_StateTile: eui.Label;
	public m_ArrImg: eui.Image;
	public m_FullLab: eui.Label;


	private needArr: { type: number, id: number, count: number }[] = [];


	public m_GetPetTipsGroup: eui.Group;
	public m_PetNameLab: eui.Label;
	public m_PeTisptLab: eui.Label;



	public m_ArtifactLabGuide: ArtifactDebrisLab;


	public m_ItemEffGroup: eui.Group;
	public m_BodyEffGrouo: eui.Group;
	public m_LvUpEffGroup: eui.Group;
	public m_BodyEffGrouo0: eui.Group;

	public m_NeedLayerLab: eui.Label;
	public getItem: eui.Label;
	private getItemId: number;

	public m_Lan1: eui.Label;
	public m_Lan2: eui.Label;
	public m_Lan3: eui.Label;

	private needList: { type: number, id: number, count: number };/**修改 */
	protected childrenCreated() {
		super.childrenCreated();
		this.m_ArtifactLabGuide.visible = false;
		this.m_ArtifactLabGuide.m_Lab.textColor = 0xfffff;
		this.m_List.itemRenderer = ArtifactIcon;
		this.listData = new eui.ArrayCollection();
		this.m_List.dataProvider = this.listData;
		UIHelper.SetLinkStyleLabel(this.getItem);
		// this.m_FullLab.text = GlobalConfig.languageConfig.st100327;
		this.m_FullLab.text = GlobalConfig.jifengTiaoyueLg.st100422
		this.m_Lan1.text = GlobalConfig.jifengTiaoyueLg.st100414;
		this.m_MianBtn.label = GlobalConfig.jifengTiaoyueLg.st100415;
		this.m_Lan2.text = GlobalConfig.jifengTiaoyueLg.st100416;
		// this.m_StateTile.text = GlobalConfig.languageConfig.st100417;
		this.m_StateTile.text = GlobalConfig.jifengTiaoyueLg.st100421;
		this.getItem.text = GlobalConfig.jifengTiaoyueLg.st100418;
		this.m_Lan3.text = GlobalConfig.jifengTiaoyueLg.st100218
		this.m_GetPetTipsGroup.visible = false;
	}
	private addViewEvent() {
		this.m_Scroller.addEventListener(egret.Event.CHANGE, this.onSaveScrData, this);
		this.observe(ArtifactEvt.ARTIFACT_LVUP_MSG, this.playBodyEff);
		this.observe(ArtifactEvt.ARTIFACT_INIT_MSG, this.initData);
		this.observe(MessageDef.BAG_HAS_ITEM_CAN_USE, this.initData);
		this.AddClick(this.m_UpLvBtn, this.onClickUpBtn);
		this.AddClick(this.m_MianBtn, this.onClickUpBtn);
		this.AddClick(this.m_PetNameLab, this.onClickPet);
		this.AddClick(this.getItem, this.onClickGetLab1);
	}
	private removeEvent() {
		this.m_Scroller.removeEventListener(egret.Event.CHANGE, this.onSaveScrData, this);
	}
	public open() {
		this.addViewEvent();
		this.initData();
		if (this.m_Scroller && this.m_Scroller.viewport) {
			// this.m_Scroller.viewport.scrollV = ArtifactModel.getInstance.scrollV;
		}

	};
	public close() {
		let num = this.m_List.numChildren;
		for (var i = 0; i < num; i++) {
			let child = this.m_List.getChildAt(i);
			if (child && child instanceof ArtifactIcon) {
				child.release();
			}
		}
		this.removeEvent();
	};
	public release() {
		let len = this.m_DebrisGroup.numChildren;
		for (var i = 0; i < len; i++) {
			let child = this.m_DebrisGroup.removeChildAt(0);
			if (child && child instanceof ArtifactDebrisLab) {
				child.release();
			}
		}
		DisplayUtils.dispose(this.m_BodyEff);
		this.m_BodyEff = null;
		DisplayUtils.dispose(this.m_BodyEff0);
		this.m_BodyEff0 = null;
		DisplayUtils.dispose(this.m_UpLvEff);
		this.m_UpLvEff = null;
		DisplayUtils.dispose(this.m_ItemEff);
		this.m_ItemEff = null;
		this.m_ArtifactAnim.release();
		this.removeEvent();
	}

	private onClickGetLab1() {
		UserWarn.ins().setBuyGoodsWarn(this.getItemId);
	}
	private onSaveScrData() {
		if (this.m_Scroller && this.m_Scroller.viewport) {
			ArtifactModel.getInstance.scrollV = this.m_Scroller.viewport.scrollV;
		}

		this.setListRedPoint();
	}
	private oneIconWidth: number = 90;
	private setListRedPoint() {
		let oneIconWidth = this.oneIconWidth;
		let artifactModel = ArtifactModel.getInstance;
		if (artifactModel.scrollV > oneIconWidth) {
			this.m_TopArrImg.visible = true;
		} else {
			this.m_TopArrImg.visible = false;
		}
		let len = artifactModel.artifactDataTypeList(this.type).length;
		if (artifactModel.scrollV < ((len - 3.5) * oneIconWidth)) {
			this.m_LotArrImg.visible = true;
		} else {
			this.m_LotArrImg.visible = false;
		}
		let artifactData = artifactModel.artifactDataTypeList(this.type);
		let leftLen = Math.ceil(artifactModel.scrollV / oneIconWidth);
		this.m_RedPoint0.visible = false;
		for (var i = 0; i < artifactData.length; i++) {
			// let isCanUp = artifactModel.checkIsCanLvUP(artifactData[i].id);
			let isCanUp = artifactModel.checkIsCanLayerUP(artifactData[i].id);
			let isCanUpTwo = artifactModel.checkAllDebrisIsCanActivate(artifactData[i].id);
			if (isCanUp || isCanUpTwo) {
				this.m_RedPoint0.visible = true;
				break
			}
		}
		let maxWidth = (len - 3.5) * oneIconWidth;
		this.m_RedPoint1.visible = false;
		let righeLen = len - Math.floor((maxWidth - artifactModel.scrollV) / oneIconWidth);
		for (var i = righeLen - 1; i < len; i++) {
			// let isCanUp = artifactModel.checkIsCanLvUP(artifactData[i].id);
			let isCanUp = artifactModel.checkIsCanLayerUP(artifactData[i].id);
			if (isCanUp) {
				this.m_RedPoint1.visible = true;
				break
			}
		}
	}

	private initData() {
		// this.setArtifactGetPet();
		let artifactModel = ArtifactModel.getInstance;
		let artifactDatas = artifactModel.artifactDataTypeList(this.type);
		this.listData.replaceAll(artifactDatas);
		let artifactData = artifactDatas[artifactModel.getIndex(this.type)];

		this.m_MainBtnGroup.visible = false;
		this.getItem.visible = false;
		this.m_ProActivateGroup.visible = false;
		this.m_NoActivateStateGroup.visible = false;
		this.m_LvStateGroup.visible = false;
		this.m_ActivateStateGroup.visible = false;
		this.m_FullLab.visible = false;
		this.m_NeedLayerLab.text = "";
		let minattr = AttributeData.getAttr([]);
		AttributeData.setAttrGroup(minattr, this.m_StateGroup);
		if (artifactData) {
			this.m_ArtifactAnim.setData(artifactData);
			let artifactsConfig = GlobalConfig.ins("ArtifactsConfig")[artifactData.id];
			if (artifactData.isActivate == false) {
				if (artifactsConfig && artifactsConfig[0].activateType == 1) {
					this.m_ProActivateGroup.visible = true;
					this.m_NoActivateStateGroup.visible = true;
					artifactModel.setNoActivateDebrisGroup(this.m_DebrisGroup, artifactsConfig);
					this.m_MianBtn.enabled = false;
					let initAttr = artifactsConfig[0].attrs;
					if (artifactModel.getIndex(this.type) + 1 == artifactModel.curid) {
						if (artifactsConfig.length == artifactModel.conid) {
							this.m_MianBtn.enabled = true;
						}
						let allAttr = [];
						for (var i = 0; i < artifactModel.conid; i++) {
							let allList: { type: number, value: number }[] = [];
							for (var f = 0; f < artifactsConfig[i].attrs.length; f++) {
								let configList: { type: number, value: number } = artifactsConfig[i].attrs[f];
								let list = { type: configList.type, value: configList.value };
								allList.push(list);
							}
							allAttr.push(allList);
						}
						let attr = AttributeData.getAttr(allAttr);
						AttributeData.setAttrGroup(attr, this.m_StateGroup);
					}
				} else if (artifactsConfig && artifactsConfig[0].activateType == 2) {
					this.m_MainBtnGroup.visible = true;
					this.getItem.visible = true;
					this.m_NoActivateStateGroup.visible = true;
					this.m_UpLvBtn.label = GlobalConfig.jifengTiaoyueLg.st100212;
					this.m_LvBtnState = 1;
					let needItemData = [];
					needItemData.push(artifactsConfig[0].activationItem);
					this.getItemId = artifactsConfig[0].activationItem.id
					this.needArr = needItemData;
					UserBag.ins().setNeedItem(needItemData, this.m_NeedItemGroup);
					let attr = AttributeData.getAttr([artifactsConfig[0].attrs]);
					AttributeData.setAttrGroup(attr, this.m_StateGroup);
					this.m_UpLvBtn.enabled = true;
				}
			} else {
				this.m_LvStateGroup.visible = true;
				this.m_ActivateStateGroup.visible = true;
				this.m_MainBtnGroup.visible = true;
				this.getItem.visible = true;
				this.m_ArrImg.visible = true;
				this.m_LvRightAttrGroup.visible = true;
				this.m_LvLeftAttrGroup.horizontalCenter = -121.5;
				/**修改的 */
				this.m_UpLvBtn.label = GlobalConfig.jifengTiaoyueLg.st100242;
				let attr = artifactData.baseAttr;
				AttributeData.setAttrGroup(attr, this.m_StateGroup1);
				let layerlvAttr = artifactData.layerlvAttr;
				AttributeData.setAttrGroup(layerlvAttr, this.m_LvLeftAttrGroup);
				let artifactsRankConfig = GlobalConfig.ins("ArtifactsRankConfig")[artifactData.id];
				if (artifactsRankConfig) {
					if (artifactData.level == artifactsRankConfig.length) {
						this.m_ArrImg.visible = false;
						this.m_LvRightAttrGroup.visible = false;
						this.m_LvLeftAttrGroup.horizontalCenter = 0;
						this.m_MainBtnGroup.visible = false;
						this.getItem.visible = false;
						this.m_FullLab.visible = true;
					} else {
						let nextAttr = artifactModel.layerlvAttr(artifactData.id, artifactData.level + 1);
						AttributeData.setAttrGroup(nextAttr, this.m_LvRightAttrGroup);
					}
					let num = artifactData.level - 1;
					if (num <= 0) {
						num = 0;
					}

					let itemNum = UserBag.ins().getBagGoodsCountById(0, artifactsRankConfig[num].rankUpItem2.id);

					if (itemNum >= artifactsRankConfig[num].rankUpItem2.count) {
						/**增加的兼容模式 */
						this.needList = artifactsRankConfig[num].rankUpItem2;
						this.getItemId = artifactsRankConfig[num].rankUpItem2.id;
						UserBag.ins().setNeedItem([this.needList], this.m_NeedItemGroup);
					} else {
						if (artifactsRankConfig[num].rankUpItem3) {
							let itemNum3 = UserBag.ins().getBagGoodsCountById(0, artifactsRankConfig[num].rankUpItem3.id);
							if (itemNum3 >= artifactsRankConfig[num].rankUpItem3.count) {
								/**增加的兼容模式 */
								this.needList = artifactsRankConfig[num].rankUpItem3;
								this.getItemId = artifactsRankConfig[num].rankUpItem3.id;
								UserBag.ins().setNeedItem([this.needList], this.m_NeedItemGroup);
							}
							else {
								this.needList = artifactsRankConfig[num].rankUpItem;
								this.getItemId = artifactsRankConfig[num].rankUpItem.id;
								UserBag.ins().setNeedItem([this.needList], this.m_NeedItemGroup);
							}
						}
						else {
							this.needList = artifactsRankConfig[num].rankUpItem;
							this.getItemId = artifactsRankConfig[num].rankUpItem.id;
							UserBag.ins().setNeedItem([this.needList], this.m_NeedItemGroup);
						}
					}
				}
			}
		}
		this.setListRedPoint();
		this.checkGuide();
	}
	/**关联排序 */
	private sorLvUp(item1: { id: number }, item2: { id: number }): number {
		return item1.id - item2.id;
	}

	private onClickUpBtn() {
		GuideUtils.ins().next(this.m_UpLvBtn);
		let artifactModel = ArtifactModel.getInstance;
		let artifactDatas = artifactModel.artifactDataTypeList(this.type);
		let artifactData = artifactDatas[artifactModel.getIndex(this.type)];
		if (artifactData.isActivate == false) {
			let artifactsConfig = GlobalConfig.ins("ArtifactsConfig")[artifactData.id];
			if (artifactsConfig) {
				if (artifactsConfig[0].activateType == 2) {
					let itemConfig = GlobalConfig.ins("ItemConfig")[artifactsConfig[0].activationItem.id];
					let itmeType = 0;
					if (itemConfig && itemConfig.type == 0) {
						itmeType = 1;
					}
					let num = UserBag.ins().getBagGoodsCountById(itmeType, artifactsConfig[0].activationItem.id);
					if (num >= artifactsConfig[0].activationItem.count) {
						ArtifactSproto.ins().sendArtifactLvUpMsg(artifactData.id, 2);
					} else {
						UserTips.ins().showTips(GlobalConfig.jifengTiaoyueLg.st100217);
					}
				} else {
					ArtifactSproto.ins().sendArtifactLvUpMsg(artifactData.id, 2);
				}
			}
		} else {
			/**修改 */
			let artifactModel = ArtifactModel.getInstance;
			let artifactDatas = artifactModel.artifactDataTypeList(this.type);
			let artifactData = artifactDatas[artifactModel.getIndex(this.type)];
			// if (artifactData.strenglv < artifactData.layerNeedLv) {
			// 	UserTips.ins().showTips(GlobalConfig.languageConfig.st100420);
			// 	return;
			// }
			let itemConfig = GlobalConfig.ins("ItemConfig")[this.needList.id];
			let itmeType = 0;
			if (itemConfig && itemConfig.type == 0) {
				itmeType = 1;
			}
			let num = UserBag.ins().getBagGoodsCountById(itmeType, this.needList.id);
			if (num < this.needList.count) {
				UserTips.ins().showTips(GlobalConfig.jifengTiaoyueLg.st100217);
				return;
			}
			ArtifactSproto.ins().sendArtifactLvUpMsg(artifactData.id, 1);
			/********* */
			// let artifactsStrengConfig = GlobalConfig.ins("ArtifactsStrengConfig")[artifactData.id];
			// if (artifactsStrengConfig) {
			// 	if (artifactData.level < artifactData.lvNeedLayer) {
			// 		UserTips.ins().showTips(GlobalConfig.languageConfig.st100412);
			// 		return;
			// 	}
			// 	for (var i = 0; i < this.needArr.length; i++) {
			// 		if (this.needArr[i].id == 1) {
			// 			let gold: number = GameLogic.ins().actorModel.gold;
			// 			if (gold < this.needArr[i].count) {
			// 				UserTips.ins().showTips(GlobalConfig.languageConfig.st100323);
			// 				return;
			// 			}
			// 		} else {
			// 			let itemConfig = GlobalConfig.ins("ItemConfig")[this.needArr[i].id];
			// 			let itmeType = 0;
			// 			if (itemConfig && itemConfig.type == 0) {
			// 				itmeType = 1;
			// 			}
			// 			let num = UserBag.ins().getBagGoodsCountById(itmeType, this.needArr[i].id);
			// 			if (num < this.needArr[i].count) {
			// 				UserTips.ins().showTips(GlobalConfig.languageConfig.st100217);
			// 				return;
			// 			}
			// 		}
			// 	}
			// }
			// ArtifactSproto.ins().sendArtifactLvUpMsg(artifactData.id, 2);
		}

	}

	// private setArtifactGetPet() {
	// 	let artifactModel = ArtifactModel.getInstance;
	// 	let artifactsBasicConfig = GlobalConfig.ins("ArtifactsBasicConfig");
	// 	if (GameServer.serverOpenDay > artifactsBasicConfig.activityTime) {
	// 		this.m_GetPetTipsGroup.visible = false;
	// 		return;
	// 	}
	// 	let list = artifactsBasicConfig.artifactsRequirement;
	// 	let isAllAct: boolean = true;
	// 	for (var i = 0; i < list.length; i++) {
	// 		let artufactData = artifactModel.artufactDic.get(list[i]);
	// 		if (artufactData.isActivate == false) {
	// 			isAllAct = false;
	// 			break;
	// 		}
	// 	}
	// 	if (isAllAct == true) {
	// 		this.m_GetPetTipsGroup.visible = false;
	// 		return;
	// 	} else {
	// 		let petConfig = GlobalConfig.ins("PetConfig")[artifactsBasicConfig.showReward];
	// 		if (petConfig) {
	// 			this.m_PetNameLab.text = petConfig.name;
	// 		}
	// 		this.m_PeTisptLab.text = LanguageString.LanguageChange(GlobalConfig.languageConfig.st100413, [artifactsBasicConfig.activityTime])
	// 	}
	// }

	private onClickPet() {
		let petModel = PetModel.getInstance;
		let artifactsBasicConfig = GlobalConfig.ins("ArtifactsBasicConfig");
		let petData = petModel.petDic.get(artifactsBasicConfig.showReward);
		if (petData) {
			ViewManager.ins().open(PetStateWin, petData);
		} else {
			PetSproto.ins().sendGetPetInitMsg();
			egret.setTimeout(function () {
				let artifactsBasicConfig = GlobalConfig.ins("ArtifactsBasicConfig");
				let petData = petModel.petDic.get(artifactsBasicConfig.showReward);
				if (petData) {
					ViewManager.ins().open(PetStateWin, petData);
				}
			}, this, 500
			)
		}
	}

	private checkGuide() {
		// if (Setting.currPart == 21 && Setting.currStep == 2) {
		// 	this.m_ArtifactLabGuide.visible = true;
		// 	let child = this.m_DebrisGroup.getChildAt(0);
		// 	if (child && child instanceof ArtifactDebrisLab) {
		// 		this.m_ArtifactLabGuide.data = child.data;
		// 		this.m_ArtifactLabGuide.setData();
		// 		this.m_ArtifactLabGuide.m_RedPoint.visible = false;
		// 		this.m_ArtifactLabGuide.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onClickGuide, this, true, 10);
		// 		GuideUtils.ins().show(this.m_ArtifactLabGuide, 21, 2);
		// 	}
		// } else {
		// 	this.m_ArtifactLabGuide.visible = false;
		// }
		if (UserFb2.ins().fbChallengeId == GuideArtifact.Artifact) {
			GuideUtils.ins().show(this.m_UpLvBtn, 68, 4);
		}
	}
	private onClickGuide() {
		this.m_ArtifactLabGuide.visible = false;
		GuideUtils.ins().next(this.m_ArtifactLabGuide);
		this.m_ArtifactLabGuide.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onClickGuide, this);
	}
	UpdateContent(): void {

	}

	private m_BodyEff: MovieClip;
	private m_BodyEff0: MovieClip;
	private m_UpLvEff: MovieClip;
	private m_ItemEff: MovieClip;
	private playBodyEff() {
		this.m_BodyEff = ViewManager.ins().createEff(this.m_BodyEff, this.m_BodyEffGrouo, "eff_ui_bodyUpgrade");
		this.m_BodyEff0 = ViewManager.ins().createEff(this.m_BodyEff0, this.m_BodyEffGrouo0, "eff_ui_upgrade");
		this.m_UpLvEff = ViewManager.ins().createEff(this.m_UpLvEff, this.m_LvUpEffGroup, "eff_ui_success");
		this.m_ItemEff = ViewManager.ins().createEff(this.m_ItemEff, this.m_ItemEffGroup, "eff_ui_icon");
	}
}
window["ArtifactPanel"] = ArtifactPanel