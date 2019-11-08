class GuildFBRewardItemRender extends eui.ItemRenderer {
	public constructor() {
		super();
	}

	btn
	info
	label

	createChildren() {
		super.createChildren();
		this.skinName = "GuildFBRewardItemSkin";
		this.btn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTap, this);
	};
	dataChanged() {
		var obj = this.data;
		this.info = obj["info"];
		var id = obj["id"];
		this.label.text = this.info.wave + GlobalConfig.jifengTiaoyueLg.st101796;//"关奖励";
		if (id > GuildFB.ins().rewardNum)
			this.btn.enabled = false;
		else
			this.btn.enabled = true;
	};
	onTap(e) {
		GuildFB.ins().sendGuildFBGKRoleInfo(this.info.id);
		ViewManager.ins().open(GuildFBRewardInfoWin, this.info);
	};
}
window["GuildFBRewardItemRender"]=GuildFBRewardItemRender