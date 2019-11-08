class TheGunPanel extends BaseView implements ICommonWindowTitle, ICommonWindowRoleSelect {
	windowTitleIconName?: string;
	m_RoleSelectPanel: RoleSelectPanel
	public constructor(data?: any) {
		super();
		this.name = GlobalConfig.jifengTiaoyueLg.st102041;
		this.windowTitleIconName = GlobalConfig.jifengTiaoyueLg.st102041;
		this.skinName = "TheGunPanelSkin";
	}
	public m_TheGunAnim: TheGunAnim;
	public m_StateBtn: eui.Image;
	public m_StarGroup: eui.Group;
	public starList: StarList;
	public m_UpLvBtn: eui.Button;
	public m_LvUpRedPoint: eui.Image;
	public m_AutoUpLvBtn: eui.Button;
	public m_Lan1: eui.Label;
	public m_ExpBar: eui.ProgressBar;
	public m_Lan2: eui.Label;
	public m_NeedItemGroup: eui.Group;
	public m_LvUpItemImg0: eui.Image;
	public m_LvUpItemNum1: eui.Label;
	public m_AutoBuyBox: eui.CheckBox;
	public getItem: eui.Label;
	public m_UpLayerBtn: eui.Button;
	public m_FullLvLab: eui.Label;
	public m_Lan: eui.Label;
	public m_Lan3: eui.Label;
	public m_ScrollerSkill: eui.Scroller;
	public m_ListSkill: eui.List;
	public m_ScrollerEquip: eui.Scroller;
	public m_ListEquip: eui.List;
	public m_RightArrImg: eui.Image;
	public m_LeftArrImg: eui.Image;
	public m_LvUpAwardBtn: eui.Button;


	private m_SkillData: eui.ArrayCollection;
	private m_DanData: eui.ArrayCollection;
	_isAutoUp: boolean = false
	public m_LvGoup: eui.Group;
	public m_LvLab: eui.Label;

	protected childrenCreated() {
		super.childrenCreated();
		this.m_ListSkill.itemRenderer = TheGunSkillItem;
		this.m_SkillData = new eui.ArrayCollection;
		this.m_ListSkill.dataProvider = this.m_SkillData;

		this.m_ListEquip.itemRenderer = TheGunDanItem;
		this.m_DanData = new eui.ArrayCollection;
		this.m_ListEquip.dataProvider = this.m_DanData;

		UIHelper.SetLinkStyleLabel(this.getItem);
		this.m_UpLvBtn.label = GlobalConfig.jifengTiaoyueLg.st101103;
		this.m_AutoBuyBox.label = GlobalConfig.jifengTiaoyueLg.st101105;
		this.getItem.text = GlobalConfig.jifengTiaoyueLg.st100418;
		this.m_UpLayerBtn.label = GlobalConfig.jifengTiaoyueLg.st100242;
		this.m_FullLvLab.text = GlobalConfig.jifengTiaoyueLg.st100327;

		this.m_Lan.text = GlobalConfig.jifengTiaoyueLg.st102036;
		this.m_Lan1.text = GlobalConfig.jifengTiaoyueLg.st100670;
		this.m_Lan2.text = GlobalConfig.jifengTiaoyueLg.st100218;
		this.m_Lan3.text = GlobalConfig.jifengTiaoyueLg.st102037;

	};
	private addViewEvent() {
		this.AddClick(this.m_LvUpAwardBtn, this.onClickLvUpAwardBtn);
		this.AddClick(this.m_AutoUpLvBtn, this.btnAutoUpClick);
		this.AddClick(this.m_UpLvBtn, this.onClickUpLvBtn);
		this.AddClick(this.m_UpLayerBtn, this.onClickUpLayer);
		this.AddClick(this.m_StateBtn, this.onClickStateBtn);
		this.AddClick(this.m_ListSkill, this.onClickSkill);
		this.AddClick(this.m_LeftArrImg, this.onClickArrImg);
		this.AddClick(this.m_RightArrImg, this.onClickArrImg);
		this.AddClick(this.getItem, this.onClickGetLab1);
		this.observe(TheGunEvt.THEGUN_DATAUPDATE_MSG, this.initData);
		this.observe(MessageDef.BAG_HAS_ITEM_CAN_USE, this.initData);
	}
	private removeEvent() {
	}

	public open() {
		this.m_RoleSelectPanel.y = 130;
		this.addViewEvent();
		this.initData();
	};
	public close() {
		this.m_RoleSelectPanel.y = 158;
		this.removeEvent();
	};

	public release() {
		this.removeEvent();
	}
	private initData() {
		let theGunModel = TheGunModel.getInstance;
		let curRole = this.m_RoleSelectPanel.getCurRole();
		var role = SubRoles.ins().getSubRoleByIndex(curRole);
		let theGunData: TheGunData = theGunModel.theGunDic.get(role.roleID);
		theGunModel.nowSelectRoldData = role;
		let spearCommonConfig = GlobalConfig.ins("SpearCommonConfig");
		this.m_LvUpRedPoint.visible = false;
		if (theGunData) {
			if (theGunData.level == spearCommonConfig.lvMax) {
				this.m_RightArrImg.visible = false;
			} else {
				this.m_RightArrImg.visible = true;
			}
			this.m_LvLab.text = theGunData.level + GlobalConfig.jifengTiaoyueLg.st100103;
			this.m_TheGunAnim.setTheGunData(theGunData);
			let skillData = [0, 0, 0, 0];
			for (var i = 0; i < theGunData.skill.values.length; i++) {
				skillData[i] = theGunData.skill.values[i];
			}
			this.m_SkillData.replaceAll(skillData);

			let spearShuXingDanjcConfig = GlobalConfig.ins("SpearShuXingDanjcConfig");
			let configDanData = [];
			for (let key in spearShuXingDanjcConfig) {
				configDanData.push(spearShuXingDanjcConfig[key]);
			}
			let danData = [0, 0, 0]
			let needDanData = [];
			for (var i = 0; i < danData.length; i++) {
				if (theGunData.danYao.values[i] != null) {
					danData[i] = theGunData.danYao.values[i];
					let danTypeData = { type: 1, id: configDanData[i].id, count: danData[i] }
					needDanData.push(danTypeData);
				}
			}
			this.m_DanData.replaceAll(needDanData);
			this.starList.starNum = theGunData.star % 10;

			let spearStarConfig = GlobalConfig.ins("SpearStarConfig")[theGunData.star];
			if (spearStarConfig.exp == 0 || theGunData.level == spearCommonConfig.lvMax) {
				this.m_StarGroup.visible = false;
				this.m_UpLayerBtn.visible = false;
				this.m_FullLvLab.visible = true;
				this.stopAutoUp();
			}
			else if (theGunData.level * 10 == theGunData.star) {
				this.m_StarGroup.visible = false;
				this.m_UpLayerBtn.visible = true;
				this.m_FullLvLab.visible = false;
				this.stopAutoUp();
			} else {
				this.m_StarGroup.visible = true;
				this.m_UpLayerBtn.visible = false;
				this.m_FullLvLab.visible = false;

			}
			if (spearStarConfig) {
				this.m_ExpBar.maximum = spearStarConfig.exp;
				this.m_ExpBar.value = theGunData.exp;
			}
			let spearLevelConfig = GlobalConfig.ins("SpearLevelConfig")[theGunData.level];
			if (spearLevelConfig) {
				let itemConfig = GlobalConfig.ins("ItemConfig")[spearLevelConfig.cost[0].id];
				if (itemConfig) {
					let needItemData = [];
					for (var i = 0; i < spearLevelConfig.cost.length; i++) {
						needItemData.push(spearLevelConfig.cost[i]);
					}
					UserBag.ins().setNeedItem(needItemData, this.m_NeedItemGroup);
				}
			}
			if (theGunData.isCanLvUp) {
				this.m_LvUpRedPoint.visible = true;
			}
		}
		this.m_LvUpAwardBtn["redPoint"].visible = theGunModel.checkTheGunLvUpAwardRedPoint();
		this.setArrImg();
		this.setRoleRedPoint();
	}


	private setArrImg() {
		let theGunModel = TheGunModel.getInstance;
		let curRole = this.m_RoleSelectPanel.getCurRole();
		var role = SubRoles.ins().getSubRoleByIndex(curRole);
		let theGunData: TheGunData = theGunModel.theGunDic.get(role.roleID);
		let spearCommonConfig = GlobalConfig.ins("SpearCommonConfig");
		if (this.m_TheGunAnim.m_Lv == 1) {
			this.m_LeftArrImg.visible = false;
		} else {
			this.m_LeftArrImg.visible = true;
		}
		if (this.m_TheGunAnim.m_Lv == spearCommonConfig.lvMax || this.m_TheGunAnim.m_Lv > this.m_TheGunAnim.m_NowLv) {
			this.m_RightArrImg.visible = false;
		} else {
			this.m_RightArrImg.visible = true;
		}
		if (theGunData && theGunData.level == this.m_TheGunAnim.m_Lv) {
			this.m_TheGunAnim.totalPower.visible = true;
		}
	}

	private setRoleRedPoint() {
		let theGunModel = TheGunModel.getInstance;
		let curRole = this.m_RoleSelectPanel.getCurRole();
		var roleList = SubRoles.ins().rolesModel;
		for (var i = 0; i < roleList.length; i++) {
			let role: Role = roleList[i]
			this.m_RoleSelectPanel.showRedPoint(role.roleID, theGunModel.checkRoleRedPoint(role));
		}
	}

	private onClickLvUpAwardBtn() {
		ViewManager.ins().open(TheGunAwardWin);
	}

	private btnAutoUpClick() {
		if (this._isAutoUp) {
			this.stopAutoUp();
		}
		else {
			this._isAutoUp = true;
			this.m_AutoUpLvBtn.label = GlobalConfig.jifengTiaoyueLg.st101096;//"停 止";
			TimerManager.ins().doTimer(500, 0, this.autoUpStar, this);
		}
	}
	stopAutoUp() {
		this._isAutoUp = false;
		this.m_AutoUpLvBtn.label = GlobalConfig.jifengTiaoyueLg.st101097;//"自动提升";
		TimerManager.ins().remove(this.autoUpStar, this);
	};

	autoUpStar() {
		let theGunModel = TheGunModel.getInstance;
		let curRole = this.m_RoleSelectPanel.getCurRole();
		var role = SubRoles.ins().getSubRoleByIndex(curRole);
		let theGunData: TheGunData = theGunModel.theGunDic.get(role.roleID);
		if (!theGunData) {
			return;
		}
		let spearStarConfig = GlobalConfig.ins("SpearStarConfig")[theGunData.star];
		if (spearStarConfig == null && spearStarConfig.exp == 0) {
			this._isAutoUp = false;
			this.m_AutoUpLvBtn.label = GlobalConfig.jifengTiaoyueLg.st101097;//"自动提升";
			TimerManager.ins().remove(this.autoUpStar, this);
			UserTips.ins().showTips(GlobalConfig.jifengTiaoyueLg.st101098);//已经满级
			return;
		}
		let spearLevelConfig = GlobalConfig.ins("SpearLevelConfig")[theGunData.level];
		let itemNum = UserBag.ins().getBagGoodsCountById(0, spearLevelConfig.cost[0].id);
		let gold: number = GameLogic.ins().actorModel.gold;
		if (itemNum >= spearLevelConfig.cost[0].count && gold >= spearLevelConfig.cost[1].count) {
			TheGunSproto.ins().sendTheGunStarUp(role.roleID, false);
		}
		else {
			if (gold < spearLevelConfig.cost[1].count) {
				UserTips.ins().showTips(GlobalConfig.jifengTiaoyueLg.st100323);
			} else
				//勾选了自动购买材料，先去用钻石购买材料
				if (this.m_AutoBuyBox.selected == true) {
					let lastitemNum = spearLevelConfig.cost[0].count - itemNum;
					if (Checker.Money(MoneyConst.yuanbao, ItemStoreConfig.getStoreByItemID(spearLevelConfig.cost[0].id).price * spearLevelConfig.cost[0].count, Checker.YUNBAO_FRAME)) {
						TheGunSproto.ins().sendTheGunStarUp(role.roleID, true);
						return;
					}
				}
				else {
					UserWarn.ins().setBuyGoodsWarn(spearLevelConfig.cost[0].id, spearLevelConfig.cost[0].count - itemNum);
				}
			this._isAutoUp = false;
			this.m_AutoUpLvBtn.label = GlobalConfig.jifengTiaoyueLg.st101097;//"自动提升";
			TimerManager.ins().remove(this.autoUpStar, this);
		}
	};

	private onClickUpLvBtn() {
		let theGunModel = TheGunModel.getInstance;
		let curRole = this.m_RoleSelectPanel.getCurRole();
		var role = SubRoles.ins().getSubRoleByIndex(curRole);
		let theGunData: TheGunData = theGunModel.theGunDic.get(role.roleID);
		if (!theGunData) {
			return;
		}
		let spearStarConfig = GlobalConfig.ins("SpearStarConfig")[theGunData.star];
		if (spearStarConfig == null && spearStarConfig.exp == 0) {
			UserTips.ins().showTips(GlobalConfig.jifengTiaoyueLg.st101098);
			return;
		}
		let spearLevelConfig = GlobalConfig.ins("SpearLevelConfig")[theGunData.level];
		let itemNum = UserBag.ins().getBagGoodsCountById(0, spearLevelConfig.cost[0].id);
		let gold: number = GameLogic.ins().actorModel.gold;
		if (itemNum >= spearLevelConfig.cost[0].count && gold >= spearLevelConfig.cost[1].count) {
			TheGunSproto.ins().sendTheGunStarUp(role.roleID, false);
		} else {
			if (gold < spearLevelConfig.cost[1].count) {
				UserTips.ins().showTips(GlobalConfig.jifengTiaoyueLg.st100323);
			} else
				//勾选了自动购买材料，先去用钻石购买材料
				if (this.m_AutoBuyBox.selected == true) {
					let lastitemNum = spearLevelConfig.cost[0].count - itemNum;
					if (Checker.Money(MoneyConst.yuanbao, ItemStoreConfig.getStoreByItemID(spearLevelConfig.cost[0].id).price * spearLevelConfig.cost[0].count, Checker.YUNBAO_FRAME)) {
						TheGunSproto.ins().sendTheGunStarUp(role.roleID, true);
						return;
					}
				}
				else {
					UserWarn.ins().setBuyGoodsWarn(spearLevelConfig.cost[0].id, spearLevelConfig.cost[0].count - itemNum);
				}
		}

	}

	private onClickUpLayer() {
		let curRole = this.m_RoleSelectPanel.getCurRole();
		var role = SubRoles.ins().getSubRoleByIndex(curRole);
		TheGunSproto.ins().sendTheGunLvUp(role.roleID);
	}


	private onClickStateBtn() {
		let theGunModel = TheGunModel.getInstance;
		let curRole = this.m_RoleSelectPanel.getCurRole();
		var role = SubRoles.ins().getSubRoleByIndex(curRole);
		let theGunData: TheGunData = theGunModel.theGunDic.get(role.roleID);
		ViewManager.ins().open(TheGunStateWin, theGunData);
	}

	private onClickSkill() {
		let curRole = this.m_RoleSelectPanel.getCurRole();
		var role = SubRoles.ins().getSubRoleByIndex(curRole);
		ViewManager.ins().open(TheGunSkillWin, role.roleID);
	}

	private onClickArrImg(evt: egret.TouchEvent) {
		switch (evt.currentTarget) {
			case this.m_LeftArrImg:
				this.m_RightArrImg.visible = true;
				this.m_TheGunAnim.changeAnimLv(this.m_TheGunAnim.m_Lv -= 1);
				break;
			case this.m_RightArrImg:
				if (this.m_TheGunAnim.m_Lv == this.m_TheGunAnim.m_NowLv) {
					this.m_RightArrImg.visible = false;
				}
				this.m_TheGunAnim.changeAnimLv(this.m_TheGunAnim.m_Lv += 1);
				break;
		}
		this.m_LvLab.text = this.m_TheGunAnim.m_Lv + GlobalConfig.jifengTiaoyueLg.st100103;
		this.setArrImg();
	}

	private onClickGetLab1() {
		let theGunModel = TheGunModel.getInstance;
		let curRole = this.m_RoleSelectPanel.getCurRole();
		var role = SubRoles.ins().getSubRoleByIndex(curRole);
		let theGunData: TheGunData = theGunModel.theGunDic.get(role.roleID);
		if (!theGunData) {
			return;
		}
		let spearLevelConfig = GlobalConfig.ins("SpearLevelConfig")[theGunData.level];
		if (spearLevelConfig) {
			UserWarn.ins().setBuyGoodsWarn(spearLevelConfig.cost[0].id);
		}
	}

	UpdateContent(): void {
		this.stopAutoUp();
		this.initData();
	}
}
window["TheGunPanel"] = TheGunPanel