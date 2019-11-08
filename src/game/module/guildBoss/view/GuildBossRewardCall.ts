class GuildBossRewardCall extends BaseView implements ICommonWindowTitle {
	private dataGroup: eui.DataGroup
	private bossLvComp: eui.Component
	private bossGroup: eui.Group
	private bossImage: MovieClip
	private languageTxt: eui.Label;
	private languageTxt0: eui.Label;

	public constructor() {
		super();
		this.skinName = "GuildBossRewardCallSkin";
	}

	public childrenCreated() {
		this.dataGroup.itemRenderer = ItemBase
		this.languageTxt.text = GlobalConfig.jifengTiaoyueLg.st101806;
		this.languageTxt0.text = GlobalConfig.jifengTiaoyueLg.st101816;
	}

	private initMc() {
		if (!this.bossImage) {
			this.bossImage = new MovieClip;
			this.bossGroup.addChild(this.bossImage)
		}
	}

	open() {
		let index = this._GetCallIndex()
		let configData = GlobalConfig.ins("GuildBossConfig")[index]
		GuildBossViewHelper.SetBossLv(this.bossLvComp, configData.level, configData.zsLevel)
		this.dataGroup.dataProvider = new eui.ArrayCollection(RewardData.ToRewardDatas(configData.zhrewards))
		this.initMc();
		UIHelper.SetMonsterMc(this.bossImage, configData.bossId)


	}
	close() {
		MessageCenter.ins().removeAll(this);
		DisplayUtils.dispose(this.bossImage);
		this.bossImage = null;
	}

	private _GetCallIndex(): number {
		return GuildBoss.ins().GetMaxCallIndex() || 1
	}

	UpdateContent(): void {

	}
}
window["GuildBossRewardCall"] = GuildBossRewardCall