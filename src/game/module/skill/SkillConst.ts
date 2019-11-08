class SkillConst{
    static STATE_MAX = "max"
    static STATE_NORMAL = "normal"
    static MAX_BREAK_LEVEL = 50;//技能属性等级
    static MAX_NUM = 5;//技能数量
    static AWAKE_SKILL_FINAL = 7
    static AWAKE_SKILL_FIRST = 5
    static MET_ID = 260016
    static NORMAL_SKILL = 5e4
    static MOON_SOUL_SKILL = 50002
    static MOON_SOUL_RESOURCE = "monster10999"
    static MOON_SOUL_WORD_EFF = "38001_png"
    static BUFF_FREEZE = 65001
    static EFF_STUN = 51001
    static EFF_STUN2 = 62001
    static EFF_STUN_RESIST = 51002
    static MOON_SOUL_GROUP_ID = 64001
    static EFF_ID_STUN = 1
    static EFF_ID_POISON = 2
    static arrJobReduce = [0, AttributeType.atJob1DamageReduction, AttributeType.atJob2DamageReduction, AttributeType.atJob3DamageReduction]
    static arrJobEnhance = [0, AttributeType.atJob1DamageEnhance, AttributeType.atJob2DamageEnhance, AttributeType.atJob3DamageEnhance]
};

window["SkillConst"]=SkillConst