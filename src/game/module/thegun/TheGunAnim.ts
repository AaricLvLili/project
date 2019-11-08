class TheGunAnim extends eui.Component {
	public constructor() {
		super();
		this.skinName = "TheGunAnimSkin";
	}
	public m_Bg: eui.Image;
	public m_EffGroup: eui.Group;
	public m_AnimGroup: eui.Group;
	public totalPower: PowerLabel;
	public m_NameBg: eui.Image;
	public m_RAndNameLab: eui.Label;
	private m_Eff: MovieClip;
	public m_Lv: number;
	public m_NowLv: number;
	public m_AnimGroup0: eui.Group;
	public m_DuTuEff: MovieClip;
	public setTheGunData(theGunData: TheGunData) {
		if (!theGunData) {
			return;
		}
		let theGunModel: TheGunModel = TheGunModel.getInstance;
		let spearLevelConfig = GlobalConfig.ins("SpearLevelConfig")[theGunData.level];
		if (spearLevelConfig) {
			this.m_RAndNameLab.text = spearLevelConfig.name;
			this.playEff(spearLevelConfig.appearance);
			this.m_Lv = theGunData.level;
			this.m_NowLv = theGunData.level;
			this.totalPower.visible = true;
			let power = theGunModel.getAllPower(theGunData);
			this.totalPower.text = power + "";
		}
	}

	private playEff(name: string) {
		this.m_Eff = ViewManager.ins().createEff(this.m_Eff, this.m_AnimGroup, name, -1)
		this.m_DuTuEff = ViewManager.ins().createEff(this.m_DuTuEff, this.m_AnimGroup0, "eff_ditu", -1)
	}

	public changeAnimLv(lv: number) {
		let theGunModel: TheGunModel = TheGunModel.getInstance;
		let spearLevelConfig = GlobalConfig.ins("SpearLevelConfig")[lv];
		if (spearLevelConfig) {
			this.m_RAndNameLab.text = spearLevelConfig.name;
			this.m_Lv = lv;
			this.totalPower.visible = false;
			this.playEff(spearLevelConfig.appearance);
			this.m_Eff.gotoAndPlay(1, -1);
		}
	}

	public release() {
		if (this.m_Eff) {
			DisplayUtils.dispose(this.m_Eff);
			this.m_Eff = null;
		}
		if (this.m_DuTuEff) {
			DisplayUtils.dispose(this.m_DuTuEff);
			this.m_DuTuEff = null;
		}
	}
}
window["TheGunAnim"] = TheGunAnim