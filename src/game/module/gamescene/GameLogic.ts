/**主逻辑管理器 */
class GameLogic extends BaseSystem {

    /**刷怪半径 */
    MONSTER_RADIUS = 2;
    //刷怪格子范围
    MONSTER_LEN = this.MONSTER_RADIUS * 2 + 1;
    /** 个人数据 */
    actorModel = new ActorModel;
    //当前刷怪的索引..
    rPosindex = 0;

    heartBeatTimer: egret.Timer
    radiusMap: Array<any>;
    hookState: boolean;

    isInit = true;
    private effectsConfig: any;

    public constructor() {
        super();
        this.sysId = PackageID.Default;
        this.regNetMsg(S2cProtocol.enter_map, this.postEnterMap);
        this.regNetMsg(S2cProtocol.create_monster_entity, this.doCreateMonsterEntity);
        this.regNetMsg(S2cProtocol.create_role_entity, this.doCreateRoleEntity);
        this.regNetMsg(S2cProtocol.gold_change, this.doGoldChange);
        this.regNetMsg(S2cProtocol.exp_change, this.doExp);
        this.regNetMsg(S2cProtocol.sub_role_att_change, this.doSubRoleAtt);
        this.regNetMsg(S2cProtocol.blood_update, this.doBloodUpdata);
        this.regNetMsg(S2cProtocol.remove_entity, this.doRemoveEntity);
        this.regNetMsg(S2cProtocol.move_entity, this.doMoveEntity);
        this.regNetMsg(S2cProtocol.stop_move_entity, this.doStopMoveEntity);
        this.regNetMsg(S2cProtocol.sync_entity_pos, this.doSyncPos);
        this.regNetMsg(S2cProtocol.entity_mp_update, this.doMp);
        this.regNetMsg(S2cProtocol.show_server_tip, this.doTips);
        this.regNetMsg(S2cProtocol.first_register, this.doFirstRegister);
        // this.regNetMsg(20, this.doDieNotice);
        this.regNetMsg(S2cProtocol.actor_guild_change, this.doGuildChange);
        this.regNetMsg(S2cProtocol.sc_rename_result, this.doRename);
        this.regNetMsg(S2cProtocol.sc_shapeshift_send_shapeInfo, this.bianShenUpdate);
        this.regNetMsg(S2cProtocol.shape_update, this.shape_update_request);
        this.regNetMsg(S2cProtocol.attr_update, this.attr_update_request);
        this.regNetMsg(S2cProtocol.attr_update, this.attr_update_request);
        this.regNetMsg(S2cProtocol.sc_element_set_res, this.changeMainEle);
        this.regNetMsg(S2cProtocol.sc_actor_power, this.changePower);

        this.regNetMsg(S2cProtocol.create_pet_entity, this.doCreatePetEntity);

        Sproto.SprotoReceiver.AddHandler(S2cProtocol.scActorBase, this.doActorInfo, this)
        Sproto.SprotoReceiver.AddHandler(S2cProtocol.sub_roles, this.doSubRole, this)

        this.regNetMsg(S2cProtocol.sc_show_other_actor, this._DoShowOtherActor)
        this.regNetMsg(S2cProtocol.sc_currency_change, this.maxCurrencyChange)
        // if (DEBUG) {
        KeyboardUtils.ins().addKeyDown(this.QuickSendMsg, this);
        // if (ActorModel.IsGM()) {
        KeyboardUtils.ins().addKeyDown(this.TestKeyDown, this);
        KeyboardUtils.ins().addKeyUp(this.TestKeyUp, this);
        // }
        // }
        this.radiusMap = [];
        var len = this.MONSTER_RADIUS * 2 + 1;
        for (var i = 0; i < len; i++) {
            this.radiusMap[i] = [];
        }
    }

    public static ins(): GameLogic {
        return super.ins();
    };

    private changePower(rsp: Sproto.sc_actor_power_request) {
        GameLogic.ins().actorModel.power = rsp.power;
    }

    /**发送创建子角色 */
    public sendNewRole(job, sex) {
        var cs_create_new_sub_role = new Sproto.cs_create_new_sub_role_request();
        cs_create_new_sub_role.job = job;
        cs_create_new_sub_role.sex = sex;
        GameSocket.ins().Rpc(C2sProtocol.cs_create_new_sub_role, cs_create_new_sub_role);
        // var bytes = this.getBytes(2);
        // bytes.writeByte(job);
        // bytes.writeByte(sex);
        // this.sendToServer(bytes);
    };
    public sendHeartbeat() {
        if (this.heartBeatTimer)
            return;
        var f = function () {
            var bytes = this.getBytes();
            bytes.writeCmd(this.protoSysID, 255);
            this.sendToServer(bytes);
        };
        this.heartBeatTimer = new egret.Timer(1000 * 60);
        this.heartBeatTimer.addEventListener(egret.TimerEvent.TIMER, f, this);
        this.heartBeatTimer.start();
    };
    public static SendGM(str) {
        var cs_sene_gm_command = new Sproto.cs_sene_gm_command_request();
        cs_sene_gm_command.cmd = str;
        GameSocket.ins().Rpc(C2sProtocol.cs_sene_gm_command, cs_sene_gm_command);
    }
    public sendGMCommad(str) {
        GameLogic.SendGM(str)
    };

    private m_ShowOtherActor: { [key: number]: Sproto.sc_show_other_actor_request } = {}
    private m_ShowOtherCallback: { [key: number]: Function[] } = {}

    private _DoShowOtherActor(rsp: Sproto.sc_show_other_actor_request) {
        let actorId = rsp.actorData.actorid
        this.m_ShowOtherActor[actorId] = rsp
        let list = this.m_ShowOtherCallback[actorId]
        if (list) {
            for (let func of list) {
                func(rsp)
            }
            delete this.m_ShowOtherCallback[actorId]
        }
        GameGlobal.MessageCenter.dispatch(MessageDef.SHOW_OTHER_ACTOR, actorId)
    }

    public GetShowOtherActor(actorId: number): Sproto.sc_show_other_actor_request {
        let data = this.m_ShowOtherActor[actorId]
        // if (data) {
        //     delete this.m_ShowOtherActor[actorId]
        // }
        return data
    }

    public SendGetOtherActorInfo(actorId: number, callback: Function) {
        if (callback) {
            let list = this.m_ShowOtherCallback[actorId]
            if (!list) {
                list = this.m_ShowOtherCallback[actorId] = []
            }
            list.push(callback)
        }
        let req = new Sproto.cs_get_other_actor_info_request
        req.otherid = actorId
        this.Rpc(C2sProtocol.cs_get_other_actor_info, req)
    }

    /**
     * 处理个人信息
     * 0-1
     * @param bytes
     */
    public doActorInfo(data: Sproto.scActorBase_request) {
        GameLogic.ins().actorModel.parser(data);
        SubRoles.ins().resetRolesModel();
        Shop.ins().shopNorefrush = data.shopNorefrush
        this.postExpChange()
        if (this.isInit) {
            this.isInit = false
            this.postInitActorInfo()
        }
        if (Shop.ins().shopNorefrush && UserFb.ins().guanqiaID >= 11) {
            GameGlobal.MessageCenter.dispatch(MessageDef.SHOP_REFRESH, true)
        }
        if (StatisticsUtils.time1 == -1) {
            StatisticsUtils.time1 = 0;

        }
        SdkMgr.isLogin = true;
        SdkMgr.setExtData(SdkMgr.extDataType_1);
        if (SdkMgr.currSdk == SdkMgr.P_TYPE_8) {
            this.wanbaVipServer();
        }
        StatisticsUtils.setPhpLoading(3);
    };
    /** 请求玩吧的vip等级*/
    public wanbaVipServer(): void {
        // let req = new Sproto.cs_get_qzonewanba_vipprivilege_stat_request;
        // req.appid = h5_sdk.Sdk_8.appid;
        // req.openid = h5_sdk.Sdk_8.openid;
        // req.pf = h5_sdk.Sdk_8.pf;
        // req.zoneid = h5_sdk.Sdk_8.platform;
        // req.openkey = h5_sdk.Sdk_8.openkey;
        // egret.log(req);
        // GameSocket.ins().Rpc(C2sProtocol.cs_get_qzonewanba_vipprivilege_stat, req, (bytes: Sproto.cs_get_qzonewanba_vipprivilege_stat_response) => {
        // WanBaTequanPanel.data = bytes;
        // GameGlobal.MessageCenter.dispatch(MessageDef.WANBA_VIP_AWARD);
        // });
    }
    postInitActorInfo() { }
    /**
     * 子角色列表
     * 0-2
     * @param bytes
     */
    public doSubRole(data: Sproto.sub_roles_request) {
        SubRoles.ins().doSubRole(data);
        this.postSubRoleChange();

        GameGlobal.MessageCenter.dispatch(MessageDef.SUB_ROLE_CHANGE)
    };
    /**派发子角色变更 */
    public postSubRoleChange() {
    };
    /**
     * 进入场景
     * 0-3
     * @param bytes
     */
    public postEnterMap(rsp: Sproto.enter_map_request) {
        GameMap.parser(rsp);
        //更新格子数据，等待格子数据更新后在进入场景
        GameMap.update();
    };

