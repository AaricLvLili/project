class WarOrderModel {
	public constructor() {
		// this.testData();
	}
	private static s_instance: WarOrderModel;
	public static get getInstance(): WarOrderModel {
		if (!WarOrderModel.s_instance) {
			WarOrderModel.s_instance = new WarOrderModel();
		}
		return WarOrderModel.s_instance;
	}

	public mainId: number = 1015;
	/**战令等级 */
	public lv: number = 1;
	/**满级 */
	public _maxLv: number = 0;
	/**战令当前经验 */
	public exp: number = 0;
	/**普通等级奖励是否领取 */
	public commonAwardList = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
	/**进阶等级奖励是否领取 */
	public upAwardList = [0, 0, 0, 0, 0, 0, 0, 0, 0];
	/**查看列表的高 */
	public scrHight: number = 200;
	/**查看列表的元素高 */
	public oneItemHight: number = 76;
	/**查看列表当前显示等级 */
	public nowShowLv: number = 1;
	/**是否已经进阶 */
	public isUpWarOrder: boolean = false;
	/**是否有额外经验*/
	public isHaveExtraExp: boolean = false;
	/**活动剩余时间戳 */
	public endTime: number = 0;
	/**显示的任务类型 */
	public showMissionType = 1;
	public missionDic: Dictionary<Dictionary<WarOrderMissionData>> = new Dictionary<Dictionary<WarOrderMissionData>>();
	public isShow = false;
	public setData(data: Sproto.activity_type35) {
		this.mainId = data.baseData.id;
		this.endTime = data.baseData.endTime;
		this.lv = data.lv;
		this.exp = data.exp;
		if (data.scala) {
			this.isUpWarOrder = true
		} else {
			this.isUpWarOrder = false
		}
		if (data.extraExp == 0 || data.extraExp == 2) {
			this.isHaveExtraExp = false;
		} else {
			this.isHaveExtraExp = true;
		}
		this.commonAwardList = [];
		this.upAwardList = [];
		for (var i = 0; i < data.lvList.length; i++) {
			this.commonAwardList.push(data.lvList[i].reward1);
			this.upAwardList.push(data.lvList[i].reward2);
		}
		this.isShow = true;
		MessageCenter.ins().dispatch(WarOrderEvt.WARORDEREVT_DATAUPDATE_MSG);
	}
	public get listPoint() {
		let point = null;
		for (var i = 0; i < this.lv; i++) {
			if (this.commonAwardList[0] == 1 || this.upAwardList[0] == 1) {
				point = i;
				break;
			}
		}
		if (point == null) {
			point = this.lv - 1;
		}
		if (point < 0) {
			point = 0;
		}
		let maxHight = point * this.oneItemHight
		let showMaxHight = this.oneItemHight * this.maxLv - this.scrHight
		if (maxHight > showMaxHight) {
			maxHight = showMaxHight;
		}
		return maxHight;
	}

	public checkCanGet() {
		for (var i = 0; i < this.lv; i++) {
			let num = this.commonAwardList[i];
			if (num == 1) {
				return true;
			}
			if (this.isUpWarOrder) {
				let num2 = this.upAwardList[i];
				if (num2 == 1) {
					return true;
				}
			}
		}
		return false;
	}

	public checkCanGetExpBag() {
		if (this.isUpWarOrder && this.isHaveExtraExp) {
			return true;
		}
		return false;
	}

	public get maxLv() {
		if (!this._maxLv) {
			let config = GlobalConfig.ins("TokenBaseConfig")[this.mainId];
			this._maxLv = config.maxLevel;
		}
		return this._maxLv
	}

	public isLvMax() {
		if (this.lv >= this.maxLv) {
			return true;
		}
		return false;
	}

	public checkCanGetByLv(lv: number) {
		let num = this.commonAwardList[lv - 1];
		if (num == 1) {
			return true;
		}
		if (this.isUpWarOrder) {
			let num2 = this.upAwardList[lv - 1];
			if (num2 == 1) {
				return true;
			}
		}
		return false;
	}
	/**战令当前满经验 */
	public get maxExp() {
		let config = GlobalConfig.ins("TokenConfig")[this.mainId];
		if (config) {
			let tokenConfig = config[this.lv];
			if (tokenConfig) {
				return tokenConfig.exp;
			}
		}
		return 100;
	}

	public testData() {
		let config = GlobalConfig.ins("TokenTaskConfig");
		for (let key in config) {
			let tokenTaskConfig = config[key];
			if (tokenTaskConfig) {
				let misDic = new Dictionary<WarOrderMissionData>();
				for (let key1 in tokenTaskConfig) {
					let tokenTaskData = tokenTaskConfig[key1];
					let data = new WarOrderMissionData();
					data.type = tokenTaskData.taskType;
					data.id = tokenTaskData.taskId;
					data.num = 1;
					data.state = 0;
					misDic.set(data.id, data);
				}
				this.missionDic.set(parseInt(key), misDic);
			}
		}
	}

	public setMissionData(bytes: Sproto.warorder_data[], isCreate: boolean = true) {
		if (isCreate) {
			this.missionDic.clear();
		}
		for (var i = 0; i < bytes.length; i++) {
			let data = bytes[i]
			let dic: Dictionary<WarOrderMissionData> = this.missionDic.get(data.tasktype);
			if (dic) {
				let missionData = dic.get(data.id);
				if (missionData) {
					missionData.id = data.id
					missionData.state = data.state;
					missionData.num = data.value;
					missionData.type = data.tasktype;
				} else {
					missionData = new WarOrderMissionData();
					missionData.id = data.id
					missionData.state = data.state;
					missionData.num = data.value;
					missionData.type = data.tasktype;
					dic.set(data.id, missionData);
				}
			} else {
				dic = new Dictionary<WarOrderMissionData>();
				let missionData = new WarOrderMissionData();
				missionData.id = data.id
				missionData.state = data.state;
				missionData.num = data.value;
				missionData.type = data.tasktype;
				dic.set(data.id, missionData)
				this.missionDic.set(data.tasktype, dic);
			}
		}
	}

	public checkAllRedPoint() {
		return this.checkAwardRewPoint() || this.checkMissionRedPoint();
	}

	public checkAwardRewPoint() {
		for (var i = 0; i < this.commonAwardList.length; i++) {
			if (this.commonAwardList[i] == 1) {
				return true;
			}
		}
		if (this.isUpWarOrder) {
			for (var i = 0; i < this.upAwardList.length; i++) {
				if (this.upAwardList[i] == 1) {
					return true;
				}
			}
		}
		if (this.checkCanGetExpBag()) {
			return true;
		}
		return false;
	}

	public checkMissionRedPoint() {
		for (var i = 1; i < 4; i++) {
			let isShow = this.checkMissionRedPointBuyType(i);
			if (isShow) {
				return true;
			}
		}
		return false;
	}

	public checkMissionRedPointBuyType(type: number) {
		let dic = this.missionDic.get(type);
		if (dic) {
			for (var i = 0; i < dic.values.length; i++) {
				if (dic.values[i].state == 1) {
					return true;
				}
			}
		}
		return false;
	}
}
window["WarOrderModel"] = WarOrderModel