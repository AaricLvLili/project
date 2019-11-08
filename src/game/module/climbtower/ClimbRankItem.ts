class ClimbRankItem extends eui.ItemRenderer {
	public constructor() {
		super();

		this.skinName = "FbRankItemSkin";
	}
	public bg: eui.Image;
	public rankbg: eui.Image;
	public rank: eui.Label;
	public nameLabel: ActorName;
	public zhanli: eui.Label;
	public ce: eui.Label;
	dataChanged() {
		let data: Sproto.tower_rank_data = this.data;
		this.rank.text = (this.itemIndex + 1) + "";
		var vipLevel = data.vip;
		this.nameLabel.Set(data.name, vipLevel, false, false)
		this.zhanli.text = CommonUtils.overLength(data.power);
		this.ce.text = data.lvl + GlobalConfig.jifengTiaoyueLg.st100369;
	};
}
window["ClimbRankItem"]=ClimbRankItem