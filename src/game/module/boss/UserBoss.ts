// var __ref_field__: any = GameLogic

class UserBoss extends BaseSystem {

    private publicBossBaseConfig: any;
    private kuafuBossBaseConfig: any;
    monsterID
    bossHandler
    handler
    rank: WorldBossRankItemData[];


    // isOpen
    // configID
    // cd
    // curHp
    // maxHp
    rankList: WorldBossRankItemData[];


    // 可用挑战次数
    challengeCount: number = 0
    toDaySoul: number = 0;
    cdTime
    bossRemind
    isDoingTimer

    bossAutoFight

    bossInfo: PublicBossInfo[] = [];
    kFbossInfo: KfBossInfo[] = [];
    tempID

    hp: number
    public constructor() {
        super();

        this.sysId = PackageID.Boss;
        this.regNetMsg(S2cProtocol.sc_public_boss_init_panel_info, this.doInfo);
        this.regNetMsg(S2cProtocol.sc_public_boss_update_list, this.doBossList);
        this.regNetMsg(S2cProtocol.sc_public_boss_update_boss, this.doUpDateBoss);
        this.regNetMsg(S2cProtocol.sc_public_boss_kill_log, this._DoKillLog);
        this.regNetMsg(S2cProtocol.sc_public_boss_challenge_result, this.doChallengeResult);
        this.regNetMsg(S2cProtocol.sc_public_boss_rank_update, this._DoRankUpdate);
        this.regNetMsg(S2cProtocol.sc_public_boss_init_info, this.postWorldBoss);
        this.regNetMsg(S2cProtocol.sc_public_boss_hurt_result, this.doWorldBossHurt);
        this.regNetMsg(S2cProtocol.sc_public_boss_clear_cd, this.doClearCD);
        this.regNetMsg(S2cProtocol.sc_public_boss_blood, this.doBossBlood);
        this.regNetMsg(S2cProtocol.sc_public_boss_cur_owner, this._DoCurOwner);
        this.regNetMsg(S2cProtocol.sc_public_boss_relive_time, this._DoReliveTime);
        this.regNetMsg(S2cProtocol.sc_public_boss_challenge_suc, this._DoChallengeSuc);
        this.regNetMsg(S2cProtocol.sc_public_boss_be_hit, this._DoChallengeHit);
        //+# boss 总血量推送
        this.regNetMsg(S2cProtocol.sc_public_blood_update, this.doPublicBloodUpdate);
        //+# 打死一只BOSS物品掉落地上消息推送
        this.regNetMsg(S2cProtocol.sc_public_items_droped, this.doPublicItemsDroped);

        //this.regNetMsg(S2cProtocol.sc_publicboss_infolist, this.doBossList);
        MessageCenter.addListener(GameLogic.ins().postEnterMap, this.checkShow, this);

        this.regNetMsg(S2cProtocol.sc_public_player_list, this.playerListUpdatte); //获得玩家列表信息
        this.regNetMsg(S2cProtocol.sc_cross_boss_list, this.doKfBossList);//处理跨服boss列表数据

        /***boss之家 */
        this.regNetMsg(S2cProtocol.sc_vip_boss_challenge_time, this.getVipBossClearTimeMsg);
        this.regNetMsg(S2cProtocol.sc_vip_boss_init_panel_info, this.getVipBossMsg);
        this.regNetMsg(S2cProtocol.sc_vip_boss_refresh_remind, this.getVipBossRefreshMsg);
        this.regNetMsg(S2cProtocol.sc_vip_boss_remind_panel_info, this.getVipBossRemindMsg);
    }

    /**
     * 	{
     *      id			0 : integer
	        roleName	1 : string	
	        job			2 : integer
	        sex			3 : integer
        }
     * 
    */
    private playerListUpdatte(bytes: Sproto.sc_public_player_list_request): void {
        var view: BossBloodPanel = <BossBloodPanel>ViewManager.ins().getView(BossBloodPanel);
        if (view) {
            view.playerListUpdatte(bytes.list);
        }
    }


    public tempHp: string = "";
    public tempMaxHp: string = "";
    private doPublicBloodUpdate(bytes: Sproto.sc_public_blood_update_request) {
        this.tempHp = bytes.hp;
        this.tempMaxHp = bytes.dhp;
    }

