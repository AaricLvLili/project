class SyBossSproto extends BaseSystem {
	public constructor() {
		super();
		this.regNetMsg(S2cProtocol.sc_paidboss_res, this.getSyBossInit);
		this.regNetMsg(S2cProtocol.sc_paidboss_setting_res, this.getSyBossSetting);
		this.regNetMsg(S2cProtocol.sc_paidboss_notice_res, this.getSyBossNotice);
	}
	static ins(): SyBossSproto {
		return super.ins();
	}

	/**获取圣域boss初始化信息 */
	private getSyBossInit(bytes: Sproto.sc_paidboss_res_request) {
		let syBossModel = SyBossModel.getInstance;
		syBossModel.syBossRemind = bytes.bossRemind;
		syBossModel.setDic(bytes.boosInfos);
		GameGlobal.MessageCenter.dispatch(SyBossEvt.SYBOSS_DATAUPDATE_MSG);
	}
	/**获取圣域boss提示信息 */
	private getSyBossSetting(bytes: Sproto.sc_paidboss_setting_res_request) {
		let syBossModel = SyBossModel.getInstance;
		syBossModel.syBossRemind = bytes.bossAutoFight;
		GameGlobal.MessageCenter.dispatch(SyBossEvt.SYBOSS_DATAUPDATE_MSG);
	}
	/**获取圣域boss提示公告 */
	private getSyBossNotice(bytes: Sproto.sc_paidboss_notice_res_request) {
		let syBossModel = SyBossModel.getInstance;
		let syBossData = syBossModel.syBossDic.get(bytes.index);
		if (!syBossData) {
			return;
		}
		syBossData.hp = 100;
		syBossData.reliveTime = 0;
		let config = GlobalConfig.ins("PaidBossConfig")[bytes.index];
		if (config) {
			let paidBossConfig = config[0];
			if (paidBossConfig) {
				let monstersConfig = GlobalConfig.ins("MonstersConfig")[paidBossConfig.bossId];
				if (monstersConfig) {
					GameGlobal.MessageCenter.dispatch(MessageDef.HOMEBOSS_REF_MSG, [true, monstersConfig.name]);
				}
			}
		}
	}
	/**圣域boss初始化信息 */
	public sendGetSyBossInitMsg() {
		let rsp = new Sproto.cs_paidboss_req_request;
		this.Rpc(C2sProtocol.cs_paidboss_req, rsp);
	}
	/**圣域boss提示信息 */
	public sendGetSyBossSettingMsg(bossAutoFight: number) {
		let rsp = new Sproto.cs_paidboss_setting_req_request;
		rsp.bossAutoFight = bossAutoFight;
		this.Rpc(C2sProtocol.cs_paidboss_setting_req, rsp);
	}
	/**圣域boss战斗 */
	public sendGetSyBossFight(id: number) {
		let rsp = new Sproto.cs_paidboss_fight_req_request;
		rsp.id = id;
		this.Rpc(C2sProtocol.cs_paidboss_fight_req, rsp);
	}
}
window["SyBossSproto"]=SyBossSproto