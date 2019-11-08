class GameMap {
    public constructor() {
    }

    private static _fubenID: number;

    static grid: MapGrid;
    static aStar: AStar;
    static compFuncs = [];
    static mapZip: JSZip;

    static CELL_SIZE: number;
    static MAX_WIDTH: number;
    static MAX_HEIGHT: number;
    static COL: number;
    static ROW: number;

    static mapID: number;
    static mapX: number;
    static mapY: number;
    static fbType: number;
    static fbName: string;
    static fbDesc: string;

    /** 初始化 */
    public static init() {
        this.grid = this.grid || new MapGrid;
        this.aStar = this.aStar || new AStar;
        this.compFuncs = this.compFuncs || [];
        this.mapZip = this.mapZip || new JSZip(RES.getRes("map"));
        if (this.mapZip) {
            var temp = egret.setTimeout(() => {
                egret.clearTimeout(temp);
                var b = RES.destroyRes("map");
                console.log("地图释放" + b);
                ResMgr.ins().clearConfig();
            }, this, 5000)

        }
    };
    /** 更新数据 */
    public static update() {
        var mapName = GameMap.getFileName();
        if (this.mapZip == null) {
            this.mapZip = new JSZip(RES.getRes("map"));
            RES.destroyRes("map");
        }
        var mapfile = this.mapZip.file(ResDataPath.GetMapData(mapName));
        if (mapfile) {
            this.parserBytes(mapfile.asArrayBuffer());
        }
        else {
            egret.log("地图资源读取异常:" + mapName);
        }
    };
    /** 解析流 */
    public static parserBytes(data) {
        var plain = new Uint8Array(data);
        var inflate = new Zlib.Inflate(plain);
        var deplain = inflate.decompress();
        var b = new egret.ByteArray(deplain.buffer);
        b.readUTF(); //flagHead
        let v = b.readInt(); //ver
        this.CELL_SIZE = b.readByte(); //gridSize
        this.MAX_WIDTH = b.readInt(); //sizeWidth
        this.MAX_HEIGHT = b.readInt(); //sizeHeight
        this.ROW = b.readInt(); //col
        this.COL = b.readInt(); //row

        this.grid.initGrid(this.ROW, this.COL, b, v == 2);
        this.aStar.initFromMap(this.grid);
        GameLogic.ins().enterMap();
        var func;
        for (var i = 0; i < this.compFuncs.length; i++) {
            func = this.compFuncs[i];
            func.func.call(func.obj);
        }
        this.compFuncs.length = 0;
    };
    /**
     * 移动实体
     * @param entity
     * @param endX
     * @param endY
     */
    public static moveEntity(entity: CharMonster, endX: number, endY: number, isStraightLine: boolean = false) {
        var size = GameMap.CELL_SIZE;
        var sx = Math.floor(entity.x / size);
        var sy = Math.floor(entity.y / size);
        var tx = Math.floor(endX / size);
        var ty = Math.floor(endY / size);

        var path: AStarNode[];
        if (isStraightLine || sx == endX && sy == endY)
            path = [new AStarNode(tx, ty, DirUtil.get8DirBy2Point({ x: entity.x, y: entity.y }, {
                x: endX,
                y: endY
            }))];
        else
            path = this.aStar.getPatch(sx, sy, tx, ty);
        GameLogic.ins().postMoveEntity(entity, path);
    };
    /**
     * 全体人员去到某个点
     * @param tx
     * @param ty
     * @param fun
     */
    public static myMoveTo(tx, ty, fun, funThis) {
        var len = SubRoles.ins().subRolesLen;
        var char;
        for (var i = 0; i < len; i++) {
            char = EntityManager.ins().getMainRole(i);
            this.moveEntity(char, tx, ty);
        }
        var tempFunc = function () {
            var isCom = true;
            for (var i = 0; i < len; i++) {
                char = EntityManager.ins().getMainRole(i);
                if (char.action == EntityAction.RUN) {
                    if (MathUtils.getDistance(char.x, char.y, tx, ty) < 100) {
                        char.stopMove();
                        char.playAction(EntityAction.STAND);
                    }
                    isCom = false;
                }
            }
            if (isCom) {
                TimerManager.ins().remove(tempFunc, this);
                fun.call(funThis);
            }
        };
        TimerManager.ins().doTimer(500, 0, tempFunc, this);
    };
    /** 检查是否不可移动 */
    public static checkWalkable(x, y) {
        var rtn = false;
        var node = GameMap.grid.getNode(x, y);
        if (node) {
            rtn = node.walkable;
        } else {
            // egret.log("checkWalkable 不存在的地图坐标 x:" + x + ",y:" + y);
            // console.log("checkWalkable 不存在的地图坐标 x:" + x + ",y:" + y);

        }
        return rtn;
    };
    /** 检查是否需要透明 */
    public static checkAlpha(x, y) {
        var rtn = false;
        var node = GameMap.grid.getNode(x, y);
        if (node) {
            rtn = node.hidden;
        } else {
            // egret.log("checkAlpha 不存在的地图坐标 x:" + x + ",y:" + y);
        }
        return rtn;
    }

    /** 地图数据初始化完毕后调用 */
    public static addCompFunc(func, funcObj) {
        this.compFuncs.push({ func: func, obj: funcObj });
    }

    public static parser(rsp: Sproto.enter_map_request) {
        if (rsp == null) return;
        this.fubenID = rsp.fubenID
        this.mapID = rsp.mapID
        this.mapX = Const.PosToPixel(rsp.mapX)
        this.mapY = Const.PosToPixel(rsp.mapY)
        this.fbType = rsp.fbType;
        this.fbName = rsp.fbName;
        this.fbDesc = rsp.fbDesc;

        GameGlobal.MessageCenter.dispatch(MessageDef.FUBEN_CHANGE)
        RaidMgr.ins().DoFbChange()
        let isPlay = SoundSetPanel.getSoundLocalData("soundBg");
        if (isPlay) {
            if (this.IsNoramlLevel())
                // SoundManager.ins().playBg(GlobalConfig.soundConfig[1].soundResource + "_mp3");
                SoundUtils.getInstance().playSound(GlobalConfig.soundConfig[1].id, -1);
            else
                // SoundManager.ins().playBg(GlobalConfig.soundConfig[2].soundResource + "_mp3");
                SoundUtils.getInstance().playSound(GlobalConfig.soundConfig[2].id, -1);
        }


        if (!this.IsNoramlLevel() && !this.IsGuanQiaBoss()) {
            if (ViewManager.ins().isShow(GuildMap)) {
                ViewManager.ins().close(GuildMap)
            }
            if (ViewManager.ins().isShow(GuildActivityWin)) {
                ViewManager.ins().close(GuildActivityWin)
            }
            if (this.fbType == UserFb.FB_TYPE_GUILD_ROBBER || this.fbType == UserFb.FB_TYPE_GUILD_FB) {
                if (ViewManager.ins().isShow(LadderWin)) {
                    ViewManager.ins().close(LadderWin)
                    console.log("auto close ladder window!!!")
                }
                if (ViewManager.ins().isShow(BossWin)) {
                    ViewManager.ins().close(BossWin)
                    console.log("auto close boss window!!!")
                }
                if (ViewManager.ins().isShow(LadderWin)) {
                    ViewManager.ins().close(LadderWin)
                    console.log("auto close LadderWin window!!!")
                }
                if (ViewManager.ins().isShow(FbWin)) {
                    ViewManager.ins().close(FbWin)
                    console.log("auto close fbwin window!!!")
                }
            }
        }
        if (this.IsGuildWar()) {
            this.CloseView(GuildMap)
            this.CloseView(GuildWarMainBgWin)
        }
    }

    private static CloseView(clsType): boolean {
        if (ViewManager.ins().isShow(clsType)) {
            ViewManager.ins().close(clsType)
            return true
        }
        return false
    }

    public static get fubenID() {
        return this._fubenID;
    }

    public static set fubenID(value) {
        this._fubenID = value;
        if (value > 0) {
            GameLogic.ins().postHookStateChange(GameLogic.HOOK_STATE_HOOK);
        }
        if (value != 0) {
            OtherAIModel.getInstance.releaseAll();
        }
    }

    public static IsNoramlLevel(): boolean {
        return this._fubenID == 0
    }

    public static IsGuanQiaBoss(): boolean {
        return GameMap.fbType == UserFb.FB_TYPE_GUANQIABOSS
    }

    public static IsZhuanshengBoss(): boolean {
        // return this._fubenID == UserFb.FB_TYPE_ZHUANSHENGBOSS;
        return GameMap.fbType == UserFb.FB_TYPE_ZHUANSHENGBOSS;
    }
    /**个人boss */
    public static IsPersonalBoss(): boolean {
        return this.fbType == UserFb.FB_TYPE_PERSONAL_BOSS;
    }
    /**守城boss */
    public static IsCityBoss(): boolean {
        return this.fbType == UserFb.FB_TYPE_CITYBOSS;
    }

    public static IsPublicBoss(): boolean {
        return this.fbType == UserFb.FB_TYPE_PUBLIC_BOSS
    }

    public static IsGuildBoss(): boolean {
        return this.fbType == UserFb.FB_TYPE_GUILD_BOSS;
    }

    public static IsGuildCopy(): boolean {
        return this.fbType == UserFb.FB_TYPE_GUILD_FB;
    }

    public static getFileName() {

        let obj = GlobalConfig.ins("ScenesConfig")[this.mapID];
        if (obj == null) {
            console.log("地图数据异常：" + this.mapID);
            return "新手村";
        }
        return obj.mapfilename;
    };

    public static IsGuildRobber() {
        return this.fbType == UserFb.FB_TYPE_GUILD_ROBBER
    }

    /** 公会战*/
    public static IsGuildWar(): boolean {
        return this.fbType == UserFb.FB_TYPE_GUILD_WAR
    }

    /** 跨服BOSS*/
    public static IsKfBoss(): boolean {
        return this.fbType == UserFb.FB_TYPE_KFBOSS
    }

    /** 世界BOSS*/
    public static IsWorldBoss(): boolean {
        return GameMap.fbType == UserFb.FB_TYPE_WORLDBOSS;
    }

    /** 寻宝BOSS*/
    public static IsXbBoss(): boolean {
        return GameMap.fbType == UserFb.FB_TYPE_XBBOSS;
    }

    // /** 挂机*/
    // public static isOnHook(): boolean {
    //     return GameMap.fbType == UserFb.FB_GOLD_ON_HOOK;
    // }

    public static IsHomeBoss(): boolean {
        return GameMap.fbType == UserFb.FB_TYPE_HOME_BOSS;
    }
    /**十连杀 */
    public static IsTenKill(): boolean {
        return GameMap.fbType == UserFb.FB_TYPE_TENKILL;
    }
    /**秘境 */
    public static IsMiJing(): boolean {
        return GameMap.fbType == UserFb.FB_TYPE_MIJING;
    }
    /**圣域boss */
    public static IsSyBoss(): boolean {
        return GameMap.fbType == UserFb.FB_TYPE_SYBOSS;
    }
    /**勇者试炼 */
    public static IsHeroBattle(): boolean {
        return GameMap.fbType == UserFb.FB_TYPE_HEROBATTLE
    }
    /**是否闯天关 */
    public static IsTiaoZhan(): boolean {
        return GameMap.fbType == UserFb.FB_TYPE_TIAOZHAN;
    }
    /**是否组队副本 */
    public static IsTeamFb(): boolean {
        return GameMap.fbType == UserFb.FB_TYPE_TEAM;
    }
    /**是否材料副本 */
    public static IsMaterialFb() {
        return GameMap.fbType == UserFb.FB_TYPE_MATERIAL;
    }
    /**是否魔龙圣殿 */
    public static IsChaosBttle(): boolean {
        return GameMap.fbType == UserFb.FB_TYPE_CHAOSBATTLE;
    }

}
window["GameMap"] = GameMap