    private doPublicItemsDroped(bytes: Sproto.sc_public_items_droped_request) {
        var reward = bytes.reward;
        var len: number = reward.length;

        var no1Reward: RewardData[] = [];
        DropHelp.clearDrop();
        //计算掉落
        var x_Grid = Math.floor(GameMap.MAX_WIDTH / 2 / GameMap.CELL_SIZE);
        var y_Grid = Math.floor(GameMap.MAX_HEIGHT / 2 / GameMap.CELL_SIZE);
        for (var i = 0; i < len; i++) {
            no1Reward[i] = new RewardData;
            no1Reward[i].parser(reward[i]);
            Encounter.postCreateDrop(x_Grid, y_Grid, no1Reward[i]);
        }

    }

    static ins(): UserBoss {
        return super.ins()
    }


    /**
     * 请求界面显示数据
     * 10-1
     */
    sendInfo() {
        // this.sendToServer(this.getBytes(1));
        this.Rpc(C2sProtocol.cs_public_boss_send_panel_info)
    };
    /**
     * 处理界面数据
     * 10-1
     */
    doInfo(bytes: Sproto.sc_public_boss_init_panel_info_request) {
        this.parser(bytes);
        MessageCenter.ins().dispatch(MessageDef.PUBLIC_BOSS_LIST_DATA)
    };
    /**
     * 请求boss列表数据
     * 10-2
     */
    sendBossList() {
        this.Rpc(C2sProtocol.cs_public_boss_send_boos_list)
        // this.sendToServer(this.getBytes(2));
    };

    /**
     * 处理boss列表数据
     * 10-2
     * @param bytes
     */
    doBossList(bytes: Sproto.sc_public_boss_update_list_request) {
        this.parserBossList(bytes);
        MessageCenter.ins().dispatch(MessageDef.PUBLIC_BOSS_LIST_DATA)
    };

    /**
     * 处理boss数据更新
     * 10-3
     * @param bytes
     */
    doUpDateBoss(bytes: Sproto.sc_public_boss_update_boss_request) {
        this.parserBoss(bytes);
        MessageCenter.ins().dispatch(MessageDef.PUBLIC_BOSS_LIST_DATA)
    };
    /**派发boss数据更新*/
    postBossData(isShow, name: string = "") {
        return [isShow, name];
    };

    sendSaveRemind() {
        let rsp = new Sproto.cs_public_boss_save_remind_request
        rsp.bossRemind = this.bossRemind
        this.Rpc(C2sProtocol.cs_public_boss_save_remind, rsp)
    };

    sendSaveAutoFight() {
        let rsp = new Sproto.cs_public_boss_save_autofight_request
        rsp.bossAutoFight = this.bossAutoFight
        this.Rpc(C2sProtocol.cs_public_boss_save_autofight, rsp)
        this.sendInfo();
    };


    private m_RecordDataList: { [key: number]: WildBossJoinItemData[] } = {}

    public GetRecordData(id: number): WildBossJoinItemData[] {
        let data = this.m_RecordDataList[id]
        if (data) {
            return data
        }
        return []
    }

