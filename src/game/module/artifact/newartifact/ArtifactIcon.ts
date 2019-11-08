class ArtifactIcon extends eui.ItemRenderer {
	public constructor() {
		super();
	}
	public m_Name: eui.Label;
	public m_Bg: eui.Image;
	public m_Icon: eui.Image;
	public m_SelectImg: eui.Image;
	//public m_NeedLab: eui.Label;
	private m_lockImg: eui.Image
	public m_RedPoint: eui.Image;

	public createChildren() {
		super.createChildren();
		this.addEvent();
	}

	private addEvent() {
		this.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onClick, this);
	}
	public dataChanged() {
		super.dataChanged();
		let data: ArtifactEquData = this.data;
		let artifactModel: ArtifactModel = ArtifactModel.getInstance;
		if (artifactModel.getIndex(data.type) == this.itemIndex) {
			this.m_SelectImg.visible = true;
		} else {
			this.m_SelectImg.visible = false;
		}
		let artifactsConfig = GlobalConfig.ins("ArtifactsConfig")[data.id];
		if (artifactsConfig) {
			this.m_Name.text = artifactsConfig[0].artifactsName;
			this.m_Icon.source = artifactsConfig[0].iconUi + "_png";
			this.m_Bg.source = ResDataPath.GetItemQualityName(artifactsConfig[0].quality);
		}
		if (data.id > artifactModel.curid && artifactsConfig && artifactsConfig[0].activateType == 1 && artifactModel.curid != -1) {
			//this.m_NeedLab.visible = true;
			this.m_lockImg.visible = true
		} else {
			//this.m_NeedLab.visible = false;
			this.m_lockImg.visible = false
		}
		if (this.parent && this.parent.name == "TYPE1") {
			let isCanUp = artifactModel.checkIsCanLvUP(data.id);
			let isCanUpTwo = artifactModel.checkAllDebrisIsCanActivate(data.id);
			if (isCanUp || isCanUpTwo) {
				this.m_RedPoint.visible = true;
			} else {
				this.m_RedPoint.visible = false;
			}
		} else if (this.parent && this.parent.name == "TYPE2") {
			let isCanUp = artifactModel.checkIsCanLayerUP(data.id) || artifactModel.checkIsCanLvUP(data.id);
			if (isCanUp) {
				this.m_RedPoint.visible = true;
			} else {
				this.m_RedPoint.visible = false;
			}
		}
		if (!data.isActivate) {
			FilterUtil.setGayFilter(this.m_Bg);
			FilterUtil.setGayFilter(this.m_Icon);
		} else {
			this.m_Bg.filters = null;
			this.m_Icon.filters = null;
		}
	}
	private onClick() {
		let data: ArtifactEquData = this.data;
		let artifactModel: ArtifactModel = ArtifactModel.getInstance;
		artifactModel.setIndex(data.type, this.itemIndex);
		GameGlobal.MessageCenter.dispatch(ArtifactEvt.ARTIFACT_INIT_MSG);
	}

	public release() {
		this.m_Bg.filters = null;
		this.m_Icon.filters = null;
	}
}
window["ArtifactIcon"] = ArtifactIcon