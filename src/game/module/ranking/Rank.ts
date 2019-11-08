class Rank extends BaseSystem {


	/**排行榜数据 */
	rankModel: RankModel[] = []

	public constructor() {
		super();
		this.sysId = PackageID.Ranking;
		this.regNetMsg(S2cProtocol.sc_rank_data, this.getRankingData);
		this.regNetMsg(S2cProtocol.sc_rank_worship_data, this.PraiseData);
		this.regNetMsg(S2cProtocol.sc_rank_worship_success, this.PraiseResult);
		this.regNetMsg(S2cProtocol.sc_rank_worship_all_count_ret, Rank.postAllPraiseData);
	}
	//充值消费和轮盘的排行榜类型
	private readonly activityRankType: Array<number> = [114, 115, 116, 117, 118, 119, 120, 121, 122, 123, 124, 125, 126, 127, 128, 129, 130, 131, 132, 133, 134]

	static ins(): Rank {
		return super.ins()
	}

    /**
     * 请求排行榜数据
     * 18-1
     * @param type 排行榜类型
     */
	public sendGetRankingData(type: number) {
		var cs_rank_req = new Sproto.cs_rank_req_request();
		cs_rank_req.type = type;
		GameSocket.ins().Rpc(C2sProtocol.cs_rank_req, cs_rank_req);
		// var bytes = this.getBytes(1);
		// bytes.writeShort(type);
		// this.sendToServer(bytes);
	};
    /**
     * 请求排行榜数据结果
     * 18-1
     */
	public getRankingData(bytes: Sproto.sc_rank_data_request) {
		var rankModel = this.getRankModel(bytes.type);
		rankModel.parser(bytes);
		Rank.postRankingData(rankModel);
		OtherAIModel.getInstance.setName();
		if (this.activityRankType.indexOf(bytes.type) != -1) {
			GameGlobal.MessageCenter.dispatch(MessageDef.PAY_SPEND_RANK_UPDATE, bytes.type)
		}
	};
	public static postRankingData(model) {
		return model;
	};
    /**
     * 请求膜拜数据
     * 18-2
     */
	public sendGetPraiseData(type: number = 0) {
		var cs_rank_worship_data_req = new Sproto.cs_rank_worship_data_req_request();
		cs_rank_worship_data_req.type = Number(type);
		GameSocket.ins().Rpc(C2sProtocol.cs_rank_worship_data_req, cs_rank_worship_data_req);
		// var bytes = this.getBytes(2);
		// bytes.writeShort(type);
		// this.sendToServer(bytes);
	};
    /**
     * 接受膜拜结果
     * 18-2
     */
	PraiseData(bytes: Sproto.sc_rank_worship_data_request) {
		Rank.postPraiseData(bytes);
	}
	public static postPraiseData(bytes: Sproto.sc_rank_worship_data_request) {
		var rankModel = Rank.ins().getRankModel(bytes.type);
		// rankModel.praise.praiseTime = bytes.count;
		rankModel.praise.parser(bytes);
		return rankModel.type;
	};
    /**
     * 请求所有膜拜数据
     * 18-4
     * @returns void
     */
	public sendGetAllPraiseData() {

		GameSocket.ins().Rpc(C2sProtocol.cs_rank_worship_all_count, new Sproto.cs_rank_worship_all_count_request());

		//	var bytes = this.getBytes(4);
		//	this.sendToServer(bytes);
	};
    /**
     * 接受所有膜拜数据
     * 18-4
     * @param  {GameByteArray} bytes
     */
	public static postAllPraiseData(bytes: Sproto.sc_rank_worship_all_count_ret_request) {
		var n = bytes.worshipCount.length;
		for (var i = 0; i < n; i++) {
			var rankModel = Rank.ins().getRankModel(bytes.worshipCount[i].type);
			rankModel.praise.praiseTime = bytes.worshipCount[i].count;
		}
	};
    /**
     * 请求膜拜
     * 18-3
     */
	public sendPraise(type) {
		var cs_rank_worship_once = new Sproto.cs_rank_worship_once_request();
		cs_rank_worship_once.type = type;
		GameSocket.ins().Rpc(C2sProtocol.cs_rank_worship_once, cs_rank_worship_once);
		// var bytes = this.getBytes(3);
		// bytes.writeShort(type);
		// this.sendToServer(bytes);
	};
    /**
     * 膜拜结果
     * 18-3
     */
	PraiseResult(bytes: Sproto.sc_rank_worship_success_request) {
		Rank.postPraiseResult(bytes);
	}
	public static postPraiseResult(bytes: Sproto.sc_rank_worship_success_request) {
		var rankModel = Rank.ins().getRankModel(bytes.type);
		rankModel.praise.praiseTime = bytes.count;
		rankModel.praise.type = bytes.type;
		return [rankModel.type, rankModel.praise.getLastMobaiNum()];
	};
    /**
     * 获取指定类型的排行榜数据模型
     * 如果不存在则会创建该类型
     */
	public getRankModel(type): RankModel {
		if (!(type in this.rankModel)) {
			var dataClass = void 0;
			if (type == RankDataType.TYPE_SKIRMISH)
				dataClass = RankDataSkirmish;
			else if (type == RankDataType.TYPE_LADDER)
				dataClass = RankDataLadder;
			else if (this.activityRankType.indexOf(type) != -1) {
				dataClass = RankDataInfo;
			}
			else
				dataClass = RankDataBase;
			this.rankModel[type] = new RankModel(type, dataClass);
		}
		return this.rankModel[type];
	};
    /**
     * 能否膜拜（通过类型）
     * @param  {number} type	排行榜类型
     * @returns boolean
     */
	public canPraiseByType(type) {
		return this.rankModel[type] ? this.rankModel[type].praise.praiseTime < 1 : false;
	};
    /**
     * 能否膜拜（在所有显示排行榜里）
     * @returns boolean
     */
	public canPraiseInAll() {
		if (GameGlobal.actorModel.level <= 60) return false;
		for (let type of Rank.RANK_PANEL_TEYPS) {
			if (this.canPraiseByType(type)) {
				return true
			}
		}
		return false;
		// for (var i = 0, list = this.rankModel; i < list.length; i++) {
		// 	var value = list[i];
		// 	if (value && value.praise.praiseTime < 1) {
		// 		return true;
		// 	}
		// }
		// return false;
	};

	public static RANK_PANEL_TEYPS = [
		RankDataType.TYPE_POWER,
		RankDataType.TYPE_LEVEL,
		RankDataType.TYPE_WING,
		RankDataType.TYPE_LADDER,
		RankDataType.TYPE_JOB_ZS,
		RankDataType.TYPE_JOB_FS,
		RankDataType.TYPE_JOB_DS,
		RankDataType.TYPE_SKIRMISH,
		RankDataType.TYPE_PRESTIGE,
	]

	public mRankIndex: number = 0;
	public OpenRankPanel(rankType: RankDataType) {
		if (GameGlobal.actorModel.level < 60) {
			UserTips.ins().showTips(GlobalConfig.jifengTiaoyueLg.st100379);
			return;
		}
		for (let i = 0; i < Rank.RANK_PANEL_TEYPS.length; ++i) {
			if (Rank.RANK_PANEL_TEYPS[i] == rankType) {
				this.mRankIndex = i
				ViewManager.ins().open(RankingWin);
			}
		}
	}
}


