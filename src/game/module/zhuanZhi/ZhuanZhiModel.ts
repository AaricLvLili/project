class ZhuanZhiModel extends BaseSystem {

    public zhuanZhiTaskList: Array<ZhuanZhiTaskInfo> = [];
    public constructor() {
        super();
        this.regNetMsg(S2cProtocol.sc_zhuanzhi_tasklist, this.doZhuanZhiTaskList);
        this.regNetMsg(S2cProtocol.sc_zhuanzhi_uplevel_result, this.doZhuanZhiUpLevelResult);

        this.regNetMsg(S2cProtocol.sc_zhuanzhi_jingmai_boost, this.doZhuanZhiJmUpLevel);
        this.regNetMsg(S2cProtocol.sc_zhuanzhi_jingmai_upgrade, this.doZhuanZhiJmUpGrade);
        this.regNetMsg(S2cProtocol.sc_equip_zhuanzhi_skill, this.seeZhuanZhiJmSkill);

        this.regNetMsg(S2cProtocol.sc_zhuanzhi_talent_init, this.doZhuanZhiTfInIt);
        this.regNetMsg(S2cProtocol.sc_zhuanzhi_talent_upgrade, this.doZhuanZhiTfUpLevel);

        this.regNetMsg(S2cProtocol.sc_equip_lvl_upgrade, this.doZhuanZhiEquipUpLevel);
        this.regNetMsg(S2cProtocol.sc_equip_star_upgrade, this.doZhuanZhiEquipUpStar);
        this.regNetMsg(S2cProtocol.sc_equip_zhuanzhi_power, this.doZhuanZhiEquipPower);
    }

    public static ins(): ZhuanZhiModel {
        return super.ins();
    }

    /**转职所有功能红点（经脉，天赋）*/
    public zhuanZhiIsRed(): boolean {
        return this.zhuanZhiJmTabRedPoint() || this.zhuanZhiTfTabRedPoint();
    }

    /**请求转职任务信息列表*/
    public sendZhuanZhiTaskList(): void {
        this.Rpc(C2sProtocol.cs_zhuanzhi_tasklist_req, new Sproto.cs_zhuanzhi_tasklist_req_request);
    }

    /**#转职任务信息列表返回*/
    private doZhuanZhiTaskList(bytes: Sproto.sc_zhuanzhi_tasklist_request): void {
        var count = SubRoles.ins().subRolesLen;
        for (var i = 0; i < count; i++) {
            if (this.zhuanZhiTaskList[i] == null)
                this.zhuanZhiTaskList[i] = new ZhuanZhiTaskInfo();
            this.zhuanZhiTaskList[i].parse(bytes.data[i]);
        }
        GameGlobal.MessageCenter.dispatch(MessageDef.ZHUANZHI_TASKLIST)
    }

    /**请求转职任务捐献*/
    public sendZhuanZhiDonate(itemid: number, count: number, roleId: number): void {
        let req = new Sproto.cs_zhuanzhi_donate_request;
        req.itemid = itemid;
        req.count = count;
        req.roleid = roleId
        this.Rpc(C2sProtocol.cs_zhuanzhi_donate, req)
    }

    /**请求转职任务挑战副本*/
    public sendZhuanZhiEnterRaid(roleId: number, taskid: number): void {
        let req = new Sproto.cs_zhuanzhi_enter_raid_request
        req.roleid = roleId;
        req.taskid = taskid;
        this.Rpc(C2sProtocol.cs_zhuanzhi_enter_raid, req)
    }
    /**请求转职*/
    public sendZhuanZhiActive(roleId: number): void {
        let req = new Sproto.cs_zhuanzhi_active_request
        req.roleid = roleId;
        this.Rpc(C2sProtocol.cs_zhuanzhi_active, req)
    }

    /**转职成功返回*/
    private doZhuanZhiUpLevelResult(bytes: Sproto.sc_zhuanzhi_uplevel_result_request): void {
        UserTips.InfoTip(GlobalConfig.jifengTiaoyueLg.st101842);
        this.zhuanZhiTaskList[bytes.data.roleid].parse(bytes.data);
        GameGlobal.MessageCenter.dispatch(MessageDef.ZHUANZHI_UPLEVEL_RESULT)
        var role = EntityManager.ins().getMainRole(bytes.data.roleid);
        if (role)
            role.updateModel();
    }

    /**获取单个角色转职任务数据*/
    public getZhuanZhiTaskData(roleId: number) {
        if (this.zhuanZhiTaskList[roleId]) {
            return this.zhuanZhiTaskList[roleId].task;
        }
        return null;
    }

    /**获取单个角色转职等级*/
    public getZhuanZhiLevel(roleId: number): number {
        if (this.zhuanZhiTaskList[roleId]) {
            return this.zhuanZhiTaskList[roleId].level;
        }
        return 0;
    }

    /**是否有角色可以转职*/
    public canZhuanZhi() {
        var count = SubRoles.ins().subRolesLen;
        for (var i = 0; i < count; i++) {
            if (this.canZhuanZhiByRoleId(i))
                return true;
        }
        return false;
    }

    /**单个角色是否可以转职*/
    public canZhuanZhiByRoleId(roleId: number, showTips: boolean = false): boolean {
        var datas = this.zhuanZhiTaskList[roleId];
        if (!datas) return false;

        let level = this.getZhuanZhiLevel(roleId);
        if (level >= GlobalConfig.ins("TransferConfig").maxZzlevel) {
            if (showTips) UserTips.InfoTip(GlobalConfig.jifengTiaoyueLg.st100996);
            return false;
        }


        var transferConfig = GlobalConfig.ins("TransferConfig").zslevel;
        if (!Checker.Level(transferConfig[level], null, false)) {
            if (showTips) UserTips.InfoTip(LanguageString.jifengTiaoyueCh(GlobalConfig.jifengTiaoyueLg.st101830, [transferConfig[level]]));
            return false;
        }

        for (var info of datas.task) {
            if (info.state == 0) {
                if (showTips) UserTips.InfoTip(GlobalConfig.jifengTiaoyueLg.st101829);
                return false;
            }
        }
        return true;
    }

    public zhuanZhiTaskIsOpen(roleId) {
        let level = this.getZhuanZhiLevel(roleId);
        var transferConfig = GlobalConfig.ins("TransferConfig").zslevel;
        if (!Checker.Level(transferConfig[level], null, false)) {
            return false;
        }
        return true;
    }

    /**转职任务图标是否显示*/
    public showZhuanZhiTaskIcon(): boolean {
        var count = SubRoles.ins().subRolesLen;
        for (var i = 0; i < count; i++) {
            let level = this.getZhuanZhiLevel(i);
            if (level < GlobalConfig.ins("TransferConfig").maxZzlevel)
                return true;
        }
        return false;
    }
    /**是否有职业一转 */
    public hasZhuanZhiRole(): boolean {
        var count = SubRoles.ins().subRolesLen;
        for (var i = 0; i < count; i++) {
            let level = this.getZhuanZhiLevel(i);
            if (level > 0)
                return true;
        }
        return false;
    }
    ///////////////// ///////////////// ///////////////// /////////////////转职经脉///////////////// ///////////////// 

    /**请求经脉升级*/
    public sendZhuanZhiJmUpLevel(roleId: number): void {
        let req = new Sproto.cs_zhuanzhi_jingmai_boost_request
        req.roleID = roleId;
        this.Rpc(C2sProtocol.cs_zhuanzhi_jingmai_boost, req)
    }

    /**请求经脉升阶*/
    public sendZhuanZhiJmUpGrade(roleId: number): void {
        let req = new Sproto.cs_zhuanzhi_jingmai_upgrade_request
        req.roleID = roleId;
        this.Rpc(C2sProtocol.cs_zhuanzhi_jingmai_upgrade, req)
    }
    /**是否升级失败 */
    private isNotLevelUp(bytes: Sproto.sc_zhuanzhi_jingmai_boost_request | Sproto.sc_zhuanzhi_jingmai_upgrade_request) {
        if (bytes.data.level == 0 && bytes.data.stage == 0) {
            return true
        }
        let data = SubRoles.ins().getSubRoleByIndex(bytes.index).zhuanZhiJm
        if (data.level == bytes.data.level && data.stage == bytes.data.stage) {
            return true
        }
        return false
    }

    /**转职经脉升级返回*/
    private doZhuanZhiJmUpLevel(bytes: Sproto.sc_zhuanzhi_jingmai_boost_request): void {
        if (this.isNotLevelUp(bytes)) return
        UserTips.ins().showTips(GlobalConfig.jifengTiaoyueLg.st100638);
        this.doUpData(bytes);
    }

    /**转职经脉升阶返回*/
    private doZhuanZhiJmUpGrade(bytes: Sproto.sc_zhuanzhi_jingmai_upgrade_request): void {
        if (this.isNotLevelUp(bytes)) return
        UserTips.ins().showTips(GlobalConfig.jifengTiaoyueLg.st100904);
        this.doUpData(bytes);
    }

    private doUpData(rsp: any): void {
        var index = rsp.index
        SubRoles.ins().getSubRoleByIndex(index).zhuanZhiJm.parser(rsp.data);
        this.postZhuanZhiJmUpdate();
    }

    public postZhuanZhiJmUpdate(): void {
    }

    /**查看经脉属性技能列表请求*/
    public sendZhuanZhiJmSkill(roleid: number): void {
        let req = new Sproto.cs_equip_zhuanzhi_skill_request
        req.roleid = roleid;
        this.Rpc(C2sProtocol.cs_equip_zhuanzhi_skill, req)
    }

    /**查看经脉属性技能列表返回*/
    private seeZhuanZhiJmSkill(bytes: Sproto.sc_equip_zhuanzhi_skill_request): void {
        this.postZhuanZhiJmSkill(bytes);
    }

    public postZhuanZhiJmSkill(bytes): void {
        return bytes.skill;
    }

    /**转职经脉tab红点*/
    public zhuanZhiJmTabRedPoint(): boolean {
        for (let i = 0, len = SubRoles.ins().subRolesLen; i < len; ++i) {
            if (this.zhuanZhiJmRoleRedPqoint(i))
                return true;
        }
        return false;
    }

    /**
    * 转职经脉角色头像红点
    * @param rIndex 角色index
    */
    public zhuanZhiJmRoleRedPqoint(rIndex: number): boolean {
        var role = SubRoles.ins().getSubRoleByIndex(rIndex);
        var datas: JingMaiData = role.zhuanZhiJm;
        var zzLevel = this.getZhuanZhiLevel(rIndex);
        if (zzLevel < GlobalConfig.ins("TransferConfig").openLevel_jm)
            return false;

        if (datas.level >= GlobalConfig.ins("MeridianCommonConfig").limitLevel)
            return false;

        var lvConfig = GlobalConfig.meridianLevelConfig[datas.level]
        if (Checker.Money(lvConfig.rankUpItem[0].id, lvConfig.rankUpItem[0].count, false) && Checker.Money(lvConfig.rankUpItem[1].id, lvConfig.rankUpItem[1].count, false))
            return true;
        return false;
    }

    ///////////////// ///////////////// ///////////////// /////////////////转职天赋///////////////// ///////////////// 

    /**#天赋item选择index*/
    public tfItemIndex: number = 0;
    /**#天赋列表*/
    public zhuanZhiTfList: Array<ZhuanZhiTfInfo> = [];

    /**天赋初始化返回*/
    private doZhuanZhiTfInIt(bytes: Sproto.sc_zhuanzhi_talent_init_request): void {
        var count = SubRoles.ins().subRolesLen;
        for (var i = 0; i < count; i++) {
            if (this.zhuanZhiTfList[i] == null)
                this.zhuanZhiTfList[i] = new ZhuanZhiTfInfo();
            this.zhuanZhiTfList[i].parse(bytes.data[i]);
        }
    }

    /**请求天赋升级*/
    public sendZhuanZhiTfUpLevel(roleId: number, skillid: number): void {
        let req = new Sproto.cs_zhuanzhi_talent_upgrade_request
        req.roleid = roleId;
        req.skillid = skillid;
        this.Rpc(C2sProtocol.cs_zhuanzhi_talent_upgrade, req);
    }

    /**天赋升级返回*/
    private doZhuanZhiTfUpLevel(bytes: Sproto.sc_zhuanzhi_talent_upgrade_request): void {
        UserTips.ins().showTips(GlobalConfig.jifengTiaoyueLg.st100638);
        this.doUpDataTf(bytes);
    }

    private doUpDataTf(rsp: Sproto.sc_zhuanzhi_talent_upgrade_request): void {
        var tfInfo = this.zhuanZhiTfList[rsp.roleid];
        tfInfo.roleid = rsp.roleid;
        tfInfo.power = rsp.power;
        for (let tf of tfInfo.list) {
            if (tf.skillid == rsp.skillid) {
                tf.level = rsp.level;
                break;
            }
        }
        this.postZhuanZhiTfUpdate();
    }

    public postZhuanZhiTfUpdate(): void {
    }

    /**获取指定天赋的等级*/
    public getTfLevelById(id: number): number {
        var count = SubRoles.ins().subRolesLen;
        for (var i = 0; i < count; i++) {
            var tfInfo = this.zhuanZhiTfList[i];
            for (let tf of tfInfo.list) {
                if (id == tf.skillid) {
                    return tf.level;
                }
            }
        }
    }

    /**是否有一个角色开启了天赋系统*/
    public isOpenZhuanZhiTf(): boolean {
        var flg: boolean = false;
        var count = SubRoles.ins().subRolesLen;
        for (var i = 0; i < count; i++) {
            if (this.isOpenZhuanZhiTfByRoleId(i)) {
                flg = true;
                break;
            }
        }
        return flg;
    }

    /**角色是否开启了天赋系统*/
    public isOpenZhuanZhiTfByRoleId(roleId: number): boolean {
        var config = GlobalConfig.ins("TransferConfig");
        var lev = ZhuanZhiModel.ins().getZhuanZhiLevel(roleId);
        return lev >= config.openLevel_tf;
    }

    /**转职天赋tab红点*/
    public zhuanZhiTfTabRedPoint(): boolean {
        for (let i = 0, len = SubRoles.ins().subRolesLen; i < len; ++i) {
            if (this.zhuanZhiTfRoleRedPqoint(i))
                return true;
        }
        return false;
    }

    /**
    * 转职天赋角色头像红点
    * @param rIndex 角色index
    */
    public zhuanZhiTfRoleRedPqoint(rIndex: number): boolean {
        if (!this.isOpenZhuanZhiTfByRoleId(rIndex))
            return false;

        var tfInfo = this.zhuanZhiTfList[rIndex];
        if (tfInfo && tfInfo.list) {
            for (let tf of tfInfo.list) {
                var objectConfig = GlobalConfig.transferTalentConfig[tf.skillid];
                if (objectConfig && objectConfig[tf.level + 1]) {
                    var config = objectConfig[tf.level]
                    if (Checker.Money(config.rankUpItem[0].id, config.rankUpItem[0].count, false) && Checker.Money(config.rankUpItem[1].id, config.rankUpItem[1].count, false)) {
                        var len: number = config.condition.length;
                        var flg: boolean = true;
                        if (tf.level <= 0 && len > 0) {
                            for (let i = 0; i < len; i++) {
                                let id = config.condition[i][0];
                                let lvl = config.condition[i][1];
                                let targetLvl = ZhuanZhiModel.ins().getTfLevelById(id);
                                if (targetLvl < lvl) {
                                    flg = false;
                                    break;
                                }
                            }
                        }
                        if (flg) return true;
                    }
                }
            }
        }
        return false;
    }

    ///////////////// ///////////////// ///////////////// /////////////////转职装备///////////////// ///////////////// 
    /**位置对应的部位子类型*/
    public posToSubType = [EquipType.SHOULDER, EquipType.UNDERCLOTHES,
    EquipType.ASSISTANT, EquipType.BELT, EquipType.KNEE, EquipType.PENDANT];

    /**获取转职装备ID(用于配置表)*/
    public getZhuanZhiEquipId(index: number, job: number): number {
        return job * 100 + this.posToSubType[index];
    }

    /**请求转职装备升级*/
    public sendZhuanZhiEquipUpLevel(roleId: number, pos: number): void {
        let req = new Sproto.cs_equip_lvl_upgrade_request
        req.roleid = roleId;
        req.pos = pos;
        this.Rpc(C2sProtocol.cs_equip_lvl_upgrade, req);
    }

    /**请求转职装备升星*/
    public sendZhuanZhiEquipUpStar(roleId: number, pos: number): void {
        let req = new Sproto.cs_equip_star_upgrade_request
        req.roleid = roleId;
        req.pos = pos;
        this.Rpc(C2sProtocol.cs_equip_star_upgrade, req);
    }

    /**转职装备升级返回*/
    private doZhuanZhiEquipUpLevel(bytes: Sproto.sc_equip_lvl_upgrade_request): void {
        UserTips.ins().showTips(GlobalConfig.jifengTiaoyueLg.st100638);
        var role = SubRoles.ins().getSubRoleByIndex(bytes.roleid);
        role.hjPower = bytes.power;
        var equip = role.equipsData[bytes.pos];
        equip.num2 = bytes.value;
        this.postZhuanZhiEquipUpLevel();
    }
    public postZhuanZhiEquipUpLevel(): void {
    }

    /**转职装备升星返回*/
    private doZhuanZhiEquipUpStar(bytes: Sproto.sc_equip_star_upgrade_request): void {
        UserTips.ins().showTips("升星成功");
        var role = SubRoles.ins().getSubRoleByIndex(bytes.roleid);
        role.hjPower = bytes.power;
        var equip = role.equipsData[bytes.pos];
        equip.star = bytes.value;
        this.postZhuanZhiEquipUpStar();
    }
    public postZhuanZhiEquipUpStar(): void {
    }

    /**护具战力更新返回*/
    private doZhuanZhiEquipPower(bytes: Sproto.sc_equip_zhuanzhi_power_request): void {
        var role = SubRoles.ins().getSubRoleByIndex(bytes.roleID);
        if (bytes.type) {
            if (bytes.type == 1)
                role.hjPower = bytes.power;
            else
                role.jMPower = bytes.power;
        }
        else {
            role.hjPower = bytes.power;
        }
        this.postZhuanZhiEquipPower();
    }
    public postZhuanZhiEquipPower(): void {
    }

    /**
     * 转职装备属性=配置表最大基准值*斜率^(满级-目标等级）
    */
    public getZhuanZhiEquipAttr(config: any, level: number, needItem: number): Array<any> {
        // var m = level?Math.pow(config.slope,config.maxLevel-level):0;
        // var attrs:Array<any> = [];
        // if(config.maxHp > 0)
        // {
        //     var obj2:any = {};
        //     obj2.type = AttributeType.atMaxHp;
        //     obj2.value = Math.floor(config.maxHp * m);
        //     attrs.push(obj2);
        // }

        // if(config.maxAtk > 0)
        // {
        //     var obj4:any = {};
        //     obj4.type = AttributeType.atAttack;
        //     obj4.value = Math.floor(config.maxAtk * m);
        //     attrs.push(obj4);
        // }

        // if(config.maxDef > 0)
        // {
        //     var obj5:any = {};
        //     obj5.type = AttributeType.atDef;
        //     obj5.value = Math.floor(config.maxDef * m);
        //     attrs.push(obj5);
        // }


        // if(config.maxMagDef > 0)
        // {
        //     var obj6:any = {};
        //     obj6.type = AttributeType.atRes;
        //     obj6.value = Math.floor(config.maxMagDef * m);
        //     attrs.push(obj6);
        // }
        let power = AttributeData.getNowPower(0, level, 0, needItem, config.price, config.basiccon, config.increasecon, config.slope, config.revisecon);
        let attrs = AttributeData.getAttrByPower(config.maxHp, config.maxAtk, config.maxDef, config.maxMagDef, power);
        return attrs;
    }

    /**
     * 转职装备单个装备基础属性 + 背包att随机属性
    */
    public getZhuanZhiEquipBaseAttr(itemData: ItemData): Array<any> {
        var attrList = [];
        if (itemData) {
            var config = GlobalConfig.equipConfig[itemData.configID];
            for (var k in Role.translate) {
                if (config[k] <= 0)
                    continue;
                var attrs = new AttributeData;
                attrs.type = Role.getAttrTypeByName(k);
                attrs.value = config[k];

                var attr = itemData.att;
                for (var index = 0; index < attr.length; index++) {
                    if (attr[index].type == Role.getAttrTypeByName(k)) {
                        attrs.value += attr[index].value;
                        break;
                    }
                }
                attrList.push(attrs);
            }
        }
        return attrList;
    }

    /**
     * 能否装备转职装备红点判断
     * @param index 界面的部位索引(0-5)
     * @param role 角色
    */
    public canMountZzEquipRedPoint(index, role): boolean {
        let subType = ZhuanZhiModel.ins().posToSubType[index];
        var equipId = ZhuanZhiModel.ins().getZhuanZhiEquipId(index, role.job);
        var config = GlobalConfig.ins("TransferEquipConfig")[equipId];
        if (role.zhuanZhiJm.level < config.activationLevel)//该部位未解锁
            return false;

        var itemData = UserBag.ins().bagModel[UserBag.BAG_TYPE_EQUIP];
        for (var a in itemData) {
            if (itemData[a].itemConfig.type == ItemType.ZHUANZHI && itemData[a].itemConfig.subType == subType && itemData[a].itemConfig.job == role.job) {
                if (Checker.Level(itemData[a].itemConfig.zsLevel, itemData[a].itemConfig.level, false))
                    return true;
            }
        }
        return false;
    }

    /**
     * 是否拥有更好的转职装备红点判断
     * @currItem 当前身上的装备
    */
    public canReplaceZzEquipRedPoint(currItem): boolean {
        var itemData = UserBag.ins().bagModel[UserBag.BAG_TYPE_EQUIP];
        var currPower = ItemConfig.calculateBagItemScore(currItem);
        for (var a in itemData) {
            var targetItem = itemData[a];
            if (targetItem.itemConfig.type == ItemType.ZHUANZHI && targetItem.itemConfig.subType == currItem.itemConfig.subType && targetItem.itemConfig.job == currItem.itemConfig.job) {
                if (Checker.Level(targetItem.itemConfig.zsLevel, targetItem.itemConfig.level, false)) {
                    let targetPower = ItemConfig.calculateBagItemScore(targetItem);
                    if (targetPower > currPower)
                        return true;
                }
            }
        }
        return false;
    }

    /**
     * 转职装备角色头像红点
     * @param rIndex 角色index
    */
    public zhuanZhiEquipRoleRedPqoint(rIndex: number): boolean {
        var role = SubRoles.ins().getSubRoleByIndex(rIndex);
        var equipsData = role.equipsData;
        for (let i = 0; i < 6; i++) {
            var equip = equipsData[i + EquipPos.MAX];
            if (equip && equip.item) {
                if (equip.item.configID > 0) {
                    if (this.canReplaceZzEquipRedPoint(equip.item))
                        return true;
                }
                else {
                    if (this.canMountZzEquipRedPoint(i, role))
                        return true;
                }
            }
        }
        return false;
    }

    /**
     * 转职装备能否升级红点判断
     * @param equip 当前部位的装备
    */
    public canLevelZzEquipRedPoint(equip: EquipsData): boolean {
        if (equip && equip.item && equip.item.configID > 0 && equip.num2 < 200) {
            var bagNum = UserBag.ins().getBagGoodsCountById(0, 760001);
            var costNum = 1 + Math.floor(equip.num2 / 2);
            if (bagNum >= costNum)
                return true;
        }
        return false;
    }

    /**
     * 转职装备能否升级角色头像红点判断
     * @param rIndex 角色index
    */
    public zZEquipUpLevelRoleRedPqoint(rIndex: number): boolean {
        var role = SubRoles.ins().getSubRoleByIndex(rIndex);
        var equipsData = role.equipsData;
        for (let i = 0; i < 6; i++) {
            var equip = equipsData[i + EquipPos.MAX];
            if (this.canLevelZzEquipRedPoint(equip))
                return true;
        }
        return false;
    }


    /**
     * 转职装备能否升星红点判断
     * @param equip 当前部位的装备
    */
    public canStarZzEquipRedPoint(equip: EquipsData): boolean {
        if (equip && equip.item && equip.item.configID > 0 && equip.star < 10) {
            var bagNum = UserBag.ins().getBagGoodsCountById(0, 760002);
            var costNum = 3 * (equip.star + 1);
            if (bagNum >= costNum)
                return true;
        }
        return false;
    }

    /**
     * 转职装备能否升星角色头像红点判断
     * @param rIndex 角色index
    */
    public zZEquipUpStarRoleRedPoint(rIndex: number): boolean {
        var role = SubRoles.ins().getSubRoleByIndex(rIndex);
        var equipsData = role.equipsData;
        for (let i = 0; i < 6; i++) {
            var equip = equipsData[i + EquipPos.MAX];
            if (this.canStarZzEquipRedPoint(equip))
                return true;
        }
        return false;
    }

    /**更新角色界面里装按钮红点*/
    public zhuanZhiEquipAllRedPoint() {
        if (!Deblocking.Check(DeblockingType.TYPE_31, true))
            return false;
        for (let i = 0, len = SubRoles.ins().subRolesLen; i < len; ++i) {
            if (this.zZEquipUpLevelRoleRedPqoint(i))
                return true;
            if (this.zZEquipUpStarRoleRedPoint(i))
                return true;
            if (this.zhuanZhiEquipRoleRedPqoint(i))
                return true;
        }
        return false;
    }
}
MessageCenter.compile(ZhuanZhiModel);
window["ZhuanZhiModel"] = ZhuanZhiModel