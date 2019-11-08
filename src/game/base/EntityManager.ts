class EntityManager extends BaseClass {

    static readonly MAX_SHOW_NUM = 10

    entityList: { [key: string]: CharMonster } = {};
    distances = [];
    listCount = [];
    isHideOther: boolean;
    willBoss: CharMonster;
    encounterIndex: number;

    public constructor() {
        super();
        MessageCenter.addListener(UserFb.ins().postGuanKaIdChange, this.updateEncounter, this);
    }

    public static ins(): EntityManager {
        return super.ins();
    }
    public updateEncounter() {
        //this.encounterRoles.forEach((value: CharEncounter, index: number, array: CharEncounter[]) => {
        //	value.setData(value.infoModel);
        //});
    };
    public resetRole(): void {
        var len = SubRoles.ins().subRolesLen;
        for (var i = 0; i < len; i++) {
            var model = SubRoles.ins().getSubRoleByIndex(i);
            if (!this.getEntityByHandle(model.handle)) {
                model.setPos(Const.PosToPixel(DropHelp.tempDropPoint.x), Const.PosToPixel(DropHelp.tempDropPoint.y));
                // console.log("--------------所有角色重置----------------");
                GameLogic.ins().createEntityByModel(model);
            }
        }
    };
    public isMySubRole(handle: number): boolean {
        var len = SubRoles.ins().subRolesLen;
        for (var i = 0; i < len; i++) {
            if (SubRoles.ins().getSubRoleByIndex(i).handle == handle)
                return true;
        }
        return false;
    };
    public addList(char: CharMonster): void {
        if (!char.infoModel.handle)
            char.infoModel.handle = char.hashCode;
        this.entityList[char.infoModel.handle] = char;
        var count = this.listCount[char.team] || 0;
        this.listCount[char.team] = ++count;
    };

    public IsHideMap() {
        if (GameMap.fbType == UserFb.FB_TYPE_ZHUANSHENGBOSS) {
            return true
        }
        if (GameMap.fbType == UserFb.FB_TYPE_WORLDBOSS) {
            return true
        }
        if (GameMap.fubenID == UserFb.FB_ID_TYPE_WAR) {
            return true
        }
        return false
    }

    public createEntity(model: EntityModel, ...param: any[]): CharMonster {
        switch (model.type) {
            case EntityType.Role:
            case EntityType.LadderPlayer: {
                var roleModel = <Role>model;
                if (GameMap.IsTeamFb()) {
                    roleModel.team = Team.My;
                } else
                    if (model.masterHandle && model.masterHandle == GameLogic.ins().actorModel.handle) {
                        roleModel.team = Team.My;
                    } else {
                        roleModel.team = Team.WillEntity;
                    }
                var role: CharRole = ObjectPool.ins().pop("CharRole");
                role.substituteImg.visible = true;
                role.scaleX = role.scaleY = .8;
                if (roleModel.team == Team.My) {
                    //把属性数据合拼到子角色信息里
                    let data = SubRoles.ins().getSubRoleByIndex(roleModel.roleID);
                    if (data) {
                        roleModel = data.mergeData(roleModel);
                    }
                }
                role.setCharName(roleModel.guildAndName);
                role.setElementImg(roleModel.attrElementMianType);

                role.infoModel = roleModel;
                //血条变色
                GameMap.IsGuildWar()
                    ? role.isMy(roleModel.guildID == GameGlobal.actorModel.guildID)
                    : role.isMy(role.team == Team.My)
                role.x = roleModel.x;
                role.y = roleModel.y;
                role.updateBlood(true);
                role.m_LoadResFoce = false
                if (role.team == Team.My) {
                    //更新ui血量显示 血量更新需要在updateBlood之后
                    GameLogic.ins().postHpChange();
                    GameLogic.ins().postMpChange();
                }
                this.addList(role);
                newAI.ins().add(role);
                if (this.IsHideMap() && roleModel.team != Team.My) {
                    if (this.isHideOther) {
                        return null
                    }
                    if (this.countShowNum() > EntityManager.MAX_SHOW_NUM) {
                        return null
                    }
                }
                role.m_LoadResFoce = true
                role.updateModel();
                if (role.team == Team.My) {
                    GameLogic.ins().postMoveCamera();
                }
                OtherAIModel.getInstance.creatorAIRole();
                role.AI_STATE = AI_State.Stand;
                MessageCenter.ins().dispatch(MessageDef.CREATE_CHARO_MSG);
                return role;
            }
            case EntityType.Pet:
            case EntityType.Monster: {
                if (model.masterHandle && model.masterHandle != 0) {
                    if (this.isMySubRole(model.masterHandle))
                        model.team = Team.My;
                    else
                        model.team = Team.WillEntity;
                }
                else
                    model.team = Team.Monster;
                //转生boss
                // if (GameMap.fbType == UserFb.FB_TYPE_ZHUANSHENGBOSS &&
                //     model.team == Team.WillEntity &&
                //     (this.isHideOther || this.getTeamCount(Team.WillEntity) > 10)) {
                //         return null;
                // }
                //取对象池里的缓存
                var monster: CharMonster = ObjectPool.ins().pop("CharMonster");
                monster.substituteImg.visible = true;
                monster.scaleX = monster.scaleY = .8;
                //重置缓存
                // monster.reset();
                //设置model数据
                monster.infoModel = model;
                monster.x = model.x;
                monster.y = model.y;
                //monster.x = Const.PosToPixel(model.x);
                //monster.y = Const.PosToPixel(model.y);
                monster._dir = 3;
                monster.updateBlood(true);
                monster.setCharName(model.name + " lv" + model.lv);
                if (!model.attrElementMianType) {
                    model.setElementByConfig();
                }
                monster.setElementImg(model.attrElementMianType);
                // //设置主体形象
                monster.initBody(model.avatarFileName);
                if (model.avatarFileName.indexOf("monster20026") != -1) {
                    egret.log(model.avatarFileName);
                }
                monster.m_LoadResFoce = false
                monster.isMy(model.team == Team.My);
                this.addList(monster);
                newAI.ins().add(monster);
                model.teamId = monster.infoModel.handle;
                // if (GameMap.fbType == UserFb.FB_TYPE_ZHUANSHENGBOSS || GameMap.fbType == UserFb.FB_TYPE_WORLDBOSS) {
                //     monster._hpBar.visible = false;
                //     monster._nameTxt.visible = false;
                // } else {
                //     monster._hpBar.visible = true;
                //     monster._nameTxt.visible = true;
                // }

                if (this.IsHideMap() && (monster.team == Team.My || monster.team == Team.WillEntity)) {
                    if (this.isHideOther) {
                        return null
                    }
                    if (this.countShowNum() > EntityManager.MAX_SHOW_NUM) {
                        return null
                    }
                }
                //设置主体形象
                monster.m_LoadResFoce = true
                if (model.monstersType == 1)
                    monster.setFootRing(CharMonster.FOOT_RING_TYPE_LEVEL_BOSS);
                if (monster.infoModel.isPet) {
                    let config = GlobalConfig.ins("PetConfig");
                    for (let key in config) {
                        let petConfig = config[key];
                        if (petConfig.monsterId == monster.infoModel.configID) {
                            monster.infoModel.summonSkillId = petConfig.skill[0];
                        }
                    }
                }
                monster.AI_STATE = AI_State.Stand;
                MessageCenter.ins().dispatch(MessageDef.CREATE_CHARO_MSG);
                return monster;
            }
            case EntityType.Encounter: {
                // var encounter = <CharEncounter> ObjectPool.pop('CharEncounter');
                // encounter.setData(model);
                // encounter.reset();
                // this.encounterList[model.index] = encounter;
                // return encounter;
                break
            }
            case EntityType.WillDummy: {
                /**原本的 */
                // var encounter = <CharDummy>ObjectPool.ins().pop('CharDummy');
                // encounter.setData(model);
                // encounter.scaleX = encounter.scaleY = .8;
                // this.encounterList[model.index] = encounter;
                // return encounter as any;

                var roleModel = <Role>model;
                roleModel.team = Team.My;
                var role: CharRole = ObjectPool.ins().pop("CharRole");
                role.scaleX = role.scaleY = .8;
                role.setCharName(roleModel.guildAndName);
                role.setElementImg(roleModel.attrElementMianType);

                role.infoModel = roleModel;
                //血条变色
                GameMap.IsGuildWar()
                    ? role.isMy(roleModel.guildID == GameGlobal.actorModel.guildID)
                    : role.isMy(role.team == Team.My)
                role.x = roleModel.x;
                role.y = roleModel.y;
                role.updateBlood(true);
                role.m_LoadResFoce = false
                if (role.team == Team.My) {
                    //更新ui血量显示 血量更新需要在updateBlood之后
                    GameLogic.ins().postHpChange();
                    GameLogic.ins().postMpChange();
                }
                // this.addList(role);
                // newAI.ins().add(role);
                if (this.IsHideMap() && roleModel.team != Team.My) {
                    if (this.isHideOther) {
                        return null
                    }
                    if (this.countShowNum() > EntityManager.MAX_SHOW_NUM) {
                        return null
                    }
                }
                role.m_LoadResFoce = true
                role.updateModel();
                role.AI_STATE = AI_State.Stand;
                return role;
            }
            case EntityType.WillDummyMonster: {
                model.team = Team.Monster;
                //取对象池里的缓存
                var monster: CharMonster = ObjectPool.ins().pop("CharMonster");
                monster.scaleX = monster.scaleY = .8;
                //重置缓存
                //设置model数据
                monster.infoModel = model;
                monster.x = model.x;
                monster.y = model.y;
                monster.updateBlood(true);
                monster.isMy(false);
                monster.setCharName(model.name + " lv" + model.lv);
                if (!model.attrElementMianType) {
                    model.setElementByConfig();
                }
                monster.setElementImg(model.attrElementMianType);
                // //设置主体形象
                monster.initBody(model.avatarFileName);
                if (model.avatarFileName.indexOf("monster20026") != -1) {
                    egret.log(model.avatarFileName);
                }
                monster.m_LoadResFoce = false

                if (this.IsHideMap() && (monster.team == Team.My || monster.team == Team.WillEntity)) {
                    if (this.isHideOther) {
                        return null
                    }
                    if (this.countShowNum() > EntityManager.MAX_SHOW_NUM) {
                        return null
                    }
                }
                //设置主体形象
                monster.m_LoadResFoce = true
                monster.AI_STATE = AI_State.Stand;
                return monster;
            }
            case EntityType.WillBoss: {
                // if (1 == 1) return null; //先取消遭遇boss
                //取对象池里的缓存
                var monster: CharMonster = ObjectPool.ins().pop("CharMonster");
                monster.scaleX = monster.scaleY = .8;
                //重置缓存
                // monster.reset();
                //设置model数据
                monster.infoModel = model;
                monster.x = model.x;
                monster.y = model.y;
                monster.updateBlood(true);
                monster.setCharName(model.name + " lv" + model.lv);
                if (!model.attrElementMianType) {
                    model.setElementByConfig();
                }
                monster.setElementImg(model.attrElementMianType);
                //设置主体形象
                monster.initBody(model.avatarFileName);
                this.removeWillBoss();
                this.willBoss = monster;
                this.willBoss.touchEnabled = true;
                this.willBoss.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.onTouchBegin, this);
                monster.AI_STATE = AI_State.Stand;
                return monster;
            }
            case EntityType.WillBossMonster: {
                model.team = Team.WillBoss;
                //取对象池里的缓存
                var monster: CharMonster = ObjectPool.ins().pop("CharMonster");
                monster.scaleX = monster.scaleY = .8;
                //重置缓存
                // monster.reset();
                //设置model数据
                monster.infoModel = model;
                monster.x = model.x;
                monster.y = model.y;
                monster.updateBlood(true);
                monster.setCharName(model.name + " lv" + model.lv);
                monster.setElementImg(model.attrElementMianType);
                //设置主体形象
                monster.initBody(model.avatarFileName);
                monster.isMy(false);
                if (!model.handle)
                    model.handle = monster.hashCode;
                this.addList(monster);
                //console.log("创建----" + model.handle);
                newAI.ins().add(monster);
                monster.AI_STATE = AI_State.Stand;
                return monster;
            }
        }
        return null;
    };
    public onTouchBegin(e) {
        if (this.getTeamCount(Team.WillBoss) > 0) {
            UserTips.ins().showTips("|C:0xf87372&T:" + GlobalConfig.jifengTiaoyueLg.st101822 + "|");
            return;
        }
        if (GameMap.fubenID != 0) {
            UserTips.ins().showTips("|C:0xf87372&T:" + GlobalConfig.jifengTiaoyueLg.st100545 + "|");
            return;
        }
        e.stopPropagation();
        newAI.ins().stop();
        DropHelp.clearDrop();
        this.removeAllEnemy();
        OtherAIModel.getInstance.releaseAll();
        this.willBoss.infoModel.type = EntityType.WillBossMonster;
        GameLogic.ins().createEntityByModel(this.willBoss.infoModel);
        this.removeWillBoss();
        newAI.ins().start();
    };

    public removeWillBoss(): void {
        if (this.willBoss) {
            this.willBoss.removeEventListener(egret.TouchEvent.TOUCH_BEGIN, this.onTouchBegin, this);
            // this.willBoss.destruct(true);
            if (this.willBoss.parent)
                DisplayUtils.dispose(this.willBoss);
            this.willBoss = null;
        }
    };
    public removeAll(): void {
        for (var i in this.entityList) {
            this.removeByHandle(Number(i), true, true);
        }
        // this.encounterIndex = undefined;
        this.removeWillBoss();
        this.entityList = {};
        OtherAIModel.getInstance.releaseAll();
    };


    public removeAllEnemy(): void {
        for (var i in this.entityList) {
            if (!newAI.IsMyTeam(this.entityList[i].team)) {
                this.removeByHandle(Number(i));
            } else {
                this.entityList[i].stopMove();
                this.entityList[i].atking = false;
                this.entityList[i].playAction(EntityAction.STAND);
                this.entityList[i].AI_STATE = AI_State.Stand;
                newAI.ins().add(this.entityList[i]);
            }
        }
    };
    public hideOtherEntity(b: boolean): void {
        this.isHideOther = b;
        for (var i in this.entityList) {
            if (this.entityList[i] == null) continue;
            if (this.entityList[i].team != Team.WillEntity)
                continue;

            if (b) {
                if (this.entityList[i].parent != null) {
                    DisplayUtils.removeFromParent(this.entityList[i]);
                }
            }
            else {
                if (this.entityList[i].parent == null) {
                    GameLogic.ins().addEntity(this.entityList[i]);
                }
            }
        }
    };

    public removeByHandle(handle: number, setDropPoint: boolean = true, isRemove: boolean = false): void {
        var entity = this.entityList[handle]
        if (!entity) {
            return
        }
        let char = this.entityList[handle]
        if (char) {
            char.stopMove();
        }
        delete this.entityList[handle]
        var count = this.listCount[entity.team] || 0;
        this.listCount[entity.team] = --count;
        newAI.ins().remove(entity);
        if (setDropPoint)
            DropHelp.setTempDropPoint(Const.PixelToPos(entity.x), Const.PixelToPos(entity.y))

        DisplayUtils.dispose(entity);
        entity = null;
    };
    public RemoveFromList(handle: number) {
        var entity = this.entityList[handle]
        if (!entity) {
            console.warn(`entitymanager.removebyhandle entity is null [${handle}]`)
            return
        }
        delete this.entityList[handle]
    }
    public getEntityByHandle(handle: number): CharMonster {
        return this.entityList[handle];
    };
    public getMainRole(index): CharRole {
        return <CharRole>this.getEntityByHandle(SubRoles.ins().getSubRoleByIndex(index).handle);
    };
    public getNoDieRoleIndex(): number {
        var len = SubRoles.ins().subRolesLen;
        var role: CharMonster;
        for (var k = 0; k < len; k++) {
            role = EntityManager.ins().getMainRole(k);
            if (role)
                return k;
        }
        return -1;
    };
    public GetRoles(): CharRole[] {
        let roles: CharRole[] = []
        for (var k = 0, len = SubRoles.ins().subRolesLen; k < len; k++) {
            let role = EntityManager.ins().getMainRole(k);
            if (role) {
                roles.push(role)
            }
        }
        return roles
    }

    /**
     *  取场景内的玩家对象（不包括自己）
     * 结构[[CharRole：玩家1,CharRole:玩家2],[CharRole：玩家1]]
     * 默认（不包括自己）（只有敌人）
     * containsOwn=false(不包括自己)
     * containsOther=false(不包括敌人)
     * containsOwn=true containsOther=true (包括所有)
    */
    public getRolesList(containsOwn: boolean = false, containsOther: boolean = true): Array<CharRole> {
        let roles: Array<CharRole> = []
        let char;
        let k: string = '';
        let obj: any = {};
        for (var key in this.entityList) {
            char = this.entityList[key];
            if (char) {
                if (char instanceof CharRole) {
                    k = char.infoModel.name;
                    if (k == GameLogic.ins().actorModel.name && !containsOwn)//如果是自己跳出
                        continue;
                    if (k != GameLogic.ins().actorModel.name && !containsOther)
                        continue;
                    if (obj[k] == null) {
                        obj[k] = [];
                    }
                    obj[k].push(char);
                }
            }
        }

        for (key in obj) {
            roles[roles.length] = obj[key];
        }

        return roles;
    }
    public getMyBaseRole(): CharRole {
        for (var key in this.entityList) {
            let char = this.entityList[key];
            if (char) {
                if (char instanceof CharRole) {
                    let k = char.infoModel.name;
                    if (k == GameLogic.ins().actorModel.name && char.infoModel.roleID == 0) {
                        return char;
                    }
                }
            }
        }
        return null;
    }
    public getMyRoleList(): CharRole[] {
        let roleList = [];
        for (var key in this.entityList) {
            let char = this.entityList[key];
            if (char) {
                if (char instanceof CharRole) {
                    let k = char.infoModel.name;
                    if (k == GameLogic.ins().actorModel.name) {
                        roleList.push(char);
                    }
                }
            }
        }
        return roleList;
    }
    /**秘境区分镜像用的 */
    public getMJRolesList(containsOwn: boolean = false, containsOther: boolean = true) {
        let roles: Array<CharRole> = []
        let char;
        let k: string = '';
        let obj: any = {};
        for (var key in this.entityList) {
            char = this.entityList[key];
            if (char) {
                if (char instanceof CharRole) {
                    k = char.infoModel.name;
                    if (k == GameLogic.ins().actorModel.name && char.infoModel.roleID >= 0 && !containsOwn)//如果是自己跳出
                        continue;
                    if (k == GameLogic.ins().actorModel.name && char.infoModel.roleID < 0 && !containsOther)
                        continue;
                    if (obj[k] == null) {
                        obj[k] = [];
                    }
                    obj[k].push(char);
                }
            }
        }

        for (key in obj) {
            roles[roles.length] = obj[key];
        }

        return roles;
    }

    public getMonstersList(): Array<CharMonster> {
        let roles: Array<CharMonster> = []
        let char;
        let obj: any[] = [];
        for (var key in this.entityList) {
            char = this.entityList[key];
            if (char) {
                if (char instanceof CharMonster) {
                    obj.push(char);
                }
            }
        }
        return obj;
    }

    public GetRoleCount(): number {
        let count = 0
        for (var k = 0, len = SubRoles.ins().subRolesLen; k < len; k++) {
            if (this.entityList[SubRoles.ins().getSubRoleByIndex(k).handle] != null) {
                ++count
            }
        }
        return count
    }
    public CanUseHeji(): boolean {
        return GameLogic.ins().actorModel.level >= 20;
        // return SubRoles.ins().rolesModel.length >= 2;
    }
    public getNoDieRole(): CharRole {
        var len = SubRoles.ins().subRolesLen;
        var role: CharRole;
        for (var k = 0; k < len; k++) {
            role = EntityManager.ins().getMainRole(k);
            if (role)
                return role;
        }
        return null;
    };
    public getTeamCount(t: number): number {
        return this.listCount[t] || 0;
    };
    public checkCount(target: CharMonster, range: number, count: number = 1): boolean {
        var total = 0;
        for (var i in this.entityList) {
            var element = this.entityList[i];
            if (element.team != target.team &&
                MathUtils.getDistance(target.x, target.y, element.x, element.y) <= range * GameMap.CELL_SIZE) {
                total++;
                if (total >= count)
                    break;
            }
        }
        return total >= count;
    };
    public checkCanAddBlood(t: Team): boolean {
        var isCan = false;
        for (var j in this.entityList) {
            if (this.entityList[j].team == t && this.entityList[j].isCanAddBlood) {
                isCan = true;
            }
        }
        return isCan;
    };
    /**选择目标 */
    public screeningTargetByPos(selfTarget: CharMonster, sameTeam: boolean = false, range: number = Number.MAX_VALUE): CharMonster[] {
        var disFun = MathUtils.getDistance;
        this.distances.length = 0;
        var tempValue;
        if (selfTarget.infoModel.type == EntityType.WillDummy || selfTarget.infoModel.type == EntityType.WillDummyMonster) {
            let list: CharMonster[] = OtherAIModel.getInstance.aiMonsterList.values.concat(OtherAIModel.getInstance.aiRoleList.values);
            for (var f = 0; f < list.length; f++) {
                var element: CharMonster = list[f];
                if (!element.infoModel)
                    continue;
                if (selfTarget.team == Team.PASSERBY && element.team == Team.My) {
                    continue
                }
                if (selfTarget.team == Team.My && element.team == Team.PASSERBY) {
                    continue
                }
                if (sameTeam && element.team != selfTarget.team)
                    continue;
                if (!sameTeam && element.team == selfTarget.team)
                    continue;
                //是怪物，而且是召唤怪，不做目标
                if (!(element instanceof CharRole) && element.team != Team.Monster && element.team != Team.WillBoss)
                    continue;
                if (element.AI_STATE == AI_State.Die)
                    continue;
                if (element.team == Team.NotAtk)
                    continue;
                tempValue = disFun(selfTarget.x, selfTarget.y, element.x, element.y);
                if (tempValue > range * GameMap.CELL_SIZE)
                    continue;
                this.distances.push({
                    priority: tempValue,
                    target: element
                });
            }
        } else {
            let data = this.entityList;
            for (var i in data) {
                var element: CharMonster = data[i];
                if (!element.infoModel)
                    continue;
                if (selfTarget.team == Team.PASSERBY && element.team == Team.My) {
                    continue
                }
                if (selfTarget.team == Team.My && element.team == Team.PASSERBY) {
                    continue
                }
                // 路人不作为目标
                // if (element.team == Team.PASSERBY) {
                //     continue
                // }
                if (sameTeam && element.team != selfTarget.team)
                    continue;
                if (!sameTeam && element.team == selfTarget.team)
                    continue;
                //是怪物，而且是召唤怪，不做目标
                if (!(element instanceof CharRole) && element.team != Team.Monster && element.team != Team.WillBoss)
                    continue;
                if (element.AI_STATE == AI_State.Die)
                    continue;
                if (element.team == Team.NotAtk)
                    continue;
                tempValue = disFun(selfTarget.x, selfTarget.y, element.x, element.y);
                if (tempValue > range * GameMap.CELL_SIZE)
                    continue;
                this.distances.push({
                    priority: tempValue,
                    target: element
                });
            }
        }
        this.distances.sort(this.sortFunc);
        var tempArr: CharMonster[] = [];
        for (var j = 0; j < this.distances.length; j++) {
            tempArr[j] = this.distances[j].target;
        }
        return tempArr;
    };
    public sortFunc(a, b) {
        if (a.priority > b.priority)
            return 1;
        if (a.priority < b.priority)
            return -1;
        return 0;
    };

    getEntityBymasterhHandle(handle) {
        for (var key in this.entityList) {
            let entity = this.entityList[key]
            if (entity.infoModel && entity.infoModel.masterHandle && entity.infoModel.masterHandle == handle) {
                return entity
            }
        }
        return null
    }

    showHideSomeOne(e) {
        this.hideByHandle(e);
        // console.log("showHideSomeOne ", e)
        for (var t in this.entityList) {
            var entity = this.entityList[t];
            entity.parent || entity.infoModel.team != Team.WillEntity || !entity.infoModel.masterHandle || entity.infoModel.masterHandle == (e) || GameLogic.ins().createEntityByModel(entity.infoModel)
        }
    }

    hideByHandle(handle) {
        var t = 0;
        if (!(this.countShowNum() < EntityManager.MAX_SHOW_NUM))
            for (var i in this.entityList) {
                var n = this.entityList[i];
                if (n.parent && n.infoModel.team == Team.WillEntity && n.infoModel.masterHandle && !n.infoModel.masterHandle == (handle)) {
                    if (t > 3) break;
                    ++t, DisplayUtils.removeFromParent(n)
                }
            }
    }

    countShowNum() {
        var count = 0;
        for (var t in this.entityList) {
            var entity = this.entityList[t];
            if (entity && entity.parent && entity.infoModel && entity.infoModel.masterHandle && entity.infoModel.masterHandle != GameGlobal.actorModel.handle
                && (egret.is(entity.infoModel, "Role") || GlobalConfig.jifengTiaoyueLg.st101823 == entity.infoModel.name || entity.infoModel.avatarFileName == SkillConst.MOON_SOUL_RESOURCE)) {
                ++count
            }
        }
        return count
    }


    /** 随机找个场景上的怪物*/
    public randomGetMonster(): CharMonster {
        for (var i in this.entityList) {
            if (this.entityList[i].team != Team.My) {
                return this.entityList[i];
            }
        }
    }

    public getPet(): CharMonster[] {
        let list = [];
        for (var i in this.entityList) {
            if (this.entityList[i].team == Team.My && this.entityList[i].monsterType == 3) {
                list.push(this.entityList[i]);
            }
        }
        return list;
    }

    public checkHaveEnemy() {
        let charMonster = this.randomGetMonster();
        if (charMonster) {
            return true;
        }
        return false;
    }
}

window["EntityManager"] = EntityManager