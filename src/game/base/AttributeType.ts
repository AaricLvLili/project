/**
 *
 * @author
 *
 */
enum enPropEntity {
    P_ID = 0,
    P_POS_X = 1,
    P_POS_Y = 2,
    P_MODELID = 3,
    P_ICON = 4,
    P_DIR = 5,
    P_MAX_ENTITY = 6,
}
enum enPropAnimal {
    P_LEVEL = 6,
    P_HP = 7,
    P_MP = 8,
    P_SPEED = 9,
    P_MAXHP = 10,
    P_MAXMP = 11,
    P_OUT_ATTACK = 12,
    P_OUT_DEFENCE = 13,
    P_DEFCRITICALSTRIKES = 14,
    P_ALL_ATTACK = 15,
    P_SUB_DEF = 16,
    P_IN_ATTACK = 17,
    P_IN_DEFENCE = 18,
    P_CRITICALSTRIKES = 19,
    P_DODGERATE = 20,
    P_HITRATE = 21,
    P_ATTACK_ADD = 22,
    P_HP_RENEW = 23,
    P_MP_RENEW = 24,
    P_ATTACK_SPEED = 25,
    P_IN_ATTACK_DAMAGE_ADD = 26,
    P_OUT_ATTACK_DAMAGE_ADD = 27,
    P_THUNDER_ATTACK = 28,
    P_THUNDER_DEFENCE = 29,
    P_POISON_ATTACK = 30,
    P_POISON_DEFENCE = 31,
    P_ICE_ATTACK = 32,
    P_ICE_DEFENCE = 33,
    P_FIRE_ATTACK = 34,
    P_FIRE_DEFENCE = 35,
    P_STATE = 36,
    P_BASE_MAXHP = 37,
    P_BASE_MAXMP = 38,
    P_STAND_POINT = 39,
    P_MAX_ANIMAL = 40,
}
enum enPropActor {
    P_WEAPON = 40,
    P_MOUNT = 41,
    P_DIZZY_RATE11 = 42,
    P_DIZZY_TIME1 = 43,
    P_HP_STORE = 44,
    P_MP_STORE = 45,
    P_SPIRIT = 46,
    P_PK_MOD = 47,
    P_STRONG_EFFECT = 48,
    P_WING = 49,
    P_STAGE_EFFECT = 50,
    P_PET_HP_STORE = 51,
    PROP_ACTOR_XIUWEI_RENEW_RATE = 52,
    P_SEX = 53,
    P_VOCATION = 54,
    P_EXP = 55,
    P_PK_VALUE = 57,
    P_BAG_GRID = 58,
    P_WEEK_CHARM = 59,
    P_BIND_COIN = 60,
    P_COIN = 61,
    P_BIND_YB = 62,
    P_YB = 63,
    P_SHENGWANG = 64,
    P_CHARM = 65,
    P_SPIRIT_SLOT = 66,
    P_RENOWN = 67,
    P_GUILD_ID = 68,
    P_TEAM_ID = 69,
    P_SOCIAL = 70,
    P_GUILD_EXP = 71,
    P_LUCKY = 72,
    P_SYS_OPEN = 73,
    P_ROOT_EXP_POWER = 74,
    P_CHANGE_MODEL = 75,
    PROP_BANGBANGTANG_EXP = 76,
    P_GIVE_YB = 77,
    P_CRITICAL_STRIKE = 78,
    P_EXP_RATE = 79,
    P_DEPOT_GRID = 80,
    P_ANGER = 81,
    P_ROOT_EXP = 82,
    P_ACHIEVEPOINT = 83,
    P_ZYCONT = 84,
    P_QQ_VIP = 85,
    P_WING_ID = 86,
    P_WING_SCORE = 87,
    P_PET_SCORE = 88,
    PROP_ACTOR_VIPFLAG = 89,
    P_CAMP = 90,
    P_PET_SLOT = 91,
    P_HONOR = 92,
    P_QING_YUAN = 93,
    PROP_ACTOR_DUR_KILLTIMES = 94,
    PROP_ACTOR_BASE_FIGHT = 95,
    P_FIGHT_VALUE = 96,
    P_MAX_RENOWN = 97,
    P_RECHARGE = 98,
    P_VIP_LEVEL = 99,
    P_BEAST_LEVEL = 100,
    P_FOOT_EFFECT = 101,
    P_EQUIP_SCORE = 102,
    P_HAIR_MODEL = 103,
    P_BUBBLE = 104,
    P_ACTOR_STATE = 105,
    P_JINGJIE_TITLE = 106,
    P_ZHUMOBI = 107,
    P_WARSPIRIT = 108,
    P_GUILDFB_SCORE = 109,
    P_SYS_OPENEX = 110,
    P_MAX_ACTOR = 111,
}
enum AttributeType {
    atHp = 0,//气血
    atMp = 1,//魔法值
    atMaxHp = 2,
    atMaxMp = 3,
    atAttack = 4,
    atDef = 5, //物防
    atRes = 6, //法防
    atCrit = 7,//暴击
    atTough = 8,//抗暴
    atMoveSpeed = 9,//移动速度
    atAttackSpeed = 10,//攻击速度
    atHpEx = 11, //生命百分比加成
    atAtkEx = 12,//攻击百分比加成
    atStunPower = 13,//攻击百分比加成
    atStunRes = 14,//眩晕抵抗力
    atStunTime = 15,//眩晕时间
    atDamageReduction = 16,//免伤百分比
    atCritHurt = 17,//暴击伤害，伤害增加量(加法)
    atRegeneration = 18,//每秒回复
    atCritEnhance = 19,//暴击伤害加成，伤害额外增加百分比
    atPenetrate = 20,//穿透(无视百分比双防)
    atRoleDamageEnhance = 21,//攻击玩家伤害加深
    atRoleDamageReduction = 22,// 受到玩家伤害减免

