class TrSpecialRingWin extends BaseView implements ICommonWindowTitle{

	private ringNameImg: eui.Image
	private attr1: eui.Component
	private attr2: eui.Component
	private ringOtherAttr: eui.Label
	private ringSkillName: eui.Label
	private ringSkillAttr: eui.Label
	private ringTipImg: eui.Image
	private ringIcon: eui.Image
	private rightBtn: eui.Button
	private leftBtn: eui.Button
	private list: eui.List
//	private goBtn: eui.Button
	//private group01: eui.Group
//	private group02: eui.Group
//	private ringActLabel: eui.Label
	private getwayLabel: GetwayLabel
	//private getwayLabel0: eui.Label
	//private consumeName: eui.Label
	//private consumeValue: eui.Label
	private ringEffeGroup: eui.Group
	//private actGroup: eui.Group
	private fullGroup: eui.Label
	private powerLabel: eui.Label
	private noneActiveLabel: eui.Label

	private m_Mc: MovieClip
	private m_ConfigData: any[] = []
	private m_ListData: eui.ArrayCollection

	public mActorData: Sproto.sc_show_other_actor_request
	public mRoleData: Role[] = []

	private m_Context: TrRoleWin
	windowTitleIconName: string = "L特戒R"
	public constructor(context: TrRoleWin) {
		super()
		this.mActorData = context.mActorData
		this.mRoleData=context.mRoleData
		this.skinName = "TrSpecialRingSkin"
		this.name = "特戒"

		this.list.itemRenderer = SpecialRingItem
		let config = GlobalConfig.ins("PublicSpecialringConfig")
		for (let data in config) {
			this.m_ConfigData.push(config[data])
		}
		this.m_ConfigData.sort(function(lhs, rhs) {
			return lhs.id - rhs.id
		})
		this.m_ListData = new eui.ArrayCollection(this.m_ConfigData)
		console.log(this.m_ListData);
		
		this.list.dataProvider = this.m_ListData

		this.m_Mc = new MovieClip
		this.ringEffeGroup.addChild(this.m_Mc)
	}


	open() {

//		this.AddClick(this.goBtn, this._OnClick)	
		this.AddClick(this.getwayLabel, this._OnClick)	
		//this.AddClick(this.getwayLabel0, this._OnClick)	
		this.AddClick(this.leftBtn, this._OnClick)	
		this.AddClick(this.rightBtn, this._OnClick)	
		this.AddItemClick(this.list, this._ItemClick)
		this.observe(MessageDef.RING_UPDATE_DATA, this.UpdateContent)
		this.list.selectedIndex = 0
		this.UpdateContent()
	}
	
	close() {
		
	}

	public OpenRingId(ringId: number): void {
		let index = -1
		for (let i = 0; i < this.m_ConfigData.length; ++i) {
			if (this.m_ConfigData[i].id == ringId) {
				index = i
				break
			}
		}
		if (index != -1) {
			this.list.selectedIndex = index
			UIHelper.ScrollHIndex(this.list, index, 80)
			this._UpdateData()
		} else {
			console.log("not id => " + ringId)
		}
	}

	private _ItemClick(e: eui.ItemTapEvent) {
		this._UpdateData()
	}

	private _OnClick(e: egret.TouchEvent) {
		switch (e.currentTarget) {
			/*case this.goBtn: 
			{
				let ringInfo = this.GetCurRingInfo()
				if (ringInfo && ringInfo.level) {
					let configItemData = GlobalConfig.publicSpeRRConfig[ringInfo.id][ringInfo.level].rankUpItem
					let itemId = configItemData.id
					let itemCount = configItemData.count
					let itemData = UserBag.ins().getBagItemById(itemId)
					if (itemData && itemData.count >= itemCount) {
						SpecialRing.ins().SendUplevel(ringInfo.id)
					} else {
						UserTips.ErrorTip("材料不足")
					}
				} else {
					if (this.GetCurRingId() == SpecialRing.ins().GetCurActId()) {
						ViewManager.ins().open(SpecialRingActivityPanel)
						return
					}

					let id = this.GetCurRingId()
					let config = GlobalConfig.ins("PublicSpecialringConfig")[id]
					if (config.activateid) {
						// 临时，优先使用道具
						let itemData = UserBag.ins().getBagItemById(config.activateid)
						if (itemData && itemData.count >= config.actnum) {
							SpecialRing.ins().SendUplevel(id)
							return
						}
					}
					if (config.pay) {
						if (Checker.Money(MoneyConst.yuanbao, config.pay)) {
							SpecialRing.ins().SendUplevel(id)
						}
					} else {
						let itemData = UserBag.ins().getBagItemById(config.activateid)
						if (itemData && itemData.count >= config.actnum) {
							SpecialRing.ins().SendUplevel(id)
						} else {
							UserTips.ErrorTip("材料不足")
						}
					}
				}
			}
			break*/
			case this.getwayLabel:
			{
				let id = this.GetCurRingId()
				let ringInfo = this.GetCurRingInfo()
				let level = ringInfo && ringInfo.level ? ringInfo.level : 1
				ViewManager.ins().open(SpecialRingPreviewPanel, id, level)
			}
			break
			/*case this.getwayLabel0:
			{
				let ringInfo = this.GetCurRingInfo()
				if (ringInfo && ringInfo.level) {
					UserWarn.ins().setBuyGoodsWarn(SpecialRing.GetRingConfig(ringInfo.id, ringInfo.level).rankUpItem.id);
					// let wayId = GetwayLabel.GainItemWay(SpecialRing.GetRingConfig(ringInfo.id, ringInfo.level).rankUpItem.id)
					// if (wayId) {
					// 	ViewManager.Guide(wayId as any, 0)
					// }
				} else {
					let id = this.GetCurRingId()
					let configData = GlobalConfig.ins("PublicSpecialringConfig")[id]
					if (configData.gainWay) {
						ViewManager.Guide(configData.gainWay[0][1][0], 0)
					}
				}
			}
			break*/
			case this.leftBtn:
			break
			case this.rightBtn:
			break
		}
	};

