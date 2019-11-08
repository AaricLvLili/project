class GuildChatPanel extends BaseChatPanel implements ICommonWindowTitle {
	public constructor() {
		super()
		this.skinName="WorldChatPanelSkin";
	}
	windowTitleIconName: string = GlobalConfig.jifengTiaoyueLg.st100896;
	childrenCreated() {
		super.childrenCreated()
		this.chatList.itemRenderer = ChatGuildItemRender
		this.chatList.dataProvider = Chat.ins().guildchatList
	}
	open() {
		super.open(2)
	}

	UpdateContent(): void {

	}
}
window["GuildChatPanel"]=GuildChatPanel