class UserForge extends BaseSystem {

    private zhulingCostConfig: any;
    public constructor() {
        super();

        this.sysId = PackageID.strongthen;
        //this.regNetMsg(2, this.doForgeUpdata);
        this.regNetMsg(S2cProtocol.sc_forge_update_data, this.doForgeUpdata);
    }

    public static ins(): UserForge {
        return super.ins()
    }

    public doForgeUpdata(rsp: Sproto.sc_forge_update_data_request) {
        var roleId = rsp.roleId;
        SubRoles.ins().getSubRoleByIndex(roleId).parseForgeChange(rsp, this.sysId);
        this.postForgeUpdate(this.sysId);
    };
    /**派发锻造数据变更 */
    public postForgeUpdate(sysid) {
        return sysid;
    };
    /**派发锻造提示 */
    // public postForgeTips(b) {
    //     return b;
    // };
    /**
     * 提升请求
     * @param roleId 角色
     * @param pos 部位
     */
    public sendUpGrade(roleId: number, pos: number, canUseYuanbao: boolean = false) {
        var cs_forge_upgrade_grade = new Sproto.cs_forge_upgrade_grade_request();
        cs_forge_upgrade_grade.roleId = roleId;
        cs_forge_upgrade_grade.pos = pos;
        cs_forge_upgrade_grade.canUseYuanbao = canUseYuanbao;
        GameSocket.ins().Rpc(C2sProtocol.cs_forge_upgrade_grade, cs_forge_upgrade_grade);
        // var bytes = this.getBytes(2);
        // bytes.writeShort(roleId);
        // bytes.writeShort(pos);
        // this.sendToServer(bytes);
    };
    public seekForgeItem() {
        var isReturn = Bless.ins().checkIsHaveUp();//器灵
        var len = UserBag.ins().getBagItemNum(UserBag.BAG_TYPE_OTHTER);
        for (var i = 0; i < len; i++) {
            if (isReturn)
                break;
            var item = UserBag.ins().getBagGoodsByIndex(0, i);
            switch (item.itemConfig.id) {
                case 200002:
                    isReturn = this.forgeHint(0, item.count);
                    break;
                case 200003:
                    isReturn = this.forgeHint(1, item.count);
                    break;
                case 200012:
                    isReturn = this.forgeHint(3, item.count);
                    break;
            }
            if (!isReturn)
                isReturn = this.forgeHint(2, GameLogic.ins().actorModel.soul);
        }
        return isReturn
    };
    //----------------------------------------------------
    /**
 * 通过部位等级 获取锻造相关配置  0 强化配置 1 宝石配置 2注灵配置 3 突破配置
 * @param pos 部位
 * @param lv  等级
 * @param configType 配置类型
 */
    public getForgeConfigByPos(pos, lv, configType) {
        var list;
        switch (configType) {
            case 0:
                list = GlobalConfig.ins("EnhanceAttrConfig");
                break;
            case 1:
                list = GlobalConfig.ins("StoneLevelConfig");
                break;
            case 2:
                list = GlobalConfig.ins("ZhulingAttrConfig");
                break;
            case 3:
                list = GlobalConfig.ins("TupoAttrConfig");
                break;
        }
        var index;
        var config;
        for (index in list) {
            config = list[index];
            if (config.posId == pos) {
                if (config.level == lv)
                    return config;
            }
        }
        return null;
    };
    /**
     * 通过等级获取强化消耗配置
     * @param lv 等级
     */
    public getEnhanceCostConfigByLv(lv) {
        var list = GlobalConfig.ins("EnhanceCostConfig");
        var index;
        for (index in list) {
            var config = list[index];
            if (config.level == lv)
                return config;
        }
        return null;
    };
    /**
     * 通过等级获取宝石消耗配置
     * @param lv 等级
     */
    public getStoneLevelCostConfigByLv(lv) {
        var list = GlobalConfig.ins("StoneLevelCostConfig");
        var index;
        for (index in list) {
            var config = list[index];
            if (config.level == lv)
                return config;
        }
        return null;
    };
    /**
     * 通过等级获取注灵消耗配置
     * @param lv 等级
     */
    public getZhulingCostConfigByLv(lv) {
        if (this.zhulingCostConfig == null)
            this.zhulingCostConfig = GlobalConfig.ins("ZhulingCostConfig");
        var list = this.zhulingCostConfig;
        var index;
        for (index in list) {
            var config = list[index];
            if (config.level == lv)
                return config;
        }
        return null;
    };
    /**
     * 通过等级获取突破消耗配置
     * @param lv 等级
     */
    public getTupoCostConfigByLv(lv) {
        var list = GlobalConfig.ins("TupoCostConfig");
        var index;
        for (index in list) {
            var config = list[index];
            if (config.level == lv)
                return config;
        }
        return null;
    };
    //	public getForgeIsBoost(num:number):boolean{
    //		let config: EnhanceCostConfig = this.getEnhanceCostConfigByLv(LogicManager.ins().rolesModel[]);
    //		return;
    //	}
    //----------------------------------锻造提示
    public forgeHint(type, itemNum) {
        var len = SubRoles.ins().subRolesLen;
        for (var i = 0; i < len; i++) {
            var role = SubRoles.ins().getSubRoleByIndex(i);
            var index = role.getMinEquipIndexByType(type);
            var lv = this.getForgeLv(type, role, index);
            var costNum = this.getForgeCount(type, lv);
            if (costNum) {
                if (itemNum >= costNum) {
                    return true;
                }
            }
        }
        return false;
    };
    public getForgeLv(type, role, index) {
        switch (type) {
            case 0:
                return role.getEquipByIndex(index).strengthen;
            case 1:
                return role.getEquipByIndex(index).gem;
            case 2:
                return role.getEquipByIndex(index).zhuling;
            case 3:
                return role.getEquipByIndex(index).tupo;
        }
    };
    public getForgeCount(type, lv) {
        switch (type) {
            case 0:
                var boostConfig = this.getEnhanceCostConfigByLv(lv + 1);
                if (boostConfig)
                    return boostConfig.stoneNum;
                break;
            case 1:
                var gemConfig = this.getStoneLevelCostConfigByLv(lv + 1);
                if (gemConfig)
                    return gemConfig.count;
                break;
            case 2:
                var zhulingConfig = this.getZhulingCostConfigByLv(lv + 1);
                if (zhulingConfig)
                    return zhulingConfig.soulNum;
                break;
            case 3:
                // var tupoConfig = this.getTupoCostConfigByLv(lv + 1);
                // if (tupoConfig)
                //     return tupoConfig.count;
                return 0;
        }
        return 0;
    };

