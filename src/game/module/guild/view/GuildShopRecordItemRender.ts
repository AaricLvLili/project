class GuildShopRecordItemRender extends eui.ItemRenderer {
    public constructor() {
        super()
        this.skinName = "GuildStoreItemSkin";
    }
    rank
    dataChanged() {
        if (this.data instanceof GuildStoreRecordInfo) {
            var config = GlobalConfig.itemConfig[this.data.itemId];
            if (config)
                this.rank.textFlow = new egret.HtmlTextParser().parser(this.data.roleName + "   " + GlobalConfig.jifengTiaoyueLg.st101797 + "   <font color=" + ItemBase.QUALITY_COLOR[config.quality] + ">" + config.name + "</font>");
            else
                this.rank.text = "";
        }
    }

}
window["GuildShopRecordItemRender"] = GuildShopRecordItemRender