class UserEquip extends BaseSystem {

    timeID: number = 0;

    public static ins(): UserEquip {
        return super.ins()
    }
    public constructor() {
        super();
        this.sysId = PackageID.Equip;
        //this.regNetMsg(1, this.doUpDataEquip);
        this.regNetMsg(S2cProtocol.sc_equip_update_data, this.doUpDataEquip);
        //this.regNetMsg(2, this.doSmeltREquip);
        this.regNetMsg(S2cProtocol.sc_equip_deal_smelt_result, this.doSmeltREquip);
        //this.regNetMsg(3, this.doGrewupEquipResult);
        this.regNetMsg(S2cProtocol.sc_equip_deal_upgrade_result, this.doGrewupEquipResult);
        //this.regNetMsg(4, this.doGrewupEquipResult);
        // MessageCenter.addListener(UserBag.postItemChange, this.postCheckHaveCan, this); //道具变更
        GameGlobal.MessageCenter.addListener(MessageDef.CHANGE_ITEM, this.doCheckHaveCan, this); //道具删除
        // MessageCenter.addListener(UserBag.postItemAdd, this.postCheckHaveCan, this); //道具添加
        GameGlobal.MessageCenter.addListener(MessageDef.ADD_ITEM, this.doCheckHaveCan, this); //道具删除
        GameGlobal.MessageCenter.addListener(MessageDef.DELETE_ITEM, this.doCheckHaveCan, this); //道具删除
        MessageCenter.addListener(UserBag.postHuntStore, this.doCheckHaveCan, this);
        MessageCenter.addListener(GameLogic.ins().postLevelChange, this.doCheckHaveCan, this);

        this.regNetMsg(S2cProtocol.sc_equip_resolve_res, this.getEquipItemResolve);
    }

