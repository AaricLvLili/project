class GuildApplyWin extends BaseEuiPanel implements ICommonWindow, ICommonWindowTitle {
	public constructor() {
		super();
	}

	list
	dataArr: eui.ArrayCollection

	private commonWindowBg: CommonWindowBg
	windowTitleIconName: string = GlobalConfig.jifengTiaoyueLg.st100896;
	createBtn
	noGuild
	UpdateContent() {

	}
	initUI() {
		super.initUI()
		this.skinName = "GuildApplySkin";
		this.list.itemRenderer = GuildListItemRender;
		this.dataArr = new eui.ArrayCollection([]);
		this.list.dataProvider = this.dataArr;
		this.noGuild.text = GlobalConfig.jifengTiaoyueLg.st100897;
		this.createBtn.label=GlobalConfig.jifengTiaoyueLg.st100906;
	};
	static openCheck() {
		return true;
	};
	open() {
		this.commonWindowBg.OnAdded(this)
		this.createBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTap, this);
		this.list.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onListTouch, this);
		MessageCenter.addListener(Guild.ins().postGuildList, this.updateList, this);
		MessageCenter.addListener(Guild.ins().postGuildJoinResult, this.updateList, this);
		Guild.ins().sendGuildList();
	};
	close() {
		this.commonWindowBg.OnRemoved()
		this.createBtn.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onTap, this);
		this.list.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onListTouch, this);
		MessageCenter.ins().removeAll(this);

		//UIView2.CloseNav(UIView2.NAV_GUILD)
	};
	onListTouch(e) {
		if (e.target instanceof eui.Button) {
			var item = e.target.parent;
			item.onTap();
		}
	};
	updateList() {
		this.noGuild.visible = Guild.ins().guildListInfos.length == 0;
		this.dataArr.replaceAll(Guild.ins().guildListInfos);
	};
	onTap(e) {
		switch (e.currentTarget) {
			case this.createBtn:
				ViewManager.ins().open(GuildCreateWin);
				break;
		}
	};
	destoryView() {
		super.destoryView()
		for (var i = 0; i < this.list.numElements; i++) {
			if (this.list.getElementAt(i))
				this.list.getElementAt(i).destruct();
		}
	};
}


ViewManager.ins().reg(GuildApplyWin, LayerManager.UI_Main);
window["GuildApplyWin"] = GuildApplyWin