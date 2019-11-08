class EntityBuff {
		effConfig
        value: number
        addTime: number
        endTime: number
        count: number
        step: number
        source: CharMonster

        monsterList :Array<any>;
}
window["EntityBuff"]=EntityBuff