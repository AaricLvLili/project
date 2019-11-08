class RoleInfoPanel extends BaseView implements ICommonWindowTitle, ICommonWindowRoleSelect {
	equips: RoleItem[];
	zhuzaiArr: RoleItem[];

	private totalPower: PowerLabel
	private checkAttr: eui.Image

	private oneKeyChange
	private m_tabGroup = [];
	public tabGroup: eui.Group;

	public m_DanyaoBtn: eui.Button;
	public m_DanyaoBar: eui.ProgressBar;
	public m_DanYaoLab: eui.Label;
	public m_ElementGroup: eui.Group;
	public m_ElementImg: eui.Image;

	windowCommonBg = "pic_bj_20_png";
	private get curRole(): number {
		return this.m_RoleSelectPanel.getCurRole()
	}

	private roleShowPanel: RoleShowPanel
	private m_Context: RoleWin

	public constructor(context: RoleWin) {
		super()
		this.skinName = "RoleInfoSkin";
		this.m_Context = context
		this.roleShowPanel.m_ElementImg.visible = false;
		this.m_DanyaoBar.visible = false;/**先屏蔽丹药系统 */
		this.m_DanYaoLab.visible = false;/**先屏蔽丹药系统 */
	}

	protected childrenCreated(): void {
		this.touchEnabled = false;
		this.touchChildren = true;
		this.m_DanyaoBar.slideDuration = 0;
		this.m_DanyaoBar.labelDisplay.visible = false
		this.equips = [];
		for (var i = 0; i < EquipPos.MAX; i++) {
			this.equips[i] = this['item' + i];
			this.equips[i].touchEnabled = true;
			this.equips[i].isShowJob(false);
		}
		this.zhuzaiArr = [];
		for (var i = 0; i < 4; i++) {
			this.zhuzaiArr[i] = this['zhuzai' + i];
		}

		for (var i = 0; i < this.tabGroup.numChildren; i++) {
			this.m_tabGroup[i] = this['tab' + i];
		}
		this.m_DanyaoBtn.label = GlobalConfig.jifengTiaoyueLg.st100105;
		this.oneKeyChange.label = GlobalConfig.jifengTiaoyueLg.st100106;
	}

	open() {
		this.setDanyaoData();
		this.setElement();
		for (var i = 0; i < this.m_tabGroup.length; i++) {
			this.AddClick(this.m_tabGroup[i], this.onTouchTab);
		}
		this.AddClick(this["tab9"], this.onTouchTab);

		this.AddClick(this.checkAttr, this.onClick);
		this.AddClick(this.oneKeyChange, this.onClick);

		for (var i = 0; i < this.equips.length; i++) {
			this.AddClick(this.equips[i], this.onClick);
		}
		for (var i = 0; i < this.zhuzaiArr.length; i++) {
			this.AddClick(this.zhuzaiArr[i], this.onClick);
		}

		this.observe(MessageDef.CHANGE_EQUIP, this.updataEquip);
		this.observe(MessageDef.CHANGE_WING, this.setWing);
		this.observe(MessageDef.ZHUZAI_DATA_UPDATE, this.updatazhuzaiEquip);
		this.observe(Bless.ins().postBelssUpdate, this.refushBlessInfO);

		this.observe(MessageDef.SKILL_UPDATE, this.setRetPoint);
		this.observe(MessageDef.DELETE_ITEM, this.setRetPoint)
		this.observe(MessageDef.ADD_ITEM, this.setRetPoint)
		this.observe(MessageDef.ITEM_COUNT_CHANGE, this.setRetPoint)
		this.observe(TheGunEvt.THEGUN_DATAUPDATE_MSG, this.setRetPoint)

		this.observe(MessageDef.DANYAO_UPDATE, this.setDanyaoData)
		this.observe(MessageDef.UPDATE_MAINELEMENT, this.setElement);
		this.observe(MessageDef.POWER_CHANGE, this._updatePower)
		this.m_DanyaoBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onClickDanyaoBtn, this)
		this.addTouchEvent(this, this.onClickElement, this.m_ElementGroup);
		for (var i = 0; i < this.zhuzaiArr.length; i++) {
			//this.zhuzaiArr[i].visible = GameLogic.ins().actorModel.level >= 80;
			this.zhuzaiArr[i].count.text = ""
		}

		if (this.m_Context) {
			this.m_Context.updateRedPoint()
			this.setRetPoint();
		}
		this.checkGuide();
	};

	private _updatePower() {
		var role = SubRoles.ins().getSubRoleByIndex(this.curRole);
		if (role)
			this.totalPower.text = role.power.toString();
	}

	private setDanyaoData() {
		let eatCnt = UserBag.ins().eatCnt;
		let config = GlobalConfig.ins("ShuXingDanjcConfig");
		if (config) {
			if (eatCnt < config.Num) {
				this.m_DanyaoBtn.visible = false;
				this.m_DanYaoLab.text = eatCnt + "/" + config.Num;
				this.removeDanyYaoTick();
			} else {
				this.m_DanyaoBtn.visible = true;
				this.addDanyaoTick();
			}
			this.m_DanyaoBar.maximum = config.Num;
			this.m_DanyaoBar.value = eatCnt;
		}
	}
	private onClickDanyaoBtn() {
		let configData = GlobalConfig.ins("ShuXingDanjcConfig");
		if (configData) {
			let yb: number = GameLogic.ins().actorModel.yb;
			if (yb < configData.money) {
				ViewManager.ins().open(ChargeFirstWin);
			} else {
				let str = LanguageString.jifengTiaoyueCh(GlobalConfig.jifengTiaoyueLg.st100101, [configData.money]);
				WarnWin.show(str, function () {
					let yb: number = GameLogic.ins().actorModel.yb;
					if (configData) {
						if (yb >= configData.money) {
							UserBag.ins().sendRefCDDanyaoMsg();
						} else {
							UserTips.ins().showTips(GlobalConfig.jifengTiaoyueLg.st100008);
						}
					}
				}, this);
			}
		}
	}
	private addDanyaoTick() {
		this.removeDanyYaoTick();
		TimerManager.ins().doTimer(1000, 0, this.setDanyaoTime, this);
		this.setDanyaoTime();
	}
	private removeDanyYaoTick() {
		TimerManager.ins().remove(this.setDanyaoTime, this);
	}
	private setDanyaoTime() {
		let eatTime = UserBag.ins().eatTime;
		let tiemText: string = GameServer.GetSurplusTime(eatTime, DateUtils.TIME_FORMAT_11);
		this.m_DanYaoLab.text = tiemText + GlobalConfig.jifengTiaoyueLg.st100102;
	}

	private onTouchTab(evt) {
		switch (evt.currentTarget) {
			case this["tab0"]:
				ViewManager.ins().open(OrangeEquipWin, 0, this.curRole)
				break;
			case this["tab1"]:
				ViewManager.ins().open(ZhuanZhiEquipWin, 0, this.curRole);
				break;
			case this["tab2"]:
				ViewManager.ins().open(DressWin, this.curRole);
				break;
			case this["tab3"]:
				//ViewManager.ins().open(TitleWin);
				GuideUtils.ins().next(this["tab3"]);
				if (Deblocking.Check(DeblockingType.TYPE_61))
					ViewManager.ins().open(ZsWin);
				break;
			case this["tab4"]://纹章
				if (Deblocking.Check(DeblockingType.TYPE_62))
					ViewManager.ins().open(GadWin, 0, this.curRole)
				break;
			case this["tab5"]:
				ViewManager.ins().open(OrangeEquipWin, 1, this.curRole)
				break;
			case this["tab6"]:
				if (Deblocking.Check(DeblockingType.TYPE_15))
					ViewManager.ins().open(ArtifactMainWin)
				break;
			case this["tab7"]:
				ViewManager.ins().open(LoongSoulWin, 0, this.curRole);
				break;
			case this["tab9"]:
				if (Deblocking.Check(DeblockingType.TYPE_81))
					ViewManager.ins().open(RoleAddAttrPointWin, 0, this.curRole);
				break;
			case this["tab8"]:
				if (Deblocking.Check(DeblockingType.TYPE_92))
					ViewManager.ins().open(TheGunWin)
				break;
		}
		// this.btnList.selectedIndex = null;
	}


	close() {
		this.removeDanyYaoTick();
		this.removeObserve()
		this.removeEvents();
		this.roleShowPanel.release();
		for (var i = 0; i < 8; i++) {
			if (this.equips[i])
				this.equips[i].clearEffect();
		}
	};
	refushBlessInfO() {
		this.updataEquip();
		this.setRetPoint();
	};

	updataEquip() {
		var model = SubRoles.ins().getSubRoleByIndex(this.curRole);
		this.setEquip(model);
		this.setEquipPoint(model);
		//向控制器拿数据更新界面
		UserRole.ins().setCanChange();
		Wing.ins().setCanWingEquipChange();
	};

	updatazhuzaiEquip() {
		var model = SubRoles.ins().getSubRoleByIndex(this.curRole);
		this.setEquipPoint(model);
	};

	/** 设置装备 */
	setEquip(role: Role) {
		if (!role)
			return;
		var len = role.getEquipLen2();
		var isHaveBody;
		for (var i = 0; i < len; i++) {
			var element = role.getEquipByIndex(i);
			this.equips[i].model = role;
			this.equips[i].data = element.item;
			this.equips[i].showItemEffect();
			this.equips[i].isShowName(false)
			if (element.item.configID == 0) {
				this.equips[i].setItemImg(i >= 8 ? 'role_25' : ResDataPath.GetEquipDefaultIcon(i));
			}
		}

		// this.roleShowPanel.Set(DressType.ARM, role)
		// this.roleShowPanel.Set(DressType.ROLE, role)
		this.roleShowPanel.creatAnim(role);
		this.totalPower.text = role.power.toString();
	};

	EquipPointConstConfig: any;
	setEquipPoint(role: Role, isOther: boolean = false) {
		var config = GlobalConfig.equipPointBasicConfig;
		if (this.EquipPointConstConfig == null)
			this.EquipPointConstConfig = GlobalConfig.ins("EquipPointGrowUpConfig");
		for (var i = 0; i < 4; i++) {
			var zhuzaiData = role.getZhuZaiDataByIndex(i);
			if (zhuzaiData.lv) {
				var temp = this.EquipPointConstConfig[zhuzaiData.id][zhuzaiData.lv]
				if (temp) {
					//this.zhuzaiArr[i].nameTxt.text = temp.rank + "阶"
					this.zhuzaiArr[i].zhuZaiEquipLv.text = temp.rank + GlobalConfig.jifengTiaoyueLg.st100103;
					this.zhuzaiArr[i].isShowName(false)
				}
			}
			else {
				this.zhuzaiArr[i].nameTxt.text = (config[i + 1].activationLevel / 1000 >> 0) + GlobalConfig.jifengTiaoyueLg.st100104;
			}
			let [img, bgImg] = ZhuzaiEquip.GetBgIconByData(zhuzaiData)
			this.zhuzaiArr[i].setItemImg(img)
			this.zhuzaiArr[i].setItemBg(bgImg)

			this.zhuzaiArr[i].showZhuZaiItemEffect(temp);
			if (!isOther)
				this.zhuzaiArr[i].IsShowRedPoint(zhuzaiData.canLevelup() && zhuzaiData.canAdvance())
		}
	};
	onClick(e) {
		switch (e.currentTarget) {
			case this.checkAttr:
				ViewManager.ins().open(RoleAttrWin, this.curRole);
				break;
			case this.oneKeyChange:
				UserRole.ins().checkHaveCan(true, this.curRole);
				this.setCanChange();
				GuideUtils.ins().next(this.oneKeyChange);
				var btn = (<RoleWin>ViewManager.ins().getView(RoleWin)).closeBtn0;
				GuideUtils.ins().show(btn, 1, 4);
				break;
			default:
				var index = this.zhuzaiArr.indexOf(e.currentTarget);
				if (index >= 0) {
					ViewManager.ins().open(ZhuZaiEquipWin, 0, this.curRole, index);
				}
				break;
		}
	};

	setWing() {
		// this.roleShowPanel.Set(DressType.WING, SubRoles.ins().getSubRoleByIndex(this.curRole))
		let role = SubRoles.ins().getSubRoleByIndex(this.curRole);
		this.roleShowPanel.creatAnim(role);
	};

	setRetPoint() {
		var redPointArrFun = [
			UserEquip.ins().checkOrangeRedPointZy(),
			Deblocking.IsRedDotZhuanZhiBtn(),
			DressModel.ins().mDressModelRedPoint.IsRed(),
			Deblocking.IsRedDotSkillBtn(),
			GadModel.getInstance.checkAllRoleCanChangeItem() || GadModel.getInstance.checkAllRoleCanLvUp(),
			LegendModel.ins().IsRedPointLegend(),
			Deblocking.IsRedDotArtifactBtn(),
			LongHun.ins().CheckRedPoint(),
			TheGunModel.getInstance.checkAllRedPoint(),
			PlayFun.ins().getFuncRedById(DeblockingType.TYPE_81)
		];

		for (var i = 0; i < this.m_tabGroup.length; i++) {
			let obj = this["tab" + i];
			if (obj) {
				obj["redPoint"].visible = redPointArrFun[i];
			}
		}
	};

	setCanChange(data = null) {
		var d = data ? (data[this.curRole] ? data[this.curRole] : []) : [];
		var h;
		var n = this.equips.length;
		for (var i = 0; i < n; i++) {
			this.equips[i].IsShowRedPoint(d[i] ? d[i] : false)
			if (!h)
				h = d[i] ? d[i] : false;
		}
		UIHelper.SetBtnNormalEffe(this.oneKeyChange, h)
	};

	public UpdateContent(): void {
		this.setRetPoint();
		this.setWing();
		this.updataEquip();
		this.setElement();
	}

	private onClickElement() {
		let curRole = this.m_RoleSelectPanel.getCurRole();
		ViewManager.ins().open(RoleElementChangeWin, curRole);
	}

	private setElement() {
		let curRole = this.m_RoleSelectPanel.getCurRole();
		let role: Role = SubRoles.ins().getSubRoleByIndex(this.curRole);
		this.m_ElementImg.source = ResDataPath.GetElementImgName(role.attrElementMianType);
	}

	private checkGuide() {
		if (Setting.currStep == 3 && Setting.currPart == 1) {
			GuideUtils.ins().show(this.oneKeyChange, 1, 3);
		} else if (Setting.currStep == 1 && Setting.currPart == 18) {
			GuideUtils.ins().show(this["tab3"], 18, 1);
		} else if (Setting.currStep == 1 && Setting.currPart == 23) {
			GuideUtils.ins().show(this["tab3"], 23, 1);
		}
		//  else if (Setting.currStep == 1 && Setting.currPart == 25) {
		// 	GuideUtils.ins().show(this["tab3"], 25, 1);
		// }
	}

	m_RoleSelectPanel: RoleSelectPanel
}

window["RoleInfoPanel"] = RoleInfoPanel