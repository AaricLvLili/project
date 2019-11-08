class GuildFBRankItemRender extends eui.ItemRenderer {

	rankinfo
	rank
	rolename
	guanka

	public constructor() {
		super();
		this.skinName = "GuildFBItemSkin";
	}


	dataChanged() {
		if (this.data instanceof GuildFBRankInfo) {
			this.rankinfo = this.data;
			this.rank.text = this.rankinfo.rank + "";
			this.rolename.text = this.rankinfo.name + "";
			this.guanka.text = this.rankinfo.guanka + GlobalConfig.jifengTiaoyueLg.st100369;//"关";
		}
	};
}
window["GuildFBRankItemRender"]=GuildFBRankItemRender