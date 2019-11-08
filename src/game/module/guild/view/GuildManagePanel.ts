class GuildManagePanel extends BaseView implements ICommonWindowTitle {
	public constructor() {
		super()
		this.skinName="GuildManageBuildSkin";
	}

	windowTitleIconName?: string = GlobalConfig.jifengTiaoyueLg.st100896;

	UpdateContent(): void {

	}

	buildList: eui.List
	messageList
	buildScroller

	private static DATA = [GuildBuilding.GUILD_HALL, GuildBuilding.GUILD_LIANGONGFANG , GuildBuilding.GUILD_SHOP, GuildBuilding.GUILD_BOSS]

	childrenCreated() {
		this.buildList.itemRenderer = GuildBuildItemRender;
		this.messageList.itemRenderer = GuildEventItenRender;

		this.buildList.dataProvider = new eui.ArrayCollection()
	};
	openCheck() {
		var param = [];
		for (var _i = 0; _i < arguments.length; _i++) { 
			param[_i - 0] = arguments[_i];
		}
		return true;
	};
	open() {
		this.buildList.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onListTouch, this);
		MessageCenter.addListener(Guild.ins().postUpBuilding, this.updateList, this);
		MessageCenter.addListener(Guild.ins().postManageList, this.update, this);
		MessageCenter.addListener(Guild.ins().postGuildMoney, this.update, this);
		Guild.ins().sendManageList();
		this.updateList();
	};
	close() {
		this.buildList.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onListTouch, this);
		MessageCenter.ins().removeAll(this);
	};
	update() {
		this.messageList.dataProvider = new eui.ArrayCollection(Guild.ins().records);
	};
	updateList() {
		(this.buildList.dataProvider as eui.ArrayCollection).replaceAll(GuildManagePanel.DATA)
		// this.index = this.buildScroller.viewport.scrollV;
		// this.buildScroller.viewport.scrollV = index;
		// this.refushBar();
	};
	// refushBar() {
	// 	TimerManager.ins().remove(this.refushBarList, this);
	// 	TimerManager.ins().doTimer(100, 1, this.refushBarList, this);
	// };
	// refushBarList() {
	// 	TimerManager.ins().remove(this.refushBarList, this);
		// this.buildScroller.viewport.scrollV = this.index;
	// };
	onListTouch(e) {
		if (e.target instanceof eui.Button) {
			var item = e.target.parent;
			item.onTap(e.target);
		}
	};
}
window["GuildManagePanel"]=GuildManagePanel