class GuildInteRewardItemRenderer extends eui.ItemRenderer {
	public constructor() {
		super()
		this.skinName = "GuildInteRewardItemSkin"
		this.list.itemRenderer = ItemBase
	}
	rankLabel
	list
	dataChanged() {
		//this.rankLabel.text = "第" + (this.itemIndex + 1) + "名"
		this.rankLabel.text = LanguageString.jifengTiaoyueCh(GlobalConfig.jifengTiaoyueLg.st101635,[this.itemIndex + 1]);//`第 ${this.itemIndex + 1} 名`;
		if (this.data.rank) {
			this.list.dataProvider = new eui.ArrayCollection(this.data.award)
		} else {
			this.list.dataProvider = new eui.ArrayCollection(GuildWar.ins().creatGuildRankReward(this.data))
		}
	}
}

window["GuildInteRewardItemRenderer"]=GuildInteRewardItemRenderer