    /**注灵一键强化 */
    public sendEssenceOneKey(roleId: number) {
        let rsp = new Sproto.cs_essence_onekey_request;
        rsp.roleId = roleId;
        this.Rpc(C2sProtocol.cs_essence_onekey, rsp);
    }

    /**强化一键强化 */
    public sendForgeOneKey(roleId: number) {
        let rsp = new Sproto.cs_forge_onekey_request;
        rsp.roleId = roleId;
        this.Rpc(C2sProtocol.cs_forge_onekey, rsp);
    }

    /**宝石一键强化 */
    public sendGemOneKey(roleId: number) {
        let rsp = new Sproto.cs_gem_onekey_request;
        rsp.roleId = roleId;
        this.Rpc(C2sProtocol.cs_gem_onekey, rsp);
    }
    /**获取当前的级别 */
    public getMaxLv(type: number, roleId: number): number {
        var model = SubRoles.ins().getSubRoleByIndex(roleId);
        var n = 8;
        let maxLv: number = 0;
        for (var i = 0; i < n; i++) {
            let num: number;
            switch (type) {
                case 0:
                    num = model.getEquipByIndex(i).strengthen;
                    if (num) {
                        maxLv += num;
                    }
                    break;
                case 1:
                    num = model.getEquipByIndex(i).gem;
                    if (num) {
                        maxLv += num;
                    }
                    break;
                case 2:
                    num = model.getEquipByIndex(i).zhuling;
                    if (num) {
                        maxLv += num;
                    }
                    break;
            }
        }
        return maxLv;
    }

