class BossBloodRoleItem extends eui.ItemRenderer {
	private roleHead: eui.Image;
	private roleName: eui.Label;
	private _bar: eui.ProgressBar;
	clickEffc: MovieClip;
	public id;
	public barNum: eui.Label;

	public constructor() {
		super()
		this.skinName = "BossBloodRoleItemSkin";
		this.clickEffc = new MovieClip;

	}

	dataChanged() {
		super.dataChanged();

		this.roleHead.source = ResDataPath.GetHeadMiniImgName(this.data.job, this.data.sex);
		this.id = this.data.id;
		this.roleName.text = this.data.name;
		this._bar.maximum = this.data.total;
		this._bar.value = this.data.value;
		this._bar.labelDisplay.visible = false;

		if (this.data.total == 0 && this.data.total == this.data.value) {
			this.barNum.text = "0%"
		}
		else {
			this.barNum.text = (Math.round((this.data.value / this.data.total) * 10000) / 100).toFixed(2) + '%';
		}
	}

	showEffect() {
		this.clickEffc.x = 44;
		this.clickEffc.y = 36;
		this.clickEffc.loadUrl(ResDataPath.GetUIEffePath("tapCircle"), !0, 1)
		this.addChild(this.clickEffc)
	}

	clearEffect() {
		DisplayUtils.removeFromParent(this.clickEffc)
	}

}

window["BossBloodRoleItem"] = BossBloodRoleItem