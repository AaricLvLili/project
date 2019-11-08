var __ref_field__: any = AttributeType

class AttributeData {

    type: AttributeType;
    value: number;

    public constructor(config: any = null) {
        if (config) {
            this.type = config.type
            this.value = config.value
        }
    }

    public parser(data: Sproto.attribute_data) {
        this.type = data.type
        this.value = data.value
    }

    /**装扮等级属性叠加*/
    public static AttrStringAddition2(attr, config, level) {
        let list = {};
        let valueNum = 0
        for (var i = 1; i < level; i++) {
            let sjConfig = config[i].attr;
            for (var j = 0; j < sjConfig.length; j++) {
                var element = sjConfig[j];
                if (list[element.type] == undefined) {
                    list[element.type] = element.value;
                }
                else {
                    list[element.type] = list[element.type] + element.value;
                }
            }
        }

        for (var n = 0; n < attr.length; n++) {
            var element = attr[n];
            if (list[element.type] == undefined) {
                list[element.type] = element.value;
            }
            else {
                list[element.type] = list[element.type] + element.value;
            }
        }

        var listAttr = [];
        for (var key in list) {
            var o = new AttributeData;
            o.type = parseInt(key);
            o.value = list[key];
            listAttr.push(o);
        }
        return listAttr;
    }

    public static AttrAddition(attr1, attr2) {
        let attr = [];
        let tmp = [];
        for (let i in attr1) {
            tmp[attr1[i].type] = attr1[i].value
        }
        for (let i in attr2) {
            tmp[attr2[i].type] = (tmp[attr2[i].type] || 0) + attr2[i].value
        }
        for (let i in tmp) {
            let attrData = new AttributeData();
            attrData.type = parseInt(i);
            attrData.value = tmp[i];
            attr.push(attrData);
        }
        return attr;
    }
    /**
     * 属性列表转换（用于解析配置表后的属性列表obgject转换AttributeData[])
     * @param attrObj
     */
    public static transformAttr(attrObj) {
        var attrList = [];
        for (var key in attrObj) {
            var attr = new AttributeData;
            attr.type = attrObj[key].type;
            attr.value = attrObj[key].value;
            attrList.push(attr);
        }
        for (var i = 0; i < attrList.length - 1; i++) {
            for (var j = 0; j < attrList.length - i - 1; j++) {
                if (attrList[j] < attrList[j + 1]) {
                    var temp = attrList[j + 1];
                    attrList[j + 1] = attrList[j];
                    attrList[j] = temp;
                }
            }
        }
        return attrList;
    };
    /**
     * 通过属性对象数组获取字符串
     * @param att	   属性对象(支持AttributeData[] | AttributeData | config )
     * @param interval  属性名与属性值间隔多宽(默认4格)
     * @param newline   属性与属性上下间隔几行(默认1行)
     * @param sign	  符号 默认 +
     * @param isShowName 是否显示属性名字
     */
    public static getAttStr(att, intervals: number = 4, newline: number = 1, sign: string = "+", isInserte: boolean = false, r = "#4c78db", isShowName: boolean = true) {
        var str = "";
        if (att instanceof AttributeData)
            return this.getAttStrByType(att, intervals, sign, isInserte, r, isShowName);
        else if (att instanceof Array) {
            var atts = att;
            for (var i = 0; i < atts.length; i++) {
                str += this.getAttStrByType(atts[i], intervals, sign, isInserte, r, isShowName);
                if (i < atts.length - 1) {
                    for (var j = 0; j < newline; j++)
                        str += "\n";
                }
            }
        }
        else {
            var objAtts = [];
            for (var k in this.translate) {
                if (isNaN(att[k]))
                    continue;
                var a = new AttributeData;
                a.type = parseInt(this.translate[k]);
                a.value = att[k];
                objAtts.push(a);
            }
            return this.getAttStr(objAtts, intervals, newline, sign, isInserte);
        }
        return str;
    };

