class ZsBoss extends BaseSystem {


	/**是否自动清除复活cd */
	autoClear = false;
	public get promptList() {
		let data = GlobalConfig.jifengTiaoyueLg;
		let list = ["", data.st101890, data.st101889, data.st101888, data.st101886,
			data.st101885, data.st101884];
		return list;
	}
	public get wPromptList() {
		let data = GlobalConfig.jifengTiaoyueLg;
		let list = ["", data.st101890, data.st101889, data.st101887, data.st101886,
			data.st101885, data.st101884];
		return list;
	}
	// private firstShowWin = true;
	_clearOther = false;
	canChange = true;

	aliveBossNum: number
	bossInfoList: BossInfoData[]
	acIsOpen: boolean;
	/**当前boss*/
	public bossId: number; // tag 0
	/**下一次开启boss*/
	public nextBossId: number; // tag 1

	remainTime: number
	lotteryItemId
	// ZSBossLotteryWin
	hudun

	_reliveTime
	barList

	private bossRankList: { [key: number]: WildBossJoinItemData[] } = {};
	private otherBoss1Config: any;

	public GetBossRankList(id: number): WildBossJoinItemData[] {
		return this.bossRankList[id] || []
	}

	public constructor() {
		super()
		this.sysId = PackageID.ZsBoss;
		this.regNetMsg(S2cProtocol.sc_zs_boss_list, this.postBossList);
		this.regNetMsg(S2cProtocol.sc_zs_boss_open, this.postBossOpen);
		this.regNetMsg(S2cProtocol.sc_zs_boss_remain_time, this.RspRemainTime);
		this.regNetMsg(S2cProtocol.sc_zs_boss_rank_info, this.postRankInfo);
		this.regNetMsg(S2cProtocol.sc_zs_boss_lottery_info, this.postLotteryInfo);
		//this.regNetMsg(6, this.postBuyCdResult);
		this.regNetMsg(S2cProtocol.sc_zs_boss_challenge_result, this.postChallengeResult);
		this.regNetMsg(S2cProtocol.sc_zs_boss_hudun_point, this.RspHudunPoint);
		this.regNetMsg(S2cProtocol.sc_zs_boss_win_result, this.postWinResult);

		this.regNetMsg(S2cProtocol.sc_zs_boss_get_my_point, this.RspGetMyPoint);
		this.regNetMsg(S2cProtocol.sc_zs_boss_talk_max_point, this.RspTalkMaxPoint);

		/**击杀玩家功勋更改播报*/
		this.regNetMsg(S2cProtocol.sc_zs_boss_actordie_feats, this.backActordieFeats);

		/**----------------世界BOSS--------------------------*/
		this.regNetMsg(S2cProtocol.sc_world_boss_open, this.worldBossOpenRep);
		this.regNetMsg(S2cProtocol.sc_world_boss_challenge_result, this.postWorldChallengeResult);
	}
	static ins(): ZsBoss {
		return super.ins();
	};

	private backActordieFeats(rsp: Sproto.sc_zs_boss_actordie_feats_request) {
		var robName: string = rsp.robName;//攻击者角色名
		var berobName: string = rsp.berobName;//被击杀者角色名
		var feats: number = rsp.feats;//获得功勋值
		var totalFeats: number = rsp.totalFeats;//攻击者角色总共功勋

		UserTips.ins().showTips(`${robName}击杀了${berobName}获得了${feats}功勋。`);
	}

