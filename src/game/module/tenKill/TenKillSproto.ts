class TenKillSproto extends BaseSystem {
	public constructor() {
		super();
		this.regNetMsg(S2cProtocol.sc_shiliansha_send_bufffs, this.getBuffMsg);
		this.regNetMsg(S2cProtocol.sc_shiliansha_send_info, this.getTenKillMsg);
		this.regNetMsg(S2cProtocol.sc_shiliansha_send_relute, this.getTenKillFBResult);
		this.regNetMsg(S2cProtocol.sc_shiliansha_send_enemyhp, this.getTenKillHp);
	}
	static ins(): TenKillSproto {
		return super.ins();
	}
	/**获取副本信息 */
	public sendGetTenKillMsg() {
		let rsp = new Sproto.cs_shiliansha_send_info_request;
		this.Rpc(C2sProtocol.cs_shiliansha_send_info, rsp);
	}
	/**请求购买buff */
	public sendGetTenKillBuyBuff(index: number) {
		let rsp = new Sproto.cs_shiliansha_send_buy_buff_request;
		rsp.index = index;
		this.Rpc(C2sProtocol.cs_shiliansha_send_buy_buff, rsp);
		let config = GlobalConfig.ins("PropertyLibraryConfig");
		let tips = "<font color='#00FF3F'>" + config[1].tips2 + "</font>";
		WarnWin.show(tips, null, this, null, null, "sure");
	}
	/**请求获取buff列表 */
	public sendGetTenKillBuffList() {
		let rsp = new Sproto.cs_shiliansha_send_buff_request;
		this.Rpc(C2sProtocol.cs_shiliansha_send_buff, rsp);
	}
	/**请求进入副本 */
	public sendGetTenKillToGo() {
		let rsp = new Sproto.cs_shiliansha_send_enter_request;
		this.Rpc(C2sProtocol.cs_shiliansha_send_enter, rsp);
	}
	/**继续副本 */
	public sendContinueFB() {
		let rsp = new Sproto.cs_shiliansha_send_continue_request;
		this.Rpc(C2sProtocol.cs_shiliansha_send_continue, rsp);
	}


	/**获取buff信息 */
	private getBuffMsg(bytes: Sproto.sc_shiliansha_send_bufffs_request) {
		let tenKillModel: TenKillModel = TenKillModel.getInstance;
		tenKillModel.setBuffDic(bytes.buffs);
		GameGlobal.MessageCenter.dispatch(MessageDef.TENKILLBUFF_UPDATE);
	}

	private getTenKillMsg(bytes: Sproto.sc_shiliansha_send_info_request) {
		TenKillModel.getInstance.useCnt = bytes.useCnt;
		TenKillModel.getInstance.winCnt = bytes.winCnt;
		TenKillModel.getInstance.raidType = bytes.raidType;
		GameGlobal.MessageCenter.dispatch(MessageDef.TENKILL_PANEL_UPDATE);
	}

	private getTenKillFBResult(bytes: Sproto.sc_shiliansha_send_relute_request) {
		let relute = bytes.relute
		let config = GlobalConfig.ins("ShiLianShaAwardConfig");
		let tenKillModel = TenKillModel.getInstance;
		let reward: any[] = [];
		if (config) {
			let rewardConfig = config[tenKillModel.winCnt + 1];
			if (rewardConfig) {
				if (tenKillModel.raidType == 2) {
					reward = rewardConfig.challengeAward;
				} else {
					reward = rewardConfig.adventureAward;
				}
			}
		}
		let fun = function () {
			ViewManager.ins().open(LadderWin, 6);
		}
		ViewManager.ins().open(ResultWin, relute, reward, GlobalConfig.jifengTiaoyueLg.st100797, fun);
	}

	private getTenKillHp(bytes: Sproto.sc_shiliansha_send_enemyhp_request) {
		switch (bytes.ctype) {
			case 0:
				TenKillModel.getInstance.myTeamMaxBlood = bytes.dhp;
				break;
			case 1:
				TenKillModel.getInstance.otherTeamMaxBlood = bytes.dhp;
				break;
		}
		GameGlobal.MessageCenter.dispatch(MessageDef.TENKILL_BLOOD_UPDATE);
	}
}
window["TenKillSproto"]=TenKillSproto