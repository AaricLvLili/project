class PrestigeModel extends BaseSystem {
	praises: PraiseData[];
	private static prestigeCommonConfig:any;
	private static prestigeLevelConfig:any;

	public static ins(): PrestigeModel {
		return super.ins()
	}

	public constructor() {
		super()
		this.regNetMsg(S2cProtocol.sc_prestige_uplevel_result, this.DoUpLevelResult);
		this.regNetMsg(S2cProtocol.sc_prestige_rank_topthree, this.doPrestigeRankTopThree);
	}

	private DoUpLevelResult(rsp: Sproto.sc_prestige_uplevel_result_request): void {
		let result = rsp.result
		if (result == 0) {
			GameGlobal.actorModel.prestige_level = GameGlobal.actorModel.prestige_level + 1
		}
		GameGlobal.MessageCenter.dispatch(MessageDef.PRESTIGE_RESULT)
	}

	public SendUpgrade(): void {
		let req = new Sproto.cs_prestige_uplevel_request
		this.Rpc(C2sProtocol.cs_prestige_uplevel)
	}

	private doPrestigeRankTopThree(rsp:Sproto.sc_prestige_rank_topthree_request) {
		this.praises = [];
		rsp.actorList.forEach(element => {
			let praise = new PraiseData;
			praise.parser(element);
			this.praises.push(praise);
		});
		GameGlobal.MessageCenter.dispatch(MessageDef.PRESTIGE_RANK_TOPTHREE)
	}

	public SendPrestigeReqTopthree() {
		GameSocket.ins().Rpc(C2sProtocol.cs_prestige_req_topthree);
	}

	public static CheckRedPoint(): boolean {
		if (!PrestigeModel.Deblocking(true)) {
			return false
		}
        let prestigeLv = GameGlobal.actorModel.prestige_level
        let prestige = GameGlobal.actorModel.prestige

		if(PrestigeModel.prestigeLevelConfig == null)
			PrestigeModel.prestigeLevelConfig = GlobalConfig.ins("PrestigeLevelConfig");
		let preConfigData = PrestigeModel.prestigeLevelConfig[prestigeLv - 1];
		let preValue = preConfigData ? preConfigData.growUpNeed : 0;
		let configData = PrestigeModel.prestigeLevelConfig[prestigeLv];
		let nextConfigData = PrestigeModel.prestigeLevelConfig[prestigeLv + 1];
		if (nextConfigData == null) {
			return false
		}

		if (prestige - preValue >= configData.growUpNeed - preValue) {
			return true
		}
		return false
	}

	public static Deblocking(notTip = false): boolean {
		if(PrestigeModel.prestigeCommonConfig == null)
			PrestigeModel.prestigeCommonConfig = GlobalConfig.ins("PrestigeCommonConfig");

		let lv = PrestigeModel.prestigeCommonConfig.openLevel;
		if (GameGlobal.actorModel.level < lv) {
			if (!notTip) {
				UserTips.ins().showTips(LanguageString.jifengTiaoyueCh(GlobalConfig.jifengTiaoyueLg.st101424,[lv]))
			}
			return false;
		}
		return true
	}
}
window["PrestigeModel"]=PrestigeModel