    /**
     * 请求挑战记录
     * 10-4
     * @param id
     */
    sendChallengeRecord(id) {
        let rsp = new Sproto.cs_public_boss_challenge_record_request
        rsp.id = id
        this.Rpc(C2sProtocol.cs_public_boss_challenge_record, rsp)
    };
    /**
     * 处理挑战记录
     * 10-4
     * @param bytes
     */
    private _DoKillLog(bytes: Sproto.sc_public_boss_kill_log_request) {
        var id = bytes.id
        var count = bytes.logs.length
        var datas = [];
        for (var i = 0; i < count; i++) {
            let byteData = bytes.logs[i]
            let obj = new WildBossJoinItemData
            obj.time = byteData.time
            obj.name = byteData.name
            obj.value = byteData.hurt
            datas.push(obj)
        }
        datas.sort((lhs, rhs) => {
            return rhs.time - lhs.time
        })
        this.m_RecordDataList[id] = datas
        // datas.reverse();
        GameGlobal.MessageCenter.dispatch(MessageDef.PUBLIC_BOSS_RECORD_UPDATE)
    };
    /**
     * 请求挑战
     * 10-5
     * @param id
     */
    sendChallenge(id) {
        let rsp = new Sproto.cs_public_boss_challenge_request
        rsp.id = id
        this.Rpc(C2sProtocol.cs_public_boss_challenge, rsp)
    };
    /**
     * 处理挑战结果
     * 10-5
     * @param bytes
     */
    doChallengeResult(bytes: Sproto.sc_public_boss_challenge_result_request) {
        var myRank = bytes.myRank
        var no1Name = bytes.no1Name
        var no1Level = bytes.no1Level
        var count = bytes.no1Reward.length
        var no1Reward: RewardData[] = [];
        for (var i = 0; i < count; i++) {
            no1Reward[i] = new RewardData;
            no1Reward[i].parser(bytes.no1Reward[i]);
        }
        count = bytes.myReward.length
        var myReward: RewardData[] = [];
        for (var i = 0; i < count; i++) {
            myReward[i] = new RewardData;
            myReward[i].parser(bytes.myReward[i]);
        }

        let func = null
        if (GameMap.IsXbBoss()) {
            func = () => { ViewManager.ins().open(TreasureHuntWin, 1) }
        } else if (GameMap.IsPublicBoss()) {
            func = () => { ViewManager.ins().open(BossWin, 1) }
        } else if (GameMap.IsKfBoss()) {
            func = () => { ViewManager.ins().open(BossWin, 4) }
        } else if (GameMap.IsHomeBoss()) {
            func = () => { ViewManager.ins().open(BossWin, 2) }
        } else if (GameMap.IsSyBoss()) {
            func = () => { ViewManager.ins().open(BossWin, 5) }
        }

        let str = (GameMap.IsXbBoss()) ? GlobalConfig.jifengTiaoyueLg.st100797 : GlobalConfig.jifengTiaoyueLg.st100798;//"获得如下奖励:" : "BOSS归属者获得4倍奖励";
        ViewManager.ins().open(ResultWin, true, myReward, myRank == 1 ? str : GlobalConfig.jifengTiaoyueLg.st100799, func);
    };
    /**
     * 请求排行榜
     * 10-6
     * @param id
     */
    sendRank(id) {
        let rsp = new Sproto.cs_public_boss_rank_request
        rsp.id = id
        this.Rpc(C2sProtocol.cs_public_boss_rank, rsp)
    };

    private m_RankDataList: { [key: number]: WildBossJoinItemData[] } = {}

    public GetRankData(id: number): WildBossJoinItemData[] {
        let data = this.m_RankDataList[id]
        if (data) {
            return data
        }
        return []
    }

