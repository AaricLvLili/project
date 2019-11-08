class GuildRobber extends BaseSystem {

	// robberTotal: number = 0; //强盗总数
	// robberDealNum: number = 0; //强盗被击杀数
	// isUpdateRobber: boolean = true; //是否请求了公会强盗更新

	robberNum: number = 0
	_robberList: Array<RobberStartInfo> = []
	// robberStart: number;
	// robberType: number;
	robberChanllge: number = 0

	public static ins(): GuildRobber {
		return super.ins()
	}

	public constructor() {
		super();

		this.sysId = PackageID.GuildRobber;
		this.regNetMsg(S2cProtocol.sc_guild_robber_info, this.doGuildRobberInfo);
		// this.regNetMsg(2, this.doGuildRobberStarts);
		// this.regNetMsg(3, this.doGuildRobberSX);
		this.regNetMsg(S2cProtocol.sc_guild_robber_actor_info, this.doGuildRobberChangller);
		this.regNetMsg(S2cProtocol.sc_guild_robber_notice, this._DoRobberNotice);
		this.regNetMsg(S2cProtocol.sc_guild_robber_update, this._DoRobberUpdate);

	}

	public Init() {
		this._robberList = []
		let config = GlobalConfig.robberfbconfig
		let pos = 1
		for (let configData of config.robberList) {
			let info = new RobberStartInfo()
			info.robberStart = GuildRobberState.DEAD
			info.pos = pos
			info.robberType = config.robberList[pos - 1]
			this._robberList[info.pos - 1] = info
			++pos
		}
	}

	/**强盗状态列表 RobberStartInfo*/
	public getRobberList(index = -1): RobberStartInfo | RobberStartInfo[] {
		return index == -1 ? this._robberList : this._robberList[index];
	};

	public GetRobberList(): RobberStartInfo[] {
		return this._robberList
	}

	/** 公会强盗信息 */
	public doGuildRobberInfo(bytes: Sproto.sc_guild_robber_info_request) {
		// var _this = GuildRobber.ins();
		// this.robberNum = bytes.readByte();
		// if (this.robberNum > 0) {
		// 	this.robberTotal = bytes.readByte();
		// 	this.robberDealNum = bytes.readByte();
		// 	this._robberList = [];
		// 	for (var i = 0; i < this.robberTotal; i++) {
		// 		var info = new RobberStartInfo();
		// 		info.robberStart = bytes.readByte();
		// 		info.robberType = bytes.readByte();
		// 		this._robberList.push(info);
		// 	}
		// }
		this._robberList = []
		let config = GlobalConfig.robberfbconfig
		for (let data of bytes.robbers) {
			let info = new RobberStartInfo()
			info.robberStart = data.status
			info.pos = data.pos
			info.robberType = config.robberList[data.pos - 1]
			this._robberList[info.pos - 1] = info;

			if(info.robberStart == undefined)
			{
				let s ="=>S2C公会强盗信息索引=>" +　(info.pos-1) + "=>robberStart状态为NULL";
				Main.errorBack(s);
			}
		}
		this.robberNum = this._robberList.length
		this.postGuildRobberInfo();
	};
	public postGuildRobberInfo() {
	};
	/** 公会强盗状态改变 */
	// public doGuildRobberStarts(bytes) {
	// 	var index = bytes.readByte();
	// 	if (this._robberList.length > 0) {
	// 		var info = this._robberList[index - 1];
	// 		info.robberStart = bytes.readByte();
	// 	}
	// 	this.robberDealNum = bytes.readByte();
	// 	this.postGuildRobberInfo();
	// };
	/** 公会强盗刷新 */
	// public doGuildRobberSX(bytes) {
		// this.robberNum = bytes.readByte();

		// console.warn("-----------------------	public doGuildRobberSX(bytes) {")
		// if (ViewManager.ins().getView(GuildMap)) {
		// 	this.sendRobberInfo();
		// }
		// else
		// 	this.isUpdateRobber = true;
	// };
	/** 公会强盗挑战次数 */
	public doGuildRobberChangller(bytes: Sproto.sc_guild_robber_actor_info_request) {
		this.robberChanllge = bytes.times || 0
	};
	/** 请求强盗信息*/
	public sendRobberInfo() {
		this.Rpc(C2sProtocol.cs_guild_robber_info)
	};
	/** 请求强盗挑战*/
	public sendRobberChanger(num) {
		let req = new Sproto.cs_guild_robber_attack_request
		req.pos = num
		this.Rpc(C2sProtocol.cs_guild_robber_attack, req)
	};

	private m_RobberNotice: Sproto.sc_guild_robber_notice_request

	public GetRobberNotice(): Sproto.sc_guild_robber_notice_request {
		return this.m_RobberNotice
	}

	private _DoRobberNotice(rsp: Sproto.sc_guild_robber_notice_request) {
		this.m_RobberNotice = rsp
		GameGlobal.MessageCenter.dispatch(MessageDef.GUILD_ROBBER_NOTICE)
	}

	public _DoRobberUpdate(rsp: Sproto.sc_guild_robber_update_request) {
		let info = this._robberList[rsp.pos - 1]
		if (info) {
			info.robberStart = rsp.status
		} else {
			let config = GlobalConfig.robberfbconfig
			let info = new RobberStartInfo()
			info.robberStart = rsp.status
			info.pos = rsp.pos
			info.robberType = config.robberList[rsp.pos - 1]
			this._robberList[rsp.pos - 1] = info
		}
		this.postGuildRobberInfo();
	}

	/**是否有按钮可点 */
	public hasbtn() 
	{
		if (this._robberList==null || this._robberList.length == 0) {
			return false
		}
		let hasNormal = false
		for (let data of this._robberList) {
			if (data && data.robberStart == GuildRobberState.NORMAL) {
				hasNormal = true
				break
			}
		}
		if (!hasNormal) {
			return false
		}
		if(GlobalConfig.robberfbconfig == null)
			return false;
		return GlobalConfig.robberfbconfig.challengeMax > this.robberChanllge
	};

	public GetRobTotal(): number {
		return this._robberList.length
	}

	public GetRobDeadNum(): number {
		let count = 0
		for (let data of this._robberList) {
			if (data && data.robberStart == GuildRobberState.DEAD) {
				++count
			}
		}
		return count
	}
}

MessageCenter.compile(GuildRobber);
window["GuildRobber"]=GuildRobber