    atJob1DamageEnhance = 23,   // 剑士  后面6个(包括这个)顺序不能改变
    atJob2DamageEnhance = 24,   // 法师
    atJob3DamageEnhance = 25,   // 牧师
    atJob1DamageReduction = 26, //受到战士减免
    atJob2DamageReduction = 27, //受到法师减免
    atJob3DamageReduction = 28, //受到牧师减免
    atTianzhuCrit = 29, // 天珠暴击触发几率
    atTianzhuCritTime = 30, // 天珠暴击持续时间
    atDefEx = 31, //物防百分比
    atResEx = 32, //法防百分比
    atRingBuff = 33, //戒语类型
    atTargetComaWhenBeAttackedRate = 34, //被击中使对方进入眩晕的概率 万分比
    atTargetComaWhenBeAttackedDuringSec = 35, // 被击中使对方进入眩晕的持续时间
    atTargetDamageExWhenSelfDeathRate = 36, //死亡时自爆概率  万分比
    atTargetDamageExWhenSelfDeathValue = 37, //死亡时自爆对敌人造成的伤害 万分比
    atDodgeProb = 38,				//闪避概率 万分比
    atDamageReboundProb = 39, 		//伤害反弹触发概率 万分比
    atDamageReboundValue = 40,		//伤害反弹给对方的血量 万分比
    atSuperManByHitProb = 41,       //被击中时候无敌的概率
    atSuperManByHitSec = 42,		//被击中时候产生无敌的持续时间
    atMpEx = 43,      //蓝量百分比加成
    atShield = 44,    //  --内功值
    atShieldRep = 45, //--内功值3秒回复
    atShieldRelief = 46,// --内功免伤
    atMaxShield = 47, //--内功最大值
    atStrength = 48,            // 力量
    atFaster = 49,            // 敏捷
    atIntelligence = 50,            // 智力
    atPhysical    = 51,            //体质
    atMpRecove = 52,            // 普攻回复魔法
    atMpRecoveEx = 53,            // 普攻回复魔法%
    atCount = 54,            // 无效值

    WATER = 101,//水元素伤害
    FIRE = 102,//火元素伤害
    WIND = 103,//风元素伤害
    LIGHT = 104,//光元素伤害
    DARK = 105,//暗元素伤害
    ANTIWATER = 106,//水元素抗性
    ANTIFIRE = 107,//火元素抗性
    ANTIWIND = 108,//风元素抗性
    ANTILIGHT = 109,//光元素抗性
    ANTIDARK = 110,//暗元素抗性
}
/**元素类型 */
enum ElementType {
    /**水 */
    WATER = 1,
    /**火 */
    FIRE = 2,
    /**风 */
    WIND = 3,
    /**光 */
    LIGHT = 4,
    /**暗 */
    DARK = 5,
}
/**元素克制关系 */
enum ElementRestrainType {
    /**没克制关系 */
    NOTYPE = 0,
    /**克制关系 */
    KTYPE = 1,
    /**被克制关系 */
    BKTYPE = 2,
}