    /**
* 发送传装备
* 4-1
* @param itemHandle	道具唯一标识
* @param pos		   道具位置
*/
    public sendWearEquipment(itemHandle, pos, roleIndex) {
        let cs_equip_wear = new Sproto.cs_equip_wear_request();
        cs_equip_wear.itemHandle = itemHandle;
        cs_equip_wear.roleID = roleIndex;
        cs_equip_wear.pos = pos;
        GameSocket.ins().Rpc(C2sProtocol.cs_equip_wear, cs_equip_wear);
        // var bytes = this.getBytes(1);
        // bytes.writeDouble(itemHandle);
        // bytes.writeShort(roleIndex);
        // bytes.writeShort(pos);
        // this.sendToServer(bytes);
    };
    /**
     * 熔炼装备
     * 4-2
     * @param arr		装备列表
     * @return 是否成功发送
     */
    public sendSmeltEquip(type, arr, auto: boolean = false) {
        let cs_equip_smelt = new Sproto.cs_equip_smelt_request();
        cs_equip_smelt.type = type;
        cs_equip_smelt.itemHandle = new Array();
        cs_equip_smelt.auto = auto;
        for (var i = 0; i < arr.length; i++) {
            if (arr[i] != null) {
                cs_equip_smelt.itemHandle.push(arr[i].handle);
            }
        }
        if (cs_equip_smelt.itemHandle.length == 0)
            return false;
        GameSocket.ins().Rpc(C2sProtocol.cs_equip_smelt, cs_equip_smelt);
        return true;
        // var bytes = this.getBytes(2);
        // bytes.writeInt(type);
        // //记录当前位置，跳过数组长度的写入
        // var pos = bytes.position;
        // bytes.position += 4;
        // var n = 0;
        // for (var i = 0; i < arr.length; i++) {
        //     if (arr[i] != null) {
        //         // arr[i].handle.writeByte(bytes);
        //         bytes.writeDouble(arr[i].handle);
        //         ++n;
        //     }
        // }
        // if (n == 0)
        //     return false;
        // //回到之前记录的位置，并写入数组长度
        // bytes.position = pos;
        // bytes.writeInt(n);
        // this.sendToServer(bytes);
        // return true;
    };
    /**
     * 处理装备更新
     * 4-1
     * @param bytes
     */
    public doUpDataEquip(rsp: Sproto.sc_equip_update_data_request) {
        var roleID = rsp.roleID;
        var equipPos = rsp.equipPos;
        var item = new ItemData;
        item.parser(rsp.data);
        var role = SubRoles.ins().getSubRoleByIndex(roleID);
        var equip = role.getEquipByIndex(equipPos);
        if (item.itemConfig.quality == 5 && item.itemConfig.type != ItemType.ZHUANZHI) {
            equip.goditem = item;
            // 直接更新数据
            LegendModel.ins().UpdateRoleLegendState()
            // return;
        } else {
            equip.item = item;
        }
        GameGlobal.MessageCenter.dispatch(MessageDef.CHANGE_EQUIP)
        if (equipPos == 0 || equipPos == 2) {
            var mainRole: CharRole = <CharRole>EntityManager.ins().getEntityByHandle(role.handle);
            if (mainRole) {
                mainRole.updateModel();
            }
        }
    };
    /**
     * 处理装备熔炼返回结果
     * 4-2
     * @param bytes
     */
    public doSmeltREquip(rsp: Sproto.sc_equip_deal_smelt_result_request) {
        var state = rsp.state;
        if (state == 0) {
            UserTips.ins().showTips("|C:0xf87372&T:熔炼失败！|");
            UserTips.ins().showTips("|C:0xf87372&T:熔炼失败！|");
            return;
        }

        var goldCount = rsp.goldCount;
        var len = rsp.len;
        this.postSmeltEquipComplete();
    };
    /**派发处理装备熔炼返回结果 消息*/
    public postSmeltEquipComplete() {
    };
    /** 对比装备返回高战力的装备 */
    public static contrastEquip(sourceItem, item) {
        if (!sourceItem || sourceItem.handle == 0)
            return item;
        if (!item || item.handle == 0)
            return sourceItem;
        var sourceItemScore = ItemConfig.calculateBagItemScore(sourceItem);
        var itemScore = ItemConfig.calculateBagItemScore(item);
        if (itemScore > sourceItemScore)
            return item;
        else
            return sourceItem;
    };
    /** 派发熔炼装备勾选列表 */
    public postEquipCheckList(param) {
        return param;
    };
    /** 派发熔炼装备列表 */
    public postSmeltEquip(param) {
        return param;
    };
    /**
     * 通过角色，部位，获取玩家对应角色的对应部位装备
     * @param job
     * @param pos 面板类型 0 强化 1 宝石 2 注灵 3 突破
     */
    public getEquipsByJobNPos(job, pos) {
        var len = SubRoles.ins().subRolesLen;
        // let roles: RoleModel[] = GameLogic.ins().rolesModel;
        for (var i = 0; i < len; i++) {
            var roles = SubRoles.ins().getSubRoleByIndex(i);
            if (roles.job == job)
                return roles.getEquipByIndex(pos);
        }
        return null;
    };
    // 通过装备位置跟品质获取配置ID，job不传就默认为1,有equipRole和equipPos表示要对比对应装备找到刚好评分大一点的
    public getEquipConfigIDByPosAndQuality(equiptype, quality, job: number = 1, equipRoleIndex: number = -1, equipPos: number = -1) {
        var zhuan = UserZs.ins().lv || 0;
        var level = GameLogic.ins().actorModel.level;
        var configID = 100000 + 1 + equiptype * 10000 + quality * 100 + 1000 * job;
        for (var i = 1; i < 99; i++) {
            var id = 100000 + i + equiptype * 10000 + quality * 100 + 1000 * job;
            var config = GlobalConfig.itemConfig[id];
            if (config != undefined) {
                if (equipRoleIndex != -1) {
                    var score = ItemConfig.pointCalNumber(config);
                    var curEquip = SubRoles.ins().getSubRoleByIndex(equipRoleIndex).getEquipByIndex(equipPos);
                    var curScore = 0;
                    if (curEquip && curEquip.item.configID) {
                        curScore = ItemConfig.calculateBagItemScore(curEquip.item);
                    }
                    if (curScore < score) {
                        configID = id;
                        break;
                    }
                }
                if (config.zsLevel <= zhuan && config.level <= level) {
                    configID = id;
                } else {
                    break;
                }
            } else {
                break;
            }
        }
        return configID;
    };
    public checkEquipsIsWear(item) {
        var len = SubRoles.ins().subRolesLen;
        for (var i = 0; i < len; i++) {
            var role = SubRoles.ins().getSubRoleByIndex(i);
            var equipLen = role.getEquipLen();
            // let onEquips: EquipsData[] = SubRoles.ins().getSubRoleByIndex(i).equipsData;
            for (var j = 0; j < equipLen; j++) {
                if (item.handle == role.getEquipByIndex(j).item.handle) {
                    return true;
                }
            }
        }
        return false;
    };
    public doGrewupEquipResult(rsp: Sproto.sc_equip_deal_upgrade_result_request) {
        var roleId = rsp.roleId;
        var result = rsp.result;
        var configID = rsp.configID;
        if (GlobalConfig.itemConfig[configID].quality == 4) {
            this.postMixEquip(roleId, result, configID);
        }
        else {
            this.postMixGodEquip(roleId, result, configID);
        }
    };
    /** 橙装合成 */
    public postMixEquip(...params: any[]) {
        return params;
    };
    /** 神装合成 */
    public postMixGodEquip(...params: any[]) {
        return params;
    };
    /**
     * 发送升级装备
     * 4-3
     * @param roleID	英雄唯一标识
     * @param pos		   装备位置
    */
    public sendGrewupEquip(roleID, pos, isgodequip = false) {
        var cs_equip_upgrade = new Sproto.cs_equip_upgrade_request();
        cs_equip_upgrade.roleID = roleID;
        cs_equip_upgrade.pos = pos;
        cs_equip_upgrade.isgodequip = isgodequip;
        GameSocket.ins().Rpc(C2sProtocol.cs_equip_upgrade, cs_equip_upgrade);
        // var bytes = this.getBytes(3);
        // bytes.writeShort(roleID);
        // bytes.writeShort(pos);
        // this.sendToServer(bytes);
    };
    /**
     * 发送合成装备
     * 4-4
     * @param roleID	英雄唯一标识
     * @param configID	装备配置ID
     * @param pos		   装备位置
     */
    public sendMixEquip(roleID, configID, pos) {
        var cs_equip_mix = new Sproto.cs_equip_mix_request();
        cs_equip_mix.roleID = roleID;
        cs_equip_mix.configID = configID;
        cs_equip_mix.pos = pos;
        GameSocket.ins().Rpc(C2sProtocol.cs_equip_mix, cs_equip_mix);

    };

