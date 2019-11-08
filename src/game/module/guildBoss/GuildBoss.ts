class GuildBoss extends BaseSystem {

	public static ins(): GuildBoss {
		return super.ins()
	}

	public constructor() {
		super()
		this.regNetMsg(S2cProtocol.sc_guild_boss_info, this._DoBossInfo)
		this.regNetMsg(S2cProtocol.sc_guild_boss_call_info, this._DoCallInfo)
		// this.regNetMsg(S2cProtocol.sc_guild_boss_cd, this._DoReliveCd)
	}

	/** PROTO */

	public _DoBossInfo(rsp: Sproto.sc_guild_boss_info_request) {
		let oldEndTime = this.m_Endtime
		this.m_Times = rsp.callNum
		this.m_BossIndex = rsp.index
		this.m_Endtime = rsp.time
		Guild.ins().SetBuildingLevel(GuildBuilding.GUILD_BOSS - 1, rsp.level)
		// 活动由开启到关闭
		if (oldEndTime > GameServer.serverTime && this.m_Endtime <= GameServer.serverTime) {
			if (ViewManager.ins().isShow(GuildBossReadyPanel)) {
				ViewManager.ins().close(GuildBossReadyPanel)
				ViewManager.ins().close(GuildBossCallPanel)
			}
		// 活动由关闭到开启
		} else if (oldEndTime <= GameServer.serverTime && this.m_Endtime > GameServer.serverTime) {
			if (ViewManager.ins().isShow(GuildBossCallPanel)) {
				ViewManager.ins().close(GuildBossCallPanel)
			// 	ViewManager.ins().close(GuildBossReadyPanel)
			}
		}
		//GameGlobal.MessageCenter.dispatch(MessageDef.GUILD_BOSS_OPEN_INFO)
	}

	/*召唤次数*/
	private m_Times = 0

	public times() {
		return this.m_Times
	}
	/*boss等级*/
	private m_BossIndex = 1

	public GetBossIndex() {
		return this.m_BossIndex
	}

	/*BOSS结束时间*/
	private m_Endtime = 0

	public GetSurplusTime() {
		return Math.max(this.m_Endtime - GameServer.serverTime, 0)
	}

	public IsOpen(): boolean {
		if (!Deblocking.Check(DeblockingType.TYPE_18, true)) {
			return false
		}
		return this.GetSurplusTime() > 0
	}

	private m_CallInfo: Sproto.sc_guild_boss_call_info_request = null

	private _DoCallInfo(rsp: Sproto.sc_guild_boss_call_info_request) {
		this.m_CallInfo = rsp
		if (this.m_CallInfo && this.m_CallInfo.rankDatas) {
			this.m_CallInfo.rankDatas.sort(function(lhs: Sproto.guild_boss_rank_data, rhs: Sproto.guild_boss_rank_data) {
				return rhs.value - lhs.value
			})	
		}
		GameGlobal.MessageCenter.dispatch(MessageDef.GUILD_BOSS_CALL_INFO)	
	}

	// public mReliveTime = 0

	// private _DoReliveCd(rsp: Sproto.sc_guild_boss_cd_request) {
	// 	this.mReliveTime = GameServer.serverTime + Math.floor(rsp.cdtime * 0.001)
	// 	GameGlobal.MessageCenter.dispatch(MessageDef.RAID_RELIVE_TIME_GD_BOSS)
	// }

	public SendBossCall() {
		this.Rpc(C2sProtocol.cs_guild_boss_call)
	}

	public SendBossFight() {
		this.Rpc(C2sProtocol.cs_guild_boss_fight)
	}

	public SendGetBossInfo() {
		this.Rpc(C2sProtocol.cs_guild_boss_rank)
	}

	/** PROTO END */

	public GetCallInfo(): Sproto.sc_guild_boss_call_info_request {
		return this.m_CallInfo
	}

	public HpPercent(): number {
		if (this.m_CallInfo) {
			return this.m_CallInfo.hpPercent
		}
		return 100
	}

	public GetMaxCallTimes(): number {
		let lv = Guild.ins().GetBuildingLevel(GuildBuilding.GUILD_BOSS - 1)
		let times = 0
		if (lv) {
			times = GlobalConfig.ins("PublicGuildBossBaseConfig").maxtimes[lv - 1]
		} else {
			times = GlobalConfig.ins("PublicGuildBossBaseConfig").maxtimes[0]
		}
		return times
	}

	public GetMaxCallLv(): number {
		let lv = Guild.ins().GetBuildingLevel(GuildBuilding.GUILD_BOSS - 1)
		let level = 0
		if (lv) {
			level = GlobalConfig.ins("PublicGuildBossBaseConfig").maxlv[lv - 1]
		} else {
			level = GlobalConfig.ins("PublicGuildBossBaseConfig").maxlv[0]
		}
		if (level && level >= 1000) {
			return Math.floor(level * 0.001)
		}
		return level || 1
	}

	/*zy*/
	public GetMaxGuildBossLv(): number {
		let lv = Guild.ins().GetBuildingLevel(GuildBuilding.GUILD_BOSS - 1)
		return GlobalConfig.ins("PublicGuildBossBaseConfig").maxlv[lv - 1]
	}

	public GetMaxCallIndex(): number {
		let roleLvl = GameGlobal.actorModel.level + UserZs.ins().lv* 1000;
		let configMaxLv = this.GetMaxGuildBossLv();
		let config = GlobalConfig.ins("GuildBossConfig")
		let index = 0
		for (let key in config) {
			let configData = config[key]
			let lvl = configData.zsLevel * 1000 + configData.level;
			if (lvl <= roleLvl && lvl <= configMaxLv) {
				index = configData.id
			}
		}
		return index
	}
}
window["GuildBoss"]=GuildBoss