    private doCreatePetEntity(rsp: Sproto.create_pet_entity_request) {
        var handler = rsp.handler
        let charMonster = EntityManager.ins().getEntityByHandle(handler)
        if (charMonster) {
            let monsterModel = charMonster.infoModel
            monsterModel.Parser(rsp.entityModelBase, rsp.attributeData);
            monsterModel.lv = rsp.lv;
            monsterModel.name = rsp.name;
            monsterModel.inRoleId = 0;
        }
        else {
            let monsterModel = new EntityModel;
            monsterModel.Parser(rsp.entityModelBase, rsp.attributeData);
            monsterModel.lv = rsp.lv;
            monsterModel.name = rsp.name;
            monsterModel.inRoleId = 0;
            this.createEntityByModel(monsterModel);
        }
    }
    /**
     * 处理创建场景实体
     * 0-4
     * @param bytes
     */
    private doCreateMonsterEntity(rsp: Sproto.create_monster_entity_request) {
        var entityType = rsp.entityType
        var handler = rsp.handler
        // console.log("doCreateMonsterEntity", handler)


        let charMonster = EntityManager.ins().getEntityByHandle(handler)
        if (charMonster) {
            let monsterModel = charMonster.infoModel
            charMonster.updateBlood();
            monsterModel.Parser(rsp.entityModelBase, rsp.attributeData);
            var topTwo = parseInt(monsterModel.configID.toString().substring(0, 2));
            if (topTwo == 21 || topTwo == 22 || topTwo == 23) {
                GameGlobal.MessageCenter.dispatch(MessageDef.ON_HOOK_BOOS, monsterModel);
            }
            if (TenKillModel.getInstance.raidType == RaidType.Type3 && monsterModel.monstersType == 1) {
                //更新十连杀boss
                GameGlobal.MessageCenter.dispatch(MessageDef.TENKILL_BOSS_INIT, monsterModel);
            }
            if (GameMap.IsMiJing() && monsterModel.monstersType == 1) {
                GameGlobal.MessageCenter.dispatch(MessageDef.MIJING_BOSSBLOOD_UPDATE, monsterModel);
            }

            if (monsterModel.monstersType == 1) {
                GameGlobal.MessageCenter.dispatch(MessageDef.UPDATE_BOSS_HP, monsterModel);
            }

            // console.log("configID:"+monsterModel.configID + " x:" + monsterModel.x + "  y:"+monsterModel.y);
        }
        else {
            let monsterModel = new EntityModel;
            monsterModel.Parser(rsp.entityModelBase, rsp.attributeData);
            //console.log("configID:" + monsterModel.configID + " x:" + monsterModel.x + "  y:" + monsterModel.y);
            this.createEntityByModel(monsterModel);

            var topTwo = parseInt(monsterModel.configID.toString().substring(0, 2));
            if (topTwo == 21 || topTwo == 22 || topTwo == 23) {
                GameGlobal.MessageCenter.dispatch(MessageDef.ON_HOOK_BOOS, monsterModel);
            }
            if (TenKillModel.getInstance.raidType == RaidType.Type3 && monsterModel.monstersType == 1) {
                //更新十连杀boss
                GameGlobal.MessageCenter.dispatch(MessageDef.TENKILL_BOSS_INIT, monsterModel);
            }
            if (GameMap.IsMiJing() && monsterModel.monstersType == 1) {
                GameGlobal.MessageCenter.dispatch(MessageDef.MIJING_BOSSBLOOD_UPDATE, monsterModel);
            }

            if (monsterModel.monstersType == 1) {
                GameGlobal.MessageCenter.dispatch(MessageDef.UPDATE_BOSS_HP, monsterModel);
            }



        }

    }


    private doCreateRoleEntity(rsp: Sproto.create_role_entity_request) {

        var entityType = rsp.entityType
        var handler = rsp.handler

        var roleModel = new Role;
        roleModel.parserBase(rsp.entityModelBase);
        roleModel.parserOtherRole(rsp);
        this.createEntityByModel(roleModel);
    }


    public maxCurrencyChange(rsp: Sproto.sc_currency_change_request) {
        var model = GameLogic.ins().actorModel;
        var type = rsp.type;
        if (type == MoneyConst.COUPON) {
            model.maxCoupon = rsp.value;
            this.postCouponChange();
        }
    }
    /**
     * 处理金钱变化
     * 0-5
     * @param bytes
     */
    public doGoldChange(rsp: Sproto.gold_change_request) {

        var model = GameLogic.ins().actorModel;
        var type = rsp.type;
        if (type == 1) {
            var oldGold = model.gold;
            var newGold = rsp.value;
            model.gold = newGold;
            if (newGold != oldGold) {
                this.postGoldChange();
                GameGlobal.MessageCenter.dispatch(MessageDef.GOLD_CHANGE)
            }
        } else if (type == 4) {
            var num = rsp.value;
            if (model.soul > 0) {
                var addSoul = num - model.soul;
                if (addSoul > 0) {
                    var str = "";
                    str = LanguageString.jifengTiaoyueCh(GlobalConfig.jifengTiaoyueLg.st101627, [addSoul]);
                    UserTips.ins().showTips(str);
                }
            }
            model.soul = num;
            this.postSoulChange();
        }
        else if (type == MoneyConst.PETCREDIT) {
            model.petCredit = rsp.value
            //this.postGoldChange()
        }
        else if (type == MoneyConst.RIDECREDIT) {
            model.rideCredit = rsp.value
            // this.postGoldChange()
        }
        else if (type == MoneyConst.CROSSCREDIT) {
            model.crossCredit = rsp.value
            // this.postGoldChange()
        }
        else if (type == MoneyConst.ARTIFACTCREDIT) {
            model.artifactCredit = rsp.value
            //this.postGoldChange()
        }
        else if (type == MoneyConst.FEATS) {
            model.feats = rsp.value
            this.postGoldChange()
        }
        else if (type == MoneyConst.HONOR) {
            var temp = model.honor - rsp.value;
            if (temp < 0)
                UserTips.ins().showTips(GlobalConfig.jifengTiaoyueLg.st101628);
            model.honor = rsp.value;
            this.postHonorChange();
        }
        else if (type == MoneyConst.ZHENQI) {
            model.zhenqi = rsp.value;
            this.postZhenQiChange();
        }
        else if (type == MoneyConst.sharecoin) {
            model.sharecoin = rsp.value;
        }
        else if (type == MoneyConst.VIPEXP) {
            str = LanguageString.jifengTiaoyueCh(GlobalConfig.jifengTiaoyueLg.st101629, [rsp.value]);
            UserTips.ins().showTips(str);
        }
        else if (type == MoneyConst.yuanbao) {
            var oldYb = model.yb;
            var newYb = rsp.value;
            model.yb = newYb;
            if (oldYb != newYb)
                this.postYbChange();
        } else if (type == MoneyConst.RedNameScore) {
            var oldRedName = model.redName;
            var newRedName = rsp.value;
            model.redName = newRedName;
            if (oldRedName != newRedName)
                this.postRedNameChange();
        } else if (type == MoneyConst.PRESTIGE) {
            var oldPRESTIGE = model.prestige;
            var newPRESTIGE = rsp.value;
            model.prestige = newPRESTIGE;
            if (oldPRESTIGE != newPRESTIGE) {
                GameGlobal.MessageCenter.dispatch(MessageDef.ACTOR_PRESTIGE_UPDATE)
            }
            // this.postPrestigeChange();
        } else if (type == MoneyConst.GuildContrib) {
            let value = rsp.value
            if (value > 0) {
                // let oldValue = Guild.ins().myCon
                // if (oldValue) {
                //     value = value - oldValue                    
                // }
                if (value > 0) {
                    UserTips.ins().showTips(GlobalConfig.jifengTiaoyueLg.st101630 + " +" + value)
                }
            }
        } else if (type == MoneyConst.GuildFund) {
            let value = rsp.value
            if (value > 0) {
                // let oldValue = Guild.ins().money
                // if (oldValue) {
                //     value = value - oldValue                    
                // }
                if (value > 0) {
                    UserTips.ins().showTips(GlobalConfig.jifengTiaoyueLg.st101631 + " +" + value)
                }
            }
        } else if (type == MoneyConst.COUPON) {
            model.coupon = rsp.value;
            this.postCouponChange();
        }
        else {
            console.log("GameLogic:doGoldChange type => " + type)
        }

    };
    public postSoulChange() {
    };
    public postGoldChange() {
    };
    public postHonorChange() {
    };
    public postZhenQiChange() {
    };
    public postYbChange() {
    };
    public postCouponChange() {
    };
    public postRedNameChange() {
    };
    // public postPrestigeChange() {
    // };
    /**
     * 处理经验变化
     * 0-7
     * @param bytes
     */
    public doExp(rsp: Sproto.exp_change_request) {
        var model = GameLogic.ins().actorModel;
        var lastLV = model.level;
        // var oldValue = model.level;
        var newValue = rsp.level;
        model.level = newValue;
        let oldValue = model.exp;
        newValue = rsp.exp;
        model.exp = newValue;
        if (oldValue != newValue)
            this.postExpChange();
        if (lastLV < model.level) {
            this.levelEffect();

            SdkMgr.setExtData(SdkMgr.extDataType_3);

        }
        if (rsp.upexp > 0) {
            UserTips.ins().showTips(LanguageString.jifengTiaoyueCh(GlobalConfig.jifengTiaoyueLg.st101632, [rsp.upexp]));
        }
    };
    public postLevelChange() {
    };
    public postExpChange() {
    };
    public postNameChange() {
    };
    /**
     * 处理属性变化
     * 0-8
     * @param bytes
     */
    public doSubRoleAtt(rsp: Sproto.sub_role_att_change_request) {
        // SubRoles.ins().doSubRole(bytes);
        SubRoles.ins().doSubRoleAtt(rsp);
    };
    public postPowerChange() {
    };
    /**
     * 处理血量更新
     * 0-9
     * @param bytes
     */
    public doBloodUpdata(rsp: Sproto.blood_update_request) {
        var handle = rsp.handle;
        var hp = rsp.hp;

        var target = EntityManager.ins().getEntityByHandle(handle);
        // if (GameMap.IsGuanQiaBoss() && target instanceof CharRole) {
        //     egret.log("handle：" + handle + " hp:" + hp);
        // }
        if (target) {
            var v = -rsp.dhp;
            // var v = -(hp - target.getHP());
            if (v) {
                if (target.team == Team.My) {
                    this.postEntityHpChange(target, null, rsp.showType || 0, v);
                }
            }
            var monsterID = target.infoModel.configID;

            if (monsterID && monsterID == UserBoss.ins().monsterID) {
                UserBoss.ins().hp = hp;
                if (hp <= 0) {
                    ViewManager.ins().close(BossBloodPanel);
                }
            }
        }
        // TimerManager.ins().doTimer(300, 1, () => {
        this.entityBloodUpData(handle, hp);
        GameGlobal.MessageCenter.dispatch(MessageDef.TENKILL_BLOOD_UPDATE);
        // },this);
    };
    /**派发实体血量变更 */
    public postEntityHpChange(target: CharMonster, source, type, value, hitCount: number = 1, data: any = [null, SkillType.TYPE1]) {//,hitCount?
        if (source && source.infoModel.type != EntityType.WillDummy) {
            if ((source && source.team == Team.My || target && target.team == Team.My)) {
                if (type == DamageTypes.CRIT) {
                    var sceneView = ViewManager.ins().getView(GameSceneView) as GameSceneView;
                    DisplayUtils.shakeIt(sceneView.map, 2, 150, 1)
                } else
                    if (data[1] == SkillType.TYPE3) {
                        var sceneView = ViewManager.ins().getView(GameSceneView) as GameSceneView;
                        DisplayUtils.shakeIt(sceneView.map, 3, 150, 3)
                    }
            }
        }
        if (type == DamageTypes.HEJI) {
            var sceneView = ViewManager.ins().getView(GameSceneView) as GameSceneView;
            DisplayUtils.shakeIt(sceneView.map, 8, 150, 15)
        }

        return [target, source, type, value, hitCount, data];
    };
    /**
     * 移除实体
     * 0-10
     * @param bytes
     */
    public doRemoveEntity(rsp: Sproto.remove_entity_request) {
        var handle = rsp.handle;
        // console.log("doRemoveEntity", handle)
        var entity = EntityManager.ins().getEntityByHandle(handle);
        if (entity && entity.infoModel) {
            entity.infoModel.setAtt(AttributeType.atHp, 0);
            if (entity.infoModel.monstersType == 1) {
                if (GameMap.IsChaosBttle()) {
                    ChaosBattleModel.getInstance.roleDic.remove(entity.handle)
                }
                GameGlobal.MessageCenter.dispatch(MessageDef.UPDATE_BOSS_HP, entity.infoModel);
            }
        }
        if (handle == UserBoss.ins().bossHandler) {
            if (ViewManager.ins().isShow(BossBloodPanel)) {
                ViewManager.ins().close(BossBloodPanel)
            }
        }
        if (!entity) {
            return
        }

        DropHelp.setTempDropPoint(Const.PixelToPos(entity.x), Const.PixelToPos(entity.y));
        this.dropMonsterFb(entity);
        // TimerManager.ins().doTimer(500, 1, () => {
        //     EntityManager.ins().removeByHandle(handle, false);
        // }, entity);
        var t = egret.setTimeout((obj) => {
            egret.clearTimeout(t);
            EntityManager.ins().removeByHandle(obj[0], false);
        }, this, 500, [handle]);

        GameGlobal.MessageCenter.dispatch(ChaosBattleEvt.CHAOSBATTLE_DATAUPDATE_ROLE);

        // EntityManager.ins().removeByHandle(handle);
    };

