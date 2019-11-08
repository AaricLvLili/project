class SysChatPanel extends BaseChatPanel implements ICommonWindowTitle {

	public constructor() {
		super()
		this.skinName = "SysPanelSkin";
	}
	windowTitleIconName: string = GlobalConfig.jifengTiaoyueLg.st101403;
	childrenCreated() {
		super.childrenCreated()
		this.chatList.itemRenderer = ChatSystemItemRenderer
		this.chatList.dataProvider = Chat.ins().syschatList
	}
	open() {
		super.open(3)
	}


	UpdateContent(): void {

	}
}
window["SysChatPanel"] = SysChatPanel