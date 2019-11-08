class GuildWarResultWin extends BaseEuiPanel {

	public static LAYER_LEVEL = LayerManager.UI_Popup

	////////////////////////////////////////////////////////////////////////////////////////////////////
	// GuildWarResultSkin.exml
	////////////////////////////////////////////////////////////////////////////////////////////////////
	private closeBtn: eui.Button
	private guildName: eui.Label
	private guildPoint: eui.Label
	private myPoint: eui.Label
	private guildRank: eui.Label
	private myRank: eui.Label
	private list2: eui.List
	private list1: eui.List
	private languageText:eui.Label;
	private languageText0:eui.Label;
	private languageText1:eui.Label;
	private languageText2:eui.Label;
	private languageText3:eui.Label;
	////////////////////////////////////////////////////////////////////////////////////////////////////


	public constructor() {
		super()
		this.skinName = "GuildWarResultSkin"
		this.list1.itemRenderer = ItemBase
		this.list2.itemRenderer = ItemBase
		this.closeBtn.label = GlobalConfig.jifengTiaoyueLg.st100040;
		this.languageText.text = GlobalConfig.jifengTiaoyueLg.st101589 + "：";
		this.languageText0.text = GlobalConfig.jifengTiaoyueLg.st101558 + "：";
		this.languageText1.text = GlobalConfig.jifengTiaoyueLg.st101590 + "：";
		this.languageText2.text = GlobalConfig.jifengTiaoyueLg.st101591 + "：";
		this.languageText3.text = GlobalConfig.jifengTiaoyueLg.st101592 + "：";
	}

	open(...e: any[]) {
		this.AddClick(this.closeBtn, this._OnClick)
		let data = e[0] as Sproto.sc_gdwar_reward_request
		this.guildName.text = "" == data.winerName || data.winerName == null ? GlobalConfig.jifengTiaoyueLg.st101034 : data.winerName
		this.myPoint.text = data.actorPoint + ""
		this.guildPoint.text = data.guildPoint + ""
		this.guildRank.text = LanguageString.jifengTiaoyueCh(GlobalConfig.jifengTiaoyueLg.st101635,[data.guildRank]);//"第" + data.guildRank + "名"
		this.myRank.text = data.actorRank > 0 ? LanguageString.jifengTiaoyueCh(GlobalConfig.jifengTiaoyueLg.st101635,[data.actorRank]) : GlobalConfig.jifengTiaoyueLg.st100086;//"第" + data.actorRank + "名" : "未上榜";

		var rewardList = []
		let myPointList = GuildWar.ins().getMyPointRankReward(data.actorRank,data.warType);
		// let myPointList = []
		this.list1.dataProvider = new eui.ArrayCollection(myPointList.concat(rewardList))
		GuildWar.ins().guildRankRewardType = data.warType;
		this.list2.dataProvider = new eui.ArrayCollection(GuildWar.ins().creatGuildRankReward(data.guildRank))
	}

	private _OnClick() {
		ViewManager.ins().close(this)
	}
}

window["GuildWarResultWin"]=GuildWarResultWin