    private dropItemIdDic = new Dictionary<any>();
    private dropMonsterFb(entity: CharMonster) {/**副本里的虚拟掉落 */
        if (entity.team != Team.My && GameMap.fbType == UserFb.FB_TYPE_MATERIAL) {
            let itemData = this.dropItemIdDic.get(GameMap.fubenID)
            if (!itemData) {
                let config = GlobalConfig.ins("DailyFubenConfig");
                if (config) {
                    for (let key in config) {
                        if (config[key].fbId == GameMap.fubenID) {
                            let cofData = config[key].diplayItem;
                            itemData = { id: cofData.id, type: cofData.type, count: cofData.count };
                            this.dropItemIdDic.set(GameMap.fubenID, itemData);
                            break;
                        }
                    }
                }
            }
            if (!itemData) {
                return;
            }
            let dropsData = []
            let dropsx = Const.PixelToPos(entity.x);
            let dropsy = Const.PixelToPos(entity.y);
            dropsData.push(dropsx, dropsy, itemData);
            DropHelp.addDrop(dropsData, false);
        }
    }

    /**
     * 实体移动
     * 0-11
     * @param bytes
     */
    public doMoveEntity(rsp: Sproto.move_entity_request) {
        var handle = rsp.handle;
        var endx = rsp.endX;
        var endy = rsp.endY;
        var target = EntityManager.ins().getEntityByHandle(handle);
        if (target) {
            GameMap.moveEntity(target, endx, endy, true); //是否直线行走，无视障碍物
        }
    };
    /**
     * 停止实体移动
     * 0-12
     * @param bytes
     */
    public doStopMoveEntity(rsp: Sproto.stop_move_entity_request) {
        var handle = rsp.handle;
        var target = EntityManager.ins().getEntityByHandle(handle);
        if (target) {
            // target.stopMove();
            // target.playAction(EntityAction.STAND);
            // egret.log("当前坐标x" + target.x + "当前坐标y" + target.y + "----------" + "收到停止移动x" + rsp.endX + "收到停止移动y" + rsp.endY);

            // target.x = rsp.endX;
            // target.y = rsp.endY;
            GameMap.moveEntity(target, rsp.endX, rsp.endY, true);
        }
    };
    /**
     * 同步实体坐标
     * 0-13
     * @param bytes
     */
    public doSyncPos(rsp: Sproto.sync_entity_pos_request) {
        // var _this = this;
        var handle = rsp.handle;
        var target = EntityManager.ins().getEntityByHandle(handle);
        if (target) {
            var type = rsp.type;
            target.stopMove();
            // 0 瞬移
            // 1 野蛮冲撞
            // 2 被击退
            var t: egret.Tween = void 0;
            switch (type) {
                case 0:
                    target.playAction(EntityAction.STAND);
                    // egret.log((<CharRole>target).infoModel.job + "target.x="+target.x + "target.y"+target.y + "rsp.x="+rsp.x + "rsp.y="+rsp.y)
                    target.x = rsp.x;
                    target.y = rsp.y;
                    this.postMoveCamera();
                    break;
                case 1:
                    target.playAction(EntityAction.RUN);
                    egret.Tween.removeTweens(target);
                    t = egret.Tween.get(target, {
                        "onChange": () => {
                            this.postMoveCamera();
                        }
                    });
                    t.to({
                        "x": rsp.x,
                        "y": rsp.y
                    }, rsp.arg1).call(function () {
                        egret.Tween.removeTweens(target);
                        target.playAction(EntityAction.STAND);
                    });
                    break;
                case 2:
                    target.playAction(EntityAction.STAND);
                    egret.Tween.removeTweens(target);
                    t = egret.Tween.get(target, {
                        "onChange": () => {
                            this.postMoveCamera();
                        }
                    });
                    t.to({
                        "x": rsp.x,
                        "y": rsp.y
                    }, rsp.arg1).call(() => {
                        egret.Tween.removeTweens(target)
                    });
                    break;
            }
        }
    };
    /**派发同步实体坐标消息 */
    public postMoveCamera() {

    };
    /**
     * 请求服务器时间
     * 0-14
     */
    public sendSyncServerTime() {
        var bytes = this.getBytes(14);
        this.sendToServer(bytes);
    };
    /**
     * 处理MP
     *
     * 0-15
     * @param bytes
     */
    public doMp(bytes: Sproto.entity_mp_update_request) {
        var handle = bytes.handle;
        var target = EntityManager.ins().getEntityByHandle(handle);
        /**因为mp包含小数所以后端*100发过来要/100 */
        var mp = bytes.mp / 100;
        if (target) {
            target.infoModel.setAtt(AttributeType.atMp, mp);
            //是自己的子角色
            if (target.infoModel.masterHandle == GameLogic.ins().actorModel.handle)
                this.postMpChange();
            var b = bytes.playEff;
            if (b)
                target.addEffect(2);
        }
    };
    /**法力值(护身值)改变 */
    public postMpChange() {
    };
    /**
     * 显示服务器提示
     * 0-17
     * @param bytes
     */
    public doTips(bytes: Sproto.show_server_tip_request) {
        var strTips = GlobalConfig.ins("ServerTips")[bytes.type].tips;
        UserTips.ins().showTips(strTips);
    };
    /**
     * 第一次登陆
     * 0-18
     */
    public doFirstRegister(bytes) {
        // console.warn("--------------------------    public doFirstRegister(bytes) ")
        GuideLocalStorage.reset();
        ViewManager.ins().open(WelcomeWin);
    };
    /**
     * 处理玩家死亡提示
     * 0-20
     */
    public doDieNotice(bytes) {
        //在转生boss里面死亡提示
        // if (ZsBoss.ins().isZsBossFb(GameMap.fubenID)) {
        //     UserTips.ins().showTips("你被BOSS击败，请等待复活");
        // }
    };
    /**
     * 处理玩家公会变化
     * 0-21
     */
    public doGuildChange(bytes: Sproto.actor_guild_change_request) {
        GameLogic.ins().actorModel.setGuild(bytes.guildID, bytes.guildName);
    };
    //更新属性 0-24
    public doGuildFbBossBlood(bytes) {
    };
    /**
     * 请求改名
     * 0-22
     */
    public sendRename(name) {
        var cs_change_actor_name = new Sproto.cs_change_actor_name_request();
        cs_change_actor_name.name = name;
        GameSocket.ins().Rpc(C2sProtocol.cs_change_actor_name, cs_change_actor_name);
        // var bytes = this.getBytes(22);
        // bytes.writeString(name);
        // this.sendToServer(bytes);
    };
    /**
     * 改名结果
     * 0-22
     */
    public doRename(bytes: Sproto.sc_rename_result_request) {
        var result = bytes.result;
        if (result == 0) {
            GameSocket.ins().close();
            // ViewManager.ins().close(RenameWin);
            alert(GlobalConfig.jifengTiaoyueLg.st101633);
            SdkMgr.setExtData(SdkMgr.extDataType_4);
            location.reload();
        }
        else {
            RoleMgr.ins().showErrorTips(result);
        }
    };