    /**
    *  1  请求boss 列表
    */
	sendGetBossList() {
		// var bytes = this.getBytes(1);
		// this.sendToServer(bytes);
		this.Rpc(C2sProtocol.cs_zs_boss_list)
	};
    /**
     *  3  请求挑战
     */
	sendRequstChallenge() {
		// var bytes = this.getBytes(3);
		// this.sendToServer(bytes);
		// this.firstShowWin = false
		this.Rpc(C2sProtocol.cs_zs_boss_challenge)
	};
    /**
     *  4  查看伤害排行榜
     */
	sendRequstBossRank(bossId) {
		// var bytes = this.getBytes(4);
		// bytes.writeInt(bossId);
		// this.sendToServer(bytes);
		let rsp = new Sproto.cs_zs_boss_rank_request
		rsp.bossId = bossId
		this.Rpc(C2sProtocol.cs_zs_boss_rank, rsp)
	};
    /**
     *  5  参与抽奖
     */
	sendJoinChoujiang() {
		// var bytes = this.getBytes(5);
		// this.sendToServer(bytes);
		if (GameMap.IsWorldBoss())
			this.Rpc(C2sProtocol.cs_world_boss_join_lottery)
		else
			this.Rpc(C2sProtocol.cs_zs_boss_join_lottery)
	};
    /**
     *  6  购买cd
     */
	sendBuyCd() {
		// var bytes = this.getBytes(6);
		// this.sendToServer(bytes);
		if (GameMap.IsWorldBoss())
			this.Rpc(C2sProtocol.cs_world_boss_buy_cd)
		else
			this.Rpc(C2sProtocol.cs_zs_boss_buy_cd)
	};
	//boss 列表
	postBossList(bytes: Sproto.sc_zs_boss_list_request) {
		if (bytes.boss_info_list) {
			var len = bytes.boss_info_list.length
			this.bossInfoList = [];
			for (var i = 0; i < len; i++) {
				this.bossInfoList.push(new BossInfoData(bytes.boss_info_list[i]));
			}
		}
		this.aliveBossNum = bytes.alive_boss_num
	};
    /**
    * 获取BOSS列表长度
    */
	getBossListLength() {
		var result = 0;
		if (this.bossInfoList != null) {
			result = this.bossInfoList.length;
		}
		return result;
	};
    /**
     * 获取BOSS信息（通过索引）
    * @param index
    */
	getBossInfoByIndex(index) {
		var result = null;
		if (this.bossInfoList != null) {
			if (index >= 0 && index < this.bossInfoList.length) {
				result = this.bossInfoList[index];
			}
		}
		return result;
	};
	//活动是否开启
	postBossOpen(bytes: Sproto.sc_zs_boss_open_request) {
		this.bossId = bytes.bossId;
		this.nextBossId = bytes.nextBossId;
		this.acIsOpen = this.bossId > 0 ? true : false;//bytes.ac_is_open
		if (!this.acIsOpen) {
			this.hudun = null
			this.reliveTime = 0;
		}
		// else {
		// 	if (UserZs.ins().lv > 0) {
		// 		UserBoss.ins().postBossData(true, this.canPlayBossName());
		// 	}
		// }


		GameGlobal.MessageCenter.dispatch(MessageDef.ZS_BOSS_OPEN)
	};
	//boss 剩余参加次数
	RspRemainTime(bytes: Sproto.sc_zs_boss_remain_time_request) {
		this.remainTime = bytes.remain_time * 0.001
		this.reliveTime = bytes.relive_time * 0.001
		GameGlobal.MessageCenter.dispatch(MessageDef.ZS_BOSS_REMAIN_TIME)
	};
	//boss 伤害排行
	postRankInfo(bytes: Sproto.sc_zs_boss_rank_info_request) {
		this.parseBossRankList(bytes);
	}

	//抽奖信息
	postLotteryInfo(bytes: Sproto.sc_zs_boss_lottery_info_request) {
		this.lotteryItemId = bytes.lotteryItemId
		ViewManager.ins().open(ZSBossLotteryWin);

		// 到达抽奖，说明护盾已经消息
		this.hudun = 0
		GameGlobal.MessageCenter.dispatch(MessageDef.ZS_BOSS_HUDUN_POINT)
	}

	/** 处理开始挑战结果*/
	postChallengeResult(bytes: Sproto.sc_zs_boss_challenge_result_request) {
		var index = bytes.index
		if (index > 0) {
			UserTips.ins().showTips(this.promptList[index]);
		}
		else if (index == 0) {
			ViewManager.ins().close(BossWin);
		}
	};
	/**护盾剩余百分比 */
	RspHudunPoint(bytes: Sproto.sc_zs_boss_hudun_point_request) {
		this.hudun = bytes.hudun
		GameGlobal.MessageCenter.dispatch(MessageDef.ZS_BOSS_HUDUN_POINT)
	};
	/**胜利结算 */
	postWinResult(bytes: Sproto.sc_zs_boss_win_result_request) {
		var infoArr = [bytes.first, bytes.kill, bytes.myrank];
		var len = bytes.rewardDatas.length;
		var list = [];
		for (var i = 0; i < len; i++) {
			let item = new RewardData();
			item.parser(bytes.rewardDatas[i]);
			list.push(item);
		}
		ViewManager.ins().open(ZsBossResultWin, infoArr, list);

		// boss死亡，重新请求数据状态
		ZsBoss.ins().sendGetBossList();
	};