    /**
    * 发送分解道具
    */
    public sendEquipItemResolve(itemId: number, num: number, configId: number) {
        var data = new Sproto.cs_equip_resolve_request;
        data.itemId = itemId;
        data.num = num;
        data.pos = configId;
        GameSocket.ins().Rpc(C2sProtocol.cs_equip_resolve, data);

    };

    public getEquipItemResolve(data: Sproto.sc_equip_resolve_res_request) {
        // switch (data.result) {
        //     case 0:
        //         UserTips.ins().showTips("分解成功");
        //     case 1:
        //         UserTips.ins().showTips("分解失败");
        //         break;
        // }
        MessageCenter.ins().dispatch(MessageDef.EQUIP_ITEM_RESOLVE_MSG);
    }


    private doCheckHaveCan() {
        if (GlobalConfig.testItemCheck) return;
        let isFind = this._InnerCheckHaveCan()
        GameGlobal.MessageCenter.dispatch(MessageDef.CHECK_HAVE_CAN, isFind)
    }
    public _InnerCheckHaveCan(): boolean {
        egret.clearTimeout(this.timeID);
        this.timeID = 0;
        // var isFind = this.checkRedPoint(4);
        var isFind = this.CheckOrangeFenjie()
        var len = SubRoles.ins().subRolesLen;
        if (!isFind) {
            // let role: RoleModel[] = GameLogic.ins().rolesModel;
            for (var a = 0; a < len; a++) {
                for (var i = 0; i < 8; i++) {
                    isFind = this.setOrangeEquipItemState(i, SubRoles.ins().getSubRoleByIndex(a));
                    if (isFind)
                        return true;
                }
            }
        }
        if (!isFind) {
            isFind = this.checkRedPoint(5);
            if (!isFind) {
                // let role: RoleModel[] = GameLogic.ins().rolesModel;
                this.updateEquipHandler();
                for (var a = 0; a < len; a++) {
                    for (var i = 0; i < 8; i++) {
                        isFind = this.setLegendEquipItemState(i, SubRoles.ins().getSubRoleByIndex(a));
                        if (isFind)
                            return true;
                    }
                }
            }
        }
        if (!isFind) {
            isFind = Boolean(UserBag.ins().getHuntGoodsBySort().length);
        }

        return isFind
    };
    public checkRedPoint(qualty) {
        var itemList = UserBag.ins().getBagEquipByLevelSort(qualty)
        for (var i = 0, len = itemList.length; i < len; i++) {
            let itemConfig = itemList[i].itemConfig
            var id = this.getEquipConfigIDByPosAndQuality(itemConfig.subType, itemConfig.quality);
            var fitConfig = GlobalConfig.itemConfig[id];
            if (!fitConfig)
                continue;
            var L = itemConfig.zsLevel * 10000 + itemConfig.level;
            var fitL = fitConfig.zsLevel * 10000 + fitConfig.level;
            if (fitL > L) {
                return true;
            }
        }
        return false;
    };