    /** 通知变身*/
    public bianShenUpdate(byt: Sproto.sc_shapeshift_send_shapeInfo_request): void {
        var o = <CharRole>EntityManager.ins().getEntityByHandle(GameGlobal.rolesModel[byt.roleid].handle);
        if (o instanceof CharRole) {
            if (byt.relute == 1)//#1变身 2不变身
            {
                o.infoModel.bianShen = byt.shapeid;
            }
            else {
                o.infoModel.bianShen = 0;
            }
            o.updateModel();
        }
    }
    /** 变身广播*/
    public shape_update_request(byt: Sproto.shape_update_request): void {
        var o = <CharRole>EntityManager.ins().getEntityByHandle(byt.handle);
        //  UserTips.ErrorTip("收到变身广"+byt.shapeid);
        if (o) {
            o.infoModel.bianShen = byt.shapeid;//#shapeid大于0变身，否则不变身
            o.updateModel();
        }
    }

    public attr_update_request(byt: Sproto.attr_update_request): void {
        var monster: CharMonster = EntityManager.ins().getEntityByHandle(byt.handle);
        if (monster)
            monster.infoModel.setAtt(byt.atrrid, byt.atrr);
        // egret.log("type"+byt.atrrid + "value"+byt.atrr)
    }

    public showEseBtn(b) {
        if (this.gamescene) this.gamescene.escBtn.visible = b;
    };

    public QuickSendMsg(keyCode: number) {
        if (keyCode == Keyboard.ESC) {
            MiniChatPanel.CancelSend()
        }
        if (keyCode == Keyboard.ENTER) {
            if (MiniChatPanel.CheckSend()) {
                return
            }
        }
    }

    static IS_CTRL_KEY = false;

    public TestKeyUp(keyCode: number) {
        if (keyCode == Keyboard.CTRL) {
            GameLogic.IS_CTRL_KEY = false
        }
    }

    public TestKeyDown(keyCode: number) {
        if (keyCode == Keyboard.CTRL) {
            GameLogic.IS_CTRL_KEY = true
        }
        if (keyCode == Keyboard.BRACE_R) {
        }
        if (keyCode == Keyboard.BRACE_L) {
        }
        if (keyCode == Keyboard.BACKSLASH) {
        }
        if (keyCode == Keyboard.I) {
            // this.gamescene.input.visible = !this.gamescene.input.visible;
        }
        if (keyCode == Keyboard.O) {
        }
        if (keyCode == Keyboard.P) {
        }
        if (Main.isDebug) {
            if (GameLogic.IS_CTRL_KEY) {
                if (keyCode == Keyboard.BRACE_R)
                    this.gamescene.input.visible = !this.gamescene.input.visible;
                else if (keyCode == Keyboard.BRACE_L) {
                    newAI.ins().togglePause();
                }
            }
            if (ActorModel.IsGM() && GameLogic.IS_CTRL_KEY) {
                try {

                    if (keyCode == Keyboard.ENTER) {
                        if (this.gamescene && this.gamescene.input.visible) {
                            this.sendGMCommad(this.gamescene.input.text);
                        }
                    }
                } catch (e) {

                }
            }
        };
    }
    /** 播放升级特效 */
    public levelEffect() {
        var char = EntityManager.ins().getNoDieRole();
        if (char) {
            var mc = new MovieClip;
            mc.y = -100;
            // mc.loadFile("eff_levelup", true, 1);
            mc.loadUrl(ResDataPath.GetUIEffePath("eff_levelup"), true, 1, () => {
                DisplayUtils.dispose(mc);
                mc = null;
            });
            char.addChild(mc);
        }
    };
    /** 开始挑战boss */
    public startPkBoss() {
        // this.clearMap();
        UserFb.ins().bossIsChallenged = true;
        //发送挑战请求道服务器
        // this.guanqia.sendPKBoss();
        UserFb.ins().sendPKBoss();
    };
    /**
     * 创建实体（依赖数据结构）
     */
    public createEntityByModel(model: EntityModel, ...param: any[]) {
        // console.log(model.name);

        var target = EntityManager.ins().createEntity(model, param);
        if (target && this.gamescene && this.gamescene.map) {
            // egret.log("创建模型：name="+model.name + "  id="+model.index);
            this.gamescene.map.addEntity(target);
        }


        if (model.team != Team.My) {
            if (GameMap.IsNoramlLevel() == false) {
                EntityManager.ins().hideOtherEntity(ZsBoss.ins().clearOther);
            }
        }
        else {
            if (GameMap.IsPublicBoss() || GameMap.IsHomeBoss() || GameMap.IsSyBoss() || GameMap.IsTenKill()
                || GameMap.IsMiJing() || GameMap.IsZhuanshengBoss() || GameMap.IsGuildBoss() || GameMap.IsGuildWar()
                || GameMap.IsKfBoss() || GameMap.IsWorldBoss() || GameMap.IsXbBoss()
                || GameMap.IsHeroBattle() || GameMap.IsGuanQiaBoss() || GameMap.IsTeamFb() || GameMap.IsPersonalBoss()
                || GameMap.IsCityBoss() || GameMap.IsChaosBttle()) {
                ViewManager.ins().hideUIView(UIView1_1, false);
                GameGlobal.MessageCenter.dispatch(MessageDef.ON_HOOK_ROLE_UPDATE);
            }
            else {
                ViewManager.ins().hideUIView(UIView1_1, true);
            }
            if (GameMap.IsMiJing()) {
                GameGlobal.MessageCenter.dispatch(MessageDef.MJBT_UPDATE_ROLE);
            }
        }

        return target
    };
    public addEntity(entity) {
        if (this.gamescene == null || this.gamescene.map == null)
            return;

        // if(entity instanceof )
        this.gamescene.map.addEntity(entity);
    }

    public PlayDummySkillEff(target: CharMonster, effName: string) {
        if (this.gamescene == null || this.gamescene.map == null)
            return;
        let mc2: MovieClip = ObjectPool.ins().pop("MovieClip");
        // mc2.rotation = 0
        // mc2.scaleX = mc2.scaleY = 1

        let p2 = target.localToGlobal()
        this.gamescene.map.globalToLocal(p2.x, p2.y, p2)
        mc2.loadUrl(ResDataPath.GetSkillPathByID(effName), true, 1, () => {
            DisplayUtils.dispose(mc2);
            let isPush = ObjectPool.ins().push(mc2);
            if (!isPush) {
                mc2 = null;
            }
        });

        mc2.x = p2.x
        mc2.y = p2.y

        this.gamescene.map.addEntity(mc2);
    }
    private addOneModels: Array<string> = [egret.BlendMode.NORMAL, egret.BlendMode.NORMAL, egret.BlendMode.ADD, egret.BlendMode.ERASE];



    /**
      * 更改结束坐标
      * @param startP 开始坐标
      * @param endP 结束坐标
      * @param hypotenuse 延长长度
      */
    private changePoint(startP: egret.Point, endP: egret.Point, hypotenuse: number): void {
        let absX: number = Math.abs(endP.x - startP.x);
        let absY: number = Math.abs(endP.y - startP.y);
        let tanV: number = Math.atan2(absY, absX);
        let sinV: number = Math.sin(tanV);
        let cosV: number = Math.cos(tanV);
        let addY: number = sinV * hypotenuse;
        let addX: number = cosV * hypotenuse;
        if (endP.x > startP.x) {
            endP.x += addX;
        } else if (endP.x < startP.x) {
            endP.x -= addX;
        }
        if (endP.y > startP.y) {
            endP.y += addY;
        } else if (endP.y < startP.y) {
            endP.y -= addY;
        }
    }