	private _UpdateList() {
		this.m_ListData.replaceAll(this.m_ConfigData)
	}

	private static _REG = new RegExp("\{(\\w+)\}", "g");

	// public static GetSkillDes(configData: any, level: number) {
	// 	level = level - 1
	// 	let SkillsConfig = GlobalConfig.skillsConfig[GlobalConfig.publicSpeRRConfig[configData.id][level].skillid]
	// 	return SkillsConfig.desc
	// }

	private GetCurRingId(): number {
		let index = this.list.selectedIndex
		let configData = this.m_ConfigData[index]
		return configData.id
	}

	private GetCurRingInfo() {
		return SpecialRing.ins().GetRingData(this.GetCurRingId())
	}

	UpdateContent(): void {
		this._UpdateList()
		this._UpdateData()
	}
    
	private _UpdateData(): void {
		//this.group01.visible = false
	//	this.getwayLabel0.visible = false
		this.fullGroup.visible = false
//		this.actGroup.visible = true
		this.noneActiveLabel.visible = false

		let index = this.list.selectedIndex
		let configData = this.m_ConfigData[index]
		// this.ringSkillName.text = configData.skillname

		let ringInfo = SpecialRing.ins().GetRingData(configData.id)

		// this.ringIcon.source = `ui_tj_jn_0${SpecialRingWin.GetIdIndex(configData.id)}`
		this.ringNameImg.source = TrSpecialRingWin.GetRingNameImg(configData.id)
		// this.ringTipImg.visible = configData.effect ? true : false
		// this.ringTipImg.source = ringInfo.level != 0 ? "ui_tj_p_zi" : "ui_tj_p_zi02"
		TrSpecialRingWin.SetRingTipImg(this.ringTipImg, configData, ringInfo)
		let level = ringInfo.level ? ringInfo.level : 1;
	    
		
        let SkillId = GlobalConfig.publicSpeRRConfig[configData.id][level-1].skillid;
		let Sk_lv=GlobalConfig.skillsConfig[SkillId].displayLevel;
		TrSpecialRingWin.SetSkillAttrLabel(this, configData.id, level,Sk_lv)				
       
		// this.ringSkillAttr.text = SpecialRingWin.GetSkillDes(configData, level)
		let rankConfigData01 = SpecialRing.GetRingConfig(configData.id, level)
		TrSpecialRingWin.SetAttrLabel(this.attr1, AttributeData.getAttStr(rankConfigData01.attrs, 0, 1, "："))
		TrSpecialRingWin.SetAttrLabel(this.attr2, null)
		this.ringOtherAttr.text = rankConfigData01 ? rankConfigData01.announce : ""
		if (ringInfo.level > 0) {
			let rankConfigData = SpecialRing.GetRingConfig(ringInfo.id, ringInfo.level)
			let nextRankConfigData = SpecialRing.GetRingConfig(ringInfo.id, ringInfo.level + 1)
			if (nextRankConfigData) {
				//this.goBtn.label = "升 阶"
				this._SetConsume(rankConfigData.rankUpItem.id, rankConfigData.rankUpItem.count)
				TrSpecialRingWin.SetAttrLabel(this.attr2, AttributeData.getAttStr(nextRankConfigData.attrs, 0, 1, "："), "ui_tj_xjsx")
				this._SetGetwayLabel(GetwayLabel.GainItemLabel(rankConfigData.rankUpItem.id))
			//	this.group02.visible = false
				//this.group01.visible = true
			} else {
				this.fullGroup.visible = true
				//this.actGroup.visible = false
			}
		} else {
			this.ringOtherAttr.text = "属性对所有角色有效"
			//this.goBtn.label = "激 活"
			//this.group01.visible = configData.pay ? false : true
		   //	this.group02.visible = configData.pay ? true : false
			if (configData.pay) {
		  //		this.ringActLabel.text = `花费${configData.pay}钻石激活`
			} else {
				this._SetConsume(configData.activateid, configData.actnum)
			}
			if (configData.gainWay) {
				this._SetGetwayLabel(configData.gainWay[0][0])
			}
		}

		this.powerLabel.text = `战斗力 +${TrSpecialRingWin.GetRingPower(configData.id, level)}`
		this.m_Mc.loadUrl(ResDataPath.GetUIEffePath(`eff_ui_rings_00${TrSpecialRingWin.GetIdIndex(configData.id)}`), true, -1)
		UIHelper.SetIconMovie(this.m_Mc, 0)

		if (configData.day > GameServer.serverOpenDay) {
		//	this.actGroup.visible = false
			this.noneActiveLabel.visible = true
			this.noneActiveLabel.text = `开服第${configData.day}天可以激活`
		} else if (configData.id == SpecialRing.ins().GetCurActId()) {
		//	this.ringActLabel.text = ""
		}
	}

