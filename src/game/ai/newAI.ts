class newAI extends BaseClass {

    isLog: boolean = false;
    /**存储技能cd */
    skillCD = {};
    /**是否初始化 */
    inited: boolean;
    /**开启ai后是否进行过攻击 */
    isStartAtk: boolean;
    teamAction = {};
    private aiList: { [key: number]: CharMonster } = {};
    curSkill = {};
    curTarget: { [key: number]: CharMonster } = {};

    private cacheEntityPos: { [key: number]: egret.Point } = {}

    // private m_PowerTimer: egret.Timer
    private m_NextPowerSkillTimer = Number.MAX_VALUE
    private m_PowerSkillProgress = 0

    public mPowerSkillAction: Function;

    private effectsConfig: any;

    private skillConfig: any;
    private _DispatchPowerSkill(...param: any[]) {
        if (!this.mPowerSkillAction) {
            return
        }
        this.mPowerSkillAction.apply(null, param)
    }

    public ChangeMap() {
        this.m_PowerSkillProgress = 0
        this.m_NextPowerSkillTimer = egret.getTimer()
        this._DispatchPowerSkill(PowerSkillState.INIT);

        if (!GameMap.IsNoramlLevel()) {
            TimerManager.ins().remove(this._UpdatePowerProgress, this);
            return;
        }

        if (!TimerManager.ins().isExists(this._UpdatePowerProgress, this)) {
            TimerManager.ins().doTimer(newAI.AI_UPDATE_TIME, 0, this._UpdatePowerProgress, this);
        }
    }

    private m_NextBorn = 0
    private m_ReqRankTimer = 0
    private m_StartTime = 0
    private m_PreStartTime = 99999999

    public constructor() {
        super();
    }

    public static ins(...args: any[]): newAI {
        return super.ins(args);
    };
    public init() {
        if (this.inited) return;
        this.skillCD = {};
        this.inited = true;
        if (!TimerManager.ins().isExists(this._UpdatePowerProgress, this))
            TimerManager.ins().doTimer(newAI.AI_UPDATE_TIME, 0, this._UpdatePowerProgress, this);

    };
    /** 开启AI */
    public start() {
        this.isStartAtk = false;
        GameLogic.ins().postHookStateChange(GameLogic.HOOK_STATE_FIND_ENMENY);
        this.teamAction = {};
        this.starting = false;
        if (this.starting)
            return;
        if (!this.inited)
            this.init();
        // if (!TimerManager.ins().isExists(this.startAI, this))
        //     TimerManager.ins().doTimer(newAI.AI_UPDATE_TIME, 0, this.startAI, this);
        // if (!TimerManager.ins().isExists(this.startRoleAI, this))
        //     TimerManager.ins().doTimer(newAI.AI_UPDATEROLE_TIME, 0, this.startRoleAI, this);
        // if (!TimerManager.ins().isExists(this._UpdatePowerProgress, this))
        //     TimerManager.ins().doTimer(newAI.AI_UPDATE_TIME, 0, this._UpdatePowerProgress, this);
        if (!TimerManager.ins().isExists(this.timeOpenAI, this))
            TimerManager.ins().doTimer(newAI.AI_UPDATEROLE_TIME, 0, this.timeOpenAI, this);
    };
    private time = newAI.AI_UPDATE_TIME;
    private timeOpenAI() {
        this.time += newAI.AI_UPDATEROLE_TIME;
        if (this.time >= newAI.AI_UPDATE_TIME) {
            this.time = 0;
            this.startAI();
            this._UpdatePowerProgress();
        }
        this.startRoleAI();
    }
    //调试用
    public togglePause() {
        if (TimerManager.ins().isExists(this.timeOpenAI, this)) {
            TimerManager.ins().remove(this.timeOpenAI, this);
            UserTips.ins().showTips("暂停挂机!");
        }
        else {
            TimerManager.ins().doTimer(newAI.AI_UPDATEROLE_TIME, 0, this.timeOpenAI, this);
            UserTips.ins().showTips("继续挂机!");
        }
    };
    /** 关闭AI */
    public stop() {
        // if (this.inited) {
        //     TimerManager.ins().remove(this.startAI, this);
        // }
        OtherAIModel.getInstance.releaseAll();
        this.aiList = {};
        this.curSkill = {};
        this.curTarget = {};
        this.starting = false;
        TimerManager.ins().removeAll(this);
        GameLogic.ins().ClearRepeatCreate()
        this.m_NextPowerSkillTimer = Number.MAX_VALUE
        // console.log('ai清空了');
    };
    public destruct() {
        this.skillCD = {};
        this.stop();
        if (this.inited) {
            // this.timer.removeEventListener(egret.TimerEvent.TIMER, this.startAI, this);
            // TimerManager.ins().remove(this.startAI, this);
            TimerManager.ins().remove(this.timeOpenAI, this);
        }
        // this.timer = null;
    };
    // public get starting() {
    //     return this.timer && this.timer.running;
    // }
    public add(char: CharMonster) {
        this.aiList[char.infoModel.handle] = char;
    };
    public remove(char) {
        delete this.aiList[char.infoModel.handle];
    };
    private starting: boolean = false;
    private startingRole: boolean = false;
    /** 开始角色AI */
    public startAI() {
        if (this.starting) {
            egret.log("AI 正在执行");
            return;
        }
        this.starting = true;
        var list = this.aiList;
        var jobNames = ["0", "剑士", "法师", "牧师"];
        this._UsePowerSkill()
        for (var i in list) {
            var selfTarget: CharRole | CharMonster = list[i];
            if (selfTarget instanceof CharRole) {
                continue;
            }
            var state_2 = this.loop1(i);
            if (state_2 === "continue") continue;
            if (state_2 === "break") break;
        }
        let list2 = OtherAIModel.getInstance.aiMonsterList.values;
        for (let f in list2) {
            var selfTarget: CharRole | CharMonster = list2[f];
            if (selfTarget instanceof CharRole) {
                continue;
            }
            var state_2 = this.loop1(selfTarget.handle + "", 2);
            if (state_2 === "continue") continue;
            if (state_2 === "break") break;
        }
        this.starting = false;
    };

    /** 开始只遍历角色RoleAI */
    public startRoleAI() {
        if (this.startingRole) {
            egret.log("AI 角色  正在执行");
            return;
        }
        this.startingRole = true;
        var list = this.aiList;
        var jobNames = ["0", "剑士", "法师", "牧师"];
        // this._UsePowerSkill()
        for (var i in list) {
            var selfTarget: CharRole | CharMonster = list[i];
            if (selfTarget instanceof CharRole) {
                var state_2 = this.loop1(i);
                if (state_2 === "continue") continue;
                if (state_2 === "break") break;
            }
        }
        let list2 = OtherAIModel.getInstance.aiRoleList.values;
        for (let f in list2) {
            var selfTarget: CharRole | CharMonster = list2[f];
            if (selfTarget instanceof CharRole) {
                var state_2 = this.loop1(selfTarget.handle + "", 1);
                if (state_2 === "continue") continue;
                if (state_2 === "break") break;
            }
        }
        this.startingRole = false;
    };



    private loop1(targetHandle: string, isOtherAi = 0) {
        var list: any;
        var selfTarget: CharRole | CharMonster;
        if (isOtherAi == 0) {
            list = this.aiList;
            selfTarget = list[targetHandle]
        } else if (isOtherAi == 1) {
            selfTarget = OtherAIModel.getInstance.aiRoleList.get(parseInt(targetHandle));
        } else {
            selfTarget = OtherAIModel.getInstance.aiMonsterList.get(parseInt(targetHandle));
        }
        var jobNames = ["0", "剑士", "法师", "牧师"];
        var isRole = selfTarget instanceof CharRole;
        if (!selfTarget.infoModel) {
            return "continue";
        }
        var handle = selfTarget.infoModel.handle;
        var jobName = ""
        if (isRole) {
            jobName = jobNames[(<CharRole>selfTarget).infoModel.job]
        }
        // if (jobName != "")
        // 	this.trace(jobName + "---" + handle + ",状态" + AI_State[selfTarget.AI_STATE]);
        //buff伤害
        var selfBuffList = selfTarget.buffList;
        for (var groupID in selfBuffList) {
            //自己已经死亡
            if (selfTarget.AI_STATE == AI_State.Die)
                break;
            var buff = selfBuffList[groupID];
            var t = egret.getTimer();
            if (buff.effConfig.type == SkillEffType.ADD_HP ||
                buff.effConfig.type == SkillEffType.DAMAGE) {
                var isExecute = t - buff.addTime > buff.step * buff.effConfig.interval;
                if (isExecute) {
                    buff.step++;//怪物
                    var i = this.hramedDie(selfTarget, buff.value);
                    this.showHram(i, DamageTypes.HIT, selfTarget, buff.source, buff.value, false, true, "buff伤害" + buff.effConfig.id);
                    if (buff.step >= buff.count)
                        selfTarget.removeBuff(buff);
                }
            }
            if (buff.effConfig.type != SkillEffType.SUMMON && t >= buff.endTime) {
                selfTarget.removeBuff(buff);
            }
        }
        //自己已经死亡
        if (selfTarget.AI_STATE == AI_State.Die)
            return "continue";
        //如果是处于硬直状态 || 麻痹
        if (selfTarget.isHardStraight || selfTarget.hasBuff(51001)) {
            // this.trace(selfTarget.infoModel.name + "  51001	 麻痹	然后不会动");
            return "continue";
        }
        //是否在公共cd中
        if (selfTarget.publicCD && egret.getTimer() - selfTarget.publicCD <= selfTarget.atkHardTime) {
            if (!selfTarget.isPlaying) {
                selfTarget.playAction(EntityAction.STAND);
            }
            return "continue";
        }
        switch (selfTarget.AI_STATE) {
            case AI_State.Stand: {
                //选择技能
                this.screeningSkill(handle);
                if (!this.curSkill[handle]) {
                    return "continue";
                }
                //选择目标
                this.screeningTarget(selfTarget);
                let target = this.curTarget[handle]
                if (!target) {
                    //this.timer.stop();
                    //this.trace(`找不到目标停止AI`);
                    //return;
                    GameLogic.ins().StartRepeatMonster()
                    return "continue";
                }
                let pos = this.cacheEntityPos[target.handle]
                if (!pos) {
                    pos = new egret.Point
                    this.cacheEntityPos[target.handle] = pos
                }
                pos.x = target.x
                pos.y = target.y
                //this.trace(`${jobName}:有攻击对象可以使用${this.curSkill[hCode].skinName}`);
                if (this.tryUseSkill(selfTarget)) {
                    selfTarget.stopMove()
                    selfTarget.AI_STATE = AI_State.Atk;
                }
                else {
                    if (newAI.IsMyTeam(selfTarget.team) ||
                        selfTarget.team == Team.WillEntity ||
                        this.teamAction[selfTarget.team]) {
                        //开始追踪目标，此处会改变self的状态-->RUN


                        if (selfTarget.infoModel.isPet) {
                            GameMap.moveEntity(selfTarget, this.curTarget[handle].x, this.curTarget[handle].y + (Math.random() * 100 + -Math.random() * 100));
                        } else {
                            GameMap.moveEntity(selfTarget, this.curTarget[handle].x, this.curTarget[handle].y);
                        }


                        selfTarget.AI_STATE = AI_State.Run;
                    }
                }
            }

                break;
            case AI_State.Run: {
                let target = this.curTarget[handle];
                if (!target || target.AI_STATE == AI_State.Die) {
                    selfTarget.stopMove();
                    selfTarget.playAction(EntityAction.STAND);
                    selfTarget.AI_STATE = AI_State.Stand;
                    delete this.curTarget[handle];
                    return "continue";
                }
                else {
                    let pos = this.cacheEntityPos[target.handle]
                    if (pos) {
                        /**修正坐标 */
                        if (Math.abs(pos.x - target.x) > 10 || Math.abs(pos.y - target.y) > 10) {
                            pos.x = target.x
                            pos.y = target.y
                            GameMap.moveEntity(selfTarget, target.x, target.y);
                            selfTarget.AI_STATE = AI_State.Run;
                        }
                    }
                    if (this.targetStartMove(selfTarget)) {
                        this.teamAction[target.team] = true;
                    }
                    if (this.tryUseSkill(selfTarget)) {
                        selfTarget.stopMove();
                        selfTarget.AI_STATE = AI_State.Atk;
                    }
                    //走到目的地了，但是怪物不在攻击距离
                    if (selfTarget.action == EntityAction.STAND)
                        selfTarget.AI_STATE = AI_State.Stand;
                }
            }
                break;
            case AI_State.Atk: {
                selfTarget.stopMove()
                if (!this.isStartAtk)
                    GameLogic.ins().postHookStateChange(GameLogic.HOOK_STATE_HOOK);
                this.isStartAtk = true;
                let target = this.curTarget[handle];
                if (!target || target.AI_STATE == AI_State.Die /**|| (target.infoModel && !(target.infoModel.handle in this.aiList))*/) {
                    selfTarget.playAction(EntityAction.STAND);
                    selfTarget.AI_STATE = AI_State.Stand;
                    delete this.curTarget[handle];
                    //if (selfTarget.infoModel.team == Team.My)
                    //	this.trace(`${jobName}` + "-----当前目标死亡，删除目标返回Stand-----");
                    return "continue";
                }
                GameLogic.ins().StartRepeatMonster() //不需要
                this.teamAction[target.team] = true;
                //this.trace(`${jobName}:攻击中-${selfTarget.atking}`);
                if (selfTarget.atking)
                    return "continue";
                var skill_1 = this.curSkill[handle];
                if (skill_1 == null)
                    return "continue";
                //播放技能特效
                // let hramDelay: number = ControllerManager.ins().applyFunc(ControllerConst.Game,
                // 	MapFunc.PLAY_SKILL_EFFECT, skill, selfTarget, target);
                var hramDelay = GameLogic.ins().playSkillEff(skill_1, selfTarget, target);
                //保存最后一次使用技能的时间
                if (selfTarget instanceof CharRole) {
                    if (selfTarget.isPlayRandomSkill == true && skill_1.skillType != SkillType.TYPE7) {
                        selfTarget.isPlayRandomSkill = false;
                    } else {
                        this.skillCD[handle][skill_1.id] = egret.getTimer();
                    }
                } else {
                    this.skillCD[handle][skill_1.id] = egret.getTimer();
                }
                selfTarget.atking = true;
                if (!isRole) {
                    TimerManager.ins().doTimer(selfTarget.curPlayTime, 1, function () {
                        if (!isRole)
                            selfTarget.playAction(EntityAction.STAND);
                        if (selfTarget.AI_STATE == AI_State.Atk)
                            selfTarget.AI_STATE = AI_State.Stand;
                        selfTarget.atking = false;
                        //if (selfTarget.infoModel.team == Team.My && target.infoModel.team == Team.Monster)
                        //this.trace("攻击后重置状态--" + handle + ",当前状态" + AI_State[selfTarget.AI_STATE]);
                    }, Math.random()); //随机数不被终止执行
                } else {
                    if (selfTarget.AI_STATE == AI_State.Atk)
                        selfTarget.AI_STATE = AI_State.Stand;
                    selfTarget.atking = false;
                }
                //记录最后一次公共cd时间
                selfTarget.publicCD = egret.getTimer();

                let kill2: boolean = false;
                if (isRole && selfTarget.atk2 == false && skill_1.skillType == SkillType.TYPE1) {
                    let model = <Role>selfTarget.infoModel;
                    let passSkillId = model.getAllPassSkillId();
                    let effConfig = GlobalConfig.ins("EffectsConfig");
                    for (let f = 0; f < passSkillId.length; f++) {
                        let effConfigData = effConfig[passSkillId[f]]
                        if (effConfigData.type == SkillEffType.STATE && effConfigData.args.i == RoleStateType.DOUBLE_ATK) {
                            let skillsConfig = GlobalConfig.ins("SkillsConfig")[effConfigData.id];
                            if (Math.random() * 100 < (skillsConfig.args.prob / 100)) {
                                kill2 = true;
                                selfTarget.atk2 = true;
                            }
                        }
                    }
                    if (kill2 == true) {
                        selfTarget.atkHardTime = 200;
                    } else {
                        if (selfTarget.infoModel) {
                            if (skill_1.skillType == SkillType.TYPE1) {
                                let atAttackSpeed = GameLogic.calculateRealAttribute(selfTarget, AttributeType.atAttackSpeed);
                                if (atAttackSpeed > 10000) {
                                    atAttackSpeed = 10000;
                                }
                                selfTarget.atkHardTime = 1000000 / atAttackSpeed;
                            }
                        }
                    }
                } else {
                    if (selfTarget.infoModel) {
                        if (skill_1.skillType == SkillType.TYPE1) {
                            let atAttackSpeed = GameLogic.calculateRealAttribute(selfTarget, AttributeType.atAttackSpeed);
                            if (atAttackSpeed > 10000) {
                                atAttackSpeed = 10000;
                            }
                            selfTarget.atkHardTime = 1000000 / atAttackSpeed;
                        }
                    }
                }
                if (isRole) {
                    let model = <Role>selfTarget.infoModel;
                    let recoberMp: number = 1;
                    let costMp: number = 1;
                    let buffMpRecober: number = 0;
                    for (var groupID in selfBuffList) {
                        var buff = selfBuffList[groupID];
                        if (buff.effConfig.type == SkillEffType.RECOVER_MP) {
                            //判断是不是有回mpbuff
                            recoberMp = 1 + (buff.effConfig.args.a / 100);
                        }
                        //判断是不是有减少mp消耗buff
                        if (buff.effConfig.type == SkillEffType.COST_MP) {
                            costMp = 1 - (buff.effConfig.args.a / 100);
                        }
                        //判断是不是有概率回mpbuff
                        if (buff.effConfig.type == SkillEffType.STATE && buff.effConfig.args.i == RoleStateType.MP_RECOVER) {
                            if (Math.random() * 100 < buff.effConfig.args.a) {
                                let buffMpRecober = skill_1.skillArgs.skillCost * (buff.effConfig.args.b / 100);
                            }
                        }

                        let passSkillId = model.getAllPassSkillId();
                        let effConfig = GlobalConfig.ins("EffectsConfig");
                        for (let f = 0; f < passSkillId.length; f++) {
                            let effConfigData = effConfig[passSkillId[f]]
                            if (effConfigData.type == SkillEffType.RECOVER_MP) {
                                //判断是不是有回mp消耗被动技能
                                recoberMp = 1 + (effConfigData.args.a / 100);
                            }
                            if (effConfigData.type == SkillEffType.COST_MP) {
                                //判断是不是有减少mp消耗被动技能
                                costMp = 1 - (effConfigData.args.a / 100);
                            }
                            //判断是不是有概率回mpbuff
                            if (effConfigData.type == SkillEffType.STATE && effConfigData.args.i == RoleStateType.MP_RECOVER) {
                                if (Math.random() * 100 < effConfigData.args.a) {
                                    let buffMpRecober = skill_1.skillArgs.skillCost * (effConfigData.args.b / 100);
                                }
                            }
                        }
                        let result = selfTarget.infoModel.getAtt(AttributeType.atMp)
                            - skill_1.skillArgs.skillCost * costMp
                            + skill_1.skillArgs.skillResume * recoberMp
                            + buffMpRecober;
                        let nowMp = Math.min(selfTarget.infoModel.getAtt(AttributeType.atMaxMp), result);
                        selfTarget.infoModel.setAtt(AttributeType.atMp, nowMp);
                        selfTarget.updateBlood();
                    }
                }
                if (this.effectsConfig == null)
                    this.effectsConfig = GlobalConfig.ins("EffectsConfig");

                var skillEff = skill_1.tarEff ? this.effectsConfig[skill_1.tarEff[0]] : null;
                var pTarget = skill_1.targetType == TargetType.My ? selfTarget : target;
                var tempArr: CharMonster[] = void 0;
                if (skill_1.targetType == 4) {
                    tempArr = EntityManager.ins().screeningTargetByPos(selfTarget, true);
                    for (var m = 0; m < tempArr.length; m++) {
                        if (tempArr[m].isCanAddBlood) {
                            tempArr[0] = tempArr[m];
                            break;
                        }
                    }
                }
                else if (skill_1.targetType == TargetType.My) {
                    tempArr = [selfTarget];
                }
                else
                    tempArr = skill_1.affectCount > 1 ? EntityManager.ins().screeningTargetByPos(pTarget, pTarget == target, skill_1.affectRange) : [target];
                for (var j = 0; j < skill_1.affectCount; j++) {
                    var state_1 = this.loot2(j, tempArr, selfTarget, skillEff, skill_1, hramDelay);
                    if (state_1 === "break") break;
                    if (state_1 === "continue") continue;
                }
                if (this.effectsConfig == null)
                    this.effectsConfig = GlobalConfig.ins("EffectsConfig");

                for (let selfEffs = skill_1.selfEff ? skill_1.selfEff : [], i = 0; i < selfEffs.length; i++) {
                    var config = this.effectsConfig[selfEffs[i]];
                    this.addBuff(selfTarget, selfTarget, config, this.skillEffValue(selfTarget))
                }
                //if (selfTarget.infoModel.team == Team.My && target.infoModel.team == Team.Monster)
                //	this.trace("被攻击后的状态" + zt[target.AI_STATE] + "--" + target.infoModel.handle);
                //冲撞表现
                this.repel(selfTarget);
                // if (selfTarget instanceof CharRole) UserTips.ErrorTip(selfTarget.buffList[30003]);
                if (selfTarget.buffList[Const.zidanBuff] != null) {
                    // this.curSkill[handle] = GlobalConfig.skillsConfig[11001];
                    return;
                }
                //清空当前技能
                if (!kill2) {
                    delete this.curSkill[handle];
                    if (selfTarget.atk2 = true) {
                        selfTarget.atk2 = false;
                    }
                } else {
                    selfTarget.AI_STATE = AI_State.Atk;
                }
            }
                break;
            case AI_State.Die:
                selfTarget.stopMove();
                break;
        }
    }

    private loot2(j: number, tempArr: CharMonster[], selfTarget: CharMonster, skillEff: any, skill_1: any, hramDelay: number) {
        if (!tempArr[j])
            return "break";
        var ttarget = tempArr[j];
        var isSiZhou = void 0;
        if (ttarget.team != Team.My) {
            var effBuff = void 0;
            //麻痹
            if (this.triggerAttr(selfTarget, AttributeType.atStunPower)) {
                effBuff = ObjectPool.ins().pop('EntityBuff');
                if (this.effectsConfig == null)
                    this.effectsConfig = GlobalConfig.ins("EffectsConfig");
                effBuff.effConfig = this.effectsConfig[51001];
                effBuff.value = selfTarget.infoModel.getAtt(AttributeType.atStunTime);
                effBuff.addTime = egret.getTimer();
                effBuff.endTime = effBuff.addTime + effBuff.value;
                ttarget.addBuff(effBuff);
            }
            //死咒
            if (this.triggerExAttr(selfTarget, ExAttributeType.eatDeathCurseProbability)) {
                effBuff = ObjectPool.ins().pop('EntityBuff');
                if (this.effectsConfig == null)
                    this.effectsConfig = GlobalConfig.ins("EffectsConfig");

                effBuff.effConfig = this.effectsConfig[52001];
                effBuff.addTime = egret.getTimer();
                effBuff.endTime = effBuff.effConfig.args.d ? selfTarget.infoModel.getAttEx(ExAttributeType.eatDeathCurseTime) : effBuff.effConfig.duration;
                ttarget.addBuff(effBuff);
                isSiZhou = true;
            }
        }
        var isCrit = this.triggerAttr(selfTarget, AttributeType.atCrit);
        var hramValue = this.damageBaseCalculation(selfTarget, ttarget);
        let harmUp = 0;
        if (skillEff && skillEff.type == SkillEffType.STATE) {

            if (skillEff.args) {
                if (skillEff.args.i == RoleStateType.ANTIDES) {
                    //如果是盾反的话
                    hramValue = hramValue * (skillEff.args.a / 100) + Math.floor(selfTarget.infoModel.getAtt(AttributeType.atDef) / 100) * skillEff.args.b;
                } else
                    if (skillEff.args.i == RoleStateType.GODKILL) {
                        //神之威压
                        hramValue = hramValue * (skillEff.args.a / 100);
                    }
            }
        }
        if (skillEff && skillEff.type == SkillEffType.SELFKILL) {
            //舍命一击
            let hp = selfTarget.infoModel.getAtt(AttributeType.atHp);
            let valueArgs: number = 0;
            if (skillEff.valueArgs) {
                valueArgs = skillEff.valueArgs.a * skillEff.valueArgs.b + skillEff.valueArgs.c;
            }
            let downHp = hp * ((skillEff.args.a + valueArgs) / 100);
            hramValue = hramValue + downHp * (skillEff.args.b / 100);
        }
        var selfBuffList = selfTarget.buffList;
        for (var groupID in selfBuffList) {
            //判断有无增伤buff
            var buff = selfBuffList[groupID];
            if (skill_1.skillType == SkillType.TYPE1 && buff.effConfig.type == SkillEffType.DAMAGE_EX && buff.effConfig.args.a == SkillType.TYPE1) {
                hramValue = hramValue + hramValue * (buff.effConfig.args.b / 100);
            }
            else if (skill_1.skillType == SkillType.TYPE2 && buff.effConfig.type == SkillEffType.DAMAGE_EX && buff.effConfig.args.a == SkillType.TYPE2) {
                hramValue = hramValue + hramValue * (buff.effConfig.args.b / 100);
            }
            else if (skill_1.skillType == SkillType.TYPE3 && buff.effConfig.type == SkillEffType.DAMAGE_EX && buff.effConfig.args.a == SkillType.TYPE3) {
                hramValue = hramValue + hramValue * (buff.effConfig.args.b / 100);
            }
        }
        if (selfTarget instanceof CharRole) {
            let model = <Role>selfTarget.infoModel;
            let passSkillId = model.getAllPassSkillId();
            let effConfig = GlobalConfig.ins("EffectsConfig");
            for (let f = 0; f < passSkillId.length; f++) {
                let effConfigData = effConfig[passSkillId[f]];
                //判断有无增伤被动
                if (skill_1.skillType == SkillType.TYPE1 && effConfigData.type == SkillEffType.DAMAGE_EX && effConfigData.args.a == SkillType.TYPE1) {
                    hramValue = hramValue + hramValue * (effConfigData.args.b / 100);
                }
                else if (skill_1.skillType == SkillType.TYPE2 && effConfigData.type == SkillEffType.DAMAGE_EX && effConfigData.args.a == SkillType.TYPE2) {
                    hramValue = hramValue + hramValue * (effConfigData.args.b / 100);
                }
                else if (skill_1.skillType == SkillType.TYPE3 && effConfigData.type == SkillEffType.DAMAGE_EX && effConfigData.args.a == SkillType.TYPE3) {
                    hramValue = hramValue + hramValue * (effConfigData.args.b / 100);
                }
            }
        }

        if (isCrit && skill_1.skillArgs.crits == 1) {
            hramValue = hramValue * (selfTarget.infoModel.getAtt(AttributeType.atCritEnhance) + 150 * 100) / 10000 + selfTarget.infoModel.getAtt(AttributeType.atCritHurt);
        }

        let elementDamageData: { elementRestrainType: ElementRestrainType, damage: number } = this.damageElement(selfTarget, ttarget);
        let hramEmunValue = elementDamageData.damage;
        if (skill_1 && skill_1.calcType == 0) {
            hramEmunValue = 0;
        }
        if (isSiZhou)
            hramValue = hramValue * (1 + selfTarget.infoModel.getAttEx(ExAttributeType.eatDeathCurseDamageIncrease) / 10000);
        hramValue = hramValue >> 0;
        var effValue = this.skillEffValue(selfTarget);
        //技能效果附加
        if (skillEff) {
            if (this.effectsConfig == null)
                this.effectsConfig = GlobalConfig.ins("EffectsConfig");

            for (var k = 0; skill_1.tarEff && k < skill_1.tarEff.length; k++) {
                var config = this.effectsConfig[skill_1.tarEff[k]];
                var buff = ObjectPool.ins().pop('EntityBuff');
                buff.effConfig = config;
                buff.value = effValue;
                buff.addTime = egret.getTimer();
                buff.endTime = buff.addTime + config.duration;
                buff.count = (config.duration / config.interval) >> 0;
                buff.step = 0;
                buff.source = selfTarget;
                ttarget.addBuff(buff);
            }
        }
        // if (!hramValue)
        //     return "continue";
        //if (selfTarget.infoModel.team == Team.My && target.infoModel.team != selfTarget.infoModel.team)
        //this.trace(`${selfTarget.infoModel.team == Team.My ? `我的-` : ``}${jobName}` + "攻击--" + target.infoModel.handle + ",伤害" + hramValue + "," + "当前血量：" + target.infoModel.getAtt(AttributeType.atHp) + "，使用技能:" + skill.skinName);
        //本次攻击是否死亡
        let isDie = this.hramedDie(ttarget, hramValue);//怪物
        if (hramEmunValue > 0) {
            egret.setTimeout(function () {
                if (ttarget.infoModel.getAtt(AttributeType.atHp) > 0) {
                    let enumIsDie = this.hramedDie(ttarget, hramEmunValue);
                    this.showHram(enumIsDie, isCrit ? DamageTypes.CRIT : DamageTypes.HIT, ttarget, selfTarget, hramEmunValue, true, true, skill_1.skinName, skill_1.hitCount, elementDamageData.elementRestrainType, skill_1.skillType);
                }
            }, this, UserSkill.EN_TIME);
        }
        var func = function () {
            this.showHram(isDie, isCrit ? DamageTypes.CRIT : DamageTypes.HIT, ttarget, selfTarget, hramValue, true, true, skill_1.skinName, skill_1.hitCount, null, skill_1.skillType);
        }.bind(this);
        if (hramDelay) {
            // this.trace(ttarget.infoModel.handle + " --开始延时伤害-- " + hramDelay);
            TimerManager.ins().doTimer(hramDelay, 1, func, this);
        }
        else
            func();
    }

    private _UpdatePowerProgress() {
        if (!EntityManager.ins().CanUseHeji()) {
            return
        }
        if (this.skillConfig == null)
            this.skillConfig = GlobalConfig.skillsConfig;
        var skill = this.skillConfig[UserSkill.POWER_SKILL]
        this.m_PowerSkillProgress = (egret.getTimer() - this.m_NextPowerSkillTimer) / skill.cd
        this._DispatchPowerSkill(PowerSkillState.LOADING, this.m_PowerSkillProgress)
    }

    private _UsePowerSkill() {
        if (this.m_PowerSkillProgress < 1) {
            return
        }
        this.m_PowerSkillProgress = 1
        let role = EntityManager.ins().getNoDieRole()
        if (!role) {
            return
        }
        if (this.skillConfig == null)
            this.skillConfig = GlobalConfig.skillsConfig;
        var skill = this.skillConfig[UserSkill.POWER_SKILL]
        var targetType = skill.targetType;
        var tempArr = EntityManager.ins().screeningTargetByPos(role, targetType == TargetType.Friendly);
        let target = tempArr ? tempArr[0] : null
        if (!target) {
            return
        }
        var xb = MathUtils.getDistance(role.x, role.y, target.x, target.y);
        if (xb > skill.castRange * Const.CELL_SIZE) {
            return
        }
        // this.m_NextPowerSkillTimer = this._GetNextPowerSkillTime()
        this.m_NextPowerSkillTimer = egret.getTimer()
        GameGlobal.MessageCenter.dispatch(MessageDef.GAME_SCENE_WORD, "comp_164_47_01_png")
        GameLogic.ins().playSkillEff(skill, role, target)
        this._DispatchPowerSkill(PowerSkillState.USE)

        if (!skill.tarEff || skill.tarEff.length == 0) {
            return
        }
        if (this.effectsConfig == null)
            this.effectsConfig = GlobalConfig.ins("EffectsConfig");

        let effectsConfig2 = this.effectsConfig[skill.tarEff[0]]
        if (!effectsConfig2) {
            return
        }
        // {a=1,b=0,attr=4,type=2,p=1}
        let args = effectsConfig2.args
        let attrReduction = 0
        if (args.type == 1) {
            attrReduction = role.infoModel.getAtt(AttributeType.atDef)
        } else {
            attrReduction = role.infoModel.getAtt(AttributeType.atRes)
        }
        let changeValue = 0
        let minDamage = role.infoModel.getAtt(AttributeType.atMaxHp) * 0.01
        let castRoles = EntityManager.ins().GetRoles()
        let totalAttr = 0
        for (let role of castRoles) {
            if (role.infoModel) {
                totalAttr += role.infoModel.getAtt(args.attr)
                changeValue += role.infoModel.getAttEx(ExAttributeType.eatHejiDamageMonstor)
            }
        }
        let damage = (totalAttr * args.a + args.b) * changeValue / 10000 - attrReduction
        let value = Math.floor(Math.max(damage, minDamage))
        let hitValue = Math.ceil(args.p * value)

        let targetList = EntityManager.ins().screeningTargetByPos(target, true, skill.affectRange);
        for (let obj of targetList) {
            let isDie = this.hramedDie(obj, hitValue);
            this.showHram(isDie, DamageTypes.HEJI, obj, role, hitValue, true, true, skill.skinName, skill.hitCount);
        }
    }

    private addBuff(self, target: CharMonster, config, vlaue) {
        var buff: EntityBuff = ObjectPool.ins().pop("EntityBuff");
        buff.effConfig = config
        buff.value = vlaue
        buff.addTime = egret.getTimer()
        buff.endTime = buff.addTime + config.duration
        buff.count = config.duration / config.interval >> 0
        buff.step = 0
        buff.source = self
        target.addBuff(buff)
    }

    public repel(selfTarget: CharMonster) {
        var tp = new egret.Point;
        var handle = selfTarget.infoModel.handle;
        var skill = this.curSkill[handle];
        var target = this.curTarget[handle];
        //  console.log(skill.skinName +"--"+ skill.repelDistance);
        //击退
        if (skill.repelDistance) {
            target.stopMove();
            target.playAction(EntityAction.STAND);
            var h = target.infoModel.handle;
            //被冲时，丢弃原来的攻击目标
            delete this.curTarget[h];
            //this.trace(`${skill.skinName}`);
            var jd = MathUtils.getAngle(MathUtils.getRadian2(selfTarget.x, selfTarget.y, target.x, target.y));
            var p = MathUtils.getDirMove(jd, skill.repelDistance, tp);
            p.x = target.x + p.x;
            p.y = target.y + p.y;
            var data = BresenhamLine.isAbleToThrough(Math.floor(target.x / GameMap.CELL_SIZE), Math.floor(target.y / GameMap.CELL_SIZE), Math.floor(p.x / GameMap.CELL_SIZE), Math.floor(p.y / GameMap.CELL_SIZE), GameMap.checkWalkable);
            if (data[0] == 0) {
                if (data[1] > 3) {
                    console.error("\u901A\u8FC7\u683C\u5B50\u8D85\u8FC73\u4E2A\uFF0C\u68C0\u67E5\u662F\u5426\u6709\u5F02\u5E38" + data[2] + "," + data[3], p);
                }
                p.x = data[2] * GameMap.CELL_SIZE;
                p.y = data[3] * GameMap.CELL_SIZE;
            }
            p.x = Math.max(Math.min(p.x, GameMap.MAX_WIDTH), 0);
            p.y = Math.max(Math.min(p.y, GameMap.MAX_HEIGHT), 0);
            var xbX = p.x - target.x;
            var xbY = p.y - target.y;
            var time = Math.sqrt(xbX * xbX + xbY * xbY) / (selfTarget.moveSpeed / 1000);

            if (this.effectsConfig == null)
                this.effectsConfig = GlobalConfig.ins("EffectsConfig");

            var holdTime = this.effectsConfig[skill.tarEff[0]].duration;
            var t;
            if (skill.tarEff[0] == 14001) {
                time = 700;
            }
            if (skill.icon != 14001) {
                t = egret.Tween.get(target, target.team == Team.My ? {
                    "onChange": () => {
                        GameLogic.ins().postMoveCamera();
                    }
                } : null).call(() => { egret.Tween.removeTweens(target) });
                t.to({
                    "x": p.x,
                    "y": p.y
                }, time);
            }

            target.addHardStraight(holdTime);
            if (skill.teleport == 1) {
                // selfTarget.playAction(skill.actionType);
                selfTarget.playAction(EntityAction.ATTACK);
                t = egret.Tween.get(selfTarget, selfTarget.team == Team.My ? {
                    "onChange": () => {
                        GameLogic.ins().postMoveCamera();
                    }
                } : null);
                t.to({
                    "x": selfTarget.x - (target.x - p.x),
                    "y": selfTarget.y - (target.y - p.y)
                }, time).call(() => {
                    egret.Tween.removeTweens(selfTarget);
                    selfTarget.resetStand();
                });

                selfTarget.addHardStraight(time);
            }
        }
    };
    /**
     * 伤害后是否死亡
     * @returns {boolean}
     */
    public hramedDie(t: CharMonster, v: number) {
        // console.log(`${t.infoModel.handle} --- 属性血量${t.infoModel.getAtt(AttributeType.atHp)} -- 受到伤害${v}`);
        t.infoModel.setAtt(AttributeType.atHp, t.infoModel.getAtt(AttributeType.atHp) - v);
        if (t.infoModel.getAtt(AttributeType.atHp) <= 0) {
            // this.trace("死亡--" + t.infoModel.handle);
            t.AI_STATE = AI_State.Die;
            t.stopMove();
            return true;
        }
        return false;
    };
    /**
     * 伤害表现
     */
    public showHram(isDie, damageType, target: CharMonster, sourceTarget, hramValue, isDir: boolean = true, isFs: boolean = true, logStr: string = "", hitCount: number = 1, elementRestrainType: ElementRestrainType = ElementRestrainType.NOTYPE, isSkill: boolean = false) {
        // this.trace(target.infoModel.handle + " -- 受到" + (isFs ? "普通伤害" : "反伤伤害 ") + hramValue + ", 当前剩余血量:" + target.getHP() + "	--" + logStr);
        //this.trace("---剩余血量 " + target.getHP());
        //显示对象血条扣血
        target.hram(hramValue);
        //飘血
        // MessageCenter.ins().dispatch(MessagerEvent.SHOW_BLOOD,
        // 	target, 
        // 	isDir ? sourceTarget : null,
        // 	isCrit ? DamageTypes.CRIT : DamageTypes.HIT,
        // 	hramValue);
        // GameLogic.ins().postEntityHpChange(target, isDir ? sourceTarget : null, isCrit ? DamageTypes.CRIT : DamageTypes.HIT, hramValue);
        if (hramValue == 0) {
            hramValue = 1;
            isDir = false;
        }
        GameLogic.ins().postEntityHpChange(target, isDir ? sourceTarget : null, damageType, hramValue, hitCount, [elementRestrainType, isSkill]);//,hitCount
        //死亡
        if (isDie) {
            target.stopMove();
            // this.trace("移除定时器 --- " + tHandle);
            // TimerManager.ins().removeAll(tHandle);
            //复活
            if (!target.hasBuff(52001) &&
                this.triggerExAttr(target, ExAttributeType.eatGodBlessProbability)) {
                target.AI_STATE = AI_State.Stand;
                target.removeAllBuff();
                var r = target.infoModel.getAtt(AttributeType.atMaxHp) * target.infoModel.getAttEx(ExAttributeType.eatGodBlessRate) / 10000;
                target.infoModel.setAtt(AttributeType.atHp, r);
                target.hram(-r);
                this.trace("复活后剩余血量" + target.getHP());
            }
            else {
                this.trace(target.infoModel.handle + " -- 死亡，等待删除形象");
                let t = 500
                if (target.team == Team.Monster) {
                    egret.Tween.get(target).to({
                        "alpha": 0
                    }, t).call(() => {
                        egret.Tween.removeTweens(target);
                    });
                }
                TimerManager.ins().doTimer(t, 1, () => {
                    this.trace(target.infoModel.handle + " -- 删除");
                    //App.TimerManager.removeAll(tHandle);
                    EntityManager.ins().removeByHandle(target.infoModel.handle);
                    OtherAIModel.getInstance.releaseMonster(target.infoModel.handle);
                    OtherAIModel.getInstance.releaseRole(target.infoModel.handle);
                    this.checkAIend(sourceTarget.team, target.team);
                }, this);
                if (target.team == Team.Monster) {
                    //计算掉落
                    var x_Grid = Math.floor(target.x / GameMap.CELL_SIZE);
                    var y_Grid = Math.floor(target.y / GameMap.CELL_SIZE);
                    // var itemData = UserFb.ins().getRewardsPop();
                    // for (var j = 0; itemData && j < itemData.drops.length; j++) {
                    //     Encounter.postCreateDrop(x_Grid, y_Grid, itemData.drops[j]);
                    // }
                    let itemData = GameLogic.ins().GetReward(target.handle)
                    for (var j = 0; itemData && j < itemData.length; j++) {
                        Encounter.postCreateDrop(x_Grid, y_Grid, itemData[j]);
                    }

                    if (GameMap.IsNoramlLevel() && target.infoModel.type != EntityType.WillDummyMonster) {
                        UserFb.ins().sendWaveMonster()
                    }
                }
            }
        }
        else {
            if (target.AI_STATE != AI_State.Die && isFs && hramValue > 0) {
            }
        }
    };

    // 在一些判定中需要考虑路人
    static IsMyTeam(team: Team) {
        return team == Team.My || team == Team.PASSERBY
    }

    /**
     * 检查是否结束战斗
     * @param st	击杀者队伍
     * @param t	 被击杀者队伍
     */
    public checkAIend(st, t) {
        var count = EntityManager.ins().getTeamCount(t);
        // if (count == 1) {
        //     /**做一个容错处理 */
        //     for (let key in EntityManager.ins().entityList) {
        //         let charMonster = EntityManager.ins().entityList[key];
        //         if (charMonster.infoModel.type == EntityType.Monster) {
        //             if (charMonster.AI_STATE == AI_State.Die && charMonster.infoModel.getAtt(AttributeType.atHp) > 0) {
        //                 egret.log("容错怪物状态死了但是还是有血");
        //                 charMonster.AI_STATE = AI_State.Stand;
        //                 charMonster.visible = true;
        //                 charMonster.alpha = 1;
        //             }
        //         }
        //     }
        // }
        if (count) {
            return
        }
        // 等待全部刷新完成
        if (newAI.IsMyTeam(st) && !GameLogic.ins().IsRepeatCreateFinish()) {
            return
        }
        if (!count) {
            switch (st) {
                case Team.My:
                case Team.PASSERBY:
                    EntityManager.ins().resetRole();
                    //胜利
                    switch (t) {
                        case Team.Monster:
                            DropHelp.start();
                            this.trace('开始捡东西');
                            break;
                        case Team.WillBoss:
                            // ControllerManager.ins().applyFunc(
                            // 	ControllerConst.WillBoss,
                            // 	WillBossFunc.SEND_RESULT,
                            // 	true);
                            Encounter.ins().sendResult(true);
                            this.trace("pkboss成功");
                            break;
                        case Team.WillEntity:
                            // Encounter.ins().sendFightResult(1);
                            // this.trace("pk敌人成功");
                            break;
                    }
                    break;
                //失败
                case Team.WillBoss:
                    // ControllerManager.ins().applyFunc(ControllerConst.WillBoss,
                    // 	WillBossFunc.SEND_RESULT,
                    // 	false);
                    Encounter.ins().sendResult(false);
                    this.trace("pkboss失败");
                    break;
                case Team.WillEntity:
                    // Encounter.ins().sendFightResult(0);
                    // this.trace("pk敌人失败");
                    break;
                case Team.Monster:
                    EntityManager.ins().resetRole();
                    break;
            }
            //this.stop();
            if (this.inited) {
                //  this.timer.stop();
                // TimerManager.ins().remove(this.startAI, this);
                // TimerManager.ins().remove(this.startRoleAI, this);
            }
        }
    };
    public damageBaseCalculation(selfTarget, target) {
        var hCode = selfTarget.infoModel.handle;
        var skill = this.curSkill[hCode];
        var attrValue = 0;
        var tempValue = 0;
        var damage = 0;
        if (skill.targetType == TargetType.Enemy) {
            //攻击技能
            if (skill.args) {
                if (SkillsConfig.isPhysical(skill)) {
                    attrValue = GameLogic.calculateRealAttribute(target, AttributeType.atDef);
                }
                else if (SkillsConfig.isMagic(skill)) {
                    attrValue = GameLogic.calculateRealAttribute(target, AttributeType.atRes);
                }
                tempValue = attrValue * (1 - selfTarget.infoModel.getAtt(AttributeType.atPenetrate) / 10000);
                let valueArgs: number = 0;
                if (skill.valueArgs) {
                    valueArgs = skill.valueArgs.a * skill.valueArgs.attr + skill.valueArgs.b;
                }
                let atkValue = selfTarget.infoModel.getAtt(AttributeType.atAttack);
                atkValue = atkValue + Math.floor(atkValue * selfTarget.infoModel.getAtt(AttributeType.atAtkEx) / 10000);
                damage = atkValue * (skill.args.a + valueArgs) - tempValue + skill.args.b;
                damage = Math.max(damage, 1);
            }
        }
        //挂机的怪物 和  pkboss 打人不掉血  神兽打人有伤害
        if (selfTarget instanceof CharMonster && (selfTarget.team == Team.Monster || selfTarget.team == Team.WillBoss)) {
            //神兽的攻击掉血
            if (selfTarget.infoModel.name != "神兽") {
                damage = 0;
            }
        }
        //魔法盾buff，抵消伤害
        var buff = target.buffList[19001];
        if (buff) {
            var skillEff = buff.effConfig;
            var dxValue = Math.floor(damage * skillEff.args.a); //抵消的伤害
            buff.value -= dxValue; //扣抵伤值
            if (buff.value <= 0) {
                target.removeBuff(buff);
            }
            damage = damage - dxValue + (buff.value < 0 ? -buff.value : 0); //实际伤害
        }
        return damage;
    };

    public damageElement(selfTarget: CharMonster, target: CharMonster): { elementRestrainType: ElementRestrainType, damage: number } {
        let selfMainEle = selfTarget.infoModel.attrElementMianType;
        let tarMainEle = target.infoModel.attrElementMianType;
        let damage = 0;
        let selfDamage = selfTarget.infoModel.attrElementData[selfMainEle - 1];
        let tarEleDef = target.infoModel.attrElementData[(selfMainEle - 1) + 5];
        let isK: boolean = false;
        let isBK: boolean = false;
        let addDamage = 0;
        let elementRestrainType = ElementRestrainType.NOTYPE;
        if (AttributeData.getElementKType(selfMainEle) == tarMainEle) {
            isK = true;
            elementRestrainType = ElementRestrainType.KTYPE;
        } else if (AttributeData.getElementBKType(selfMainEle) == tarMainEle) {
            isBK = true;
            elementRestrainType = ElementRestrainType.BKTYPE;
        }
        let elementConfig = GlobalConfig.ins("elementConfig");
        if (isK) {
            addDamage = elementConfig.elementEffect1 / 100;
        } else if (isBK) {
            addDamage = -(elementConfig.elementEffect2 / 100);
        }
        damage = (selfDamage - tarEleDef) * (1 + addDamage);
        if (damage < 0) {
            damage = 0;
        }
        let data = { elementRestrainType: elementRestrainType, damage: damage };
        return data;
    }
    public skillEffValue(selfTarget) {
        var hCode = selfTarget.infoModel.handle;
        var skill = this.curSkill[hCode];
        var effValue = 0;

        if (this.effectsConfig == null)
            this.effectsConfig = GlobalConfig.ins("EffectsConfig");

        var skillEff = skill.selfEff ? this.effectsConfig[skill.selfEff[0]] : null;
        if (skillEff) {
            if (skillEff.args) {
                switch (skillEff.type) {
                    //中毒
                    case SkillEffType.DAMAGE:
                        effValue = selfTarget.infoModel.getAtt(skillEff.args.b) * skillEff.args.a + skillEff.args.c;
                        break;
                    //加血所以是负数
                    case SkillEffType.ADD_HP:
                        effValue = selfTarget.infoModel.getAtt(skillEff.args.b) * skillEff.args.a + skillEff.args.c;
                        effValue = -effValue;
                        break;
                    //附加属性
                    case SkillEffType.ADD_ATTR:
                        let valueArgs: number = 0;
                        if (skillEff.valueArgs) {
                            valueArgs = skillEff.valueArgs.a * skillEff.valueArgs.b + skillEff.valueArgs.c;
                        }
                        effValue = selfTarget.infoModel.getAtt(skillEff.args.b) * (skillEff.args.a + valueArgs) + skillEff.args.c;
                        break;
                    //附加状态
                    case SkillEffType.STATE:
                        effValue = selfTarget.infoModel.getAtt(skillEff.args.b) * skillEff.args.c;
                        break;
                }
            }
            effValue = effValue >> 0;
        }
        return effValue;
    };
    public triggerAttr(selfTarget: CharMonster, type: AttributeType): boolean {
        var attrValue = selfTarget.infoModel.getAtt(type);
        var buffs = selfTarget.buffList;
        var buff: EntityBuff;
        for (var i in buffs) {
            buff = buffs[i];
            if (buff.effConfig.type == SkillEffType.ADD_ATTR
                && buff.effConfig.args.d == type) {
                attrValue += buff.value;
            }
        }
        if (attrValue) {
            var r = Math.random();
            if (r < attrValue / 10000) {
                return true;
            }
        }
        return false;
    };
    public triggerExAttr(selfTarget: CharMonster, type: ExAttributeType): boolean {
        var attrValue = selfTarget.infoModel.getAttEx(type);
        if (attrValue) {
            var r = Math.random();
            if (r < attrValue / 10000) {
                return true;
            }
        }
        return false;
    };
    public tryUseSkill(selfTarget) {
        var hCode = selfTarget.infoModel.handle;
        var skill = this.curSkill[hCode];
        if (!skill) {
            return false
        }
        var target = this.curTarget[hCode];
        //计算距离
        var xb = MathUtils.getDistance(selfTarget.x, selfTarget.y, target.x, target.y);
        //距离在技能范围内，攻击目标
        return xb <= skill.castRange * Const.CELL_SIZE;
    };

    public targetStartMove(selfTarget) {
        var hCode = selfTarget.infoModel.handle;
        var skill = this.curSkill[hCode];
        if (!skill) {
            return false
        }
        var target = this.curTarget[hCode];
        //计算距离
        var xb = MathUtils.getDistance(selfTarget.x, selfTarget.y, target.x, target.y);
        //距离在技能范围内，攻击目标
        return xb < skill.castRange * Const.CELL_SIZE * 3;
    };
    /**筛选技能 */
    public screeningSkill(hCode) {
        if (!hCode) {
            return;
        }
        var target = newAI.ins().aiList[hCode];
        if (!target) {
            target = OtherAIModel.getInstance.aiRoleList.get(hCode);
        }
        if (!target) {
            target = OtherAIModel.getInstance.aiMonsterList.get(hCode);
        }
        var isRole = target instanceof CharRole;
        this.skillCD[hCode] = this.skillCD[hCode] || {};
        if (!isRole) {
            if (this.skillConfig == null)
                this.skillConfig = GlobalConfig.skillsConfig;
            if (target.infoModel.summonSkillId > 0) {
                this.curSkill[hCode] = this.skillConfig[target.infoModel.summonSkillId];//this.skillConfig[50002]; //怪物通用技能
            }
            else
                this.curSkill[hCode] = this.skillConfig[50000]; //怪物通用技能
            return;
        }
        var skill = this.curSkill[hCode];
        if (skill) {
            return;
        }
        let selfTarget = <CharRole>target
        var skills = [];
        if (selfTarget.team == Team.PASSERBY) {
            skills = selfTarget.infoModel.getpPasserbySkillIDs();
        }
        else {
            skills = selfTarget.infoModel.getSkillIDs();
        }

        var len = skills.length;
        var canUseSkill = [];
        if (this.skillConfig == null)
            this.skillConfig = GlobalConfig.skillsConfig;
        if (selfTarget.isCanRandomSkill == true) {
            for (var i = 0; i < len; i++) {
                let configSkill = this.skillConfig[skills[i]];
                if (configSkill.skillType == SkillType.TYPE7) {
                    canUseSkill.push(configSkill);
                    selfTarget.isPlayRandomSkill = true;
                    break;
                }
            }
        } else {
            for (var i = 0; i < len; i++) {
                //获取技能配置
                let configSkill = this.skillConfig[skills[i]];
                if (selfTarget.isPlayRandomSkill == true) {
                    if (configSkill.skillType != selfTarget.playRandomType) {
                        continue
                    }
                }
                if (configSkill.skillType == SkillType.TYPE4 || configSkill.skillType == SkillType.TYPE5 || configSkill.skillType == SkillType.TYPE7) {
                    continue;
                }
                //检查是否有减cd的buff
                let cutCd: number = 0;
                let selfBuffList = selfTarget.buffList;
                for (var groupID in selfBuffList) {
                    var buff = selfBuffList[groupID];
                    if (buff.effConfig.type == SkillEffType.CHANGE_CD) {
                        if (configSkill.skillType == buff.effConfig.args.a) {
                            cutCd = buff.effConfig.args.b;
                        }
                    }
                }
                //检查是否有减cd的被动技能
                let infoModel = <Role>target.infoModel;
                let passSkillId: number[] = infoModel.getAllPassSkillId();
                let effConfig = GlobalConfig.ins("EffectsConfig");
                for (var f = 0; f < passSkillId.length; f++) {
                    let effConfigData = effConfig[passSkillId[f]]
                    if (effConfigData.type == SkillEffType.CHANGE_CD) {
                        if (configSkill.skillType == effConfigData.args.a) {
                            cutCd = effConfigData.args.b;
                        }
                    }
                }
                //是否还在上次cd中
                if (!selfTarget.isPlayRandomSkill) {
                    if (egret.getTimer() - this.skillCD[hCode][configSkill.id] < (configSkill.cd + configSkill.cd * (cutCd / 100)))
                        continue;
                    if (configSkill.skillType != SkillType.TYPE5 && configSkill.skillArgs.skillCost > selfTarget.infoModel.getAtt(AttributeType.atMp) && configSkill.skillArgs.skillCost != 0)
                        continue;
                }
                //添加到可使用列表中
                canUseSkill.push(configSkill);
            }
        }
        //排序优先级
        canUseSkill.sort(this.sortFunc);
        var skillEff;
        var skillIndex = 0;
        if (selfTarget.isPlayRandomSkill == true) {
            skillIndex = Math.floor(Math.random() * canUseSkill.length);
        }
        skill = canUseSkill[skillIndex];

        if (this.effectsConfig == null)
            this.effectsConfig = GlobalConfig.ins("EffectsConfig");

        skillEff = (skill && skill.tarEff) ? this.effectsConfig[skill.tarEff[0]] : null;
        let selfSkillEff = (skill && skill.selfEff) ? this.effectsConfig[skill.selfEff[0]] : null;
        //如果是召唤技能
        if (selfSkillEff && selfSkillEff.type == SkillEffType.SUMMON) {
            //如果已经使用技能了，再取一个技能
            if (selfTarget.hasBuff(selfSkillEff.group))
                skill = canUseSkill[++skillIndex];
        }
        skillEff = (skill && skill.tarEff) ? this.effectsConfig[skill.tarEff[0]] : null;
        //如果是加血技能
        if (skillEff && skillEff.type == SkillEffType.ADD_HP) {
            //如果没有加血对象，再取一个技能
            if (!EntityManager.ins().checkCanAddBlood(selfTarget.team))
                skill = canUseSkill[++skillIndex];

            //如果是召唤技能,这里多判断一次，之前机制有bug,策划现在修改了优先级，就出问题
            selfSkillEff = (skill && skill.selfEff) ? this.effectsConfig[skill.selfEff[0]] : null;
            if (selfSkillEff && selfSkillEff.type == SkillEffType.SUMMON) {
                //如果已经使用技能了，再取一个技能
                if (selfTarget.hasBuff(selfSkillEff.group))
                    skill = canUseSkill[++skillIndex];
            }
        }
        //抗拒火环
        if (skill && skill.icon == 23001) {
            //没有可攻击的对象，获取下一个技能
            if (!EntityManager.ins().checkCount(selfTarget, skill.affectRange))
                skill = canUseSkill[++skillIndex];
        }
        //半月弯刀
        if (skill && skill.icon == 13001) {
            //没有可攻击的对象，获取下一个技能
            if (!EntityManager.ins().checkCount(selfTarget, skill.affectRange, 2))
                skill = canUseSkill[++skillIndex];
        }
        selfTarget.isCanRandomSkill = false;
        if (!selfTarget.isPlayRandomSkill) {
            if (skill && skill.skillType == SkillType.TYPE2) {
                for (var i = 0; i < skills.length; i++) {
                    let configSkill = this.skillConfig[skills[i]];
                    if (configSkill.skillType == SkillType.TYPE7) {
                        let effectsConfig = GlobalConfig.ins("EffectsConfig")[configSkill.id];
                        if (effectsConfig) {
                            if (configSkill.type == egret.getTimer() - this.skillCD[hCode][configSkill.id] < (configSkill.cd + configSkill.cd)) {
                                break;
                            }
                            let ram = Math.random() * 100;
                            if (ram < effectsConfig.args.a) {
                                let isCanRun = false;
                                for (var i = 0; i < skills.length; i++) {
                                    let configSkill = this.skillConfig[skills[i]];
                                    if (configSkill.skillType == effectsConfig.args.b) {
                                        isCanRun = true;
                                        selfTarget.playRandomType = effectsConfig.args.b;
                                        break;
                                    }
                                }
                                if (isCanRun) {
                                    selfTarget.isCanRandomSkill = true;
                                }
                            }
                        }
                        break;
                    }
                }
            }
        }
        this.curSkill[hCode] = skill;
    };

    public sortFunc(a, b) {
        if (a.priority > b.priority)
            return 1;
        if (a.priority < b.priority)
            return -1;
        return 0;
    };


    /**选择目标 */
    public screeningTarget(selfTarget) {
        var hCode = selfTarget.infoModel.handle;
        var skill = this.curSkill[hCode];
        var targetType = skill.targetType;
        var tempArr = EntityManager.ins().screeningTargetByPos(selfTarget, targetType == TargetType.Friendly);
        this.curTarget[hCode] = tempArr ? tempArr[0] : null;
    }
    // private _GetNextPowerSkillTime() {
    //     return egret.getTimer() + GlobalConfig.skillsConfig[UserSkill.POWER_SKILL].cd
    // }

    public trace(str) {
        var a = this.aaa == Team.Monster;
        if (this.isLog)
            console.log(str);
    };
    aaa: Team;
    /** AI循环时间非角色 */
    public static AI_UPDATE_TIME = 200;
    /** AI循环时间角色 */
    public static AI_UPDATEROLE_TIME = 100;
    /** 其他玩家AI循环时间 */
    public static OTHER_UPDATE_TIME = 300;
}

enum Team {
    My = 0,
    Monster = 1,
    WillEntity = 2,
    WillBoss = 3,
    NotAtk = 4,

    // 路人
    PASSERBY = 5,
    MyTeamMenber = 6,
}

enum TargetType {
    Friendly = 1,
    Enemy = 2,
    My = 3,
}

enum AI_State {
    Stand = 0,
    Run = 1,
    Atk = 2,
    Die = 3,
}

window["newAI"] = newAI