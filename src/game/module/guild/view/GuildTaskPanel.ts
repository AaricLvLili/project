class GuildTaskPanel extends BaseView implements ICommonWindowTitle {
	public constructor() {
		super();
		this.name = GlobalConfig.jifengTiaoyueLg.st100975;
		this.skinName = "GuildTaskSkin"
	}
	windowTitleIconName: string = GlobalConfig.jifengTiaoyueLg.st100975;
	list: eui.List
	listData

	childrenCreated() {
		this.list.itemRenderer = GuildTaskItemRender;
		this.listData = new eui.ArrayCollection;
		this.list.dataProvider = this.listData;
	};
	open() {
		MessageCenter.addListener(Guild.ins().postGuildTaskUpdate, this.updateList, this);
		MessageCenter.addListener(Guild.ins().postConCount, this.updateList, this);
		GameGlobal.MessageCenter.addListener(MessageDef.VIP_LEVEL_CHANGE, this.updateList, this)
		this.list.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onListTouch, this);
		this.updateList();
		Guild.ins().sendConCount();
	};
	close() {
		this.list.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onListTouch, this);
		GameGlobal.MessageCenter.removeListener(MessageDef.VIP_LEVEL_CHANGE, this.updateList, this)
		MessageCenter.ins().removeAll(this);
	};
	updateList() {
		var tempArr = Guild.ins().guildTaskInfos.slice();
		for (var i = tempArr.length - 1; i >= 0; i--) {
			if (tempArr[i].stdTask.type == 0)
				tempArr.splice(i, 1);
		}
		this.listData.replaceAll(tempArr);
	};
	onLink() {
		ViewManager.ins().open(VipWin);
	};
	onListTouch(e) {
		if (e.target instanceof eui.Button) {
			var item = e.target.parent.parent;
			item.onTap(e.target);
		}
	};

	UpdateContent(): void {

	}
}
window["GuildTaskPanel"] = GuildTaskPanel