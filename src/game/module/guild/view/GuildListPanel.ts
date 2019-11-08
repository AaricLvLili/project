class GuildListPanel extends BaseView implements ICommonWindowTitle {
	public constructor() {
		super();
		this.skinName="GuildListSkin";
	}

	windowTitleIconName?: string = GlobalConfig.jifengTiaoyueLg.st100896;

	UpdateContent(): void {

	}

	list
	leftBtn
	rightBtn
	curPage

	childrenCreated() {
		this.list.itemRenderer = GuildListItem2Render;
	};

	open() {
		var param = [];
		for (var _i = 0; _i < arguments.length; _i++) {
			param[_i - 0] = arguments[_i];
		}
		this.leftBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTap, this);
		this.rightBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTap, this);
		MessageCenter.addListener(Guild.ins().postGuildList, this.updateList, this);
		this.updateList();
		this.pageChange(0);
	};
	close() {
		var param = [];
		for (var _i = 0; _i < arguments.length; _i++) {
			param[_i - 0] = arguments[_i];
		}
		this.leftBtn.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onTap, this);
		this.rightBtn.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onTap, this);
		MessageCenter.ins().removeAll(this);
	};
	pageChange(page) {
		if (this.curPage != page && page >= 0 && page < Guild.ins().pageMax) {
			this.curPage = page;
			Guild.ins().sendGuildList();
			this.leftBtn.visible = this.curPage != 0;
		}
	};
	updateList() {
		this.list.dataProvider = new eui.ArrayCollection(Guild.ins().guildListInfos);
		this.rightBtn.visible = this.curPage != Guild.ins().pageMax - 1;
	};
	onTap(e) {
		switch (e.currentTarget) {
			case this.leftBtn:
				if (this.curPage > 0) {
					this.pageChange(this.curPage - 1);
				}
				break;
			case this.rightBtn:
				if (this.curPage < Guild.ins().pageMax - 1) {
					this.pageChange(this.curPage + 1);
				}
				break;
		}
	};
}
window["GuildListPanel"]=GuildListPanel