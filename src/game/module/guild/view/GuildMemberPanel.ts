class GuildMemberPanel extends BaseView implements ICommonWindowTitle {
	public constructor() {
		super();
		this.skinName = "GuildMemberSkin";
	}
	public m_Lan1: eui.Label;
	public m_Lan2: eui.Label;

	windowTitleIconName?: string = GlobalConfig.jifengTiaoyueLg.st100896;

	UpdateContent(): void {

	}

	list
	quitBtn
	office
	totalCon

	childrenCreated() {
		this.list.itemRenderer = GuildMemberItem2Render;
		this.m_Lan1.text = GlobalConfig.jifengTiaoyueLg.st100960;
		this.m_Lan2.text = GlobalConfig.jifengTiaoyueLg.st100961;
		this.quitBtn.label = GlobalConfig.jifengTiaoyueLg.st100962;
	};
	open() {
		var param = [];
		for (var _i = 0; _i < arguments.length; _i++) {
			param[_i - 0] = arguments[_i];
		}
		this.quitBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTap, this);
		this.list.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onListTouch, this);
		MessageCenter.addListener(Guild.ins().postGuildMembers, this.updateMember, this);
		MessageCenter.addListener(Guild.ins().postMyGuildInfo, this.updateMyInfo, this);
		this.updateMyInfo();
		this.updateMember();
	};
	close() {
		var param = [];
		for (var _i = 0; _i < arguments.length; _i++) {
			param[_i - 0] = arguments[_i];
		}
		this.quitBtn.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onTap, this);
		this.list.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onListTouch, this);
		MessageCenter.ins().removeAll(this);
	};
	onListTouch(e) {
		if (e.target instanceof eui.Button) {
			var item = e.target.parent.parent;
			item.onTap(e.target);
		}
	};
	updateMember() {
		var listData = Guild.ins().getGuildMembers(1);
		// listData.sort(this.sort);
		this.list.dataProvider = new eui.ArrayCollection(listData);
	};
	onTap(e) {
		switch (e.currentTarget) {
			case this.quitBtn:
				if (!GuildWar.ins().OtherOperation(GlobalConfig.jifengTiaoyueLg.st100958)) {
					return
				}
				WarnWin.show(GlobalConfig.jifengTiaoyueLg.st100959, function () {
					Guild.ins().sendQuitGuild();
				}, this);
				break;
		}
	};
	updateMyInfo() {
		this.office.text = GuildLanguage.guildOffice(Guild.ins().myOffice);
		this.totalCon.text = Guild.ins().myTotalCon + "";
	};
	sort(a, b) {
		if (a.attack > b.attack)
			return 1;
		else if (a.attack < b.attack)
			return -1;
		else
			return 0;
	};
}
window["GuildMemberPanel"] = GuildMemberPanel