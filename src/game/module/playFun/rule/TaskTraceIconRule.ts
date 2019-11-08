class TaskTraceIconRule extends RuleIconBase {

	public constructor(t) {
		super(t)

		this.updateMessage = [
			UserTask.postUpdteTaskTrace,
			GameLogic.ins().postLevelChange
		];
	}

	checkShowIcon() {
		if(StartGetUserInfo.isOne) return false
		var data = UserTask.ins().taskTrace;
		if (data) {
			var config = UserTask.ins().getAchieveConfById(data.id);
			var nextConfig = UserTask.ins().getAchieveConfById(data.id + 1);
			if (!nextConfig && data.state == 2)
				return false;
			else
				return true;
		}
		return false;
	};
	getEffName(redPointNum) {
		var eff;
		var data = UserTask.ins().taskTrace;
		if (data) {
			switch (data.state) {
				case 0:
					if (GameLogic.ins().actorModel.level <= 20) {
						eff = "eff_mission";
					}
					this.effX = 111;
					this.effY = 35;
					break;
				case 1:
					eff = "eff_mission";
					this.effX = 111;
					this.effY = 35;
					break;
			}
		}
		return eff;
	};
	tapExecute() {
		var data = UserTask.ins().taskTrace;
		if (data.state == 0) {
			GameGuider.taskGuidance(data.id, 1);
		}
		else {
			UserTask.ins().sendGetAchieve(data.id);
			TaskTraceIconRule.postParabolicItem(data);
			if (!UserTask.ins().getAchieveConfById(data.id + 1)) {
				// UserTips.ins().showTips("已完成所有任务!");
			}
		}
		this.update();
	};

	static postParabolicItem(data) {
		return data
	};
}

MessageCenter.compile(TaskTraceIconRule);
window["TaskTraceIconRule"]=TaskTraceIconRule