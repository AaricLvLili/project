class RaidMgr extends BaseSystem {
	
	private m_ReliveCd = 0

	public static ins(): RaidMgr {
		return super.ins()
	}

	public constructor() {
		super()
		this.regNetMsg(S2cProtocol.sc_raid_reborn_cd, this._DoRebornCd);
	}

	public DoFbChange() {
		this.m_ReliveCd = 0
	}

	/** 复活时间戳 */
	public GetReliveTimestamp(): number {
		return this.m_ReliveCd
	}

	/** 复活剩余 */
	public GetReliveSurplusTime(): number {
		return Math.max(this.GetReliveTimestamp() - GameServer.serverTime, 0)
	}

	public IsDead(): boolean {
		return this.GetReliveSurplusTime() > 0
	}
	
    private _DoRebornCd(rsp: Sproto.sc_raid_reborn_cd_request): void {
        this.m_ReliveCd = GameServer.serverTime + Math.floor(rsp.cdtime * 0.001)
		BaseRaid.GetRaidByType(GameMap.fbType).DoReliveEvent()
    }
}
window["RaidMgr"]=RaidMgr