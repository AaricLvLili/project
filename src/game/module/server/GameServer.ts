class GameServer extends BaseSystem {

	static _serverTime: number = 0;
	static serverOpenDay: number;
	static loginDay: number = 1
	static serverID: number;
	static serverName: string = "";
	/**合服时间*/
	static serverMergeTime: number;

	public mOtherLogin = false

	static ins(): GameServer {
		return super.ins()
	}

	public constructor() {
		super();
		// GameServer.setServerTime(0)
		this.sysId = PackageID.Default;
		this.regNetMsg(S2cProtocol.sc_base_open_day, this.doGetOpenServer);
		this.regNetMsg(S2cProtocol.sc_base_game_time, this.doServerTime);
		this.regNetMsg(S2cProtocol.sc_base_replace_account, this._DoBaseReplaceAccount);
	}
	/** 获取服务器当前时间从1970年开始的(即时)(秒) */
	public static get serverTime() {
		return GameServer._serverTime + Math.floor(egret.getTimer() * 0.001)
	}
	public static setServerTime(t: number) {
		// GameServer._serverTime = DateUtils.formatMiniDateTime(t) - egret.getTimer();
		GameServer._serverTime = t - Math.floor(egret.getTimer() * 0.001)
	};
	public doGetOpenServer(bytes: Sproto.sc_base_open_day_request) {
		GameServer.serverOpenDay = bytes.day
		GameServer.loginDay = bytes.loginDay
		GameGlobal.MessageCenter.dispatch(MessageDef.OPEN_SERVER)
	};
    /**
     * 处理服务器时间
     * 0-14
     * @param bytes
     */
	public doServerTime(bytes: Sproto.sc_base_game_time_request) {
		GameServer.setServerTime(bytes.time);
		GameServer.serverMergeTime = bytes.serverMergeTime;
	};

	public static GetSurplusTime(timestamp: number, format: number = DateUtils.TIME_FORMAT_5, showLength: number = 2) {
		let t = Math.max(0, (timestamp || 0) - this.serverTime)
		// return DateUtils.GetFormatSecond(t, format)
		return DateUtils.getFormatBySecond(t, format, showLength)
	}

	public static GetPkTime(timestamp: number, format: number = DateUtils.TIME_FORMAT_11, showLength: number = 2) {
		let t = Math.max(0, (timestamp || 0) - this.serverTime)
		// return DateUtils.GetFormatSecond(t, format)
		return DateUtils.getFormatBySecond(t, format, showLength)
	}

	public _DoBaseReplaceAccount() {
		this.mOtherLogin = true
		alert("你的账号在其它地方登陆")
		if (SdkMgr.channelid == 4210&&SdkMgr.currSdk == SdkMgr.P_TYPE_7) {
		console.log('退出');
		window["H5API"].logout()//4399顶号
		} else {
		location.reload();
		}
	}
}

MessageCenter.compile(GameServer);
window["GameServer"] = GameServer