    public static getAttStrForZhuzai(att, intervals: number = 4, newline: number = 1, sign: string = "+", isInserte: boolean = false, r = "#ffffff") {
        var str = "";
        var atts = att;
        str += this.getAttStrByTypeForZhuzai(atts[0], intervals, sign, isInserte, r);
        return str;
    };

    /**戒灵 获取属性字符串;过滤 atRingBuff 属性*/
    public static getAttStrForRing(att) {
        var str = "";
        var att1 = []

        if (att instanceof Array) {
            for (var a of att) {
                if (a.type != AttributeType.atRingBuff) { att1.push(a) }  //过滤 atRingBuff 属性
            }

            str = AttributeData.getAttStr(att1, 0, 1, ": ")
        }
        return str
    }
    /**
     * 通过属性对象获取字符串（例如：攻击 +1000)
     * @param att   属性对象
     * @param interval  间隔多宽(默认4格)
     * @param sign  符号 默认 +
     * @param isInserte  是否插入空格 默认false
     * @param isShowName 是否显示属性名字
     */
    public static getAttStrByType(att, interval: number = 4, sign: string = "+", isInserte: boolean = false, s = null, isShowName: boolean = true) {
        var str = ""
        if (s && isShowName) {
            str = StringUtils.complementByChar(AttributeData.getAttrStrByType(att.type), interval * 8);
        }
        if (att.type == AttributeType.atCrit || att.type == AttributeType.atTough)
            str += sign + (att.value / 100) + "%";
        else if (att.type > 10)
            if (att.type == 15)
                str += sign + (att.value / 1000) + GlobalConfig.jifengTiaoyueLg.st100141;
            else if (AttributeType.atAtkEx == att.type)
                str += sign + (att.value / 100) + "%";
            else if (AttributeType.atCritHurt == att.type || AttributeType.atRegeneration == att.type)
                str += sign + att.value
            else
                str += sign + (att.value / 100) + "%";
        else
            str += sign + att.value;
        return str;
    };

    public static getAttStrByTypeForZhuzai(att, interval: number = 4, sign: string = "+", isInserte: boolean = false, s = null) {
        var str = GlobalConfig.jifengTiaoyueLg.st100142

        if (att.type == AttributeType.atMaxHp
            || att.type == AttributeType.atAttack
            || att.type == AttributeType.atDef
            || att.type == AttributeType.atRes
            || att.type == AttributeType.atCrit
            || att.type == AttributeType.atTough
        )
            str += sign + (att.value / 100) + "%";
        else if (att.type > 10)
            if (att.type == 15)
                str += sign + (att.value / 1000) + GlobalConfig.jifengTiaoyueLg.st100141;
            else if (AttributeType.atAtkEx == att.type)
                str += sign + (att.value / 100) + "%";
            else if (AttributeType.atCritHurt == att.type || AttributeType.atRegeneration == att.type)
                str += sign + att.value
            else
                str += sign + (att.value / 100) + "%";
        else
            str += sign + att.value;
        return str;
    };
    /**
     * 字符串插入空格
     * @param str  要更改的字符串
     * @param blankNum 插入空格数
     * @param location 插入位置 0左边 1 中间  2 右边（默认中间）
     */
    public static inserteBlank(str, blankNum, location = 1) {
        var strLen = str.length;
        var blank = "";
        while (blankNum--) {
            blank += " ";
        }
        var nStr = "";
        switch (location) {
            case 0:
                nStr = blank + str;
                break;
            case 1:
                nStr = str.slice(0, strLen / 2) + blank + str.slice(strLen / 2);
                break;
            case 2:
                nStr = str + blank;
                break;
        }
        return nStr;
    };

