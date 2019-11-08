class FuwenModel extends BaseSystem {

	private static EMPTY_TABLE = []

	public static ins(): FuwenModel {
		return super.ins()
	}

	public constructor() {
		super()

		this.regNetMsg(S2cProtocol.sc_fuwen_open_ret, this._DoOpenResult)
		this.regNetMsg(S2cProtocol.sc_fuwen_equipup_data, this._DoEquipData)
	}

	private _DoOpenResult(rsp: Sproto.sc_fuwen_open_ret_request) {
		if (rsp.result != 0) {
            console.log("FuwenModel:_DoOpenResult result", rsp.result)
			return
		}
		let role = SubRoles.ins().getSubRoleByIndex(rsp.roleID)
		if (!role) {
			return
		}
		role.fuwen.openStatus = true
		for (let item of role.fuwen.equipDatas) {
			let lv = item.itemConfig.id % 100
			if (lv > role.fuwen.level) {
				role.fuwen.level = lv
			}
		}
		GameGlobal.MessageCenter.dispatch(MessageDef.FUWEN_EQUIP_OPEN)
	}

	private _DoEquipData(rsp: Sproto.sc_fuwen_equipup_data_request) {
		let role = SubRoles.ins().getSubRoleByIndex(rsp.roleID)
		if (!role) {
			return
		}
        let itemData = new ItemData()
		itemData.parser(rsp.data)
		role.fuwen.equipDatas[rsp.equipPos] = itemData
		role.fuwen.level = rsp.level
		GameGlobal.MessageCenter.dispatch(MessageDef.FUWEN_EQUIP_UPDATE)
	}

	public SendEquipup(roleID: number, itemHandle: number, pos: number) {
		let req = new Sproto.cs_fuwen_equipup_request
		req.itemHandle = itemHandle
		req.roleID = roleID 
		req.pos = pos
		this.Rpc(C2sProtocol.cs_fuwen_equipup, req)
	}

	public SendOpen(roleID: number) {
		let req = new Sproto.cs_fuwen_open_request
		req.roleID = roleID
		this.Rpc(C2sProtocol.cs_fuwen_open, req)
	}

	public GetRoleFuwen(roleIndex: number): FuwenItemData {
		let data = SubRoles.ins().getSubRoleByIndex(roleIndex)
		if (!data) {
			return null
		}
		return data.fuwen
	}


	/** 计算符文是否有提示红点 */
	public CalculationFuwenRedPointByRoleIndex(roleIndex: number): boolean {
		let role = SubRoles.ins().getSubRoleByIndex(roleIndex)
		if (!role) {
			return false
		}
		let list = this.CalculationFuwenScore(roleIndex, true, true)
		for (let key in list) {
			if (list[key]) {
				return true
			}
		}
		return false
	}

	/** 计算符文是否有提示红点 */
	public CalculationFuwenRedPoint(): boolean {
		for (let i = 0, len = SubRoles.ins().subRolesLen; i < len; ++i) {
			if (this.CalculationFuwenRedPointByRoleIndex(i)) {
				return true
			}
		}
		return false
	}

    /** 
	 * 计算背包中是否存在高评分的符文，新获取的物品 
	 * 
	 * @param 角色index
	 * @param 只需要当个物品条件
	 * @param 是否只包含新增加的物品
	 * f
	 * @return handle
	 * */
	public CalculationFuwenScore(roleIndex: number, single: boolean = false, onlyNewItem: boolean = false): ItemData[] {
		let role = SubRoles.ins().getSubRoleByIndex(roleIndex)
		if (!role) {
			return FuwenModel.EMPTY_TABLE
		}
		let equipDatas = role.fuwen.equipDatas

		var lv = GameLogic.ins().actorModel.level;
		var zsLv = UserZs.ins().lv;

		let itemSubTypes: {[key: number]: ItemData[]} = {}
		let fuwenItems = UserBag.ins().getBagEquipByType(ItemType.FUWEN)//从背包读取符文
		for (let item of fuwenItems) {
			let configData = item.itemConfig
			// if (onlyNewItem && !item.mIsNewItem) {
			// 	continue
			// }
			if (configData.job != role.job || configData.level > lv || configData.zsLevel > zsLv) {
				continue
			}
			let list = itemSubTypes[configData.subType]
			if (!list) {
				list = itemSubTypes[configData.subType] = []
			}
			list.push(item)
		}

		let upScore: ItemData[] = null

		for (let subType = 0; subType <= equipDatas.length; ++subType) {//对比身上符文
			let list = itemSubTypes[subType]
			if (!list) {
				continue
			}
			let equipData: ItemData = equipDatas[subType]
			let curScore
			if (equipData.configID == 0) {
				curScore = -1
			} else {
				curScore = equipData.point
			}
			for (let data of list) {
				let score = ItemConfig.calculateBagItemScore(data)
                // 只有在装备了道具的时候才需要过滤是否是高级的
				if (curScore != -1 && onlyNewItem && !data.mIsNewItem) {
					continue
				}
				if (score > curScore) {
					if (!upScore) {
						upScore = []
					}
					upScore[subType] = data
					curScore = score
					if (single) {
						break
					}
				}
			}
			if (single && upScore) {
				break
			}
		}
		return upScore || FuwenModel.EMPTY_TABLE
	}

    /**标记是已经查看过的符文 */
	public MarkLookupItem(roleIndex: number) {
		let role = SubRoles.ins().getSubRoleByIndex(roleIndex)
		if (!role) {
			return
		}
		let fuwenItems = UserBag.ins().getBagEquipByType(ItemType.FUWEN)
		for (let item of fuwenItems) {
			if (item.itemConfig.job == role.job) {
				item.mIsNewItem = false
			}
		}
	}

	public showHejiDetail() {
		if (SubRoles.ins().subRolesLen <= 1)
			return;
		let totalConfig = {
			"PlayerEnhance":0,
			"MonsterEnhance":0,
			"power":0,
		};
		for (let i = 0; i < SubRoles.ins().subRolesLen; ++i) {
			let fuwen = SubRoles.ins().getSubRoleByIndex(i).fuwen
			let fuwenConfig = GlobalConfig.ins("FuwenLevelConfig")[fuwen.level]
			totalConfig.PlayerEnhance += fuwenConfig.PlayerEnhance;
			totalConfig.MonsterEnhance += fuwenConfig.MonsterEnhance;
			totalConfig.power += fuwenConfig.power;
		}
		let comp = new eui.Component
		comp.skinName = "FuwenTipsSkin"
		comp.currentState = "total"
		comp["cd"].text = GlobalConfig.skillsConfig[UserSkill.POWER_SKILL].cd/1000 + "S";
		comp["info0"].text = `对玩家造成${totalConfig.PlayerEnhance/100}%伤害`
		comp["info1"].text = `对怪物造成${totalConfig.MonsterEnhance/100}%伤害`
		comp["power"].text = `战斗力：${totalConfig.power}`
		comp["powerLabel"].text = totalConfig.power + "";
		comp["gotoLabel"].addEventListener(egret.TouchEvent.TOUCH_TAP, () => {
			if (Deblocking.Check(DeblockingType.TYPE_07)) {
				ViewManager.ins().open(ZsWin, 1)
			}
		}, null)
		comp.addEventListener(egret.TouchEvent.TOUCH_END, () => {
				comp.$getEventMap()[egret.TouchEvent.TOUCH_END] = null;
				LayerManager.UI_Popup.removeChild(comp)
			}, comp);
		LayerManager.UI_Popup.addChild(comp)
	}
}
window["FuwenModel"]=FuwenModel