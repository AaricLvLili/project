class GuildWar extends BaseSystem {

	// pointInfo: PointRewarddInfo
	weixieList: any[] = []
	canPlayList: any[] = []
	private m_MyGuildNum = 0
	// myRankList: any[] = []

	rankList: any[] = []

	private m_ActorData: Sproto.sc_gdwar_actor_data_request

	private m_PreClickTime = 0

	public static ins(): GuildWar {
		return super.ins()
	}

	public constructor() {
		super()
		// this.pointInfo = new PointRewarddInfo()
		// this.pointInfo.isCan = false
		// this.pointInfo.id = 1
		// this.pointInfo.point = 0

		this.regNetMsg(S2cProtocol.sc_gdwar_wall_rank, this._DoWallRank)
		this.regNetMsg(S2cProtocol.sc_gdwar_lottery_start, this._DoLotteryStart)
		this.regNetMsg(S2cProtocol.sc_gdwar_lottery_over, this._DoLotteryOver)
		this.regNetMsg(S2cProtocol.sc_gdwar_lottery_point, this._DoLotteryPoint)
		this.regNetMsg(S2cProtocol.sc_gdwar_wall_reward, this._DoWallReward)
		this.regNetMsg(S2cProtocol.sc_gdwar_actor_data, this._DoActorData)
		this.regNetMsg(S2cProtocol.sc_gdwar_attackers, this._DoAttacker)
		this.regNetMsg(S2cProtocol.sc_gdwar_enemies, this._DoEnemies)
		this.regNetMsg(S2cProtocol.sc_gdwar_start_info, this._DoStartInfo)
		this.regNetMsg(S2cProtocol.sc_gdwar_kill_info, this._DoGuildWarKillInfo)
		this.regNetMsg(S2cProtocol.sc_gdwar_city_owner_change, this._DoOwnerChange)
		this.regNetMsg(S2cProtocol.sc_gdwar_attack_change, this._DoChangeAttrHandle)
		this.regNetMsg(S2cProtocol.sc_gdwar_flag_data, this._DoUpdateFlagData)
		this.regNetMsg(S2cProtocol.sc_gdwar_reward, this._DoFinishReward)
		this.regNetMsg(S2cProtocol.sc_gdwar_base_info, this._DoGuildBaseInfo)
		this.regNetMsg(S2cProtocol.sc_gdwar_flag_notice, this._DoFlagNotice)
		this.regNetMsg(S2cProtocol.sc_gdwar_guild_group, this._kFguildGroupInfoRep)
		this.regNetMsg(S2cProtocol.sc_guildwar_kffz_info, this._kFLastGroupingInfoRep)

		GameGlobal.MessageCenter.addListener(MessageDef.FUBEN_CHANGE, this._DoCheckShowUI, this)
	}

	private _DoCheckShowUI() {
		if (this.checkinAppoint()) {
			ViewManager.ins().open(GuildWarInfoPanel)
			if (this.checkinAppoint(1) && !this.IsDoorDie()) {
				ViewManager.ins().open(GuildWarGateBloodPanel)
			} else {
				ViewManager.ins().close(GuildWarGateBloodPanel)
			}
			if (ViewManager.ins().isShow(GuileWarReliveWin)) {
				let view = ViewManager.ins().getView(GuileWarReliveWin) as GuileWarReliveWin
				if (view) {
					if (view.type != 2) {
						ViewManager.ins().close(GuileWarReliveWin)
					}
				}
			}
		} else {
			ViewManager.ins().close(GuildWarInfoPanel)
			ViewManager.ins().close(GuildWarGateBloodPanel)
			ViewManager.ins().close(GuileWarReliveWin)
		}
	}

	/** PROTO */

	/**跨服公会战进入城墙8000*/
	public SendKFjoinWar() {
		let req = new Sproto.cs_gdwar_enter_cross_request;
		req.warType = 1;
		this.Rpc(C2sProtocol.cs_gdwar_enter_cross, req)
	}

	/**单服公会战进入城墙*/
	public SendJoinWar() {
		this.SendEnterCityType(1)
	}

	/** 进入城内 */
	public SendEnterCity() {
		this.SendEnterCityType(2)
	}

	// 进入殿前
	public SendEnterPalace() {
		this.SendEnterCityType(3)
	}

	// 进入内殿
	public SendEnterKing() {
		this.SendEnterCityType(4)
	}

	/**加入公会战 1 进入城墙 2 进入城内 3 进入外殿 4 进入内殿8001*/
	public SendEnterCityType(type: number): void {
		let req = new Sproto.cs_gdwar_enter_city_request
		req.index = type
		this.Rpc(C2sProtocol.cs_gdwar_enter_city, req)
	}

	public SendNextMap() {
		if (GameMap.IsNoramlLevel()) {
			return false
		}
		let nextLevel = null
		let fbId = GameMap.fubenID
		var config;
		if (this.guildWarStartType == 1)
			config = GlobalConfig.ins("GuildBattleLevel1");
		else if (this.guildWarStartType == 2)
			config = GlobalConfig.ins("GuildBattleLevel2");
		else
			config = GlobalConfig.ins("GuildBattleLevel");

		for (var key in config) {
			let configData = config[key]
			if (configData.fbId == fbId) {
				nextLevel = configData.nextLevel
				break
			}
		}
		if (nextLevel) {
			switch (nextLevel) {
				case 2: this.SendEnterCity(); break
				case 3: this.SendEnterPalace(); break
				case 4: this.SendEnterKing(); break
				default:
					console.log("GuildWar.SendNextMap not nextLevel ", nextLevel)
					break
			}
		} else {
			console.log("GuildWar.SendNextMap nextLevel == null")
		}
	}

	public SendExitFb() {
		this.Rpc(C2sProtocol.cs_gdwar_leave)
	}

	// 刷新玩家列表
	public SendUpdate() {
		this.Rpc(C2sProtocol.cs_gdwar_update)
	}

	// 攻击怪物
	public SendAttackMonster() {
		this.Rpc(C2sProtocol.cs_gdwar_attack_monster)
	}

	// 攻击玩家
	public SendAttackPlayer(dbid) {
		let req = new Sproto.cs_gdwar_attack_player_request
		req.dbid = dbid
		this.Rpc(C2sProtocol.cs_gdwar_attack_player, req)
		this.m_PreClickTime = GameServer.serverTime
	}

	private _DoActorData(rsp: Sproto.sc_gdwar_actor_data_request) {
		let oldDoorState = this.IsDoorDie()
		let oldPoint = this.m_ActorData ? this.m_ActorData.point : null
		this.m_ActorData = rsp
		if (this.IsDoorDie()) {
			ViewManager.ins().close(GuildWarGateBloodPanel)
		}
		if (this.IsDoorDie() != oldDoorState) {
			GameGlobal.MessageCenter.dispatch(MessageDef.GUILD_WAR_DOORSTATU_CHANGE)
		}
		if (oldPoint && this.GetMyPoint() != oldPoint) {
			var t = this.GetMyPoint() - oldPoint
			t > 0 && UserTips.InfoTip(GlobalConfig.jifengTiaoyueLg.st101534 + " " + t + GlobalConfig.jifengTiaoyueLg.st101037)
			GameGlobal.MessageCenter.dispatch(MessageDef.GUILDWAR_POINT_UPDATE)
		}
		GameGlobal.MessageCenter.dispatch(MessageDef.GUILDWAR_ACTOR_UPDATE)
	}

	/**公会战开始信息8005*/
	private _DoStartInfo(rsp: Sproto.sc_gdwar_start_info_request) {
		//遗迹争霸
		if (rsp.warType == undefined || rsp.warType == 0)
			this.isWatStart = rsp.isWarStart;
		else
			this.kFisWatStart = rsp.isWarStart;

		this.acEndTime = rsp.endTime;
		this.guildWarStartType = rsp.warType;

		GameGlobal.MessageCenter.dispatch(MessageDef.GUILDWAR_STARTSTATU_CHANGE);
	}

	/**可攻击列表 2秒刷新8001*/
	private _DoAttacker(rsp: Sproto.sc_gdwar_attackers_request) {
		var flg: boolean;
		for (var info of rsp.datas) {
			if (info.actorId == this.attHandle) {
				flg = true;
				break
			}
		}
		if (!flg) this.attHandle = 0;

		this.canPlayList = rsp.datas
		this.m_MyGuildNum = rsp.nums
		GameGlobal.MessageCenter.dispatch(MessageDef.GUILD_WAR_UPDATE_TARGETS)
	}

	private _DoEnemies(rsp: Sproto.sc_gdwar_enemies_request) {
		this.weixieList = rsp.datas
		GameGlobal.MessageCenter.dispatch(MessageDef.GUILD_WAR_UPDATE_ENEMIES)
	}

	private _DoWallRank(rsp: Sproto.sc_gdwar_wall_rank_request) {
		GuildWarGateBloodPanel.Update(rsp)
	}

	private gateLotteryItemConfig: any;
	/**击破护盾抽奖开始返回8102*/
	private _DoLotteryStart() {

		if (this.guildWarStartType == 1)
			this.gateLotteryItemConfig = GlobalConfig.ins("GuildBattleConst1");
		else if (this.guildWarStartType == 2)
			this.gateLotteryItemConfig = GlobalConfig.ins("GuildBattleConst2");
		else
			this.gateLotteryItemConfig = GlobalConfig.ins("GuildBattleConst");

		ZsBoss.ins().lotteryItemId = this.gateLotteryItemConfig.gateLotteryItem.id
		ViewManager.ins().open(ZSBossLotteryWin, 1)
	}

	private _DoLotteryOver(rsp: Sproto.sc_gdwar_lottery_over_request) {
		GameGlobal.MessageCenter.dispatch(MessageDef.ZS_BOSS_LOTTERY_MAX_POINT, rsp.name, rsp.point)
	}

	private _DoLotteryPoint(rsp: Sproto.sc_gdwar_lottery_point_request) {
		GameGlobal.MessageCenter.dispatch(MessageDef.ZS_BOSS_GETMY_LOTTERY_POINT, rsp.point)
	}

	private _DoWallReward(rsp: Sproto.sc_gdwar_wall_reward_request) {
	}

	private m_KillData: Sproto.sc_gdwar_kill_info_request = null
	/**被玩家击杀返回8007*/
	private _DoGuildWarKillInfo(rsp: Sproto.sc_gdwar_kill_info_request) {
		this.m_KillData = rsp
		ViewManager.ins().open(GuileWarReliveWin, 2, rsp.cd)
	}

	private m_CityOwner: Sproto.sc_gdwar_city_owner_change_request

	private _DoOwnerChange(rsp: Sproto.sc_gdwar_city_owner_change_request) {
		this.m_CityOwner = rsp
		GameGlobal.MessageCenter.dispatch(MessageDef.GUILD_WAR_CITYOWN_CHANGE)
	}

	/**被攻击者的id*/
	private attHandle: number = 0
	/**攻击对象改变8009*/
	public _DoChangeAttrHandle(rsp: Sproto.sc_gdwar_attack_change_request) {
		if (this.GetAttHandle() != rsp.handle) {
			this.attHandle = rsp.handle
			EntityManager.ins().showHideSomeOne(this.attHandle)
			// GameGlobal.MessageCenter.dispatch(MessageDef.GUILDWAR_WEIXIE_CHANGE, !0)
		}
	}

	private m_FlagData: Sproto.sc_gdwar_flag_data_request = null
	/**工会旗帜数据 每秒更新8401*/
	public _DoUpdateFlagData(rsp: Sproto.sc_gdwar_flag_data_request) {
		this.m_FlagData = rsp

		GameGlobal.MessageCenter.dispatch(MessageDef.GUILDWAR_HUDUN_INFO)
	}

	/**公会战结束信息8006*/
	public _DoFinishReward(rsp: Sproto.sc_gdwar_reward_request) {
		ViewManager.ins().open(GuildWarResultWin, rsp)

		//结束后清除采集者ID
		if (this.m_FlagData) {
			this.m_FlagData.holderId = 0;
		}
	}

	private m_BaseInfo: Sproto.sc_gdwar_base_info_request

	public _DoGuildBaseInfo(rsp: Sproto.sc_gdwar_base_info_request) {
		this.m_BaseInfo = rsp
		GameGlobal.MessageCenter.dispatch(MessageDef.GUILDWAR_UPDATE_BASE_INFO)
	}

	public mFlagNotice: Sproto.sc_gdwar_flag_notice_request = null

	public _DoFlagNotice(rsp: Sproto.sc_gdwar_flag_notice_request) {
		this.mFlagNotice = rsp
		GameGlobal.MessageCenter.dispatch(MessageDef.GUILDWAR_FLAG_NOTICE)
	}

	public SendLotteryStart() {
		this.Rpc(C2sProtocol.cs_gdwar_lottery_start)
	}

	/** 开始采集旗帜 */
	public SendGetFlag() {
		this.Rpc(C2sProtocol.cs_gdwar_click_flag)
	}

	public SendPointGuildWar() {
		this.Rpc(C2sProtocol.cs_gdwar_integral_reward)
	}

	/** PROTO END */

	public HasAttack(): boolean {
		return this.GetAttHandle() > 1
	}

	public GetAttHandle(): number {
		return this.attHandle
	}

	/** 功勋 */
	public GetGongxun(): number {
		if (this.m_ActorData) {
			return this.m_ActorData.feats
		}
		return 0
	}

	/** 工会人数 */
	public GetGuildNum(): number {
		return this.m_MyGuildNum || 0
	}

	/** 工会积分 */
	public GetGuildPoint(): number {
		if (this.m_BaseInfo) {
			return this.m_BaseInfo.guildIntegral
		}
		return 0
	}

	/** 我的积分 */
	public GetMyPoint(): number {
		if (this.m_ActorData) {
			return this.m_ActorData.point
		}
		return 0
	}

	public GetCityOwn(): string {
		return ""
	}

	public IsDoorDie(): boolean {
		if (this.m_ActorData) {
			return this.m_ActorData.cityStatus
		}
		return false
	}

	/** 旗帜状态 */
	public GetFlagStatu(): number {
		if (this.GetFlagStartSurplusTime() > 0) {
			return GuildWarFlagState.NONE
		}
		if (this.m_FlagData) {
			if (this.m_FlagData.holderId == 0) {
				return GuildWarFlagState.CAN_GATHER
			}
			return GuildWarFlagState.GATHER
		}
		return GuildWarFlagState.CAN_GATHER
	}

	public GetFlagName(): string {
		if (this.m_FlagData) {
			return this.m_FlagData.holderName
		}
		return ""
	}

	/** 采集者工会 */
	public GetFlagGuild(): string {
		if (this.m_FlagData) {
			return this.m_FlagData.holderGuild
		}
		return ""
	}

	/** 采集者dbid */
	public GetFlagAcId(): number {
		if (this.m_FlagData) {
			return this.m_FlagData.holderId
		}
		return 0
	}

	public GetFlagSurplusTime(): number {
		if (this.m_FlagData) {
			return Math.max(this.m_FlagData.overTime - GameServer.serverTime, 0)
		}
		return 0
	}

	public GetHudunRate(): number {
		if (this.m_FlagData) {
			return this.m_FlagData.shieldRate
		}
		return 100
	}

	/** 获取旗帜可以开始开采的剩余时间 */
	public GetFlagStartSurplusTime(): number {
		if (this.m_FlagData) {
			return Math.max(this.m_FlagData.openTime - GameServer.serverTime, 0)
		}
		return 0
	}

	// 剩余时间
	public GetSurplusTime(): number {
		return this.acEndTime ? Math.max(this.acEndTime - GameServer.serverTime, 0) : 0
	}

	/** 击杀者名称 */
	public GetKillName(): string {
		if (this.m_KillData) {
			return this.m_KillData.killName
		}
		return ""
	}

	/** 击杀者工会 */
	public GetKillGuild(): string {
		if (this.m_KillData) {
			return this.m_KillData.killGuild
		}
		return ""
	}

	public GetFrontRank(): Sproto.gdwar_guild_info[] {
		if (this.m_BaseInfo) {
			return this.m_BaseInfo.datas as any
		}
		return []
	}

	public CanClick(): boolean {
		return this.m_PreClickTime + 1 <= GameServer.serverTime
	}

	getMapLevelInfo() {
		var fubenId = GameMap.fubenID;

		let config: any;
		if (this.guildWarStartType == 1)
			config = GlobalConfig.ins("GuildBattleLevel1");
		else if (this.guildWarStartType == 2)
			config = GlobalConfig.ins("GuildBattleLevel2");
		else
			config = GlobalConfig.ins("GuildBattleLevel");

		let i = 1
		for (var key in config) {
			fubenId == config[key].fbId && (i = config[key].id);
		}
		return config[i]
	}

	getNextMapName(e = 1) {
		var t = GameMap.fubenID
		let config: any;
		if (this.guildWarStartType == 1)
			config = GlobalConfig.ins("GuildBattleLevel1");
		else if (this.guildWarStartType == 2)
			config = GlobalConfig.ins("GuildBattleLevel2");
		else
			config = GlobalConfig.ins("GuildBattleLevel");

		let i = 1;
		for (var r in config)
			if (t == config[r].fbId) {
				if (1 != e) return config[r].name;
				i = config[r].id < 4 ? config[r].id + 1 : config[r].id - 1
			}
		return config[i].name
	}

	public static GetMapName(mapId) {
		var config: any;
		if (GuildWar.ins().guildWarStartType == 1)
			config = GlobalConfig.ins("GuildBattleLevel1");
		else if (GuildWar.ins().guildWarStartType == 2)
			config = GlobalConfig.ins("GuildBattleLevel2");
		else
			config = GlobalConfig.ins("GuildBattleLevel");

		for (var r in config) {
			if (config[r].id == mapId) {
				return config[r].name
			}
		}
		return ""
	}

	getIntoNextMapGongxun() {
		var e = GameMap.fubenID
		var config: any;
		if (this.guildWarStartType == 1)
			config = GlobalConfig.ins("GuildBattleLevel1");
		else if (this.guildWarStartType == 2)
			config = GlobalConfig.ins("GuildBattleLevel2");
		else
			config = GlobalConfig.ins("GuildBattleLevel");

		let i = 1;
		for (var n in config)
			if (e == config[n].fbId) {
				if (!(config[n].id < 4)) return 0;
				i = config[n].id + 1
			}
		return config[i].feats
	}

	checkinAppoint(id = 0, greater = false) {
		if (GameMap.IsNoramlLevel()) {
			return false
		}
		let fbId = GameMap.fubenID
		var config: any;
		if (this.guildWarStartType == 1)
			config = GlobalConfig.ins("GuildBattleLevel1");
		else if (this.guildWarStartType == 2)
			config = GlobalConfig.ins("GuildBattleLevel2");
		else
			config = GlobalConfig.ins("GuildBattleLevel");

		for (var key in config) {
			let configData = config[key]
			if (configData.fbId == fbId) {
				if (id == 0) {
					return true
				}
				if (greater && configData.id > id) {
					return true
				} else {
					if (configData.id == id) {
						return true
					}
					return false
				}
			}
		}
		return false
	}

	public GetCurPointRewardId(): number {
		if (this.m_ActorData) {
			return (this.m_ActorData.step || 1)
		}
		return 1
	}

	public CanReward(): boolean {
		let configData = this.getMyPointReward()
		if (!configData) {
			return false
		}
		return this.GetMyPoint() >= configData.integral;
	}

	getMyPointReward() {
		var configData;
		var config;

		if (this.guildWarStartType == 1)
			config = GlobalConfig.ins("GuildBattlePersonalAward1");
		else if (this.guildWarStartType == 2)
			config = GlobalConfig.ins("GuildBattlePersonalAward2");
		else
			config = GlobalConfig.ins("GuildBattlePersonalAward");

		for (var key in config) {
			configData = config[key]
			if (configData.id == this.GetCurPointRewardId()) {
				return configData
			}
		}
		return null
	}

	getCdByType(e) {
		if (GameMap.IsNoramlLevel()) return 0;
		var config: any;
		if (this.guildWarStartType == 1)
			config = GlobalConfig.ins("GuildBattleLevel1");
		else if (this.guildWarStartType == 2)
			config = GlobalConfig.ins("GuildBattleLevel2");
		else
			config = GlobalConfig.ins("GuildBattleLevel");

		for (var i in config)
			if (config[i].fbId == GameMap.fubenID && (1 == e || 3 == e)) return config[i].switchSceneCd;
		return 0
	}

	/**公会战结束的时间*/
	private acEndTime = 0
	/**遗迹争霸是否开启*/
	public isWatStart = false
	/**跨服争霸是否开启*/
	public kFisWatStart = false
	/**公会战开始类型：0遗迹1小组2决赛*/
	public guildWarStartType = 0

	private guildBattleConst: any;
	/**获取遗迹争霸是否开启*/
	getIsShowGuildWarBtn() {
		return this.isWatStart;
	}

	/**获取跨服争霸是否开启*/
	getIsShowKfGuildWarBtn() {
		return this.kFisWatStart;
	}

	public GetOpenTime(config: any): number {
		let openServerDay = 4
		let openServerTime = 20
		let openWeek = 5
		let openTime = 20
		try {
			if (config.openServer) {
				openServerDay = config.openServer.day
				openServerTime = config.openServer.hours
			}
			if (config.open) {
				openWeek = config.open.week
				openTime = config.open.hours
			}
		} catch (e) {

		}
		let date = new Date(GameServer.serverTime * 1000)
		if ((GameServer.serverOpenDay == openServerDay && !this._IsTodayEnd(date, openServerTime)) || GameServer.serverOpenDay < openServerDay) {
			// if (GameServer.serverOpenDay <= openServerDay) {
			let serverOpenDate = date.setDate(date.getDate() + openServerDay - GameServer.serverOpenDay)
			date.setHours(openServerTime)
			date.setMinutes(0)
			date.setSeconds(0)
			return date.getTime()
		}
		for (let i = 0; i < 20; ++i) {
			// 开服8天之后，并且等于开始日期，如果是今天，不能结束
			if (GameServer.serverOpenDay + i >= 8 && date.getDay() == openWeek && !(i == 0 && this._IsTodayEnd(date, openTime))) {
				date.setMinutes(0)
				date.setSeconds(0)
				return date.getTime()
			}
			date.setDate(date.getDate() + 1)
		}
		return 0
	}

	/** 是否是今天结束的状态 */
	private _IsTodayEnd(date: Date, time: number): boolean {
		let hours = date.getHours()
		if (hours == time) {
			return date.getMinutes() > 8
		}
		return hours > time
	}

	/**公会战活动中公会操作拦截提示*/
	public OtherOperation(msg: string): boolean {
		if (this.isWatStart) {
			if (msg) {
				UserTips.ErrorTip(GlobalConfig.jifengTiaoyueLg.st101535 + "，" + msg)
			}
			return false
		}

		if (this.kFisWatStart) {
			if (msg) {
				UserTips.ErrorTip(GlobalConfig.jifengTiaoyueLg.st101536 + "，" + msg)
			}
			return false
		}
		return true
	}

	/**遗迹争霸开启时间*/
	setOpenDesc() {
		// if(this.guildBattleConst == null)
		// 	this.guildBattleConst = GlobalConfig.ins("GuildBattleConst");
		// let startTime = this.GetOpenTime(this.guildBattleConst);
		// if (0 == startTime) return "";
		// var e = new Date(startTime);
		// return "每周" + GuildWar.guildWarNumDaXie[e.getDay()] + "20:00开启遗迹争霸";
		return GlobalConfig.jifengTiaoyueLg.st101537;//"首次开服第四天20：00开启遗迹争霸\n 后续每周五20：00开启遗迹争霸";
	}

	/**跨服争霸/小组赛组合开启时间*/
	setAllKFOpenDesc() {
		// let startTime1 = this.GetOpenTime(GlobalConfig.ins("GuildBattleConst1"));
		// let startTime2 = this.GetOpenTime(GlobalConfig.ins("GuildBattleConst2"));
		// var e1 = new Date(startTime1);
		// var e2 = new Date(startTime2);
		// return "每周" + GuildWar.guildWarNumDaXie[e1.getDay()] + "、每" + GuildWar.guildWarNumDaXie[e2.getDay()] + "20:00开启跨服争霸";
		let str: string = DateUtils.isOpenDayPreWeek() ? GlobalConfig.jifengTiaoyueLg.st101538 : GlobalConfig.jifengTiaoyueLg.st101539;//"本周":"下周"; 
		return str + GlobalConfig.jifengTiaoyueLg.st101540 + "\n" + str + GlobalConfig.jifengTiaoyueLg.st101541;
	}

	/**跨服争霸小组赛开启时间*/
	setKF1OpenDesc() {
		// let startTime = this.GetOpenTime(GlobalConfig.ins("GuildBattleConst1"));
		// if (0 == startTime) return "";
		// var e = new Date(startTime);
		// return e.getMonth() + 1 + "月" + e.getDate() + "号(周" + GuildWar.guildWarNumDaXie[e.getDay()] + ")20:00";
		let str: string = DateUtils.isOpenDayPreWeek() ? GlobalConfig.jifengTiaoyueLg.st101538 : GlobalConfig.jifengTiaoyueLg.st101539;//"本周" : "下周";
		return str + GlobalConfig.jifengTiaoyueLg.st101542;//"六20:00开启";
	}

	/**跨服争霸决赛开启时间*/
	setKF2OpenDesc() {
		// let startTime = this.GetOpenTime(GlobalConfig.ins("GuildBattleConst2"));
		// if (0 == startTime) return "";
		// var e = new Date(startTime);
		// return e.getMonth() + 1 + "月" + e.getDate() + "号(周" + GuildWar.guildWarNumDaXie[e.getDay()] + ")20:00"
		let str: string = DateUtils.isOpenDayPreWeek() ? GlobalConfig.jifengTiaoyueLg.st101538 : GlobalConfig.jifengTiaoyueLg.st101539;//"本周" : "下周";
		return str + GlobalConfig.jifengTiaoyueLg.st101543;//"日20:00开启";
	}

	getMyPointRankReward(point, warType) {
		var config: any;
		if (warType == 1)
			config = GlobalConfig.ins("GuildBattlePersonalRankAward1");
		else if (warType == 2)
			config = GlobalConfig.ins("GuildBattlePersonalRankAward2");
		else
			config = GlobalConfig.ins("GuildBattlePersonalRankAward");

		for (var i in config) {
			if (config[i].rank == point) {
				return config[i].award;
			}
		}
		return []
	}

	public guildRankRewardType: number;
	creatGuildRankReward(rank: number, id = -1) {
		var cfg: any;
		if (this.guildRankRewardType == 1)
			cfg = GlobalConfig.ins("GuildBattleDistributionAward1");
		else if (this.guildRankRewardType == 2)
			cfg = GlobalConfig.ins("GuildBattleDistributionAward2");
		else
			cfg = GlobalConfig.ins("GuildBattleDistributionAward");

		this.rewardList = [];
		var config = cfg[rank];
		for (var key in config) {
			if (key == id + "") {
				return config[key].awardShow;
			}
			var showlist = config[key].awardShow;
			for (let key2 in showlist) {
				this.checkIsHave(showlist[key2])
			}
		}
		return this.rewardList
	}

	checkIsHave(award) {
		var state = false
		for (let len = this.rewardList.length, i = 0; len > i; i++) {
			var data = this.rewardList[i];
			if (data.id == award.id && data.type == award.type) {
				state = true
				this.rewardList[i].count += award.count
			}
		}
		state || this.rewardList.push(award)
	}

	creatGuildRewardList(warType: number = 0) {
		if (this.configList) {
			return this.configList;
		}
		this.configList = [];
		var config: any;
		if (warType == 1)
			config = GlobalConfig.ins("GuildBattleDistributionAward1");
		else if (warType == 2)
			config = GlobalConfig.ins("GuildBattleDistributionAward2");
		else
			config = GlobalConfig.ins("GuildBattleDistributionAward");

		for (var key in config) {
			if (-1 == this.configList.lastIndexOf(config[key][0].rank)) {
				this.configList.push(config[key][0].rank);
			}
		}
		return this.configList
	}

	private dataList = null
	private configList = null
	private rewardList = null

	//-------------------------跨服战新增协议--------------------------------------------------------------------
	/**请求跨服分组信息8012*/
	public sendKFguildGroupInfo(): void {
		this.Rpc(C2sProtocol.cs_gdwar_guild_get_group);
	}

	/**跨服分组信息返回8014*/
	private _kFguildGroupInfoRep(rsp: Sproto.sc_gdwar_guild_group_request): void {
		GameGlobal.MessageCenter.dispatch(MessageDef.KF_GUILD_GROUPING_INFO, rsp);
	}

	/**请求历界跨服小组赛信息4125*/
	public sendKFLastGroupingInfo(): void {
		this.Rpc(C2sProtocol.cs_guildwar_get_kffz_info);
	}

	/**历界跨服小组赛信息返回4125*/
	private _kFLastGroupingInfoRep(rsp: Sproto.sc_guildwar_kffz_info_request): void {
		GameGlobal.MessageCenter.dispatch(MessageDef.KF_GUILD_LAST_GROUPING_INFO, rsp);
	}
}


window["GuildWar"] = GuildWar