class ActivityGuildWinnerPanel extends eui.Component {

	////////////////////////////////////////////////////////////////////////////////////////////////////
	// ActivityGuildWinnerSkin.exml
	////////////////////////////////////////////////////////////////////////////////////////////////////
	private desc0: eui.Label
	private date0: eui.Label
	private activityGroup: eui.Group
	private dataGroup: eui.DataGroup
	private goBtn: eui.Button
	private activeGroup: eui.Image
	private static guildBattleConst: any;
	////////////////////////////////////////////////////////////////////////////////////////////////////

	public m_Lan1: eui.Label;
	public m_Lan2: eui.Label;

	public constructor() {
		super()
		this.skinName = "ActivityGuildWinnerSkin"
		this.dataGroup.itemRenderer = ItemBaseEffe
		this.m_Lan1.text = GlobalConfig.jifengTiaoyueLg.st101274;
		this.m_Lan2.text = GlobalConfig.jifengTiaoyueLg.st101300;
		this.goBtn.label = GlobalConfig.jifengTiaoyueLg.st101293;
	}

	public open() {
		if (ActivityGuildWinnerPanel.guildBattleConst == null)
			ActivityGuildWinnerPanel.guildBattleConst = GlobalConfig.ins("GuildBattleConst");
		this.goBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this._OnClick, this)
		let config = ActivityGuildWinnerPanel.guildBattleConst;
		this.dataGroup.dataProvider = new eui.ArrayCollection(config.firstWinner)
		if (ActivityWinSummer.onPlace == ActivityModel.BTN_TYPE_04) {
			this.date0.text = "每周五20:00开启遗迹争霸";
			this.desc0.text = "活动期间首个带领公会攻占遗迹的公会会长可额外获得丰厚奖励！";
		}
		else {
			if (config.firstWinnerTime[1] >= GameServer.serverOpenDay) {
				this.date0.text = (config.firstWinnerTime[1] - GameServer.serverOpenDay + 1) + "天"
			} else {
				this.date0.text = "已结束"
			}
			this.desc0.text = config.firstWinnerInfo
		}

		GameGlobal.MessageCenter.addListener(MessageDef.GUILDWAR_FIRST_WINNER, this.updateData, this)
		this.updateData()
	}

	public close() {
		this.goBtn.removeEventListener(egret.TouchEvent.TOUCH_TAP, this._OnClick, this)
		GameGlobal.MessageCenter.removeListener(MessageDef.GUILDWAR_FIRST_WINNER, this.updateData, this)
	}

	public updateData() {
		// if(ActivityWinSummer.onPlace == ActivityModel.BTN_TYPE_04)
		// {
		// 	this.goBtn.visible = false;
		// 	this.activeGroup.visible = false;
		// 	return;
		// }

		let state = GuildReward.ins().GetFirstRewardState()
		// this.goBtn.enabled = state != RewardState.NotReached
		UIHelper.SetBtnNormalEffe(this.goBtn, state == RewardState.CanGet)
		this.goBtn.visible = state == RewardState.CanGet
		this.activeGroup.visible = state == RewardState.Gotten
	}

	private _OnClick() {
		GuildReward.ins().SendGetFirstwinnerAward()
	}

	public static IsShowAct(): boolean {
		if (ActivityGuildWinnerPanel.guildBattleConst == null)
			ActivityGuildWinnerPanel.guildBattleConst = GlobalConfig.ins("GuildBattleConst");
		return (ActivityGuildWinnerPanel.guildBattleConst.firstWinnerTime[1]) >= GameServer.serverOpenDay
	}
}
window["ActivityGuildWinnerPanel"] = ActivityGuildWinnerPanel