	private RspGetMyPoint(rsp: Sproto.sc_zs_boss_get_my_point_request): void {
		GameGlobal.MessageCenter.dispatch(MessageDef.ZS_BOSS_GETMY_LOTTERY_POINT, rsp.point)
	}

	private RspTalkMaxPoint(rsp: Sproto.sc_zs_boss_talk_max_point_request): void {
		GameGlobal.MessageCenter.dispatch(MessageDef.ZS_BOSS_LOTTERY_MAX_POINT, rsp.name, rsp.point)
	}

	get reliveTime() {
		return this._reliveTime;
	}
	set reliveTime(num) {
		if (this._reliveTime != num) {
			this._reliveTime = num;
			TimerManager.ins().remove(this.timeClock, this);
			TimerManager.ins().doTimer(1000, this._reliveTime, this.timeClock, this);
		}
	}
	timeClock() {
		this._reliveTime--;
		if (this._reliveTime <= 0) {
			TimerManager.ins().remove(this.timeClock, this);
		}
	};
	parseBossRankList(bytes: Sproto.sc_zs_boss_rank_info_request) {
		var bossId = bytes.bossId
		var len = bytes.rank_list.length
		let list = []
		for (var i = 0; i < len; i++) {
			let rank = bytes.rank_list[i]
			let obj = new WildBossJoinItemData
			obj.name = rank.names
			obj.value = rank.shanghai
			// rank.id
			list.push(obj)
		}
		list.sort((lhs, rhs) => {
			return rhs.value - lhs.value
		})
		this.bossRankList[bossId] = list
	};
	/** 奖励预览的barList */
	getBarList(isZsBoss: boolean) {

		this.barList = [];
		var boosConfig: any = isZsBoss ? GlobalConfig.ins("OtherBoss1Config") : GlobalConfig.ins("WorldBossConfig");
		var config;
		for (var i = 1; i < 5; i++) {
			config = boosConfig[i];
			if (config) {
				let monsters = GlobalConfig.monstersConfig[config.bossId];
				let str = monsters.name;
				str = str.substring(str.length - 2)
				this.barList.push(str);
			}
		}
		return this.barList;
	};
	/**是否在转生boss 副本 */
	isZsBossFb(fbId) {

		if (this.otherBoss1Config == null)
			this.otherBoss1Config = GlobalConfig.ins("OtherBoss1Config");

		var config;
		for (var i = 1; i < 5; i++) {
			config = this.otherBoss1Config[i];
			if (fbId == config.fbid) {
				return true;
			}
		}
		return false;
	};
	//秒cd 钱是否足够
	checkIsMoreMoney() {
		return GameLogic.ins().actorModel.yb >= 30;
	};
	checkisAutoRelive(send = true) {
		if (this.reliveTime > 0) {
			if (this.autoClear) {
				if (this.checkIsMoreMoney()) {
					if (send) {
						this.sendBuyCd()
					}
					return false;
				}
				else {
					UserTips.ins().showTips(GlobalConfig.jifengTiaoyueLg.st101699);
					this.autoClear = false;
				}
			}
			return true;
		}
		return false;
	};
	/**是否展示通知面板 */
	// checkIsShowNoticeWin() {
	// if(this.firstShowWin){
	// 	return false;
	// }
	//活动是否开启
	// if(this.acIsOpen)
	// {
	// 	let data:BossInfoData;
	// 	for(let i:number = 0; i< this.bossInfoList.length; i++)
	// 	{
	// 		data = this.bossInfoList[i];
	// 		if(data.challengeIn)
	// 		{
	// 			return false;
	// 		}
	// 	}
	// let serverTime:number = GameServer.serverTime;
	// let date:Date = new Date(serverTime);
	// if(date.getHours()>=18)
	// {
	// 	return false;
	// }
	// 		return true;
	// 	}
	// 	return false;
	// };