    /**
     * 处理排行榜数据
     * 10-6
     * @param bytes
     */
    private _DoRankUpdate(bytes: Sproto.sc_public_boss_rank_update_request) {
        var id = bytes.id
        var count = bytes.logs.length
        var datas = [];
        for (var i = 0; i < count; i++) {
            let byteData = bytes.logs[i]
            let obj = new WildBossJoinItemData
            // obj.time = byteData.time,
            obj.name = byteData.name,
                obj.value = byteData.hurt
            datas.push(obj)
        }
        this.m_RankDataList[id] = datas
        GameGlobal.MessageCenter.dispatch(MessageDef.PUBLIC_BOSS_RANK_UPDATE)
    };
    /**
     * 请求世界boss数据初始化&更新
     * 10-10
     */
    sendWorldBossInfo() {
        // this.sendToServer(this.getBytes(10));
        this.Rpc(C2sProtocol.cs_public_boss_send_init_info)
    };
    /**
     * 世界boss数据初始化&更新
     * 10-10
     * @param bytes
     */
    postWorldBoss(bytes: Sproto.sc_public_boss_init_info_request) {
        // this.isOpen = bytes.readBoolean();
        // this.configID = bytes.readInt();
        // this.cd = bytes.readShort();
        // this.curHp = bytes.readDouble();
        // this.maxHp = bytes.readDouble();
        this.rankList = [];
        var rankData: WorldBossRankItemData;
        var count = bytes.ranks.length
        for (var i = 0; i < count; i++) {
            rankData = new WorldBossRankItemData;
            rankData.parser(bytes.ranks[i]);
            this.rankList[i] = rankData;
        }
    };
    /**
     * 处理boss伤害
     * 10-12
     * @param bytes
     */
    doWorldBossHurt(bytes: Sproto.sc_public_boss_hurt_result_request) {
        ViewManager.ins().open(WorldBossGold, bytes.hurt, bytes.gold);
    };
    /**
     * 请求世界boss清除CD
     * 10-14
     */
    sendClearCD() {
        // this.sendToServer(this.getBytes(14));
        this.Rpc(C2sProtocol.cs_public_boss_clear_cd)
    };
    /**
     * 处理世界boss清除CD
     * 10-14
     */
    doClearCD(bytes: Sproto.sc_public_boss_clear_cd_request) {
        UserTips.ins().showTips(bytes.result == 1 ? GlobalConfig.jifengTiaoyueLg.st101697 : GlobalConfig.jifengTiaoyueLg.st101698);
    };
    /**
     * 请求世界boss挑战
     * 10-15
     */
    // sendChallengWorldBoss() {
    //     this.sendToServer(this.getBytes(15));
    // };
    /**
     * 处理boss血条面板的信息
     * 10-20
     * @param bytes
     */
    doBossBlood(bytes: Sproto.sc_public_boss_blood_request) {
        this.monsterID = bytes.monsterId
        this.bossHandler = bytes.bossHandler
        this.handler = bytes.handler
        this.rank = [];

        var count = bytes.ranks.length
        for (var i = 0; i < count; i++) {
            var obj = new WorldBossRankItemData();
            obj.rank = i + 1;
            obj.parser(bytes.ranks[i]);
            this.rank[i] = obj;

        }
        this.rank.sort((lhs, rhs) => {
            return rhs.value - lhs.value
        })
        ViewManager.ins().open(BossBloodPanel);
        GameGlobal.MessageCenter.dispatch(MessageDef.PUBLIC_BOSS_OWNER_CHNAGE)
        // ViewManager.ins().close(UIView1);
        // ViewManager.ins().close(UIView1_1);
    };

    private m_PreClickTime = 0
    /**
     * 请求攻击玩家
     * 10-14
     */
    sendPlayerBattle(dbid: number) {
        var cs_public_boss_attack_player = new Sproto.cs_public_boss_attack_player_request();
        cs_public_boss_attack_player.dbid = dbid;
        this.Rpc(C2sProtocol.cs_public_boss_attack_player, cs_public_boss_attack_player);
        this.m_PreClickTime = GameServer.serverTime;
    };

    public CanClick(): boolean {
        return this.m_PreClickTime + 1 <= GameServer.serverTime;
    }

    restoreTime: number = 0
    //---------------------------------------------------------------------全民boss界面信息
    parser(bytes: Sproto.sc_public_boss_init_panel_info_request) {
        this.challengeCount = bytes.challengeCount
        this.restoreTime = bytes.restoreTime + GameServer.serverTime
        this.toDaySoul = bytes.toDaySoul
        this.cdTime = bytes.cdTime * 1000 + egret.getTimer();
        this.bossRemind = bytes.bossRemind || 0

        this.bossAutoFight = bytes.bossAutoFight || 0;

        // var mTime = this.restoreTime
        // if (!this.isDoingTimer && mTime > 0) {
        //     this.isDoingTimer = true;
        //     TimerManager.ins().doTimer(mTime * 1000 + 3000, 1, () => {
        //         // MessageCenter.ins().dispatch(MessagerEvent.BOSS_COUNT_RECOVER);
        //         this.sendInfo();
        //         this.isDoingTimer = false;
        //     }, this);
        // }

    };
    getRemindByIndex(index) {
        return ((this.bossRemind >> (index + 1)) & 1) == 1;
    };

    getAutoFightByIndex(index) {
        return ((this.bossAutoFight >> (index + 1)) & 1) == 1;
    };

    setRemind(value) {
        this.bossRemind ^= value;
        this.sendSaveRemind();
    };

    setAutoFight(value) {
        this.bossAutoFight = 0;
        this.bossAutoFight ^= value;
        this.sendSaveAutoFight();
    };

