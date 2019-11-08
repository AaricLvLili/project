class FuliActBtnRenderer extends eui.ItemRenderer {
	public constructor() {
		super()
		this.skinName = "ActBtnSkin"
	}

	redPoint: eui.Image
	mc: MovieClip
	activityName: eui.Label

	dataChanged() {
		this.activityName.text = this.data.desc;
		this.UpdateRedPoint()

		//================去掉福利按钮特效====如果要放出欢迎这个地方==================
		// MoneyTreeModel.ins().isOpen[this.data.type]
		// 		? DisplayUtils.removeFromParent(this.mc)
		// 		: (this.mc || (this.mc = new MovieClip, this.mc.x = 50, this.mc.y = 47),
		// 			this.mc.loadUrl(ResDataPath.GetUIEffePath("eff_ui_flui_001"), !0, -1),
		// 			this.addChild(this.mc))
		//====================================end==================================
	}

	public UpdateRedPoint() {
		if (this.$stage == null || this.redPoint == null) {
			return
		}
		let showRedPoint = false
		switch (this.data.type) {
			case 2:
				showRedPoint = MoneyTreeModel.ins().isHaveReward();
				break;

			case 3:
				showRedPoint = false
				break;

			case 4:
				showRedPoint = Recharge.ins().HasMonthCardReward()
				break

			// 累充好礼
			case 6:
				showRedPoint = MoneyTreeModel.HasRechargeGift()
				break;

			// 资源找回
			case 7:
				showRedPoint = FindAssetsModel.ins().HasFindAssets()
				break

			// 每日累计充值
			case 8:
				showRedPoint = ActivityModel.ins().checkOtherCharge2CanGet()
				break

			// 七天登录
			case 9:
				showRedPoint = DayLoginIconRule.ShowRedPoint()
				break
			case 11:
				showRedPoint = ActivityModel.ins().checkMonthSingRedPoint();
				break;
		}
		this.redPoint.visible = showRedPoint
	}
}
window["FuliActBtnRenderer"]=FuliActBtnRenderer