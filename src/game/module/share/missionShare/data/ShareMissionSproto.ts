class ShareMissionSproto extends BaseSystem {
	public constructor() {
		super();
		this.regNetMsg(S2cProtocol.sc_share_Help_result, this.getPetInit);
	}
	static ins(): ShareMissionSproto {
		return super.ins();
	}

	/**分享任务 */
	private getPetInit(bytes: Sproto.sc_share_Help_result_request) {
		let shareMissionModel: ShareMissionModel = ShareMissionModel.getInstance;
		shareMissionModel.missionShareId = bytes.id;
		shareMissionModel.missionShareState = bytes.state;
		GameGlobal.MessageCenter.dispatch(ShareEvt.SHARE_MISSION_MSG);
	}

	/**分享任务 */
	public sendShareMission(id: number) {
		let rsp = new Sproto.cs_share_Help_request;
		rsp.id = id;
		this.Rpc(C2sProtocol.cs_share_Help, rsp);
	}

}
window["ShareMissionSproto"] = ShareMissionSproto