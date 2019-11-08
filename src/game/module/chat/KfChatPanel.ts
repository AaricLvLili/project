class KfChatPanel extends BaseChatPanel implements ICommonWindowTitle {
	public constructor() {
		super()
		this.skinName="WorldChatPanelSkin";
	}
	windowTitleIconName: string = GlobalConfig.jifengTiaoyueLg.st100466;
	childrenCreated() {
		super.childrenCreated()
		this.chatList.itemRenderer = ChatListItemRenderer
		this.chatList.dataProvider = Chat.ins().kfChatList
	}
	open() {
		super.open(1)
	}
	UpdateContent(): void {

	}
}
window["KfChatPanel"] = KfChatPanel