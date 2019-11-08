class ActivityType21Data extends ActivityBaseData {
    public count: number
    public rank: number

    update(e: Sproto.activity_type21 | Sproto.activity_type22) {
        this.count = e.count
        this.rank = e.rank
    }

    canReward() {
        return !1
    }

    isOpenActivity() {
        return this.isOpenTime()
    }

    updateMessage(e) {

    }


    public getConfig(id: number) {
        var config = GlobalConfig.ins("ActivityType16Config")[id]
        if (!config) {
            config = GlobalConfig.ins("ActivityType16BConfig")[id]
        }
        if (!config) {
            config = GlobalConfig.ins("ActivityType16AConfig")[id]
        }
        return config
    }
}
window["ActivityType21Data"]=ActivityType21Data