    private static EquipConfig: any;
    // /**
    //  * 通过物品来获取装备属性
    //  * @param data
    //  */
    // public static getAttrInfoByItemData(data) {
    //     if (this.EquipConfig == null)
    //         this.EquipConfig = GlobalConfig.equipConfig;
    //     var config = this.EquipConfig[data.configID];
    //     var attrStr = "";
    //     var type = 0;
    //     for (var k in this.translate) {
    //         if (config[k] <= 0)
    //             continue;
    //         for (var i = 0; i < data.att.length; i++) {
    //             type = data.att[i].type;
    //             if (this.translate[k] == type) {
    //                 attrStr += AttributeData.getAttrStrByType(type) + ": ";
    //                 attrStr += config[k] + ' +' + data.att[i].value + "\n";
    //             }
    //         }
    //     }
    //     return attrStr;
    // };
    public static GetAttrValueByItemId(configId, attrType) {
        if (this.EquipConfig == null)
            this.EquipConfig = GlobalConfig.equipConfig;
        var config = this.EquipConfig[configId];
        var attrStr = "";
        for (var k in this.translate) {
            if (this.translate[k] == attrType) {
                let value = config[k]
                return AttributeData.getAttrStrByType(attrType) + ": " + value
            }
        }
        return attrStr;
    }
    /**
     * 通过属性类型获取属性中文名字
     * @param type
     */
    public static getAttrStrByType(type: AttributeType) {
        var str = "";
        switch (type) {
            case AttributeType.atHp:
                str = GlobalConfig.jifengTiaoyueLg.st100143;//"当前生命";
                break;
            case AttributeType.atMp:
                str = GlobalConfig.jifengTiaoyueLg.st100144;//"当前魔法";
                break;
            case AttributeType.atMaxHp:
                str = GlobalConfig.jifengTiaoyueLg.st100145;//"生命";
                break;
            case AttributeType.atMaxMp:
                str = GlobalConfig.jifengTiaoyueLg.st100146;//"魔法";
                break;
            case AttributeType.atAttack:
                str = GlobalConfig.jifengTiaoyueLg.st100147;//"攻击";
                break;
            case AttributeType.atDef:
                str = GlobalConfig.jifengTiaoyueLg.st100148;//"物防";
                break;
            case AttributeType.atRes:
                str = GlobalConfig.jifengTiaoyueLg.st100149;//"法防";
                break;
            case AttributeType.atCrit:
                str = GlobalConfig.jifengTiaoyueLg.st100150;//"暴击";
                break;
            case AttributeType.atTough:
                str = GlobalConfig.jifengTiaoyueLg.st100151;//"抗暴击几率";
                break;
            case AttributeType.atMoveSpeed:
                str = GlobalConfig.jifengTiaoyueLg.st100152;//"移速";
                break;
            case AttributeType.atAttackSpeed:
                str = GlobalConfig.jifengTiaoyueLg.st100153;//"攻速";
                break;
            case AttributeType.atHpEx:
                str = GlobalConfig.jifengTiaoyueLg.st100154;//"生命加成";
                break;
            case AttributeType.atAtkEx:
                str = GlobalConfig.jifengTiaoyueLg.st100155;//"攻击加成";
                break;
            case AttributeType.atStunPower:
                str = GlobalConfig.jifengTiaoyueLg.st100156;//"麻痹几率";
                break;
            case AttributeType.atStunRes:
                str = GlobalConfig.jifengTiaoyueLg.st100157;//"麻痹抵抗";
                break;
            case AttributeType.atStunTime:
                str = GlobalConfig.jifengTiaoyueLg.st100158;//"麻痹时间";
                break;
            case AttributeType.atDamageReduction:
                str = GlobalConfig.jifengTiaoyueLg.st100159;//"伤害减免";
                break;
            case AttributeType.atCritHurt:
                str = GlobalConfig.jifengTiaoyueLg.st100160;//"暴击伤害";
                break;
            case AttributeType.atRegeneration:
                str = GlobalConfig.jifengTiaoyueLg.st100161;//"生命回复";//"每秒恢复生命";
                break;
            case AttributeType.atCritEnhance:
                str = GlobalConfig.jifengTiaoyueLg.st100162;//"暴伤倍数";
                break;
            case AttributeType.atPenetrate:
                str = GlobalConfig.jifengTiaoyueLg.st100163;//"穿透";//"伤害穿透";
                break;
            case AttributeType.atRoleDamageEnhance:
                str = GlobalConfig.jifengTiaoyueLg.st100164;//"伤害加深";//"攻击玩家伤害加深";
                break;
            case AttributeType.atRoleDamageReduction:
                str = GlobalConfig.jifengTiaoyueLg.st100165;//"伤害减免";//"受到玩家伤害减免";
                break;
            case AttributeType.atJob1DamageEnhance:
                str = GlobalConfig.jifengTiaoyueLg.st100166;//"攻击剑士伤害加深";
                break;
            case AttributeType.atJob2DamageEnhance:
                str = GlobalConfig.jifengTiaoyueLg.st100167;//"攻击法师伤害加深";
                break;
            case AttributeType.atJob3DamageEnhance:
                str = GlobalConfig.jifengTiaoyueLg.st100168;//"攻击牧师伤害加深";
                break;
            case AttributeType.atJob1DamageReduction:
                str = GlobalConfig.jifengTiaoyueLg.st100169;//"受到剑士伤害减免";
                break;
            case AttributeType.atJob2DamageReduction:
                str = GlobalConfig.jifengTiaoyueLg.st100170;//"受到法师伤害减免";
                break;
            case AttributeType.atJob3DamageReduction:
                str = GlobalConfig.jifengTiaoyueLg.st100171;//"受到牧师伤害减免";
                break;
            case AttributeType.atDefEx:
                str = GlobalConfig.jifengTiaoyueLg.st100148;//"物防";//"物防百分比";
                break;
            case AttributeType.atResEx:
                str = GlobalConfig.jifengTiaoyueLg.st100149;//"法防";//"法防百分比";
                break;
            case AttributeType.atDodgeProb:
                str = GlobalConfig.jifengTiaoyueLg.st100172;//"闪避概率";
                break;
            case AttributeType.atStrength:
                str = GlobalConfig.jifengTiaoyueLg.st100173;//"力量";
                break;
            case AttributeType.atFaster:
                str = GlobalConfig.jifengTiaoyueLg.st100174;//"敏捷";
                break;
            case AttributeType.atIntelligence:
                str = GlobalConfig.jifengTiaoyueLg.st100175;//"智力";
                break;
            case AttributeType.atPhysical:
                str = GlobalConfig.jifengTiaoyueLg.st100176;//"体质";
                break;
            case AttributeType.atMpRecove:
                str = GlobalConfig.jifengTiaoyueLg.st100177;//"魔法回复";
                break;
            case AttributeType.atMpRecoveEx:
                str = GlobalConfig.jifengTiaoyueLg.st100177;//"魔法回复";
                break;
            case AttributeType.WATER:
                str = GlobalConfig.jifengTiaoyueLg.st100178;//"水元素伤害";
                break;
            case AttributeType.FIRE:
                str = GlobalConfig.jifengTiaoyueLg.st100179;//"火元素伤害";
                break;
            case AttributeType.WIND:
                str = GlobalConfig.jifengTiaoyueLg.st100180;//"风元素伤害";
                break;
            case AttributeType.LIGHT:
                str = GlobalConfig.jifengTiaoyueLg.st100181;//"光元素伤害";
                break;
            case AttributeType.DARK:
                str = GlobalConfig.jifengTiaoyueLg.st100182;//"暗元素伤害";
                break;
            case AttributeType.ANTIWATER:
                str = GlobalConfig.jifengTiaoyueLg.st100183;//"水元素抗性";
                break;
            case AttributeType.ANTIFIRE:
                str = GlobalConfig.jifengTiaoyueLg.st100184;//"火元素抗性";
                break;
            case AttributeType.ANTIWIND:
                str = GlobalConfig.jifengTiaoyueLg.st100185;//"风元素抗性";
                break;
            case AttributeType.ANTILIGHT:
                str = GlobalConfig.jifengTiaoyueLg.st100186;//"光元素抗性";
                break;
            case AttributeType.ANTIDARK:
                str = GlobalConfig.jifengTiaoyueLg.st100187;//"暗元素抗性";
                break;
            default:
        }
        return str;
    };
    public static getAttrStrAdd(attrbute, viplv) {
        var attr = [];
        if (UserVip.ins().lv >= viplv) {
            var num_1 = GlobalConfig.ins("VipConfig")[viplv].attrAddition["percent"] || 0;
            attrbute.forEach(function (element) {
                var attrdata = new AttributeData();
                attrdata.type = element.type;
                attrdata.value = (element.value * (100 + num_1) / 100) >> 0;
                attr.push(attrdata);
            });
        }
        else
            attr = attrbute;
        return attr;
    };
    // public static getAttrStarAdd(attrbute, count) {
    //     var attr = [];
    //     attrbute.forEach(function (element) {
    //         var attrdata = new AttributeData();
    //         attrdata.type = element.type;
    //         attrdata.value = (element.value * count) >> 0;
    //         attr.push(attrdata);
    //     });
    //     return attr;
    // };
    public static translate = {
        'hp': AttributeType.atMaxHp,
        'atk': AttributeType.atAttack,
        'def': AttributeType.atDef,
        'res': AttributeType.atRes,
        'crit': AttributeType.atCrit,
        'tough': AttributeType.atTough
    };



