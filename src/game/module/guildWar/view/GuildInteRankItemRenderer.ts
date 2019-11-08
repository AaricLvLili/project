class GuildInteRankItemRenderer extends eui.ItemRenderer {

	    ////////////////////////////////////////////////////////////////////////////////////////////////////
    // GuildInteRankItemSkin.exml
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    private rank: eui.Label
    private guildName: eui.Label
    private guildOwn: eui.Label
    private point: eui.Label
	private bg:eui.Image;
    ////////////////////////////////////////////////////////////////////////////////////////////////////


	public constructor() {
		super()
		this.skinName = "GuildInteRankItemSkin"
	}

	dataChanged () {
		let data = this.data as Sproto.guildwar_scoreinfo
		this.rank.text = this.itemIndex + 1 + ""
		//this.bg.source= this.itemIndex % 2 == 0 ?"base_10_10_02_png" : "base_10_10_01_png"
		this.guildName.text = data.guildname
		this.guildOwn.text = data.actorname
		this.point.text = data.score + ""
	}
}
window["GuildInteRankItemRenderer"]=GuildInteRankItemRenderer