class GuildBossRewardPanel extends BaseEuiPanel implements ICommonWindow {
	public constructor() {
		super()
		this.skinName = "MainWinSkin"
	}
	private commonWindowBg: CommonWindowBg
	private guildBossRewardJoin:GuildBossRewardJoin;
	private guildBossRewardCall:GuildBossRewardCall;
	private guildBossRewardHurt:GuildBossRewardHurt;

	initUI() {
		super.initUI();
		this.guildBossRewardJoin = new GuildBossRewardJoin();
		this.guildBossRewardJoin.name = GlobalConfig.jifengTiaoyueLg.st101818;//"参与奖励";
		this.commonWindowBg.AddChildStack(this.guildBossRewardJoin);

		this.guildBossRewardCall = new GuildBossRewardCall();
		this.guildBossRewardCall.name = GlobalConfig.jifengTiaoyueLg.st101806;
		this.commonWindowBg.AddChildStack(this.guildBossRewardCall);

		this.guildBossRewardHurt = new GuildBossRewardHurt();
		this.guildBossRewardHurt.name = GlobalConfig.jifengTiaoyueLg.st101815;//"伤害奖励"
		this.commonWindowBg.AddChildStack(this.guildBossRewardHurt);
	}
	open(...param: any[]) {
		this.commonWindowBg.OnAdded(this, param && param[0]);
	}

	close() {
		this.commonWindowBg.OnRemoved()
	}

	OnBackClick(clickType: number): number {
		return 0
	}

	OnOpenIndex(openIndex: number): boolean {
		return true
	}

	mWindowHelpId = 24
}

ViewManager.ins().reg(GuildBossRewardPanel, LayerManager.UI_Main);
window["GuildBossRewardPanel"] = GuildBossRewardPanel