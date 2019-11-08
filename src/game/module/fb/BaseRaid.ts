class BaseRaid {

	public mReliveChange: Function = null
	public mReliveChangeObj: any = null

	public constructor() {
		GameGlobal.MessageCenter.addListener(MessageDef.FUBEN_CHANGE, this._DoFbChange, this)
	}

	protected _DoFbChange() {
		// this.mReliveChange = null
		// this.mReliveChangeObj = null
	}

	public DoReliveEvent() {
		if (this.mReliveChange) {
			this.mReliveChange.call(this.mReliveChangeObj)
		}
	}

	// public mClearRole = false

	private m_AutoClear = false

	public set AutoClear(value: boolean) {
		this.m_AutoClear = value
	}

	public get AutoClear(): boolean {
		return this.m_AutoClear
	}

	public ShowRewardPanel(): void {

	}
	
	/** 复活剩余 */
	public GetReliveSurplusTime(): number {
		return Math.max(RaidMgr.ins().GetReliveTimestamp() - GameServer.serverTime, 0)
	}

	/** 自动复活 */
	public AutoRelive() {
        if (this.CheckIsDead()) {
            if (this.m_AutoClear) {
				if (this.CheckIsMoreMoney()) {
                    this.SendReliveCd()
					return false;
				}
				else {
					UserTips.ins().showTips(GlobalConfig.jifengTiaoyueLg.st101699);
					this.m_AutoClear = false;
				}
			}
			return true;
		}
		return false;
    }

	/** 清除CD */
    public SendReliveCd() {
        if (this.CheckIsDead()) {
            // this.Rpc(C2sProtocol.cs_public_relive_cd)
			this._SendReliveCd()
        } else {
            console.log(GlobalConfig.jifengTiaoyueLg.st101741+ " => ", this.GetFbType())
        }
    }

	/** 是否死亡 */
	public CheckIsDead(): boolean {
		return RaidMgr.ins().GetReliveTimestamp() > GameServer.serverTime
	}

	public CheckIsMoreMoney(): boolean {
		return GameLogic.ins().actorModel.yb >= this.GetReliveYb()
	}

	protected _SendReliveCd(): void {
		GameSocket.ins().Rpc(C2sProtocol.sc_raid_clear_cd)
	}

	public GetReliveYb(): number {
		return 0
	}

	/** 副本类型 */
	public GetFbType(): number {
		return 0
	}

	private static _Dict: {[key: number]: BaseRaid} = {}
	private static m_Raid

	public static GetRaidByType(type: number): BaseRaid {
		let raid = this._Dict[type]
		if (!raid) {
			switch (type) {
				case UserFb.FB_TYPE_GUILD_BOSS: raid = new GuildBossRaid(); break
				default:
					// console.log("BaseRaid.GetRaidByType not fount raid type => " + type)
					if (this.m_Raid == null) {
						this.m_Raid = new BaseRaid
					}
					return this.m_Raid
			}
			this._Dict[type] = raid
		}
		return raid
	}
}

class GuildBossRaid extends BaseRaid {

	public constructor() {
		super()
	}

	// public GetReliveTimestamp(): number {
	// 	return GuildBoss.ins().mReliveTime
	// }

	public GetFbType(): number {
		return UserFb.FB_TYPE_GUILD_BOSS
	}

	public GetReliveYb(): number {
		return GlobalConfig.ins("PublicGuildBossBaseConfig").reburnPay
	}

	public ShowRewardPanel(): void {
		ViewManager.ins().open(GuildBossRewardPanel)
	}
}
window["BaseRaid"]=BaseRaid
window["GuildBossRaid"]=GuildBossRaid