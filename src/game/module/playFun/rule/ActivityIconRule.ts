class ActivityIconRule extends RuleIconBase {
	firstTap;
	public constructor(t) {
		super(t)
		this.firstTap = !0
		this.updateMessage = [MessageDef.ACTIVITY_IS_AWARDS,
		MessageDef.YB_CHANGE,
		MessageDef.LEVEL_CHANGE,
		MessageDef.MONEY_RECHARGE_GIFT_CHANGE,
		MessageDef.UPDATE_RECHARGE,
		MessageDef.GUILDWAR_FIRST_WINNER,
		]
	}

	checkShowIcon() {

		if (WxSdk.ins().isHidePay()) {
			return false;
		}

		if (StartGetUserInfo.isOne || StartGetUserInfo.isUsa) {
			return false;
		}
		this.tar.icon = GameServer.serverOpenDay > 7 ? "fun_hd_png" : "fun_kf_png"
		if (GameGlobal.actorModel.level < 10) {
			return false
		}
		return GameGlobal.activityModel.getbtnListByType().length > 0
	}

	checkShowRedPoint() {
		var activityDatas = GameGlobal.activityData
		let btnList = GameGlobal.activityModel.getbtnListByType(0);
		for (var key in btnList) {
			var data = btnList[key].id;
			let cusData = ActivityModel.GetCusActData(data)
			if (cusData != null) {
				if (cusData.canReward()) {
					return 1
				}
			} else {
				if (activityDatas[data].canReward()) {
					return 1
				}
			}
		}
		return 0
	}

	getEffName(e) {
		return this.firstTap ? this.DefEffe(e) : void 0
		// return this.firstTap || e ? (this.effX = 33, this.effY = 33, "eff_main_icon03") : void 0
	}

	tapExecute() {
		ActivityWinSummer.onPlace = ActivityModel.BTN_TYPE_00;
		ViewManager.ins().open(ActivityWin), this.firstTap = !1, this.update()
	}
}
window["ActivityIconRule"] = ActivityIconRule