    public static SKILL_EFF_SCALE: number = 1.0;
    private skillEff: SkillEff;
    private skillScale: number;
    /**
     * 播放技能特效
     * @param skill 技能配置
     * @param self 技能释放者
     * @param targrt 技能目标者
     */
    public playSkillEff(skill, self: CharMonster, target, parent?: egret.DisplayObjectContainer) {
        if (self == null || self.parent == null) {
            return 0;
        }
        if (skill == null)
            return 0;
        if (self != target) { //计算方向
            self.dir = DirUtil.get4DirBy2Point(self, target);
        }
        if (skill.icon && self.team == Team.My) {
            let sound = GlobalConfig.soundConfig[skill.icon];
            let flg = SoundSetPanel.getSoundLocalData("skillSoundEff");
            let zhucheng = ViewManager.ins().isShow(MainCityView);
            if (sound && flg && !zhucheng) {
                // SoundManager.ins().playEffect(sound.soundResource + "_mp3");
                SoundUtils.getInstance().playSound(sound.id);
            }

        }

        self.playAction(skill.actionType);
        if (skill.effType == undefined)
            return 0;
        if (skill.effectId == 0 || skill.effectId == NaN) {
            return 0;
        }
        var p;
        var jd;
        if (!this.skillScale) {
            if (SdkMgr.isWxGame()) {
                this.skillScale = GlobalConfig.ins("UniversalConfig").skillRatewx;
            } else {
                this.skillScale = GlobalConfig.ins("UniversalConfig").skillRate;
            }
        }
        let bodySelectX = self._body.scaleX * this.skillScale;
        let bodySelectY = self._body.scaleY * this.skillScale;
        if (skill.id == UserSkill.POWER_SKILL) {
            if (self.team == Team.My) {
                if (!this.skillEff) {
                    this.skillEff = new SkillEff();
                    LayerManager.Game_Main.addChildAt(this.skillEff, -1);
                }
                this.skillEff.playEff(skill.effectId);
                for (let role of EntityManager.ins().GetRoles()) {
                    this.PlayDummySkillEff(role, skill.effectId2)
                }
                return;
            }
        }
        let mc: MovieClip = ObjectPool.ins().pop("MovieClip");
        mc.scaleX = bodySelectX;
        mc.scaleY = bodySelectY;
        // mc.rotation = 0;
        // mc.scaleX = mc.scaleY = 1;
        // var addOneObj = GlobalConfig.hasEffAddSkill(skill.effectId);
        // if (addOneObj)
        //     mc.blendMode = this.addOneModels[addOneObj.value];
        // else
        //     mc.blendMode = this.addOneModels[0];
        switch (skill.effType) {
            case EffectType.Targer:
                p = target.localToGlobal();
                if (this.gamescene == null || this.gamescene.map == null)
                    break;

                if (skill.effectId == 9999) {//9999比较特殊，不用播放特效的，拦截即可
                    if (mc.parent) mc.parent.removeChild(mc);
                    let isPush = ObjectPool.ins().push(mc);
                    if (!isPush) {
                        mc = null;
                    }
                }
                else {
                    this.gamescene.map.globalToLocal(p.x, p.y, p);
                    // mc.loadUrl(ResDataPath.GetSkillPathByID(skill.effectId), true, 1, (obj) => {
                    //     DisplayUtils.dispose(obj);
                    //     let isPush = ObjectPool.ins().push(obj);
                    //     if (!isPush) {
                    //         obj = null;
                    //     }
                    // });
                    // mc.x = p.x;
                    // mc.y = p.y;
                    // mc.scaleX = bodySelectX;
                    // mc.scaleY = bodySelectY;
                    let isCanPlay = this.setSkillEff(mc, skill.effectId, p.x, p.y, bodySelectX, bodySelectY);
                    if (isCanPlay) {
                        if (parent) {
                            mc.x = 0;
                            mc.y = 0
                            parent.addChild(mc)
                        } else {
                            this.gamescene.map.addEntity(mc);
                        }
                    }
                }

                if (skill.effectId2) {
                    // 如果是合击技能
                    if (skill.id == UserSkill.POWER_SKILL) {
                        if (self.team == Team.My) {
                            for (let role of EntityManager.ins().GetRoles()) {
                                this.PlayDummySkillEff(role, skill.effectId2)
                            }
                        }
                    } else {
                        this.PlayDummySkillEff(target, skill.effectId2)
                    }
                }
                break;
            case EffectType.Self:
                var fileName = skill.effectId + (skill.isDir == 1 ? "_" + DirUtil.get2Dir(self.dir) : "");
                p = self.localToGlobal();
                this.gamescene.map.globalToLocal(p.x, p.y, p);
                // mc.loadUrl(ResDataPath.GetSkillPathByID(fileName), true, 1, (obj) => {
                //     DisplayUtils.dispose(obj);
                //     let isPush = ObjectPool.ins().push(obj);
                //     if (!isPush) {
                //         obj = null;
                //     }
                // });
                // mc.x = p.x;
                // mc.y = p.y;
                // mc.scaleX = bodySelectX;
                // mc.scaleY = bodySelectY;
                //特效2方向原来的判断上下特效没区分左右会有bug 改了要跟着人的朝向
                // mc.scaleX = self.dir > 4 ? -2 : 2;
                let isCanPlay = this.setSkillEff(mc, fileName, p.x, p.y, bodySelectX, bodySelectY);
                if (isCanPlay) {
                    if (this.gamescene == null || this.gamescene.map == null)
                        break;
                    if (parent) {
                        mc.x = 0;
                        mc.y = 0;
                        parent.addChild(mc);
                    } else {
                        if (skill.id == 232001) {
                            this.gamescene.map.addEntity(mc, 0);
                        } else {
                            this.gamescene.map.addEntity(mc);
                        }
                    }
                }
                break;
            case EffectType.Ballistic:
                var fileName = skill.effectId + (skill.isDir == 1 ? "_" + DirUtil.get2Dir(self.dir) : "");
                mc.loadUrl(ResDataPath.GetSkillPathByID(fileName), true)
                p = self.localToGlobal();

                if (this.gamescene == null || this.gamescene.map == null)
                    break;
                this.gamescene.map.globalToLocal(p.x, p.y, p);
                let p1 = p;
                mc.x = p.x;
                mc.y = p.y - 50;
                mc.scaleX = bodySelectX;
                mc.scaleY = bodySelectY;
                jd = MathUtils.getAngle(MathUtils.getRadian2(self.x, self.y, target.x, target.y));
                if (skill.isDir == 0) {
                    mc.rotation = jd + 90;
                }
                else {
                    //特效2方向原来的判断上下特效没区分左右会有bug 改了要跟着人的朝向
                    // mc.scaleX = self.dir > 4 ? -2 : 2;
                    mc.scaleX = bodySelectX;
                    mc.scaleY = bodySelectY;
                }
                TimerManager.ins().doTimer(200, 1, () => {
                    if (this.gamescene == null || this.gamescene.map == null)
                        return;
                    if (this.gamescene.map) {
                        if (parent) {
                            mc.x = mc.y = 0
                            parent.addChild(mc);
                        } else {
                            this.gamescene.map.addChild(mc);
                        }
                    }
                }, this);
                p = target.localToGlobal();
                this.gamescene.map.globalToLocal(p.x, p.y, p);
                this.changePoint(p1, p, 200);
                var t = egret.Tween.get(mc);
                t.wait(100).to({ "x": p.x, "y": p.y - 30 }, 400).call((obj) => {
                    egret.Tween.removeTweens(obj);
                    DisplayUtils.dispose(obj);
                    let isPush = ObjectPool.ins().push(obj);
                    if (!isPush) {
                        obj = null;
                    }

                }, this, [mc]);
                if (skill.effectId2) {
                    var idx: number = egret.setTimeout(() => {
                        egret.clearTimeout(idx);
                        p = target.localToGlobal();
                        this.gamescene.map.globalToLocal(p.x, p.y, p);
                        var mc1 = ObjectPool.ins().pop("MovieClip");
                        // mc1.loadUrl(ResDataPath.GetSkillPathByID(skill.effectId2), true, 1, (obj) => {
                        //     DisplayUtils.dispose(obj);
                        //     let isPush = ObjectPool.ins().push(obj);
                        //     if (!isPush) {
                        //         obj = null;
                        //     }
                        // });
                        // mc1.x = p.x;
                        // mc1.y = p.y;
                        // mc1.scaleX = bodySelectX;
                        // mc1.scaleY = bodySelectY;
                        let isCanPlay = this.setSkillEff(mc1, skill.effectId2, p.x, p.y, bodySelectX, bodySelectY);
                        if (isCanPlay) {
                            if (this.gamescene.map) {
                                if (parent) {
                                    mc1.x = mc1.y = 0
                                    parent.addChild(mc1);
                                } else {
                                    this.gamescene.map.addChild(mc1);
                                }
                            }
                        }
                    }, this, 150)
                }
                break;
            case EffectType.AnyAngle: {
                jd = MathUtils.getAngle(MathUtils.getRadian2(self.x, self.y, target.x, target.y));
                mc.rotation = jd + 90;
                // mc.loadUrl(ResDataPath.GetSkillPathByID(skill.effectId), true, 1, (obj) => {
                //     DisplayUtils.dispose(obj);
                //     let isPush = ObjectPool.ins().push(obj);
                //     if (!isPush) {
                //         obj = null;
                //     }
                // })
                // mc.x = 0;
                // mc.y = -45;
                // mc.scaleX = bodySelectX;
                // mc.scaleY = bodySelectY;
                let isCanPlay = this.setSkillEff(mc, skill.effectId, 0, -45, bodySelectX, bodySelectY);
                if (isCanPlay) {
                    if (self.parent) self.addChild(mc);
                }
                return 700;
            }
            case EffectType.Sustain:
                // mc.loadFile("skill" + skill.effectId, true);
                mc.loadUrl(ResDataPath.GetSkillPathByID(skill.effectId), true)
                if (this.effectsConfig == null)
                    this.effectsConfig = GlobalConfig.ins("EffectsConfig");
                var skillEff = this.effectsConfig[skill.tarEff[0]];
                var oldMc = self.getChildByName(skillEff.group + "");
                if (oldMc)
                    DisplayUtils.dispose(oldMc);//DisplayUtils.removeFromParent(oldMc);
                mc.name = skillEff.group + "";
                var t1 = egret.Tween.get(mc);
                t1.wait(skillEff.duration).call((obj) => {
                    egret.Tween.removeTweens(obj);
                    DisplayUtils.dispose(obj);
                    let isPush = ObjectPool.ins().push(obj);
                    if (!isPush) {
                        obj = null;
                    }
                }, this, [mc]);
                mc.scaleX = bodySelectX;
                mc.scaleY = bodySelectY;
                if (self.parent) self.addChild(mc);
                break;
            case EffectType.Zidan: {

                var selfDir: number = self.dir;
                var fileName = skill.effectId + (skill.isDir == 1 ? "_" + DirUtil.get2Dir(selfDir) : "");
                p = self.localToGlobal();
                this.gamescene.map.globalToLocal(p.x, p.y, p);
                // mc.loadUrl(ResDataPath.GetSkillPathByID(fileName), true, 1, (obj) => {
                //     DisplayUtils.dispose(obj);
                //     let isPush = ObjectPool.ins().push(obj);
                //     if (!isPush) {
                //         obj = null;
                //     }
                // });
                // mc.x = p.x;
                // mc.y = p.y;
                // mc.scaleX = bodySelectX;
                // mc.scaleY = bodySelectY;
                //特效2方向原来的判断上下特效没区分左右会有bug 改了要跟着人的朝向
                // mc.scaleX = self.dir > 4 ? -2 : 2;
                let isCanPlay = this.setSkillEff(mc, fileName, p.x, p.y, bodySelectX, bodySelectY);
                if (isCanPlay) {
                    if (this.gamescene == null || this.gamescene.map == null)
                        break;
                    if (parent) {
                        mc.x = 0;
                        mc.y = 0
                        parent.addChild(mc);
                    } else {
                        this.gamescene.map.addEntity(mc);
                    }
                    if (self.buffList[Const.zidanBuff]) {
                        var time: number = self.buffList[Const.zidanBuff].effConfig.args.t;
                        egret.setTimeout(() => {
                            if (skill.effectId2) {
                                fileName = skill.effectId2 + (skill.isDir == 1 ? "_" + DirUtil.get2Dir(selfDir) : "");
                                var mc3 = ObjectPool.ins().pop("MovieClip");
                                // mc3.loadUrl(ResDataPath.GetSkillPathByID(fileName), true, 1, (obj) => {
                                //     DisplayUtils.dispose(obj);
                                //     let isPush = ObjectPool.ins().push(obj);
                                //     if (!isPush) {
                                //         obj = null;
                                //     }
                                // });
                                // mc3.x = p.x;
                                // mc3.y = p.y;
                                // mc3.scaleX = bodySelectX;
                                // mc3.scaleY = bodySelectY;
                                // mc3.scaleX = selfDir > 4 ? -2 : 2;
                                this.setSkillEff(mc3, fileName, p.x, p.y, bodySelectX, bodySelectY)

                                if (self.parent) self.parent.addChildAt(mc3, self.parent.getChildIndex(self) - 1);
                            }
                        }, this, time);
                    }
                    break;
                }
            }
            case EffectType.FashiBall: {
                // egret.log(111);
                var skillId: Array<any> = skill.effectId2.split(",");
                p = target.localToGlobal();
                this.gamescene.map.globalToLocal(p.x, p.y, p);
                // mc.loadUrl(ResDataPath.GetSkillPathByID(skillId[0]), true, 1, (obj) => {
                //     DisplayUtils.dispose(obj);
                //     let isPush = ObjectPool.ins().push(obj);
                //     if (!isPush) {
                //         obj = null;
                //     }
                // })
                // mc.x = p.x;
                // mc.y = p.y;
                // mc.scaleX = bodySelectX;
                // mc.scaleY = bodySelectY;
                let isCanPlay = this.setSkillEff(mc, skillId[0], p.x, p.y, bodySelectX, bodySelectY);
                if (isCanPlay) {
                    if (this.gamescene == null || this.gamescene.map == null)
                        break;
                    if (target.parent) target.parent.addChildAt(mc, target.parent.getChildIndex(target) - 1);

                    var mc1 = ObjectPool.ins().pop("MovieClip");
                    mc1.loadUrl(ResDataPath.GetSkillPathByID(skill.effectId), true);
                    var num: number = parseInt(MathUtils.limit(0, 2));
                    mc1.rotation = num == 0 ? MathUtils.limit(-40, -20) : MathUtils.limit(20, 40);//随机-30和30的角度
                    var _x: number = mc1.rotation * 10;//(mc1.rotation < 0 ? MathUtils.limit(-400, -200) : MathUtils.limit(200, 400));

                    mc1.x = p.x + _x;
                    mc1.y = p.y - 500;
                    mc1.scaleX = bodySelectX;
                    mc1.scaleY = bodySelectY;
                    if (target.parent) target.parent.addChild(mc1);
                    var t = egret.Tween.get(mc1);
                    t.to({ "x": p.x, "y": p.y }, 400).call((obj) => {
                        egret.Tween.removeTweens(obj);
                        DisplayUtils.dispose(obj);
                        let isPush = ObjectPool.ins().push(obj);
                        if (!isPush) {
                            obj = null;
                        }
                        var mc2 = ObjectPool.ins().pop("MovieClip");
                        // mc2.loadUrl(ResDataPath.GetSkillPathByID(skillId[1]), true, 1, (obj2) => {
                        //     DisplayUtils.dispose(obj2);
                        //     let isPush = ObjectPool.ins().push(obj2);
                        //     if (!isPush) {
                        //         obj2 = null;
                        //     }
                        // });
                        // mc2.x = p.x;
                        // mc2.y = p.y;
                        // mc2.scaleX = bodySelectX;
                        // mc2.scaleY = bodySelectY;
                        let isCanPlay = this.setSkillEff(mc2, skillId[1], p.x, p.y, bodySelectX, bodySelectY);
                        if (isCanPlay) {
                            if (target.parent) target.parent.addChild(mc2);
                        }
                    }, this, [mc1]);
                }
                break;
            }
        }
        return 300;
    };
    private skillEffDic: Dictionary<{ isCanPlay: boolean, time: number }> = new Dictionary<{ isCanPlay: boolean, time: number }>();
    private setSkillEff(mc, str, x, y, scaleX, scaleY) {
        let data: { isCanPlay: boolean, time: number } = this.skillEffDic.get(str);
        if (!data) {
            let skillData = { isCanPlay: false, time: egret.getTimer() }
            this.skillEffDic.set(str, skillData)
            this.playEffMc(mc, str, x, y, scaleX, scaleY)
            return true;
        } else {
            if (data.isCanPlay || (egret.getTimer() - data.time) >= 10000) {
                data.time = egret.getTimer();
                this.playEffMc(mc, str, x, y, scaleX, scaleY)
                return true;
            }
        }
        DisplayUtils.dispose(mc);
        let isPush = ObjectPool.ins().push(mc);
        if (!isPush) {
            mc = null;
        }
        return false;
    }

