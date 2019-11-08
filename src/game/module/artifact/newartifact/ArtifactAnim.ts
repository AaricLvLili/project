class ArtifactAnim extends eui.Component {
	public constructor() {
		super();
	}
	public m_Bg: eui.Image;
	public m_LvLab: eui.Label;
	public m_RAndNameLab: eui.Label;
	public m_EffGroup: eui.Group;
	public m_AnimGroup: eui.Group;
	public m_Power: PowerLabel;

	public m_AnimGroup0: eui.Group;

	public childrenCreated() {
		super.childrenCreated();
		this.m_LvLab.visible = false;
	}

	public release() {
		DisplayUtils.dispose(this.m_NewEff);
		this.m_NewEff = null;
		DisplayUtils.dispose(this.m_Eff);
		this.m_Eff = null;
	}

	public setData(artifactEquData: ArtifactEquData) {
		let artifactModel = ArtifactModel.getInstance;
		// this.m_LvLab.text = LanguageString.LanguageChange(GlobalConfig.languageConfig.st101439, [artifactEquData.level]);
		let ArtifactsConfig = GlobalConfig.ins("ArtifactsConfig")[artifactEquData.id];
		if (ArtifactsConfig) {
			let strenglv = artifactEquData.strenglv;
			if (strenglv <= 0) {
				strenglv = 0;
			}
			// this.m_RAndNameLab.text = "Lv." + strenglv + " " + ArtifactsConfig[0].artifactsName;
			this.m_RAndNameLab.text = LanguageString.jifengTiaoyueCh(GlobalConfig.jifengTiaoyueLg.st101439, [artifactEquData.level]) + " " + ArtifactsConfig[0].artifactsName;
			this.playNewEff(ArtifactsConfig)
		}
		this.m_Power.text = artifactEquData.allPower;
	}

	private m_NewEff: MovieClip;
	private m_Eff: MovieClip;
	public playNewEff(artifactsConfig: any) {
		this.m_NewEff = ViewManager.ins().createEff(this.m_NewEff, this.m_AnimGroup, artifactsConfig[0].effUi, -1)
		this.m_Eff = ViewManager.ins().createEff(this.m_Eff, this.m_AnimGroup0, "eff_ditu", -1)
	}



}
window["ArtifactAnim"] = ArtifactAnim