	private _SetGetwayLabel(name): void {
		if (name) {
		//	this.getwayLabel0.visible = true
		//	UIHelper.SetLinkStyleLabel(this.getwayLabel0, "获取材料")
			// this.getwayLabel0.textFlow
			// this.getwayLabel0.textFlow = (new egret.HtmlTextParser).parser(`<font color='#FFBF26'>获取：</font> <a href=\"event:\"><font color='#09C709'><u>${name}</u></font></a>`); 
		} else {
		//	this.getwayLabel0.visible = false
		}
	}

	private _SetConsume(itemId, count): void {
		let itemConfigData = GlobalConfig.itemConfig[itemId]
		//this.consumeName.text = `消耗：${itemConfigData.name}`
		let itemData = UserBag.ins().getBagItemById(itemId)
		//this.consumeValue.textFlow = ConsumeLabel.GetValueColor(itemData ? itemData.count : 0, count)
	}

	public static SetAttrLabelByData(comp: any, id: number, lv: number, title: string = null): void {
		let rankConfig = GlobalConfig.publicSpeRRConfig[id][lv - 1]
		this.SetAttrLabel(comp, AttributeData.getAttStr(rankConfig.attrs, 0, 1, "："))
	}

	public static SetAttrLabel(comp: any, attr: string, title: string = null): void {
		if (attr == null) {
			comp.visible = false
			comp.height = 0
			return
		} 
		comp.visible = true
		comp.height = 106
		comp.curKey.source = title ? title : "ui_tj_tjsx"
		comp.curAttr.text = attr
	}

	public static SetSkillAttrLabel(comp: any, id: number, lv: number,Sk_lv) {
		let config = GlobalConfig.ins("PublicSpecialringConfig")[id]
		let SkillsConfig = GlobalConfig.skillsConfig[GlobalConfig.publicSpeRRConfig[config.id][lv-1].skillid]
		comp.ringSkillName.text = config.skillname + "(Lv"+Sk_lv+")"
		// comp.ringSkillAttr.text = SpecialRingWin.GetSkillDes(config, lv)
		comp.ringSkillAttr.text = SkillsConfig.desc
		comp.ringIcon.source = `ui_tj_jn_0${TrSpecialRingWin.GetIdIndex(id)}`
	}
    
	public static GetIdIndex(id: number): number {
		return id % 10
	}

	public static GetRingEffPath(id: number): string {
		return ResDataPath.GetUIEffePath(`eff_ui_rings_00${TrSpecialRingWin.GetIdIndex(id)}`)
	}

	public static GetRingNameImg(id: number): string {
		return `ui_tj_mz_sj_0${TrSpecialRingWin.GetIdIndex(id)}`
	}

	public static GetRingIconImg(id: number): string {
		return `ui_tj_p_jz0${TrSpecialRingWin.GetIdIndex(id)}`
	}

	public static GetRingPower(id: number, lv: number, fullCount = false): number {
		let rankConfig = GlobalConfig.publicSpeRRConfig[id][lv - 1]
		return (ItemConfig.CalcAttrScoreValue(rankConfig.attrs) + rankConfig.power) * (fullCount ? SubRoles.MAX_COUNT : (SubRoles.ins().subRolesLen || 1))
	}

	public static SetRingTipImg(ringTipImg: eui.Image, configData: any, ringInfo: Sproto.ring_data): void {

		ringTipImg.visible = false
		// ringTipImg.visible = configData.effect ? true : false
		// ringTipImg.source = ringInfo && ringInfo.level != 0 ? "ui_tj_p_zi" : "ui_tj_p_zi02"
	}
}

class TrSpecialRingItem extends eui.ItemRenderer {

	private iconDisplay: eui.Image
	private redPoint: eui.Image
	private label: eui.Label

	private static ICON_LIST = [

	]

	protected dataChanged() {
		let data = this.data
		let ringData = SpecialRing.ins().GetRingData(data.id)
		if (ringData && ringData.level) {
			this.label.text = `${ringData.level} 阶`
			this.label.textColor = Color.Orange
		} else {
			this.label.text = `未激活`
			this.label.textColor = Color.White
		}
		this.redPoint.visible = SpecialRing.ins().IsRedPointById(data.id)
		this.iconDisplay.source = TrSpecialRingWin.GetRingIconImg(data.id)
	}
}

window["TrSpecialRingWin"]=TrSpecialRingWin
window["TrSpecialRingItem"]=TrSpecialRingItem