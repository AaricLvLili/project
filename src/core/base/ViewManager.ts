class ViewManager extends BaseClass {

    public static openCheckTip = false

    private _view: Dictionary<BaseEuiView> = new Dictionary<BaseEuiView>();
    private _hCode2Key: Dictionary<BaseEuiView> = new Dictionary<BaseEuiView>();
    private _openList: Dictionary<string> = new Dictionary<string>();
    private m_RegInfos: Dictionary<any> = new Dictionary<any>();
    recordLastPanel = []

    public constructor() {
        super();

        this._view.clear();
        this._hCode2Key.clear();
        this._openList.clear();

        this.m_RegInfos.clear();
    }

    public static ins(): ViewManager {
        return super.ins();
    }

	/**
     * 清空处理
     */
    public clear() {
        this.closeAll();
        this._view.clear();
    }

    /**
     * 面板注册
     * @param view 面板类
     * @param layer 层级
     */
    public reg(viewClass, layer: egret.DisplayObjectContainer) {
        if (viewClass == null) {
            return;
        }
        // 设置基本属性
        viewClass["LAYER_LEVEL"] = layer
        // 保持信息
        this.m_RegInfos.set(egret.getQualifiedClassName(viewClass), viewClass);
    }

    private GetRegInfo(key: string): any {
        let cls = this.m_RegInfos.get(key);
        if (cls == null) {
            cls = egret.getDefinitionByName(key)
            this.m_RegInfos.set(key, cls);
        }
        return cls
    }

    /**
     * 销毁一个面板
     * @param hCode
     */
    public destroy(hCode) {
        let view = this._hCode2Key.get(hCode);
        this.releaseView(view);
    }

    // 获取视图类
    public GetViewCls(nameOrClass): any {
        if (typeof (nameOrClass) == "function") {
            return nameOrClass
        }
        return this.GetRegInfo(this.getKey(nameOrClass));
    }

    public getKey(nameOrClass) {
        let key;
        if (typeof (nameOrClass) == "string") {
            key = nameOrClass;
        } else if (typeof (nameOrClass) == "function") {
            key = egret.getQualifiedClassName(nameOrClass);
        } else if (nameOrClass instanceof BaseEuiView) {
            key = egret.getQualifiedClassName(nameOrClass)
        } else {
            egret.log(`面板打开错误-----${nameOrClass}`);
        }
        return key;
    };
    /**
    * 检测能否开启
    * @param key 类名
    */
    public static viewOpenCheck(cls, param) {
        if (!cls) {
            return false
        }
        let func = cls["openCheck"]
        if (func) {
            return func(param)
        }
        return true
    }
    /**
    * 统一打开窗口函数
    * @param nameOrClass 类名,类字符串名,或者类对象
    * @param param 打开窗口传入的参数
    *  */
    public open(nameOrClass, ...param: any[]) {
        // let time = egret.getTimer();
        if (nameOrClass == null) return null;
        if (nameOrClass == ChargeFirstWin) {
            nameOrClass = Recharge.ins().getFirstRechargeState() ? Recharge1GetWin : ChargeFirstWin
        }
        if ((nameOrClass == Recharge1GetWin) && StartGetUserInfo.isUsa)//如果是美国的，强制转换成充值窗口
            nameOrClass = ChargeFirstWin;
        if ((nameOrClass == Recharge1GetWin || nameOrClass == ChargeFirstWin) && StartGetUserInfo.isOne) {//如果是单机，全部充值界面不打开
            return;
        }
        var key = this.GetViewCls(nameOrClass);
        var keys = this.getKey(nameOrClass);
        //检测能否开启
        if (!ViewManager.viewOpenCheck(key, param)) {
            return null;
        }
        var view = this.openEasy(key, param);
        if (view) {
            this.setPanelLayer(view)
        }
        // let latime = egret.getTimer() - time;
        // if (latime > 3) {
        //     console.log("打开界面方法结束：" + egret.getTimer() + "  时差：" + latime + "  name:" + keys);
        // }
        return view;
    }

    //简单的打开一个界面
    public openEasy(nameOrClass, param = null) {
        let time = egret.getTimer();
        if (nameOrClass == null) {
            console.log("open nameorclass is null")
            return;
        }
        var keys = this.getKey(nameOrClass);
        var cls = this.GetRegInfo(keys)
        let view = this._view.get(keys);
        if (!view) {
            view = new cls()
            this._view.set(keys, view);
            this._hCode2Key.set(view.hashCode, keys);
        }
        if (view == null) {
            Logger.trace("UI_" + cls + "不存在");
            return;
        }
        let layerLevel: egret.DisplayObjectContainer = cls["LAYER_LEVEL"]
        if (layerLevel == null) {
            layerLevel = view.GetLayerLevel()
            if (!layerLevel) {
                console.log("没有设置层级", keys)
            }
        }
        if (view.isShow() || view.isInit()) {
            view.addToParent(layerLevel);
            this._OpenView(view, param)
        }
        else {
            // EasyLoading.ins().showLoading();
            // view.loadResource(function () {
            //     view.addToParent(layerLevel);
            //     view.setVisible(false);
            // }.bind(this), function () {
            view.addToParent(layerLevel);
            view.initUI();
            view.initData();
            this._OpenView(view, param)
            view.setVisible(true);
            // EasyLoading.ins().hideLoading();
            // }.bind(this));
        }
        if (!this._openList.get(keys)) {
            this._openList.set(keys, keys);
        }
        return view;
    };

    private _OpenView(view: BaseEuiView, param: any): void {
        if (view) {
            view.DoOpen.apply(view, param);
        }

    }

    private _CloseVie(view: BaseEuiView, param: any): void {
        view.DoClose.apply(view, param);
    }

    setPanelLayer(view: BaseEuiView) {
        if (view) {
            if (view.parent == LayerManager.UI_Main) {
                this.closeEasy(UIView1_1)
                this.closeEasy(PlayFunView)
                this.closeEasy(GameSceneView)

                // 关闭在之上的层级
                for (var i = 0; i < this._openList.values.length; i++) {
                    let openView = this._view.get(this._openList.values[i]);
                    if (openView == null) {
                        continue
                    }
                    if (view == openView) {
                        break
                    }
                    if (Util.GetClass(openView).LAYER_LEVEL == LayerManager.UI_Main_2) {
                        this.closeEasy(openView)
                    }
                }
            }
            if (egret.is(view, "GuildWarInfoPanel")) {
                this.closeEasy(UIView1_1)
            }
        }
    }

    public hideUIView(nameOrClass, fag) {
        var keys = this.getKey(nameOrClass);
        var cls = this.GetRegInfo(keys)
        let view = this._view.get(keys);
        if (view) {
            view.visible = fag;
        }
        else {
            if ("UIView1_1" == keys && fag) {
                this.open(keys);
            }
        }
    }

    public hideAllPopView() {
        let names = this._openList.values;
        for (var i = 0; i < names.length; i++) {
            var keys = this.getKey(names[i]);
            var view = this.getView(keys);
            if (view && view.parent == LayerManager.UI_Popup) {
                this._openList.remove(keys);
                this._CloseVie(view, [])
                view.removeFromParent();
            }
        }
    }

    //----------------------------------------------------关闭-------------------------------------
    /**
     * 统一关闭窗口函数
     * @param nameOrClass 类名,类字符串名,或者类对象
     * @param param 关闭传入的参数
     **/
    public close(nameOrClass, ...param: any[]) {
        // let time = egret.getTimer();
        var key = this.getKey(nameOrClass);
        var view = this.closeEasy(key, param);
        if (view) {
            this.checkCloseView();
        } else {

        }
        // let latime = egret.getTimer() - time;
        // if (latime > 3) {
        //     console.log("关闭界面方法结束：" + egret.getTimer() + "  时差：" + latime + "  name:" + key);
        // }
    };
    //简单关闭一个窗口
    public closeEasy(nameOrClass, ...param: any[]) {
        let time = egret.getTimer();
        if (!this.isShow(nameOrClass)) {
            return null;
        }
        var key = this.getKey(nameOrClass);
        var view = this.getView(key);
        if (view) {
            this._openList.remove(key);
            this._CloseVie(view, param)
            view.removeFromParent();
        }
        return view;
    };
    public checkCloseView() {
        /**尼玛咯用类名来判断(起错名就进坑了注意) */
        // for (var len = this._opens.length, i = len - 1; i > 0; i--) {
        //     var obj = this._opens[i]
        //     var s = obj.indexOf("Win") >= 0;
        //     if (s) {
        //         this.setPanelLayer(this.getView(obj))
        //         return
        //     }
        // }
        let isHave = this.checkHaveMainUILayerUI()
        if (isHave) {
            return;
        }
        if (GameMap.IsPublicBoss() || GameMap.IsHomeBoss() || GameMap.IsSyBoss() || GameMap.IsZhuanshengBoss() || GameMap.IsGuildBoss()
            || GameMap.IsGuildWar() || GameMap.IsKfBoss() || GameMap.IsWorldBoss() || GameMap.IsXbBoss()
            || GameMap.IsHeroBattle() || GameMap.IsGuanQiaBoss() || GameMap.IsPersonalBoss() || GameMap.IsCityBoss() || GameMap.IsTeamFb()
            || GameMap.IsMaterialFb() || GameMap.IsChaosBttle()) {
            ViewManager.ins().close(UIView1_1);
        }
        else {
            ViewManager.ins().open(UIView1_1);
        }
        if (!this.isShow(GameSceneView)) {
            this.openEasy(GameSceneView)
        }
        this.openOneRecordPanel()
    }

    private checkHaveMainUILayerUI() {
        let openList = this._openList.values;
        for (var i = 0; i < openList.length; i++) {
            let vew = this._view.get(openList[i]);
            if (vew.parent == LayerManager.UI_Main) {
                return true;
            }
        }
        return false;

    }

    openOneRecordPanel() {
        var t = GameMap.fubenID;
        if (GameLogic.ins().showEseBtn(0 != t), 0 != t) {
            ViewManager.ins().close(PlayFunView);
        } else {
            if ((this.isShow(PlayFunView) || ViewManager.ins().open(PlayFunView)) && this.recordLastPanel.length > 0) {
                var i = this.recordLastPanel.shift()
                var s = this.recordLastPanel.shift()
                this.recordLastPanel.length = 0
                ViewManager.ins().open(i, s ? s : 0)
            }
        }
    }

    /**
     * 获取一个UI对象
     * 返回null代表未初始化
     * @param nameOrClass  类名,类字符串名,或者类对象
     * @returns BaseEuiView
     */
    public getView(nameOrClass): BaseEuiView {
        var keys = this.getKey(nameOrClass);
        return this._view.get(keys);
    };

    public releaseView(nameOrClass) {
        var keys = this.getKey(nameOrClass);
        let view = this._view.remove(keys);
        if (view) {
            DisplayUtils.dispose(view);
            view = null;
        }
    };

    /**
     * 关闭所有开启中的UI
     */
    public closeAll() {
        for (var i = 0; i < this._openList.values.length; i++) {
            this.closeEasy(this._openList.values[i], []);
        }
        this.checkCloseView();
    };

    /**
     * 当前ui打开数量
     * @returns {number}
     */
    public currOpenNum() {
        return this._openList.values.length;
    };
    /**
     * 检测一个UI是否开启中
     * @param nameOrClass 类名,类字符串名,或者类对象
     * @returns {boolean}
     */
    public isShow(nameOrClass): boolean {
        let keys = this.getKey(nameOrClass);
        let openKey = this._openList.get(keys);
        if (openKey) {
            return true;
        }
        return false;
    };

    closePartPanel(t: boolean = true) {
        let e = [];
        for (var i = 0; i < this._openList.values.length; i++) {
            let keyName = this._openList.values[i];
            if (keyName != this.getKey(UIView2) && keyName != this.getKey(UIView1)) {
                e.push(keyName);
            }
        }
        for (var i = e.length - 1; i >= 0; i--) {
            var s = e[i],
                n = this.getView(s);
            if (n.parent == LayerManager.UI_Popup || n.parent == LayerManager.UI_Main || n.parent == LayerManager.UI_Main_2) {
                this.closeEasy(s)
            }
        }
        if (t) {
            this.checkCloseView()
        }
    }


    private static GUIDE_LIST: { [key: number]: string };

    private static INVAILD_NAME = []

    // 矫正参数错误
    private static AdjustIndex(index: ViewIndexDef, param: any) {
        if (index == ViewIndexDef.BossWin) {
            if (param == 0) {
                param = 1
            } else if (param == 1) {
                param = 0
            }
        }
        return [index, param]
    }

    private static _CheckActivity(type: number): boolean {
        if (ActivityModel.ins().GetActivityDataByType(type) == null) {
            UserTips.ins().showTips("活动已经结束！！！")
            return false
        }
        return true
    }

    public static Guide(index: ViewIndexDef, param: any): boolean {
        ViewManager.ins().hideAllPopView();
        if (index == ViewIndexDef.ActivityWin && param == ActivityModel.TYPE_03) {
            if (!ViewManager._CheckActivity(ActivityModel.TYPE_03)) {
                return false
            }
        } else if (index == ViewIndexDef.ActivityWin && param == ActivityModel.TYPE_01) {
            if (!ViewManager._CheckActivity(ActivityModel.TYPE_01)) {
                return false
            }
        } else if (index == ViewIndexDef.DayLoginPanel) {
            if (!ViewManager._CheckActivity(ActivityModel.TYPE_05)) {
                return false
            }
        } else if (index == ViewIndexDef.EGG_BROKEN_PANEL) {
            if (!EggBroken.IsOpen()) {
                // UserTips.ins().showTips("活动已经结束！！！")
                return false
            } else {
                ViewManager.ins().open(ActivityWin, ActivityModel.CUS_ACT_3.type)
                return true
            }
        }
        if (this._GotoView(index)) {
            return true
        }
        [index, param] = this.AdjustIndex(index, param)
        if (this.INVAILD_NAME.indexOf(index) != -1) {
            console.error("ViewManager:Guide", index, "invaild")
            return false
        }
        if (!this.GUIDE_LIST) {
            this.GUIDE_LIST = {}
            for (let key in ViewIndexDef) {
                let value = ViewIndexDef[key]
                this.GUIDE_LIST[value] = key
            }
        }
        let name = this.GUIDE_LIST[index]
        if (!name) {
            console.error("ViewManager:Guide", index, "undefine")
            return false
        }
        return ViewManager.ins().open(name, param) != null
    }

    private static _GotoView(index: ViewIndexDef) {
        UserTask.ins().checkUIMissonComplet(index);
        switch (index) {
            case ViewIndexDef.Recharge1Win: FirstRechargeIconRule.EnterFirstRecharge(); break
            case ViewIndexDef.PUBLIC_BOSS: ViewManager.ins().open(BossWin, 1); break
            case ViewIndexDef.PERSONAL_BOSS: ViewManager.ins().open(BossWin, 0); break
            case ViewIndexDef.TREASURE_HUNT:
                if (ViewManager.ins().isShow(TreasureHuntWin)) {
                    ViewManager.ins().getView(TreasureHuntWin).SetTableIndex(0)
                } else {
                    ViewManager.ins().open(TreasureHuntWin);
                }
                break
            case ViewIndexDef.ACT_GIFT:
                ViewManager.ins().open(ActivityWin, ActivityModel.TYPE_02, null, 3);
                break
            case ViewIndexDef.DayLoginPanel:
                ViewManager.ins().open(FuliWin, 1, 9);
                break
            case ViewIndexDef.DAY_TOTAL_RECHARGE:
                // ViewManager.ins().open(FuliWin, 1, 8); 
                ViewManager.ins().open(ActivityWin, ActivityModel.CUS_ACT_1.type)
                break
            case ViewIndexDef.PK:
                ViewManager.ins().open(LadderWin);
                break
            case ViewIndexDef.LONG_ZHU: ViewManager.ins().open(LoongSoulWin, 0); break
            case ViewIndexDef.LONG_LING: ViewManager.ins().open(LoongSoulWin, 1); break
            case ViewIndexDef.LONG_WEN: ViewManager.ins().open(LoongSoulWin, 2); break
            case ViewIndexDef.LONG_HUN: ViewManager.ins().open(LoongSoulWin, 3); break
            case ViewIndexDef.MONEY_TREE:
                if (MoneyTreeModel.CheckOpen(true)) {
                    ViewManager.ins().open(FuliWin, 1, 2);
                }
                break
            case ViewIndexDef.FB_CHALLENGE_PANEL: ViewManager.ins().open(FbWin, 1); break;
            case ViewIndexDef.GUILD_FB_PANEL:
                if (GameLogic.ins().actorModel.HasGuild())
                    ViewManager.ins().open(GuildActivityWin, 1);
                else
                    UserTips.ins().showTips("没有公会");
                break;
            case ViewIndexDef.GEM_PANEL: ViewManager.ins().open(ForgeWin, 2); break;
            case ViewIndexDef.JING_MAI_PANEL: ViewManager.ins().open(ZsWin, 3); break;
            case ViewIndexDef.WING: ViewManager.ins().open(RoleWin, 2); break;
            case ViewIndexDef.BLESS_PANEL: ViewManager.ins().open(ForgeWin, 1); break;
            case ViewIndexDef.ENCOUNTER_ITEM_PANEL: ViewManager.ins().open(LadderWin); break;
            case ViewIndexDef.SKILL_BREAK_PANEL:
                if (Deblocking.Check(DeblockingType.TYPE_08))
                    ViewManager.ins().open(ZsWin, 2);
                break;
            case ViewIndexDef.SKILL_UP_PANEL: ViewManager.ins().open(ZsWin); break;
            case ViewIndexDef.SHOP_MEDAL: ViewManager.ins().open(ShopWin, 2); break;
            case ViewIndexDef.LEGEND_EQUIP_PANEL: ViewManager.ins().open(OrangeEquipWin, 1); break;
            case ViewIndexDef.ZS_PANEL: ViewManager.ins().open(RoleWin, 3); break;
            case ViewIndexDef.NewRoleWin: ViewManager.ins().open(NewRoleWin); break;
            case ViewIndexDef.GuanQiaRewardWin: ViewManager.ins().open(GuanQiaWin); break;
            case ViewIndexDef.PetWin: ViewManager.ins().open(PetWin); break;
            case ViewIndexDef.GadWin: ViewManager.ins().open(GadWin); break;
            case ViewIndexDef.GuanQiaMapWin: ViewManager.ins().open(GuanQiaMapWin); break;
            case ViewIndexDef.MountMainPanel: ViewManager.ins().open(RoleWin, 1); break;
            case ViewIndexDef.GuanQiaBossWin: ViewManager.ins().open(GuanQiaBossWin); break;
            case ViewIndexDef.SyBossPanel: ViewManager.ins().open(BossWin, 5); break;
            case ViewIndexDef.ForgeZhulingPanel: ViewManager.ins().open(ForgeWin, 3); break;
            case ViewIndexDef.ArtifactWin: ViewManager.ins().open(ArtifactMainWin); break;
            case ViewIndexDef.GuildMap: ViewManager.ins().open(GuildMap); break;
            case ViewIndexDef.GuildWin: ViewManager.ins().open(GuildWin); break;
            case ViewIndexDef.GuildSkillWin: ViewManager.ins().open(GuildSkillWin); break;
            case ViewIndexDef.GuildActivityWin: ViewManager.ins().open(GuildActivityWin); break;
            case ViewIndexDef.GuildWarMainBgWin: ViewManager.ins().open(GuildWarMainBgWin); break;
            case ViewIndexDef.GuildShopWin: ViewManager.ins().open(GuildShopWin); break;
            case ViewIndexDef.WingPanel: ViewManager.ins().open(RoleWin, 2); break;
            case ViewIndexDef.NeiGongPanel: ViewManager.ins().open(ZsWin, 3); break;
            case ViewIndexDef.ShenQiFBPanel: ViewManager.ins().open(ArtifactMainWin, 2); break;
            case ViewIndexDef.ShareMissionWin: ViewManager.ins().open(ShareMissionWin); break;
            case ViewIndexDef.ShareFirstWin: ViewManager.ins().open(ShareFirstWin); break;
            case ViewIndexDef.PetClimbPanel: ViewManager.ins().open(FbWin, 3); break;
            case ViewIndexDef.PetTreasurePanel: ViewManager.ins().open(PetTreasureWin); break;
            case ViewIndexDef.ZhuanZhiTaskWin: ViewManager.ins().open(ZhuanZhiTaskWin); break;
            case ViewIndexDef.OrangePanle: ViewManager.ins().open(OrangeEquipWin); break;
            case ViewIndexDef.MountClimbPanel: ViewManager.ins().open(FbWin, 4); break;
            case ViewIndexDef.drillPanel: ViewManager.ins().open(FbWin, 5); break;
            case ViewIndexDef.expWelPanel: ViewManager.ins().open(LiLianWin, 1); break;
            case ViewIndexDef.petSmeltSelectPanel: ViewManager.ins().open(PetDebrisWin, 1); break;
            case ViewIndexDef.guildActityPanel: ViewManager.ins().open(GuildActivityWin, 2); break;
            case ViewIndexDef.teamFbPanel: ViewManager.ins().open(FbWin, 2); break;
            case ViewIndexDef.chaosBattlePanel: ViewManager.ins().open(LadderWin, 3); break;
            case ViewIndexDef.LiLianWin: ViewManager.ins().open(LiLianWin); break;
            case ViewIndexDef.monthSingPanel: ViewManager.ins().open(FuliWin, 1); break;
            case ViewIndexDef.acrossLadderPanel: ViewManager.ins().open(LadderWin, 5); break;
            case ViewIndexDef.kfBoss: ViewManager.ins().open(BossWin, 4); break;
            case ViewIndexDef.dressMount: ViewManager.ins().open(DressWin, 0, 3); break;
            case ViewIndexDef.chat:
                let gameSceneView = ViewManager.ins().getView(GameSceneView);
                if (gameSceneView instanceof GameSceneView) {
                    gameSceneView.miniChat.viewChange();
                }
                break;
            case ViewIndexDef.couponTr:
                ViewManager.ins().open(CouponWin, 1)
                break;
            case ViewIndexDef.couponMain:
                ViewManager.ins().open(CouponWin)
                break;
            case ViewIndexDef.zsPanel:
                if (Deblocking.Check(DeblockingType.TYPE_90))
                    ViewManager.ins().open(RoleWin, 3)
                break;
            default:
                return false
        }
        return true
    }

    public createEff(eff: MovieClip, group: eui.Group, mcName: string, playNum = 1, type: ResAnimType = 1) {
        if (!eff) {
            eff = new MovieClip();
            eff.touchEnabled = false;
        }
        group.addChild(eff);
        eff.x = group.width / 2;
        eff.y = group.height / 2;
        eff.visible = true;
        eff.loadUrl(ResDataPath.GetPathBuyType(mcName, type), true, playNum, function () {
            eff.visible = false;
        });
        return eff;
    }

    public setLab(lab: eui.Label, value: number, max: number) {
        if (value < max) {
            lab.textFlow = <Array<egret.ITextElement>>[
                { text: value + "", style: { "textColor": Color.Red } },
                { text: "/" + max, style: { "textColor": Color.FontColor } }
            ]
        } else {
            lab.textFlow = <Array<egret.ITextElement>>[
                { text: value + "", style: { "textColor": Color.Green } },
                { text: "/" + max, style: { "textColor": Color.FontColor } }
            ]
        }
    }
}

