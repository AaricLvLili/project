class GuildActityPanel extends BaseView implements ICommonWindowTitle {
	public constructor() {
		super();

		this.skinName = "GuildActitySkin";
        this.name = GlobalConfig.jifengTiaoyueLg.st101005;
		this.list.itemRenderer = GuildActityItemRender;
	}
	windowTitleIconName: string =  GlobalConfig.jifengTiaoyueLg.st101005;
	list
	open(...param: any[]) {
		this.updateData();
		this.list.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onListTouch, this);
	};
	close(...param: any[]) {
		this.list.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onListTouch, this);
	};
	updateData() {
		var config = [];
		var guildActivityConfig = GlobalConfig.ins("guildActivityConfig");
		for (var k in guildActivityConfig) {
			var cfgg = guildActivityConfig[k];
			config.push(cfgg);
		}
		this.list.dataProvider = new eui.ArrayCollection(config);
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
window["GuildActityPanel"]=GuildActityPanel