    private playEffMc(mc: MovieClip, str, x, y, scaleX, scaleY) {
        mc.loadUrl(ResDataPath.GetSkillPathByID(str), true, 1, (obj) => {
            DisplayUtils.dispose(obj);
            let isPush = ObjectPool.ins().push(obj);
            if (!isPush) {
                obj = null;
            }
            try {
                let data = this.skillEffDic.get(str);
                data.isCanPlay = true;
            } catch (e) {
                egret.log("技能记录报错了str：" + str);
            }
        }, 3000);
        mc.x = x;
        mc.y = y;
        mc.scaleX = scaleX
        mc.scaleY = scaleY
        return mc;
    }
    /** 切换场景 */
    public enterMap() {
        newAI.ins().stop();
        newAI.ins().ChangeMap()
        //移除所有实体
        EntityManager.ins().removeAll();
        //移除全体人员移动的监听
        TimerManager.ins().removeAll(GameMap);
        //清空掉落物
        DropHelp.clearDrop();
        //清空飘血
        if (this.gamescene && this.gamescene.map) {
            this.gamescene.map.clearBloodLayer();
            //切换场景
            this.gamescene.map.changeMap();
        }

        if (GameMap.IsNoramlLevel()) {
            //重新创建pk战玩家
            // for (var i = 0; i < Encounter.ins().encounterModel.length; i++) {
            //     if (Encounter.ins().getEncounterModel(i))
            //         this.createEntityByModel(Encounter.ins().getEncounterModel(i));
            // }
            let encounterModel = Encounter.ins().encounterModel
            for (let dbid in encounterModel) {
                let data = encounterModel[dbid]
                if (data) {
                    this.createEntityByModel(data as any);
                }
            }
            //重新显示野外boss
            if (Encounter.ins().zyKeyId > 0) {
                Encounter.ins().createBoss();
                // PlayFun.ins().upDataWillBoss();
            }
        }

        let view = ViewManager.ins().getView(BossBloodPanel) as BossBloodPanel
        if (view) {
            view.ClearData()
        }
        let view2 = <UIView2>ViewManager.ins().getView(UIView2)

        //关闭boss血条面板
        ViewManager.ins().close(BossBloodPanel);

        if (GameMap.IsPublicBoss() || GameMap.IsHomeBoss() || GameMap.IsSyBoss() || GameMap.IsTenKill()
            || GameMap.IsMiJing() || GameMap.IsZhuanshengBoss() || GameMap.IsGuildBoss() || GameMap.IsGuildWar()
            || GameMap.IsKfBoss() || GameMap.IsWorldBoss() || GameMap.IsXbBoss()
            || GameMap.IsHeroBattle() || GameMap.IsGuanQiaBoss() || GameMap.IsTeamFb() || GameMap.IsMaterialFb()
            || GameMap.IsPersonalBoss() || GameMap.IsCityBoss() || GameMap.IsChaosBttle()) {
            // ViewManager.ins().hideUIView(UIView1_1, false);
            ViewManager.ins().close(UIView1_1);
            if (view2 && view2.isShow) {
                if (!GameMap.IsGuanQiaBoss()) {
                    view2.showSelectView(UIView2.NAV_BATTLE)
                }
                ViewManager.ins().close(PlayFunView);
            }
        }
        else {
            // ViewManager.ins().hideUIView(UIView1_1, true);
            ViewManager.ins().open(UIView1_1);
            if (view2 && view2.isShow) {
                if (!GameMap.IsNoramlLevel()) {
                    view2.showSelectView(UIView2.NAV_BATTLE)
                }
                ViewManager.ins().open(PlayFunView);
            }
        }
        if (GameMap.IsHeroBattle() || GameMap.IsGuanQiaBoss() || GameMap.IsTeamFb() || GameMap.IsMaterialFb()
            || GameMap.IsPersonalBoss() || GameMap.IsCityBoss()) {
            ViewManager.ins().open(BossBattleView, GameMap.fbType);
        } else {
            ViewManager.ins().close(BossBattleView);
        }
        if (GameMap.IsTenKill()) {
            ViewManager.ins().open(TenKillBattleView);
        } else {
            ViewManager.ins().close(TenKillBattleView);
        }
        // if (GameMap.IsMiJing()) {
        //     ViewManager.ins().close(FbWin);
        //     ViewManager.ins().open(MiJingBattleView);
        // } else {
        //     ViewManager.ins().close(MiJingBattleView);
        // }
        if (GameMap.IsHeroBattle() || GameMap.IsTiaoZhan() || GameMap.IsTeamFb()) {
            ViewManager.ins().open(ActivityType303TimePanel);
        } else {
            ViewManager.ins().close(ActivityType303TimePanel);
        }
        if (!GameMap.IsNoramlLevel() && !GameMap.IsTenKill() && !GameMap.IsMiJing()) {
            ViewManager.ins().open(BattleStart);//播放战斗开始动画
        }
        if (GameMap.IsTeamFb()) {
            ViewManager.ins().close(FbWin);
        }
        if (GameMap.IsChaosBttle()) {
            ViewManager.ins().open(ChaosBattleAtkWin);
        } else {
            ViewManager.ins().close(ChaosBattleAtkWin);
        }
        MessageCenter.ins().dispatch(MessageDef.CHANGE_MAP_MSG);
    };
    /**
     * 更新血量
     * @param handle
     * @param value
     */
    public entityBloodUpData(handle, hpValue: number) {
        var target = EntityManager.ins().getEntityByHandle(handle);
        if (target) {
            target.infoModel.setAtt(AttributeType.atHp, hpValue);
            target.updateBlood();
            if (hpValue == 0) {
                // DropHelp.tempDropPoint.x = Math.floor(target.x / GameMap.CELL_SIZE);
                // DropHelp.tempDropPoint.y = Math.floor(target.y / GameMap.CELL_SIZE);
                DropHelp.setTempDropPoint(Const.PixelToPos(target.x), Const.PixelToPos(target.y))
            }
            if (target.infoModel.masterHandle == GameLogic.ins().actorModel.handle)
                GameLogic.ins().postHpChange();
        }
    }

