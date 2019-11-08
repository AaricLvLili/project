class ActivityHearoBattleRule extends RuleIconBase {

	public constructor(t) {
		super(t)
		this.updateMessage = [MessageDef.ACTIVITY_IS_AWARDS,
		]
		this.lab = t.getChildByName("lab")
		let btn = t.getChildByName("btn")
		this._groupEff = btn.getChildByName("eff")

	}
	private lab: eui.Label
	checkShowIcon() {
		if (WxSdk.ins().isHidePay())
			return false;
		var activityData = <ActivityType303Data>GameGlobal.activityData[303];
		if (activityData && activityData.isOpenTime()) {
			if (this._mc == null) {
				this._mc = new MovieClip//ObjectPool.ins().pop("MovieClip")
				this._mc.x = this._groupEff.width / 2
				this._mc.y = this._groupEff.height / 2
				this._mc.scaleX = this._mc.scaleY = .6
				this._groupEff.addChild(this._mc)
				this._mc.loadUrl(ResDataPath.GetUIEffePath("eff_fun_yzzl"), true, -1);
			}

			return true;
		}
		// DisplayUtils.removeFromParent(this._mc)
		// this._mc = null
		return false;
	}

	public onTimer(): void {
		let data = GameGlobal.activityData[303]
		if (data) {
			this.lab.text = DateUtils.GetFormatSecond(data.endTime - GameServer.serverTime, DateUtils.TIME_FORMAT_1)
		}
	}

	checkShowRedPoint() {
		var activityData = <ActivityType303Data>GameGlobal.activityData[303];
		return activityData.canReward();
	}

	getEffName(e) {
		return this.firstTap || e ? this.DefEffe(e) : void 0
	}

	tapExecute() {
		ViewManager.ins().open(ActivityWin, 303);
	}
}
window["ActivityHearoBattleRule"] = ActivityHearoBattleRule