enum ViewIndexDef {
    RoleWin = 0,    // 角色界面
    BagWin = 1,    // 背包界面
    EncounterWin = 2,   // PK
    SmeltEquipTotalWin = 3,    // 熔炼
    MailWin = 4,       //邮件
    GuanQiaRewardWin = 5,    // 挑战关卡
    BossWin = 6,
    FbWin = 7,
    ZsWin = 8,
    TaskWin = 9,
    ForgeWin = 10,
    ShopWin = 11,
    TreasureHuntWin = 12,//寻宝
    VipWin = 13,   // VIP
    Ranking = 14,
    WildBossJoinWin = 15,
    WildBossWin = 16,
    LiLianWin = 17,
    ActivityWin = 18,
    DayLoginPanel = 19,
    ArtifactWin = 20,//神器界面
    CustomServiceWin = 21,
    Recharge1GetWin = 22,
    Recharge2Win = 23,
    Recharge3Win = 24,
    NewRoleWin = 25,
    ChargeFirstWin = 26,
    ExpGoldWin = 27,
    MonthCardWin = 28,
    CDKeyWin = 29,
    FbAndLevelsRankWin = 30,
    ChatWin = 31,
    ZhuZaiEquipWin = 32,
    LadderWin = 33,
    fuliwin = 34,
    RandBoss = 35,
    VIP3WIn = 36,
    GuildWin = 37,//议事厅
    GuildApplyWin = 38,
    GuildMap = 39,//工会地图
    GuildSkillWin = 40,//练功房
    GuildAvtivityWin = 41,
    WingPanel = 42,
    TitleWin = 43,
    WarSpiritWin = 44,
    DressWin = 45,
    YbTurntableWin = 46,
    FriendsWin = 47,
    FriendsAppListWin = 48,
    BlackListWin = 49,
    FriendsAddWin = 50,
    yellowVipWin = 51,
    GuildWarMainWin = 52,
    BlessOrangeWin = 53,
    GainZsWin = 54,
    LunHuiWin = 55,
    GainWhirligigsWin = 56,
    TipsSkillDescPanel = 57,
    topLevelWinCount = 58,
    XinFaWin = 59,
    GuildActivityWin = 60,//工会大厅
    GuildWarMainBgWin = 61,//遗迹争霸
    WorldBossWin = 62,
    RingMainWin = 63,
    ChangeOfBodyWin = 64,
    ArtifactMainWin = 65,
    RoleAddAttrPointWin = 66,//加点

