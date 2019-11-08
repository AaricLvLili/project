class ArtifactDebrisLab extends eui.Component {
	public constructor() {
		super();
		this.skinName = "ArtifactDebrisLabSkin";
	}

	public data: any;

	private groupEff: eui.Group
	private mc: MovieClip
	public m_Lab: eui.Label;
	public m_RedPoint: eui.Image;
	public createChildren() {
		super.createChildren();
		this.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onClick, this, true, 5);
	}

	public release() {
		DisplayUtils.dispose(this.mc)
		this.mc = null;
	}

	private onClick() {
		let ins = ViewManager.ins()
		//	ins.close(ArtifactTispWin)
		ins.open(ArtifactActivateTispWin, this.data);
	}

	public setData() {
		this.setMc();
		this.m_Lab.textFlow = <Array<egret.ITextElement>>[
			{ text: this.data.introduce, style: { "underline": true } }];
		let artifactModel = ArtifactModel.getInstance;
		if (this.data.id == artifactModel.curid) {
			if (artifactModel.conid >= this.data.fragmentId) {
				this.m_Lab.textColor = 0x008f22;
			}
		}
		let isCanActivate = artifactModel.checkDebrisIsCanActivate(this.data);
		if (isCanActivate) {
			this.m_RedPoint.visible = true;
			this.mc.loadUrl(ResDataPath.GetUIEffePath("eff_shenqi"), true, -1);
			this.mc.visible = true
		} else {
			this.m_RedPoint.visible = false;
			this.mc.visible = false
		}

	}

	private setMc() {
		if (!this.mc) {
			this.mc = new MovieClip
			this.mc.x = this.mc.y = 0
			this.mc.scaleX = this.mc.scaleY = 1.3
			this.groupEff.addChild(this.mc)
		}
	}

}
window["ArtifactDebrisLab"]=ArtifactDebrisLab