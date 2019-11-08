class GuildWin extends BaseEuiPanel implements ICommonWindow {

	private commonWindowBg: CommonWindowBg

	public constructor() {
		super();
		this.layerLevel = VIEW_LAYER_LEVEL.TOP;
	}
	guildInfoPanel: GuildInfoPanel
	guildManagePanel: GuildManagePanel
	guildMemberPanel: GuildMemberPanel
	guildListPanel: GuildListPanel
	initUI() {
		super.initUI()
		this.skinName = "MainWinSkin";
		this.guildInfoPanel = new GuildInfoPanel();
		this.guildInfoPanel.name = GlobalConfig.jifengTiaoyueLg.st100932
		this.commonWindowBg.AddChildStack(this.guildInfoPanel);
		this.guildManagePanel = new GuildManagePanel();
		this.guildManagePanel.name = GlobalConfig.jifengTiaoyueLg.st100933
		this.commonWindowBg.AddChildStack(this.guildManagePanel);
		this.guildMemberPanel = new GuildMemberPanel();
		this.guildMemberPanel.name = GlobalConfig.jifengTiaoyueLg.st100934
		this.commonWindowBg.AddChildStack(this.guildMemberPanel);
		this.guildListPanel = new GuildListPanel();
		this.guildListPanel.name = GlobalConfig.jifengTiaoyueLg.st100935;
		this.commonWindowBg.AddChildStack(this.guildListPanel);
	};

	static openCheck() {
		var param = [];
		for (var _i = 0; _i < arguments.length; _i++) {
			param[_i - 0] = arguments[_i];
		}
		return true;
	};
	open(...param: any[]) {

		this.commonWindowBg.OnAdded(this, param[0] || 0)
		MessageCenter.addListener(Guild.ins().postGuildApplysInfos, this.updateApplys, this);
		Guild.ins().sendMyGuildInfo();
		this.updateApplys();
	};
	close() {

		MessageCenter.ins().removeAll(this);
	};
	updateApplys() {
		// this.redPoint0.visible = Guild.ins().hasApplys();
		this.commonWindowBg.ShowTalRedPoint(0, Guild.ins().hasApplys())
	};
	OnBackClick?(clickType: number): number {
		ViewManager.ins().open(GuildMap);
		return 0
	}

	OnOpenIndex?(openIndex: number): boolean {
		return true
	}
}
ViewManager.ins().reg(GuildWin, LayerManager.UI_Main);
window["GuildWin"] = GuildWin