	// public IsFirstEnter(): boolean {
	// 	return this.firstShowWin
	// }

	/**获取能够打BOSS的索引 */
	canPlayBossIndex() {
		if (this.otherBoss1Config == null)
			this.otherBoss1Config = GlobalConfig.ins("OtherBoss1Config");

		var zsLv = UserZs.ins().lv;
		var config;
		for (var i = 4; i >= 1; i--) {
			config = this.otherBoss1Config[i];
			if (zsLv >= config.llimit && zsLv <= config.hlimit) {
				if (this.aliveBossNum >= i) {
					return i;
				}
			}
		}
		return 0;
	};

	public IsRedPoint() {
		let index = this.canPlayBossIndex()
		if (index != 0) {
			return this.bossInfoList[index - 1] && !this.bossInfoList[index - 1].kill
		}
		return false
	}
	private monstersConfig: any;
	/**获取能够打BOSS的名字 */
	canPlayBossName() {
		var index = this.canPlayBossIndex();
		if (index > 0) {
			if (this.monstersConfig == null)
				this.monstersConfig = GlobalConfig.monstersConfig;
			if (this.otherBoss1Config == null)
				this.otherBoss1Config = GlobalConfig.ins("OtherBoss1Config");

			var config = this.otherBoss1Config[index];
			return this.monstersConfig[config.bossId].name;
		}
		return "转生boss ";
	};
	get clearOther() {
		return this._clearOther;
	}
	set clearOther(value) {
		if (this._clearOther != value) {
			this._clearOther = value;
			this.canChange = false;
			TimerManager.ins().doTimer(1000, 10, this.overDealy, this, this.dealyOver, this);
		}
	}
	dealyOver() {
		TimerManager.ins().remove(this.overDealy, this);
		this.canChange = true;
	};
	overDealy() {
		// console.log("aaaaaaaaa");

	}

	/**------------------------------世界Boss------------------------------------*/
	/*世界boss是否开始*/
	public wAcIsOpen: boolean;
	/**当前世界boss*/
	public wBossId: number;
	/**下一次开启世界boss*/
	public wNextBossId: number;

	/**世界BOSS活动开启*/
	private worldBossOpenRep(bytes: Sproto.sc_world_boss_open_request): void {
		this.wBossId = bytes.bossId;
		this.wNextBossId = bytes.nextBossId;
		this.wAcIsOpen = this.wBossId > 0 ? true : false;
		if (!this.wAcIsOpen) {
			this.hudun = null
			this.reliveTime = 0;
		}
		GameGlobal.MessageCenter.dispatch(MessageDef.WORLD_BOSS_OPEN)
	}

	/**世界BOSS挑战请求*/
	public worldBossChallengeReq() {
		this.Rpc(C2sProtocol.cs_world_boss_challenge)
	};

	/**世界boss挑战结果*/
	private postWorldChallengeResult(bytes: Sproto.sc_world_boss_challenge_result_request) {
		var index = bytes.index
		if (index > 0) {
			UserTips.ins().showTips(this.wPromptList[index]);
		}
		else if (index == 0) {
			ViewManager.ins().close(WorldBossWin);
		}
	};
}

class BossInfoData {
	bossId: number
	kill: boolean
	challengeIn: boolean
	public constructor(bytes: Sproto.boss_info_data) {
		this.bossId = bytes.bossId;
		this.challengeIn = bytes.challengeIn;
		this.kill = bytes.kill;
	}
}

// class BossRankInfo {
// 	id
// 	names
// 	shanghai
// 	rank
// 	public constructor(bytes: Sproto.boss_rank_info, ranks) {
// 		this.id = bytes.id
// 		this.names = bytes.names
// 		this.shanghai = bytes.shanghai
// 		this.rank = ranks;
// 	}
// }

MessageCenter.compile(ZsBoss);
window["ZsBoss"] = ZsBoss
window["BossInfoData"] = BossInfoData