    public static setAttrGroup(attr: any[], group: eui.Group, size: number = 18, color: number = Color.FontColor, isSort: boolean = false, color2: number = Color.Green, tailaddstr: any[] = [], isChangeGroupWidth = false) {
        let childNum = group.numChildren;
        let oldlabList: eui.Label[] = [];
        attr.sort(this.sorType);
        for (var i = 0; i < childNum; i++) {
            let child = group.removeChildAt(0);
            if (child && child instanceof eui.Label) {
                if (i == 0) {
                    size = child.size;
                }
                oldlabList.push(child);
            }
        }
        if (attr.length <= 0) {
            let lab = this.createLab(size, color, oldlabList[0]);
            lab.text = "";
            group.addChild(lab);
        } else {
            let labList = [];
            for (var i = 0; i < attr.length; i++) {
                let addStr = "";
                let value = attr[i].value;
                switch (attr[i].type) {
                    case AttributeType.atCrit:
                    case AttributeType.atTough:
                    case AttributeType.atHpEx:
                    case AttributeType.atAtkEx:
                    case AttributeType.atDamageReduction:
                    case AttributeType.atCritEnhance:
                    case AttributeType.atPenetrate:
                    case AttributeType.atRoleDamageEnhance:
                    case AttributeType.atRoleDamageReduction:
                    case AttributeType.atJob1DamageReduction:
                    case AttributeType.atJob2DamageReduction:
                    case AttributeType.atJob3DamageReduction:
                    case AttributeType.atDefEx:
                    case AttributeType.atResEx:
                    case AttributeType.atDodgeProb:
                    case AttributeType.atDamageReboundProb:
                    case AttributeType.atMpEx:
                        value = (value / 100).toFixed(2);
                        addStr = "%"
                        break;
                }
                let str = this.getAttrStrByType(attr[i].type);
                let label = this.createLab(size, color, oldlabList[i]);
                if (color2) {
                    let newtailaddStr = ""
                    if (tailaddstr && tailaddstr[i]) {
                        newtailaddStr = tailaddstr[i];
                    }
                    let str2 = " " + value + addStr + newtailaddStr;
                    label.textFlow = <Array<egret.ITextElement>>[
                        { text: str, style: { textColor: color } },
                        { text: str2, style: { textColor: color2 } },
                    ]
                } else {
                    // label.text = str + " " + value + addStr;
                    let str2 = str + " " + value + addStr;
                    label.textFlow = <Array<egret.ITextElement>>[
                        { text: str2 },
                        { text: "" },
                    ]
                }
                /**这是个系统底层bug有时候自动测量文本距离不准导致显示不全补多像素 */
                // egret.setTimeout(function () {
                if (label) {
                    let newWidth = Math.max(label.textWidth, label.measuredWidth);
                    if (newWidth > 0) {
                        label.width = newWidth + 15;
                    } else {
                        label.width = undefined;
                    }
                }
                // }, this, 20);
                labList.push(label);
                group.addChild(label);
            }
            if (isSort == true) {
                labList.sort(this.sorLvUp);
                for (var i = 0; i < labList.length; i++) {
                    let newLab = labList[i];
                    group.addChildAt(newLab, i);
                }
            }
            if (isChangeGroupWidth) {
                let maxLabWidth = 0;
                for (var i = 0; i < labList.length; i++) {
                    let newLab = labList[i];
                    let newLabWidth = Math.max(newLab.textWidth, newLab.measuredWidth);
                    maxLabWidth = Math.max(maxLabWidth, newLabWidth);
                }
                group.width = maxLabWidth;
            }
        }
    }

