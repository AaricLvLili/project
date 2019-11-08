class Ladder extends BaseSystem {


	/**是否可以领取奖励 */
	isCanReward = false;
	/**上周天梯级别 */
	upLevel = 0;
	/**上周天梯id */
	upId = 0;
	/**上周净胜 */
	upWin = 0;
	/**已购买次数 */
	todayBuyTime = 0;
	/**排行榜信息 */
	upRankList = [];

	/**是否第一次打开购买窗口 */
	isTipsFlag: boolean = false;

	_actorInfo: any[]
	upWeekRank: number
	// upweekLength
	isOpen: boolean
	level: number
	nowId: number
	challgeNum: number
	challgeCd: number
	winNum: number
	lianWin: boolean
	playUpTime: boolean
	configList
	step: number;

	public constructor() {
		super();

		this.sysId = PackageID.Ladder;
		this.regNetMsg(S2cProtocol.sc_ladder_info, this.doLadderInfo);
		this.regNetMsg(S2cProtocol.sc_ladder_player_back, this.postPlayerBack);
		this.regNetMsg(S2cProtocol.sc_ladder_result, this.doPlayResule);
		this.regNetMsg(S2cProtocol.sc_ladder_rank_list, this.doRankInfoList);
		this.regNetMsg(S2cProtocol.sc_ladder_buy_count, this.doChallageNum);

		//王者挑战记录
		this.regNetMsg(S2cProtocol.sc_ladder_get_record, this.saveRecordData);

	}
	public recordList: Sproto.record_data_ladder[];
	private saveRecordData(bytes: Sproto.sc_ladder_get_record_request) {
		this.recordList = bytes.recordList;
		// recordType				0 : integer 	# 记录类型（1：攻，2：守）
		// isWin					1 : integer		# 结果类型（1：胜利，2：失败）
		// recordTime				2 : integer		# 记录时间（时间戳）
		// name					3 : string		# 被挑战着名字
		// power					4 : integer		# 被挑战者战斗力
		// awardType				5 : integer		# 1为+1星，2为+2星 4为-1星
		// zhuansheng_lv  			6 : integer		# 转生等级
		// lv						7 : integer		# 等级
		GameGlobal.ViewManager.open(LadderKingList);
	}


	static ins(): Ladder {
		return super.ins();
	};
	/**根据索引获取数据 */
	getActorInfo(index = -1) {
		return index == -1 ? this._actorInfo : this._actorInfo[index];
	};
	//服务器数据下发处理
	//============================================================================================
	/**请求匹配玩家 34-2*/
	sendGetSomeOne() {
		// var bytes = this.getBytes(2);
		// this.sendToServer(bytes);
		this.Rpc(C2sProtocol.cs_ladder_get_some_one)
	};
	/**开始挑战 34-3*/
	sendStarPlay(id, type) {
		// var bytes = this.getBytes(3);
		// bytes.writeInt(type);
		// bytes.writeInt(id);
		// this.sendToServer(bytes);

		let rep = new Sproto.cs_ladder_start_play_request
		rep.type = type
		rep.id = id
		this.Rpc(C2sProtocol.cs_ladder_start_play, rep)
	};
	/**领取上周奖励 34-4*/
	sendGetWeekReward() {
		this.Rpc(C2sProtocol.cs_ladder_get_week_reward)

		GameGlobal.MessageCenter.dispatch(MessageDef.LADDER_PRE_WEEK_REWARD)

	};
	/**获取排行榜数据 34-5*/
	sendGetRankInfo() {
		this.Rpc(C2sProtocol.cs_ladder_get_rank_info)
	};
	/**购买次数 34-6*/
	sendBuyChallgeTime() {
		// var bytes = this.getBytes(6);
		// this.sendToServer(bytes);
		this.Rpc(C2sProtocol.cs_ladder_buy_count)
	};
	/**请求挑战记录*/
	sendChangeList() {
		this.Rpc(C2sProtocol.cs_ladder_get_record)
	};



	/**天梯相关信息 34-1 */
	doLadderInfo(bytes: Sproto.sc_ladder_info_request) {
		this.docodeInfo(bytes);
	};
	/**派发天梯相关信息 */
	postTadderChange() {
	};
	/**获取到天梯天战对象 34-2*/
	postPlayerBack(bytes: Sproto.sc_ladder_player_back_request) {
		this.doCodeplayerInfo(bytes);
	};
	/**天梯挑战结果 34-3*/
	doPlayResule(bytes: Sproto.sc_ladder_result_request) {
		this.doPlayResult(bytes);
	};
	/**获取排行榜列表 34-5*/
	doRankInfoList(bytes: Sproto.sc_ladder_rank_list_request) {
		// this.upWeekRank = bytes.upWeekRank
		// var rankModel = Rank.ins().getRankModel(RankDataType.TYPE_LADDER);
		// var n = bytes.rankData.length
		// rankModel.getDataList().length = n;
		// var arr = rankModel.getDataList();
		// var i = 0;
		// for (i = 0; i < n; ++i) {
		// 	this.setRankData(arr, i, bytes.rankData[i]);
		// }
		// var rankInfo = this.getMyRankInfo(arr);
		// rankModel.selfPos = rankInfo ? rankInfo.pos : 0;
		this.upRankList = [];
		// this.upweekLength = 0;
		let n = bytes.upWeekRankList.length
		for (let i = 0; i < n; ++i) {
			this.setRankData(this.upRankList, i, bytes.upWeekRankList[i]);
		}

		for (let i = this.upRankList.length, len = this.checkObjListLength(); i < len; ++i) {
			this.upRankList.push(null)
		}

		if (!this.configList) {
			this.configList = this.cloneConfigDataList(GlobalConfig.ins("TianTiDanConfig"));
			this.configList.reverse();
		}

		GameGlobal.MessageCenter.dispatch(MessageDef.LADDER_UPWEEK_RANK_UPDATE)

		// this.fillingList();
		// Rank.postRankingData(rankModel);
	};
    /**
     * 设置排行数据
     */
	setRankData(list: RankDataLadder[], index, bytes: Sproto.rank_data_ladder) {
		if (!(index in list))
			list[index] = new RankDataLadder;
		list[index].parser(bytes, null);
		//排名
		list[index].pos = index + 1;
	};
	/**获取已购买次数 34-6*/
	doChallageNum(bytes: Sproto.sc_ladder_buy_count_request) {
		this.todayBuyTime = bytes.todayBuyTime
	};
	// 获取剩余时间
	private nextTime = 0;
	public get NextTime() {
		return this.nextTime;
	}
	//业务数据处理
	//============================================================================================
	/** 天梯数据 34-1*/
	docodeInfo(bytes: Sproto.sc_ladder_info_request) {
		this.isOpen = bytes.isOpen
		this.level = bytes.level
		this.nowId = bytes.nowId
		this.nowId = this.SetStep(this.level, this.nowId)
		this.challgeNum = bytes.challgeNum
		this.challgeCd = bytes.challgeCd
		this.nextTime = bytes.challgeCd + GameServer.serverTime
		this.winNum = bytes.winNum
		this.lianWin = bytes.lianWin
		this.playUpTime = bytes.playUpTime
		this.upWeekRank = bytes.rank
		if (this.playUpTime) {
			this.isCanReward = bytes.isCanReward
			this.upLevel = bytes.upLevel
			this.upId = bytes.upId
			this.upId = this.SetStep(this.upLevel, this.upId)
			this.upWin = bytes.upWin
		}
		Ladder.ins().postTadderChange();
	};
	doCodeplayerInfo(bytes: Sproto.sc_ladder_player_back_request) {
		var type = bytes.type
		var id = bytes.id
		this._actorInfo = [];
		this._actorInfo.push(type, id);
		if (id > 0) {
			this._actorInfo.push(bytes.name);
			this._actorInfo.push(bytes.job);
			this._actorInfo.push(bytes.sex);
			this._actorInfo.push(bytes.level);
			this._actorInfo.push(bytes.step);
		}
		this.step = bytes.step;
	};
	/**挑战结果 34-3*/
	doPlayResult(bytes: Sproto.sc_ladder_result_request) {
		var isWin = bytes.isWin
		var num = bytes.rewardData.length
		var list: RewardData[] = [];
		for (var i = 0; i < num; i++) {
			let item = new RewardData();
			item.parser(bytes.rewardData[i]);
			list.push(item);
		}
		var upLevel = this.level
		var upId = this.nowId

		this.level = bytes.upLevel
		this.nowId = bytes.upId
		this.nowId = this.SetStep(this.level, this.nowId)

		var upStar = bytes.upStar
		var timeId = egret.setTimeout(function () {
			egret.clearTimeout(timeId);
			// ViewManager.ins().open(LadderResultWin, isWin, list, upLevel, upId, upStar);
			ViewManager.ins().open(LadderResultWin, isWin, list, this.level, upId, upStar);
		}, this, 1000);
	};
	// fillingList() {
	// 	if (this.upweekLength == 0) {
	// 		this.upweekLength = this.checkObjListLength();
	// 	}
	// 	var len = this.upweekLength - this.upRankList.length;
	// 	if (len > 0) {
	// 		for (var i = 1; i < len; i++) {
	// 			this.upRankList.push(null);
	// 		}
	// 	}
	// 	if (!this.configList) {
	// 		this.configList = this.cloneConfigDataList(GlobalConfig.ins("TianTiDanConfig"));
	// 		this.configList.reverse();
	// 	}
	// };
	checkObjListLength() {
		for (var i = 1; i < 200; i++) {
			if (!GlobalConfig.ins("TianTiRankAwardConfig")[i + ""]) {
				return i;
			}
		}
		return 0;
	};
	getMyRankInfo(itemList) {
		for (var i = 0; i < itemList.length; i++) {
			if (itemList[i].id == GameLogic.ins().actorModel.actorID) {
				return itemList[i];
			}
		}
		return null;
	};
	getLevelDuanWeiLength(level) {
		var len = 0;
		var list = GlobalConfig.ins("TianTiDanConfig");
		for (var id in list[level + ""]) {
			if (list[level + ""][id]) {
				len++;
			}
		}
		return len;
	};
	getDuanWeiDesc() {
		var str = "";
		var config = this.getLevelConfig();
		if (config) {
			str = config.showLevel + this.getZhongwenNumber(config.showDan) + "段";
		}
		return str;
	};
    /**
     * 获取结算配置
     *
     */
	getLevelConfig(level = -1, ids = -1) {
		if (level == -1) {
			level = this.level;
		}
		if (ids == -1) {
			ids = this.nowId;
		}
		if (level == 4) {
			ids = 0;
		}
		var list = GlobalConfig.ins("TianTiDanConfig");
		for (var id in list[level + ""]) {
			if (list[level + ""][id].id == ids) {
				return list[level + ""][id];
			}
		}
		return null;
	};
	creatRewardData(data) {
		var item;
		item = new RewardData();
		item.count = data.count;
		item.type = data.type;
		item.id = data.id;
		return item;
	};
	getZhongwenNumber(i) {
		var str = "";
		switch (i) {
			case 1:
				str = GlobalConfig.jifengTiaoyueLg.st100432;
				break;
			case 2:
				str = GlobalConfig.jifengTiaoyueLg.st100433
				break;
			case 3:
				str = GlobalConfig.jifengTiaoyueLg.st100434
				break;
			case 4:
				str = GlobalConfig.jifengTiaoyueLg.st100435
				break;
			case 5:
				str = GlobalConfig.jifengTiaoyueLg.st100436
				break;
			case 6:
				str = GlobalConfig.jifengTiaoyueLg.st100437
				break;
			case 7:
				str = GlobalConfig.jifengTiaoyueLg.st100438
				break;
			case 8:
				str = GlobalConfig.jifengTiaoyueLg.st100439
				break;
			case 9:
				str = GlobalConfig.jifengTiaoyueLg.st100440
				break;
		}
		return str;
	};
    /**
     * 复制一个配置数组
     * @param list
     */
	cloneConfigDataList(list) {
		var returnList = [];
		var item;
		for (var i in list) {
			for (var j in list[i]) {
				item = new TianTiDanConfig();
				item.level = parseInt(i);
				item.id = list[i][j].id;
				item.showStar = list[i][j].showStar;
				item.showDan = list[i][j].showDan;
				item.showLevel = list[i][j].showLevel;
				item.winAward = list[i][j].winAward;
				item.danAward = list[i][j].danAward;
				if (this.checkIshaveOne(returnList, item)) {
					returnList.push(item);
				}
			}
		}
		return returnList;
	};
	checkRedShow() {
		if (!Deblocking.Check(DeblockingType.TYPE_02, true))
			return 0;

		if ((this.challgeNum > 0 && this.isOpen) || this.isCanReward) {
			return 1;
		}
		return 0;
	};
	checkIshaveOne(list, item) {
		var len = list.length;
		for (var i = 0; i < len; i++) {
			if (list[i].level == item.level) {
				return false;
			}
		}
		return true;
	};
	getStatuByLevel(level) {
		var str;
		switch (level) {
			case 1:
				str = 3;
				break;
			case 2:
				str = 4;
				break;
			case 3:
				str = 5;
				break;
			case 4:
				str = 0;
				break;
		}
		return str;
	};

	private SetStep(level: number, step: number): number {
		// if (level == 4) {
		// 	return 0
		// }
		return step
	}
}

MessageCenter.compile(Ladder);
window["Ladder"] = Ladder