    /**新优化的橙装红点判断*/
    public checkOrangeRedPointZy(): boolean {
        var bool = false;
        var len = SubRoles.ins().subRolesLen;
        for (var a = 0; a < len; a++) {
            var model = SubRoles.ins().getSubRoleByIndex(a);
            for (var i = 0; i < 8; i++) {
                var equipItem = this["equip" + i];
                bool = UserEquip.ins().setOrangeEquipItemState(i, model);
                if (bool) break;
            }
            if (bool) break;
        }

        if (!bool) {
            let itemList = UserBag.ins().getBagEquipByOrangeSplit(4);
            bool = itemList.length > 0;
        }
        return bool;
    }

    public CheckOrangeRedPoint() {
        for (let i = 0; i < SubRoles.ins().subRolesLen; ++i) {
            if (this.CheckOrangeRedPointByRoleIndex(i)) {
                return true
            }
        }
        // return this.checkRedPoint(4)
        return this.CheckOrangeFenjie()
    }

    public CheckOrangeFenjie() {
        var itemList = UserBag.ins().getBagEquipByLevelSort(4)
        var zsLevel = UserZs.ins().lv || 0;
        var level = GameLogic.ins().actorModel.level;
        for (var i = 0, len = itemList.length; i < len; i++) {
            let itemConfig = itemList[i].itemConfig
            // 不能穿戴
            if (itemConfig.zsLevel > zsLevel || itemConfig.level > level) {
                return true
            }
            let role = SubRoles.ins().GetSubRoleByJob(itemConfig.job)
            // 没有对应的角色
            if (role == null) {
                return true
            }
            let equip = role.getEquipByIndex(itemConfig.subType)
            if (equip.item.configID != 0) {
                let curScore = ItemConfig.calculateBagItemScore(equip.item);
                var score = ItemConfig.pointCalNumber(itemConfig);
                // 评分低
                if (score < curScore) {
                    return true
                }
            }
        }
        return false;
    }