    Recharge1Win = 100,                     // 充值    
    PUBLIC_BOSS = 102,                    // 全民BOSS
    PERSONAL_BOSS = 101,                    // 个人BOSS
    TREASURE_HUNT = 104,                    // 寻宝
    ACT_GIFT = 105,                   // 开服特惠礼包
    DAY_TOTAL_RECHARGE = 106,          // 每日累计充值
    PK = 107,          // PK
    LONG_ZHU = 108,          // 龙珠
    LONG_LING = 109,          // 龙麟
    LONG_WEN = 116,          // 龙纹界面
    LONG_HUN = 115,          // 龙魂界面
    MONEY_TREE = 110,          // 摇钱树
    FB_CHALLENGE_PANEL = 111,          // 闯天关
    GUILD_FB_PANEL = 112,          // 公会副本
    GEM_PANEL = 113,          // 宝石界面
    JING_MAI_PANEL = 114,          // 元神界面
    WING = 117,          // 羽翼界面
    BLESS_PANEL = 118,          // 器灵
    ENCOUNTER_ITEM_PANEL = 119,          // 秘宝
    SKILL_BREAK_PANEL = 120,          // 技能突破
    SHOP_MEDAL = 121,          // 功勋商店
    LEGEND_EQUIP_PANEL = 122,          // 神装装备(原神装)
    ZS_PANEL = 123,          // 转生界面
    GUILD_BOSS_PANEL = 124,          // 工会BOSS
    EGG_BROKEN_PANEL = 125,          // 砸金蛋（活动结束）
    SKILL_UP_PANEL = 126,          // 技能界面

