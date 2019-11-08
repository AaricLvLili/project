class FuwenItemData {
    public openStatus: boolean
    public level: number
    public equipDatas: ItemData[]

    public constructor(data: Sproto.fuwen_data) {
        this.openStatus = data.openStatus
        this.level = data.level
        this.equipDatas = []
        for (let item of data.equipDatas) {
            let itemData = new ItemData
            itemData.parser(item)
            this.equipDatas.push(itemData)
        }
    }
}
window["FuwenItemData"]=FuwenItemData