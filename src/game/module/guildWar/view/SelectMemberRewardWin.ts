class SelectMemberRewardWin extends BaseEuiPanel implements ICommonWindowTitle {

	public static LAYER_LEVEL = LayerManager.UI_Main

	////////////////////////////////////////////////////////////////////////////////////////////////////
	// SelectMemberRewardSkin.exml
	////////////////////////////////////////////////////////////////////////////////////////////////////
	private commonWindowBg: CommonWindowBg
	private rankLabel: eui.Label
	private list: eui.List
	private sendReward: eui.Button
	public static dispIndex: number;
	////////////////////////////////////////////////////////////////////////////////////////////////////
	windowTitleIconName = GlobalConfig.jifengTiaoyueLg.st101788;
	dataLen = []

	public constructor() {
		super()
		this.skinName = "SelectMemberRewardSkin"
		this.list.itemRenderer = SelectRewardItemRenderer
		this.sendReward.label = GlobalConfig.jifengTiaoyueLg.st101788;
	}

	open(...param: any[]) {
		SelectMemberRewardWin.dispIndex = param[0];
		this.commonWindowBg.OnAdded(this)
		GuildReward.ins().SendGetMyGuildRank()
		this.sendReward.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTap, this)
		GameGlobal.MessageCenter.addListener(MessageDef.GUILDWAR_SENDLIST_CHANGE, this.refushList, this)
		this.refushPanelInfo()
	}

	close() {
		this.commonWindowBg.OnRemoved()
	}

	refushPanelInfo() {
		var str: string;
		var nameStr: string;
		if (SelectMemberRewardWin.dispIndex == 1) {
			nameStr = GlobalConfig.jifengTiaoyueLg.st101785//"跨服争霸小组赛";
			str = LanguageString.jifengTiaoyueCh(GlobalConfig.jifengTiaoyueLg.st101635, [GuildReward.ins().kF1guildWarRank]);//"第"+GuildReward.ins().kF1guildWarRank + "名";
		}
		else if (SelectMemberRewardWin.dispIndex == 2) {
			nameStr = GlobalConfig.jifengTiaoyueLg.st101786//"跨服争霸决赛";
			str = LanguageString.jifengTiaoyueCh(GlobalConfig.jifengTiaoyueLg.st101635, [GuildReward.ins().kF2guildWarRank]);//"第"+GuildReward.ins().kF2guildWarRank + "名";
		}
		else {
			nameStr = GlobalConfig.jifengTiaoyueLg.st100920//"遗迹争霸";
			str = LanguageString.jifengTiaoyueCh(GlobalConfig.jifengTiaoyueLg.st101635, [GuildReward.ins().guildWarRank]);//"第"+GuildReward.ins().guildWarRank + "名";
		}

		this.rankLabel.textFlow = <Array<egret.ITextElement>>[{ text: GlobalConfig.jifengTiaoyueLg.st101787, style: { "textColor": 0xbf7d00 } },
		{ text: nameStr, style: { "textColor": 0xFFB82A }, }, { text: GlobalConfig.jifengTiaoyueLg.st101590 + "：", style: { "textColor": 0xbf7d00 } },
		{ text: str, style: { "textColor": 0xFFB82A } }]
		this.dataLen.length = GuildReward.ins().getCanSendNumByRank()
		this.refushList()
	}

	refushList() {
		this.list.dataProvider = new eui.ArrayCollection(this.dataLen)
	}

	onTap(e) {
		switch (e.currentTarget) {
			case this.sendReward:
				// App.ControllerManager.applyFunc(ControllerConst.Guild, GuildFunc.GUILD_MEMBER)
				TimerManager.ins().doTimer(100, 1, () => {
					if (GuildReward.ins().checkISSendAll()) {
						GuildReward.ins().SendDispAward()
					}
					//  && App.ControllerManager.applyFunc(ControllerConst.Guild, GuildFunc.REQUEST_GUILDWAR_SENDREWARD, t.dataLen.length, GuildReward.ins().sendList)
				}, this)
		}
	}
	UpdateContent() {

	}
}
window["SelectMemberRewardWin"] = SelectMemberRewardWin