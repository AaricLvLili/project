class WorldChatPanel extends BaseChatPanel implements ICommonWindowTitle {
	public constructor() {
		super()
		this.skinName="WorldChatPanelSkin";
	}
	windowTitleIconName: string =GlobalConfig.jifengTiaoyueLg.st101402;
	childrenCreated() {
		super.childrenCreated()
		this.chatList.itemRenderer = ChatListItemRenderer
		this.chatList.dataProvider = Chat.ins().worldchatList
	}
	open() {
		super.open(0)
	}

	UpdateContent(): void {

	}
}
window["WorldChatPanel"]=WorldChatPanel