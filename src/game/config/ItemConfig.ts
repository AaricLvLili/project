class ItemConfig {

    static FuwenEquipSlot = {
        Slot0: 0,
        Slot1: 1,
        Slot2: 2,
        Slot3: 3,
        Slot4: 4,
        Slot5: 5,
        Slot6: 6,
        Slot7: 7,
        Slot8: 8,
        Count: 9,
    }

    private static InitConfig() {
        ItemConfig.equipConfig = GlobalConfig.equipConfig
        ItemConfig.powerConfig = GlobalConfig.ins("AttrPowerConfig");
    }

    public static IsLegendItem(config): boolean {
        if (!config) {
            return false
        }
        if (config.type == ItemType.EQUIP && config.quality == 5) {
            return true
        }
        return false
    }

    // private static transfrom = [
    //     '',
    //     '',
    //     'hp',
    //     '',
    //     'atk',
    //     'def',
    //     'res',
    // ];
    public static calcItemLevel(item): number {
        return item.itemConfig.zsLevel && item.itemConfig.zsLevel * 1000 || item.itemConfig.level
    }

    public static calcAttrScore(attr: Array<AttributeData>): number {
        var power = 0;
        if (ItemConfig.powerConfig == null) {
            ItemConfig.InitConfig();
        }

        // attr.forEach(element => {
        //     if (this.powerConfig[element.type])
        //     {
        //          power += this.powerConfig[element.type].power * element.value
        //     }
        // });

        for (let data of attr) {
            if (this.powerConfig[data.type]) {
                power += this.powerConfig[data.type].power * data.value
            }
        }


        return power;
    }

    public static CalcAttrScoreValue(attr: Array<AttributeData>): number {
        return Math.floor(this.calcAttrScore(attr) * 0.01)
    }

    /** 计算普通装备的评分 */
    public static calculateBagItemScore(item: ItemData): number {
        var equipConfig = GlobalConfig.equipConfig[item.itemConfig.id];
        if (!equipConfig) {
            return 0
        }
        var powerConfig = GlobalConfig.ins("AttrPowerConfig");
        var allPower = ItemConfig.calcAttrScore(item.att)
        if (equipConfig.baseAttr)
            allPower += ItemConfig.calcAttrScore(equipConfig.baseAttr);
        for (let i in AttributeData.translate) {
            if (powerConfig[AttributeData.translate[i]]) {
                allPower += powerConfig[AttributeData.translate[i]].power * equipConfig[i]
            }
        }

        return Math.floor(allPower / 100);
    };

    public static CalculateItemScore(configID: number): number {
        if (ItemConfig.equipConfig == null)
            ItemConfig.InitConfig();

        var config = ItemConfig.equipConfig[configID];
        var totalAttr = [];
        for (var k in Role.translate) {
            if (config[k] <= 0)
                continue;

            var attrs = new AttributeData;
            attrs.type = Role.getAttrTypeByName(k);
            attrs.value = config[k];
            totalAttr.push(attrs);

        }
        return Math.floor(UserBag.getAttrPower(totalAttr));
    }


    private static TRANSFROM = [
        '',
        '',
        'hp',
        '',
        'atk',
        'def',
        'res',
    ];

    private static equipConfig
    private static powerConfig

    /** 计算橙装&神装装的评分 */
    public static pointCalNumber(item): number {
        var allPower = 0;

        if (ItemConfig.equipConfig == null)
            ItemConfig.InitConfig();

        let equipConfig = ItemConfig.equipConfig[item.id]
        for (var k in ItemConfig.powerConfig) {
            var value = equipConfig[this.TRANSFROM[ItemConfig.powerConfig[k].type]] || 0
            allPower += (value + Math.floor(value * 0.01)) * ItemConfig.powerConfig[k].power;
        }
        return Math.floor(allPower * 0.01);
    };
}
window["ItemConfig"] = ItemConfig