    /**关联排序 */
    private static sorLvUp(item1: eui.Label, item2: eui.Label): number {
        return item2.text.length - item1.text.length;
    }
    /**关联排序 */
    private static sorType(attr1: any, attr2: any): number {
        return attr1.type - attr2.type;
    }

    private static createLab(size: number = 18, color: number = 0x3b3b3b, oldlab: eui.Label = null): eui.Label {
        let lab: eui.Label = oldlab;
        if (!lab) {
            lab = new eui.Label;
        }
        lab.width = 0;
        lab.width = undefined;
        lab.fontFamily = "Microsoft YaHei";
        lab.size = size;
        lab.textColor = color;
        lab.height = size;
        return lab;
    }
    /**注意用来计算的数据要复合的Attr转变为一个Attr */
    public static getAttr(attrs: any): { type: number, value: number }[] {
        let dic: Dictionary<{ type: number, value: number }> = new Dictionary<{ type: number, value: number }>();
        for (var i = 0; i < attrs.length; i++) {
            let attr = attrs[i]
            for (var f = 0; f < attr.length; f++) {
                let type = attr[f].type;
                let data: { type: number, value: number } = dic.get(type);
                if (data) {
                    data.value += attr[f].value;
                } else {
                    let newData = { type: attr[f].type, value: attr[f].value }
                    dic.set(type, newData);
                }
            }
        }
        if (dic.values.length > 0) {
            let data = [];
            for (var i = 0; i < dic.values.length; i++) {
                if (dic.values[i].value != 0) {
                    data.push(dic.values[i]);
                }
            }
            if (data.length > 0) {
                return data;
            } else {
                return AttributeData.minAttr();
            }
        } else {
            return AttributeData.minAttr();
        }
    }

