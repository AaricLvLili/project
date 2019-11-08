class TipsItem extends eui.Component {
	public constructor() {
		super();
		this.skinName = "TipsSkin";

		if (this.lab == null) {
			this.lab = new eui.Label
			this.lab.textColor = 0xff0000;
			this.lab.horizontalCenter = 0
			this.touchEnabled = false
			this.verticalCenter = -1
		}
		if (this.bg == null) {
			this.bg = new eui.Image
		}
	}
	private lab: eui.Label
	private bg: eui.Image
	private _labelText: string

	public get labelText(): string {
		return this._labelText;
	}

	public set labelText(value: string) {
		if (this.lab == null || this.bg == null) {
			return
		}
		/**检查描边的 */
		// let str = value;
		// let colorList = Color.ColorStr;
		// this.lab.strokeColor = Color.OrangeStroke;
		// for (var i = 0; i < colorList.length; i++) {
		// 	if (str.indexOf(colorList[i]) > 0) {
		// 		this.lab.strokeColor = Color.ColorStroke[i];
		// 		break;
		// 	}
		// }
		this._labelText = value;
		this.lab.textFlow = TextFlowMaker.generateTextFlow(this._labelText);
		this.bg.width = this.lab.width + 80;
		this.bg.alpha = 1;
		this.lab.alpha = 1;
		this.bg.y = 0;
		this.lab.verticalCenter = -1;
		var t1 = egret.Tween.get(this.bg);
		t1.to({ "y": -25 }, 500).wait(500).to({ "alpha": 0 }, 200).call(() => {
			DisplayUtils.removeFromParent(this);
		}, this);
		var t = egret.Tween.get(this.lab);
		t.to({ "verticalCenter": -25 }, 500).wait(500).to({ "alpha": 0 }, 200);
	}
}
window["TipsItem"] = TipsItem