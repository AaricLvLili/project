class RewardData {

    type: number;
    id: number;
    count: number;
    public parser(bytes: Sproto.reward_data): void {
        this.type = bytes.type
        this.id = bytes.id
        this.count = bytes.count
    }

    private static SetValue(key: string, src: any, dst: any): boolean {
        if (src[key] != null) {
            dst[key] = src[key]
            return true
        }
        return false
    }

    public static ToRewardData(data: any): RewardData {
        let obj = new RewardData
        RewardData.SetValue("type", data, obj)
        RewardData.SetValue("id", data, obj)
        RewardData.SetValue("count", data, obj)
        return obj
    }

    public static ToRewardDatas(datas: any[]): RewardData[] {
        let list = []
        for (let data of datas) {
            list.push(this.ToRewardData(data))
        }
        return list
    }

    // public static getCurrencyName(v) {
    //     //return RewardData.CURRENCY_NAME[v];
    //     return MoneyManger.MoneyConstToName(v)
    // }

    // public static getCurrencyRes(v) {
    //     // return RewardData.CURRENCY_RES[v];
    //     return MoneyManger.MoneyConstToSource(v);
    // }

    // public static getQuailty(v) {
    //     return MoneyManger.MoneyConstToQuality(v)
    // }

}
window["RewardData"] = RewardData