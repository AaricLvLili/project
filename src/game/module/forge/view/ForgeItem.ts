class ForgeItem extends BaseView {
	public constructor() {
		super()
	}
	_source
	item
	_type
	boost
	gem: eui.Label
	tupo0
	tupo
	aperture: eui.Image
	imgBg
	_bgSource
	EquipEffect: MovieClip;
	private oldlv: number = null;
	getSource() {
		return this._source;
	};
	setSource(value) {
		if (this._source == value)
			return;
		this._source = value;
		this.item.source = this._source;
	};
	setBgSource(value) {
		if (this._bgSource == value)
			return;
		this._bgSource = value;
		this.imgBg.source = this._bgSource;
	};
	setState(bool: boolean) {
		this.aperture.visible = bool
	}
	setValue(num) {
		switch (this._type) {
			case 0:
				this.boost.text = "+" + num;
				break;
			case 1:
				this.gem.text = "+" + num;
				break;
			case 2:
				this.tupo0.text = "+" + num;
				break;
			case 3:
				this.tupo.text = num + "星";
				break;
		}
		if (this.oldlv != null && this.oldlv < num) {
			this.playeEff();
		}
		this.oldlv = num;
	};
	getType() {
		return this._type;
	};
	setType(value) {
		if (this._type == value)
			return;
		this._type = value;
		switch (this._type) {
			case 0:
				this.boost.visible = true;
				this.gem.visible = false;
				this.tupo0.visible = false;
				this.tupo.visible = false;
				break;
			case 1:
				this.boost.visible = false;
				this.gem.visible = true;
				this.tupo0.visible = false;
				this.tupo.visible = false;
				break;
			case 2:
				this.boost.visible = false;
				this.gem.visible = false;
				this.tupo0.visible = true;
				this.tupo.visible = false;
				break;
			case 3:
				this.boost.visible = false;
				this.gem.visible = false;
				this.tupo0.visible = false;
				this.tupo.visible = true;
				break;
		}
	};

	public clear() {
		if (this.EquipEffect) {
			DisplayUtils.removeFromParent(this.EquipEffect)
			ObjectPool.ins().push(this.EquipEffect);
		}
	}

	showItemEffect(quality) {
		if (quality > 3) {
			this.showEffect(quality)
		} else {
			if (this.EquipEffect) {
				// this.EquipEffect.clearCache()
				DisplayUtils.removeFromParent(this.EquipEffect)
				ObjectPool.ins().push(this.EquipEffect);
			}
		}
	}

	public showEffect(e): void {
		this.EquipEffect || (this.EquipEffect = new MovieClip())
		this.EquipEffect.touchEnabled = false
		if (e >= 4) {
			this.EquipEffect.loadUrl(ResDataPath.GetUIEffePath("quaeff" + e), !0)
			this.EquipEffect.x = 40
			this.EquipEffect.y = 35
		} else {
			this.EquipEffect.loadFile(RES_DIR_EFF + "quality_0" + e, !0)
			this.EquipEffect.x = 40
			this.EquipEffect.y = 35;
		}
		this.addChild(this.EquipEffect)

	}
	private eff: MovieClip;
	public m_EffGroup: eui.Group;
	private playeEff() {
		this.eff = ViewManager.ins().createEff(this.eff, this.m_EffGroup, "eff_ui_icon", 1)
	}

}
window["ForgeItem"] = ForgeItem