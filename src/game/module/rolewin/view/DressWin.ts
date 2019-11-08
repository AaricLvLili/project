class DressWin extends BaseEuiPanel implements ICommonWindow, ICommonWindowTitle, ICommonWindowRoleSelect {

	// 定义view对象的层级
	public static LAYER_LEVEL = LayerManager.UI_Main
	public wingCommonConfig: any;
	windowTitleIconName: string = GlobalConfig.jifengTiaoyueLg.st100611;
	public constructor() {
		super()
		this.skinName = "DressSkin"
		this.dressOffBtn.label = GlobalConfig.jifengTiaoyueLg.st100802;
		this.roleShowPanel.m_ElementImg.visible = false;
	}

	totalPowerNum = 0
	id = 0
	isItemEnough = !1
	lastLv = 0

	expBar
	// listInfo: DressItemInfo[]
	arry: eui.ArrayCollection;
	list: eui.List
	mc

	itemName: eui.Image
	dressBtn: eui.Button;
	dressOnBtn: eui.Button;
	dressOffBtn: eui.Button;


	public mDressBody = 0
	public mDressWeapon = 0
	public mDressWing = 0
	public mDressMount = 0;
	public mDressTao = 0 //套装
	public mDressTitle = 0;

	private commonWindowBg: CommonWindowBg
	private powerLabel: PowerLabel
	private roleShowPanel: RoleShowPanel

	private selectType: boolean = false;			//切换羽翼
	private languageTxt: eui.Label;

	public createChildren() {
		super.createChildren();
		this.list.itemRenderer = DressItemRenderer
		this.arry = new eui.ArrayCollection();
		this.list.dataProvider = this.arry;
	}
	initUI() {
		this.expBar.slideDuration = 0
		this.commonWindowBg.SetTabDatas(new eui.ArrayCollection(GlobalConfig.ins("ZhuangBanConfig").zhuangbanpos))
		this.languageTxt.text = GlobalConfig.jifengTiaoyueLg.st100629;
	}

	open(...param: any[]) {
		this.list.selectedIndex = -1
		DressModel.ins().sendDressInfoReq()
		GameGlobal.MessageCenter.addListener(MessageDef.DRESS_INFO, this.UpdateContent, this)
		GameGlobal.MessageCenter.addListener(MessageDef.DRESS_UN_INFO, this.UpdateUnDress, this)
		GameGlobal.MessageCenter.addListener(MessageDef.TITLE_SHOW, this.updateSetTitle, this);
		GameGlobal.MessageCenter.addListener(MessageDef.DRESS_JIHUORES, this.onJihuo, this)

		this.itemName.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onClick, this)
		this.list.addEventListener(eui.ItemTapEvent.ITEM_TAP, this.onChange, this)
		this.dressBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onClick, this)
		this.dressOnBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onClick, this)
		this.dressOffBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onClick, this)
		this.commonWindowBg.OnAdded(this, param[1], param[0])
		if (Title.ins().list == null)
			Title.ins().sendGetList();
	}

	close() {
		GameGlobal.MessageCenter.removeListener(MessageDef.DRESS_INFO, this.UpdateContent, this)
		GameGlobal.MessageCenter.removeListener(MessageDef.DRESS_JIHUORES, this.onJihuo, this)
		GameGlobal.MessageCenter.removeListener(MessageDef.DRESS_UN_INFO, this.UpdateUnDress, this)
		GameGlobal.MessageCenter.removeListener(MessageDef.TITLE_SHOW, this.updateSetTitle, this);
		// this.help.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onClick, this)
		this.list.removeEventListener(eui.ItemTapEvent.ITEM_TAP, this.onChange, this)
		this.itemName.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onClick, this)
		this.dressBtn.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onClick, this)
		this.dressOnBtn.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onClick, this)
		this.dressOffBtn.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onClick, this)
		// this.lastWeapon = 0
		// this.lastBody = 0
		this.roleShowPanel.release();
		this.lastLv = 0
		if (this.mc) {
			DisplayUtils.dispose(this.mc);
			this.mc = null;
		}
	}

	private initMc() {
		if (!this.mc) {
			this.mc = new MovieClip
			this.mc.x = 244
			this.mc.y = 345
		}
	}

	onChange(e: eui.ItemTapEvent) {
		this.dress = e.item
		let id = this.dress.zhuanban.id || this.dress.zhuanban.Id
		let typeStr
		switch (this.dress.zhuanban.pos) {
			case 1:
				typeStr = "mDressBody"
				this.mDressTao = 0;
				break
			case 2:
				typeStr = "mDressWeapon"
				this.mDressTao = 0;
				break
			case 3:
				typeStr = "mDressWing"
				this.mDressTao = 0;
				break
			case 4:
				typeStr = "mDressMount"
				this.mDressTao = 0;
				break;
			case 5:
				this.mDressBody = 0
				this.mDressWeapon = 0
				typeStr = "mDressTao"
				break;
		}
		if (this.dress.isTitle) typeStr = "mDressTitle"
		if (id == this[typeStr]) {
			this.dress = null
			this[typeStr] = 0
		} else {
			this[typeStr] = id
		}
		for (let i = 0; i < this.list.numChildren; ++i) {
			(this.list.getChildAt(i) as DressItemRenderer).UpdateSelect()
		}
		this.selectType = true;
		if (this.dress && this.dress.isTitle) {
			this._updataTitleInfo()
		} else
			this.onInfoUpdate()
		// if (this.arry) {
		// 	this.arry.replaceAll(this.arry.source);
		// }
		// let titleList = Title.ins().dressTitleList;
		// if (titleList) {
		// 	titleList.replaceAll(titleList.source);
		// }

	}
	private _updataTitleInfo(): void {
		if (this.dress) {
			this.selectGroup.visible = true
			this.unSelectGroup.visible = false
			this.m_RightGroup.visible = false;
			this.dressBtn.visible = false;
			this.dressOffBtn.visible = this.dress.isUser;
			this.dressOnBtn.visible = false;
			this.dressOffBtn.horizontalCenter = 0;
			this.dressOffBtn.label = this.dress.zhuanban.Id == Title.ins().showID ? GlobalConfig.jifengTiaoyueLg.st100612 : GlobalConfig.jifengTiaoyueLg.st100613;//`脱下` : `穿戴`
			this.m_LeftGroup.horizontalCenter = 40;
			this.attrLabel.text = AttributeData.getAttStr(AttributeData.transformAttr(this.dress.zhuanban.attrs), 0, 1, ":");
			this.attrPower.text = GlobalConfig.jifengTiaoyueLg.st100306 + ":" + GameGlobal.getAttrPower(AttributeData.transformAttr(this.dress.zhuanban.attrs));
			this.dressName.text = this.dress.isUser ? GlobalConfig.jifengTiaoyueLg.st100614 : GlobalConfig.jifengTiaoyueLg.st100615 + "：" + this.dress.zhuanban.condition
			this.onupdateEquip(true)
		} else {
			this.selectGroup.visible = false
			this.unSelectGroup.visible = true
			this.dressOffBtn.visible = false;
			this.dressOnBtn.visible = false;
			this.dressBtn.visible = false;
		}
	}
	careerRedPoint() {
		var job = GameGlobal.rolesModel[this.m_RoleSelectPanel.getCurRole()].job;
		var list = GameGlobal.dressmodel.posRedPoint(job)
		for (var i = 0; 5 > i; i++)
			this.commonWindowBg.ShowTalRedPoint(i, list[i])
	}


	private m_PreRole = null
	private m_PreIndex = -1

	UpdateUnDress(roleIndex, posIndex) {
		if (this.m_RoleSelectPanel.getCurRole() != roleIndex) {
			return
		}
		switch (posIndex) {
			case DressType.ROLE:
				this.mDressBody = 0
				break
			case DressType.ARM:
				this.mDressWeapon = 0
				break
			case DressType.WING:
				this.mDressWing = 0
				break
			case DressType.MOUNT:
				this.mDressMount = 0;
				break
			case DressType.TaoZhuang:  //套装
				this.mDressBody = 0
				this.mDressWeapon = 0
				this.mDressTao = 0//
				break
		}
		// this.m_AutoIsSelect = -1
		this.UpdateContent()
	}

	private zhuangBanId: any;

	UpdateContent() {
		let curRole = this.m_RoleSelectPanel.getCurRole()
		// this.m_SubRoleData = SubRoles.ins().getSubRoleByIndex(curRole).GetSubRoleData()
		if (this.m_PreRole != null && curRole != this.m_PreRole) {
			// this.m_AutoIsSelect = -1
			this.list.selectedIndex = -1

			this.lastLv = 0
			this.mDressBody = 0
			this.mDressWeapon = 0
			this.mDressWing = 0
			this.mDressMount = 0;
			this.mDressTao = 0
			this.mDressTitle = 0;
		}
		if (this.m_PreIndex != null && this.selectedIndex != this.m_PreIndex) {
			this.lastLv = 0
		}

		this.dress = null
		let zhuanbei = GameGlobal.rolesModel[curRole].zhuangbei
		this.mDressBody = this.mDressBody || zhuanbei[DressType.ROLE - 1] || 0
		this.mDressWeapon = this.mDressWeapon || zhuanbei[DressType.ARM - 1] || 0
		this.mDressWing = this.mDressWing || zhuanbei[DressType.WING - 1] || 0
		this.mDressMount = this.mDressMount || zhuanbei[DressType.MOUNT - 1] || 0
		this.mDressTao = this.mDressTao || zhuanbei[DressType.TaoZhuang - 1] || 0
		this.mDressTitle = this.mDressTitle || SubRoles.ins().getSubRoleByIndex(0).title || 0;


		this.m_PreRole = curRole
		this.m_PreIndex = this.selectedIndex

		var dressModel = GameGlobal.dressmodel;
		this.zhuangBanId = GlobalConfig.zhuangBanId;

		let pos = this.selectedIndex;
		if (pos == 6) {
			this._updateTitle()
			this.commonWindowBg.roleSelectPanel.visible == false
			return;
		}

		this.commonWindowBg.roleSelectPanel.visible == true
		let listInfo = [];
		for (var t in this.zhuangBanId) {
			if (GameGlobal.rolesModel[curRole].job == this.zhuangBanId[t].roletype && pos == this.zhuangBanId[t].pos) {
				var info = new DressItemInfo;
				info.weight = 0;
				info.context = this
				info.zhuanban = this.zhuangBanId[t];
				info.isTitle = false
				for (var len = dressModel.timeInfo.length, i = 0; len > i; i++) {
					if (info.zhuanban.id == dressModel.timeInfo[i].dressId) {
						info.isUser = true
						info.timer = dressModel.timeInfo[i].invalidtime
						info.weight += 100;
					}
				}
				if (info.zhuanban.id == dressModel.GetDressIDByRole(curRole, pos - 1)) {
					info.isDress = true
					info.weight += 1000;
				}
				info.weight += this.setRedVisible(info)
				listInfo.push(info)
			}
		}

		let curId = this._GetCurDressId()
		for (let info of listInfo) {
			if (curId == info.zhuanban.id) {
				this.dress = info
				break
			}
		}
		listInfo.sort(this.sorWeight);
		this.list.dataProvider = this.arry;
		this.arry.removeAll();
		this.arry.replaceAll(listInfo);
		this.arry.refresh();
		this.onInfoUpdate()
		this.redPoint()
		this.careerRedPoint()
	}
	private setRedVisible(data: DressItemInfo): number {
		var t = data.zhuanban.cost.itemId,
			i = data.zhuanban.cost.num;
		var n = GameGlobal.dressmodel.getinfoById(data.zhuanban.id);
		if (n) {
			if (UserBag.ins().getBagGoodsCountById(0, t) >= i && n.dressLevel < 5) {
				return 10;
			}
		} else {
			if (UserBag.ins().getBagGoodsCountById(0, t) >= i) {
				return 10;
			}
		}
		return 0;
	}
	/**关联排序 */
	private sorWeight(item1: { weight: number }, item2: { weight: number }): number {
		return item2.weight - item1.weight;
	}
	private _updateTitle(): void {
		this.list.dataProvider = Title.ins().dressTitleList
		for (let i = 0, len = this.arry.source.length; i < len; i++) {
			let item = this.arry.source[i]
			if (this.mDressTitle == item.zhuanban.Id) {
				this.dress = item
				break
			}
		}
		this.onupdateEquip(true)
	}
	private updateSetTitle(roleIndex, titleID, lastID): void {
		this.mDressTitle = titleID
		let tips = titleID ? GlobalConfig.jifengTiaoyueLg.st100616 : GlobalConfig.jifengTiaoyueLg.st100617;
		UserTips.ins().showTips("|C:0xf87372&T:" + tips);
		this.onupdateEquip(true)
		this._updataTitleInfo()
	}

	private _GetCurDressId(): number {
		switch (this.selectedIndex) {
			case DressType.ROLE:
				return this.mDressBody
			case DressType.ARM:
				return this.mDressWeapon
			case DressType.WING:
				return this.mDressWing
			case DressType.MOUNT:
				return this.mDressMount
			case DressType.TaoZhuang:  //套装
				return this.mDressTao
		}
		return 0
	}

	redPoint() {
		for (var e = GameGlobal.rolesModel.length, t = 0; e > t; t++) {
			var i = GameGlobal.dressmodel.canDress(GameGlobal.rolesModel[t].job, this.selectedIndex, t);
			this.m_RoleSelectPanel.showRedPoint(t, i)
		}
	}

	private get selectedIndex(): number {
		return this.commonWindowBg.GetSelectedIndex() + 1
	}

	private _dress: DressItemInfo

	public set dress(value) {
		this._dress = value;
	}

	public get dress() {
		return this._dress;
	}
	expMaxImg
	expMaxTip
	selectGroup
	unSelectGroup

	currentInfo
	namelabel

	// nameImage
	dressName
	currShengjiConfig
	expLabel
	shengjiConfig
	expBarBg

	attrLabel
	attrPower
	public m_LeftGroup: eui.Group;
	public m_RightGroup: eui.Group;

	public attrLabel0: eui.Label;
	public attrPower0: eui.Label;


	onInfoUpdate() {
		this.updatePower()
		if (this.dress) {
			let config = GlobalConfig.ins("ZhuangBanShengJi")[this.dress.zhuanban.id];
			this.currentInfo = GameGlobal.dressmodel.getinfoById(this.dress.zhuanban.id);
			let nextLvConfig: any;
			if (this.currentInfo && config) {
				nextLvConfig = config[this.currentInfo.dressLevel];
			}
			if (!nextLvConfig) {
				this.m_RightGroup.visible = false;
				this.m_LeftGroup.horizontalCenter = 40;
			} else {
				this.m_RightGroup.visible = true;
				this.m_LeftGroup.horizontalCenter = -80;
			}
			this.expMaxImg.visible = !1
			this.expMaxTip.visible = !1
			this.selectGroup.visible = !0
			this.unSelectGroup.visible = !1
			// this.itemName.visible = !0
			this.itemName.visible = false;
			this.namelabel.visible = !0
			this.dressBtn.visible = !0
			this.attrLabel.text = AttributeData.getAttStr(AttributeData.transformAttr(this.dress.zhuanban.attr), 0, 1, ":")
			this.attrPower.text = GlobalConfig.jifengTiaoyueLg.st100306 + ":" + GameGlobal.getAttrPower(AttributeData.transformAttr(this.dress.zhuanban.attr))
			if (nextLvConfig) {
				this.attrLabel0.text = AttributeData.getAttStr(AttributeData.transformAttr(nextLvConfig.attr), 0, 1, ":")
				this.attrPower0.text = GlobalConfig.jifengTiaoyueLg.st100306 + ":" + GameGlobal.getAttrPower(AttributeData.transformAttr(nextLvConfig.attr))
			}
			// this.nameImage.source = "dress" + this.dress.zhuanban.id + "n_png"
			this.dressName.text = GlobalConfig.jifengTiaoyueLg.st100618 + "：" +/**"属性-"*/  this.dress.zhuanban.name + "×1"
			this.id = this.dress.zhuanban.cost.itemId

			var num = 0
			let itemId = 0


			if (this.currentInfo && config) {
				this.expLabel.text = this.currentInfo.dressLevel + GlobalConfig.jifengTiaoyueLg.st100093;
				this.currShengjiConfig = config[this.currentInfo.dressLevel]
				this.shengjiConfig = config[this.currentInfo.dressLevel - 1]
				if (this.lastLv != this.currentInfo.dressLevel && 0 != this.lastLv && !this.selectType) {
					this.playEff()
				}
				this.lastLv = this.currentInfo.dressLevel
			}
			this.selectType = false;
			if (this.dress.isUser) {
				this.dressOnBtn.visible = !this.dress.isDress
				this.dressOffBtn.visible = this.dress.isDress

				if (0 == this.dress.timer) {
					this.dressBtn.label = GlobalConfig.jifengTiaoyueLg.st100596;
					this.setExpBarVis(!0)
					this.expBarChange()
					if (this.shengjiConfig && this.currentInfo.dressLevel > 1) {
						this.attrLabel.textFlow = (new egret.HtmlTextParser).parser(AttributeData.getAttStr(AttributeData.AttrStringAddition2(this.dress.zhuanban.attr, config, this.currentInfo.dressLevel), 0, 1, ":", !1, "#23C42A"))
						this.attrPower.text = GlobalConfig.jifengTiaoyueLg.st100306 + ":" + GameGlobal.getAttrPower(AttributeData.AttrStringAddition2(this.dress.zhuanban.attr, config, this.currentInfo.dressLevel))
						if (nextLvConfig) {
							this.attrLabel0.textFlow = (new egret.HtmlTextParser).parser(AttributeData.getAttStr(AttributeData.AttrStringAddition2(this.dress.zhuanban.attr, config, this.currentInfo.dressLevel + 1), 0, 1, ":", !1, "#23C42A"))
							this.attrPower0.text = GlobalConfig.jifengTiaoyueLg.st100306 + ":" + GameGlobal.getAttrPower(AttributeData.AttrStringAddition2(this.dress.zhuanban.attr, config, this.currentInfo.dressLevel + 1))
						}
						num = this.shengjiConfig.cost.num, itemId = this.shengjiConfig.cost.itemId
					} else {
						if (this.shengjiConfig) {
							this.attrLabel.text = AttributeData.getAttStr(AttributeData.transformAttr(this.dress.zhuanban.attr), 0, 1, ":");
							this.attrPower.text = GlobalConfig.jifengTiaoyueLg.st100306 + ":" + GameGlobal.getAttrPower(AttributeData.transformAttr(this.dress.zhuanban.attr));
							if (nextLvConfig) {
								this.attrLabel0.text = AttributeData.getAttStr(AttributeData.AttrStringAddition2(this.dress.zhuanban.attr, config, this.currentInfo.dressLevel + 1), 0, 1, ":");
								this.attrPower0.text = GlobalConfig.jifengTiaoyueLg.st100306 + ":" + GameGlobal.getAttrPower(AttributeData.AttrStringAddition2(this.dress.zhuanban.attr, config, this.currentInfo.dressLevel + 1));
							}
							num = this.shengjiConfig.cost.num, itemId = this.shengjiConfig.cost.itemId
						} else {
							this.attrLabel.text = AttributeData.getAttStr(AttributeData.transformAttr(this.dress.zhuanban.attr), 0, 1, ":");
							this.attrPower.text = GlobalConfig.jifengTiaoyueLg.st100306 + ":" + GameGlobal.getAttrPower(AttributeData.transformAttr(this.dress.zhuanban.attr));
							if (nextLvConfig) {
								this.attrLabel0.text = AttributeData.getAttStr(AttributeData.AttrStringAddition2(this.dress.zhuanban.attr, config, this.currentInfo.dressLevel + 1), 0, 1, ":");
								this.attrPower0.text = GlobalConfig.jifengTiaoyueLg.st100306 + ":" + GameGlobal.getAttrPower(AttributeData.AttrStringAddition2(this.dress.zhuanban.attr, config, this.currentInfo.dressLevel + 1));
							}
						}
					}
				} else {
					this.dressBtn.label = GlobalConfig.jifengTiaoyueLg.st100619;//"续 期"
					this.setExpBarVis(!1)
					this.attrLabel.text = AttributeData.getAttStr(AttributeData.transformAttr(this.dress.zhuanban.attr), 0, 1, ":");
					this.attrPower.text = GlobalConfig.jifengTiaoyueLg.st100306 + ":" + GameGlobal.getAttrPower(AttributeData.transformAttr(this.dress.zhuanban.attr));
					if (nextLvConfig) {
						this.attrLabel0.text = AttributeData.getAttStr(AttributeData.transformAttr(this.dress.zhuanban.attr), 0, 1, ":");
						this.attrPower0.text = GlobalConfig.jifengTiaoyueLg.st100306 + ":" + GameGlobal.getAttrPower(AttributeData.transformAttr(this.dress.zhuanban.attr));
					}
					num = this.dress.zhuanban.cost.num
					itemId = this.id
				}

			} else {
				this.dressBtn.label = GlobalConfig.jifengTiaoyueLg.st100212;//"激 活"
				this.dressOnBtn.visible = !1
				this.dressOffBtn.visible = !1
				this.setExpBarVis(!1)
				this.attrLabel.text = AttributeData.getAttStr(AttributeData.transformAttr(this.dress.zhuanban.attr), 0, 1, ":");
				this.attrPower.text = GlobalConfig.jifengTiaoyueLg.st100306 + ":" + GameGlobal.getAttrPower(AttributeData.transformAttr(this.dress.zhuanban.attr));
				if (nextLvConfig) {
					this.attrLabel0.text = AttributeData.getAttStr(AttributeData.transformAttr(this.dress.zhuanban.attr), 0, 1, ":");
					this.attrPower0.text = GlobalConfig.jifengTiaoyueLg.st100306 + ":" + GameGlobal.getAttrPower(AttributeData.transformAttr(this.dress.zhuanban.attr));
				}
				num = this.dress.zhuanban.cost.num
				itemId = this.id
			}
			if (this.dressBtn.visible) {
				this.dressOffBtn.horizontalCenter = -81.5;
				this.dressOnBtn.horizontalCenter = -81.5;
			}
			else {
				this.dressOffBtn.horizontalCenter = 0;
				this.dressOnBtn.horizontalCenter = 0;
			}
			this.isItemEnough = UserBag.ins().getBagGoodsCountById(0, this.id) < num
			this.setItemText(this.dress.zhuanban.imageLink);
			// this.setItemText(itemId, num)
			// this.onupdateEquip(false)
		}
		else {
			this.selectGroup.visible = false
			this.unSelectGroup.visible = true
			this.dressOffBtn.visible = false;
			this.dressOnBtn.visible = false;
			this.dressBtn.visible = false;
		}
		this.onupdateEquip(true)
		this.dressOffBtn.visible || this.dressOnBtn.visible ? this.dressBtn.x = 246 : this.dressBtn.x = 175;
	}

	setItemText(imageStr: string) {
		// if (0 == e && 0 == t) return void (this.itemName.visible = !1);
		// var str = UserBag.ins().getBagGoodsCountById(0, e) >= t
		// 	? "<font color = '#23C42A'><u>" + GlobalConfig.itemConfig[e].name + "×" + t + "</u></font>"
		// 	: "<font color = '#00ff00'><u>" + GlobalConfig.itemConfig[e].name + "×" + t + "</u></font>"

		// this.itemName.textFlow = (new egret.HtmlTextParser).parser(str)

		// this.itemName.source = imageStr + "_png";
	}

	setExpBarVis(e) {
		this.expBar.visible = e, this.expBarBg.visible = e, this.expLabel.visible = e
	}

	updatePower() {
		var e = GameGlobal.dressmodel.timeInfo,
			t = e.length;
		this.totalPowerNum = 0;
		for (var i = 0; t > i; i++)
			if (GameGlobal.rolesModel[this.m_RoleSelectPanel.getCurRole()].job == this.getZhuangbanById(e[i].dressId).roletype) {
				// this.totalPowerNum += GameGlobal.getAttrPower(AttributeData.transformAttr(this.getZhuangbanById(e[i].dressId).attr));
				// var n = GlobalConfig.ins("ZhuangBanShengJi")[e[i].dressId];
				// if (n) {
				// 	var r = n[e[i].dressLevel - 1];
				// 	this.totalPowerNum += GameGlobal.getAttrPower(AttributeData.transformAttr(r.attr))
				// }
				var n = GlobalConfig.ins("ZhuangBanShengJi")[e[i].dressId];
				var baseAttr = this.getZhuangbanById(e[i].dressId).attr;
				this.totalPowerNum += GameGlobal.getAttrPower(AttributeData.AttrStringAddition2(baseAttr, n, e[i].dressLevel))
			}
		// BitmapNumber.ins().changeNum(this.totalPower, this.totalPowerNum, "1")
		this.powerLabel.text = this.totalPowerNum
	}

	onupdateEquip(e = false) {
		let role = SubRoles.ins().getSubRoleByIndex(this.m_RoleSelectPanel.getCurRole());
		if (this.mDressBody > 0 || this.mDressWeapon > 0 || this.mDressTao > 0) {
			role.legendDress = null
		}
		this.roleShowPanel.creatAnim(role);
		this.setWing(this.mDressWing)
		this.setEquip(this.mDressBody, this.mDressWeapon, this.mDressMount, this.mDressTitle, this.mDressTao);
	}

	setWing(id: number) {
		if (id > 0) {
			this.roleShowPanel.setCharRoleWing(id, 1);
		} else {
			var wingData: WingsData = GameGlobal.rolesModel[this.m_RoleSelectPanel.getCurRole()].wingsData;
			if (wingData.openStatus) {
				this.roleShowPanel.setCharRoleWing(0, wingData.lv);
			} else {
				this.roleShowPanel.setCharRoleWing(0, null);
			}
		}
	}

	setEquip(bodyId, weaponId, mountId, titleId, DressTaoId) {

		// let role = SubRoles.ins().getSubRoleByIndex(this.m_RoleSelectPanel.getCurRole()).GetSubRoleData()
		// if (weaponId > 0 || bodyId > 0) {
		// 	role.legendDress = null
		// }
		// role.zhuangbei[DressType.ROLE - 1] = bodyId
		// role.zhuangbei[DressType.ARM - 1] = weaponId

		// this.roleShowPanel.Set(DressType.ARM, role)
		// this.roleShowPanel.Set(DressType.ROLE, role)
		this.roleShowPanel.setCharRoleBody(bodyId);
		this.roleShowPanel.setCharRoleWeapon(weaponId);
		this.roleShowPanel.setCharRoleMount(mountId);
		this.roleShowPanel.setCharRoleTitle(titleId)
		this.roleShowPanel.setCharRoleTao(DressTaoId)
	}

	getZhuangbanById(e) {
		if (this.zhuangBanId == null) {
			this.zhuangBanId == GlobalConfig.ins("ZhuangBanId");
		}
		for (var t in this.zhuangBanId)
			if (this.zhuangBanId[t].id == e) return this.zhuangBanId[t];
		return null
	}

	onJihuo() {
		this.dress && this.dress.zhuanban && DressModel.ins().sendDressUserReq(this.m_RoleSelectPanel.getCurRole(), this.dress.zhuanban.id)
	}

	onClick(e) {
		if (this.wingCommonConfig == null)
			this.wingCommonConfig = GlobalConfig.ins("WingCommonConfig");

		switch (e.target) {
			// case this.help:
			// App.ViewManager.open(ViewConst.ZsBossRuleSpeak, 8);
			// break;
			case this.itemName:
				if (ErrorLog.Assert(this.id, "DressWin   this.id :" + this.id)) break;
				var t = GlobalConfig.itemConfig[this.id];
				void 0 != t && t && void 0 != t.type && (0 == t.type || 4 == t.type ? ViewManager.ins().open(EquipDetailedWin, 1, void 0, t.id) : ViewManager.ins().open(ItemDetailedWin, 0, t.id));
				break;
			case this.dressBtn:
				if (ErrorLog.Assert(this.dress && this.dress.zhuanban, "DressWin　　" + this.dress + " ++++++ " + this.dress.zhuanban)) return;
				if (GlobalConfig.jifengTiaoyueLg.st100212 == this.dressBtn.label) {//激活
					if (3 == this.dress.zhuanban.pos && GameGlobal.actorModel.level < this.wingCommonConfig.openLevel)
						return void UserTips.ins().showTips("|C:0xf87372&T:" + this.wingCommonConfig.openLevel + GlobalConfig.jifengTiaoyueLg.st100620 + "|");
					this.checkItemAlert(this.dressBtn.label)
				} else GlobalConfig.jifengTiaoyueLg.st100596 == this.dressBtn.label//提升
					? this.checkItemAlert(this.dressBtn.label)
					: GlobalConfig.jifengTiaoyueLg.st100619 == this.dressBtn.label && this.checkItemAlert(this.dressBtn.label);//续期
				break;
			case this.dressOnBtn:
				DressModel.ins().sendDressUserReq(this.m_RoleSelectPanel.getCurRole(), this.dress.zhuanban.id)
				break;
			case this.dressOffBtn:
				if (this.dress && this.dress.isTitle) {
					let id = this.dress.zhuanban.Id == Title.ins().showID ? 0 : this.dress.zhuanban.Id
					Title.ins().setTitle(id);
					return
				}
				DressModel.ins().sendUnDressUserReq(this.m_RoleSelectPanel.getCurRole(), this.selectedIndex)
				break;
		}
	}

	checkItemAlert(e) {
		var i = GlobalConfig.ins("ZhuangBanConfig").zhuangbanpos;
		var n = this.dress.zhuanban;
		var t = Role.getJobNameByJob(n.roletype);
		var cutNum = 1;
		switch (e) {
			case GlobalConfig.jifengTiaoyueLg.st100212://激活
				if (this.isItemEnough) return void UserTips.ins().showTips("|C:0xf87372&T:" + GlobalConfig.jifengTiaoyueLg.st100621 + "|");
				WarnWin.show(LanguageString.jifengTiaoyueCh(GlobalConfig.jifengTiaoyueLg.st100622, [(t + i[n.pos - cutNum]), n.name]), function () {
					DressModel.ins().sendDressActivationReq(n.id)
				}, this);
				break;
			case GlobalConfig.jifengTiaoyueLg.st100596://提升
				if (this.isItemEnough) return void UserTips.ins().showTips("|C:0xf87372&T:" + GlobalConfig.jifengTiaoyueLg.st100625 + "|");
				WarnWin.show(LanguageString.jifengTiaoyueCh(GlobalConfig.jifengTiaoyueLg.st100623, [(t + i[n.pos - cutNum]), n.name]), function () {
					DressModel.ins().sendTiShengReq(n.id)

				}, this);
				break;
			case GlobalConfig.jifengTiaoyueLg.st100619://续期
				if (this.isItemEnough) return void UserTips.ins().showTips("|C:0xf87372&T:" + GlobalConfig.jifengTiaoyueLg.st100626 + "|");
				WarnWin.show(LanguageString.jifengTiaoyueCh(GlobalConfig.jifengTiaoyueLg.st100624, [(t + i[n.pos - cutNum]), n.name]), function () {
					DressModel.ins().sendXuFeiReq(n.id)
				}, this)
		}
	}

	expBarChange() {
		var e = this;
		if (!this.currShengjiConfig)
			return this.itemName.visible = !1, this.namelabel.visible = !1, this.dressBtn.visible = !1, this.expBar.maximum = 1, this.expBar.value = 1, this.expMaxImg.visible = !0, void (this.expMaxTip.visible = !0);
		var t = this.currentInfo.dressExp,
			i = Number(this.currShengjiConfig.needexp);
		t > i && (t = i), this.expBar.maximum = i, this.expBar.value = t, egret.Tween.removeTweens(this.expBar);
		var n = egret.Tween.get(this.expBar);
		return this.expBar.maximum != i ? void n.to({
			value: this.expBar.maximum
		}, 1e3).wait(200).call(() => {
			egret.Tween.removeTweens(this.expBar);
			e.expBar.maximum = i, e.expBar.value = t, e.expBarChange()
		}, this) : void n.to({
			value: t
		}, 1e3)
	}

	playEff() {
		this.initMc();
		if (this.mc) {
			if (this.mc.parent == null)
				this.addChild(this.mc);
			this.mc.loadUrl(ResDataPath.GetUIEffePath("promoteeff"), true, 1, () => {
				DisplayUtils.dispose(this.mc);
				this.mc = null;
			});
		}
	}

	OnBackClick(clickType: number): number {
		return 0
	}
	OnOpenIndex(openIndex: number): boolean {
		return true
	}

	m_RoleSelectPanel: RoleSelectPanel

	mWindowHelpId = 9

	// private m_SubRoleData: SubRole

	// private get curRole(): number {
	// 	return this.m_RoleSelectPanel.getCurRole()
	// }
}
window["DressWin"] = DressWin