    public CheckOrangeRedPointByRoleIndex(roleIndex: number) {
        let role = SubRoles.ins().getSubRoleByIndex(roleIndex)
        for (let j = 0; j < EquipPos.MAX; ++j) {
            if (this.setOrangeEquipItemState(j, role)) {
                return true
            }
        }
        return false
    }
    private legendComposeConfig: any;
    /**
     * 获取橙装格子的状态
     * @param index
     * @param role
     */
    public setOrangeEquipItemState(index, role) {

        // if(index == 0 || index == 2)
        //     return false;

        var equipData = role.getEquipByIndex(index);
        var nextConfig;
        if (equipData.item.itemConfig && equipData.item.itemConfig.quality < 4)
            nextConfig = null;
        else
            nextConfig = GlobalConfig.itemConfig[equipData.item.configID + 1];
        var needNum = 0;
        var costID = 0;
        var curPos = index;
        if (index == 4 || index == 5)
            index = 4;
        if (index == 6 || index == 7)
            index = 5;
        if (equipData.item.itemConfig && equipData.item.itemConfig.quality == 4 && equipData.item.itemConfig.zsLevel >= 18)
            return false;
        if (equipData.item.itemConfig && equipData.item.itemConfig.quality == 5)
            return false;
        if (nextConfig != null && (nextConfig.level > GameLogic.ins().actorModel.level || nextConfig.zsLevel > UserZs.ins().lv))
            return false;
        if (nextConfig != undefined && equipData.item.handle != 0 && equipData.item.itemConfig.quality == 4) {
            var grewupConfig = GlobalConfig.legendLevelupConfig[equipData.item.configID];
            if (grewupConfig) {
                needNum = grewupConfig.count;
                costID = grewupConfig.itemId;
            }
            else {
                egret.error(`configID Error:${equipData.item.configID}`);
            }
        }
        else {
            var configId = UserEquip.ins().getEquipConfigIDByPosAndQuality(index, 4, role.job, role.roleID, curPos);
            if (this.legendComposeConfig == null)
                this.legendComposeConfig = GlobalConfig.ins("LegendComposeConfig");
            var mixConfig = this.legendComposeConfig[configId];
            if (mixConfig) {
                needNum = mixConfig.count;
                costID = mixConfig.itemId;
            }
            else {
                egret.error(`configId Error:${configId}`);
            }
        }
        var curNum = UserBag.ins().getBagGoodsCountById(0, costID);
        return curNum >= needNum;
    }

    canEquipHandler: number[] = []
    public updateEquipHandler() {
        for (let i = 0; i < EquipPos.MAX; ++i) {
            this.canEquipHandler[i] = 0;
        }
        var equipItems: ItemData[] = UserBag.ins().getBagEquipByLevelSort(5);
        equipItems.forEach(element => {
            if (element.itemConfig.subType == EquipType.BRACELET) {
                this.canEquipHandler[EquipPos.BRACELET1] = Math.max(this.canEquipHandler[EquipPos.BRACELET1], element.handle);
                this.canEquipHandler[EquipPos.BRACELET2] = this.canEquipHandler[EquipPos.BRACELET1];
            } else if (element.itemConfig.subType == EquipType.RING) {
                this.canEquipHandler[EquipPos.RING1] = Math.max(this.canEquipHandler[EquipPos.RING1], element.handle);
                this.canEquipHandler[EquipPos.RING2] = this.canEquipHandler[EquipPos.RING1];
            } else {
                this.canEquipHandler[element.itemConfig.subType] = Math.max(this.canEquipHandler[element.itemConfig.subType], element.handle);
            }
        });
    }