    /**hp */
    public postHpChange() {
    }

    get gamescene(): GameSceneView {
        return <GameSceneView>ViewManager.ins().getView(GameSceneView);
    }
    private monstersConfig: any;
    /**创建关卡的怪物 */
    public createGuanqiaMonster(isOther = false) {
        if (this.monstersConfig == null)
            this.monstersConfig = GlobalConfig.monstersConfig;
        let userFb = UserFb.ins()

        if (this.chaptersConfig == null)
            this.chaptersConfig = GlobalConfig.ins("ChaptersConfig");

        var config = this.chaptersConfig[userFb.guanqiaID];
        if (config == null) {
            Main.errorBack("gamelogic.createGuanqiaMonster guanqieID " + userFb.guanqiaID);
            return
        }
        var count = userFb.GetWaveMonsterCount()
        // let count = 6
        if (this.rPosindex >= userFb.GetRPos().length) {
            this.rPosindex = 0;
        }
        var index = this.rPosindex;
        /**重置刷怪格子表 */
        for (var _i = 0, datas = this.radiusMap; _i < datas.length; _i++) {
            var arr = datas[_i];
            arr.length = 0;
        }
        //随机生成count个不重复的坐标
        var pos = userFb.GetRPos()[index];
        var startX = pos.x - this.MONSTER_RADIUS; //从左上开始计算
        var startY = pos.y - this.MONSTER_RADIUS; //从左上开始计算
        this.writeMap(this.radiusMap, startX, startY, count);
        // let ranIndex = Math.round(Math.random() * count)
        if (!isOther) {
            this.CreateRewardsPop()
        }

        for (var tempX = 0; tempX < this.MONSTER_LEN; tempX++) {
            for (var tempY = 0; tempY < this.MONSTER_LEN; tempY++) {
                var tempP = this.radiusMap[tempX][tempY];
                if (tempP) {
                    let elite = null
                    // if (ranIndex) {
                    //     elite = --ranIndex <= 0
                    // }
                    if (!isOther) {
                        var model = MonstersConfig.createModel(this.monstersConfig[config.waveMonsterId], elite ? 2 : 0);
                        model.x = (startX + tempX) * GameMap.CELL_SIZE + (GameMap.CELL_SIZE >> 1);
                        model.y = (startY + tempY) * GameMap.CELL_SIZE + (GameMap.CELL_SIZE >> 1);

                        let monster = this.createEntityByModel(model) as CharMonster
                        this.CacheReward(monster.handle)
                    }

                    // if (elite && egret.is(monster, "CharMonster")) {
                    //     monster.setFootRing(CharMonster.FOOT_RING_TYPE_LEVEL_BOSS)
                    //     monster.setScale(1.2)
                    // }
                    if (isOther) {
                        let model2: EntityModel = MonstersConfig.createModel(this.monstersConfig[config.waveMonsterId], elite ? 2 : 0);
                        model2.x = (startX + tempX) * GameMap.CELL_SIZE + (GameMap.CELL_SIZE >> 1);
                        model2.y = (startY + tempY) * GameMap.CELL_SIZE + (GameMap.CELL_SIZE >> 1);
                        OtherAIModel.getInstance.createMonsters(model2);
                    }
                }
            }

        }

        /**
         *                 monster.setFootRing(CharMonster.FOOT_RING_TYPE_LEVEL_BOSS)
                monster.setScale(2)
         */

        this.m_IsRepeatCreateMonster = config.wavePointCount - 1
        this.m_IsRepeatStart = false

        this.rPosindex++;

        if (this.fristEnterGame) {
            this.timerID = egret.setTimeout(this.startAI, this, 3000);
        }
        else {
            this.startAI();
        }
        if (!isOther) {
            this.createGuanqiaMonster(true);
        }
    }

    private fristEnterGame: boolean = true;
    private timerID: number = 0;
    private startAI(): void {
        egret.clearTimeout(this.timerID);
        this.fristEnterGame = false;
        if (GameMap.IsNoramlLevel())
            newAI.ins().start();
        else
            newAI.ins().stop();
    }

    private CacheReward(target: number) {
        let reward = this.m_Reward.shift()
        this.m_RewardDict[target] = reward
    }

    public GetReward(target: number) {
        let reward = this.m_RewardDict[target]
        if (reward) {
            delete this.m_RewardDict[target]
        }
        return reward
    }

    private CreateRewardsPop() {
        let list: Sproto.reward_data[] = []
        while (true) {
            let reward = UserFb.ins().getRewardsPop()
            if (reward == null) {
                break
            }
            for (var j = 0; j < reward.drops.length; j++) {
                list.push(reward.drops[j])
            }
        }
        let gold = 0
        for (let i = list.length - 1; i >= 0; --i) {
            let item = list[i]
            if (item.id == 1) {
                gold += item.count
                list.splice(i, 1)
            }
        }
        this.m_RewardDict = []
        this.m_Reward = [];
        if (this.chaptersConfig == null)
            this.chaptersConfig = GlobalConfig.ins("ChaptersConfig");
        var config = this.chaptersConfig[UserFb.ins().guanqiaID];
        let monsterCount = config.wavePointCount * config.waveMonsterCount
        let [goldList, surplusGold] = this._GetRandomList(monsterCount - 1, gold)
        let tempCount = 0
        for (let g of goldList) {
            if (g) {
                ++tempCount
                this.m_Reward.push([{
                    id: 1,
                    count: g,
                } as any])
            } else {
                this.m_Reward.push(null)
            }
        }
        if (surplusGold > 0) {
            list.push({
                id: 1,
                count: surplusGold
            } as any)
        }
        this.m_Reward.push(list)

        // console.log("掉落金币数量", tempCount, "精英怪物剩余金币", surplusGold)
        // let str = ""
        // for (let item of this.m_Reward) {
        //     if (item) {
        //         for (let citem of item) {
        //             str += citem.id + "=>" + citem.count + ", "
        //         }
        //     } else {
        //         str += "null"
        //     }
        //     str += "\n"
        // }
        // console.log(str)

    }

    private _GetRandomList(maxNum, gold) {
        let count = MathUtils.limitInteger(maxNum * 0.1, maxNum * 0.65)
        let avgGold = Math.round(gold / count)
        let list = []
        let list2 = []
        for (let i = 0; i < maxNum; ++i) {
            list.push(i)
            list2.push(null)
        }
        for (let i = 0; i < maxNum - count; ++i) {
            var index = Math.floor(Math.random() * list.length);
            list.splice(index, 1)
        }
        for (let index of list) {
            let g = Math.round(avgGold + (Math.random() - 0.5) * avgGold)
            if (g <= gold) {
                gold -= g
                list2[index] = g
            } else {
                if (gold != 0) {
                    list2[index] = gold
                }
                break
            }
        }
        return [list2, gold]
    }

    private m_IsRepeatCreateMonster = 0
    private m_RepeatCount = 0
    private m_IsRepeatStart = false
    private m_Reward: Sproto.reward_data[][] = []
    private m_RewardDict: { [key: number]: Sproto.reward_data[] } = {}
    private m_RepeatPoint: egret.Point = new egret.Point()
    private posDict = {}
    // private m_RewardGold = 0
    // private m_MonsterCount = 0
    private chaptersConfig: any;

    public ClearRepeatCreate() {
        this.m_IsRepeatStart = false
        TimerManager.ins().remove(this.RepeatCreateMonster, this)
        TimerManager.ins().remove(this.RepeatCreateMonster2, this)
    }

    public IsRepeatCreateFinish(): boolean {
        return !this.m_IsRepeatStart || this.m_IsRepeatCreateMonster <= 0
    }

    public StartRepeatMonster() {

        if (this.m_IsRepeatStart || !GameMap.IsNoramlLevel() || Encounter.IsBoss() || this.m_IsRepeatCreateMonster <= 0) {
            return
        }

        let role = EntityManager.ins().getMainRole(0)
        if (!role) {
            return
        }
        if (this.chaptersConfig == null)
            this.chaptersConfig = GlobalConfig.ins("ChaptersConfig");

        var config = this.chaptersConfig[UserFb.ins().guanqiaID];
        let configCmomon = GlobalConfig.chaptersCommonConfig
        let time = config.wavePointGap <= config.waveTimeGap ? config.waveTimeGap + 100 : config.wavePointGap
        this.m_IsRepeatStart = true

        TimerManager.ins().doTimer(time, 0, this.RepeatCreateMonster, this)
    }

