class FbAndLevelsRankItem extends eui.ItemRenderer {
	public constructor() {
		super();

		this.skinName = "FbRankItemSkin";
	}
	//private rankbg:eui.Image;
	rank
	// monthcard
	// vipImg
	// vip
	nameLabel: ActorName
	zhanli
	ce
	bg
	open() {
		this.addEventListener(egret.TouchEvent.TOUCH_TAP, this.openDetail, this);
	};
	close() {
		this.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.openDetail, this);
	};
	dataChanged() {
		this.rank.text = this.data[RankDataType.DATA_POS] + "";
		// this.monthcard.visible = this.data[RankDataType.DATA_MONTH] == 1;
		var vipLevel = this.data[RankDataType.DATA_VIP];
		// this.vipImg.visible = vipLevel > 0;
		// this.vip.removeChildren();
		// if (vipLevel > 0)
		// 	this.vip.addChild(BitmapNumber.ins().createNumPic(vipLevel, '5'));
		// this.nameLabel.text = this.data[RankDataType.DATA_PLAYER];
		this.nameLabel.Set(this.data[RankDataType.DATA_PLAYER], vipLevel, this.data[RankDataType.DATA_MONTH] == 1, false)
		this.zhanli.text = CommonUtils.overLength(this.data[RankDataType.DATA_POWER]);
		this.ce.text = this.data[RankDataType.DATA_COUNT] + GlobalConfig.jifengTiaoyueLg.st100369;
		//this.bg.visible = this.data[RankDataType.DATA_POS] % 2 == 1;
		// if(this.data[RankDataType.DATA_POS]<4){
		// 	this.rankbg.visible= true;
		// }
	};
	openDetail() {
		// UserReadPlayer.ins().sendFindPlayer(this.data.playId);
	};
}
window["FbAndLevelsRankItem"]=FbAndLevelsRankItem