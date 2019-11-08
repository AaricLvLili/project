class FuwenPanel extends BaseView implements ICommonWindowRoleSelect, ICommonWindowTitle {

	private powerLabel: PowerLabel
	private oneKeyBtn: eui.Button
	private openBtn: eui.Image
	private ronglianBtn: eui.Button

	private m_Items: IFuwenItem[]
	private m_FuwenIndex = 0

	private getwayLabel: eui.Button

	private levelLabel: eui.Label
	private itemGroup: eui.Group;
	// private mc_s: MovieClip[] = [];
	private isUp: boolean = false;//是否提升 
	private redIndex: boolean[] = [false, false, false, false, false, false, false, false, false];

	private mcIconEff: MovieClip;
	private mcBgEff: MovieClip;

	public m_BgEffGroup: eui.Group;
	public m_IconEffGroup: eui.Group;
	private languageTxt: eui.Label;

	public constructor() {
		super()
		this.skinName = "FuwenPanelSkin";
	}

	protected childrenCreated(): void {
		super.childrenCreated();
		this.oneKeyBtn.label = GlobalConfig.jifengTiaoyueLg.st100283;
		this.languageTxt.text = GlobalConfig.jifengTiaoyueLg.st100284;
	}

	public open() {
		this.initMc();
		this.m_Items = <IFuwenItem[]>this.itemGroup.$children
		for (let item of this.m_Items) {
			item.item.isShowJob(false)
			item.item.itemIcon.ResetScale()
			this.AddClick(item, this._OnItemClick)
		}
		this.AddClick(this.oneKeyBtn, this._OnClick)
		this.AddClick(this.ronglianBtn, this._OnClick)
		this.AddClick(this.openBtn, this._OnClick)
		this.AddClick(this.getwayLabel, this._OnClick)
		this.observe(MessageDef.FUWEN_EQUIP_UPDATE, this._DoEventUpdate)
		this.observe(MessageDef.FUWEN_EQUIP_OPEN, this._DoEventUpdate)
		this.observe(MessageDef.FUWEN_EQUIP_REPLACE, this._DoEventReplace)
	}

	private initMc() {
		if (!this.mcBgEff) {
			this.mcBgEff = new MovieClip;
			this.mcBgEff.x = this.m_BgEffGroup.width / 2;
			this.mcBgEff.y = this.m_BgEffGroup.height / 2;
			this.m_BgEffGroup.addChildAt(this.mcBgEff, 1);
		}
		this.mcBgEff.loadUrl(ResDataPath.GetUIEffePath("eff_rune_bg"), true, -1);
		if (!this.mcIconEff) {
			this.mcIconEff = new MovieClip;
			this.mcIconEff.x = this.m_IconEffGroup.width / 2;
			this.mcIconEff.y = this.m_IconEffGroup.height / 2;
			this.m_IconEffGroup.addChildAt(this.mcIconEff, this.getChildIndex(this.openBtn) + 1);
		}
		this.mcIconEff.loadUrl(ResDataPath.GetUIEffePath("eff_rune_icon"), true, -1);
	}

	public close() {
		DisplayUtils.dispose(this.mcBgEff);
		this.mcBgEff = null;
		DisplayUtils.dispose(this.mcIconEff);
		this.mcIconEff = null;
	}

	private _DoEventUpdate() {
		UserTips.ins().showTips(GlobalConfig.jifengTiaoyueLg.st100274);//装备符文成功
		this.UpdateContent()
	}

	private _OnClick(e: egret.TouchEvent) {
		switch (e.currentTarget) {
			case this.oneKeyBtn:

				let upScoreItems = FuwenModel.ins().CalculationFuwenScore(this.m_RoleSelectPanel.getCurRole())
				for (let type = ItemConfig.FuwenEquipSlot.Slot0; type < ItemConfig.FuwenEquipSlot.Count; ++type) {
					let item = upScoreItems[type]
					if (item) {
						this.isUp = true;
						FuwenModel.ins().SendEquipup(this.m_RoleSelectPanel.getCurRole(), item.handle, type)
					}
				}

				break

			case this.openBtn:
				// let fuwen = this._GetCurFuwenData()
				// if (fuwen.openStatus) {
				if (UserSkill.ins().CheckHejiSkill()) {
					this.showFuwenZhenDetail();
				}

				break

			case this.ronglianBtn:
				// ViewManager.ins().close(ZsWin);
				// ViewManager.ins().open(SmeltEquipTotalWin);
				this.showFuwenAllAttr()
				break


			case this.getwayLabel:
				FuwenPanel.BuyGoodsWarn()
				break

		}
	}

	public showFuwenZhenDetail() {
		let role = SubRoles.ins().getSubRoleByIndex(this.m_RoleSelectPanel.getCurRole())
		let fuwen = role.fuwen
		let fuwenConfig = GlobalConfig.ins("FuwenLevelConfig")[fuwen.level]
		let comp = new eui.Component
		let totalPower: number = 0;
		comp.skinName = "FuwenTipsSkin"
		comp["cd"].text = GlobalConfig.skillsConfig[UserSkill.POWER_SKILL].cd / 1000 + "S";
		comp["jobLevelLabel"].text = Role.jobNumberToName(role.job) + GlobalConfig.jifengTiaoyueLg.st100275 + "：";//符文套装等级
		comp["jobEffeLabel"].text = Role.jobNumberToName(role.job) + GlobalConfig.jifengTiaoyueLg.st100276 + "：";//符文套装加成
		comp["nextJobEffeLabel"].text = Role.jobNumberToName(role.job) + GlobalConfig.jifengTiaoyueLg.st100276 + "：";//符文套装加成
		comp["lv"].text = this._GetFuwenLevelText(fuwen.level)
		let upvalue = 0;
		if (SubRoles.ins().subRolesLen > 1) {
			comp["lv0"].text = comp["lv"].text
			comp["info0"].text = GlobalConfig.jifengTiaoyueLg.st100277 + `${fuwenConfig.PlayerEnhance / 100}%`;//"合击技能对玩家伤害"
			comp["info1"].text = GlobalConfig.jifengTiaoyueLg.st100278 + `${fuwenConfig.MonsterEnhance / 100}%`;//"合击技能对怪物伤害"

			for (let i = 0; i < SubRoles.ins().subRolesLen; ++i) {
				let fuwen = SubRoles.ins().getSubRoleByIndex(i).fuwen
				let fuwenConfig = GlobalConfig.ins("FuwenLevelConfig")[fuwen.level]
				totalPower += fuwenConfig.power;
			}
			comp["powerLabel"].text = totalPower + "";
		} else {
			comp["lv0"].text = GlobalConfig.jifengTiaoyueLg.st100279;//"未开启";
			comp["info0"].text = GlobalConfig.jifengTiaoyueLg.st100280;//"无"
			comp["info1"].visible = false
			comp["powerLabel"].text = 0 + "";
			upvalue = 138;
		}
		comp["power"].text = GlobalConfig.jifengTiaoyueLg.st100306 + `：${fuwenConfig.power}`
		let nextlv = Role.GetNextLv(fuwen.level);
		if (nextlv) {
			fuwenConfig = GlobalConfig.ins("FuwenLevelConfig")[nextlv]
			comp["lv1"].text = this._GetFuwenLevelText(nextlv) + "";
			comp["info2"].text = GlobalConfig.jifengTiaoyueLg.st100277 + `${fuwenConfig.PlayerEnhance / 100}%`;//合击技能对玩家伤害
			comp["info3"].text = GlobalConfig.jifengTiaoyueLg.st100278 + `${fuwenConfig.MonsterEnhance / 100}%`;//合击技能对怪物伤害

			let stateList = []
			let count = 0
			let text = ""
			for (let i = 0, len = fuwen.equipDatas.length; i < len; ++i) {
				let data = fuwen.equipDatas[i]
				let s = data.itemConfig != null && (data.itemConfig.zsLevel * 1000 + data.itemConfig.level) >= nextlv
				count += s ? 1 : 0
				stateList.push(s)
				text += StringUtils.addColor(Role.typeFuwenNumberToName(i) + " ", s ? Color.Green : Color.Gray)
			}

			comp["nextLevelTip"].text = LanguageString.jifengTiaoyueCh(GlobalConfig.jifengTiaoyueLg.st100281, [this._GetFuwenLevelText(nextlv), count, stateList.length]);
			comp["nextLabelList"].textFlow = TextFlowMaker.generateTextFlow(text)
		} else {
			upvalue = 141;
		}
		if (upvalue > 0) {
			comp["group"].height -= upvalue;
			comp["background"].height -= upvalue;
			let group: eui.Group = comp["moreGroup"];
			for (let i = 0; i < group.numChildren; ++i) {
				group.getChildAt(i).visible = false;
			}
		}
		comp.addEventListener(egret.TouchEvent.TOUCH_END, () => {
			comp.$getEventMap()[egret.TouchEvent.TOUCH_END] = null;
			LayerManager.UI_Popup.removeChild(comp)
		}, comp);
		// this.addChild(comp);
		LayerManager.UI_Popup.addChild(comp)
		// WarnWin.ShowContent(comp, () => {}, this, null, null, "sure")
	}

	private EquipConfig: any;

	public showFuwenAllAttr() {

		let levelInfo = ""
		let hurtInfo1 = 0
		let hurtInfo2 = 0
		let baseAttr = [], addAttr = [], cfgAttr = [];
		for (let job = 0; job <= JobConst.DaoShi; ++job) {
			let role = SubRoles.ins().GetSubRoleByJob(job)
			if (role == null) {
				continue
			}
			let fuwen = role.fuwen
			if (fuwen.level > 0) {
				if (levelInfo.length > 0) {
					levelInfo += "\n"
				}
				levelInfo += `|C:0xD2C76A&T:${Role.jobNumberToName(job)}${GlobalConfig.jifengTiaoyueLg.st100275}：|C:0x535557&T:${this._GetFuwenLevelText(fuwen.level)}|`
			}
			let fuwenConfig = GlobalConfig.ins("FuwenLevelConfig")[fuwen.level]
			hurtInfo1 += fuwenConfig.PlayerEnhance
			hurtInfo2 += fuwenConfig.MonsterEnhance
			if (this.EquipConfig == null)
				this.EquipConfig = GlobalConfig.equipConfig;
			for (let i = 0; i < ItemConfig.FuwenEquipSlot.Count; ++i) {
				let config = this.EquipConfig[fuwen.equipDatas[i].configID];
				if (config) {
					for (let k in Role.translate) {
						let value = config[k]
						if (value <= 0)
							continue;
						let v = baseAttr[k]
						if (v) {
							value += v
						}
						baseAttr[k] = value
					}
					addAttr = AttributeData.AttrAddition(addAttr, fuwen.equipDatas[i].att);
					cfgAttr = AttributeData.AttrAddition(cfgAttr, config.baseAttr);
				}
			}
		}

		let comp = new eui.Component
		comp.skinName = "FuwenAllAttrSkin"
		comp["languageTxt"].text = GlobalConfig.jifengTiaoyueLg.st100285;
		comp["languageTxt0"].text = GlobalConfig.jifengTiaoyueLg.st100301 + "：";
		comp["languageTxt1"].text = GlobalConfig.jifengTiaoyueLg.st100304 + "：";
		comp["des"].text = GlobalConfig.jifengTiaoyueLg.st100286;

		let upvalue = 0;

		if (levelInfo.length > 0) {
			comp["lvInfo"].textFlow = TextFlowMaker.generateTextFlow(levelInfo)
		} else {
			comp["lvInfo"].textFlow = TextFlowMaker.generateTextFlow(`|C:0xD2C76A&T:${GlobalConfig.jifengTiaoyueLg.st100275}：|C:0x535557&T:0${GlobalConfig.jifengTiaoyueLg.st100093}|`)
		}
		if (SubRoles.ins().subRolesLen >= 2 && hurtInfo1 > 0) {
			comp["infoHurt"].textFlow = TextFlowMaker.generateTextFlow(`|C:0xCA8A00&S:20&T:` + GlobalConfig.jifengTiaoyueLg.st100276 + `：|\n${GlobalConfig.jifengTiaoyueLg.st100277} +${Math.floor(hurtInfo1 / 100)}%\n${GlobalConfig.jifengTiaoyueLg.st100278} +${Math.floor(hurtInfo2 / 100)}%`)
		} else {
			comp["infoHurt"].text = GlobalConfig.jifengTiaoyueLg.st100282;//"合击技能未开启"
		}

		let k = 0;
		addAttr.forEach(element => {
			if (baseAttr[Role.inverseTranslate[element.type]])
				comp["attr" + k].text = AttributeData.getAttrStrByType(element.type)
					+ ": " + baseAttr[Role.inverseTranslate[element.type]]
					+ " +" + element.value;
			++k;
		});
		if (cfgAttr.length == 0) {
			comp["moreAttr"].text = GlobalConfig.jifengTiaoyueLg.st100280;//"无"
		} else {
			let text = ""
			cfgAttr.forEach(element => {
				if (text.length > 0) {
					text += "\n"
				}
				text += AttributeData.getAttStr(element, 0, 1, ": ");
			})
			comp["moreAttr"].text += text
		}
		/*comp["moreGroup1"].height = comp["moreAttr"].height + 60
		let group = comp["group"] as eui.Group
		let y = -28
		for (let i = 0; i < group.numChildren; ++i) {
			let g = group.getChildAt(i)
			// g.y = y
			y += g.height + 20
		}
		comp["background"].height = y + 80*/
		comp["background"].height = 550 + comp["moreAttr"].height

		comp.addEventListener(egret.TouchEvent.TOUCH_END, () => {
			comp.$getEventMap()[egret.TouchEvent.TOUCH_END] = null;
			LayerManager.UI_Popup.removeChild(comp)
		}, comp);
		// this.addChild(comp);
		LayerManager.UI_Popup.addChild(comp)
	}

	public static BuyGoodsWarn() {
		UserWarn.ins().setBuyGoodsWarn(501001, 1);
	}

	private _OnItemClick(e) {
		let typeIndex = this.m_Items.indexOf(e.currentTarget)
		if (typeIndex == -1) {
			return
		}

		let fuwen = this._GetCurFuwenData().equipDatas
		let itemData = fuwen[typeIndex]
		if (!itemData) {
			return
		}
		let id = itemData.configID
		if (id == 0) {
			ViewManager.ins().open(FuwenListPanel, this.m_RoleSelectPanel.getCurRole(), typeIndex)
			return
		}
		var data = GlobalConfig.itemConfig[id];
		ViewManager.ins().open(EquipDetailedWin, 1, itemData.handle, data.id, itemData, null, typeIndex);

		// let comp = new eui.Component
		// comp.skinName = "FuwenTipsSkin"

		// comp["item"].data = id
		// comp["info"].text = data.name
		// // comp["info0"].text = data.desc.split("\n")[0];
		// comp["power"].text = `评分：${ItemConfig.calculateBagItemScore(itemData)}`

		// WarnWin.ShowContent(comp, () => {
		// 	ViewManager.ins().open(FuwenListPanel, this.m_RoleSelectPanel.getCurRole(), typeIndex)
		// }, this, null, null, "sure", {
		// 	"btnName": "替换"
		// })
	}

	private _DoEventReplace(typeIndex) {
		ViewManager.ins().open(FuwenListPanel, this.m_RoleSelectPanel.getCurRole(), typeIndex)
	}

	private _GetCurFuwenData(): FuwenItemData {
		return SubRoles.ins().getSubRoleByIndex(this.m_RoleSelectPanel.getCurRole()).fuwen
	}

	m_RoleSelectPanel?: RoleSelectPanel
	private _GetFuwenLevelText(level): string {
		return level < 1000 ? `${level}` + GlobalConfig.jifengTiaoyueLg.st100093 : `${level / 1000}` + GlobalConfig.jifengTiaoyueLg.st100067;
	}

	private _fuwenPosIcon = [
		"comp_80_80_07",
		"comp_80_80_03",
		"comp_80_80_04",
		"comp_80_80_10",
		"comp_80_80_05",
		"comp_80_80_11",
		"comp_80_80_06",
		"comp_80_80_09",
		"comp_80_80_08",
	]
	private _fuwenPosIconWu = [
		"comp_80_80_22",
		"comp_80_80_21",
		"comp_80_80_20",
		"comp_80_80_19",
		"comp_80_80_18",
		"comp_80_80_17",
		"comp_80_80_16",
		"comp_80_80_15",
		"comp_80_80_23",
	]
	private _fuwenPosIconBg = [
		"comp_80_80_24",
		"comp_80_80_25",
		"comp_80_80_26",
		"comp_80_80_27",
		"comp_80_80_28",
		"comp_80_80_27",
		"comp_80_80_26",
		"comp_80_80_25",
		"comp_80_80_24",
	]


	UpdateContent(): void {
		let fuwen = this._GetCurFuwenData()

		let FuwenLevelConfig = GlobalConfig.ins("FuwenLevelConfig")[fuwen.level]
		let power = fuwen.openStatus && FuwenLevelConfig.power || 0
		for (let i = 0, len = fuwen.equipDatas.length; i < len; ++i) {
			let fuwenData = fuwen.equipDatas[i]
			let item = this.m_Items[i]
			if (fuwenData.configID == 0) {
				item.item.clear()
				item.item.itemIcon.setItemImg(this._fuwenPosIconWu[i] + "_png")
				item.imgBg.source = "comp_80_80_29_png";
				// item.item.itemIcon.setItemBg("ui_fw_dk_0")
				item.item.itemIcon.hideItemBg(false)
			} else {
				item.imgBg.source = this._fuwenPosIconBg[i] + "_png"
				power += ItemConfig.calculateBagItemScore(fuwenData)
				item.item.data = fuwenData.configID
				item.item.itemIcon.setItemImg(this._fuwenPosIcon[i] + "_png")
				// item.item.itemIcon.setItemBg("ui_fw_dk_"+(fuwenData.itemConfig.quality+1))
				item.item.itemIcon.hideItemBg(false)
				if (this.isUp && this.redIndex[i]) {
					// this.mc_s[i] = new MovieClip;
					// this.mc_s[i].x = item.x;
					// this.mc_s[i].y = item.y;
					// this.mc_s[i].blendMode = egret.BlendMode.ADD;
					// this.mc_s[i].loadUrl(ResDataPath.GetUIEffePath("eff_rune_set"), true, 1), this.addChild(this.mc_s[i]);
					var effMc: MovieClip = new MovieClip();
					effMc.x = item.x + 40;
					effMc.y = item.y + 31;
					effMc.loadUrl(ResDataPath.GetUIEffePath("eff_rune_set"), true, 1, (obj) => {
						DisplayUtils.dispose(obj);
						obj = null;
					});
					this.itemGroup.addChild(effMc);
				}

			}
			item.item.nameTxt.y = 115 //
			item.item.itemIcon.imgBg.verticalCenter = 1
			item.item.itemIcon.imgBg.horizontalCenter = -0.5
		}
		this.powerLabel.text = power
		this.isUp = false;
		let showTipEff = false
		let fuwenModel = FuwenModel.ins()
		let upScoreItems = fuwenModel.CalculationFuwenScore(this.m_RoleSelectPanel.getCurRole())
		/**设置红点显示 */
		for (let type = ItemConfig.FuwenEquipSlot.Slot0; type < ItemConfig.FuwenEquipSlot.Count; ++type) {
			let upScoreItem = upScoreItems[type]
			if (upScoreItem && upScoreItem.mIsNewItem) {
				showTipEff = true
			}
			this.m_Items[type].item.IsShowRedPoint(upScoreItem ? true : false)
			this.redIndex[type] = upScoreItem ? true : false;
		}
		for (let i = 0, len = SubRoles.ins().subRolesLen; i < len; ++i) {
			this.m_RoleSelectPanel.showRedPoint(i, fuwenModel.CalculationFuwenRedPointByRoleIndex(i));
		}
		// 是否显示特效
		UIHelper.SetBtnNormalEffe(this.oneKeyBtn, showTipEff)
		FuwenModel.ins().MarkLookupItem(this.m_RoleSelectPanel.getCurRole())

		this.levelLabel.text = `${GlobalConfig.jifengTiaoyueLg.st100275}：${this._GetFuwenLevelText(fuwen.level)}`//符文套装等级
	}

	// 帮助按钮Id
	mWindowHelpId?: number = 17
}

interface IFuwenItem extends eui.Component {
	item: ItemBase
	addImg: eui.Image
	imgBg: eui.Image
}
window["FuwenPanel"] = FuwenPanel