    parserBossList(bytes: Sproto.sc_public_boss_update_list_request) {
        var count = bytes.boosInfos.length
        this.bossInfo = [];
        for (var i = 0; i < count; i++) {
            let info = new PublicBossInfo;
            info.parser(bytes.boosInfos[i]);
            this.bossInfo.push(info);
        }
    };
    parserBoss(bytes: Sproto.sc_public_boss_update_boss_request) {
        var id = bytes.boosInfo.id
        var tempHP;
        var lv = GameLogic.ins().actorModel.level;
        var zslv = UserZs.ins().lv;
        for (var i = 0; i < this.bossInfo.length; i++) {
            tempHP = this.bossInfo[i].hp;
            if (this.bossInfo[i].id == id) {
                this.bossInfo[i].parser(bytes.boosInfo);
                //删除提示
                if (this.tempID &&
                    this.tempID == GlobalConfig.publicBossConfig[id].bossId &&
                    this.bossInfo[i].isDie) {
                    this.tempID = 0;
                    this.postBossData(false);
                }
                //提示重生
                if (tempHP == 0 && this.bossInfo[i].hp == 100
                    && this.getRemindByIndex(i)
                    && zslv >= GlobalConfig.publicBossConfig[id].zsLevel && lv >= GlobalConfig.publicBossConfig[id].level) {
                    this.tempID = GlobalConfig.publicBossConfig[id].bossId;
                    this.postBossData(true, GlobalConfig.monstersConfig[this.tempID].name);
                }
                break;
            }
        }
    };
    /** 是否有可挑战 */
    isCanChalleng() {
        if (!this.bossInfo)
            return false;
        var len = this.bossInfo.length;
        var boss;
        if (this.challengeCount > 0) {
            for (var i = 0; i < len; i++) {
                boss = this.bossInfo[i];
                if (boss.canChallenge && this.getRemindByIndex(i)) {
                    return true;
                }
            }
        }
        return false;
    };

    private m_CurOwnerData: Sproto.sc_public_boss_cur_owner_request
    private m_ReliveTime: number

    public GetReliveTime(): number {
        return this.m_ReliveTime
    }

    /**
     * 检查是否是死亡状态
     */
    public CheckIsDead(): boolean {
        return this.m_ReliveTime > GameServer.serverTime
    }

    /**
     * 获取复活还剩余的时间
     */
    public GetReliveSurplusTime(): number {
        return Math.max(Math.floor(this.m_ReliveTime - GameServer.serverTime), 0)
    }

    public GetCurOwnerHandler(): number {
        if (this.m_CurOwnerData) {
            return this.m_CurOwnerData.actorid
        }
        return 0
    }

    public GetCurOwnerData(): Sproto.sc_public_boss_cur_owner_request {
        return this.m_CurOwnerData
    }

    public SendChallengeOwner() {
        this.Rpc(C2sProtocol.cs_public_challenge_owner)
    }

    public AutoRelive() {
        if (this.CheckIsDead()) {
            if (ZsBoss.ins().autoClear) {
                if (this.CheckIsMoreMoney()) {
                    this.SendReliveCd()
                    return false;
                }
                else {
                    UserTips.ins().showTips(GlobalConfig.jifengTiaoyueLg.st101699);
                    ZsBoss.ins().autoClear = false;
                }
            }
            return true;
        }
        return false;
    }

    public SendReliveCd() {
        if (this.CheckIsDead()) {
            this.Rpc(C2sProtocol.cs_public_relive_cd)
        } else {
            console.log("没有cd可以清除")
            // UserTips.ins().showTips("没有cd可以清除")
        }
    }

    public CheckIsMoreMoney() {
        if (this.publicBossBaseConfig == null)
            this.publicBossBaseConfig = GlobalConfig.ins("PublicBossBaseConfig");
        if (this.kuafuBossBaseConfig == null)
            this.kuafuBossBaseConfig = GlobalConfig.ins("KuafuBossBaseConfig");

        if (GameMap.IsPublicBoss())
            return GameLogic.ins().actorModel.yb >= this.publicBossBaseConfig.reburnPay;
        else if (GameMap.IsHomeBoss())
            return GameLogic.ins().actorModel.yb >= this.publicBossBaseConfig.vipreburnPay;
        else if (GameMap.IsSyBoss()) {
            let config = GlobalConfig.ins("PaidBossBaseConfig");
            return GameLogic.ins().actorModel.yb >= config.reburnPay;
        }
        else if (GameMap.IsXbBoss())
            return GameLogic.ins().actorModel.yb >= 30;
        else
            return GameLogic.ins().actorModel.yb >= this.kuafuBossBaseConfig.reburnPay;

    }

