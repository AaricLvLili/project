class GuildBossRewardHurt extends BaseView implements ICommonWindowTitle {
	private list: eui.List
	private languageTxt: eui.Label;
	public constructor() {
		super()
		this.skinName = "GuildBossRewardHurtSkin";
	}

	protected childrenCreated(): void {
		this.languageTxt.text = GlobalConfig.jifengTiaoyueLg.st101817;
	}
	open() {
		let index = this._GetCallIndex()
		let configData = GlobalConfig.ins("GuildBossConfig")[index]
		let sourceArr = []
		let config = GlobalConfig.ins("GuildBossDLConfig")
		let datas = [
			{ "num": GuildBossViewHelper.setph(config[1].upperlimit, config[1].lowerlimit), "data": new eui.ArrayCollection(configData.limitRewards1) },
			{ "num": GuildBossViewHelper.setph(config[2].upperlimit, config[2].lowerlimit), "data": new eui.ArrayCollection(configData.limitRewards2) },
			{ "num": GuildBossViewHelper.setph(config[3].upperlimit, config[3].lowerlimit), "data": new eui.ArrayCollection(configData.limitRewards3) },
			{ "num": GuildBossViewHelper.setph(config[4].upperlimit, config[4].lowerlimit), "data": new eui.ArrayCollection(configData.limitRewards4) },
			{ "num": GuildBossViewHelper.setph(config[5].upperlimit, config[5].lowerlimit), "data": new eui.ArrayCollection(configData.limitRewards5) }]

		this.list.dataProvider = new eui.ArrayCollection(datas)
	}
	close() {
		MessageCenter.ins().removeAll(this);
	}

	private _GetCallIndex(): number {
		return GuildBoss.ins().GetMaxCallIndex() || 1
	}

	UpdateContent(): void {

	}
}
window["GuildBossRewardHurt"] = GuildBossRewardHurt