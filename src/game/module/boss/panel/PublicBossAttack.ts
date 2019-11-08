class PublicBossAttack extends BaseEuiView {

	public static LAYER_LEVEL = LayerManager.UI_HUD
	private groupTween: egret.tween.TweenGroup

	private group: eui.Group

	public constructor() {
		super()
		this.skinName = "PublicBossAttackSkin"

		this.touchEnabled = false
		this.touchChildren = false

		// this.groupTween.addEventListener('complete', this.onTweenGroupComplete, this);
		// this.groupTween.play(0)
	}

	open() {
		this.setTween();
	}

	close() {
		// if (this.groupTween) {
		// 	this.groupTween.removeEventListener('complete', this.onTweenGroupComplete, this);
		// }
		egret.Tween.removeTweens(this.group);
	}

	private onTweenGroupComplete(): void {
		if (!ViewManager.ins().isShow(PublicBossAttack)) {
			if (this.groupTween) {
				this.groupTween.removeEventListener('complete', this.onTweenGroupComplete, this);
			}
			return
		}
		this.groupTween.play(0)
	}

	private setTween() {
		egret.Tween.get(this.group, { loop: true }).to({ alpha: 0.3 }, 750, egret.Ease.sineIn).to({ alpha: 1 }, 700, egret.Ease.sineOut);
	}
}
window["PublicBossAttack"] = PublicBossAttack