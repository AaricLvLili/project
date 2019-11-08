class Role extends EntityModel {
    public constructor() {
        super();
    }

    title: number = 0;
    roleID: number = -1;
    job: number = 0;
    sex: number = 0;
    power: number = 0;
    /**护具战斗力*/
    hjPower: number = 0;
    /**经脉战斗力*/
    jMPower: number = 0;
    skillsData: number[] = [];
    skillsDataIndex: number[] = [];
    // /** 突破技能列表*/
    skillBreakData: number[] = [];

    equipsData: Array<EquipsData>;
    exRingsData: Array<number>;
    zhuZaiData: Array<ZhuZaiData>;
    yuanshenLv: number;

    guildID: number;
    // guildName: string;
    warLevel: number;

    wingsData: WingsData;
    jingMaiData: JingMaiData = new JingMaiData
    /**转职经脉*/
    zhuanZhiJm: JingMaiData = new JingMaiData

    loongSoulData: Sproto.long_hun_data;
    shieldData: Sproto.long_hun_data;
    xueyuData: Sproto.long_hun_data;

    longzhuangdata: Sproto.longzhuang_data[];
    fuwen: FuwenItemData

    zhuangbei = []
    /** 当前是否变身，如果id>0就说明存在变身*/
    public bianShen: number = -1;
    legendDress = null
    /**坐骑的当前等级 */
    public mountsLevel: number = 100;
    /**坐骑的显示等级 */
    public mountsShowLv: number = 100;
    /**转职等级 */
    public zhuanzhiLv: number = 0;
    public get shield(): number {
        return this.shieldData.level
    }

    public get loongSoul(): number {
        return this.loongSoulData.level
    }

    // runeDatas: Sproto.rune_data[];

	/**
     * 通过属性名获取属性类型
     * */
    public static getAttrTypeByName(attrName) {
        return this.translate[attrName];
    };
    /**通过职业类型获取职业名 */
    public static getJobNameByJob(type) {
        return this.jobNumberToName(type);
    };
    public static getEquipNameByType(type) {
        return this.typeNumberToName(type);
    };
    public static getWingEquipNameByType(type) {
        return this.typeEquipWingToName(type);
    };
    public static getFuwenEquipNameByType(type) {
        return this.typeFuwenNumberToName(type);
    };
    public parser(rspData: Sproto.role_data) {
        this.title = rspData.title;
        this.index = rspData.index;
        this.job = rspData.job;
        this.sex = rspData.sex;
        this.power = rspData.power;
        this.hjPower = rspData.power2;
        this.skillsData = rspData.skillDatas
        this.skillsDataIndex = rspData.fightSkill;
        /**技能突破 */
        // if (rspData.skillTupoDatas) {
        //     this.skillBreakData = rspData.skillTupoDatas
        // }
        this.skillBreakData = [1, 1, 1, 1, 1];

        this.equipsData = [];
        for (let value of rspData.equipsData) {
            let equip = new EquipsData();
            equip.parser(value);
            this.equipsData.push(equip);
        }

        this.exRingsData = [0, 0, 0, 0];
        this.wingsData = new WingsData;
        this.wingsData.parser(rspData.wingsData);

        this.jingMaiData.parser(rspData.jingmai_Data)
        this.zhuanZhiJm.parser(rspData.zzjingmai_Data)
        //this.loongSoulData = rspData.loongSoulData
        //this.shieldData = rspData.shieldData
        //this.xueyuData = rspData.xueyuData || <Sproto.long_hun_data>{level: 0, stage: 0, exp: 0}
        // this.runeDatas = rspData.runeDatas || <Sproto.long_hun_data>{level: 0, stage: 0, exp: 0}
        this.parserAtt(rspData.attributeData)
        this.parserExAtt(rspData.attributeExData)

        this.zhuZaiData = [];
        for (let value of rspData.zhuZaiData) {
            var data = new ZhuZaiData;
            data.parser(value);
            this.zhuZaiData[data.id - 1] = data;
        }

        this.zhuangbei = rspData.zhuangbei;
        this.longzhuangdata = rspData.longzhuang;
        if (rspData.fuwen)
            this.fuwen = new FuwenItemData(rspData.fuwen)

        this.legendDress = rspData.legendDress

        this.mountsLevel = rspData.ride;
        this.mountsShowLv = rspData.rideshow;
        this.attrElementData = rspData.elements;
        this.attrElementMianType = rspData.mainEle;
        this.zhuanzhiLv = rspData.zhuanzhiLv;
        if (this.masterHandle == GameLogic.ins().actorModel.handle) {
            LocalStorageData.setItem(LocalDataKey.job + "_" + this.roleID, this.job + "")
            LocalStorageData.setItem(LocalDataKey.sex + "_" + this.roleID, this.sex + "")
            LocalStorageData.setItem(LocalDataKey.zhuangbei4 + "_" + this.roleID, this.zhuangbei[4] + "");
            LocalStorageData.setItem(LocalDataKey.zhuangbei0 + "_" + this.roleID, this.zhuangbei[0] + "");
            LocalStorageData.setItem(LocalDataKey.mountLv + "_" + this.roleID, this.mountsShowLv + "");
            LocalStorageData.setItem(LocalDataKey.zhuanzhiLv + "_" + this.roleID, this.zhuanzhiLv + "");
        }
        // this.petId = rspData.petid
        // PetModel.getInstance.setBattlePetList(this.index, this.petId)
    }
    // public get petId() {
    //     return this._petId;
    // }

    // public set petId(str: number) {
    //     this._petId = str;
    // }

    /**
     * 锻造数据更改
     * @param bytes
     * @param panelNum 面板类型 0 强化 1 宝石 2 注灵 3 突破 4 开光
     */
    public parseForgeChange(rsp, packageID) {
        switch (packageID) {
            case PackageID.strongthen:
                this.equipsData[rsp.index].strengthen = rsp.value;
                break;
            case PackageID.Gem:
                this.equipsData[rsp.index].gem = rsp.value;
                break;
            case PackageID.Zhuling:
                this.equipsData[rsp.index].zhuling = rsp.value;
                break;
            case PackageID.Tupo:
                this.equipsData[rsp.index].tupo = rsp.value;
                break;
            case 1100:
                this.equipsData[rsp.index].bless = rsp.value;
                break;
        }
        // MessageCenter.ins().dispatch(MessagerEvent.FORGE_LV_CHANGE);
    };
    public parserExAtt(attrs: number[]) {
        this.attributeExData = attrs
    };
    public parserOtherRole(rsp: Sproto.create_role_entity_request) {
        this.mountsLevel = rsp.ridelv;
        this.mountsShowLv = rsp.rideshowLv;
        this.zhuanzhiLv = rsp.zhuanzhiLv;
        this.attrElementData = rsp.elements;
        this.attrElementMianType = rsp.mainEle;
        this.parserAtt(rsp.attributeData);
        this.parserExAtt(rsp.attributeExData);
        this._name = rsp.name
        this.roleID = rsp.roleID
        this.job = rsp.job
        this.sex = rsp.sex
        this._lv = rsp.lv
        this.equipsData = [];
        //身体
        this.equipsData[2] = new EquipsData;
        this.equipsData[2].item = new ItemData;
        this.equipsData[2].item.configID = rsp.bodyConfigID
        //武器
        this.equipsData[0] = new EquipsData;
        this.equipsData[0].item = new ItemData;
        this.equipsData[0].item.configID = rsp.weaponConfigID
        this.wingsData = new WingsData;
        this.wingsData.lv = rsp.wingLv
        this.wingsData.showLv = rsp.wingshowLv;
        this.wingsData.openStatus = rsp.wingOpenStatus
        //称号
        this.title = rsp.title
        //公会id
        this.guildID = rsp.guildID
        //公会名
        this.guildName = rsp.guildName
        //战灵等级
        this.warLevel = rsp.warLevel

        this.zhuangbei = rsp.zhuangbei
        this.teamId = rsp.owerid;
        if (this.masterHandle == GameLogic.ins().actorModel.handle) {
            LocalStorageData.setItem(LocalDataKey.job + "_" + this.roleID, this.job + "")
            LocalStorageData.setItem(LocalDataKey.sex + "_" + this.roleID, this.sex + "")
            LocalStorageData.setItem(LocalDataKey.zhuangbei4 + "_" + this.roleID, this.zhuangbei[4] + "");
            LocalStorageData.setItem(LocalDataKey.zhuangbei0 + "_" + this.roleID, this.zhuangbei[0] + "");
            LocalStorageData.setItem(LocalDataKey.mountLv + "_" + this.roleID, this.mountsShowLv + "");
            LocalStorageData.setItem(LocalDataKey.zhuanzhiLv + "_" + this.roleID, this.zhuanzhiLv + "");
        }

    };
    /**
     * 通过锻造类型获取等级最小的装备索引
     * @param type 0 强化 1 宝石 2 注灵 3 突破
     */
    public getMinEquipIndexByType(type) {
        var index = 0;
        var min = Number.MAX_VALUE;
        var lv = 0;
        var num = ForgeConst.CAN_FORGE_EQUIP.length;
        for (var n = 0; n < num; ++n) {
            var i = ForgeConst.CAN_FORGE_EQUIP[n];
            switch (type) {
                case 0:
                    lv = this.equipsData[i].strengthen;
                    break;
                case 1:
                    lv = this.equipsData[i].gem;
                    break;
                case 2:
                    lv = this.equipsData[i].zhuling;
                    break;
                case 3:
                    lv = this.equipsData[i].tupo;
                    break;
            }
            if (min > lv) {
                min = lv;
                index = i;
            }
        }
        return index;
    };
    /**
     * 通过锻造类型获取装备总等级
     * @param type 0 强化 1 宝石 2 注灵 3 突破
     */
    public getEquipForgeTotalLv(type) {
        var totalLv = 0;
        var n = ForgeConst.CAN_FORGE_EQUIP.length;
        while (n--) {
            var i = ForgeConst.CAN_FORGE_EQUIP[n];
            switch (type) {
                case 0:
                    totalLv += this.getEquipByIndex(i).strengthen;
                    break;
                case 1:
                    totalLv += this.getEquipByIndex(i).gem;
                    break;
                case 2:
                    totalLv += this.getEquipByIndex(i).zhuling;
                    break;
                case 3:
                    totalLv += this.getEquipByIndex(i).tupo;
                    break;
            }
        }
        return totalLv;
    }

    /**
     * 通过锻造类型获取等级最小的装备索引和等级
     * @param type 0 强化 1 宝石 2 注灵 3 突破
     */
    public GetMinEquipIndexAndLevel(type) {
        var index = 0;
        var min = Number.MAX_VALUE;
        var lv = 0;
        var num = ForgeConst.CAN_FORGE_EQUIP.length;
        for (var n = 0; n < num; ++n) {
            var i = ForgeConst.CAN_FORGE_EQUIP[n];
            switch (type) {
                case 0:
                    lv = this.equipsData[i].strengthen;
                    break;
                case 1:
                    lv = this.equipsData[i].gem;
                    break;
                case 2:
                    lv = this.equipsData[i].zhuling;
                    break;
                case 3:
                    lv = this.equipsData[i].tupo;
                    break;
            }
            if (min > lv) {
                min = lv;
                index = i;
            }
        }
        return [index, min];
    }

    public GetEquipLevelByType(pos: number, type: ForgeType): number {
        let equipData = this.equipsData[pos]
        switch (type) {
            case ForgeType.BOOST:
                return equipData.strengthen
            case ForgeType.GEM:
                return equipData.gem
            case ForgeType.ZHULING:
                return equipData.zhuling
            case ForgeType.TUPO:
                return equipData.tupo
        }
        console.log(`Role:GetEquipLevelByType 未定义的强化类型 ${type}`)
        return 0;
    }

    public getSkillIDs() {
        var count;
        var data = [];
        if (this.skillsDataIndex) {
            for (var i = 0; i < this.skillsDataIndex.length; i++) {
                let index = this.skillsDataIndex[i];
                let lv = this.skillsData[index - 1];
                //等级小于0，没有这个技能
                if (lv <= 0)
                    continue;
                if (lv != null && index != null) {
                    let skillId = UserSkill.ins().getSkillId(this.job, index, lv)
                    data.push(skillId);
                }
            }
        }

        return data;
        // return [11200];
    };


    /**获取机器人的技能*/
    public getpPasserbySkillIDs() {
        var data = [];
        for (var i = 1; i < 3; i++) {
            let skillId = UserSkill.ins().getSkillId(this.job, i, 1)
            data.push(skillId);
        }
        return data;
    };

    public getCurSkillIDs() {
        var count;
        var data = [];
        for (var i = 0; i < this.skillsDataIndex.length; i++) {
            let index = this.skillsDataIndex[i];
            let lv = this.skillsData[index - 1];
            if (lv != null && index != null) {
                let skillId = UserSkill.ins().getSkillId(this.job, index, lv)
                data.push(skillId);
            }
        }
        return data;
    };

    public getSkillListByeType(skillType: SkillType) {
        let skills = this.getSkillIDs();
        let skillIds = [];
        let config = GlobalConfig.ins("SkillsConfig");
        for (var i = 0; i < skills.length; i++) {
            let skillsConfig = config[skills[i]];
            if (skillsConfig && skillsConfig.skillType == skillType) {
                skillIds.push(skills[i]);
            }
        }
        return skillIds;
    }
    /**获取当前角色装备的被动技能id */
    public getAllPassSkillId(): number[] {
        let config = GlobalConfig.ins("SkillsOpenConfig")[this.job];
        let passSkillId = [];
        if (this.skillsData) {
            for (var i = 0; i < this.skillsData.length; i++) {
                if (this.skillsData[i] > 0) {
                    for (var f = 0; f < config.length; f++) {
                        if (config[f].index == (i + 1)) {
                            let skillId = config[f].skillId - config[f].initialLevel + this.skillsData[i];
                            let skillsConfig = GlobalConfig.ins("SkillsConfig")[skillId];
                            if (skillsConfig && skillsConfig.skillType == SkillType.TYPE4) {
                                passSkillId.push(skillId);
                            }
                            break;
                        }
                    }
                }
            }
        }
        return passSkillId;
    }
    public mergeData(data: Role) {
        this.masterHandle = data.masterHandle;
        this.handle = data.handle;
        // this.configID = data.configID;
        this.type = data.type;
        this.x = data.x;
        this.y = data.y;
        // this.power = data.power;
        this.attributeData = data.attributeData;
        this.attributeExData = data.attributeExData;
        this.team = data.team;
        this.name = data.name
        this.guildID = data.guildID
        this.guildName = data.guildName
        if (data instanceof Role) {
            this.warLevel = data.warLevel;
            this.mountsLevel = data.mountsLevel;
            this.mountsShowLv = data.mountsShowLv;
            this.zhuanzhiLv = data.zhuanzhiLv;
        }
        return this;
    };
    /**
     * 根据装备子类型获取该装备数据
     * @param subType 装备子类型
     */
    public getEquipDataBysubType(subType) {
        for (var i = 0; i < this.equipsData.length; i++) {
            var itemConfig = this.equipsData[i + 1].item.itemConfig;
            if (itemConfig) {
                if (itemConfig.subType == subType)
                    return this.equipsData[i + 1];
            }
            else
                return null;
        }
        return null;
    };
    /**
     * 技能总战斗力
     */
    public getSkillTotalPower() {
        var totalPower = 0;
        for (var i = 0; i < this.skillsData.length; i++) {
            var skillConfig = GlobalConfig.skillPowerConfig[i];
            totalPower += this.skillsData[i] * skillConfig.powerPerLevel;
        }
        return totalPower;
    };
    /**
     * 锻造总战斗力
     */
    public getForgeTotalPower(type) {
        var totalPower = 0;
        var n = ForgeConst.CAN_FORGE_EQUIP.length;
        while (n--) {
            var i = ForgeConst.CAN_FORGE_EQUIP[n];
            var lv = void 0;
            switch (type) {
                case 0:
                    lv = this.equipsData[i].strengthen;
                    break;
                case 1:
                    lv = this.equipsData[i].gem;
                    break;
                case 2:
                    lv = this.equipsData[i].zhuling;
                    break;
                case 3:
                    lv = this.equipsData[i].tupo;
                    break;
            }
            if (lv > 0) {
                var forgeConfig = UserForge.ins().getForgeConfigByPos(i, lv, type);
                totalPower += Math.floor(UserBag.getAttrPower(forgeConfig.attr));
            }
        }
        return totalPower;
    }

    public get name() {
        return this._name;
    }

    public set name(str: string) {
        this._name = str;
    }

    public get guildAndName() {
        // return this.guildID == 0 || this.guildID == undefined ? this.name : "<font color='#3C8CF8'>" + this.guildName + "</font>" + "\n" + this.name;
        // |C:0x0000ff&T:带色字体
        return this.guildID == 0 || this.guildID == undefined ? this.name : "|C:0x3C8CF8&T:" + this.guildName + "|" + "\n" + this.name;
    }

    public get lv() {
        return this._lv;
    }

    public set lv(value: number) {
        this._lv = value;
    }

    //------------------------------------------------------获取数据方法---------------------------------------------
    /**根据索引获取主宰装备 */
    public getZhuZaiDataByIndex(index) {
        return this.zhuZaiData[index];
    };
    /**根据索引获取装备 */
    public getEquipByIndex(index): EquipsData {
        return this.equipsData[index];
    };

    /**获取装备数量 */
    public getEquipLen() {
        return this.equipsData.length;
    };
    /**获取装备数量(不包括转职装备) */
    public getEquipLen2() {
        return EquipPos.MAX;
    };
    /** 根据索引获取技能数据 */
    public getSkillsDataByIndex(index) {
        return this.skillsData[index];
    };
    /** 根据所以设置技能数据 */
    public setSkillsDataByIndex(index, value) {
        this.skillsData[index] = value;
    };
    /** 根据索引获取特殊戒指数据 */
    public getExRingsData(index) {
        return this.exRingsData[index];
    };
    /** 根据所以设置特殊戒指数据 */
    public setExRingsData(index, value) {
        this.exRingsData[index] = value;
    };
    private EquipPointGrowUpConfig
    /** 根据所以设置主宰装备 */
    public setZhuZaiData(index: number, value: Sproto.zhuzai_data) {
        let data = this.zhuZaiData[index]
        // data.growupID = value.growupID
        data.id = value.id

        if (value.level < data.level) {
            if (this.EquipPointGrowUpConfig == null)
                this.EquipPointGrowUpConfig = GlobalConfig.ins("EquipPointGrowUpConfig");
            var tempConf = this.EquipPointGrowUpConfig[data.id][value.level];
            if (tempConf) {
                let str = LanguageString.jifengTiaoyueCh(GlobalConfig.jifengTiaoyueLg.st100139, [tempConf.rank, tempConf.star]);
                WarnWin.show(str, null, this);
            }
        } else if (value.level == data.level) {
            WarnWin.show(GlobalConfig.jifengTiaoyueLg.st100140, null, this);
        }

        data.level = value.level
        // data.rank = value.rank
    };
    getSkillList() {
        for (var e = this.getCurSkillIDs(), t = [], i = 0; i < e.length; i++) {
            var n = e[i],
                r = GlobalConfig.skillsConfig[n];
            ErrorLog.Assert(r, "No such skillId config:" + n) || t.push(r)
        }
        return t
    }
    public static GetNextLv(lv) {
        let index = Role.levelList.indexOf(lv);
        return Role.levelList[Role.levelList.indexOf(lv) + 1];
    }
    static jobNumberToName(index) {
        let realJob = [
            GlobalConfig.jifengTiaoyueLg.st100110,
            GlobalConfig.jifengTiaoyueLg.st100111,
            GlobalConfig.jifengTiaoyueLg.st100112,
            GlobalConfig.jifengTiaoyueLg.st100113
        ];
        return realJob[index]
    }
    public static translate = {
        'hp': AttributeType.atMaxHp,
        'atk': AttributeType.atAttack,
        'def': AttributeType.atDef,
        'res': AttributeType.atRes,
        'crit': AttributeType.atCrit,
        'tough': AttributeType.atTough
    };
    private static _inverseTranslate;
    public static get inverseTranslate() {
        if (Role._inverseTranslate) return Role._inverseTranslate;
        Role._inverseTranslate = {}
        for (let i in Role.translate) {
            Role._inverseTranslate[Role.translate[i]] = i;
        }
        return Role._inverseTranslate;
    }
    public static typeNumberToName(type) {
        let realType = [
            GlobalConfig.jifengTiaoyueLg.st100114,//"武器",
            GlobalConfig.jifengTiaoyueLg.st100115,//"头盔",
            GlobalConfig.jifengTiaoyueLg.st100116,//"衣服",
            GlobalConfig.jifengTiaoyueLg.st100117,//"项链",
            GlobalConfig.jifengTiaoyueLg.st100118,//"手镯",
            GlobalConfig.jifengTiaoyueLg.st100119,//"戒指",
            GlobalConfig.jifengTiaoyueLg.st100120,//"护肩",
            GlobalConfig.jifengTiaoyueLg.st100121,//"里衣",
            GlobalConfig.jifengTiaoyueLg.st100122,//"副手",
            GlobalConfig.jifengTiaoyueLg.st100123,//"腰带",
            GlobalConfig.jifengTiaoyueLg.st100124,//"护膝",
            GlobalConfig.jifengTiaoyueLg.st100125,//"吊坠"
        ];
        return realType[type];
    }

    public static typeEquipWingToName(type) {
        let realWing = [
            GlobalConfig.jifengTiaoyueLg.st100126,//"翼枢",
            GlobalConfig.jifengTiaoyueLg.st100127,//"翼石",
            GlobalConfig.jifengTiaoyueLg.st100128,//"翎羽",
            GlobalConfig.jifengTiaoyueLg.st100129,//"彩凤",
        ]
        return realWing[type];
    }

    public static typeFuwenNumberToName(type) {
        let realFuwen = [
            GlobalConfig.jifengTiaoyueLg.st100130,//"临",
            GlobalConfig.jifengTiaoyueLg.st100131,//"兵",
            GlobalConfig.jifengTiaoyueLg.st100132,//"斗",
            GlobalConfig.jifengTiaoyueLg.st100133,//"者",
            GlobalConfig.jifengTiaoyueLg.st100134,//"皆",
            GlobalConfig.jifengTiaoyueLg.st100135,//"阵",
            GlobalConfig.jifengTiaoyueLg.st100136,//"列",
            GlobalConfig.jifengTiaoyueLg.st100137,//"在",
            GlobalConfig.jifengTiaoyueLg.st100138,//"前",
        ];
        return realFuwen[type];
    }

    public static levelList = [
        0, 1, 10, 20, 30, 40, 50, 60, 70, 80, 1000, 2000, 3000,
        4000, 5000, 6000, 7000, 8000, 9000, 10000, 11000, 12000
    ]

    public GetSubRoleData(): SubRole {
        let data = new SubRole
        data.job = this.job
        data.sex = this.sex
        data.legendDress = this.legendDress

        let equip1 = this.getEquipByIndex(EquipPos.CLOTHES)
        data.clothID = equip1 != null ? equip1.item.configID : 0

        let equip2 = this.getEquipByIndex(EquipPos.WEAPON)
        data.swordID = equip2 != null ? equip2.item.configID : 0

        if (this.wingsData.openStatus) {
            data.wingLevel = this.wingsData.lv
            data.wingShowLevel = this.wingsData.showLv;
        }
        data.wingOpenStatus = this.wingsData.openStatus;
        data.zhuangbei = []
        for (let i = 0; i < this.zhuangbei.length; ++i) {
            data.zhuangbei[i] = this.zhuangbei[i]
        }
        data.mountLv = this.mountsLevel;
        data.moubtShowLv = this.mountsShowLv;
        data.zhuanzhiLv = this.zhuanzhiLv;
        return data
    }

    public GetHeadImgName(): string {
        return ResDataPath.GetHeadMiniImgName(this.job, this.sex)
    }

    public GetHeadImgName2(): string {
        return ResDataPath.GetHeadMiniImgName2(this.job, this.sex)
    }


}
window["Role"] = Role