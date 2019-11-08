class ActivityType21ItemRenderer extends eui.ItemRenderer {
    public constructor() {
        super()
        this.skinName = "ActivityType21ItemSkin"
        this.list.itemRenderer = ActivityItemShow
    }
    public list: eui.List;
    public rankImg: eui.Image;
    public rankName: eui.Label;
    public value: eui.Label;
    public label_rank: eui.Label;


    dataChanged() {
        var e = this.data;
        this.rankImg.source = e.idx <= 3 ? "comp_68_67_0" + e.idx + "_png" : ""
        this.label_rank.visible = e.idx > 3;
        let config = this.getDataList(e.activityId, e.idx)
        if (config == null) {
            console.error(`type${e.activityId} activity cfg not found`)
            return
        }
        this.data.idx > 0 && this.label_rank && (this.label_rank.text = "" + (e.idx)) + "", this.list.dataProvider = new eui.ArrayCollection(config.rewards);
        let tabName: string = ActivityModel.GetActivityConfig(e.activityId).tabName
        let isKF: boolean = tabName.indexOf(GlobalConfig.jifengTiaoyueLg.st100466) != -1//是否跨服
        let isZP: boolean = tabName.indexOf(GlobalConfig.jifengTiaoyueLg.st102066) != -1//是否转盘
        let txt = isZP ? GlobalConfig.jifengTiaoyueLg.st100024 : GlobalConfig.jifengTiaoyueLg.st100050

        if (e.name != "") {
            this.y = 21, this.rankName.text = isKF ? `[${e.serverId}` + GlobalConfig.jifengTiaoyueLg.st102067 + `]\n${e.name}` : e.name, this.value.visible = !0;

            this.value.text = CommonUtils.overLength(e.value) + txt
        } else {
            this.y = 33;
            this.rankName.text = GlobalConfig.jifengTiaoyueLg.st101034;
            this.value.text = GlobalConfig.jifengTiaoyueLg.st102063 + "\n" + CommonUtils.overLength(config.value) + txt;
        }
    }
    private getDataList(type, id) {
        var config = GlobalConfig.activityType4Config[type];
        if (config == null) {
            config = GlobalConfig.activityType4AConfig[type];
        }
        if (config == null) {
            config = GlobalConfig.activityType4BConfig[type];
        }
        // for (var n in config) {
        //     if (config[n].ranking == id ) {
        //         return config[n]["rewards"]
        //     }
        // }
        return config[id]


    }
}
window["ActivityType21ItemRenderer"] = ActivityType21ItemRenderer