    private static minAttr(): { type: number, value: number }[] {
        let listData = [];
        let list = { type: 2, value: 0 };
        let list2 = { type: 4, value: 0 };
        let list3 = { type: 5, value: 0 };
        let list4 = { type: 6, value: 0 };
        listData.push(list, list2, list3, list4);
        return listData;
    }
    /**
     *  @param power 前一级战力
     *  @param needItemNum 消耗材料指配置表消耗的第一种材料
     *  @param price 单价
     *  @param basiccon 基础常数
     *  @param increasecon 递增常量
     *  @param slope 斜率
     *  @param revisecon 修正常数
     *  @param lv 等级
     *  return 当前战力
     */
    public static getPower(power: number, needItemNum: number, price: number, basiccon: number, increasecon: number, slope: number, revisecon: number, lv: number): number {
        let newPower = power + needItemNum * price * (basiccon + increasecon * Math.pow((slope * revisecon / (revisecon + lv)), (lv - 1)));
        return Math.floor(newPower);
    }
    /**获得总战力
     * @param lvAdd 还没算的等级   
     * @param nowLv 当前的等级 
     * @param power 还没算的等级之前得到的战力 
     */
    public static getNowPower(lvAdd: number, nowLv: number, power: number, needItemNum: number, price: number, basiccon: number, increasecon: number, slope: number, revisecon: number) {
        if (nowLv == 0) {
            return [];
        }
        if (lvAdd <= 0) {
            /**固定一级开始算不能低于1 */
            lvAdd = 1;
        }
        let getPower: number = 0;
        let newNeedItem;
        if (needItemNum == null) {
            newNeedItem = 1 + Math.floor(lvAdd / 5);
        } else {
            newNeedItem = 1 + Math.floor(lvAdd / needItemNum);
        }
        getPower = AttributeData.getPower(power, newNeedItem, price, basiccon, increasecon, slope, revisecon, lvAdd);
        if (lvAdd >= nowLv || nowLv == 0) {
            return Math.floor(getPower);
        } else {
            lvAdd += 1;
            return AttributeData.getNowPower(lvAdd, nowLv, getPower, needItemNum, price, basiccon, increasecon, slope, revisecon);
        }

    }
    /**公式数值 */
    public static getAttrByPower(maxHp: number, maxAtk: number, maxDef: number, maxMagDef: number, power: number): { type: number, value: number }[] {
        let listData = [];
        let config = GlobalConfig.ins("AttrPowerConfig");
        let hp = Math.floor(power * maxHp / (config[AttributeType.atMaxHp].power / 100));
        let atk = Math.floor(power * maxAtk / (config[AttributeType.atAttack].power / 100));
        let def = Math.floor(power * maxDef / (config[AttributeType.atDef].power / 100));
        let magDef = Math.floor(power * maxMagDef / (config[AttributeType.atRes].power / 100));
        let list1 = { type: AttributeType.atMaxHp, value: hp };
        let list2 = { type: AttributeType.atAttack, value: atk };
        let list3 = { type: AttributeType.atDef, value: def };
        let list4 = { type: AttributeType.atRes, value: magDef };
        listData.push(list1, list2, list3, list4);
        return listData;
    }

