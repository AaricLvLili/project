class VIP3WIn extends BaseEuiPanel {

	static LAYER_LEVEL = LayerManager.UI_Main

	public constructor() {
		super()
	}

	closeBtn
	closeBtn0
	// artifactEff
	// qualityEff1
	// qualityEff2
	// qualityEff3
	// suerEff
	closeBtn1
	sureBtn

	private group: eui.Group
	private groupEff: eui.Group

	// private m_ArtifactEff: MovieClip

	initUI() {
		super.initUI()
		this.skinName = "Vip3Skin"
		// this.artifactEff = new MovieClip
		// this.artifactEff.x = 100
		// this.artifactEff.y = 140
		// this.artifactEff.scaleX = this.artifactEff.scaleY = .75
		// this.qualityEff1 = new MovieClip
		// this.qualityEff1.x = 103
		// this.qualityEff1.y = 470
		// this.qualityEff2 = new MovieClip
		// this.qualityEff2.x = 235
		// this.qualityEff2.y = 470
		// this.qualityEff3 = new MovieClip
		// this.qualityEff3.x = 375
		// this.qualityEff3.y = 470
		// this.suerEff = this.suerEff || new MovieClip
		// this.suerEff.x = 50
		// this.suerEff.y = 19

		// this.m_ArtifactEff = VipWin.LoadVIPEff(3)
		// this.m_ArtifactEff.x = 200
		// this.m_ArtifactEff.y = 200
		let eff = VipWin.LoadVIPEff(3)
		eff.x = this.groupEff.width / 2
		eff.y = this.groupEff.height / 2
		//this.addChildAt(eff, this.getChildIndex(this.group) + 1)
		this.groupEff.addChild(eff)
	}

	open() {
		for (var e = [], t = 0; t < arguments.length; t++) e[t] = arguments[t];
		this.closeBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTap, this)
		this.closeBtn0.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTap, this)
		this.closeBtn1.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTap, this)
		this.sureBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTap, this)
		// this.artifactEff.loadFile(RES_DIR_EFF + "artifacteff", !0, -1)
		// this.addChild(this.artifactEff)
		// this.qualityEff1.loadFile(RES_DIR_EFF + "quality_05", !0, -1)
		// this.addChild(this.qualityEff1), this.qualityEff2.loadFile(RES_DIR_EFF + "quality_05", !0, -1)
		// this.addChild(this.qualityEff2), this.qualityEff3.loadFile(RES_DIR_EFF + "quality_05", !0, -1)
		// this.addChild(this.qualityEff3)

		let awardsData = GlobalConfig.ins("VipConfig")[3].awards
		for (let i = 1; i <= 3; ++i) {
			let award = awardsData[i]
			let comp: {
				item: ItemBase
				attr1: eui.Label
				attr2: eui.Label
				attrp: eui.Label
			} = this.group.getChildAt(i - 1) as any
			comp.item.data = award
			if (comp && comp.item) {
				comp.item.showItemEffect()
			}
			comp.attr1.text = AttributeData.GetAttrValueByItemId(award.id, AttributeType.atMaxHp)
			comp.attr2.text = AttributeData.GetAttrValueByItemId(award.id, AttributeType.atAttack)
			comp.attrp.text = "战斗力 " + ItemConfig.CalculateItemScore(award.id).toString()
		}

		if (GameGlobal.actorModel.vipLv < 3) {
			this.sureBtn.visible = false
			UIHelper.SetBtnNormalEffe(this.sureBtn, false)
		} else {
			this.sureBtn.visible = true
			this.closeBtn1.visible = false
			UIHelper.SetBtnNormalEffe(this.sureBtn, true)
		}
	}

	close() {
		for (var e = [], t = 0; t < arguments.length; t++) e[t] = arguments[t];
		this.closeBtn.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onTap, this)
		this.closeBtn0.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onTap, this)
		this.closeBtn1.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onTap, this)
		this.sureBtn.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onTap, this)
	}

	onTap(e) {
		switch (e.currentTarget) {
			case this.closeBtn:
			case this.closeBtn0:
				ViewManager.ins().close(VIP3WIn);
				break;
			case this.closeBtn1:
				ViewManager.ins().open(ChargeFirstWin, VIP3WIn);
				ViewManager.ins().close(VIP3WIn);
				break;
			case this.sureBtn:
				ViewManager.ins().open(VipWin)
				ViewManager.ins().close(VIP3WIn)
		}
	}
}
window["VIP3WIn"] = VIP3WIn