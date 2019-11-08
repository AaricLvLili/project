class LegendModel extends BaseSystem {

    public static ins(): LegendModel {
        return super.ins()
    }

    private m_LegendDressStage = {}
    private m_LegendDressTip = {}

    private m_SaleTime = 0
    private m_SaleStage = 1

    // 获取特卖的剩余时间
    public GetSaleSurplusTime(): number {
        if (!this.m_SaleTime) {
            return 0
        }
        return Math.max(this.m_SaleTime - GameServer.serverTime, 0)
    }

    public IsOpenSale(): boolean {
        return this.GetSaleSurplusTime() > 1 && this.GetSaleConfig() != null
    }

    public GetSaleConfig() {
        return GlobalConfig.ins("LegendSuitSoldConfig")[this.GetSaleId()]
    }

    public GetSaleId(): number {
        return this.m_SaleStage || 1
    }

    public constructor() {
        super()
        this.regNetMsg(S2cProtocol.sc_legend_dress, this._DoLegendDress)
        this.regNetMsg(S2cProtocol.sc_shop_godequip_info, this._DoLegendSale)

        MessageCenter.addListener(GameLogic.ins().postSubRoleChange, this._InitRoleLegendState, this);
        // GameGlobal.MessageCenter.addListener(MessageDef.CHANGE_GOD_EQUIP, this._UpdateRoleLegendState, this);
    }

    private _DoLegendSale(rsp: Sproto.sc_shop_godequip_info_request) {
        this.m_SaleStage = rsp.id
        this.m_SaleTime = rsp.endtime
        GameGlobal.MessageCenter.dispatch(MessageDef.LEGEND_UPDATE_SALE)
    }

    private _InitRoleLegendState() {
        for (let i = 0, len = SubRoles.ins().subRolesLen; i < len; ++i) {
            let [maxStage, maxFullStage] = LegendModel.GetFullStageByRoleIndex(i)
            this.m_LegendDressStage[i] = maxFullStage
        }
    }

    public UpdateRoleLegendState() {
        for (let i = 0, len = SubRoles.ins().subRolesLen; i < len; ++i) {
            let [maxStage, maxFullStage] = LegendModel.GetFullStageByRoleIndex(i)
            if (this.m_LegendDressStage[i] != maxFullStage && maxFullStage != 0) {
                this.m_LegendDressTip[i] = maxFullStage
            }
            this.m_LegendDressStage[i] = maxFullStage
        }
    }

    public IsNewDress(roleIndex: number): boolean {
        return this.m_LegendDressTip[roleIndex] ? true : false
    }

    public GetShowDressIndex(roleIndex: number) {
        return this.m_LegendDressTip[roleIndex] || 1
    }

    public SetNewDress(roleIndex: number) {
        this.m_LegendDressTip[roleIndex] = false
    }

    public SendBuyLegendSale(): void {
        let req = new Sproto.cs_shop_godequip_buy_request
        req.id = this.GetSaleId()
        this.Rpc(C2sProtocol.cs_shop_godequip_buy, req)
    }

    private _DoLegendDress(rsp: Sproto.sc_legend_dress_request) {
        let roleIndex = rsp.roleIndex
        let legendDress = rsp.legendDress
        let role = SubRoles.ins().getSubRoleByIndex(roleIndex)
        if (role) {
            let old = role.legendDress
            role.legendDress = legendDress
            if (old == null && legendDress != null) {
                UserTips.ins().showTips(GlobalConfig.jifengTiaoyueLg.st101760)
            }
            var o = <CharRole>EntityManager.ins().getEntityByHandle(GameGlobal.rolesModel[roleIndex].handle);
            o && o.updateModel()
        }
        GameGlobal.MessageCenter.dispatch(MessageDef.LEGEND_UPDATE_DRESS)
    }

    public SendDress(roleIndex: number, dress: number): void {
        let role = SubRoles.ins().getSubRoleByIndex(roleIndex)
        if (role) {
            if (role.legendDress == dress) {
                return
            }
            if (dress != null) {
                if (role.zhuangbei[DressType.ROLE - 1] > 0) {
                    DressModel.ins().sendUnDressUserReq(roleIndex, DressType.ROLE)
                }
                if (role.zhuangbei[DressType.ARM - 1] > 0) {
                    DressModel.ins().sendUnDressUserReq(roleIndex, DressType.ARM)
                }
            }
            let req = new Sproto.cs_legend_dress_request
            req.roleIndex = roleIndex
            req.legendDress = dress
            this.Rpc(C2sProtocol.cs_legend_dress, req)
        }
    }

    public LegendFragmentRedPoint(): boolean {
        // 满角色状态
        if (SubRoles.ins().subRolesLen < SubRoles.MAX_COUNT) {
            return false
        }
        var itemDataList = UserBag.ins().getBagEquipByLevelSort(5);
        for (let itemData of itemDataList) {
            let quality = itemData.itemConfig.quality
            let has = true
            for (let i = 0, len = SubRoles.ins().subRolesLen; i < len; ++i) {
                let equipData = SubRoles.ins().getSubRoleByIndex(i).getEquipByIndex(itemData.itemConfig.subType)
                let item = equipData.goditem
                if (item.configID == 0 || item.itemConfig.quality < quality) {
                    has = false
                }
            }
        }

        // 		var equipData = SubRoles.ins().getSubRoleByIndex(this._roleId).getEquipByIndex(this.curIndex);
        // var nextEquipData = GlobalConfig.itemConfig[equipData.goditem.configID + 1];

    }

    public IsRedPoint(): boolean {
        return this.IsRedPointLegend() || this.IsRedItem()
    }

    public IsRedPointLegend(): boolean {
        // for (let key in this.m_LegendDressTip) {
        //     if (this.m_LegendDressTip[key]) {
        //         return true
        //     }
        // }
        for (let i = 0, len = SubRoles.ins().subRolesLen; i < len; ++i) {
            var role = SubRoles.ins().getSubRoleByIndex(i)
            for (let j = 0; j < EquipPos.MAX; ++j) {
                if (UserEquip.ins().setLegendEquipItemState(j, role)) {
                    return true
                }
            }
        }

        let itemList = UserBag.ins().getBagEquipByOrangeSplit(5);
        if (itemList.length > 0)
            return true;
        return false
    }

    public IsRedItem(): boolean {
        let count = UserBag.ins().getBagGoodsCountById(UserBag.BAG_TYPE_OTHTER, ItemConst.TREASURE_HUNT)
        if (count > 0) {
            return true
        }
        return false
    }

    public IsRedPointByRole(index: number): boolean {
        var role = SubRoles.ins().getSubRoleByIndex(index)
        if (role == null) {
            return false
        }
        // if (this.m_LegendDressTip[index]) {
        //     return true
        // }
        for (let j = 0; j < EquipPos.MAX; ++j) {
            if (UserEquip.ins().setLegendEquipItemState(j, role)) {
                return true
            }
        }

        // let itemList = UserBag.ins().getBagEquipByOrangeSplit(5);
        // if(itemList.length>0)
        //     return true;

        return false
    }

    public CanEquipTip(itemId: number): boolean {
        let configData = GlobalConfig.itemConfig[itemId]
        if (configData == null) {
            return false
        }
        for (let i = 0; i < SubRoles.MAX_COUNT; ++i) {
            let role = SubRoles.ins().getSubRoleByIndex(i)
            if (role == null) {
                return true
            }
            var equipData = role.getEquipByIndex(configData.subType)
            if (equipData.goditem.itemConfig == null || equipData.goditem.itemConfig == 0) {
                return true
            }
        }
        // for (let i = 0; i < SubRoles.ins().subRolesLen; ++i) {
        //     var equipData = role.getEquipByIndex(configData.subType)
        //     if (equipData.goditem.itemConfig == null || equipData.goditem.itemConfig == 0) {
        //         if (!Checker.Level(configData.zsLevel, configData.lv, false)) {
        //             return true
        //         }
        //     }
        // }
        return false
    }

    public static GetStage(configID) {
        return configID % 10 + 1;
    }

    public static GetFullStageByRoleIndex(index: number) {
        return this.GetFullStageByRole(SubRoles.ins().getSubRoleByIndex(index))
    }

    public static GetFullStageByRole(role: Role) {
        if (role == null) {
            return [0, 0]
        }
        // 同品阶的最大数
        let maxFullStage = 999
        // 单个最大品阶数
        let maxStage = 0
        let isFull = true
        for (let i = 0; i < EquipPos.MAX; ++i) {
            let equipData = role.getEquipByIndex(i);
            if (equipData.goditem.configID > 0) {
                let stage = GodSuitAttrPanel.GetStage(equipData.goditem.configID)
                if (stage > maxStage) {
                    maxStage = stage
                }
                if (stage < maxFullStage) {
                    maxFullStage = stage
                }
            } else {
                isFull = false
            }
        }
        if (maxFullStage == 999 || isFull == false) {
            maxFullStage = 0
        }
        return [maxStage, maxFullStage]
    }
}
window["LegendModel"] = LegendModel