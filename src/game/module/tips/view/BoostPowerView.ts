class BoostPowerView extends BaseEuiView {
	public constructor() {
		super()
		this.touchEnabled = false
	}

	private img: eui.Image
	private sp: egret.Sprite
	// private mc: MovieClip

	private lastTime = 0
	private lastPower = 0

	private timeout = 0

	initUI() {
		super.initUI()
		let yPos = 300 //500
		let xPos = 106 //77 + 10
		this.verticalCenter = 20 * this.numChildren
		this.horizontalCenter = 0
		this.img = new eui.Image();
		this.img.source = "comp_268_123_01_png"
		this.img.x = xPos + 0
		this.img.y = yPos + 0
		this.addChild(this.img)
		this.img.alpha = 1
		this.img.touchEnabled = !1
		this.sp = new egret.Sprite();
		this.sp.x = xPos + 150//170
		this.sp.y = yPos + 25//95
		this.addChild(this.sp)
		this.lastTime = 0
		this.lastPower = 0
		this.clearShow()
		
	}

	public showBoostPower(e, t): void {
		if (0 == this.lastPower) {
			this.lastPower = t
			TimerManager.ins().doTimer(500, 1, this.delayPowerUp, this)
		} else {
			TimerManager.ins().remove(this.delayPowerUp, this)
			TimerManager.ins().doTimer(500, 1, this.delayPowerUp, this)
		}
	}

	private clearShow() {
		this.sp.removeChildren()
		egret.Tween.removeTweens(this.img)
		this.img.visible = !1
		TimerManager.ins().removeAll(this)
		egret.clearTimeout(this.timeout)
		this.timeout = 0
	}

	private delayPowerUp(): void {
		// let yPos = 500
		// let xPos = 140 //77 + 10
		// if (this.mc == null) {
		// 	this.mc = new MovieClip;
		// 	this.mc.loadUrl(ResDataPath.GetUIEffePath("eff_power_fire"), true, 1, () => {
		// 		DisplayUtils.dispose(this.mc);
		// 		this.mc = null;
		// 	});
		// 	this.mc.x = xPos + 220
		// 	this.mc.y = yPos + 30
		// 	this.addChild(this.mc)
		// 	this.mc.x = xPos + 220
		// 	this.mc.y = yPos + 30

		// }

		var power = this.lastPower
		var curPower = GameLogic.ins().actorModel.power
		this.lastPower = 0

		if (curPower > power) {
			this.showPowerUp(power, curPower)
		}
	}

	private showPowerUp(lastPower, curPower): void {
		this.clearShow(), this.img.visible = !0, this.img.alpha = 1;
		// var bitmapObj = BitmapNumber.ins().createNumPic(lastPower, "4");
		var bitmapObj = new eui.BitmapLabel()
		bitmapObj.font = 'font_pz_zi_j1_fnt'
		bitmapObj.text = lastPower + ''//
		this.sp.addChild(bitmapObj);
		var diffValue = curPower - lastPower;
		var t = 0
		TimerManager.ins().doTimer(20, 25, () => {
			// var t = diffValue;
			// t += Math.round(Math.random() * t);
			// var lastPowerStr = lastPower.toString()
			// var o = t.toString().length == lastPowerStr.length ? t.toString().slice(1) : t + ""
			// lastPowerStr = lastPowerStr.charAt(0)
			// lastPowerStr += o
			// BitmapNumber.ins().changeNum(bitmapObj, lastPowerStr, "4")
			t += Math.floor(diffValue/25);//该25应与定时25次一样
			bitmapObj.text = t + lastPower + '' //
		}, this, () => {
			// BitmapNumber.ins().changeNum(bitmapObj, GameLogic.ins().actorModel.power, "4");
			bitmapObj.text = GameLogic.ins().actorModel.power + ''//
			var e = "+" + diffValue
			// let t = BitmapNumber.ins().createNumPic(e, "3");
			// BitmapNumber.ins().changeNum(t, e, "3")
			let t = new eui.BitmapLabel()
			t.font = 'font_pz_zi_j1_fnt'
			t.text = e
			// t.x = bitmapObj.width - t.width
			t.y -= bitmapObj.height
			this.sp.addChild(t);
			var t1 = 1e3
			let t2 = 500
			let tween = egret.Tween.get(t);
			tween.to({
				y: t.y - 45
			}, t1).to({
				alpha: 0
			}, t2).call(() => {
				egret.Tween.removeTweens(t);
				DisplayUtils.removeFromParent(t)
			}, this);
			var tween2 = egret.Tween.get(bitmapObj);
			tween2.wait(t1).to({
				alpha: 0
			}, t2).call(() => {
				egret.Tween.removeTweens(bitmapObj);
				DisplayUtils.removeFromParent(bitmapObj)
			}, this);
			var tween3 = egret.Tween.get(this.img);
			tween3.wait(t1).to({
				alpha: 0
			}, t2).call(() => {
				egret.Tween.removeTweens(this.img);
				this.img.visible = false
			}, this)
		}, this)
	}
}

ViewManager.ins().reg(BoostPowerView, LayerManager.UI_Tips);
window["BoostPowerView"]=BoostPowerView