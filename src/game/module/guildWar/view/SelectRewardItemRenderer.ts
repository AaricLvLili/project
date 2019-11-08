class SelectRewardItemRenderer extends eui.ItemRenderer {

	////////////////////////////////////////////////////////////////////////////////////////////////////
    // SelectRewardItemSkin.exml
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    private chooseNum: eui.Label
    private payNum: eui.Label
    private goods: BaseComponent
    private choosePeople: eui.Button
    private list: eui.List
    ////////////////////////////////////////////////////////////////////////////////////////////////////
	sendNum = 0
	private languageTxt:eui.Label;
	private languageTxt0:eui.Label;

	public constructor() {
		super()
		this.skinName = "SelectRewardItemSkin"
		this.choosePeople.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTap, this)
		this.list.itemRenderer = GuildWarMemberHeadRender
		this.languageTxt.text = GlobalConfig.jifengTiaoyueLg.st101783 + "：";
		this.languageTxt0.text = GlobalConfig.jifengTiaoyueLg.st101783;
		this.choosePeople.label = GlobalConfig.jifengTiaoyueLg.st101784;
	}

	dataChanged () {
		var rank:number;
		if(SelectMemberRewardWin.dispIndex == 1)
		{
			rank = GuildReward.ins().kF1guildWarRank;
		}
		else if(SelectMemberRewardWin.dispIndex == 2)
		{
			rank = GuildReward.ins().kF2guildWarRank;	
		}
		else
		{
			rank = GuildReward.ins().guildWarRank;
		}

		GuildWar.ins().guildRankRewardType = SelectMemberRewardWin.dispIndex;
		let list = GuildWar.ins().creatGuildRankReward(rank, this.itemIndex);
		this.goods.data = list[0]
		this.sendNum = GuildReward.ins().getCanSendNumByRank(this.itemIndex)
		this.payNum.text = LanguageString.jifengTiaoyueCh(GlobalConfig.jifengTiaoyueLg.st101782,[this.sendNum])//"可分配：" + this.sendNum + "份";
		let selectList = GuildReward.ins().getSelectDataByIndex(this.itemIndex)
		let count = 0;
		if (selectList.length > 0) {
			for (var n in selectList) {
				count += selectList[n].num;
			} 
		}
		this.chooseNum.text = count + "/" + this.sendNum
		this.list.dataProvider = new eui.ArrayCollection(selectList)
	}
	
	onTap (e) {
		switch (e.currentTarget) {
			case this.choosePeople:
				// GuildReward.ins().rewardIndex = this.itemIndex
				ViewManager.ins().open(SelectMemberPanelWin, this.itemIndex, this.sendNum)
				break
		}
	}
}
window["SelectRewardItemRenderer"]=SelectRewardItemRenderer