class RankModel {
	type;
	_dataClass;
	_dataList: any[];
	praise: PraiseData;
	selfPos: number;
	value: number
	public constructor(type, dataClass) {
		this.type = type;
		this._dataClass = dataClass;
		this._dataList = [];
		this.praise = new PraiseData;
	}


	/** 排行榜数据 */
	public getDataList(index = -1) {
		return index == -1 ? this._dataList : this._dataList[index];
	};
	public parser(bytes: Sproto.sc_rank_data_request) {
		var items = RankDataType.ITEMS[this.type];
		if (!items) {
			items = RankDataType.ITEMS[this.type] = [
				RankDataType.DATA_POS,
				RankDataType.DATA_ID,
				RankDataType.DATA_PLAYER,
				RankDataType.DATA_LEVEL,
				RankDataType.DATA_ZHUAN,
				RankDataType.DATA_VIP,
				RankDataType.DATA_MONTH,
				RankDataType.DATA_POWER,
			]
		}
		var n = bytes.datas.length;
		this._dataList.length = n;
		for (var i = 0; i < n; ++i) {
			if (!(i in this._dataList))
				this._dataList[i] = new this._dataClass;
			this._dataList[i].parser(bytes.datas[i], items);
		}
		this.selfPos = bytes.selfRank;
		this.value = bytes.value
	};
}

MessageCenter.compile(Rank);
window["Rank"] = Rank
window["RankModel"] = RankModel