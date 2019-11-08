class DrillRankItem extends eui.ItemRenderer {



	public bg: eui.Image;
	public vaule: eui.Label;
	public nickName: eui.Label;
	public rank: eui.Label;
	//private rankbg:eui.Image;


	public constructor() {
		super();
		this.skinName = "DrillRankPanletemSkin";
	}

	dataChanged() {

		this.rank.text = this.data.rank + "";
		this.nickName.text = this.data.name;
		this.vaule.text = LanguageString.jifengTiaoyueCh(GlobalConfig.jifengTiaoyueLg.st100386, [this.data.lvl]);
		//this.bg.visible = this.itemIndex % 2 == 0;
		// if(this.data.rank<4){
		// 	this.rankbg.visible= true;
		// }
	};
}
window["DrillRankItem"] = DrillRankItem