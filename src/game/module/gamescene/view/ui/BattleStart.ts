class BattleStart extends BaseEuiView {
	public imgTop: eui.Image;
	public imgBottom: eui.Image;
	public imgIcon: eui.Image;

	//private ani: egret.tween.TweenGroup

	public constructor() {
		super();
	}
	public initUI() {
		super.initUI();
		this.skinName = "BattleStartSkin";
	};

	public initData() {

	};

	public open(...param: any[]) {
		super.open(param);
		// this.ani.play(0)
		// this.ani.addEventListener(egret.Event.COMPLETE, this._onTweenGroupComplete, this);
		this.imgIcon.alpha = 0
		this.imgIcon.scaleX = this.imgIcon.scaleY = .5
		egret.Tween.get(this.imgTop).to({ top: -191 }, 350).to({ top: -400 }, 400)
		egret.Tween.get(this.imgBottom).to({ bottom: -191 }, 350).to({ bottom: -400 }, 400)
		egret.Tween.get(this.imgIcon)
			.to({ scaleX: 1.3, scaleY: 1.3 }, 50)
			.to({ scaleX: 1, scaleY: 1 }, 200)
			.to({ alpha: 1, scaleX: 1.1, scaleY: 1.1 }, 100)
			.to({ scaleX: 1.15, scaleY: 1.15 }, 100)
			.to({ scaleX: 1.18, scaleY: 1.18 }, 300)
			.to({ scaleX: 1.2, scaleY: 1.2 }, 200)
			.call(() => {
				this.close()
			})
	};
	private _onTweenGroupComplete(): void {
		this.close()
	}
	public close(...param: any[]) {
		super.close(param);
		this.imgTop.top = 0
		this.imgBottom.bottom = 0
		// this.imgIcon.alpha = this.imgIcon.scaleX = this.imgIcon.scaleY = 1
		this.imgIcon.verticalCenter = 0
		egret.Tween.removeTweens(this.imgTop)
		egret.Tween.removeTweens(this.imgBottom)
		egret.Tween.removeTweens(this.imgIcon)
		ViewManager.ins().close(BattleStart);
		GameLogic.ins().sendBattleBegin();
	};


}
ViewManager.ins().reg(BattleStart, LayerManager.UI_Popup);
window["BattleStart"] = BattleStart