    public static getAttrElementByPower(power: number, elementValue1: number, elementValue2: number, maxElement1: number, maxElement2: number) {
        let listData = [];
        let config = GlobalConfig.ins("AttrPowerConfig");
        let element1 = Math.floor(power * maxElement1 / (config[elementValue1].power / 100));
        let element2 = Math.floor(power * maxElement2 / (config[elementValue2].power / 100));
        let list5 = { type: elementValue1, value: element1 };
        let list6 = { type: elementValue2, value: element2 };
        listData.push(list5, list6);
        return listData;
    }

    public static removeZeroAttr(attr) {
        let data = [];
        for (var i = 0; i < attr.length; i++) {
            if (attr[i].value > 0) {
                data.push(attr[i]);
            }
        }
        if (data.length > 0) {
            return data;
        } else {
            return attr;
        }
    }

    public static getElementName(type: ElementType): string {
        let str = GlobalConfig.jifengTiaoyueLg.st100198;//"不明元素";
        switch (type) {
            case ElementType.WATER:
                str = GlobalConfig.jifengTiaoyueLg.st100199;// "水元素";
                break;
            case ElementType.FIRE:
                str = GlobalConfig.jifengTiaoyueLg.st100200;// "火元素";
                break;
            case ElementType.WIND:
                str = GlobalConfig.jifengTiaoyueLg.st100201;// "风元素";
                break;
            case ElementType.LIGHT:
                str = GlobalConfig.jifengTiaoyueLg.st100202;// "光元素";
                break;
            case ElementType.DARK:
                str = GlobalConfig.jifengTiaoyueLg.st100203;// "暗元素";
                break;
        }
        return str;
    }
    /**获取克制类型 */
    public static getElementKType(type: ElementType): ElementType {
        let kType = type + 1;
        if (kType > ElementType.DARK) {
            kType = ElementType.WATER;
        }
        return kType;
    }
    /**获取被克制类型 */
    public static getElementBKType(type: ElementType): ElementType {
        let kType = type - 1;
        if (kType < ElementType.WATER) {
            kType = ElementType.DARK;
        }
        return kType;
    }
}
window["AttributeData"] = AttributeData