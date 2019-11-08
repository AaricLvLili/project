class YbTurntableIconRule extends RuleIconBase {
	public constructor(t) {
		super(t)
		this.firstTap = !0
		this.updateMessage = [
			MessageDef.ACTIVITY_IS_AWARDS,
			MessageDef.YB_CHANGE,
			MessageDef.LEVEL_CHANGE,
			MessageDef.UPDATE_RECHARGE,
			MessageDef.UPDATA_VIP_EXP,
			MessageDef.UPDATE_ACTIVITY_PANEL,
		]
	}
	checkShowIcon() {
		if(WxSdk.ins().isHidePay())
			return false;
			
		if (!GameGlobal.ybTurntableModel.isOpenActivity()) {
			return false
		}
		if (GameGlobal.actorModel.level < 10) {
			return false
		}
		if (GameGlobal.ybTurntableModel.level > GameGlobal.ybTurntableModel.maxLevel) {
			return false
		}
		return true
	}

	checkShowRedPoint() {
		if (!GameGlobal.ybTurntableModel.data) return 0;
		var e = 0,
			t = GameGlobal.ybTurntableModel.config;
		GameGlobal.ybTurntableModel.level <= GameGlobal.ybTurntableModel.maxLevel
			&& GameGlobal.ybTurntableModel.chargeRecord >= t.recharge
			&& t.yuanBao <= parseInt(GameGlobal.actorModel.yb + "") && e++
		return e
	}

	getEffName(e) {
		return this.DefEffe(e)
	}

	tapExecute() {
		ViewManager.ins().open(YbTurntableWin), this.firstTap = !1, this.update()
	}
}
window["YbTurntableIconRule"]=YbTurntableIconRule