    Loading = 1e4,
    GameScene = 2e4,
    PlayFun = 20001,
    StartGame = 20002,
    CreateRole = 20003,
    SelectServer = 20004,
    GameUI1 = 20005,
    GameUI2 = 20006,
    ResultWin = 20007,
    PubResultWin = 20008,
    Tips = 20009,
    BoostPower = 20010,
    SmeltSelectWin = 20011,
    MailDetailedWin = 20012,
    ItemDetailedWin = 20013,
    WarnWin = 20014,
    TaskAwardswarnWin = 20015,
    PubBossRemindWin = 20016,
    WildBossRecordWin = 20017,
    PublicBossRank = 20018,
    EmptyWin1 = 20019,
    BreakDwonView = 20020,
    SpecialRingWin = 20021,
    BuyWin = 20022,
    BlackMarketPanel = 20023,
    ItemShopPanel = 20024,
    LoongSoulWin = 20025,
    Notice = 20026,
    RRoleWin = 20027,
    HuntResult = 20028,
    ShopGoodsWarn = 20029,
    BagAddItemWarn = 20030,
    BossBloodPanel = 20031,
    RoleAttrWin = 20032,
    ZaoyuRecordWin = 20033,
    FindEnemyWin = 20034,
    OfflineRewardWin = 20035,
    EffectivenessTip = 20036,
    WorldBossGold = 20037,
    UIView1_1 = 20038,
    EquipDetailedWin = 20039,
    WelcomeWin = 20040,
    FuncNoticeWin = 20041,
    ZsBossRank = 20042,
    ZsBossRewardShow = 20043,
    ZSBossLottery = 20044,
    ZSBossCD = 20045,
    ZSBossResult = 20046,
    ZhuzaiEquipDecom = 20047,
    WanBaGiftWin = 20048,
    ChatMainUI = 20049,
    ItemUseTips = 20050,
    ZsBossRuleSpeak = 20051,
    LadderChallenge = 20052,
    LadderResult = 20053,
    EmptyWin = 20054,
    MijiLearnWin = 20055,
    MijiZhWin = 20056,
    MijiTipWin = 20057,
    MoneyTreeBox = 20058,
    YqWin = 20059,
    KssjPanel = 20060,        // 提示升级界面
    GuildConWin = 20061,
    GuildNoticeWin = 20062,
    GuildCreateWin = 20063,
    GuildApplyListWin = 20064,
    WeiBoShareWin = 20065,
    BlessBackGood = 20066,
    RenameWin = 20067,
    GuildFBRewardInfoWin = 20068,
    MiJiTujianWin = 20069,
    ForgeTipsWin = 20070,
    GuildShopWin = 20071,//工会宝库
    GuildShopRecordWin = 20072,
    // BagFullTipsWin				= 20073,
    WarSpiritSkillTipWin = 20074,
    DevilSquareRewardWin = 20075,
    GuildWarRewardWin = 20076,
    RedBagWin = 20077,
    RedBagDetailsWin = 20078,
    GuildWarUiInfo = 20079,
    GuileWarReliveWin = 20080,
    GuildWarMemWin = 20081,
    GuildWarResultWin = 20082,
    SelectMemberRewardWin = 20083,
    SelectMemberPanelWin = 20084,
    GuildWarRulesWin = 20085,
    DailyAwardPanel = 20086,
    SelectRoleWin = 20087,
    GuildwarTipsPanel = 20088,
    MixResultWin = 20089,
    MineRefushWin = 20090,
    MineRobWin = 20091,
    MineReportInfoWin = 20092,
    MineRevengeWin = 20093,
    MineSettledWin = 20094,
    HeadUpImg = 20095,
    HeadSysImg = 20096,
    GuildRenameWin = 20097,
    TaskReachWin = 20098,
    AcChristmas = 20099,
    ChristmasResult = 20100,
    LunHuiEquipReset = 20101,
    LunHuiEquipTuPo = 20102,
    LunHuiEquipChooseWin = 20103,
    LunhuiEquipDetailWin = 20104,
    LunHuiAttrTipPanel = 20105,
    ActivityBuyWin = 20106,
    ChooseItemWin = 20107,
    GuildWarNewRule = 20108,

