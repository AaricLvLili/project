class UserTask extends BaseSystem {

	task: TaskData[]
	vitalityAwards = [];
	vitality
	achiEvement = []
	taskTrace: AchievementData;
	private dailyAwardConfig: any;

	public static ins(): UserTask {
		return super.ins()
	}

	public constructor() {
		super();
		this.sysId = PackageID.Task;
		this.regNetMsg(S2cProtocol.sc_task_init_data, this.doTaskData);
		this.regNetMsg(S2cProtocol.sc_task_change_data, this.doTaskChangeData);
		this.regNetMsg(S2cProtocol.sc_task_vitality, this.doVitality);
		this.regNetMsg(S2cProtocol.sc_task_vitality_award, this.doVitalityAwards);
		this.regNetMsg(S2cProtocol.sc_task_achieve_data, this.doAchieveData);
		this.regNetMsg(S2cProtocol.sc_task_join_achieve_data, this.doJoinAchieveData);
		this.regNetMsg(S2cProtocol.sc_task_achieve_change_data, this.doAchieveChangeData);
		// this.regNetMsg(S2cProtocol.sc_task_lord_sync, this.doAchieveChangeData);
	}


    /**
     * 领取日常任务
     * @param id
     */
	sendGetTask(id) {
		let req = new Sproto.cs_task_get_task_request
		req.taskID = id
		this.Rpc(C2sProtocol.cs_task_get_task, req)
	};
    /**
     * 领取活跃度奖励
     * @param id
     */
	sendGetVitalityAwards(id) {
		let req = new Sproto.cs_task_get_vitality_awards_request
		req.taskID = id
		this.Rpc(C2sProtocol.cs_task_get_vitality_awards, req)
	};
    /**
     * 领取成就任务
     * @param id
     */
	sendGetAchieve(id) {
		let req = new Sproto.cs_task_get_achieve_request
		req.taskID = id
		this.Rpc(C2sProtocol.cs_task_get_achieve, req)
	};
    /**
     * 任务数据同步
     * @param bytes
     */
	doTaskData(bytes: Sproto.sc_task_init_data_request) {
		this.task = [];
		this.vitalityAwards = [];
		var count = bytes.taskDatas.length
		for (var i = 0; i < count; i++) {
			let taskData = bytes.taskDatas[i]
			var data = new TaskData;
			data.id = taskData.id
			data.value = taskData.value
			data.state = taskData.state
			this.task.push(data);
		}
		this.vitality = bytes.vitality
		var awardsCount = bytes.vitalityDats.length
		for (var i = 0; i < awardsCount; i++) {
			let data = bytes.vitalityDats[i]
			var awardsData = new VitalityData;
			awardsData.id = data.id;
			awardsData.state = data.state;
			this.vitalityAwards.push(awardsData);
		}
		this.sortTask();
		this.lv = bytes.growupid;
		this.exp = bytes.growup;
		GameGlobal.MessageCenter.dispatch(MessageDef.UPDATE_VITALITY);

	};
    /**
     * 更改任务数据
     * @param bytes
     */
	doTaskChangeData(bytes: Sproto.sc_task_change_data_request) {
		var id = bytes.id
		var data = UserTask.ins().getTaskDataById(id);
		if (data) {
			data.value = bytes.value
			data.state = bytes.state
			UserTask.ins().sortTask();
			UserTask.postTaskChangeData();

			GameGlobal.MessageCenter.dispatch(MessageDef.UPDATA_TASK);
		}
		else {
			Main.errorBack("推送任务数据异常，任务id：" + id);
		}


	};
	static postTaskChangeData() {
	};
	doVitality(bytes: Sproto.sc_task_vitality_request) {
		this.vitality = bytes.vitality;
		this.lv = bytes.growupid;
		this.exp = bytes.growup;
		GameGlobal.MessageCenter.dispatch(MessageDef.UPDATE_VITALITY)
	};
    /**
     * 更新活跃度奖励
     * @param bytes
     */
	doVitalityAwards(bytes: Sproto.sc_task_vitality_award_request) {
		var id = bytes.id
		var data = this.getVitalityAwardsById(id);
		data.state = bytes.state
		// UserTask.postTaskChangeData();

		GameGlobal.MessageCenter.dispatch(MessageDef.UPDATA_TASK)
		GameGlobal.MessageCenter.dispatch(MessageDef.UPDATE_VITALITY)
	};
    /**
     * 成就数据同步
     * @param bytes
     */
	doAchieveData(bytes: Sproto.sc_task_achieve_data_request) {
		this.achiEvement = [];
		var count = bytes.achiEvement.length
		for (var i = 0; i < count; i++) {
			let rspData = bytes.achiEvement[i]
			var data = new AchievementData;
			// data.achievementId = rspData.achievementId
			data.id = rspData.id
			data.state = rspData.state
			data.value = rspData.value
			// if (data.achievementId == 1000) {
			this.taskTrace = data;
			UserTask.postUpdteTaskTrace();
			// }
			// else {
			// this.achiEvement.push(data);
			// }
		}
		this.sortAchiEvement();

	};
	static postUpdteTaskTrace() {
	};
	doJoinAchieveData(bytes: Sproto.sc_task_join_achieve_data_request) {
		this.changeAchieve(bytes.data);
	};
	doAchieveChangeData(bytes: Sproto.sc_task_achieve_change_data_request) {
		this.changeAchieve(bytes.data);
	};
    /**
     * 更新成就数据
     * @param bytes
     */
	changeAchieve(bytes: Sproto.achievement_data) {
		if (bytes.id == 0) {
			this.taskTrace = null
			UserTask.postUpdteTaskTrace();
			return
		}
		// var achievementId = bytes.achievementId
		var data;
		// if (achievementId == 1000)
		data = this.taskTrace;
		// else
		// data = this.getAchieveDataById(achievementId);

		if (this.taskTrace == null)
			data = this.getAchieveByTaskId(bytes.id);
		else
			data = this.taskTrace;
		if (data == null) return;
		data.id = bytes.id
		data.state = bytes.state
		data.value = bytes.value
		// if (data.achievementId == 1000) {
		UserTask.postUpdteTaskTrace();
		// }
		// else {
		// 	this.sortAchiEvement();
		// 	UserTask.postTaskChangeData();

		// 	GameGlobal.MessageCenter.dispatch(MessageDef.UPDATA_TASK)
		// }
	};
    /**
     * 通过成就id获取成就数据
     * @param id
     */
	getAchieveDataById(id) {
		for (var i = 0; i < this.achiEvement.length; i++) {
			if (this.achiEvement[i].achievementId == id)
				return this.achiEvement[i];
		}
		return null;
	};
    /**
     * 通过任务id获取成就数据
     * @param id
     */
	getAchieveByTaskId(id) {
		for (var i = 0; i < this.achiEvement.length; i++) {
			if (this.achiEvement[i].id == id)
				return this.achiEvement[i];
		}
		return null;
	};
    /**
     * 通过奖励id获取奖励数据
     * @param id
     */
	getVitalityAwardsById(id) {
		for (var i = 0; i < this.vitalityAwards.length; i++) {
			if (this.vitalityAwards[i].id == id)
				return this.vitalityAwards[i];
		}
		return null;
	};
    /**
     * 通过任务id获取任务数据
     * @param id
     */
	getTaskDataById(id) {
		if (this.task == null)
			return;
		for (var i = 0; i < this.task.length; i++) {
			if (this.task[i].id == id)
				return this.task[i];
		}
		return null;
	};
    /**
     * 通过任务id获取成就配置
     * @param id
     */
	getAchieveConfById(id) {
		var list = GlobalConfig.ins("AchievementTaskConfig");
		var i;
		for (i in list) {
			var config = list[i];
			if (config.taskId == id)
				return config;
		}
		return null;
	};

	getAchievementConfigById(id) {
		return this.getAchieveConfById(id)
	}

    /**
     * 通过任务id获取奖励配置
     * @param id
     */
	getAwardsConfigById(id) {
		if (this.dailyAwardConfig == null)
			this.dailyAwardConfig = GlobalConfig.ins("DailyAwardConfig");
		var list = this.dailyAwardConfig;
		var i;
		for (i in list) {
			var config = list[i];
			if (config.id == id)
				return config;
		}
		return null;
	};
	getTaskStast() {
		if (this.task) {
			var i = void 0;
			for (i = 0; i < this.task.length; i++) {
				if (this.task[i].state == 1) {
					UserTask.postUpdataTaskPoint(true);
					return;
				}
			}
			for (i = 0; i < this.vitalityAwards.length; i++) {
				var config = this.getAwardsConfigById(this.vitalityAwards[i].id);
				if (this.vitality >= config.valueLimit && this.vitalityAwards[i].state == 0) {
					UserTask.postUpdataTaskPoint(true);
					return;
				}
			}
			for (i = 0; i < this.achiEvement.length; i++) {
				if (this.achiEvement[i].state == 1) {
					UserTask.postUpdataTaskPoint(true);
					return;
				}
			}
			UserTask.postUpdataTaskPoint(false);
			return;
		}
	};
	static postUpdataTaskPoint(bo) {
		return bo;
	};
	sortTask() {
		if (this.task.length > 2) {
			this.task.sort(this.sort);
			var state1Task = [];
			for (var i = 0; i < this.task.length; i++) {
				if (this.task[i].state != 0) {
					state1Task.push(this.task[i]);
					this.task.splice(i, 1);
					i--;
				}
			}
			if (state1Task.length > 0)
				this.task = this.task.concat(state1Task);
		}
	};
	sort(a, b) {
		var s1 = a.id;
		var s2 = b.id;
		if (s1 < s2)
			return -1;
		else if (s1 > s2)
			return 1;
		else
			return 0;
	};
	sortAchiEvement() {
		for (var i = 0; i < this.achiEvement.length; i++) {
			var data = this.achiEvement[i];
			if (data.state == 1) {
				this.achiEvement.splice(i, 1);
				this.achiEvement.unshift(data);
			}
			else if (data.state == 2) {
				this.achiEvement.splice(i, 1);
				this.achiEvement.push(data);
			}
		}
	};

	static getTopDataReach(e) {
		var t = GlobalConfig.ins("AchieveBottomConfig")[e],
			i = 0;
		for (var n in t) {
			var r = UserTask.ins().getAchieveDataById(t[n].achievementId);
			r && r.state == MissionState.canGet && i++
		}
		return i
	}

	static getBottomIndex(e) {
		var t = GlobalConfig.ins("AchieveBottomConfig");
		for (var i in t)
			for (var n in t[i])
				if (t[i][n].achievementId == e) return t[i][n].index - 1;
		return 0
	}

	static getTopData() {
		var list = [],
			config = GlobalConfig.ins("AchieveBottomConfig");
		for (var n in config) {
			var configData = config[n];
			for (var o in configData) {
				var s = GameGlobal.taskModel.getAchieveDataById(configData[o].achievementId);
				s && list.push(s)
			}
		}
		return list.sort(UserTask.sortTopData), list
	}

	static sortTopData(e, t) {
		return e.state == MissionState.canGet && t.state != MissionState.canGet ? -1 : t.state == MissionState.canGet && e.state != MissionState.canGet ? 1 : e.state == MissionState.havaGet && t.state != MissionState.havaGet ? 1 : t.state == MissionState.havaGet && e.state != MissionState.havaGet ? -1 : e.id > t.id ? 1 : t.id > e.id ? -1 : 0
	}

	public GetTaskList(): TaskData[] {
		let list = []
		for (let i = 0, len = this.task.length; i < len; ++i) {
			let data = this.task[i]
			if (data.id == TaskConfigId.MINE && !Deblocking.Check(DeblockingType.TYPE_08, true)) {
				continue
			}
			//如果是微信ios，按条件屏蔽活跃度里面的每日充值
			if (WxSdk.ins().isHidePay() && data.id == 14) {
				continue;
			}
			list.push(data)
		}
		return list
	}
	public IsGotReward(index: number): boolean {
		return this.vitalityAwards[index].state == 2;
	}
	public IsCanGet(index: number) {
		let dailyAwardConfig = GlobalConfig.ins("DailyAwardConfig")[index + 1];
		if (this.vitality >= dailyAwardConfig.valueLimit && this.vitalityAwards[index].state != 2) {
			return true;
		}
		return false
	}
	// public CheckCanVitalityReward(index: number): boolean {
	// 	if (this.dailyAwardConfig == null)
	// 		this.dailyAwardConfig = GlobalConfig.ins("DailyAwardConfig");
	// 	let configData = this.dailyAwardConfig[index + 1];
	// 	return this.vitalityAwards[index].state != 2 && this.vitality >= configData.valueLimit
	// }
	public CheckAllVitalityReward(): boolean {
		let value = this.vitality
		let state: number = 0;/**0未达成 1是可领取 2是已领取*/
		let dailyAwardConfig;
		let playerzs = UserZs.ins() ? UserZs.ins().lv : 0;
		for (let i = 1; i <= 4; ++i) {
			let isCanGet = UserTask.ins().IsCanGet(i - 1)
			dailyAwardConfig = GlobalConfig.ins("DailyAwardConfig")[i];
			if (dailyAwardConfig) {
				if (value < dailyAwardConfig.valueLimit || isCanGet || (value >= dailyAwardConfig.valueLimit && !isCanGet && i == 4)) {
					if (value >= dailyAwardConfig.valueLimit && !isCanGet) {
						state = 2;
					} else if (isCanGet) {
						state = 1;
					}
					break;
				}
			}
		}
		if (state == 1) {
			return true;
		}
		let datas = this.GetTaskList();
		for (var i = 0; i < datas.length; i++) {
			if (datas[i].state == 1) {
				return true;
			}
		}
		return false
	}
	/**检查是否完成界面打开任务 */
	public checkUIMissonComplet(missionUIId: number) {
		let data = this.taskTrace;
		if (data) {
			let achievementTaskConfig = UserTask.ins().getAchieveConfById(data.id);
			if (achievementTaskConfig.type == 214) {
				if (missionUIId == achievementTaskConfig.param) {
					//**发送完成界面任务 */
					this.sendUIMissonComplet(achievementTaskConfig.taskId);
				}
			}
		}
	}

	/**发送完成界面任务 */
	public sendUIMissonComplet(taskID: number) {
		let rsp = new Sproto.cs_task_share_open_request;
		rsp.taskID = taskID;
		this.Rpc(C2sProtocol.cs_task_share_open, rsp);
	}

	/***********************爵位 */
	public lv: number = 1;
	public exp: number = 0;
	// private getLordLevelInfo(data) {
	// 	let oldLv = this.lv;
	// 	this.lv = data.lv;
	// 	this.exp = data.exp;
	// 	if (data.lv > this.lv) {
	// 		let oldData = GlobalConfig.ins('LordLevelConfig')[oldLv];
	// 		let nowData = GlobalConfig.ins('LordLevelConfig')[data.lv];
	// 		if (oldData.advance < nowData.advance) {
	// 			ViewManager.ins().open(VitalityTips);
	// 		}
	// 	}
	// 	GameGlobal.MessageCenter.dispatch(MessageDef.UPDATE_VITALITY)
	// }
	// public dic: Dictionary<any> = new Dictionary<any>()
	public getLordAward(advance: number) {
		// if (this.dic.values.length <= 0) {
		// 	let cof = GlobalConfig.ins('LordLevelConfig');
		// 	for (let key in cof) {
		// 		let away = cof[key].award;
		// 		if (away.length > 0) {
		// 			this.dic.set(cof[key].advance, away);
		// 		}
		// 	}
		// }
		// return this.dic.get(advance);
		return GlobalConfig.ins('LordLevelConfig')[advance].award
	}
	public sendGetAwak(taskID: number) {
		let rsp = new Sproto.cs_task_apply_vitality_request;
		rsp.taskID = taskID
		this.Rpc(C2sProtocol.cs_task_apply_vitality, rsp);
	}
}


MessageCenter.compile(UserTask);

enum TaskConfigId {
	INDEX = 7,
	MINE = 8,
}
window["UserTask"] = UserTask