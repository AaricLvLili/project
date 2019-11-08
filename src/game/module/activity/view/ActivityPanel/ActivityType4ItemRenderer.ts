class ActivityType4ItemRenderer extends eui.ItemRenderer {
	public constructor() {
		super()
		this.skinName = "ActraceSkinson"
		this.list.itemRenderer = ActivityItemShow
	}

	list
	private label_rank: eui.BitmapLabel;
	public img_rank: eui.Image;
	rankName
	value
	private rankImg: eui.Image;

	dataChanged() {
		var e = this.data;
		//this.data.ranking > 0 && this.label_rank && (this.label_rank.text = "名次\n" + (this.itemIndex + 1)), this.list.dataProvider = new eui.ArrayCollection(e.rewards);
		// 名次XX修改为第XX名
		// if (this.itemIndex + 1 <= 3) {
		// 	this.rankImg.visible = true;
		// 	this.rankImg.source = "comp_68_68_0" + (this.itemIndex + 3)+"_png";
		// }
		// else {
		// 	this.rankImg.visible = false;
		// }
		// this.label_rank.visible = !this.rankImg.visible;
		this.label_rank.visible = true

		this.data.ranking > 0 && this.label_rank && (this.label_rank.text = "" + (this.itemIndex + 1)) + "", this.list.dataProvider = new eui.ArrayCollection(e.rewards);

		if ((this.itemIndex + 1) <= 3) {
			this.img_rank.visible = true
			this.img_rank.source = `comp_68_67_0${this.itemIndex + 1}_png`
		} else {
			this.img_rank.visible = false
		}
		this.label_rank.visible = (this.itemIndex + 1) > 3
		var data: DabiaoRankData = GameGlobal.activityModel.rankInfoList[this.itemIndex];
		if (data && data.name != "") {
			this.y = 21, this.rankName.text = data.name, this.value.visible = !0;
			var i;
			switch (this.data.rankType) {
				case 12:
				case 16:
				case 14:
				case 13:
				// 	i = data.numType + "级";
				// break
				case 5:
					// this.label_DabiaoTarget && (this.label_DabiaoTarget.text = "达到等级\n" + t)
					i = ActivityType4Panel.GetLevelStr(data.numType);
					break
				case 0:
				case 6:
					i = CommonUtils.overLength(data.numType) + GlobalConfig.jifengTiaoyueLg.st100306;
					break
				case 137:
					i = CommonUtils.overLength(data.numType) + GlobalConfig.jifengTiaoyueLg.st100050;
					break;
				default:
					i = CommonUtils.overLength(data.numType) + GlobalConfig.jifengTiaoyueLg.st100306;
					break;
			}
			this.value.text = i


		} else {
			let t;
			switch (this.data.rankType) {
				case 137:
					t = GlobalConfig.jifengTiaoyueLg.st102118;
					break;
				default:
					t = GlobalConfig.jifengTiaoyueLg.st101470;
					break;
			}
			this.y = 33;
			this.rankName.text = GlobalConfig.jifengTiaoyueLg.st100378;
			var config: any = GlobalConfig.ins("ActivityType4Config")[this.data.Id];
			this.value.text = LanguageString.jifengTiaoyueCh(t, [CommonUtils.overLength(config[this.data.ranking].value)])
		}
	}
}
window["ActivityType4ItemRenderer"] = ActivityType4ItemRenderer