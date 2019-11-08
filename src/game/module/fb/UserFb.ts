class UserFb extends BaseSystem {

    /** 日常副本数据 FbModel Dictionary */
    fbModel: { [key: number]: FbModel } = {};
    /**关卡数据 */
    /** 关卡id */
    private _guanqiaID = -1;
    /** 当前波的掉落物 */
    rewards: Sproto.wave_drop_data[] = [];
    maxLen = 0;
    //----------关卡数据
    waveCD = 0;
    /** 章节关卡奖励领取状态 */
    guanqiaReward: number[] = [];
    bossCallNum: number;
    private m_Wave: number;
    bossIsChallenged: boolean;

    private monsterCount: number = 0
    public monsterID: number = 0
    private needWave: number = 0
    bossID: number = 0
    private desc: string = ""
    private refMonsterPos: Sproto.position[] = []
    public bossReward: Sproto.reward_data[] = []
    public refEncounterPos: Sproto.position[] = []
    private dailyFubenConfig: any;

    public isNoWait: boolean = false;
    public get Desc(): string {
        return this.desc
    }

    public constructor() {
        super();
        this.sysId = PackageID.Guanqia;
        this.regNetMsg(S2cProtocol.sc_raid_role_all_die, this.doRoleAllDie);
        this.regNetMsg(S2cProtocol.sc_raid_info_init, this.doFbInfoInit);
        this.regNetMsg(S2cProtocol.sc_raid_update_info, this.doUpDataInfo);
        this.regNetMsg(S2cProtocol.sc_raid_time, this.doFbTime);
        this.regNetMsg(S2cProtocol.sc_raid_boss_box_num, this.doBossBoxNum);
        //关卡相关
        this.regNetMsg(S2cProtocol.sc_raid_chapter_init_info, this.doGuanqiaInfo);
        this.regNetMsg(S2cProtocol.sc_raid_chapter_wave_data, this.doWaveData);
        this.regNetMsg(S2cProtocol.sc_raid_chapter_boss_result, this.doBossResult);
        this.regNetMsg(S2cProtocol.sc_raid_chapter_reward, this.doGuanqiaReward);
        this.regNetMsg(S2cProtocol.sc_raid_chapter_offline_reward, this.doOfflineReward);
        this.regNetMsg(S2cProtocol.sc_raid_guardian_res, this.getQuanQiaBossInit);
    }

    static ins(): UserFb {
        return super.ins();
    }

    /**根据id获取副本配置 */
    public getFbDataById(id: number): FbModel {
        return this.fbModel[id];
    }

    public hasCount() {
        let fbModels = this.fbModel
        for (let fbID in fbModels) {
            let fb = fbModels[fbID];
            if (this.dailyFubenConfig == null)
                this.dailyFubenConfig = GlobalConfig.dailyFubenConfig;
            if (fb) {
                if (this.dailyFubenConfig[fb.fbID].bossId)
                    continue;
                var count = this.fbModel[fb.fbID].getCount();
                if (count > 0) {
                    return true;
                }
            }
        }
        return false;
    }

    public getCount() {
        var count = 0;
        let fbModels = this.fbModel;
        if (this.dailyFubenConfig == null)
            this.dailyFubenConfig = GlobalConfig.dailyFubenConfig;
        for (let fbID in fbModels) {
            let fb = fbModels[fbID]
            if (fb && !this.dailyFubenConfig[fb.fbID].bossId) {
                count += fb.getCount()
            }
        }
        return count;
    }

    /////////////////////////////////////////////////////  发送协议  ////////////////////////////////////////////////
    /** 副本数量更新 */
    // public postFbCountChange() {
    // }

    ///////////////////////////////////////////////////// 处理协议  /////////////////////////////////////////////
    /**
     * 处理角色死亡
     * 1-4
     * @param bytes
     */
    public doRoleAllDie(rsp: Sproto.sc_raid_role_all_die_request) {
        // console.warn("-------------    public doRoleAllDie(bytes) {")
        ViewManager.ins().open(ResultWin, 0);
    }

    /**
     * 初始化副本信息
     * 1-10
     * @param bytes
     */
    public doFbInfoInit(rsp: Sproto.sc_raid_info_init_request) {
        for (var i = 0; i < rsp.raidModel.length; i++) {
            let fbModel = new FbModel();
            fbModel.parser(rsp.raidModel[i]);

            // _Trace("UserFb:DoFbInfoInit--------------------------------------------------", fbModel)
            this.fbModel[fbModel.fbID] = fbModel;
        }
        MessageCenter.ins().dispatch(MessageDef.FB_COUNT_UPDATE);
    }

    /**
     * 发送请求召唤boss
     */
    public sendCallBossPlay(id: number): void {
        let req = new Sproto.cs_raid_call_boss_play_request()
        req.id = id
        this.Rpc(C2sProtocol.cs_raid_call_boss_play, req)
    }

    /**
     * 请求挑战副本
     * 1-10
     * @param fbID  副本ID
     */
    public sendChallenge(fbID: number): void {
        let req = new Sproto.cs_raid_challenget_request()
        req.fbID = fbID
        this.Rpc(C2sProtocol.cs_raid_challenget, req)
    }

    /**
     * 更新副本信息
     * 1-11
     * @param bytes
     */
    public doUpDataInfo(rsp: Sproto.sc_raid_update_info_request) {
        // _Trace("UserFb:DoUpDataInfo--------------------------------------------------", rsp)
        if (this.fbModel[rsp.raidData.fbId] && this.fbModel[rsp.raidData.fbId].parser) {
            this.fbModel[rsp.raidData.fbId].parser(rsp.raidData);
        }
        MessageCenter.ins().dispatch(MessageDef.FB_COUNT_UPDATE)
    }

    /**
     * 发送添加副本挑战次数
     * 1-11
     * @param fbID 副本id
     */
    public sendAddCount(fbID: number): void {
        let req = new Sproto.cs_raid_add_count_request()
        req.fbID = fbID
        this.Rpc(C2sProtocol.cs_raid_add_count, req)
    }

    /**
     * 处理副本剩余时间
     * 1-13
     * @param bytes
     */
    public doFbTime(rsp: Sproto.sc_raid_time_request) {
    }

    //boss召唤的次数
    public doBossBoxNum(rsp: Sproto.sc_raid_boss_box_num_request) {
        this.bossCallNum = rsp.bossCallNum
    }

    ////////////////////////////////////////////////////////////  其他  ///////////////////////////////////

    public get guanqiaID() {
        return this._guanqiaID;
    }

    public set guanqiaID(value) {
        if (this._guanqiaID != value) {
            this._guanqiaID = value;
            this.bossIsChallenged = false;
            this.postGuanKaIdChange();
            OtherAIModel.getInstance.setPoint();
            LocalStorageData.setItem(LocalDataKey.guanqiaId + "_", value + "");
        }
    }


    public get wave() {
        return this.m_Wave;
    }

    public set wave(value) {
        if (this.m_Wave != value) {
            this.m_Wave = value;
            this.postWaveChange();
        }
    }

    private m_KillMonsterCount = 0

    public get killMonsterCount() {
        return this.m_KillMonsterCount
    }

    public set killMonsterCount(value) {
        if (this.m_KillMonsterCount != value) {
            this.m_KillMonsterCount = value
            GameGlobal.MessageCenter.dispatch(MessageDef.RAID_KILL_MONSTER_COUNT)
        }
    }
    private chaptersConfig: any;

    /**
     * 是否能挑战boss
     */
    public isShowBossPK() {
        if (this.guanqiaID == -1)
            return false;
        if (this.chaptersConfig == null)
            this.chaptersConfig = GlobalConfig.ins("ChaptersConfig");
        // return this.m_Wave >= GlobalConfig.ins("ChaptersConfig")[this.guanqiaID].bossNeedWave && GameMap.fubenID == 0;
        return this.m_KillMonsterCount >= this.chaptersConfig[this.guanqiaID].bossNeedWave && GameMap.fubenID == 0;
    }

    public getNeedWave() {
        if (this.guanqiaID == -1)
            return undefined;
        if (this.chaptersConfig == null)
            this.chaptersConfig = GlobalConfig.ins("ChaptersConfig");

        return Math.max(this.chaptersConfig[this.guanqiaID].bossNeedWave - this.m_KillMonsterCount, 0)
    }
    public get killMonstType(): number {
        if (this.chaptersConfig == null)
            this.chaptersConfig = GlobalConfig.ins("ChaptersConfig");
        if (this.chaptersConfig[this.guanqiaID] && this.chaptersConfig[this.guanqiaID].bossNeedWave % 2 == 0) {
            return 2;
        } else {
            return 3;
        }
    }

    public startNum(type: number) {
        if (this.chaptersConfig == null)
            this.chaptersConfig = GlobalConfig.ins("ChaptersConfig");
        switch (type) {
            case 2:
                if (this.chaptersConfig[this.guanqiaID]) {
                    if (this.m_KillMonsterCount >= this.chaptersConfig[this.guanqiaID].bossNeedWave) {
                        return 2;
                    } else if (this.m_KillMonsterCount >= this.chaptersConfig[this.guanqiaID].bossNeedWave / 2) {
                        return 1
                    } else {
                        return 0;
                    }
                } else {
                    return 0;
                }

            default:
                if (this.chaptersConfig[this.guanqiaID]) {
                    if (this.m_KillMonsterCount >= this.chaptersConfig[this.guanqiaID].bossNeedWave) {
                        return 3;
                    } else if (this.m_KillMonsterCount >= (this.chaptersConfig[this.guanqiaID].bossNeedWave / 3 * 2)) {
                        return 2
                    } else if (this.m_KillMonsterCount >= (this.chaptersConfig[this.guanqiaID].bossNeedWave / 3)) {
                        return 1;
                    } else {
                        return 0;
                    }
                } else {
                    return 0;
                }
        }
    }

    public isTwoStar() {
        if (this.chaptersConfig[this.guanqiaID].bossNeedWave % 2 == 0) {
            return true;
        }
        return false;
    }


    public checkGuanKaMax() {
        if (this.maxLen != 0) {
            return this.maxLen;
        }
        var data = GlobalConfig.ins("ChaptersConfig");
        for (var str in data) {
            if (data[str]) {
                ++this.maxLen;
            }
        }
        return this.maxLen;
    }

    /** 获取当前波的掉落物（列表最后一个开始） */
    public getRewardsPop() {
        return this.rewards.pop();
    }

    //------------------------------------------------------------------------关卡相关
    /**
     * 处理关卡初始化信息
     * 1-1
     * @param bytes
     */
    public doGuanqiaInfo(rsp: Sproto.sc_raid_chapter_init_info_request) {
        var lastID = this.guanqiaID;

        var idIndex = rsp.guanqiaID
        if (idIndex >= this.checkGuanKaMax()) {
            idIndex = this.maxLen;
        }
        this.guanqiaID = idIndex;
        // 进入第十关需要有引导
        if (this.guanqiaID < 10) {
            this.m_FisthEnter10 = true
        }
        this.wave = rsp.wave
        this.killMonsterCount = rsp.killMonsterCount

        this.monsterCount = rsp.monsterCount
        this.monsterID = rsp.monsterID
        this.needWave = rsp.needWave
        this.bossID = rsp.bossID
        this.desc = rsp.desc

        this.refMonsterPos = rsp.refMonsterPos
        this.refEncounterPos = rsp.refEncounterPos
        this.bossReward = rsp.bossReward
        GuanQiaModel.getInstance.isCanNextLayer = rsp.nextMap;

        if (this.chaptersConfig == null)
            this.chaptersConfig = GlobalConfig.ins("ChaptersConfig");

        let config = this.chaptersConfig[this.guanqiaID]
        if (config) {
            let sceneConfig = GlobalConfig.ins("ScenesConfig")[config.sid]
            if (sceneConfig) {
                if (sceneConfig.rPos) {
                    this.refMonsterPos = sceneConfig.rPos
                }
                if (sceneConfig.zyPos) {
                    this.refEncounterPos = sceneConfig.zyPos
                }
            }
        }

        //屏蔽关卡效率提示
        // if (lastID != -1 && this.guanqiaID != lastID) {
        //     ViewManager.ins().open(EffectivenessTip);
        // }

        TimerManager.ins().doNext(this._CheckGuide, this)
        GameGlobal.MessageCenter.dispatch(MessageDef.GUANQIA_CHANGE);

    }

    private _CheckGuide() {
        let role = SubRoles.ins().getSubRoleByIndex(0)
        if (GameMap.IsNoramlLevel() && UserFb.ins().guanqiaID > 1 && role && role.equipsData[EquipPos.WEAPON].item.configID == 0 && !GuideUtils.ins().isShow()) {

            (<PlayFunView>ViewManager.ins().getView(PlayFunView)).guideUpgrade();
        }
        if (this.m_FisthEnter10 && GameMap.IsNoramlLevel() && UserFb.ins().guanqiaID == 5) {
            let view = <PlayFunView>ViewManager.ins().getView(PlayFunView)
            if (view) {
                this.m_FisthEnter10 = false;
                view.ShowGuanqiaAuto();
            }
        }
        if (this.m_FisthEnter11 && UserFb.ins().guanqiaID >= 11) {
            this.m_FisthEnter11 = false
            if (Shop.ins().shopNorefrush) {
                GameGlobal.MessageCenter.dispatch(MessageDef.SHOP_REFRESH, true)
            }
        }
    }

    private m_FisthEnter10 = false
    private m_FisthEnter11 = true

    public postGuanKaIdChange() {
    }

    /**
     * 清完一波请求
     */
    public sendWaveComplete() {
        // if (this.waveCD == 0 || egret.getTimer() - this.waveCD > 200) {
        //     this.waveCD = egret.getTimer();
        let req = new Sproto.cs_raid_wave_complete_request
        req.killCount = this.killMonsterCount
        this.Rpc(C2sProtocol.cs_raid_wave_complete, req)
        // } else {
        //     console.error("userfb.sendWaveComplete time out !!!!!")
        // }
    }

    public sendWaveMonster() {
        this.killMonsterCount = this.killMonsterCount + 1
        // this.Rpc(C2sProtocol.cs_raid_wave_monster, null, this._DoWaveMonsterCount, this)
    }

    // private _DoWaveMonsterCount(rsp:Sproto.cs_raid_wave_monster_response) {
    //     let data = rsp as Sproto.cs_raid_wave_monster_response
    //     this.killMonsterCount = data.count
    // }

    /**
     * 请求挑战boss
     */
    public sendPKBoss() {
        this.Rpc(C2sProtocol.cs_raid_pk_boss, new Sproto.cs_raid_pk_boss_request())
    }

    /**
     * 处理关卡波数信息
     */
    public doWaveData(rsp: Sproto.sc_raid_chapter_wave_data_request) {
        this.wave = rsp.wave
        this.rewards = rsp.rewards
        if (this.wave % 13 == 0 && this.wave != 0) {
            OtherAIModel.getInstance.refreshAll();
        }
        GameLogic.ins().postHookStateChange(GameLogic.HOOK_STATE_FIND_ENMENY);
        GameLogic.ins().createGuanqiaMonster();
    }

    public postWaveChange() {
    }

    /**
     * 处理挑战boss结果
     * 1-3
     * @param bytes
     */
    public doBossResult(rsp: Sproto.sc_raid_chapter_boss_result_request) {
        TimerManager.ins().doTimer(300, 1, () => {
            UserFb.ins().doTimerBossResult(rsp.result, rsp.rewards);
        }, UserFb.ins());
    }
    /**特殊处理副本关卡自动飞拾取-记录的有效奖励长度*/
    public rewardNum: number = 0;
    public doTimerBossResult(result: number, rewards: Sproto.reward_data[]) {
        let hasDrop = GameMap.fbType == UserFb.FB_TYPE_PERSONAL_BOSS || GameMap.fbType == UserFb.FB_TYPE_GUANQIABOSS || GameMap.fbType == UserFb.FB_TYPE_MATERIAL

        if (hasDrop) {
            this.rewardNum = 0;
            for (let i = 0, len = rewards.length; i < len; ++i) {
                let reward = rewards[i]
                if (reward.type == 0 && reward.id != 1 && reward.id != 2) {
                } else {

                    this.rewardNum++;
                    // console.log(DropHelp.tempDropPoint.x, DropHelp.tempDropPoint.y,  EntityManager.ins().getNoDieRole().x, EntityManager.ins().getNoDieRole().y)
                    Encounter.postCreateDrop(DropHelp.tempDropPoint.x != 0 ? DropHelp.tempDropPoint.x : Const.PixelToPos(EntityManager.ins().getNoDieRole().x),
                        DropHelp.tempDropPoint.y != 0 ? DropHelp.tempDropPoint.y : Const.PixelToPos(EntityManager.ins().getNoDieRole().y),
                        reward);
                }
            }
        }
        if (result) {
            var func = () => {
                this.sendGetBossReward();
                //是挑战副本的话，添加关闭方法

                let func2 = null
                // 黄金矿洞
                if (GameMap.fubenID == 41001) {
                    func2 = () => { ViewManager.ins().open(LadderWin, 2) }
                } else {
                    switch (GameMap.fbType) {
                        case UserFb.FB_TYPE_TRYROAD:
                            func2 = () => { ViewManager.ins().open(FbWin, 5) }
                            break

                        case UserFb.FB_TYPE_TIAOZHAN:
                            func2 = () => { ViewManager.ins().open(FbWin, 1) }
                            break

                        case UserFb.FB_TYPE_PK:
                            func2 = () => {
                                var view: ZaoYuItemWin = ViewManager.ins().open(ZaoYuItemWin) as ZaoYuItemWin;
                                view.pkGetMiBaoMovieClip();
                            }

                            break

                        case UserFb.FB_TYPE_PERSONAL_BOSS:
                            func2 = () => { ViewManager.ins().open(BossWin, 0) }
                            break

                        case UserFb.FB_TYPE_MATERIAL:
                            func2 = () => { ViewManager.ins().open(FbWin) }
                            break

                        case UserFb.FB_TYPE_DARTCAR:
                            func2 = () => { ViewManager.ins().open(LadderWin, 1) }
                            break

                        case UserFb.FB_RING_BOSS:
                            func2 = () => { ViewManager.ins().open(RingMainWin, 2) }
                            break

                        case UserFb.FB_TYPE_GUILD_FB:
                            func2 = () => { ViewManager.ins().open(GuildMap) }
                            break
                        case UserFb.FB_TYPE_MIJING:
                            func2 = () => { ViewManager.ins().open(FbWin, 2) }
                            break
                        case UserFb.FB_TYPE_CLIMB_PET:
                            func2 = () => { ViewManager.ins().open(FbWin, 3) }
                            break
                        case UserFb.FB_TYPE_CLIMB_MOUNT:
                            func2 = () => { ViewManager.ins().open(FbWin, 4) }
                            break
                        case UserFb.FB_TYPE_HEROBATTLE:
                            func2 = () => { ViewManager.ins().open(ActivityWin, 303) }
                            break
                    }
                }
                if (UserFb.ins().isNoWait == true) {
                    UserFb.ins().isNoWait = false;
                    if (GameMap.fbType == UserFb.FB_TYPE_CLIMB_PET || GameMap.fbType == UserFb.FB_TYPE_CLIMB_MOUNT) {
                        ViewManager.ins().open(ClimbResultWin, func2, GameMap.fbType);
                    }
                    else if (GameMap.fbType == UserFb.FB_TYPE_TIAOZHAN) {
                        ViewManager.ins().open(ChallengeResultWin, func2);
                    } else if (GameMap.fbType == UserFb.FB_TYPE_TRYROAD) {
                        ViewManager.ins().open(DrillChallengeResultWin, func2);
                    }
                    else {
                        ViewManager.ins().open(ResultWin, 1, rewards, GlobalConfig.jifengTiaoyueLg.st100797, func2);
                    }
                } else {
                    var timeId = egret.setTimeout(() => {
                        egret.clearTimeout(timeId);
                        if (GameMap.fbType == UserFb.FB_TYPE_CLIMB_PET || GameMap.fbType == UserFb.FB_TYPE_CLIMB_MOUNT) {
                            ViewManager.ins().open(ClimbResultWin, func2, GameMap.fbType);
                        }
                        else if (GameMap.fbType == UserFb.FB_TYPE_TIAOZHAN) {
                            ViewManager.ins().open(ChallengeResultWin, func2);
                        } else if (GameMap.fbType == UserFb.FB_TYPE_TRYROAD) {
                            ViewManager.ins().open(DrillChallengeResultWin, func2);
                        }
                        else {
                            ViewManager.ins().open(ResultWin, 1, rewards, GlobalConfig.jifengTiaoyueLg.st100797, func2);
                        }
                    }, this, 800)
                }
            }
            if (hasDrop) {
                DropHelp.addCompleteFunc(func, this);
                DropHelp.start();
            } else {
                func()
            }
        }
        else {
            //如果主动退出的是关卡boss，则关闭自动挑战
            if (GameMap.fbType == UserFb.FB_TYPE_GUANQIABOSS) {
                PlayFun.ins().closeAuto();
            }

            // if (Recharge.ins().ToDayRechargeState() == 1 && (GameMap.fbType == UserFb.FB_TYPE_PERSONAL_BOSS || GameMap.fbType == UserFb.FB_TYPE_GUANQIABOSS)) {

            //     // 检查是否需要弹出首充界面
            //     let func1 = this.CheckFirstRecharge(UserFb.FB_TYPE_PERSONAL_BOSS, FuncOpenModel.SAVE_DATA_BOSS01)
            //     let func2 = this.CheckFirstRecharge(UserFb.FB_TYPE_GUANQIABOSS, FuncOpenModel.SAVE_DATA_BOSS02)

            //     ViewManager.ins().open(ResultWin, 0, [], "", func1 == null ? func2 : func1);
            // } else {
            //     ViewManager.ins().open(ResultWin, 0);
            // }

            this.CheckFirstRecharge(UserFb.FB_TYPE_PERSONAL_BOSS, FuncOpenModel.SAVE_DATA_BOSS01)
            this.CheckFirstRecharge(UserFb.FB_TYPE_GUANQIABOSS, FuncOpenModel.SAVE_DATA_BOSS02)
            if (GameMap.fbType == UserFb.FB_TYPE_MIJING) {
                let func2 = () => { ViewManager.ins().open(FbWin, 2) }
                ViewManager.ins().open(ResultWin, 0, null, null, func2);
            } else if (GameMap.fbType == UserFb.FB_TYPE_HEROBATTLE) {
                let func2 = () => { ViewManager.ins().open(ActivityWin, 303); }
                ViewManager.ins().open(ResultWin, 0, null, null, func2);
            }
            else {
                ViewManager.ins().open(ResultWin, 0)
            }
        }
    }

    private CheckFirstRecharge(fbType, dataType) {
        // let func = null
        if (GameMap.fbType == fbType && Recharge.ins().getFirstRechargeState() && !FuncOpenModel.HasSaveData(dataType)) {
            // func = () => {
            // ViewManager.ins().open(ChargeFirstWin)
            FuncOpenModel.SAVE_DATA_FALG = true
            FuncOpenModel.SetSaveData(dataType)
            // }
        }
        //    return func
    }

    /**
     * 请求领取boss奖励
     * 1-3
     */
    public sendGetBossReward() {
        this.Rpc(C2sProtocol.cs_raid_get_boss_reward, new Sproto.cs_raid_get_boss_reward_request())
    }

    /**
     * 退出副本
     * 1-4
     */
    public sendExitFb() {
        this.Rpc(C2sProtocol.cs_raid_exit_raid, new Sproto.cs_raid_exit_raid_request())
        UserBoss.ins().sendInfo();

    }

    /**
     * 发送领取关卡奖励
     * 1-5
     */
    public sendGetAward(id: number) {
        let data = new Sproto.cs_raid_get_award_request();
        data.id = id;
        this.Rpc(C2sProtocol.cs_raid_get_award, data)
    }

    /**
     * 处理关卡奖励领取状态
     * 1-5
     * @param bytes
     */
    public doGuanqiaReward(rsp: Sproto.sc_raid_chapter_reward_request) {
        if (rsp == null) return;
        this.guanqiaReward = rsp.result;
        this.postZhangJieAwardChange();
        this.postGuanKaIdChange();
    }

    /**派发章节领取状态变更消息 */
    public postZhangJieAwardChange() {
    }

    /**
     * 领取地区奖励
     * 1-6
     */
    public senddoGuanqiaWroldReward(pass) {
        let data = new Sproto.cs_raid_get_world_award_request()
        data.pass = pass
        this.Rpc(C2sProtocol.cs_raid_get_world_award, data)
    }



    /**
     * 处理离线奖励
     * 1-12
     * @param bytes
     */
    public doOfflineReward(rsp: Sproto.sc_raid_chapter_offline_reward_request) {
        ViewManager.ins().open(OfflineRewardWin, rsp);
    };

    /**
     * 进入下一章节
     */
    public sendGoNextChapter() {
        let rsp = new Sproto.cs_raid_next_chapter_req_request;
        this.Rpc(C2sProtocol.cs_raid_next_chapter_req, rsp);
    }
    /**
     * 守城boss初始化
     */
    public sendGetQuanQiaBossInit() {
        let rsp = new Sproto.cs_raid_guardian_req_request;
        this.Rpc(C2sProtocol.cs_raid_guardian_req, rsp);
    }

    /**
      * 守城boss战斗
      */
    public sendQuanQiaBossBattle(id: number) {
        let rsp = new Sproto.cs_raid_guardian_fight_req_request;
        rsp.id = id;
        this.Rpc(C2sProtocol.cs_raid_guardian_fight_req, rsp);
    }

    /**
      * 守城boss扫荡
      */
    public sendQuanQiaBossQuick(id: number) {
        let rsp = new Sproto.cs_raid_guardian_quick_req_request;
        rsp.id = id;
        this.Rpc(C2sProtocol.cs_raid_guardian_quick_req, rsp);
    }

    /**
     * 守城boss体力购买
     */
    public sendQuanQiaBuyTili() {
        let rsp = new Sproto.cs_raid_guardian_tili_req_request;
        this.Rpc(C2sProtocol.cs_raid_guardian_tili_req, rsp);
    }

    public getQuanQiaBossInit(bytes: Sproto.sc_raid_guardian_res_request) {
        let guanQiaModel = GuanQiaModel.getInstance;
        guanQiaModel.tiliNum = bytes.tili;
        guanQiaModel.info = bytes.info;
        guanQiaModel.time = bytes.time;
        guanQiaModel.tiliBuyNum = bytes.bought;
        GameGlobal.MessageCenter.dispatch(GuanQiaEvt.GUANQIA_UPDATE_MSG);
    }

    public GetWaveMonsterCount(): number {
        return this.monsterCount
    }

    public GetRPos(): Sproto.position[] {
        return this.refMonsterPos
    }

    public CheckFb(): boolean {
        return GameMap.fbType == 0
    }

    /** 关卡boss*/
    public static FB_TYPE_GUANQIABOSS = 1;
    /**材料副本 */
    public static FB_TYPE_MATERIAL = 2
    /** 个人boss*/
    public static FB_TYPE_PERSONAL_BOSS = 6;
    /** 全民boss*/
    public static FB_TYPE_PUBLIC_BOSS = 7;
    public static FB_TYPE_GUILD_BOSS = 18
    /** 挑战副本*/
    public static FB_TYPE_TIAOZHAN = 9;
    /** 转生boss*/
    public static FB_TYPE_ZHUANSHENGBOSS = 10;

    public static FB_TYPE_GUILD_ROBBER = 13
    public static FB_TYPE_GUILD_FB = 13

    /** 公会战*/
    public static FB_TYPE_GUILD_WAR = 14

    public static FB_TYPE_PK = 11

    public static FB_ID_TYPE_WAR = 28001

    /**跨服boss*/
    public static FB_TYPE_KFBOSS = 28
    /** 世界boss*/
    public static FB_TYPE_WORLDBOSS = 26;
    /** 寻宝boss*/
    public static FB_TYPE_XBBOSS = 31;
    /**运镖战斗场景*/
    public static FB_TYPE_DARTCAR = 32;
    /** 试练之路*/
    public static FB_TYPE_TRYROAD = 29;

    /** 挂机*/
    public static FB_GOLD_ON_HOOK = 33;
    /** 戒灵boss*/
    public static FB_RING_BOSS = 35;
    /**boss之家 */
    public static FB_TYPE_HOME_BOSS = 37;
    /**十连杀 */
    public static FB_TYPE_TENKILL = 38;
    /**秘境战斗 */
    public static FB_TYPE_MIJING = 40;
    /**宠物爬塔 */
    public static FB_TYPE_CLIMB_PET = 1001;
    /**坐骑爬塔 */
    public static FB_TYPE_CLIMB_MOUNT = 1002;
    /**守城boss */
    public static FB_TYPE_CITYBOSS = 1003;
    /**圣域boss */
    public static FB_TYPE_SYBOSS = 1004;
    /**勇者试炼 */
    public static FB_TYPE_HEROBATTLE = 1005;
    /**组队副本 */
    public static FB_TYPE_TEAM = 1006;
    /**魔龙圣殿 */
    public static FB_TYPE_CHAOSBATTLE = 1007;

}

MessageCenter.compile(UserFb);
window["UserFb"] = UserFb