class ChaosBattleRankItem extends eui.ItemRenderer {
	public constructor() {
		super();
		this.skinName = "FbRankItemSkin";
	}
	public bg: eui.Image;
	public rank: eui.Label;
	public nameLabel: ActorName;
	public zhanli: eui.Label;
	public ce: eui.Label;

	public dataChanged() {
		super.dataChanged();
		let data: ChaosBattleRankData = this.data;
		this.rank.text = data.rankNum + "";
		this.nameLabel.Set(data.name, data.vipLv, false, false);
		this.zhanli.text = data.guildName;
		this.ce.text = data.pointNum + "";
	}
}

window["ChaosBattleRankItem"] = ChaosBattleRankItem