class ItemBase extends eui.ItemRenderer {

    nameTxt: eui.Label;
    num: number;
    itemConfig: any;
    protected redPoint: eui.Image;
    count: eui.Label;
    EquipEffect: MovieClip;
    itemIcon: ItemIcon;

    public mCallback: Function
    private jingyanyuCommonConfig: any;
    public isDataShowName: boolean = true;
    public isCheckEff: boolean = false;
    public constructor() {
        super()
        this.skinName = 'ItemSkin';
        this.touchEnabled = false
        this.touchChildren = true
        this.init();
    }
    public destroy(): void {
        this.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onClick, this);
        if (this.EquipEffect) {
            DisplayUtils.dispose(this.EquipEffect);
            this.EquipEffect = null;
        }
    }

    /**触摸事件 */
    public init() {
        this.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onClick, this);
    }

    public setItemImg(itemName: string): void {
        this.itemIcon.setItemImg(itemName)
    }

    public setItemBg(value: string): void {
        this.itemIcon.setItemBg(value)
    }

    public setDataByConfig(config) {
        if (config == null) return;
        this.itemIcon.setData(config);
        if (config.type == ItemType.EQUIP || config.type == ItemType.FUWEN) {
            var nameStr = config.zsLevel > 0 ? LanguageString.jifengTiaoyueCh(GlobalConfig.jifengTiaoyueLg.st101367, [config.zsLevel]) : LanguageString.jifengTiaoyueCh(GlobalConfig.jifengTiaoyueLg.st101368, [config.level]);
            //天珠特殊处理名字
            // if (config.subType == 6) {
            //     nameStr = config.name;
            // }
            if (ItemConfig.IsLegendItem(config)) {
                nameStr = LanguageString.jifengTiaoyueCh(GlobalConfig.jifengTiaoyueLg.st101439, [LegendModel.GetStage(config.id)])
            }
            this.nameTxt.text = nameStr;
        }
        else {
            this.nameTxt.text = config.name;
        }
        // if (config.type != 0) {
        //     this.nameTxt.textColor = ItemBase.QUALITY_COLOR[config.quality];
        // }
        if (this.num != undefined) {
            this.setCount(this.num + "");
        }
    };
    public dataChanged() {
        this.clear();
        if (this.data.isShowName && this.data.isShowName == 2) {
            this.isShowName(false);
        } else {
            this.isShowName(true);
        }
        if (!isNaN(this.data)) {
            this.itemConfig = GlobalConfig.itemConfig[this.data];
            if (this.itemConfig) {
                this.setDataByConfig(this.itemConfig);
            }
            else {
                this.itemIcon.setItemImg(MoneyManger.MoneyConstToSource(this.data))
                this.nameTxt.text = MoneyManger.MoneyConstToName(this.data);
                this.setCount("");
            }
        }
        else if (this.data instanceof ItemData) {
            //道具数据
            this.itemConfig = this.data.itemConfig;
            if (!this.itemConfig)
                return;
            this.setDataByConfig(this.itemConfig);
            this.data.count > 1 ? this.setCount(this.data.count + "") : this.setCount("");
        }
        else {
            //奖励数据
            if (this.data.type == 0) {
                this.itemIcon.setItemBg(ResDataPath.GetItemQualityName(MoneyManger.MoneyConstToQuality(this.data.id)));
                this.itemIcon.setItemImg(MoneyManger.MoneyConstToSource(this.data.id))
                this.nameTxt.text = MoneyManger.MoneyConstToName(this.data.id);
                var count = this.data.count;
                (count != undefined && count > 1) ? this.setCount(count + "") : this.setCount("");
            }
            else if (this.data.type == 1) {
                //道具奖励
                this.itemConfig = GlobalConfig.itemConfig[this.data.id];
                if (!this.itemConfig)
                    return;
                this.setDataByConfig(this.itemConfig);
                var count = this.data.count;
                count > 1 ? this.setCount(count + "") : this.setCount("");
            }
        }
        if (this.isCheckEff) {
            this.showItemEffect();
        }
        //设置红点
        this._UpdateRedPoint()
    };

    protected _UpdateRedPoint() {
        //设置红点
        if (this.data)
            this.redPoint.visible = this.data.canbeUsed;
    }

    public IsShowRedPoint(isShow: boolean): void {
        this.redPoint.visible = isShow
    }

    /**
     * 清除格子数据
     */
    public clear() {
        this.itemConfig = null;
        if (this.itemIcon.setData != null) {
            this.itemIcon.setData(null);
        } else {
            console.log("itemicon setdata data error")
        }
        this.count.text = "";
        this.nameTxt.text = "";
        // this.nameTxt.textColor = 0xbf7d00;
        // this.nameTxt.textColor = 0x3b3b3b;
    }

    public destruct() {
        this.mCallback = null
        this.removeEventListener(egret.TouchEvent.TOUCH_END, this.onClick, this);
    }

    public isShowJob(visible) {
        this.itemIcon.isShowJob(visible)
    }

    public onClick() {
        if (this.mCallback) {
            this.mCallback(this)
            return
        }
        this.showDetail();
    }

    public showDetail() {
        if (this.itemConfig != undefined && this.itemConfig && this.itemConfig.type != undefined) {
            if (this.jingyanyuCommonConfig == null)
                this.jingyanyuCommonConfig = GlobalConfig.ins("JingyanyuCommonConfig");
            if (this.itemConfig.id == this.jingyanyuCommonConfig.fullItemID) {
                ViewManager.ins().open(ExpjadePanel)
            } else if (this.itemConfig.type == ItemType.EQUIP || this.itemConfig.type == ItemType.ZHUANZHI || this.itemConfig.type == ItemType.WING || this.itemConfig.type == ItemType.FUWEN || this.itemConfig.type == ItemType.RINGSOUL || this.itemConfig.type == ItemType.MOUNTEQUIP) {
                this.openEquipsTips();
            } else if (this.itemConfig.type == ItemType.GAD) {
                let itemData = this.data;
                let gadData = GadModel.getInstance.gadBagDic.get(itemData.handle);
                if (gadData == null) {
                    for (let item of GadModel.getInstance.gadBagDic.values) {
                        if (item.configID == itemData.id) {
                            gadData = item
                            break;
                        }
                    }
                }
                if (gadData == null) {
                    ViewManager.ins().open(ItemDetailedWin, 0, this.itemConfig.id);
                } else
                    ViewManager.ins().open(GadStateWin, gadData);
            }
            else {
                ViewManager.ins().open(ItemDetailedWin, 0, this.itemConfig.id);
            }
        } else {
            if (isNaN(this.data)) {
                if (this.data && this.data.id) {
                    ViewManager.ins().open(ItemDetailedWin, 0, null, null, this.data.id);
                }
            } else if (this.data && this.data < 100) {
                ViewManager.ins().open(ItemDetailedWin, 0, null, null, this.data);
            }

        }
    }

    public setCount(str) {
        if (str.length > 4) {
            var wNum = Math.floor(Number(str) / 1000);
            str = wNum / 10 + GlobalConfig.jifengTiaoyueLg.st100066;
        }
        this.count.text = str;
    };
    public openEquipsTips() {
        ViewManager.ins().open(EquipDetailedWin, 1, this.data.handle, this.itemConfig.id, this.data);
    };
    public isShowName(b) {
        if (this.nameTxt)
            this.nameTxt.visible = b;
    };
    public getItemSoure() {
        var str = "";
        if (this.data.type == 0) {
            switch (this.data.id) {
                case MoneyConst.exp:
                    str = "";
                    break;
                case MoneyConst.gold:
                    str = "icgoods117_png";
                    break;
                case MoneyConst.yuanbao:
                    str = "icgoods121_png";
            }
        }
        else {
            str = "" + this.data.id;
        }
        return str;
    };
    public getText() {
        return this.nameTxt.text;
    };
    public getItemName() {
        return this.itemConfig.name;
    }
    public showEquipEffect() {
        if (!this.itemConfig || this.itemConfig.quality <= 3 || this.itemConfig.type != 0) {
            this.clearEffect();
            return;
        }
        this.showEffect(this.itemConfig.quality)
    };

    public showEffect(e): void {
        this.EquipEffect || (this.EquipEffect = new MovieClip())
        this.EquipEffect.touchEnabled = false
        if (e >= 4) {
            this.EquipEffect.loadUrl(ResDataPath.GetUIEffePath("quaeff" + e), true)
            this.EquipEffect.x = e == 4 ? 35 : 36
            this.EquipEffect.y = 31//42
        } else {
            // this.EquipEffect.loadFile(RES_DIR_EFF + "quality_0" + e, !0)//修改lxh 内存回收
            this.EquipEffect.loadUrl(ResDataPath.GetUIEffePath("quality_0" + e), true)
            this.EquipEffect.x = 35//53
            this.EquipEffect.y = 29//42; 
        }
        this.addChild(this.EquipEffect)
    }

    public clearEffect() {
        if (this.EquipEffect) {
            // DisplayUtils.removeFromParent(this.EquipEffect)
            // ObjectPool.push(this.EquipEffect);
            DisplayUtils.dispose(this.EquipEffect);
            this.EquipEffect = null;
        }
    }

    public getTextColor(): number {
        return this.nameTxt.textColor
    }

    //|| this.itemConfig.quality <= 3
    showItemEffect() {
        if (!this.itemConfig || this.itemConfig.quality <= 3) {
            this.clearEffect();
        }
        else {
            this.showEffect(this.itemConfig.quality)
        }
    }

    /**#设置主宰装备特效*/
    showZhuZaiItemEffect(temp) {
        if (temp.growlevel > 0 && temp.quality > 3) {
            this.showEffect(temp.quality)
        }
        else {
            this.clearEffect();
        }
    }

    showLegendEffe() {
        if (this.itemConfig && this.itemConfig.quality >= 4) {
            this.showEffect(this.itemConfig.quality)
        } else {
            this.clearEffect();
        }
    }

    public setRight() {
        this.count.horizontalCenter = undefined;
        this.count.right = 8;
    }
    public static QUALITY_COLOR = [
        Color.Black, // 0xf7f0f0, 
        Color.Green,
        Color.Blue,
        Color.Purple,
        Color.Orange,
        Color.Red,
    ];

    public static QUALITY_TIPS_COLOR = [
        Color.Black, // 0xf7f0f0, 
        Color.GreenTips,
        Color.BlueTips,
        Color.PurpleTips,
        Color.OrangeTips,
        Color.RedTips,
    ];



    public static QUALITY_COLOR_STR = [
        "0x3b3b3b", // 0xcecdcc
        "0x51fa07",
        "0x31ceff",
        "0xd36cef",
        "0xffa700",
        "0xff0c00"
    ];

}
window["ItemBase"] = ItemBase