    /*** 查找对比的相同的装备，解决个bug,能进入这个接口，一定说明玩家对应部位是空*/
    public checkContrast(curIndex: number): number {
        var equipItems: ItemData[] = UserBag.ins().getBagEquipByLevelSort(5);
        var arr: Array<any> = [];
        equipItems.forEach(element => {
            if (element.itemConfig.subType == EquipType.BRACELET) {
                if (arr[curIndex] != null) {//wjh临时的里的判断
                    if (arr[curIndex].itemConfig.level < element.itemConfig.level || arr[curIndex].itemConfig.level < element.itemConfig.zsLevel) {
                        arr[curIndex] = element;
                    }
                } else {
                    if (GameLogic.ins().actorModel.level >= element.itemConfig.level && GameLogic.ins().actorModel.zsLv >= element.itemConfig.zsLevel)
                        arr[curIndex] = element;
                }
                // arr[EquipPos.BRACELET2] = this.canEquipHandler[EquipPos.BRACELET1];
            } else if (element.itemConfig.subType == EquipType.RING) {
                // arr[EquipPos.RING1] = Math.max(this.canEquipHandler[EquipPos.RING1], element);
                // arr[EquipPos.RING2] = this.canEquipHandler[EquipPos.RING1];
                if (arr[curIndex] != null) {//wjh临时的里的判断
                    if (arr[curIndex].itemConfig.level < element.itemConfig.level || arr[curIndex].itemConfig.level < element.itemConfig.zsLevel) {
                        arr[curIndex] = element;
                    }
                } else {
                    if (GameLogic.ins().actorModel.level >= element.itemConfig.level && GameLogic.ins().actorModel.zsLv >= element.itemConfig.zsLevel)
                        arr[curIndex] = element;
                }
            } else {
                if (arr[element.itemConfig.subType] != null) {//wjh临时的里的判断
                    if (arr[element.itemConfig.subType].itemConfig.level < element.itemConfig.level || arr[element.itemConfig.subType].itemConfig.level < element.itemConfig.zsLevel) {
                        arr[element.itemConfig.subType] = element;
                    }
                } else {
                    if (GameLogic.ins().actorModel.level >= element.itemConfig.level && GameLogic.ins().actorModel.zsLv >= element.itemConfig.zsLevel)
                        arr[element.itemConfig.subType] = element;
                }
            }
        });
        if (arr[curIndex]) {
            return arr[curIndex].handle;
        }
        return null;
    }

    /**
     * 获取神装装备格子的状态
     * @param index
     * @param role
     */
    public setLegendEquipItemState(index: number, role: Role) {
        var equipData = role.getEquipByIndex(index);
        var nextConfig;
        if (equipData.goditem.itemConfig && equipData.goditem.itemConfig.quality == 5) {
            nextConfig = GlobalConfig.itemConfig[equipData.goditem.configID + 1];
        } else {
            nextConfig = null;
        }
        var needNum = 0;
        var costID = 0;
        if (nextConfig != undefined && nextConfig.zsLevel > UserZs.ins().lv)
            return false;
        if (nextConfig != undefined && equipData.goditem.handle != 0 && equipData.goditem.itemConfig.quality == 5) {
            var grewupConfig = GlobalConfig.legendLevelupConfig[equipData.goditem.configID];
            needNum = grewupConfig.count;
            costID = grewupConfig.itemId;
        } else {
            if (equipData.goditem.handle == 0) {
                let handle = this.canEquipHandler[index]
                if (handle > 0) {
                    let item = UserBag.ins().getBagGoodsByHandle(UserBag.BAG_TYPE_EQUIP, handle)
                    if (item) {
                        if (UserZs.ins().lv >= item.itemConfig.zsLevel) {
                            return true
                        }
                    }
                }
            }
            return false
        }
        var curNum = UserBag.ins().getBagGoodsCountById(0, costID);
        if (UserZs.ins().lv >= 3)
            return curNum >= needNum;
        else
            return false;
    };
}

MessageCenter.compile(UserEquip);
window["UserEquip"] = UserEquip