    private _DoCurOwner(rsp: Sproto.sc_public_boss_cur_owner_request) {
        this.m_CurOwnerData = rsp
        GameGlobal.MessageCenter.dispatch(MessageDef.PUBLIC_BOSS_OWNER_CHNAGE)
    }

    private _DoReliveTime(rsp: Sproto.sc_public_boss_relive_time_request) {
        this.m_ReliveTime = GameServer.serverTime + Math.floor(rsp.relive_time * 0.001)
        GameGlobal.MessageCenter.dispatch(MessageDef.PUBLIC_BOSS_RELIVE_UPDATE)
    }

    private _DoChallengeSuc(rsp: Sproto.sc_public_boss_challenge_suc_request) {
        let name1 = rsp.robName
        let name2 = rsp.berobName
        ViewManager.ins().open(PublicBossOwnerChange, name1, name2)
    }

    private _DoChallengeHit(rsp: Sproto.sc_public_boss_be_hit_request) {
        if (rsp.isShow) {
            ViewManager.ins().open(PublicBossAttack)
        } else {
            ViewManager.ins().close(PublicBossAttack)
        }
    }

    // private _DoResult() {
    //     let result: number

    //     let  rewards:Sproto.reward_data[]
    //     ViewManager.ins().open(ResultWin, 1, rewards, "获得奖励如下：", null);

    // }

    //-----------------------------------------------------------

    /** 获取boss排名数据 */
    getRankList(index) {
        return this.rankList[index];
    };
    init() {
        this.sendInfo();
        this.sendBossList();
        this.sendWorldBossInfo();
    };

    checkShow() {
        var fbID = GameMap.fubenID;
        GameLogic.ins().showEseBtn(fbID != 0);
        if (fbID != 0) {
            ViewManager.ins().close(PlayFunView);
        }
        else {
            ViewManager.ins().open(PlayFunView);
        }
        // 如果不是全民boss，清除数据
        // if (!GameMap.IsPublicBoss()) {
        //         this.m_CurOwnerData = null
        //     }
    };

    public IsPublicBoss(fbType): boolean {
        return fbType == UserFb.FB_TYPE_PERSONAL_BOSS
    }

    public IsKfBoss(fbType): boolean {
        return fbType == UserFb.FB_TYPE_KFBOSS
    }

    public IsXbBoss(fbType): boolean {
        return fbType == UserFb.FB_TYPE_XBBOSS
    }

    /**请求跨服BOSS面板信息*/
    public sendGetKfBossList() {
        this.Rpc(C2sProtocol.cs_cross_boss_panel_info)
    }

    /**
     * 处理跨服boss列表数据
     * 10-2
     * @param bytes
     */
    private doKfBossList(bytes: Sproto.sc_cross_boss_list_request) {
        this.parserKfBossList(bytes);
        MessageCenter.ins().dispatch(MessageDef.KF_BOSS_LIST_DATA)
    }

    private parserKfBossList(bytes: Sproto.sc_cross_boss_list_request) {
        var count = bytes.boosInfos.length
        this.kFbossInfo = [];
        for (var i = 0; i < count; i++) {
            let info = new KfBossInfo;
            info.parser(bytes.boosInfos[i]);
            this.kFbossInfo.push(info);
        }
    }

    /**
     * 请求挑战跨服BOSS
     * 10-5
     * @param id
     */
    public sendKfBossChallenge(id) {
        let rsp = new Sproto.cs_cross_boss_challenge_request
        rsp.id = id
        this.Rpc(C2sProtocol.cs_cross_boss_challenge, rsp)
    };

