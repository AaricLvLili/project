class DayBuy302IconRule extends RuleIconBase{
	
	public constructor(t) {
		super(t)
		this.firstTap = true
		this.updateMessage = [
			MessageDef.UPDATE_ACTIVITY_PANEL
		]
		this._groupEff = t.getChildByName("eff")
	}

	checkShowIcon () {
		if(WxSdk.ins().isHidePay())
		{
			return false;
		}
		let isShow = ActivityModel.ins().IsOpen(ActivityModel.ins().activityData[ActivityModel.TYPE_302])
		if (isShow) {
			if (this._mc == null) {
				this._mc = new MovieClip//ObjectPool.ins().pop("MovieClip")
				this._mc.x = this._groupEff.width / 2
				this._mc.y = this._groupEff.height / 2
				this._mc.scaleX = this._mc.scaleY = .6
				this._groupEff.addChild(this._mc)
				this._mc.loadUrl(ResDataPath.GetUIEffePath("eff_fun_yiyuanzhi"), true, -1);
			}
			
		} 
		// else {
		// 	DisplayUtils.removeFromParent(this._mc)
		// 	this._mc = null
		// }

		return isShow;
	}
	
	getEffName (e) {
		// return this.DefEffe(e)
	}
	
	tapExecute () {
		this.firstTap = false
		ViewManager.ins().open(ActivityType302Panel)
	}
}
window["DayBuy302IconRule"]=DayBuy302IconRule