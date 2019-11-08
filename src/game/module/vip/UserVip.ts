class UserVip extends BaseSystem {

	lv: number = 0
	exp: number = 0
	state: number = 0

	public constructor() {
		super();
		this.sysId = PackageID.Vip;

		this.regNetMsg(S2cProtocol.sc_vip_update_data, this.doUpdateVipData);
		// this.regNetMsg(S2cProtocol.sc_vip_update_exp, this.doUpdataExp);
		// this.regNetMsg(S2cProtocol.sc_vip_update_state, this.doUpdateVipAwards);
	}

	public static ins(): UserVip {
		return super.ins();
	}

	/**
    * 领取VIP奖励
     * @param lv
     */
	public sendGetAwards(lv) {
		let req = new Sproto.sc_vip_get_awards_request
		req.lv = lv
		this.Rpc(C2sProtocol.sc_vip_get_awards, req)
	};
	/**更新VIP数据 */
	public doUpdateVipData(bytes: Sproto.sc_vip_update_data_request) {
		let oldLv = this.lv
		let oldExp = this.exp
		let oldState = this.state

		this.lv = bytes.lv
		this.exp = bytes.exp
		
		this.state = bytes.state

		if (this.lv != oldLv) {
			GameGlobal.MessageCenter.dispatch(MessageDef.VIP_LEVEL_CHANGE)
		}
		if (this.exp != oldExp) {
			GameGlobal.MessageCenter.dispatch(MessageDef.UPDATA_VIP_EXP)
		}
		// if (this.state != oldState) {
			GameGlobal.MessageCenter.dispatch(MessageDef.UPDATA_VIP_AWARDS)
		// }
	};
	/**更新经验 */
	// public doUpdataExp(bytes) {
	// 	var lv = bytes.readShort();
	// 	this.exp = bytes.readInt();
	// 	GameGlobal.MessageCenter.dispatch(MessageDef.UPDATA_VIP_EXP)
	// 	if (lv > this.lv) {
	// 		this.lv = lv;
	// 		GameGlobal.MessageCenter.dispatch(MessageDef.VIP_LEVEL_CHANGE)
	// 	}
	// };
	// /**更新领取奖励状态 */
	// public doUpdateVipAwards(bytes) {
	// 	this.state = bytes.readInt();

	// 	GameGlobal.MessageCenter.dispatch(MessageDef.UPDATA_VIP_AWARDS)
	// };
	/**获取奖励状态 */
	// public getVipState() {
	// 	var bool = false;
	// 	for (var i = 1; i <= this.lv; i++) {
	// 		if (this.state != undefined && ((this.state >> i) & 1) == 0) {
	// 			bool = true;
	// 			return bool;
	// 		}
	// 	}
	// 	return bool;
	// };

	public GetRewardState(lv: number): boolean {
		if (this.state != null && (this.state >> lv) > 0) {
			return true;
		}
		return false;
	}

	public CheckRedPoint(): boolean {
		var bool = false;
		for (var i = 1; i <= this.lv; i++) {
			if (this.state != undefined && ((this.state >> i) & 1) == 0) {
				bool = true;
				return bool;
			}
		}
		return bool;
	}
}
window["UserVip"]=UserVip