    private RepeatCreateMonster() {


        let index = this.m_IsRepeatCreateMonster
        this.m_IsRepeatCreateMonster = Math.max(this.m_IsRepeatCreateMonster - 1, 0)
        if (!GameMap.IsNoramlLevel() || (index <= 0 && this.m_RepeatCount <= 0)) {
            // 不在挂机关卡中
            this.ClearRepeatCreate()
            return
        }
        if (index <= 0) {
            return
        }
        let role = EntityManager.ins().getMainRole(0)
        if (!role) {
            return
        }

        if (this.chaptersConfig == null)
            this.chaptersConfig = GlobalConfig.ins("ChaptersConfig");

        var config = this.chaptersConfig[UserFb.ins().guanqiaID];
        let configCmomon = GlobalConfig.chaptersCommonConfig

        let elite = false

        this.posDict = {}

        this.m_RepeatCount = config.waveMonsterCount
        let time = Math.floor(config.waveTimeGap / (this.m_RepeatCount - 1))

        for (let i = 0; i < 99; ++i) {
            let dir = MathUtils.limitInteger(0, 4)
            let dis = MathUtils.limitInteger(configCmomon.minRange, configCmomon.maxRange)
            let dis2 = MathUtils.limitInteger(1 - dis, dis - 1)
            let pointX, pointY
            let roleX = Const.PixelToPos(role.x)
            let roleY = Const.PixelToPos(role.y)
            if (dir == 0) {
                pointX = roleX - dis2
                pointY = roleY + dis
            } else if (dir == 1) {
                pointX = roleX + dir
                pointY = roleY - dis2
            } else if (dir == 2) {
                pointX = roleX + dis2
                pointY = roleY - dis
            } else {
                pointX = roleX - dis
                pointY = roleY + dis2
            }
            if (GameMap.checkWalkable(pointX, pointY)) {
                this.m_RepeatPoint.x = pointX
                this.m_RepeatPoint.y = pointY
                break
            }
        }

        // console.log("坐标中心点", this.m_RepeatPoint.x, this.m_RepeatPoint.y)

        // this.RepeatCreateMonster2()
        // TimerManager.ins().remove(this.RepeatCreateMonster2, this)
        if (!TimerManager.ins().isExists(this.RepeatCreateMonster2, this))
            TimerManager.ins().doTimer(time, this.m_RepeatCount, this.RepeatCreateMonster2, this)
    }

    private RepeatCreateMonster2() {
        if (this.m_RepeatCount <= 0) {
            return
        }
        // console.log("------------------生成次数", this.m_IsRepeatCreateMonster, this.m_RepeatCount)
        let configCmomon = GlobalConfig.chaptersCommonConfig
        let range: number = configCmomon.range
        let px, py
        let func = () => {
            for (let ln = 0; ln < 99; ++ln) {
                let size = range * 2 + 1
                let point = MathUtils.limitInteger(0, size * size - 1)
                let x = this.m_RepeatPoint.x + Math.floor(point / size)
                let y = this.m_RepeatPoint.y + Math.floor(point % size)
                let key = x * 10000 + y
                // console.log("x="+ x + "   y="+y);

                if (GameMap.checkWalkable(x, y) && !this.posDict[key]) {
                    this.posDict[key] = true
                    px = x
                    py = y
                    return
                }
            }
        }
        func()
        // console.log("------------------当前创建点", px, py)
        if (!px || !py) {
            px = this.m_RepeatPoint.x
            py = this.m_RepeatPoint.y
        }

        if (this.monstersConfig == null)
            this.monstersConfig = GlobalConfig.monstersConfig;

        let elite = this.m_RepeatCount-- <= 1 && this.m_IsRepeatCreateMonster <= 0;
        if (this.chaptersConfig == null)
            this.chaptersConfig = GlobalConfig.ins("ChaptersConfig");

        var config = this.chaptersConfig[UserFb.ins().guanqiaID];
        var model = MonstersConfig.createModel(this.monstersConfig[config.waveMonsterId], elite ? config.eliteRate : 0);

        model.x = px * GameMap.CELL_SIZE + (GameMap.CELL_SIZE >> 1);
        model.y = py * GameMap.CELL_SIZE + (GameMap.CELL_SIZE >> 1);

        if (!GameMap.checkWalkable(px, py)) {
            console.log("怪物不能走。。。。。。。");
        }


        // model.x = px * Const.CELL_SIZE
        // model.y = py * Const.CELL_SIZE

        let monster = this.createEntityByModel(model) as CharMonster
        this.CacheReward(monster.handle)

        if (elite) {
            monster.setFootRing(CharMonster.FOOT_RING_TYPE_LEVEL_BOSS)
            monster.setScale(1.2)
        }

        if (elite) {
            // console.log("----------------------生成完成")
            this.ClearRepeatCreate()
        }
    }

    public writeMap(map, startX, startY, count) {
        // console.log("map:"+map+"  startX:"+startX+"  startY:"+startY+"  count:"+count+"  MONSTER_LEN:"+ this.MONSTER_LEN);

        var tx = MathUtils.limitInteger(0, this.MONSTER_LEN - 1);
        var ty = MathUtils.limitInteger(0, this.MONSTER_LEN - 1);
        if (!map[tx][ty]) {
            // console.log("map[tx][ty]="+map[tx][ty] + "  tx:"+tx+"  ty:"+ty);

            var canMove = GameMap.checkWalkable(startX + tx, startY + ty);
            // return canMove ? { x: ty, y: tx } : this.getRandomPos();
            if (canMove) {
                map[tx][ty] = 1;

            }
            count--;
            if (count > 0)
                this.writeMap(map, startX, startY, count);
        }
        else {
            count--;
            if (count > 0)
                this.writeMap(map, startX, startY, count);
        }
    };
    /**
     * 派发挂机状态变更
     * @param value 为Logicmanager中的静态值
     */
    public postHookStateChange(value) {
        this.hookState = value;
        return value;
    };
    /**派发实体移动 */
    public postMoveEntity(entity: CharMonster, asNode: AStarNode[]) {
        return [entity, asNode];
    };
    /** 计算真实属性值（含增益buff） */
    public static calculateRealAttribute(target, type) {
        var value = target.infoModel.getAtt(type);
        var buffs = target.buffList;
        var buff;
        for (var i in buffs) {
            buff = buffs[i];
            if (buff.effConfig.type == SkillEffType.ADD_ATTR
                && buff.effConfig.args.d == type) {
                value += buff.value;
            }
        }
        return value;
    };
    /**挂机状态 */
    public static HOOK_STATE_HOOK = 0;
    /**寻敌状态 */
    public static HOOK_STATE_FIND_ENMENY = 1;

    public sendChangElement(roleid: number, mainEle: number) {
        var data = new Sproto.cs_element_set_req_request();
        data.roleid = roleid;
        data.mainEle = mainEle;
        GameSocket.ins().Rpc(C2sProtocol.cs_element_set_req, data);
    }

    private changeMainEle(data: Sproto.sc_element_set_res_request) {
        var roleID = data.roleid;
        var len = SubRoles.ins().rolesModel.length;
        for (var i = 0; i < len; i++) {
            var model = SubRoles.ins().getSubRoleByIndex(i);
            if (model.index == roleID) {
                model.attrElementMianType = data.mainEle;
                let charRole = EntityManager.ins().entityList[model.handle];
                if (charRole)
                    charRole.setElementImg(data.mainEle);
            }
        }
        GameGlobal.MessageCenter.dispatch(MessageDef.UPDATE_MAINELEMENT);
    }

    /**客户端加载完主题请求数据(优先级较低的数据)（重要） */
    public sendReadyComple() {
        let rsp = new Sproto.cs_client_ready_req_request;
        this.Rpc(C2sProtocol.cs_client_ready_req, rsp);
        this.sendRedPointGetData();
    }
    /**因为要算红点要预先请求的数据 */
    public sendRedPointGetData() {
        NeiGongControl.ins().getAllRoleNeiGongMsg();
        UserFb.ins().sendGetQuanQiaBossInit();
        PetSproto.ins().sendGetPetInitMsg();
        PetSproto.ins().sendPetAttachInit();
        MountSproto.ins().sendGetMountInitMsg();
        GadSproto.ins().sendGadInit();
        // MiJingSproto.ins().sendGetMiJingMsg();
        OnlineRewardsModel.ins().sendExpWelExpInitMsg();
        ChaosBattleSproto.ins().sendInfo();
        ChaosBattleSproto.ins().sendRank();
        TheGunSproto.ins().sendTheGunInitMsg();
    }

    /** 获取模块是否激活*/
    public SendGetOtherActorBaseInfo(actorId: number, roleid: number) {
        let req = new Sproto.cs_get_actor_module_isactive_request
        req.otherid = actorId;
        req.roleid = roleid;
        this.Rpc(C2sProtocol.cs_get_actor_module_isactive, req)
    }

    /**查看其它玩家某个模块基础信息 */
    public SendGetOtherInfo(actorId: number, roleId: number, selectId: number) {
        let req = new Sproto.cs_get_other_actor_base_info_request
        req.otherid = actorId;
        req.roleid = roleId;
        req.id = selectId
        this.Rpc(C2sProtocol.cs_get_other_actor_base_info, req)
    }

    /**排行榜主界面信息查询 */
    public SendGetOtherPlayerInfo(actorId: number, roleId: number) {
        let req = new Sproto.cs_rank_player_info_request
        req.dbid = actorId;
        req.roleId = roleId;
        this.Rpc(C2sProtocol.cs_rank_player_info, req)
    }

    /**请求战斗开始 */
    public sendBattleBegin() {
        let rsp = new Sproto.cs_monopoly_raid_open_request;
        this.Rpc(C2sProtocol.cs_monopoly_raid_open, rsp);
    }

}

MessageCenter.compile(GameLogic);

window["GameLogic"] = GameLogic