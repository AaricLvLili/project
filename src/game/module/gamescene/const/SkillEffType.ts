/**
 * 效果类型
 * 1 附加伤害 {a=系数,t=施法者属性类型,b=附加值}
 * 2 加血 {a=系数,t=施法者属性类型,b=附加值}
 * 3 附加属性 {a=系数,t1=施法者属性类型,b=附加值, t2=附加属性类型}
 * 4 附加状态
 * 5 召唤 {怪物1id,怪物2id，怪物3id…}
 */
enum SkillEffType {
    /** 伤害buff */
    DAMAGE = 1,
    /** 回血buff */
    ADD_HP = 2,
    /** 附加属性 */
    ADD_ATTR = 3,
    /** 附加状态 */
    STATE = 4,
    /** 召唤 */
    SUMMON = 5,
    /**持续性造成一定伤害 */
    DELAY_HIT = 6,
    /**触发新技能 */
    TRIGGER_SKILL = 9,	// 触发新技能
    /**改变属性 */
    CHANGE_ATTR = 10,	// 改变属性
    /** 闪现*/
    SUDDEN_MOVE = 11,
    /** 隐身*/
    INVISIBLE = 12,
    /** 残影*/
    GHOST = 13,
    /** 子弹时间残影，需要特殊处理*/
    BULLETTIME = 14,
    /**舍命一击 */
    SELFKILL = 15,   // 舍命一击
    /**随机技能 */
    RANNSKILL = 16,   // 随机技能
    /**圣母祈福 */
    CLEANBAD = 17,   // 圣母祈福
    /**MP回复速率 */
    RECOVER_MP = 18,	// MP回复速率
    /** MP的消耗（法师、牧师专有） */
    COST_MP = 19,	// MP的消耗（法师、牧师专有）
    /**技能伤害 */
    DAMAGE_EX = 20,	// 技能伤害
    /**技能cd */
    CHANGE_CD = 21,	// 技能cd
    /**连续普攻 */
    MOATK = 23,
    /**治疗效果 */
    HEAL_EX = 24,	// 治疗效果
}
