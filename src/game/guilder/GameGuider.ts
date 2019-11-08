class GameGuider {
	static taskGuidance(e, i) {
		switch (i) {
			case 0:
				var s = GlobalConfig.ins("DailyConfig")[e];
				if (1 == s.control) {
					GameGuider.guidance(s.controlTarget[0], s.controlTarget[1]);
				}
				break;
			case 1:
				var n = UserTask.ins().getAchieveConfById(e);
				if (1 == n.control) {
					this.checkAndGuideForAchievementTask(n);
				}
				break;
			case 2:
				var a = NewFunNotice.ins().getFunConfByIndex(e);
				if (1 == a.control) {
					GameGuider.guidance(a.controlTarget[0], a.controlTarget[1])
				}
		}
	}
	static checkAndGuideForAchievementTask(e) {
		if (e) {
			var i = true;
			if (3005 == e.achievementId) {
				var s = GlobalConfig.ins("JingMaiCommonConfig");
				if (s) {
					if (GameLogic.ins().actorModel.level < s.openLevel) {
						UserTips.ins().showTips(LanguageString.jifengTiaoyueCh(GlobalConfig.jifengTiaoyueLg.st101464, [s.openLevel]))
						i = false
					}
				} else {
					console.error("JingMaiCommonConfig is null");
				}
			}
			if (i) {
				ViewManager.Guide(e.controlTarget[0], e.controlTarget[1])
			}
		}
	}
	static guidance(t, e = 0): boolean {
		return ViewManager.Guide(t, e)
		// if ("number" != typeof t) {
		// 	ViewManager.ins().open(t, e)
		// } else {
		// 	console.error("open panel must be classname,error id：" + t);
		// }
	}

	public static Get
}
window["GameGuider"] = GameGuider