class GuildFB extends BaseSystem {

	bossTimer = 1; //当前波的结束时间
	_gkDatas: Array<string> = []

	fbNum: number = 0	// 个人关卡最高记录
	sweep: number = 0	// 是否扫荡
	sweepNum: number = 1;
	tongguan: number = 0 // 是否领取每日福利
	zuwei: number;
	nextFb: number = 0 // 下关通关人数

	rankDatas: Array<GuildFBRankInfo>;

	isMaxGK: number = 0
	maxName: string = ""
	maxCareer: number = 1
	maxSex: number = 0
	maxNum: number = 0
	maxZhuwei: number = 0

	// fbgkNum: number;
	// change: number;

	rewardNum: number = 0
	rewardRoleNum: number;
	bossGKNum: number;

	public static ins(): GuildFB {
		return super.ins()
	}

	public constructor() {
		super();

		this.sysId = PackageID.GuildFB;
		this.regNetMsg(S2cProtocol.sc_guild_raid_actor_info, this.doGuildFBInfo);
		this.regNetMsg(S2cProtocol.sc_guild_raid_ranklist, this.doGuildFBRankInfo);
		this.regNetMsg(S2cProtocol.sc_guild_raid_ranktop, this.doGuildFBMaxGKInfo);
		this.regNetMsg(S2cProtocol.sc_guild_raid_stagerank, this.doGuildFBGKInfo);
		// this.regNetMsg(5, this.doGuildFBChangeInfo);
		this.regNetMsg(S2cProtocol.sc_guild_raid_reward_pro, this.doGuildFBRewardInfo);
		this.regNetMsg(S2cProtocol.sc_guild_raid_starttime, this.postGuildFBBossInfo);
		this.regNetMsg(S2cProtocol.sc_guild_raid_overtime, this.postGuildFBBossTimerEndInfo);
		this.regNetMsg(S2cProtocol.sc_guild_raid_waveover, this.postGuildFBSweep)
	}


	/**通关人数列表 */
	public getGkDatas() {
		return  this._gkDatas 
	};
	/** 公会副本信息 */
	public doGuildFBInfo(bytes: Sproto.sc_guild_raid_actor_info_request) {
		this.fbNum = bytes.stage
		this.sweep = bytes.sweep ? 1 : 0
		this.sweepNum = bytes.wave || 0
		this.tongguan = bytes.reward ? 1 : 0
		this.zuwei = bytes.boost ? 1 : 0
		this.nextFb = bytes.number

		this.m_ReqWave = null
		this.postGuildFubenInfo();
	};
	public postGuildFubenInfo() {
	};
	/** 公会副本排名 */
	public doGuildFBRankInfo(bytes: Sproto.sc_guild_raid_ranklist_request) {
		this.rankDatas = [];
		var len = bytes.ranks.length
		for (var i = 0; i < len; i++) {
			let data = bytes.ranks[i]
			if (data.stage < 1) {
				continue
			}
			var info: GuildFBRankInfo = new GuildFBRankInfo();
			info.rank = data.rank
			info.name = data.name
			info.guanka = data.stage
			this.rankDatas.push(info);
		}
		this.rankDatas.sort((lhs, rhs) => {
			return rhs.guanka - lhs.guanka
		})
		for (let i = 0; i < this.rankDatas.length; ++i) {
			this.rankDatas[i].rank = i + 1
		}
		this.postGuildFubenInfo();
	};
	/** 公会副本昨日最高关卡 */
	public doGuildFBMaxGKInfo(bytes: Sproto.sc_guild_raid_ranktop_request) {
		this.isMaxGK = bytes.name != null ? 1 : 0
		if (this.isMaxGK != 0) {
			this.maxName = bytes.name 
			this.maxCareer = 1
			this.maxSex = 0
			this.maxNum = bytes.stage
			this.maxZhuwei = bytes.boost
		}
		this.postGuildFubenInfo();
	};
	/** 公会副本关卡通关人数 */
	public doGuildFBGKInfo(bytes: Sproto.sc_guild_raid_stagerank_request) {

		this._gkDatas = [];

		for (let i = 0; i < bytes.ranks.length; ++i) {
			this._gkDatas.push(bytes.ranks[i].name)
		}
		this.postGuildFubenInfo();
		this.postGuildFubenRoleInfo();
	};
	public postGuildFubenRoleInfo() {
	};

	/**公会信息奖励进度 */
	public doGuildFBRewardInfo(bytes: Sproto.sc_guild_raid_reward_pro_request) {
		// this.rewardNum = bytes.readShort();
		// this.rewardRoleNum = bytes.readShort();
		this.rewardNum = Math.floor(bytes.value/5.0)
		this.postGuildFubenInfo();
	};
	/**下一波怪3秒到达 */
	public postGuildFBBossInfo(bytes: Sproto.sc_guild_raid_starttime_request) {
		GuildFB.ins().bossGKNum = bytes.stage
	};
	/**当前波结束时间 */
	public postGuildFBBossTimerEndInfo(bytes: Sproto.sc_guild_raid_overtime_request) {
		this.bossGKNum = bytes.stage
		this.bossTimer = bytes.time
	};
	/**扫荡结束 */
	public postGuildFBSweepEnd(bytes) {
	};
	public postGuildFBSweep(bytes: Sproto.sc_guild_raid_waveover_request) {
		this.m_ReqWave = null
		this.sweepNum = bytes.wave
	};
	/**请求公会副本排名信息 */
	public sendGuildFBRankInfo() {
		var bytes = this.getBytes(2);
		this.sendToServer(bytes);
	};
	public SendGetGuildFbInfo() {
		this.Rpc(C2sProtocol.cs_guild_raid_info)
	}
	/**请求公会副本昨日最高通关 */
	public sendGuildFBMaxGKInfo() {
		var bytes = this.getBytes(3);
		this.sendToServer(bytes);
	};
	/**请求公会副本关卡人员信息 */
	public sendGuildFBGKRoleInfo(num) {
		// var bytes = this.getBytes(4);
		// bytes.writeShort(num);
		// this.sendToServer(bytes);
		let req = new Sproto.cs_guild_raid_daily_request
		req.index = num
		this.Rpc(C2sProtocol.cs_guild_raid_daily, req)
	};
	/**请求挑战公会副本 */
	public sendGuildFBChallange() {
		this.Rpc(C2sProtocol.cs_guild_raid_attack)
	};

	private m_ReqWave = null

	/**请求扫荡公会副本 */
	public sendGuildFBSweep() {
		let wave = this.sweepNum + 1
		if (this.m_ReqWave == wave) {
			console.log("正在扫荡 " + wave)
			return
		}
		let req = new Sproto.cs_guild_raid_sweep_request
		req.wave = wave
		this.Rpc(C2sProtocol.cs_guild_raid_sweep, req)
	};
	/**请求公会副本助威 */
	public sendGuildFBZhuwei() {
		this.Rpc(C2sProtocol.cs_guild_raid_boost)
	};
	/**请求公会副本通关奖励 */
	public sendGuildFBReward() {
		this.Rpc(C2sProtocol.cs_guild_raid_reward)
	};
	/**是否有按钮可点 */
	public hasbtn() {
		return (GameServer.serverOpenDay > 0 && ((this.sweep == 0 && this.fbNum > 0) || (this.tongguan == 0 && this.rewardNum > 0)));
	};
	public get bossTimerEnd() {
		// return this.bossTimer + egret.getTimer();
		return this.bossTimer
	}
}

MessageCenter.compile(GuildFB);
window["GuildFB"]=GuildFB