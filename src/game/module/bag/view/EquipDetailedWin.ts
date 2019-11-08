class EquipDetailedWin extends BaseEuiPanel {

    _bottomY = 0; //最后一个组件的Y坐标值
    _equipPower = 0;
    _totalPower = 0;
    // totalPower: any;
    itemIcon: any;
    roleModel: Role;
    typeIndex: number;
    nameLabel: eui.Label;

    levelKey: eui.Label;
    type: eui.Label;
    lv: eui.Label;
    career: eui.Label;
    score: eui.Label;

    baseAttr: eui.Label;
    attr1: eui.Label;
    attr2: eui.Label;
    attr3: eui.Label;
    attr4: eui.Label;
    forgeGroup: any;

    background: any;
    group: any;
    replaceBtn: eui.Button;

    private powerLabel//eui.BitmapLabel
    public m_Lan1: eui.Label;
    public m_Lan2: eui.Label;
    public m_Lan3: eui.Label;

    public constructor() {
        super();
    }

    public initUI() {
        super.initUI();
        this.skinName = "EquipTipsSkin";
        // this.totalPower = BitmapNumber.ins().createNumPic(0, "1");
        // this.totalPower.x = 184;
        // this.totalPower.y = 123;
        // this.addChild(this.totalPower);
        this.itemIcon.imgJob.visible = false;
        this.replaceBtn.label = GlobalConfig.jifengTiaoyueLg.st100318;
        this.m_Lan1.text = GlobalConfig.jifengTiaoyueLg.st101493;
        this.m_Lan2.text = GlobalConfig.jifengTiaoyueLg.st101494;
        this.m_Lan3.text = GlobalConfig.jifengTiaoyueLg.st101495;
    };
    public open(...param: any[]) {
        var type = param[0];
        var handle = param[1];
        var configID = param[2];
        var data = param[3];
        this.roleModel = param[4];
        this.typeIndex = param[5];
        if (this.typeIndex == null) {
            this.replaceBtn.visible = false;
        }
        this.addEventListener(egret.TouchEvent.TOUCH_END, this.otherClose, this);
        this.setData(type, handle, configID, data);
    };
    public close() {
        this.removeEventListener(egret.TouchEvent.TOUCH_END, this.otherClose, this);
    };
    public otherClose(evt: egret.TouchEvent) {
        if (evt.target == this.replaceBtn) {
            GameGlobal.MessageCenter.dispatch(MessageDef.FUWEN_EQUIP_REPLACE, this.typeIndex);
        }
        ViewManager.ins().close(EquipDetailedWin);
    };

    private EquipConfig: any;
    public setData(type, handle, configID, _data) {
        var data = _data instanceof ItemData ? _data : undefined;
        var itemConfig;
        this._totalPower = 0;
        if (handle != undefined && data == undefined) {
            data = UserBag.ins().getBagGoodsByHandle(type, handle);
            if (!data) {
                var len = SubRoles.ins().subRolesLen;
                for (var i = 0; i < len; i++) {
                    var role = SubRoles.ins().getSubRoleByIndex(i);
                    var equipLen = role.getEquipLen();
                    for (var kk = 0; kk < equipLen; kk++) {
                        if (role.getEquipByIndex(kk).item.handle == (handle)) {
                            data = role.getEquipByIndex(kk).item;
                            break;
                        }
                    }
                }
            }
            if (!data) {
                var shopData = Shop.ins().shopData;
                var len: number = shopData.getShopEquipDataLength();
                var sed = null;
                for (var i = 0; i < len; i++) {
                    sed = shopData.getShopEquipDataByIndex(i);
                    if (sed != null) {
                        if (handle == sed.item.handle) {
                            data = sed.item;
                        }
                    }
                }
            }
            if (!data) {
                new Error("请检查handle是否传错！");
            }
            itemConfig = data.itemConfig;
            configID = data.configID;
        }
        else
            itemConfig = GlobalConfig.itemConfig[configID];
        this.nameLabel.text = itemConfig.name;
        this.nameLabel.textColor = ItemBase.QUALITY_COLOR[itemConfig.quality];
        this.itemIcon.setData(itemConfig);
        if (data instanceof ItemData || itemConfig != null) {
            if (data && data.itemConfig.type == ItemType.WING) {
                this.levelKey.text = GlobalConfig.jifengTiaoyueLg.st101481;
                this.type.text = Role.getWingEquipNameByType(itemConfig.subType);
                this.lv.text = LanguageString.jifengTiaoyueCh(GlobalConfig.jifengTiaoyueLg.st101482, [itemConfig.level + 1])
                this.lv.textColor = 0xf87372;
                var len = SubRoles.ins().subRolesLen;
                for (var i = 0; i < len; i++) {
                    if (SubRoles.ins().getSubRoleByIndex(i).wingsData.lv >= itemConfig.level) {
                        this.lv.textColor = 0x00ff00;
                        break;
                    }
                }
            }
            else {
                this.levelKey.text = itemConfig.zsLevel > 0 ? GlobalConfig.jifengTiaoyueLg.st100465 + "：" : GlobalConfig.jifengTiaoyueLg.st100333 + "：";
                if (itemConfig.type == ItemType.FUWEN)
                    this.type.text = Role.getFuwenEquipNameByType(itemConfig.subType);
                else {
                    if (itemConfig.type == 7) {
                        this.type.text = itemConfig.name;
                    } else if (itemConfig.type == ItemType.MOUNTEQUIP) {
                        let str = "";
                        switch (itemConfig.subType) {
                            case 1:
                                str = GlobalConfig.jifengTiaoyueLg.st101483;
                                break;
                            case 2:
                                str = GlobalConfig.jifengTiaoyueLg.st101484;
                                break;
                            case 3:
                                str = GlobalConfig.jifengTiaoyueLg.st101485;
                                break;
                            case 4:
                                str = GlobalConfig.jifengTiaoyueLg.st101486;
                                break;
                        }
                        this.type.text = str;
                        this.levelKey.text = GlobalConfig.jifengTiaoyueLg.st101481;
                    } else {
                        this.type.text = Role.getEquipNameByType(itemConfig.subType);
                    }

                }
                if (itemConfig.type == ItemType.MOUNTEQUIP) {
                    this.lv.text = LanguageString.jifengTiaoyueCh(GlobalConfig.jifengTiaoyueLg.st101864, [itemConfig.zsLevel]);
                } else {
                    this.lv.text = itemConfig.zsLevel > 0 ? LanguageString.jifengTiaoyueCh(GlobalConfig.jifengTiaoyueLg.st101367, [itemConfig.zsLevel]) : LanguageString.jifengTiaoyueCh(GlobalConfig.jifengTiaoyueLg.st101368, [itemConfig.level]);
                    if (itemConfig.zsLevel > 0) {
                        this.lv.textColor = UserZs.ins().lv < itemConfig.zsLevel ? 0xf87372 : 0x008f22;
                    }
                    else {
                        this.lv.textColor = GameLogic.ins().actorModel.level < itemConfig.lv ? 0xf87372 : 0x008f22;
                    }
                }
            }
            this.career.text = Role.getJobNameByJob(itemConfig.job);
        }
        // let nameList: string[] = [];
        // let baseAttrList: string[] = [];
        // let randAttrList: string[] = [];
        var ii = 1;
        this.attr1.visible = false;
        this.attr2.visible = false;
        this.attr3.visible = false;
        this.attr4.visible = false;
        if (this.EquipConfig == null)
            this.EquipConfig = GlobalConfig.equipConfig;
        var config = this.EquipConfig[configID];
        var totalAttr = [];
        for (var k in Role.translate) {
            if (config[k] <= 0)
                continue;
            var attrStr = "";
            var attrName = "";
            // baseAttrList.push(config[k] + "");
            // nameList.push(AttributeData.getAttrStrByType(this.translate[k]));
            attrName += AttributeData.getAttrStrByType(Role.getAttrTypeByName(k)) + ": ";
            attrStr += config[k];
            var attrs = new AttributeData;
            attrs.type = Role.getAttrTypeByName(k);
            attrs.value = config[k];
            totalAttr.push(attrs);
            if (data != undefined) {
                var attr = data.att;
                for (var index = 0; index < attr.length; index++) {
                    if (attr[index].type == Role.getAttrTypeByName(k)) {
                        attrStr += ' +' + attr[index].value + "%";
                        attrs.value += attrs.value * (attr[index].value * 0.01);
                        break;
                    }
                }
            }
            if (this['attr' + ii]) {
                this['attr' + ii].textFlow = <Array<egret.ITextElement>>[{ text: attrName, style: { "textColor": Color.Black } }, { text: attrStr, style: { "textColor": Color.Green } }];;
                this['attr' + ii].visible = true;
            }
            ii++;
        }

        this.baseAttr.visible = this.attr1.visible;
        this._equipPower = Math.floor(UserBag.getAttrPower(totalAttr));
        this._totalPower += this._equipPower;

        this._bottomY = (ii == 1) ? this['attr1'].y : this['attr' + (ii - 1)].y + this['attr' + (ii - 1)].height;
        while (this.forgeGroup.numElements) {
            this.forgeGroup.removeChildAt(0);
        }
        if (this.roleModel) {
            //身上装备
            var len: number = this.roleModel.getEquipLen();
            // let equipsData: EquipsData[] = this.roleModel.equipsData;
            for (var i = 0; i < len; i++) {
                var equipsData = this.roleModel.getEquipByIndex(i);
                if (equipsData.item.handle == (handle)) {
                    this.setForge(equipsData, i);
                    break;
                }
            }
        }
        // 神装装备的特殊属性显示，根据数值来显示
        if (itemConfig.type == ItemType.FUWEN || (itemConfig.type == ItemType.ZHUANZHI) || (itemConfig.type == ItemType.EQUIP)) {
            if (itemConfig.quality >= 4) {
                if (this.EquipConfig == null)
                    this.EquipConfig = GlobalConfig.equipConfig;
                let equipConfig = this.EquipConfig[itemConfig.id]
                if (equipConfig) {
                    let baseAttr = equipConfig.baseAttr ? equipConfig.baseAttr[0] : null
                    if (baseAttr) {
                        let type = baseAttr.type
                        let value = baseAttr.value
                        if (type) {
                            var lineImg = new eui.Image;
                            lineImg.source = "base_2_1_01_png";
                            lineImg.width = 291;
                            lineImg.x = 97;
                            lineImg.y = this._bottomY += 10;
                            this.forgeGroup.addChild(lineImg);
                            //描述
                            var desc = new eui.Label;
                            desc.fontFamily = "Microsoft YaHei";
                            desc.size = 16;
                            desc.textColor = 0x535557;
                            desc.width = 250;
                            desc.x = 113;
                            desc.y = this._bottomY += 10;
                            desc.textFlow = TextFlowMaker.generateTextFlow(AttributeData.getAttrStrByType(type) + StringUtils.addColor(AttributeData.getAttStrByType(baseAttr), Color.Green))
                            this.forgeGroup.addChild(desc);
                            this._bottomY += desc.textHeight;
                        }
                    }
                }
            }
            // 其它装备直接读配置表描述
        } else {
            if (itemConfig.desc) {
                //分割线
                var lineImg = new eui.Image;
                lineImg.source = "base_2_1_01_png";
                lineImg.width = 291;
                lineImg.x = 97;
                lineImg.y = this._bottomY += 10;
                this.forgeGroup.addChild(lineImg);
                //描述
                var desc = new eui.Label;
                desc.fontFamily = "Microsoft YaHei";
                desc.size = 16;
                desc.textColor = 0x535557;
                desc.width = 250;
                desc.x = 113;
                desc.y = this._bottomY += 10;
                desc.textFlow = TextFlowMaker.generateTextFlow(itemConfig.desc);
                this.forgeGroup.addChild(desc);
                this._bottomY += desc.textHeight;
            }
        }
        if (config.baseAttr != null) {
            this._totalPower += Math.floor(UserBag.getAttrPower(config.baseAttr));
        }

        this.background.height = this._bottomY + (this.roleModel ? 12 : 60);
        this.group.y = 400 - this.background.height / 2;
        this.powerLabel.y = this.group.y + 166
        this.powerLabel.label.text = this._totalPower//"战 " + this._totalPower.toString()
        this.score.textFlow = <Array<egret.ITextElement>>[{ text: GlobalConfig.jifengTiaoyueLg.st100070 + ": ", style: { "textColor": 0x535557 } }, { text: this._totalPower.toString(), style: { "textColor": 0xFFBF26 } }];

        // this.baseAttr.text = ItemData.getStringByList(baseAttrList);
        // this.randAttr.text = ItemData.getStringByList(randAttrList);
        // this.nameAttr.text = ItemData.getStringByList(nameList);
        this.replaceBtn.y = this._bottomY + 15;
    };
    public setForge(equipsData, pos) {
        var lv = 0;
        for (var i = 0; i < 4; i++) {
            switch (i) {
                case 0:
                    lv = equipsData.strengthen;
                    break;
                case 1:
                    lv = equipsData.gem;
                    break;
                case 2:
                    lv = equipsData.zhuling;
                    break;
                case 3:
                    lv = equipsData.tupo;
                    break;
            }
            if (lv > 0) {
                var config = UserForge.ins().getForgeConfigByPos(pos, lv, i);
                this.addTips(config.attr, i, lv);
                var power = 0;
                if (i == 3)
                    power = Math.floor(this._equipPower * (Number(config.attr) / 100));
                else
                    power = Math.floor(UserBag.getAttrPower(config.attr));
                this._totalPower += power;
            }
        }
    };
    public addTips(attr, type, lv) {
        var lineImg = new eui.Image;
        lineImg.source = "base_2_1_01_png";
        lineImg.width = 291;
        lineImg.x = 97;
        lineImg.y = this._bottomY + 10;
        this.forgeGroup.addChild(lineImg);
        var titleAttrTxt = new eui.Label;
        titleAttrTxt.fontFamily = "Microsoft YaHei";
        titleAttrTxt.size = 16;
        titleAttrTxt.textColor = 0x535557;
        titleAttrTxt.x = 113;
        titleAttrTxt.y = lineImg.y + 14;
        this.forgeGroup.addChild(titleAttrTxt);
        var attrTxt = new eui.Label;
        attrTxt.fontFamily = "Microsoft YaHei";
        attrTxt.size = 16;
        attrTxt.lineSpacing = 8;
        attrTxt.textColor = 0x535557;
        attrTxt.x = 129;
        attrTxt.y = titleAttrTxt.y + 24;
        this.forgeGroup.addChild(attrTxt);
        var attrs;
        switch (type) {
            case 0:
                titleAttrTxt.text = GlobalConfig.jifengTiaoyueLg.st101487;
                attrs = AttributeData.getAttrStrAdd(attr, 11);
                break;
            case 1:
                titleAttrTxt.text = GlobalConfig.jifengTiaoyueLg.st101488;
                var str = "";
                for (var i = 1; i < 5; i++) {
                    var gem = new eui.Image;
                    gem.x = attrTxt.x;
                    gem.y = (attrTxt.y - 2) + (i - 1) * 23;
                    gem.width = gem.height = 24
                    this.forgeGroup.addChild(gem);
                    var attrName = AttributeData.getAttrStrByType(attr[0].type);
                    if (attr.length > i) {
                        str += "|C:0x2ECA22&T:Lv20|\n";
                        lv -= 20;
                        gem.source = "bs_" + attr[0].type + "10_png";
                    }
                    else if (attr.length == i) {
                        if (lv == 20) {
                            str += "|C:0x2ECA22&T:Lv20|\n";
                        } else {
                            str += "Lv" + lv + "\n";
                        }
                        gem.source = "bs_" + attr[0].type + lv + "_png";
                    }
                    else {
                        if (i < 5)
                            str += "|C:0x909090&T:";
                        str += attrName + GlobalConfig.jifengTiaoyueLg.st101489;
                        gem.source = "bs_00_png";
                    }
                }
                var lvTxt = new eui.Label;
                lvTxt.fontFamily = "Microsoft YaHei";
                lvTxt.size = 16;
                lvTxt.textColor = 0x535557;
                lvTxt.lineSpacing = 8;
                lvTxt.x = attrTxt.x + 26;
                lvTxt.y = attrTxt.y;
                lvTxt.textFlow = TextFlowMaker.generateTextFlow(str);
                this.forgeGroup.addChild(lvTxt);
                attrTxt.x = lvTxt.x + 38;
                attrTxt.height = lvTxt.height;
                attrs = AttributeData.getAttrStrAdd(attr, 15);
                break;
            case 2:
                titleAttrTxt.text = GlobalConfig.jifengTiaoyueLg.st101490;
                attrs = AttributeData.getAttrStrAdd(attr, 12);
                break;
            case 3:
                titleAttrTxt.text = GlobalConfig.jifengTiaoyueLg.st101491;
                break;
        }
        if (type != 3)
            attrTxt.text = AttributeData.getAttStr(attrs, 1);
        else
            attrTxt.text = GlobalConfig.jifengTiaoyueLg.st101492 + " +" + attr + "%";
        this._bottomY = attrTxt.y + attrTxt.height;
    };
}

ViewManager.ins().reg(EquipDetailedWin, LayerManager.UI_Popup);
window["EquipDetailedWin"] = EquipDetailedWin