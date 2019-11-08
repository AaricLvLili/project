class ArtifactBaseIcon extends eui.Component {
	public constructor() {
		super();
	}
	public m_Name: eui.Label;
	public m_Bg: eui.Image;
	public m_Icon: eui.Image;
	public m_SelectImg: eui.Image;
	public m_NeedLab: eui.Label;


	public createChildren() {
		super.createChildren();
		this.m_SelectImg.visible = false;
		this.m_NeedLab.visible = false;
	}

	public setData(data: ArtifactEquData) {
		let artifactModel: ArtifactModel = ArtifactModel.getInstance;
		let artifactsConfig = GlobalConfig.ins("ArtifactsConfig")[data.id];
		if (artifactsConfig) {
			this.m_Name.text = artifactsConfig.artifactsName;
			this.m_Icon.source = artifactsConfig[0].iconUi + "_png";
		}
		this.m_Bg.source = ResDataPath.GetItemQualityName(5);
	}
}
window["ArtifactBaseIcon"]=ArtifactBaseIcon