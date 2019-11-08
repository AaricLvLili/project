class ItemData {
    handle: number = 0;
    private _configID: number;
    count: number;
    att: Array<AttributeData> = [];
    itemConfig: any;
    private canbeUsed: boolean;
    invalidtime: number;

    // 是否是新增加的物品（暂时符文物品使用）
    public mIsNewItem: boolean = false
    /**权重用来排序 */
    public weight: number = 0;
    public parser(data: Sproto.item_data) {
        if (data == null) {
            return
        }
        this.handle = data.handle
        this.configID = data.configID
        this.count = data.count
        for (let dataAtt of data.att) {
            var att = new AttributeData();
            att.parser(dataAtt);

            this.att.push(att);
        }
        this.invalidtime = data.invalidtime || 0;
    }

    public get configID() {
        return this._configID;
    }

    public set configID(value) {
        if (GlobalConfig.itemConfig == null) {
            // Main.errorBack("物品配置表读取错误  handle:"+this.handle + "  id(value)="+value);
            return;
        }
        this.itemConfig = GlobalConfig.itemConfig[value];
        this._configID = value;
        this.setCanbeUsed();
    }
    /** TODO hepeiye
     * 通过string数组获取多行字符串
     * @param str[]   属性string数组
     * @param newline  属性与属性上下间隔几行(默认1行)
     */
    public static getStringByList(str, newline = 1, addStr = ": "): string {
        var ret = "";
        for (var i = 0; i < str.length; i++) {
            ret += str[i] + addStr;
            if (i < str.length - 1) {
                for (var j = 0; j < newline; j++)
                    ret += "\n";
            }
        }
        return ret;
    };
    public static getStringByNextList(now, next) {
        var ret = "";
        for (var i = 0; i < now.length; i++) {
            ret += now[i];
            if (next[i]) {
                ret += next[i];
            }
            if (i < now.length - 1) {
                ret += "\n";
            }
        }
        return ret;
    };
    public get point(): number {
        if (!this.itemConfig) {
            return 0
        }
        return ItemConfig.calculateBagItemScore(this);
    }
    /**
     * 设置道具可使用的红点提示
     */
    public setCanbeUsed() {
        if (!this.itemConfig)
            return;
        if (this.itemConfig.useType == 1 || this.itemConfig.useType == 2 || this.itemConfig.useType == 3) {
            if (UserZs.ins().lv < this.itemConfig.zsLevel || GameLogic.ins().actorModel.level < this.itemConfig.level) {
                this.canbeUsed = false;
            }
            else {
                //屏蔽召唤令的红点提示
                if (this.itemConfig.id == 230001 || this.itemConfig.id == 230002 || this.itemConfig.id == 230003) {
                    this.canbeUsed = false;
                }
                else {
                    this.canbeUsed = true;
                }
            }
        }
        else {
            this.canbeUsed = false;
        }
    };
    public getCanbeUsed() {
        if (this.canbeUsed) {
            return ItemData.IsNotTimeLimitUse(this.itemConfig)
        }
        return false
    };

    public static IsNotTimeLimitUse(config) {
        if (config.useType == ItemUseType.TYPE01 && config.useArg != null && config.useArg.timelimit != null) {
            try {
                let date = new Date(config.useArg.timelimit)
                if (date.getTime() * 0.001 >= GameServer.serverTime) {
                    return false
                }
            } catch (e) {
            }
        }
        return true
    }

    public getCanbeHc() {
        if (this.configID && this.count) {
            var config = GlobalConfig.itemConfig[this.configID];
            if (config.synthesis) {
                return Math.floor(this.count / config.hcnumber) > 0;
            }
        }
        return false
    }
}
window["ItemData"] = ItemData