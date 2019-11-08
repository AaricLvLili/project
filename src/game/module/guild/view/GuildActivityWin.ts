class GuildActivityWin extends BaseEuiPanel implements ICommonWindow {
	public constructor() {
		super();
	}
	// tab
	// viewStack

	// fubenPanel: GuildFubenWin
	// activityPanel: GuildActityPanel
	// lastSelect: number;
	// closeBtn
	// closeBtn0
	// redPoint1

	private commonWindowBg: CommonWindowBg

	initUI() {
		super.initUI()
		this.skinName = "MainWinSkin";
		// this.tab.dataProvider = this.viewStack;
		this.commonWindowBg.AddChildStack(new GuildTaskPanel())
		this.commonWindowBg.AddChildStack(new GuildFubenWin())
		this.commonWindowBg.AddChildStack(new GuildActityPanel())
		GuildFB.ins().SendGetGuildFbInfo()
	};

	open(...param: any[]) {
		MessageCenter.addListener(GuildFB.ins().postGuildFubenInfo, this.updateRedpoint, this);
		MessageCenter.addListener(GuildFB.ins().postGuildFBSweep, this.updateRedpoint, this);
		MessageCenter.addListener(Guild.ins().postGuildTaskUpdate, this.updateRedpoint, this);
		this.updateRedpoint();
		this.commonWindowBg.OnAdded(this, param[0] ? param[0] : 0)
	};
	updateRedpoint() {
		this.commonWindowBg.ShowTalRedPoint(0, Guild.ins().IsTaskRedPoint())
		this.commonWindowBg.ShowTalRedPoint(1, GuildFB.ins().hasbtn())
		// this.commonWindowBg.ShowTalRedPoint(2, GuildRobber.ins().hasbtn())
	};
	close() {
		this.commonWindowBg.OnRemoved()
	};

	OnOpenIndex?(openIndex: number): boolean {
		if (openIndex == 1) {
			if (GameServer.serverOpenDay < GlobalConfig.guildfbconfig.openDay - 1) {
				UserTips.ins().showTips(GlobalConfig.jifengTiaoyueLg.st100974);
				return false
			}
		}
		return true
	}
}

ViewManager.ins().reg(GuildActivityWin, LayerManager.UI_Main);

window["GuildActivityWin"] = GuildActivityWin