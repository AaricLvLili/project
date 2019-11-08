class GuildBossRewardJoin extends BaseView implements ICommonWindowTitle{
	private dataGroup: eui.DataGroup
	private bossLvComp: eui.Component
	private bossGroup: eui.Group
	private bossImage: MovieClip
	private languageTxt: eui.Label;
	private languageTxt0: eui.Label;

	public constructor() {
		super();
		this.skinName = "GuildBossRewardJoinSkin";
	}

	open() {
		let index = this._GetCallIndex()
		let configData = GlobalConfig.ins("GuildBossConfig")[index]
		GuildBossViewHelper.SetBossLv(this.bossLvComp, configData.level, configData.zsLevel)
		this.dataGroup.dataProvider = new eui.ArrayCollection(RewardData.ToRewardDatas(configData.cyrewards))
		this.initMc();
		UIHelper.SetMonsterMc(this.bossImage, configData.bossId)
	}
	close() {
		DisplayUtils.dispose(this.bossImage);
		this.bossImage = null;
		MessageCenter.ins().removeAll(this);
	}

	protected childrenCreated(): void {
		this.dataGroup.itemRenderer = ItemBase
		this.languageTxt.text = GlobalConfig.jifengTiaoyueLg.st101819;
		this.languageTxt0.text = GlobalConfig.jifengTiaoyueLg.st101818;
	}

	private initMc() {
		if (!this.bossImage) {
			this.bossImage = new MovieClip;
			this.bossGroup.addChild(this.bossImage)
		}
	}
	private _GetCallIndex(): number {
		return GuildBoss.ins().GetMaxCallIndex() || 1
	}

	UpdateContent(): void {

	}
}
window["GuildBossRewardJoin"] = GuildBossRewardJoin