    PetWin = 30001,//宠物界面
    GadWin = 30002,//纹章界面
    GuanQiaMapWin = 30003,//世界地图
    GuanQiaBossWin = 30004,//守城boss
    MountMainPanel = 30005,//坐骑界面
    SyBossPanel = 30006,//圣域boss
    ForgeZhulingPanel = 30007,//注灵界面
    NeiGongPanel = 30008,//元神
    ShenQiFBPanel = 30009,//神器副本
    ShareMissionWin = 30010,//任务分享界面
    ShareFirstWin = 30011,//首次分享界面
    PetClimbPanel = 30012,/**宠物爬塔 */
    PetTreasurePanel = 30013,/**宠物探索 */
    ZhuanZhiTaskWin = 30014,/**转职任务 */
    OrangePanle = 30015,/**橙装 */
    MountClimbPanel = 30016,/**坐骑爬塔 */
    drillPanel = 30017,/**试炼之路 */
    expWelPanel = 30018,/**野外烧双 */

    petSmeltSelectPanel = 30019,/**宠物分解 */
    guildActityPanel = 30020,/**公会活动 */
    teamFbPanel = 30021,/**组队副本 */
    chaosBattlePanel = 30022,/**魔龙圣殿*/
    monthSingPanel = 30023,/**月签到 */
    acrossLadderPanel = 30024,/**跨服天梯 */
    kfBoss = 30025,/**跨服boss */
    dressMount = 30026,/**坐骑时装 */
    chat = 30027,//聊天
    couponTr = 30028,//点券寻宝
    couponMain = 30029,//点券
    zsPanel = 30030,//转生界面
}
window["ViewManager"] = ViewManager