class SyBossAnim extends eui.Component {
	public constructor() {
		super();
	}

	public m_BloodBar: eui.ProgressBar;
	public m_AnimGroup: eui.Group;
	public m_BossName: eui.Label;
	private bossMc: MovieClip
	public m_ElementImg: eui.Image;


	public setData(bossId: number, groupId: number) {
		let monstersConfig = GlobalConfig.ins("MonstersConfig")[bossId];
		if (monstersConfig) {
			this.initMc(monstersConfig);
			this.m_BossName.text = monstersConfig.name;
		}
		let syBossModel = SyBossModel.getInstance;
		let syBossData = syBossModel.syBossDic.get(groupId);
		if (syBossData) {
			this.m_BloodBar.value = syBossData.hp;
		}
		this.m_ElementImg.source = ResDataPath.GetElementImgName(monstersConfig.elementType);
	}
	public initMc(monstersConfig: any) {
		if (!this.bossMc) {
			this.bossMc = new MovieClip();
			this.bossMc.x = this.m_AnimGroup.width / 2;
			this.bossMc.y = this.m_AnimGroup.height / 2;
			this.m_AnimGroup.addChild(this.bossMc);
		}
		this.bossMc.loadUrl(ResDataPath.GetMonsterBodyPath(monstersConfig.avatar + "_3s"), true, -1);
	}

	public release() {
		DisplayUtils.dispose(this.bossMc);
		this.bossMc = null;
	}
}
window["SyBossAnim"]=SyBossAnim