    /** 跨服是否有可挑战 */
    public isCanChallengKf() {
        if (!this.kFbossInfo)
            return false;
        var len = this.kFbossInfo.length;
        var boss;
        for (var i = 0; i < len; i++) {
            boss = this.kFbossInfo[i];
            if (boss.canChallenge) {
                return true;
            }
        }

        return false;
    };
    /*************boss之家 */
    /**清除boss的cd */
    public sendClearVipBossCD() {
        let rsp = new Sproto.cs_vip_boss_challenge_time_request;
        this.Rpc(C2sProtocol.cs_vip_boss_challenge_time, rsp)
    }
    /**请求boss信息 */
    public sendGetVipBossMsg() {
        let rsp = new Sproto.cs_vip_boss_init_panel_info_request;
        this.Rpc(C2sProtocol.cs_vip_boss_init_panel_info, rsp)
    }
    /**勾选提醒boss信息 */
    public sendGetVipBossTipsMsg(id: number, action: number) {
        let rsp = new Sproto.cs_vip_boss_refresh_remind_request;
        rsp.id = id;
        rsp.action = action;
        this.Rpc(C2sProtocol.cs_vip_boss_refresh_remind, rsp);
    }
    /**请求boss提醒数据 */
    public sendGetVipRemindMsg() {
        let rsp = new Sproto.cs_vip_boss_remind_panel_info_request;
        this.Rpc(C2sProtocol.cs_vip_boss_remind_panel_info, rsp)
    }
    private getVipBossClearTimeMsg(bytes: Sproto.sc_vip_boss_challenge_time_request) {
        HomeBossModel.getInstance.cdJoin = -1;
    }
    private getVipBossMsg(bytes: Sproto.sc_vip_boss_init_panel_info_request) {
        let homeBossModel: HomeBossModel = HomeBossModel.getInstance;
        homeBossModel.cdJoin = bytes.cdJoin + GameServer.serverTime;
        homeBossModel.layerBossRefCD1 = bytes.cdTime1 + GameServer.serverTime;
        homeBossModel.layerBossRefCD2 = bytes.cdTime2 + GameServer.serverTime;
        homeBossModel.layerBossRefCD3 = bytes.cdTime3 + GameServer.serverTime;
        let bossDatas: Sproto.public_boss_info[] = bytes.boosInfos;
        homeBossModel.layerBossData1.clear();
        homeBossModel.layerBossData2.clear();
        homeBossModel.layerBossData3.clear();
        for (var i = 0; i < bossDatas.length; i++) {
            let bossConfigData = homeBossModel.vipBossConfigData.get(bossDatas[i].id);
            if (bossConfigData) {
                switch (bossConfigData.LevelType) {
                    case HomeBossLayerType.LAYERTYPE1:
                        homeBossModel.layerBossData1.set(bossDatas[i].id, bossDatas[i]);
                        break;
                    case HomeBossLayerType.LAYERTYPE2:
                        homeBossModel.layerBossData2.set(bossDatas[i].id, bossDatas[i]);
                        break;
                    case HomeBossLayerType.LAYERTYPE3:
                        homeBossModel.layerBossData3.set(bossDatas[i].id, bossDatas[i]);
                        break;
                }
            }
        }
        GameGlobal.MessageCenter.dispatch(MessageDef.HOMEBOSS_BOSSMSG_UPDATE);
    }
    private getVipBossRefreshMsg(bytes: Sproto.sc_vip_boss_refresh_remind_request) {
        UserTips.ins().showTips("BOSS之家刷新了！");
        let publicBossConfig = GlobalConfig.ins("PublicBossConfig");
        let monstersConfig = GlobalConfig.ins("MonstersConfig");
        let bossId = publicBossConfig[bytes.id][0].bossId;
        let name = monstersConfig[bossId].name;
        GameGlobal.MessageCenter.dispatch(MessageDef.HOMEBOSS_REF_MSG, [true, name]);
    }
    private getVipBossRemindMsg(bytes: Sproto.sc_vip_boss_remind_panel_info_request) {
        HomeBossModel.getInstance.remindStats = bytes.remindStats;
        GameGlobal.MessageCenter.dispatch(MessageDef.HOMEBOSS_REMIND_UPDATE);
    }

}

MessageCenter.compile(UserBoss);

window["UserBoss"] = UserBoss