
class ZhuanZhiTaskIconRule extends RuleIconBase {
	public constructor(t) {
		super(t);
		this.firstTap = true
		this.updateMessage = [
			MessageDef.LEVEL_CHANGE,
		]
		let btn = t.getChildByName("btn")
		this._groupEff = btn.getChildByName("eff")
	}

	checkShowIcon() {
		if (this._mc == null) {
			this._mc = new MovieClip();
			this._mc.x = this._groupEff.width / 2-3
			this._mc.y = this._groupEff.height / 2-10
			this._mc.scaleX = this._mc.scaleY = .6
			this._groupEff.addChild(this._mc)
			this._mc.loadUrl(ResDataPath.GetUIEffePath("eff_fun_zzrw"), true, -1);
		}
		return Deblocking.Check(DeblockingType.TYPE_29, true) && ZhuanZhiModel.ins().showZhuanZhiTaskIcon();
	}

	checkShowRedPoint() {
		return ZhuanZhiModel.ins().canZhuanZhi();
	}

	getEffName(e) {
		// return this.firstTap || e ? (this.effX = 33, this.effY = 33, "eff_main_icon03") : void 0
		return null;
	}

	tapExecute() {
		ViewManager.ins().open(ZhuanZhiTaskWin)
		this.firstTap = false
		this.update()
	}
}
window["ZhuanZhiTaskIconRule"] = ZhuanZhiTaskIconRule