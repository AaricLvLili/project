class ArtifactSproto extends BaseSystem {
	public constructor() {
		super();
		// this.regNetMsg(S2cProtocol.sc_ride_init_res, this.getMountInit);
		this.regNetMsg(S2cProtocol.sc_artifact_datas, this.getArtifactInitData);
		this.regNetMsg(S2cProtocol.sc_artifact_progress_res, this.getUpDateData);
		this.regNetMsg(S2cProtocol.sc_artifact_uplevel_result, this.getUpLvData);
		this.regNetMsg(S2cProtocol.sc_artifact_stone_res, this.getActivateStone);
	}
	static ins(): ArtifactSproto {
		return super.ins();
	}
	/**神器升级信息 */
	public sendArtifactLvUpMsg(id: number, type: number) {
		let rsp = new Sproto.cs_artifact_uplevel_request;
		rsp.id = id;
		rsp.uptype = type;
		this.Rpc(C2sProtocol.cs_artifact_uplevel, rsp);
	}
	/**激活碎片 */
	public sendActivateStone() {
		let rsp = new Sproto.cs_artifact_stone_req_request;
		this.Rpc(C2sProtocol.cs_artifact_stone_req, rsp);
	}
	/**初始化 */
	private getArtifactInitData(bytes: Sproto.sc_artifact_datas_request) {
		let artifactModel = ArtifactModel.getInstance;
		if (bytes.curid != null) {
			artifactModel.curid = bytes.curid;
			artifactModel.conid = bytes.conid;
		} else {
			artifactModel.curid = -1;
			artifactModel.conid = -1;
		}

		artifactModel.setArtufactData(bytes.datas);
		GameGlobal.MessageCenter.dispatch(ArtifactEvt.ARTIFACT_INIT_MSG);
	}
	/**更新 */
	private getUpDateData(bytes: Sproto.sc_artifact_progress_res_request) {
		let artifactModel = ArtifactModel.getInstance;
		if (bytes.curid != null) {
			artifactModel.curid = bytes.curid;
			artifactModel.conid = bytes.conid;
		} else {
			artifactModel.curid = -1;
			artifactModel.conid = -1;
		}
		GameGlobal.MessageCenter.dispatch(ArtifactEvt.ARTIFACT_INIT_MSG);
	}
	/**升级 */
	private getUpLvData(bytes: Sproto.sc_artifact_uplevel_result_request) {
		let artifactModel = ArtifactModel.getInstance;
		let artifactData = artifactModel.artufactDic.get(bytes.data.id);
		if (artifactData.strenglv < bytes.data.strenglv) {
			let artifactsConfig = GlobalConfig.ins("ArtifactsConfig")[bytes.data.id][0];
			if (artifactsConfig) {
				let str = artifactsConfig.effUi;
				let showName = artifactsConfig.artifactsName;
				ViewManager.ins().open(MainNewWin, ResAnimType.TYPE1, 0, [str, showName, 3]);
			}
		}
		artifactData.strenglv = bytes.data.strenglv;
		artifactData.level = bytes.data.level;
		GameGlobal.MessageCenter.dispatch(ArtifactEvt.ARTIFACT_INIT_MSG);
		GameGlobal.MessageCenter.dispatch(ArtifactEvt.ARTIFACT_LVUP_MSG);
	}
	/**激活碎片返回 */
	private getActivateStone(bytes: Sproto.sc_artifact_stone_res_request) {
		let artifactModel = ArtifactModel.getInstance;
		if (bytes.curid != null) {
			artifactModel.curid = bytes.curid;
			artifactModel.conid = bytes.conid;
		} else {
			artifactModel.curid = -1;
			artifactModel.conid = -1;
		}
		GameGlobal.MessageCenter.dispatch(ArtifactEvt.ARTIFACT_INIT_MSG);
		GameGlobal.MessageCenter.dispatch(ArtifactEvt.ARTIFACT_ACTIVATE_MSG);
	}




}
window["ArtifactSproto"] = ArtifactSproto