    private forgeMaxLv: number = 0;
    private gemMaxLv: number = 0;
    private zhuLinMaxLv: number = 0;
    private forgeMinLv: number = 0;
    private gemMinLv: number = 0;
    private zhuLinMinLv: number = 0;
    /**根据类型获取最高或最低的大师级别 */
    public getDashiMinMaxLv(type: DaShiType, isMax: boolean): number {
        let max = 0;
        let min = 0;
        switch (type) {
            case DaShiType.forge:
                if (this.forgeMaxLv == 0) {
                    let enhanceJieDuanConfig = GlobalConfig.ins("EnhanceJieDuanConfig");
                    let i = 0;
                    for (let key in enhanceJieDuanConfig) {
                        if (enhanceJieDuanConfig[key].rank > this.forgeMaxLv) {
                            this.forgeMaxLv = enhanceJieDuanConfig[key].rank;
                        }
                        if (i == 0 && this.forgeMinLv == 0) {
                            this.forgeMinLv = enhanceJieDuanConfig[key].rank;
                        }
                        i++;
                    }
                }
                min = this.forgeMinLv;
                max = this.forgeMaxLv;
                break;
            case DaShiType.gem:
                if (this.gemMaxLv == 0) {
                    let stoneJieDuanConfig = GlobalConfig.ins("StoneJieDuanConfig");
                    let i = 0;
                    for (let key in stoneJieDuanConfig) {
                        if (stoneJieDuanConfig[key].rank > this.forgeMaxLv) {
                            this.gemMaxLv = stoneJieDuanConfig[key].rank;
                        }
                        if (i == 0 && this.gemMinLv == 0) {
                            this.gemMinLv = stoneJieDuanConfig[key].rank;
                        }
                        i++;
                    }
                }
                min = this.gemMinLv;
                max = this.gemMaxLv;
                break;
            case DaShiType.zhulin:
                if (this.zhuLinMaxLv == 0) {
                    let zhulingJieDuanConfig = GlobalConfig.ins("ZhulingJieDuanConfig");
                    let i = 0;
                    for (let key in zhulingJieDuanConfig) {
                        if (zhulingJieDuanConfig[key].rank > this.forgeMaxLv) {
                            this.zhuLinMaxLv = zhulingJieDuanConfig[key].rank;
                        }
                        if (i == 0 && this.gemMinLv == 0) {
                            this.zhuLinMinLv = zhulingJieDuanConfig[key].rank;
                        }
                        i++;
                    }
                }
                min = this.zhuLinMinLv;
                max = this.zhuLinMaxLv;
                break;
        }
        if (isMax == true) {
            return max;
        } else {
            return min;
        }
    }
    /**获取目标配置 */
    public getDashiConfig(type: DaShiType, lv: number): any {
        let config: any;
        switch (type) {
            case DaShiType.forge:
                let enhanceJieDuanConfig = GlobalConfig.ins("EnhanceJieDuanConfig");
                config = enhanceJieDuanConfig[1];
                for (let key in enhanceJieDuanConfig) {
                    if (lv >= enhanceJieDuanConfig[key].rank) {
                        config = enhanceJieDuanConfig[key];
                    }
                }
                break;
            case DaShiType.gem:
                let stoneJieDuanConfig = GlobalConfig.ins("StoneJieDuanConfig");
                config = stoneJieDuanConfig[1];
                for (let key in stoneJieDuanConfig) {
                    if (lv >= stoneJieDuanConfig[key].rank) {
                        config = stoneJieDuanConfig[key];
                    }
                }
                break;
            case DaShiType.zhulin:
                let zhulingJieDuanConfig = GlobalConfig.ins("ZhulingJieDuanConfig");
                config = zhulingJieDuanConfig[1];
                for (let key in zhulingJieDuanConfig) {
                    if (lv >= zhulingJieDuanConfig[key].rank) {
                        config = zhulingJieDuanConfig[key];
                    }
                }
                break;
        }
        return config;
    }

    public getNextDashiConfig(type: DaShiType, index: number) {
        let config: any;
        switch (type) {
            case DaShiType.forge:
                let enhanceJieDuanConfig = GlobalConfig.ins("EnhanceJieDuanConfig")[index + 1];
                config = enhanceJieDuanConfig;
                break;
            case DaShiType.gem:
                let stoneJieDuanConfig = GlobalConfig.ins("StoneJieDuanConfig")[index + 1];
                config = stoneJieDuanConfig;
                break;
            case DaShiType.zhulin:
                let zhulingJieDuanConfig = GlobalConfig.ins("ZhulingJieDuanConfig")[index + 1];
                config = zhulingJieDuanConfig;
                break;
        }
        return config;
    }
}
enum DaShiType {
    forge = 0,
    gem = 1,
    zhulin = 2
}

MessageCenter.compile(UserForge);
window["UserForge"] = UserForge