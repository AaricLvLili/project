enum EntityType {

    Actor = 0,
    Role = 1,
    Monster = 2,
    /** pk战实体 */
    Encounter = 3,
    /** 天梯对象 */
    LadderPlayer = 4,
    /** 野外boss不会动 */
    WillBoss = 5,
    /** 野外boss进入战斗 */
    WillBossMonster = 6,
    /**宠物 */
    Pet = 7,
    /** 野外虚拟玩家 */
    WillDummy = 100,
    /** 野外虚拟怪物 */
    WillDummyMonster = 101,
}