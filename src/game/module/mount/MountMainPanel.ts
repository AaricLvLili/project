class MountMainPanel extends BaseView implements ICommonWindowTitle, ICommonWindowRoleSelect {
	windowTitleIconName?: string;
	m_RoleSelectPanel: RoleSelectPanel
	windowCommonBg = "pic_bj_20_png"

	public constructor(data?: any) {
		super();
		this.skinName = "MountPanelSkin";
	}
	public m_MountAnim: MountAnim;
	public m_MountSkinBtn: eui.Button;
	public m_LvUpAwardBtn: eui.Button;
	public m_DanYaoBtn: eui.Button;
	public m_MountStateBtn: eui.Image;
	public m_AutoBuyBox: eui.CheckBox;
	public m_UpLvBtn: eui.Button;
	public m_AutoUpLvBtn: eui.Button;
	public m_ExpBar: eui.ProgressBar;
	public m_ScrollerSkill: eui.Scroller;
	public m_ListSkill: eui.List;
	public m_ScrollerEquip: eui.Scroller;
	public m_ListEquip: eui.List;
	public m_FightLab: eui.Image;
	public starList: StarList;
	public m_RightArrImg: eui.Image;
	public m_LeftArrImg: eui.Image;

	public m_LvUpItemNum: eui.Label;
	public m_LvUpItemImg: eui.Image;
	public m_LvUpItemImg1: eui.Image;
	public m_LvUpItemNum1: eui.Label;
	public m_UpLayerBtn: eui.Button;
	public m_StarGroup: eui.Group;
	public m_FullLvLab: eui.Label;

	public m_LvUpRedPoint: eui.Image;

	public m_NeedItemGroup: eui.Group;
	public getItem: eui.Label;


	private m_SkillData: eui.ArrayCollection;
	private m_EquipData: eui.ArrayCollection;
	_isAutoUp: boolean = false

	private isGuide = false;
	private languageTxt: eui.Label;
	private languageTxt0: eui.Label;
	private languageTxt1: eui.Label;
	private languageTxt2: eui.Label;

	public m_FightBtn: eui.Button;

	protected childrenCreated() {
		super.childrenCreated();
		this.m_ListSkill.itemRenderer = MountSkillIconItem;
		this.m_SkillData = new eui.ArrayCollection;
		this.m_ListSkill.dataProvider = this.m_SkillData;

		this.m_ListEquip.itemRenderer = MountEquipIconItem;
		this.m_EquipData = new eui.ArrayCollection;
		this.m_ListEquip.dataProvider = this.m_EquipData;

		UIHelper.SetLinkStyleLabel(this.getItem);
		this.m_UpLvBtn.label = GlobalConfig.jifengTiaoyueLg.st101103;
		this.languageTxt.text = GlobalConfig.jifengTiaoyueLg.st100670;
		this.languageTxt0.text = GlobalConfig.jifengTiaoyueLg.st100218;
		this.languageTxt1.text = GlobalConfig.jifengTiaoyueLg.st100671;
		this.languageTxt2.text = GlobalConfig.jifengTiaoyueLg.st100672;

		this.m_AutoBuyBox.label = GlobalConfig.jifengTiaoyueLg.st101105;
		this.getItem.text = GlobalConfig.jifengTiaoyueLg.st100418;
		this.m_UpLayerBtn.label = GlobalConfig.jifengTiaoyueLg.st100242;
		this.m_FullLvLab.text = GlobalConfig.jifengTiaoyueLg.st100327;
	};
	private addViewEvent() {
		this.observe(MessageDef.ITEM_COUNT_CHANGE, this._showPYReddot);
		this.observe(MountEvt.MOUNT_DATAUPDATE_MSG, this.initData);
		this.observe(MessageDef.BAG_HAS_ITEM_CAN_USE, this.initData);
		this.AddClick(this.m_MountSkinBtn, this.onClickMountSkinBtn);
		this.AddClick(this.m_LvUpAwardBtn, this.onClickLvUpAwardBtn);
		this.AddClick(this.m_DanYaoBtn, this.onClickDanYaoBtn);
		this.AddClick(this.m_AutoUpLvBtn, this.btnAutoUpClick);
		this.AddClick(this.m_UpLvBtn, this.onClickUpLvBtn);
		this.AddClick(this.m_UpLayerBtn, this.onClickUpLayer);
		this.AddClick(this.m_MountStateBtn, this.onClickMountStateBtn);
		this.AddClick(this.m_ListSkill, this.onClickSkill);
		this.AddClick(this.m_LeftArrImg, this.onClickArrImg);
		this.AddClick(this.m_RightArrImg, this.onClickArrImg);
		this.AddClick(this.getItem, this.onClickGetLab1);
		this.observe(MountEvt.MOUNT_CHANGESHOUW_MSG, this.onChangeMountShow);
		this.AddClick(this.m_FightBtn, this.onClickFight);
	}
	private removeEvent() {
	}
	public open() {
		this.m_RoleSelectPanel.y = 130;
		this.addViewEvent();
		this._showPYReddot()
	};
	public close() {
		this.stopAutoUp();
		this.removeEvent();
		this.m_RoleSelectPanel.y = 158;
	};

	public release() {
		this.m_MountAnim.release();
		this.removeEvent();
		this.stopAutoUp();
	}

	private onClickGetLab1() {
		let mountModel = MountModel.getInstance;
		let curRole = this.m_RoleSelectPanel.getCurRole();
		var role = SubRoles.ins().getSubRoleByIndex(curRole);
		let mountData: MountData = mountModel.mountDic.get(role.roleID);
		let mountsLevelConfig = GlobalConfig.ins("MountsLevelConfig")[mountData.level];
		if (mountsLevelConfig) {
			UserWarn.ins().setBuyGoodsWarn(mountsLevelConfig.cost[0].id);
		}
	}

	private initData() {
		let mountModel = MountModel.getInstance;
		let curRole = this.m_RoleSelectPanel.getCurRole();
		var role = SubRoles.ins().getSubRoleByIndex(curRole);
		let mountData: MountData = mountModel.mountDic.get(role.roleID);
		mountModel.nowSelectRoldData = role;
		let mountsCommonConfig = GlobalConfig.ins("MountsCommonConfig");
		this.m_LvUpRedPoint.visible = false;
		if (mountData.level == mountsCommonConfig.lvMax) {
			this.m_RightArrImg.visible = false;
		} else {
			this.m_RightArrImg.visible = true;
		}

		if (mountData) {
			this.initAttrImg(mountData.level);
			this.m_MountAnim.setMountData(mountData);
			let skillData = [0, 0, 0, 0];
			for (var i = 0; i < mountData.skill.length; i++) {
				skillData[i] = mountData.skill[i];
			}
			this.m_SkillData.replaceAll(skillData);
			let equipData: Sproto.ride_equip[] = [];
			for (var i = 0; i < 4; i++) {
				if (mountData.equipList[i]) {
					equipData.push(mountData.equipList[i]);
				} else {
					equipData.push(null);
				}
			}
			this.m_EquipData.replaceAll(equipData);
			this.starList.starNum = mountData.star % 10;

			let mountsStarConfig = GlobalConfig.ins("MountsStarConfig")[mountData.star];
			if (mountsStarConfig.exp == 0 || mountData.level == mountsCommonConfig.lvMax) {
				this.m_StarGroup.visible = false;
				this.m_UpLayerBtn.visible = false;
				this.m_FullLvLab.visible = true;
				this.stopAutoUp();
			}
			else if (mountData.level * 10 == mountData.star) {
				this.m_StarGroup.visible = false;
				this.m_UpLayerBtn.visible = true;
				this.m_FullLvLab.visible = false;
				this.stopAutoUp();
			} else {
				this.m_StarGroup.visible = true;
				this.m_UpLayerBtn.visible = false;
				this.m_FullLvLab.visible = false;

			}
			if (mountsStarConfig) {
				this.m_ExpBar.maximum = mountsStarConfig.exp;
				this.m_ExpBar.value = mountData.exp;
			}
			let mountsLevelConfig = GlobalConfig.ins("MountsLevelConfig")[mountData.level];
			if (mountsLevelConfig) {
				let itemConfig = GlobalConfig.ins("ItemConfig")[mountsLevelConfig.cost[0].id];
				if (itemConfig) {
					// this.m_LvUpItemNum.text = mountsLevelConfig.cost[0].count;
					// this.m_LvUpItemNum1.text = mountsLevelConfig.cost[1].count;
					let needItemData = [];
					needItemData.push(mountsLevelConfig.cost[0]);
					needItemData.push(mountsLevelConfig.cost[1]);
					UserBag.ins().setNeedItem(needItemData, this.m_NeedItemGroup);
				}
			}
			if (mountData.isCanLvUp) {
				this.m_LvUpRedPoint.visible = true;
			}
		}
		this.m_MountSkinBtn["redPoint"].visible = mountModel.checkMountSkinAllRedPoint();
		this.m_LvUpAwardBtn["redPoint"].visible = mountModel.checkMoutnLvUpAwardRedPoint();
		this.setArrImg();
		this.setRoleRedPoint();
		this.checkGuide();
	}

	private initAttrImg(lv: number) {
		this.m_LeftArrImg.visible = true;
		this.m_RightArrImg.visible = true;
		if (lv == 0) {
			this.m_LeftArrImg.visible = false;
		}
		let mountsLevelConfig = GlobalConfig.ins("MountsLevelConfig")[lv + 1];
		if (!mountsLevelConfig) {
			this.m_RightArrImg.visible = false;
		}
		let mountModel = MountModel.getInstance;
		let curRole = this.m_RoleSelectPanel.getCurRole();
		var role = SubRoles.ins().getSubRoleByIndex(curRole);
		let mountData: MountData = mountModel.mountDic.get(role.roleID);
		if (mountData.level == lv) {
			// this.m_FightLab.visible = true;
			this.m_MountAnim.totalPower.visible = true;
		} else {
			// this.m_FightLab.visible = false;
		}

		if (mountData.showLv == lv) {
			this.m_FightLab.visible = true;
			this.m_FightBtn.visible = false;
		} else {
			this.m_FightLab.visible = false;
			this.m_FightBtn.visible = true;
		}
	}

	private onClickArrImg(evt: egret.TouchEvent) {
		switch (evt.currentTarget) {
			case this.m_LeftArrImg:
				this.m_RightArrImg.visible = true;
				this.m_MountAnim.changeAnimLv(this.m_MountAnim.m_Lv -= 1);
				break;
			case this.m_RightArrImg:
				if (this.m_MountAnim.m_Lv == this.m_MountAnim.m_NowLv) {
					this.m_RightArrImg.visible = false;
				}
				this.m_MountAnim.changeAnimLv(this.m_MountAnim.m_Lv += 1);
				break;
		}
		this.setArrImg();
	}

	private setArrImg() {
		let mountModel = MountModel.getInstance;
		let curRole = this.m_RoleSelectPanel.getCurRole();
		var role = SubRoles.ins().getSubRoleByIndex(curRole);
		let mountData: MountData = mountModel.mountDic.get(role.roleID);
		let mountsCommonConfig = GlobalConfig.ins("MountsCommonConfig");
		if (this.m_MountAnim.m_Lv == 1) {
			this.m_LeftArrImg.visible = false;
		} else {
			this.m_LeftArrImg.visible = true;
		}
		if (this.m_MountAnim.m_Lv == mountsCommonConfig.lvMax || this.m_MountAnim.m_Lv > this.m_MountAnim.m_NowLv) {
			this.m_RightArrImg.visible = false;
		} else {
			this.m_RightArrImg.visible = true;
		}
		if (mountData.level == this.m_MountAnim.m_Lv) {
			this.m_FightLab.visible = true;
			this.m_MountAnim.totalPower.visible = true;
		} else {
			this.m_FightLab.visible = false;
		}
		if (mountData.showLv == this.m_MountAnim.m_Lv) {
			this.m_FightLab.visible = true;
			this.m_FightBtn.visible = false;
		} else {
			this.m_FightLab.visible = false;
			if (this.m_MountAnim.m_Lv > this.m_MountAnim.m_NowLv) {
				this.m_FightBtn.visible = false;
			} else {
				this.m_FightBtn.visible = true;
			}
		}
	}

	UpdateContent(): void {
		this.stopAutoUp();
		this.initData();
	}

	private onClickMountSkinBtn() {
		ViewManager.ins().open(DressWin, 0, 3);
	}

	private onClickLvUpAwardBtn() {
		ViewManager.ins().open(MountLvUpAwardWin);
	}

	private onClickDanYaoBtn() {
		ViewManager.ins().open(MountDanYaoWin);
	}

	private onClickMountStateBtn() {
		let mountModel = MountModel.getInstance;
		let curRole = this.m_RoleSelectPanel.getCurRole();
		var role = SubRoles.ins().getSubRoleByIndex(curRole);
		let mountData: MountData = mountModel.mountDic.get(role.roleID);
		ViewManager.ins().open(MountStateWin, mountData);
	}

	private btnAutoUpClick() {
		if (this._isAutoUp) {
			this.stopAutoUp();
		}
		else {
			this._isAutoUp = true;
			this.m_AutoUpLvBtn.label = GlobalConfig.jifengTiaoyueLg.st101096;//"停 止";
			TimerManager.ins().doTimer(150 * 4, 0, this.autoUpStar, this);
		}
	}
	stopAutoUp() {
		this._isAutoUp = false;
		this.m_AutoUpLvBtn.label = GlobalConfig.jifengTiaoyueLg.st101097;//"自动提升";
		TimerManager.ins().remove(this.autoUpStar, this);
	};

	autoUpStar() {
		let mountModel = MountModel.getInstance;
		let curRole = this.m_RoleSelectPanel.getCurRole();
		var role = SubRoles.ins().getSubRoleByIndex(curRole);
		let mountData: MountData = mountModel.mountDic.get(role.roleID);
		let mountsStarConfig = GlobalConfig.ins("MountsStarConfig")[mountData.star];
		if (mountsStarConfig == null && mountsStarConfig.exp == 0) {
			this._isAutoUp = false;
			this.m_AutoUpLvBtn.label = GlobalConfig.jifengTiaoyueLg.st101097;//"自动提升";
			TimerManager.ins().remove(this.autoUpStar, this);
			UserTips.ins().showTips(GlobalConfig.jifengTiaoyueLg.st101098);//已经满级
			return;
		}
		let mountsLevelConfig = GlobalConfig.ins("MountsLevelConfig")[mountData.level];
		let itemNum = UserBag.ins().getBagGoodsCountById(0, mountsLevelConfig.cost[0].id);
		let gold: number = GameLogic.ins().actorModel.gold;
		if (itemNum >= mountsLevelConfig.cost[0].count && gold >= mountsLevelConfig.cost[1].count) {
			MountSproto.ins().sendGetMountStarUp(role.roleID, false);
		}
		else {
			if (gold < mountsLevelConfig.cost[1].count) {
				UserTips.ins().showTips(GlobalConfig.jifengTiaoyueLg.st100323);
			} else
				//勾选了自动购买材料，先去用钻石购买材料
				if (this.m_AutoBuyBox.selected == true) {
					let lastitemNum = mountsLevelConfig.cost[0].count - itemNum;
					if (Checker.Money(MoneyConst.yuanbao, ItemStoreConfig.getStoreByItemID(mountsLevelConfig.cost[0].id).price * mountsLevelConfig.cost[0].count, Checker.YUNBAO_FRAME)) {
						MountSproto.ins().sendGetMountStarUp(role.roleID, true);
						return;
					}
				}
				else {
					UserWarn.ins().setBuyGoodsWarn(mountsLevelConfig.cost[0].id, mountsLevelConfig.cost[0].count - itemNum);
				}
			this._isAutoUp = false;
			this.m_AutoUpLvBtn.label = GlobalConfig.jifengTiaoyueLg.st101097;//"自动提升";
			TimerManager.ins().remove(this.autoUpStar, this);
		}
	};

	private onClickUpLvBtn() {
		GuideUtils.ins().next(this.m_UpLvBtn);
		let mountModel = MountModel.getInstance;
		let curRole = this.m_RoleSelectPanel.getCurRole();
		var role = SubRoles.ins().getSubRoleByIndex(curRole);
		let mountData: MountData = mountModel.mountDic.get(role.roleID);
		let mountsStarConfig = GlobalConfig.ins("MountsStarConfig")[mountData.star];
		if (mountsStarConfig == null && mountsStarConfig.exp == 0) {
			UserTips.ins().showTips(GlobalConfig.jifengTiaoyueLg.st101098);
			return;
		}
		let mountsLevelConfig = GlobalConfig.ins("MountsLevelConfig")[mountData.level];
		let itemNum = UserBag.ins().getBagGoodsCountById(0, mountsLevelConfig.cost[0].id);
		let gold: number = GameLogic.ins().actorModel.gold;
		if (itemNum >= mountsLevelConfig.cost[0].count && gold >= mountsLevelConfig.cost[1].count) {
			MountSproto.ins().sendGetMountStarUp(role.roleID, false);
		} else {
			if (gold < mountsLevelConfig.cost[1].count) {
				UserTips.ins().showTips(GlobalConfig.jifengTiaoyueLg.st100323);
			} else
				//勾选了自动购买材料，先去用钻石购买材料
				if (this.m_AutoBuyBox.selected == true) {
					let lastitemNum = mountsLevelConfig.cost[0].count - itemNum;
					if (Checker.Money(MoneyConst.yuanbao, ItemStoreConfig.getStoreByItemID(mountsLevelConfig.cost[0].id).price * mountsLevelConfig.cost[0].count, Checker.YUNBAO_FRAME)) {
						MountSproto.ins().sendGetMountStarUp(role.roleID, true);
						return;
					}
				}
				else {
					UserWarn.ins().setBuyGoodsWarn(mountsLevelConfig.cost[0].id, mountsLevelConfig.cost[0].count - itemNum);
				}
		}

	}

	private onClickUpLayer() {
		let curRole = this.m_RoleSelectPanel.getCurRole();
		var role = SubRoles.ins().getSubRoleByIndex(curRole);
		MountSproto.ins().sendGetMountLvUp(role.roleID);
	}

	private onClickSkill() {
		let curRole = this.m_RoleSelectPanel.getCurRole();
		var role = SubRoles.ins().getSubRoleByIndex(curRole);
		ViewManager.ins().open(MountSkillWin, role.roleID);
	}
	private setRoleRedPoint() {
		let mountModel = MountModel.getInstance;
		let curRole = this.m_RoleSelectPanel.getCurRole();
		var roleList = SubRoles.ins().rolesModel;
		for (var i = 0; i < roleList.length; i++) {
			let role: Role = roleList[i]
			this.m_RoleSelectPanel.showRedPoint(role.roleID, mountModel.checkRoleRedPoint(role));
		}
	}

	public checkGuide() {
		let mountModel = MountModel.getInstance;
		let curRole = this.m_RoleSelectPanel.getCurRole();
		var role = SubRoles.ins().getSubRoleByIndex(curRole);
		let mountData: MountData = mountModel.mountDic.get(role.roleID);
		if (curRole == 0) {
			if (mountData.level == 1 && mountData.exp == 0 && mountData.isCanLvUp && this.isGuide == false) {
				this.isGuide = true;
				Setting.currPart = 22;
				Setting.currStep = 0;
				GuideUtils.ins().show(this.m_UpLvBtn, 22, 0);
			}
		}
	}
	private _showPYReddot(): void {
		let list = Object.keys(GlobalConfig.ins("mountsShuXingDanjcConfig"))
		for (let i = 0, len = list.length; i < len; i++) {
			if (UserBag.ins().getBagItemById(parseInt(list[i]))) {
				this.m_DanYaoBtn["redPoint"].visible = true
				return
			}
		}
		this.m_DanYaoBtn["redPoint"].visible = false
	}

	private onChangeMountShow() {
		let mountModel = MountModel.getInstance;
		let curRole = this.m_RoleSelectPanel.getCurRole();
		var role = SubRoles.ins().getSubRoleByIndex(curRole);
		let mountData: MountData = mountModel.mountDic.get(role.roleID);
		if (mountData.showLv == this.m_MountAnim.m_Lv) {
			this.m_FightLab.visible = true;
			this.m_FightBtn.visible = false;
		} else {
			this.m_FightLab.visible = false;
			if (this.m_MountAnim.m_Lv > this.m_MountAnim.m_NowLv) {
				this.m_FightBtn.visible = false;
			} else {
				this.m_FightBtn.visible = true;
			}
		}
	}

	private onClickFight() {
		let mountModel = MountModel.getInstance;
		let curRole = this.m_RoleSelectPanel.getCurRole();
		var role = SubRoles.ins().getSubRoleByIndex(curRole);
		MountSproto.ins().sendChageMountShow(role.roleID, this.m_MountAnim.m_Lv);
	}
}
window["MountMainPanel"] = MountMainPanel