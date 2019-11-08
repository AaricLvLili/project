class GuildWarRewardPanel extends BaseEuiPanel implements ICommonWindow {

	public static LAYER_LEVEL = LayerManager.UI_Main

	private commonWindowBg: CommonWindowBg

	public constructor() {
		super()
		this.skinName = "MainWinSkin"
	}

	type = 0

	public open(...param: any[]) {
		this.type = 0
		param[1] && (this.type = param[1])
		this.addPanelList()
		this.commonWindowBg.OnAdded(this, param && param[0] || 0)
	}

	public close() {
		this.commonWindowBg.OnRemoved()
	}

	addPanelList() {
		this.commonWindowBg.RemoveChildStack();
		if (GuildWar.ins().isWatStart || 1 == this.type) {
			this.commonWindowBg.AddChildStack(new GuildInteRankInfo)
			this.commonWindowBg.AddChildStack(new PersonalInteRankInfo)
		}
		if (1 != this.type) {
			this.commonWindowBg.AddChildStack(new GuildInteRewardInfo)
			this.commonWindowBg.AddChildStack(new PersonInteRewardInfo)
		}
	}

	OnOpenIndex?(openIndex: number): boolean {
		return true
	}
}
window["GuildWarRewardPanel"] = GuildWarRewardPanel