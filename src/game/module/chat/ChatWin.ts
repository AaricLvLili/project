class ChatWin extends BaseEuiPanel implements ICommonWindow {

	cruIndex = 0
	// fistOpenGuild = true
	private commonWindowBg: CommonWindowBg


	private kefuPanel: CustomServicePanel;
	public viewStack: eui.ViewStack;
	public worldPanel: WorldChatPanel;
	public kfPanel: KfChatPanel;
	public guildPanel: GuildChatPanel;
	public sysPanel: SysChatPanel;

	public constructor() {
		super()
	}

	initUI() {
		super.initUI()
		this.skinName = "MainWinSkin";
		// this.viewStack.removeChildAt(3)
		this.worldPanel = new WorldChatPanel();
		this.worldPanel.name = "世界"
		this.kfPanel = new KfChatPanel();
		this.kfPanel.name = "跨服"
		this.guildPanel = new GuildChatPanel();
		this.guildPanel.name = "公会"
		this.sysPanel = new SysChatPanel();
		this.sysPanel.name = "系统"
		this.commonWindowBg.AddChildStack(this.worldPanel);
		this.commonWindowBg.AddChildStack(this.kfPanel);
		this.commonWindowBg.AddChildStack(this.guildPanel);
		this.commonWindowBg.AddChildStack(this.sysPanel);
	}
	open() {
		if (this.kefuPanel && this.kefuPanel.desc)
			this.kefuPanel.desc.text = GlobalConfig.jifengTiaoyueLg.st101715;
		this.commonWindowBg.OnAdded(this)

	}
	close() {
		// this.$onClose();
		this.commonWindowBg.OnRemoved()
		this.worldPanel.release();
		this.kfPanel.release();
		this.guildPanel.release();
		this.sysPanel.release();
	}

	public static CanGuildChat(): boolean {
		if (!GameLogic.ins().actorModel.guildID) {
			UserTips.ins().showTips(GlobalConfig.jifengTiaoyueLg.st101716)
			return false
		}
		return true
	}
	OnBackClick(clickType: number): number {
		return 0
	}
	OnOpenIndex(openIndex: number): boolean {

		if (openIndex == 2) {
			if (!ChatWin.CanGuildChat()) {
				return false
			}
			// if (this.fistOpenGuild) {
			// 	this.fistOpenGuild = false
			if (Chat.ins().guildchatList.length < 1) {
				Guild.ins().sendAllGuildMessage()
			}
			// }
		}
		return true
	}
}

ViewManager.ins().reg(ChatWin, LayerManager.UI_Main);

window["ChatWin"] = ChatWin