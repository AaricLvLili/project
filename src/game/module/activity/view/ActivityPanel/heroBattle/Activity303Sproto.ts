class Activity303Sproto extends BaseSystem {
	public constructor() {
		super();
		this.regNetMsg(S2cProtocol.sc_fuben_coutdown, this.getFbInit);
	}
	static ins(): Activity303Sproto {
		return super.ins();
	}
	public time: number = 0;
	/**获取副本时间信息 */
	private getFbInit(bytes: Sproto.sc_fuben_coutdown_request) {
		this.time = GameServer.serverTime + bytes.time;
	}
}
window["Activity303Sproto"] = Activity303Sproto