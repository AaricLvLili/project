class Encounter extends BaseSystem {

	/** pk战数据 */
	encounterModel: { [key: number]: EncounterModel } = {};
	/**遭遇BOSS 唯一ID*/
	public zyKeyId: number;
	/**遭遇BOSS刷新剩余秒数*/
	private _refreshCd: number;
	bIsTipsFlag: boolean = false;  //是否弹过提示，每次启动游戏重置

	private m_InquireRecord: EncounterRecordData[] = []

	public get inquireRecord(): EncounterRecordData[] {
		if (!this.m_InquireRecord) {
			return []
		}
		return this.m_InquireRecord
	}

	private m_News: Sproto.encounter_news_data[] = []

	public get News(): Sproto.encounter_news_data {
		return this.m_News.shift()
	}

	private m_NewsList: Sproto.encounter_news_data[] = []

	public get NewsList(): Sproto.encounter_news_data[] {
		return this.m_NewsList
	}

	public constructor() {
		super();

		this.sysId = PackageID.Encounter;
		this.regNetMsg(S2cProtocol.sc_encounter_last_refresh_time, this.doLastRefreshTime);
		this.regNetMsg(S2cProtocol.sc_encounter_deal_data, this.doEncounterData);
		this.regNetMsg(S2cProtocol.sc_encounter_del_data, this.doDelEncounterData);
		this.regNetMsg(S2cProtocol.sc_encounter_battle_result, this.doFightResult);
		this.regNetMsg(S2cProtocol.sc_encounter_inquire_record, this.doInquireRecord);
		this.regNetMsg(S2cProtocol.sc_encounter_data_update, this.postDataUpdate);
		this.regNetMsg(S2cProtocol.sc_encounter_my_data, this._DoMyData);
		this.regNetMsg(S2cProtocol.sc_encounter_news, this._DoNews)
		this.regNetMsg(S2cProtocol.sc_encounter_news_list, this._DoNewsList)
		//野外boss
		this.regNetMsg(S2cProtocol.sc_encounter_update_will_boss, this.doUpdateWildBoss);
		this.regNetMsg(S2cProtocol.sc_encounter_will_boss_result, this.doWildBossResult);

		this.regNetMsg(S2cProtocol.sc_encounter_item_info, this._DoItemInfo);
		this.regNetMsg(S2cProtocol.sc_encounter_open_result, this._DoOpenResult);

		this.regNetMsg(S2cProtocol.sc_encounter_player_rob, this._DoPlayerRob);
		this.regNetMsg(S2cProtocol.sc_encounter_get_boss_award, this.getZaoYuBossAward);
	}

	public static ins(): Encounter {
		return super.ins()
	}

	public lastTime: number = 0
	public refreshTimes: number = 0

	public get maxRefreshTimes(): number {
		return GlobalConfig.ins("PublicPkrednamebaseConfig").residuedegree
	}

	public get buyPKConsume(): number {
		return 50
	}

	/**
     * 处理pk战最后一次刷新的时间
     * 5-1
     * @param bytes
     */
	public doLastRefreshTime(bytes: Sproto.sc_encounter_last_refresh_time_request) {
		this.lastTime = bytes.lastTime;
		this.refreshTimes = bytes.refreshTimes;
	};
	public sendRefresh() {
		this.Rpc(C2sProtocol.cs_encounter_send_fight_refresh)
	};
	public sendFightResult(index) {
		let rsp = new Sproto.cs_encounter_send_fight_result_request
		rsp.result = 0
		rsp.encounterIndex = index;
		delete this.encounterModel[rsp.encounterIndex]
		this.Rpc(C2sProtocol.cs_encounter_send_fight_result, rsp)
	};

	public doDelEncounterData(bytes: Sproto.sc_encounter_del_data_request) {
		var index = bytes.index;
		this.encounterModel[index] = null;
		delete this.encounterModel[index]
		this.doEncounterDataChange();
	}

    /**
     * 处理pk战数据
     * 5-2
     * @param bytes
     */
	public doEncounterData(bytes: Sproto.sc_encounter_deal_data_request) {
		let encounterModel = new EncounterModel
		encounterModel.parser(bytes)
		encounterModel.type = EntityType.Encounter
		this.encounterModel[encounterModel.index] = encounterModel
		this.doEncounterDataChange();
		/*
        if (encounterModel.subRole.length < 1) {
			console.warn("pk的玩家子角色列表为空");
		} else {
			this.encounterModel[encounterModel.index] = encounterModel
			GameLogic.ins().createEntityByModel(<any>encounterModel);
			this.postEncounterDataChange();
		}
		*/
		// var index = bytes.index

		// var encounterModel: EncounterModel = this.encounterModel[index] || new EncounterModel();
		// encounterModel.parser(bytes)
		// encounterModel.type = EntityType.Encounter;
		// if (encounterModel.subRole.length < 1) {
		// 	console.warn("pk的玩家子角色列表为空");
		// } else {
		// 	this.encounterModel[index] = encounterModel;
		// 	GameLogic.ins().createEntityByModel(this.encounterModel[index]);
		// 	this.postEncounterDataChange();
		// }
	};
	/** pk战数据变更 */
	public doEncounterDataChange() {
		GameGlobal.MessageCenter.dispatch(MessageDef.ENCOUNTER_DATA_CHANGE)
	};
	public sendGetreward() {
		//this.Rpc(C2sProtocol.cs_encounter_get_reward)
	};
    /**
     * 处理pk战战斗结果
     * 5-3
     * @param bytes
     */
	public doFightResult(bytes: Sproto.sc_encounter_battle_result_request) {
		// EntityManager.ins().encounterIndex = undefined;
		var index = bytes.index
		var result = bytes.result
		var reward = [];
		var types = [0, 1, 4, 3];
		for (let i = 0, len = types.length; i < len; i++) {
			let rewardData = new RewardData();
			rewardData.type = 0;
			rewardData.id = types[i];
			rewardData.count = bytes.count[i]
			if (rewardData.count)
				reward.push(rewardData);
		}
		for (var i = 0, len = bytes.rewardDatas.length; i < len; i++) {
			let rewardData = new RewardData();
			rewardData.parser(bytes.rewardDatas[i]);
			Encounter.postCreateDrop(DropHelp.tempDropPoint.x, DropHelp.tempDropPoint.y, rewardData);
			reward.push(rewardData);
		}
		this.encounterModel[index] = null;
		delete this.encounterModel[index]
		this.doEncounterDataChange();
		var timeId;
		var tipStr = "获得奖励如下：";
		if (result) {
			var f = () => {
				this.sendGetreward();
				timeId = egret.setTimeout(() => {
					egret.clearTimeout(timeId);
					ViewManager.ins().open(ResultWin, result, reward, tipStr, false);
				}, this, 800);
				GameLogic.ins().createGuanqiaMonster();
			};
			DropHelp.addCompleteFunc(f, this);
			DropHelp.start();
		}
		else {
			timeId = egret.setTimeout(() => {
				egret.clearTimeout(timeId);
				ViewManager.ins().open(ResultWin, result, reward, tipStr, false);
				GameLogic.ins().createGuanqiaMonster();
			}, this, 800);
		}
		// EncounterAI.clearAtkTarget();
	}

	private m_Prestige = 0
	private m_Rank = 0
	private m_PkCount = 0
	private m_BuyCount = 0
	private m_NextTime = 0

	public get prestige(): number {
		return this.m_Prestige
	}

	public get rank(): number {
		return this.m_Rank
	}

	public get pkCount(): number {
		return this.m_PkCount
	}

	public get buyPKCount(): number {
		return this.m_BuyCount
	}

	public get nextTime(): number {
		return this.m_NextTime
	}

    /**
     * 更新PK数据
     * 5-7
     */
	public postDataUpdate(bytes: Sproto.sc_encounter_data_update_request) {
		// this.m_Prestige = bytes.prestige
		// this.m_Rank = bytes.rank
		this.m_PkCount = bytes.count
		this.m_BuyCount = bytes.buyCount
		this.m_NextTime = bytes.nextRecoverTime
	};

	private _DoMyData(rsp: Sproto.sc_encounter_my_data_request) {
		this.m_Prestige = rsp.fame || 0
		this.m_Rank = rsp.rank || 0
	}

	private _DoNews(rsp: Sproto.sc_encounter_news_request) {
		this.m_News.push(rsp.data)
		GameGlobal.MessageCenter.dispatch(MessageDef.ENCOUNTER_NEWS)
	}

	private _DoNewsList(rsp: Sproto.sc_encounter_news_list_request) {
		this.m_NewsList = rsp.datas
		this.m_NewsList.sort((lhs, rhs) => {
			return rhs.time - lhs.time
		})
		GameGlobal.MessageCenter.dispatch(MessageDef.ENCOUNTER_NEWS_LIST)
	}

	public sendInquirePrestige() {
		this.Rpc(C2sProtocol.cs_encounter_inquire_prestige)
		this.Rpc(C2sProtocol.cs_encounter_get_info)
	};

	public GetItemName(itemId): string {
		if (itemId == null) {
			return GlobalConfig.jifengTiaoyueLg.st100555;
		}
		let config = GlobalConfig.itemConfig[itemId]
		if (config) {
			return `|C:${ItemBase.QUALITY_COLOR_STR[config.quality]}&T:${config.name}|`
		}
		return null

	}

    /**
     * 获取pk战记录
     * 5-4
     */
	public doInquireRecord(bytes: Sproto.sc_encounter_inquire_record_request) {
		this.m_InquireRecord = []
		for (let data of bytes.robDatas) {
			// 如果是掠夺，并且是我输了，不记录信息
			if (!data.isWin) {
				continue
			}
			let name = this.GetItemName(data.itemId)
			if (name == null) {
				continue
			}
			let obj = new EncounterRecordData
			obj.time = data.time
			obj.rob = data
			obj.itemName = name
			this.m_InquireRecord.push(obj)
		}
		for (let data of bytes.berobDatas) {
			// 如果是被掠夺，并且是我赢了，不记录信息
			if (data.isWin) {
				continue
			}
			let name = this.GetItemName(data.itemId)
			if (name == null) {
				continue
			}
			let obj = new EncounterRecordData
			obj.time = data.time
			obj.beRob = data
			obj.itemName = name
			this.m_InquireRecord.push(obj)
		}
		// this.m_InquireRecord = bytes.datas
		function sortFunc(lhs: EncounterRecordData, rhs: EncounterRecordData) {
			// return lhs.time < rhs.time ? 1 : lhs.time > rhs.time ? -1 : 0
			return rhs.time - lhs.time
		}
		this.m_InquireRecord.sort(sortFunc)

		Encounter.postZaoYuRecord(this.m_InquireRecord);
	};

	public static postZaoYuRecord(param) {
		if (param === void 0) { param = null; }
		return param;
	};

	public sendInquireRecord() {
		this.Rpc(C2sProtocol.cs_encounter_inquire_record)
	};
	//-----------------------------------------------------------野外boss
    /**
* 处理更新野外boss
* 5-5
* @param bytes
*/
	public doUpdateWildBoss(bytes: Sproto.sc_encounter_update_will_boss_request) {

		var id = bytes.configID;
		this.zyKeyId = id;
		this.refreshCd = bytes.refreshCd;

		//清除boss
		if (this.zyKeyId > 0) {
			this.createBoss();
		} else {
			EntityManager.ins().removeWillBoss();
		}
		PlayFun.ins().upDataWillBoss();
	};

	private fieldBossConfig: any;
	/**根据唯一id获取遭遇boss数据*/
	public getZyBossDate(): any {
		if (this.fieldBossConfig == undefined)
			this.fieldBossConfig = GlobalConfig.ins("FieldBossConfig");
		for (var key in this.fieldBossConfig) {
			var arr = this.fieldBossConfig[parseInt(key)];
			for (var info of arr) {
				if (info.keyId == this.zyKeyId)
					return info;
			}

		}

	}

	public get refreshCd() {
		if (this._refreshCd)
			return this._refreshCd - GameServer.serverTime;
		return 0;
	}
	public set refreshCd(value) {
		this._refreshCd = value + GameServer.serverTime;
	}

	private monstersConfig: any;
	public createBoss() {
		if (this.monstersConfig == null) {
			this.monstersConfig = GlobalConfig.monstersConfig;
		}

		var info = this.getZyBossDate();
		if (info) {
			var monsterId = info.bossId;
			var sceneConf = GlobalConfig.ins("ScenesConfig")[GameMap.mapID];
			if (sceneConf) {
				var model = MonstersConfig.createModel(this.monstersConfig[monsterId]);
				model.x = sceneConf.bossX * GameMap.CELL_SIZE;
				model.y = sceneConf.bossY * GameMap.CELL_SIZE;
				model.type = EntityType.WillBoss;
				GameLogic.ins().createEntityByModel(model);
			}
		}
		// console.log("野外boss已经出现在" + model.x + "," + model.y + "上");
	};

	// public zaoyuBossAward: Sproto.reward_data[] = [];
    /**
     * 处理野外boss挑战结果
     * 5-6
     * @param bytes
     */
	public doWildBossResult(bytes: Sproto.sc_encounter_will_boss_result_request) {
		//胜负是前端算的后端说不用返回屏蔽掉 sendResult
		// var b = bytes.result
		// if (b) {
		// 	var count = bytes.award.length
		// 	// for (var j = 0; j < count; j++) {
		// 	// 	var award = new RewardData();
		// 	// 	award.parser(bytes.award[j]);
		// 	Encounter.postCreateDrop(DropHelp.tempDropPoint.x, DropHelp.tempDropPoint.y, []);
		// 	// }
		// 	// this.zaoyuBossAward = bytes.award;
		// 	ViewManager.ins().open(ZaoYuBossAwardWin);
		// }
		// var f = () => {
		// 	this.sendGetAward();
		// 	GameLogic.ins().createGuanqiaMonster();
		// };
		// DropHelp.addCompleteFunc(f, this);
		// DropHelp.start();

	};
	public static postCreateDrop(...params: any[]) {

		return params;
	};

	public getZaoYuBossAward(bytes: Sproto.sc_encounter_get_boss_award_request) {
		GameGlobal.MessageCenter.dispatch(MessageDef.WILLBOSS_AWARD_UPDATE, bytes.award, bytes.id);
	}

	public sendZaoYuBossAward(id: number) {
		let rsp = new Sproto.cs_encounter_get_boss_award_request
		rsp.id = id;
		this.Rpc(C2sProtocol.cs_encounter_get_boss_award, rsp)
	}
    /**
     * 上报挑战结果
     * 5-5
     * @param result 结果
     */
	public sendResult(result: boolean) {
		let rsp = new Sproto.cs_encounter_send_result_request
		rsp.result = result
		this.Rpc(C2sProtocol.cs_encounter_send_result, rsp)
		var b = result
		if (b) {
			// var count = bytes.award.length
			// for (var j = 0; j < count; j++) {
			// 	var award = new RewardData();
			// 	award.parser(bytes.award[j]);
			Encounter.postCreateDrop(DropHelp.tempDropPoint.x, DropHelp.tempDropPoint.y, []);
			// }
			// this.zaoyuBossAward = bytes.award;
			ViewManager.ins().open(ZaoYuBossAwardWin);
			OtherAIModel.getInstance.creatorAIRole();
		}
		var f = () => {
			// this.sendGetAward();
			GameLogic.ins().createGuanqiaMonster();
		};
		DropHelp.addCompleteFunc(f, this);
		DropHelp.start();
	};
    /**
     * 发送领取boss奖励
     * 5-6
     */
	public sendGetAward() {
		this.Rpc(C2sProtocol.cs_encounter_get_boss_award)
	};

	public SendBuyPKCount() {
		this.Rpc(C2sProtocol.cs_encounter_buy_pk_count)
	}

	/** 获取pk战数据 */
	public getEncounterModel(dbid: number) {
		return this.encounterModel[dbid];
	};
	/** 清除pk战数据 */
	public clearEncounterModel() {
		this.encounterModel = {}
	};

	public static IsBoss() {
		if (EntityManager.ins().getTeamCount(Team.WillBoss)) {
			return true
		}
		return false
	}


	public SendGetItemInfo() {
		this.Rpc(C2sProtocol.cs_encounter_get_item_info)
	}

	public SendClearRedPoint(itemId: number) {
		let req = new Sproto.cs_encounter_clear_redpoint_request
		req.itemId = itemId
		this.Rpc(C2sProtocol.cs_encounter_clear_redpoint, req)
	}

	public SendOpenItem(handle: number) {
		let req = new Sproto.cs_encounter_open_item_request
		req.handle = handle
		this.Rpc(C2sProtocol.cs_encounter_open_item, req)
	}

	public SendRevenge(handle: number) {
		let req = new Sproto.cs_encounter_send_revenge_request
		req.index = handle
		this.Rpc(C2sProtocol.cs_encounter_send_revenge, req)
	}

	private m_EncounterItem: Sproto.encounter_item_data[]
	private m_RedPoint = 0
	private m_RedPointTimestamp = 0

	public get encounterItem(): Sproto.encounter_item_data[] {
		return this.m_EncounterItem || []
	}

	public get redPoint(): number {
		return this.m_RedPoint
	}

	public get redPointTimestamp(): number {
		return this.m_RedPointTimestamp
	}

	private static _SortEncounterItem(lhs: Sproto.encounter_item_data, rhs: Sproto.encounter_item_data): number {
		let time = GameServer.serverTime
		if (time >= lhs.timestamp && time >= rhs.timestamp) {
			return rhs.itemId - lhs.itemId
		}
		return lhs.timestamp - rhs.timestamp
	}

	private _DoItemInfo(rsp: Sproto.sc_encounter_item_info_request) {
		let broadcast = false
		if (rsp.itemDatas != null) {
			this.m_EncounterItem = rsp.itemDatas
			this.m_EncounterItem.sort(Encounter._SortEncounterItem)
			broadcast = true
			if (!this.m_NewItemFlag) {
				this.m_NewItemFlag = {}
				this.ClearNewItem()
			}
		}
		if (rsp.redPoint != null) {
			this.m_RedPoint = rsp.redPoint
			broadcast = true
		}
		if (rsp.redPointTimestamp != null) {
			this.m_RedPointTimestamp = rsp.redPointTimestamp
			broadcast = true
		}
		if (broadcast) {
			GameGlobal.MessageCenter.dispatch(MessageDef.ENCOUNTER_ITEM_INFO_UPDATE)
		}
	}

	private _DoOpenResult(rsp: Sproto.sc_encounter_open_result_request) {
		ViewManager.ins().open(GetRewardPanel, GlobalConfig.jifengTiaoyueLg.st101876, GlobalConfig.jifengTiaoyueLg.st101875, rsp.rewardDatas, () => {
		})
	}

	public mIsRevengeTip = false

	public mPlayerRobInfo: {
		name: string,
		itemId: number
	}

	private _DoPlayerRob(rsp: Sproto.sc_encounter_player_rob_request) {
		this.mIsRevengeTip = true
		this.mPlayerRobInfo = {
			name: rsp.name,
			itemId: rsp.itemId
		}
		GameGlobal.MessageCenter.dispatch(MessageDef.ENCOUNTER_PLAYER_ROB)
	}

	public GetRecentRevenge(): EncounterRecordData {
		let list = this.m_InquireRecord
		for (let data of list) {
			if (data.beRob != null && data.beRob.isWin) {
				return data
			}
		}
		return null
	}

	public static CheckOpen(): boolean {
		if (UserFb.ins().guanqiaID >= GlobalConfig.ins("PublicPkrednamebaseConfig").openLevel) {
			return true
		} else {
			UserTips.ins().showTips("|C:0xf87372&T:" + "通关到第" + GlobalConfig.ins("PublicPkrednamebaseConfig").openLevel + "关开启pk战|");
		}
		return false
	}

	// 标记是否是新的物品
	private m_NewItemFlag: { [key: string]: boolean }

	public IsNewItem(itemHandle: number) {
		if (this.m_NewItemFlag && this.m_NewItemFlag[itemHandle]) {
			return false
		}
		return true
	}

	public ClearNewItem() {
		if (!this.m_NewItemFlag) {
			return
		}
		for (let key in this.m_EncounterItem) {
			this.m_NewItemFlag[this.m_EncounterItem[key].handle] = true
		}
	}

	public SendGetNews() {
		this.Rpc(C2sProtocol.cs_encounter_get_news)
	}

	public static CheckRedPoint() {
		for (let i = EncounterRedPointType.PK; i <= EncounterRedPointType.ITEM; ++i) {
			if (this.CheckRedPointByType(i)) {
				return true
			}
		}
	}

	public static CheckRedPointByType(type: EncounterRedPointType) {
		let self = Encounter.ins()
		if (type == EncounterRedPointType.PK) {
			let canPk = false
			for (let key in self.encounterModel) {
				let data = self.encounterModel[key]
				if (data.state == EncounterModelState.CAN_PK) {
					canPk = true
					break
				}
			}
			return canPk && Encounter.ins().pkCount > 0
		} else if (type == EncounterRedPointType.ITEM) {
			for (let key in self.m_EncounterItem) {
				let item = self.m_EncounterItem[key]
				if (self.IsNewItem(item.handle)) {
					return true
				}
				if (item.timestamp <= GameServer.serverTime) {
					return true
				}
			}
		}
	}
	get isTipsFlag() {
		return this.bIsTipsFlag;
	}
	set isTipsFlag(value) {
		if (this.bIsTipsFlag != value) {
			this.bIsTipsFlag = value;
			//this.canChange = false;
			//TimerManager.ins().doTimer(1000, 10, this.overDealy, this, this.dealyOver, this);
		}
	}
}

enum EncounterRedPointType {
	PK = 0,
	ITEM = 1,
}

class EncounterRecordData {
	public rob: Sproto.encounter_data_rob
	public beRob: Sproto.encounter_data_berob
	public time: number
	public itemName: string
}

MessageCenter.compile(Encounter);

window["Encounter"] = Encounter
window["EncounterRecordData"] = EncounterRecordData