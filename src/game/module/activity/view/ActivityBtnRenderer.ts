class ActivityBtnRenderer extends FuliActBtnRenderer {
	public constructor() {
		super()
		this.skinName = "BtnTab0Skin"
	}
	labelDisplay: eui.Label
	// activityName_select:eui.Label

	dataChanged() {
		this.labelDisplay.text = this.data.acDesc;

		let cusActData = ActivityModel.GetCusActData(this.data.id)
		if (cusActData) {
			this.redPoint.visible = cusActData.canReward()
		} else {
			var actData = GameGlobal.activityData[this.data.id];
			if (actData) switch (actData.type) {
				case 2:
				case 9:
					this.redPoint.visible = (actData as ActivityType2Data).IsRedpointType2()
					// this.redPoint.visible =  GameGlobal.activityModel.IsRedpointType2(actData.type, this.data.id);
					break;
				case 4:
					this.redPoint.visible = GameGlobal.activityModel.getisCangetDabiao(this.data.id)
					TimerManager.ins().doTimer(100, 1, () => {
						this.redPoint.visible = GameGlobal.activityModel.getisCangetDabiao(this.data.id)
					}, this);
					break;
				case 303:
					var activityData = <ActivityType303Data>GameGlobal.activityData[303];
					this.redPoint.visible = activityData.isAllCanBattle();
					break;
				default:
					this.redPoint.visible = GameGlobal.activityModel.checkAcCanGet(this.data.id + "")
			} else console.log("错误活动id:" + this.data.id)
		}

		//==========================活动按钮去掉特效====如果要欢迎只需去掉这个注释再调位置========================//
		// if (this.data.light && !GameGlobal.activityModel.palyEffList[this.data.id]) {
		// 	this.mc || (this.mc = new MovieClip, this.mc.x = 50, this.mc.y = 47)
		// 	this.mc.loadUrl(ResDataPath.GetUIEffePath("eff_main_icon02"), !0, -1)
		// 	this.addChild(this.mc)
		// } else {
		// 	DisplayUtils.removeFromParent(this.mc)
		// }
		//==========================活动按钮去掉特效====如果要欢迎只需去掉这个注释再调位置=========end===============//
	}
}
window["ActivityBtnRenderer"] = ActivityBtnRenderer