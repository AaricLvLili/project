class ArtifactTipsAnim extends eui.Component {
	public constructor() {
		super();
		this.skinName = "ArtifactTipsAnimSkin";
	}
	public m_RAndNameLab: eui.Label;
	public m_AnimGroup: eui.Group;
	private groupEff: eui.Group
	private mcBtn: MovieClip
	public m_EffGroup: eui.Group;

	public createChildren() {
		super.createChildren();
	}

	public release() {
		DisplayUtils.dispose(this.m_NewEff);
		this.m_NewEff = null;
		DisplayUtils.dispose(this.mcBtn);
		this.mcBtn = null;
	}

	public setData(name: string) {
		this.playNewEff(name)
	}

	private playNewEff(name: string) {
		let artifactModel = ArtifactModel.getInstance;
		this.m_NewEff = ViewManager.ins().createEff(this.m_NewEff, this.m_AnimGroup, name, -1);
		this.m_Eff = ViewManager.ins().createEff(this.m_Eff, this.m_EffGroup, "eff_ui_matrix", -1);
	}
	private m_NewEff: MovieClip;
	private m_Eff: MovieClip;

}
window["ArtifactTipsAnim"] = ArtifactTipsAnim